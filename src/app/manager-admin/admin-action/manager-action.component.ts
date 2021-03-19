import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {Pager, Pagination} from 'src/app/_models/pager';
import { PaginationService } from 'src/app/services/pagination.service';
import { RoleService } from 'src/app/_services/role.service';
import { MainFunction } from 'src/app/_models/mainFunction';
import { FunctionService } from 'src/app/_services/function.service';
import { Action, ActionRequest } from 'src/app/_models/action';
import { ActionService } from 'src/app/_services/action.service';
@Component({
    selector: 'app-manager-action',
    templateUrl: './manager-action.component.html',
    styleUrls: ['./manager-action.component.scss']
})
export class ManagerActionComponent implements OnInit {
    lstAllFunction: MainFunction[] = []
    actions: Action[]
    actionCode: string
    activePage: number = 1
    pageSize: number = 10
    pager: Pagination
    total_count: any
    pagingStatus: string
    constructor(
        private roleService: RoleService,
        private fb: FormBuilder,
        private paginationService: PaginationService,
        private actionService: ActionService,private functionService: FunctionService) { }
    ngOnInit() {
        this.getAction()
        this.getListAllFunction()
      console.log('wtf')
    }
    getListAllFunction() {
        this.functionService.getAll().subscribe(rs => {
          console.log(rs);
          this.lstAllFunction = rs.items
        })
      }
    getAction() {
        let obj = new ActionRequest()
        obj.functionCode = this.actionCode === undefined ? "" : this.actionCode
        obj.page = this.activePage
        obj.size = this.pageSize
        return this.actionService.getByFunctionCode(obj).subscribe(
            (data) => {
                this.actions = data['items']
                // this.lstAllAction = this.actions
                if (this.actions !== null && this.actions.length > 0) {
                    this.total_count = data.count;
                  this.pager = new Pagination(this.total_count, this.activePage, this.pageSize)
                } else {
                    this.actions = null
                }

            }, error => {
                this.actions = null
            }
        )

    }
    searchAction(functionName: string = '') {
        this.actionCode = functionName;
        this.getAction();
    }
    setActionPage(page: number) {
        this.activePage = page
        if (page < 1 || page > this.pager.pager.totalPages) {
            return;
        }
        this.getAction()
    }
    changePageSize(size: string, index: any) {
        this.pageSize = parseInt(size);
        this.activePage = 1
        this.getAction()
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
