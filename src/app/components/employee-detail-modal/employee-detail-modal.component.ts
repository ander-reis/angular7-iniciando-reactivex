import {Component, OnInit} from '@angular/core';
import {EmployeeService} from '../../services/employee.service';
import {ModalRefService} from '../modal-dynamic/modal-ref.service';
import {Employee} from '../../models';

@Component({
    selector: 'employee-detail-modal',
    templateUrl: './employee-detail-modal.component.html',
    styleUrls: ['./employee-detail-modal.component.scss']
})
export class EmployeeDetailModalComponent implements OnInit {

    employee: Employee;

    constructor(private employeeService: EmployeeService, private modalRef: ModalRefService) {
        this.employee = this.modalRef.context['employee'];
    }

    ngOnInit() {

    }
}
