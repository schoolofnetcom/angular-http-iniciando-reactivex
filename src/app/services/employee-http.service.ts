import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams, HttpResponse} from '@angular/common/http';
import {Employee} from '../models';
import {Observable, throwError} from 'rxjs';
import {NotifyMessageService} from './notify-message.service';
import {catchError, map, tap, first, take} from 'rxjs/operators';

interface ListHttpParams {
    search;
    sort: { column, sort };
    pagination: Pagination;
}

interface Pagination {
    page: number;
    perPage: number;
    total?: number;
}

@Injectable({
    providedIn: 'root'
})
export class EmployeeHttpService {

    private baseUrl = 'http://localhost:3000/employees';

    constructor(private http: HttpClient, private notifyMessage: NotifyMessageService) {
    }

    list({search, sort, pagination}: ListHttpParams): Observable<{ data: Employee[], meta: Pagination }> {
        let filterObj = {
            _sort: sort.column,
            _order: sort.sort,
            _page: pagination.page + '',
            _limit: pagination.perPage + ''
        };

        if (search !== '') {
            filterObj = Object.assign({}, filterObj, {name: search});
        }
        const params = new HttpParams({
            fromObject: filterObj
        });
        return this.http.get<Employee[]>(this.baseUrl, {params, observe: 'response'})
            .pipe(
                first(),
                map(response => {
                    return {
                        data: response.body,
                        meta: {
                            page: pagination.page,
                            perPage: pagination.perPage,
                            total: +response.headers.get('X-Total-Count')
                        }
                    };
                }),
                tap(console.log),
                catchError((responseError) => this.handleError(responseError))
            );
    }

    get(id: number): Observable<Employee> {
        return this.http.get<Employee>(`${this.baseUrl}/${id}`)
            .pipe(
                first(),
                catchError((responseError) => this.handleError(responseError))
            );
    }

    create(data: Employee): Observable<Employee> {
        return this.http.post<Employee>(this.baseUrl, data)
            .pipe(
                first(),
                catchError((responseError) => this.handleError(responseError))
            );
    }

    update(data: Employee): Observable<Employee> {
        return this.http.put<Employee>(`${this.baseUrl}/${data.id}`, data)
            .pipe(
                first(),
                catchError((responseError) => this.handleError(responseError))
            );
    }

    delete(id: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}/${id}`)
            .pipe(
                first(),
                catchError((responseError) => this.handleError(responseError)),
            );
    }

    private handleError(error: HttpErrorResponse) {
        console.log(error);
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            // client-side error
            errorMessage = `Erro: ${error.error.message}`;
        } else {
            switch (error.status) {
                case 404:
                    errorMessage = 'Recurso não encontrado';
                    break;
                default:
                    errorMessage = `Erro: código - ${error.status}<br>, Mensagem: ${error.message}`;
            }
        }
        this.notifyMessage.error('Não foi possível realizar a operação', errorMessage);
        return throwError(error);
    }
}
