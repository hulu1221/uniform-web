import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe, Location } from "@angular/common";
import { CifCondition } from "../../_models/cif";
import { DetailProcess, Process } from "../../_models/process";
import { ErrorHandlerService } from "../../_services/error-handler.service";
import { MissionService } from "../../services/mission.service";
import { IndivCifService } from "../../_services/indiv-cif.service";
import { AccountService } from 'src/app/_services/account.service';
import { AccountModel } from 'src/app/_models/account';
import { AccountAuthorService } from "../../_services/account-author.service";
import { Pagination } from "../../_models/pager";
import { AccountAuthor } from "../../_models/AccountAuthor";
import { AuthorityAccountService } from 'src/app/_services/authority-account.service';
import { ResponseStatus } from 'src/app/_models/response';
import { DialogService } from '../_dialog/dialog.service';
import { DialogComponent } from '../_dialog/dialog.component';
declare var $: any;
@Component({
  selector: 'app-authority',
  templateUrl: './authority-component.html',
  styleUrls: ['./authority-component.scss']
})
export class AuthorityComponent implements OnInit {
  lstAccount: AccountModel[] = [];
  pagination: Pagination = new Pagination();
  activePage: number = 1;
  pageSize: number = 10;
  processId: string
  detailProcess: DetailProcess = new DetailProcess(null)
  roleLogin: any
  checkButtonCreate: boolean
  accountId: string
  response: ResponseStatus
  @ViewChild('appDialog', { static: true }) appDialog: DialogComponent;
  constructor(private router: Router,
    private route: ActivatedRoute,
    private _location: Location,
    private cifService: IndivCifService,
    private accountAuthorService: AccountAuthorService,
    private errorHandler: ErrorHandlerService,
    private authorityService: AuthorityAccountService,
    private dialogService: DialogService,
    private missionService: MissionService,  private datePipe: DatePipe) {
  }
  
  ngOnInit() {
    this.missionService.setLoading(true)
    this.dialogService.register(this.appDialog);
    // this.displayProgressSpinnerInBlock = true
    this.roleLogin = JSON.parse(localStorage.getItem("role"))
    $('.childName').html('Danh sách ủy quyền')
    this.processId = this.route.snapshot.paramMap.get('processId')
    this.accountId = this.route.snapshot.paramMap.get("id")
    this.route.paramMap.subscribe(paramMap => this.getProcessInformation(paramMap.get('processId')))

    // this.getAccountList()
    if (this.roleLogin.includes("UNIFORM.BANK.GDV")) {
      this.checkButtonCreate = true
    }
    this.getAccountAuthorList(this.accountId);

  }

  getAccountAuthorList(accountId: string) {
    this.accountAuthorService.getAccountAuthors(accountId).subscribe(
      data => {
        if (data.items) {
          for (let index = 0; index < data.items.length; index++) {
            let newDateFrom = data.items[index].validFrom !== null ? new Date(data.items[index].validFrom) : null
            let newDateTo = data.items[index].validTo !== null ? new Date(data.items[index].validTo) : null
            let returnDateFrom = newDateFrom !== null ? this.datePipe.transform(newDateFrom, 'dd/MM/yyyy') : null
            let returnDateTo = newDateTo !== null ? this.datePipe.transform(newDateTo, 'dd/MM/yyyy') : null
            data.items[index].validFrom = returnDateFrom
            data.items[index].validTo = returnDateTo
          }
          this.lstAccount = data.items
          this.pagination = new Pagination(data.count, this.activePage, this.pageSize)
          // this.displayProgressSpinnerInBlock = false
          this.missionService.setLoading(false)
        } else {
          this.missionService.setLoading(false)
          this.lstAccount = null
        }
      }
    )
  }
  showDialog(id:any) {
    this.dialogService.show()
      .then((res) => {
        this.deleteAuthority(id)
      })
      .catch((err) => {

      });
  }
  deleteAuthority(id: any) {
    return this.authorityService.delete({ id: id }).subscribe(
      data => {
        if (data.responseStatus) {
          this.response = data.responseStatus
        }
      }
      , error => this.errorHandler.showError(error)
      , () => {
        if (this.response) {
          this.errorHandler.messageHandler(this.response, 'Xóa ủy quyền thành công')
          if (this.response.success == true) {
            this.router.navigate(['./smart-form/manager/authority', { processId: this.processId, id: this.accountId }])
          }
        } else this.errorHandler.showError('Lỗi không xác định')
      }
    )
  }
  getProcessInformation(processId) {
    if (processId) {
      this.processId = processId
      this.cifService.detailProcess(processId).subscribe(data => {
        this.detailProcess = new DetailProcess(data.customer)
        // this.displayProgressSpinnerInBlock = false
        // if (this.detailProcess.statusId == 'E' || this.detailProcess.statusId == 'M') {
        //   this.missionService.setMission('Gửi duyệt')
        // } else this.missionService.setMission('Thông tin duyệt dịch vụ')
      },
        error => {
          this.missionService.setLoading(false)
          this.errorHandler.showError(error)
        },
        () => {
          this.missionService.setLoading(false)
          if (!this.detailProcess.processId) this.errorHandler.showError('Không lấy được thông tin hồ sơ')
        }
      )
      this.missionService.setProcessId(processId)
    }
  }
  //   getAccountList(){
  //     let processId ={}
  //     processId['processId'] = this.processId
  //     this.accountService.getAccountList(processId).subscribe(rs =>{
  //       if( rs.items !==undefined && rs.items.length >0){
  //         this.lstAccount = rs.items
  //       }else{
  //         this.lstAccount = null
  //       }
  //     },err =>{
  //       this.lstAccount = null
  //     })
  //   }
  backPage() {
    $('.childName').html('Danh sách tài khoản')
    // if (this.hiddenAccount && !this.hiddenCreateAccount && !this.hiddenDetailAccount) {
    this._location.back();
    // }
  }
  // eventBack(){
  //   $('.childName').html('Danh sách tài khoản')
  //   this.hiddenAccount = true
  //   this.hiddenCreateAccount = false
  //   this.hiddenDetailAccount = false
  // }
  createAuthority() {
    this.router.navigate(['./smart-form/manager/createAuthority', { processId: this.processId, accountId: this.accountId }]);
    // $('.childName').html('Thêm tài khoản')
    // this.hiddenAccount = false
    // this.hiddenCreateAccount = true
    // this.hiddenDetailAccount = false
    // debugger
    // this.router.navigate(['./smart-form/account/createAccount']);
    // this.child.ngOnInit()
  }
  detailAccount(item: any) {
    this.router.navigate(['./smart-form/manager/detailAuthority', { processId: this.processId, accountId: this.accountId, id: item.id }]);
    // this.router.navigate(['./smart-form/account/detailAccount']);
  }
}
