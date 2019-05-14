import {Component, OnInit} from '@angular/core';
import {ModalRefService} from '../modal-dynamic/modal-ref.service';
import {NotifyMessageService} from '../../services/notify-message.service';
import {Employee} from '../../models';
import {EmployeeHttpService} from '../../services/employee-http.service';
import {Observable} from 'rxjs';

@Component({
    selector: 'employee-delete-modal',
    templateUrl: './employee-delete-modal.component.html',
    styleUrls: ['./employee-delete-modal.component.scss']
})
export class EmployeeDeleteModalComponent implements OnInit {

    employeeId: number;
    employee$: Observable<Employee>;

    constructor(private employeeHttp: EmployeeHttpService, private modalRef: ModalRefService, private notifyMessage: NotifyMessageService) {
        this.employeeId = this.modalRef.context['employeeId'];
    }

    ngOnInit() {
        this.employee$ = this.employeeHttp.get(this.employeeId);
    }

    async destroy() {
        const employee = await this.employee$.toPromise();
        this.employeeHttp.delete(this.employeeId)
             .subscribe(data => {
                 this.modalRef.hide({employee, submitted: true});
                 this.notifyMessage.success('Sucesso', `O empregado <strong>${employee.name}</strong> foi excluído com sucesso`);
             });
    }
}
