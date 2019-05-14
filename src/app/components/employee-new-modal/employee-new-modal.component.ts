import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {EmployeeService} from '../../services/employee.service';
import {InputDirective} from '../../directives/input.directive';
import {ModalRefService} from '../modal-dynamic/modal-ref.service';
import {NotifyMessageService} from '../../services/notify-message.service';
import {Employee} from '../../models';
import {EmployeeHttpService} from '../../services/employee-http.service';

@Component({
    selector: 'employee-new-modal',
    templateUrl: './employee-new-modal.component.html',
    styleUrls: ['./employee-new-modal.component.scss']
})
export class EmployeeNewModalComponent implements OnInit, OnDestroy {

    employee: Employee = {
        name: '',
        salary: 0,
        bonus: 0,
    };

    // @ViewChild(InputDirective)
    // inputName: InputDirective;

    @ViewChild('inputSalary', {read: InputDirective})
    inputName: InputDirective;//ElementRef
    unSubscribeOnShow;

    constructor(private employeeHttp: EmployeeHttpService,
                private employeeService: EmployeeService,
                private modalRef: ModalRefService,
                private notifyMessage: NotifyMessageService) {
    }

    ngOnInit() {
        this.unSubscribeOnShow = this.modalRef.onShow.subscribe(() => {
            console.log(this.inputName);
            this.inputName.focus();
        });
    }

    addEmployee(event) {
        this.employeeHttp.create(this.employee)
            .subscribe(
                data => {
                    this.modalRef.hide({employee: data, submitted: true});
                    this.notifyMessage.success('Sucesso', `O empregado <strong>${this.employee.name}</strong> foi criado com sucesso`);
                }
            );
    }

    ngOnDestroy(): void {
        console.log('employee new modal destruído');
        this.unSubscribeOnShow.unsubscribe();
    }
}
