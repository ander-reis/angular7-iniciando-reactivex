import {Component, OnInit} from '@angular/core';
import {Employee} from '../../models';
import {EmployeeNewModalComponent} from '../employee-new-modal/employee-new-modal.component';
import {EmployeeEditModalComponent} from '../employee-edit-modal/employee-edit-modal.component';
import {ModalService} from '../modal-dynamic/modal.service';
import {EmployeeDeleteModalComponent} from '../employee-delete-modal/employee-delete-modal.component';
import {EmployeeDetailModalComponent} from '../employee-detail-modal/employee-detail-modal.component';
import {EmployeeHttpService} from '../../services/employee-http.service';
import {NotifyMessageService} from '../../services/notify-message.service';


@Component({
    selector: 'employee-list',
    templateUrl: './employee-list.component.html',
    styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {

    employees: Employee[] = [];
    search = '';
    sortColumn = {column: 'name', sort: 'asc'};
    pagination = {
        itemsPerPage: 1,
        currentPage: 1,
        totalItems: 0
    };

    columns = [
        {name: 'name', label: 'Nome', order: true},
        {name: 'salary', label: 'Salário', order: true},
        {label: 'Bonus'},
        {label: 'Ações'},
    ];

    constructor(
        private modalService: ModalService, private employeeHttp: EmployeeHttpService,
        private notifyMessage: NotifyMessageService) {
    }

    ngOnInit() {
        this.getEmployees();
    }

    openDetailModal(employee: Employee) {
        const modalRef = this.modalService
            .create(EmployeeDetailModalComponent, {employee});
        modalRef.show();
    }

    openNewModal() {
        const modalRef = this.modalService.create(EmployeeNewModalComponent);
        modalRef.onHide.subscribe((event) => {
            this.getEmployeesAfterSuccess(event);
        });
        modalRef.show();
    }

    openEditModal(employee: Employee) {
        const modalRef = this.modalService
            .create(EmployeeEditModalComponent, {employeeId: employee.id});
        modalRef.onHide.subscribe((event) => {
            this.getEmployeesAfterSuccess(event);
        });
        modalRef.show();
    }

    openDestroyModal(employee: Employee) {
        const modalRef = this.modalService
            .create(EmployeeDeleteModalComponent, {employeeId: employee.id});
        modalRef.onHide.subscribe((event) => {
            this.getEmployeesAfterSuccess(event);
        });
        modalRef.show();
    }

    getEmployeesAfterSuccess(event) {
        const eventData = event.data;
        if (eventData && eventData.hasOwnProperty('submitted')) {
            this.getEmployees();
        }
    }

    handleSearch(search) {
        this.search = search;
        this.pagination.currentPage = 1;
        this.getEmployees();
    }

    handleSort($event) {
        this.getEmployees();
    }

    handlePagination(page) {
        this.pagination.currentPage = page;
        this.getEmployees();
    }

    getEmployees() {
        this.employeeHttp.list({
            search: this.search,
            sort: this.sortColumn,
            pagination: {
                page: this.pagination.currentPage,
                perPage: this.pagination.itemsPerPage
            }
        })
            .subscribe(data => {
                this.pagination.totalItems = data.meta.total;
                this.pagination.itemsPerPage = data.meta.perPage;
                this.pagination.currentPage = data.meta.page;
                this.employees = data.data; //{data: []}
            });
    }
}
