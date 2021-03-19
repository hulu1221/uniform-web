import { Component, OnInit } from '@angular/core';
import { Role } from 'src/app/_models/role';
import { FormBuilder } from '@angular/forms';
import {Pager, Pagination} from 'src/app/_models/pager';
import { PaginationService } from 'src/app/services/pagination.service';
import { RoleService } from 'src/app/_services/role.service';
import { MainFunction } from 'src/app/_models/mainFunction';
import { FunctionService } from 'src/app/_services/function.service';
@Component({
    selector: 'app-manager-function',
    templateUrl: './manager-function.component.html',
    styleUrls: ['./manager-function.component.scss']
})
export class ManagerFunctionComponent implements OnInit {
    functions: MainFunction[]
    role: Role = new Role()
    activePage: number = 1
    pageSize: number = 10
    pager: Pagination
    total_count: any
    pagingStatus: string
    constructor(
        private roleService: RoleService,
        private fb: FormBuilder,
        private paginationService: PaginationService,
        private functionService: FunctionService) { }
    ngOnInit() {
        this.getAllFunction()
    }

    getAllFunction() {
        let obj = {}
        obj['page'] = this.activePage
        obj['size'] = this.pageSize
        this.functionService.getAllFunction(obj).subscribe((data) => {
            this.functions = data['items'];
            if (this.functions !== null && this.functions.length > 0) {
              this.total_count = data.count;
              this.pager = new Pagination(this.total_count, this.activePage, this.pageSize)
            } else {
                this.functions = null
            }
        }, error => {
            this.functions = null
        });
    }

    setActionPage(page: number) {
        this.activePage = page
        if (page < 1 || page > this.pager.pager.totalPages) {
            return;
        }
        this.getAllFunction()
    }
    changePageSize(size: string, index: any) {
        this.pageSize = parseInt(size);
        this.activePage = 1
        this.getAllFunction()
    }
    getStatusCode(statusCode: string) {
        if (statusCode == 'A') {
            return 'Hoạt động';
        } else if (statusCode == 'I') {
            return 'Không hoạt động';
        } else if (statusCode == 'C') {
            return 'Đóng';
        } else return '';
    }
}
