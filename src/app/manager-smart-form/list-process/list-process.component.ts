import { Component, OnInit } from '@angular/core';
import {Process} from "../../_models/process";
import {IndivCifService} from "../../_services/indiv-cif.service";
import {CifCondition} from "../../_models/cif";
import {PopupConfirmComponent} from "../../_popup/popup-confirm.component";
import {DialogConfig} from "../../_utils/_dialogConfig";
import {MatDialog} from "@angular/material/dialog";
import {Pagination} from "../../_models/pager";
import {CategoryService} from "../../_services/category/category.service";
import {Category, RegisType} from "../../_models/category/category";
import {Router} from "@angular/router";
import {UserService} from "../../_services/user.service";
import {SearchUser, SystemUsers} from "../../_models/systemUsers";
import {ErrorHandlerService} from "../../_services/error-handler.service";
import {ResponseStatus} from "../../_models/response";
declare var $: any;
@Component({
  selector: 'app-list-process',
  templateUrl: './list-process.component.html',
  styleUrls: ['./list-process.component.css']
})
export class ListProcessComponent implements OnInit {
  processList: Process[]
  activePage: number = 1
  pageSize: number = 10
  pagination: Pagination = new Pagination()
  condition: CifCondition = new CifCondition();
  statusList: Category[]
  processStatusList: Category[]
  customerType: Category[]
  branches: Category[]
  regisTypeList: RegisType[]
  userList: SystemUsers[]
  submitted: boolean
  roleLogin: any = []
  isGDV: boolean
  isKSV: boolean
  userInfo: any
  response: ResponseStatus
  constructor(private cifService: IndivCifService,
              private dialog: MatDialog,
              private categoryService: CategoryService,
              private router: Router,
              private userService: UserService,
              private errorHandler: ErrorHandlerService
  ) { }

  ngOnInit(): void {
    $('.parentName').html('Quản lý hồ sơ')
    $('.childName').html('Danh sách hồ sơ')
    this.roleChecker()
    this.getProcessList(this.condition);
    this.newCondition()
    this.getCategoryList()
  }
  roleChecker() {
    this.userInfo = JSON.parse(localStorage.getItem("userInfo"))
    this.roleLogin = JSON.parse(localStorage.getItem("role"))
    for (let i = 0; i < this.roleLogin.length; i++) {
      if (this.roleLogin[i] === "UNIFORM.BANK.GDV") {
        this.isGDV = true
      }else if(this.roleLogin[i] === "UNIFORM.BANK.KSV"){
        this.isKSV = true
      }
    }
    if (this.isGDV) {
      this.condition.inputter = this.userInfo.userName
      this.condition.branchCode = ""
      this.condition.statusId = ""
    }
    if (this.isKSV) {
      this.condition.statusId = 'W'
      this.condition.branchCode = this.userInfo.branchCode
    }
  }
  newCondition() {
    this.condition.customerTypeCode = ""
    this.condition.regisType = ""
  }
  getCategoryList() {
    this.categoryService.getStatus().subscribe(data => this.statusList = data)
    this.categoryService.getProcessStatus().subscribe(data => this.processStatusList = data)
    this.categoryService.getCustomerType().subscribe(data => this.customerType = data)
    this.categoryService.getBranch().subscribe(data => this.branches = data)
    this.categoryService.getRegisType().subscribe(data => this.regisTypeList = data)
    this.userService.getAllUsers(new SearchUser()).subscribe(data => {
      if (data.items) {
        this.userList = data.items
      }
    })
  }
  search() {
    this.submitted = true
    if (this.condition.dateCreatedValidator().valid) {
      this.getProcessList(this.condition)
    }
  }
  conditionBuilder(condition: CifCondition) {
    return new CifCondition(
      condition.page,
      condition.size,
      condition.approveBy,
      condition.branchCode,
      condition.code,
      condition.createdDate ? condition.setFormatDate(condition.createdDate) : null,
      condition.inputDateFrom ? condition.setFormatDate(condition.inputDateFrom) : null,
      condition.inputDateTo ? condition.setFormatDate(condition.inputDateTo) : null,
      condition.customerCode,
      condition.customerTypeCode,
      condition.fullName,
      condition.id,
      condition.inputBy,
      condition.inputter,
      condition.isSlaFailed,
      condition.mobilePhone,
      condition.perDocNo,
      condition.statusId,
      condition.regisType
    )
  }
  getProcessList(condition: CifCondition) {
    this.cifService.getCifList(this.conditionBuilder(condition)).subscribe(
      data => {
        this.response = data.responseStatus
        if (data.items) {
          this.processList = data.items.map(item => new Process(item))
          this.pagination = new Pagination(data.count, this.activePage, this.pageSize)
        } else this.processList = null
      }, error => {
        this.errorHandler.showError(error)
      },() => {
        if (!this.response || this.response.success == false) {
          this.pagination = new Pagination(0, this.activePage, this.pageSize)
          this.errorHandler.showError('Không tìm thấy bản ghi nào')
        }
      }
    )
  }

  changePageSize(size: string) {
    this.pageSize = parseInt(size);
    if (this.pageSize < 0) {return}
    this.activePage = 1
    this.condition.page = 1
    this.condition.size = this.pageSize
    this.getProcessList(this.condition)
  }

  setPage(pageNumber: any) {
    if (pageNumber < 1 || pageNumber > this.pagination.pager.totalPages) {
      return;
    } else {
      this.activePage = pageNumber
      this.condition.page = pageNumber
      this.getProcessList(this.condition)
    }
  }

  detail(processId: string) {
    this.router.navigate(['./smart-form/manager/customer', { processId: processId}]);
  }

  delete(process: Process) {
    process['number'] = 7
    let dialogRef = this.dialog.open(PopupConfirmComponent, DialogConfig.configDialogConfirm(process))
    dialogRef.afterClosed().subscribe(rs => {
        if (rs == 1) {
          this.cifService.deleteProcess(process.id)
            .subscribe(
              data => this.errorHandler.messageHandler(data.responseStatus, "Xóa hồ sơ thành công!")
              ,error => {
                this.errorHandler.showError(error)
              }
            )
          this.getProcessList(this.condition)
        }
      }
    )
  }
  showDelete(process: Process) {
    return process.statusId == 'E'
  }
  dateValidator() {
    return this.condition.dateCreatedValidator()
  }

}
