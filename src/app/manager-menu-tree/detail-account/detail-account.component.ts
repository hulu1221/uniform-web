import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from "@angular/common";
import { MatDialog } from '@angular/material/dialog';
import { DialogConfig } from 'src/app/_utils/_dialogConfig';
import { PopupConfirmComponent } from 'src/app/_popup/popup-confirm.component';
import {MissionService} from "../../services/mission.service";
import {AccountService} from "../../_services/account.service";
import {AccountModel} from "../../_models/account";
import {ErrorHandlerService} from "../../_services/error-handler.service";
import {IndivCifService} from "../../_services/indiv-cif.service";
import {DetailProcess} from "../../_models/process";
import {ResponseStatus} from "../../_models/response";
declare var $: any;
@Component({
  selector: 'app-detail-account',
  templateUrl: './detail-account.component.html',
  styleUrls: ['./detail-account.component.scss']
})
export class DetailAccountComponent implements OnInit {
  constructor(private router: Router, private route: ActivatedRoute, private _location: Location,
              private missionService: MissionService, private dialog: MatDialog, private accountService: AccountService,
              private errorHandler: ErrorHandlerService, private cifService: IndivCifService
  ) {}
  processId: string
  accountId: string
  response: ResponseStatus
  // detail
  detailAccount: AccountModel = new AccountModel()
  detailProcess: DetailProcess = new DetailProcess(null)
  roleLogin:any
  checkButton:boolean
  ngOnInit() {
    $('.childName').html('Chi tiết tài khoản')
    this.processId = this.route.snapshot.paramMap.get('processId')
    this.accountId = this.route.snapshot.paramMap.get('id')
    this.roleLogin = JSON.parse(localStorage.getItem("role"))
    this.getInformation(this.processId, this.accountId)
    this.missionService.setProcessId(this.processId)
    if(this.roleLogin.includes("UNIFORM.BANK.GDV")){
      this.checkButton = !this.checkButton
    }
  }
  getInformation(processId: string, accountId: string) {
    this.getDetailProcessInformation(processId)
    this.getDetailAccountInformation(accountId)
  }
  getDetailAccountInformation(accountId) {
    return this.accountService.getDetailAccount({id: accountId}).subscribe(
      data => {
        this.detailAccount = data.item
      }, error => this.errorHandler.handleError(error)
      ,() => {
        if (!this.detailAccount) {
          this.errorHandler.showError('Không lấy được thông tin chi tiết tài khoản')
          this.detailAccount = new AccountModel()
        }
      }
    )
  }
  getDetailProcessInformation(processId) {
    return this.cifService.detailProcess(processId).subscribe(
      data => {
        this.detailProcess = new DetailProcess(data.customer)
      },error => this.errorHandler.showError(error)
      ,() => {
        if (!this.detailProcess) this.errorHandler.showError('Không lấy được thông tin khách hàng')
      }
    )
  }
  backPage() {
    //  $('.childName').html('Danh sách tài khoản')
    this._location.back();
  }
  createAccount() {
    this.router.navigate(['./smart-form/manager/createAccount', { processId: this.processId }]);
  }
  updateAccount(){
    this.router.navigate(['./smart-form/manager/updateAccount', { processId: this.processId, id: this.accountId }]);
  }
  deleteAccount(){
    let item={}
    item['number'] = 14
    item['code'] = ''
    let dialogRef = this.dialog.open(PopupConfirmComponent, DialogConfig.configDialogConfirmDeleteAccount(item))
    dialogRef.afterClosed().subscribe(rs => {
      if (rs == 1) {
        this.delete(this.accountId)
      }
    }
    )
  }
  delete(accountId) {
    return this.accountService.deleteAccount({id: accountId}).subscribe(
      data => {
        if (data.responseStatus) this.response = data.responseStatus
      },
      error => this.errorHandler.showError(error)
      ,() => {
        if (this.response) {
          this.errorHandler.messageHandler(this.response, 'Xóa tài khoản thành công')
          if (this.response.success == true) this.router.navigate(['./smart-form/manager/account', { processId: this.processId }]);
        }
      }
    )
  }
}
