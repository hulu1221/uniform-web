import { Component, OnInit } from '@angular/core';
import {DetailProcess} from '../../_models/process';
import {ActivatedRoute, Router} from '@angular/router';
import {IndivCifService} from '../../_services/indiv-cif.service';
import {ErrorHandlerService} from '../../_services/error-handler.service';
import {MissionService} from '../../services/mission.service';
import {Location} from '@angular/common';
import {CoOwnerAccountService} from '../../_services/co-owner-account.service';
import {Response, ResponseStatus} from '../../_models/response';
import {CoOwnerAccount} from '../../_models/CoOwnerAccount';
import {AccountModel} from '../../_models/account';
import {AccountService} from '../../_services/account.service';
import {PopupConfirmComponent} from '../../_popup/popup-confirm.component';
import {DialogConfig} from '../../_utils/_dialogConfig';
import {MatDialog} from '@angular/material/dialog';
declare var $: any;
@Component({
  selector: 'app-co-owner-account',
  templateUrl: './co-owner-account.component.html',
  styleUrls: ['./co-owner-account.component.css']
})
export class CoOwnerAccountComponent implements OnInit {
  processId: string
  accountId: string
  coOwnerList: CoOwnerAccount[]
  detailProcess: DetailProcess = new DetailProcess(null)
  response: ResponseStatus
  responseFull: Response
  show: any = {process: false, coOwner: false}
  constructor(private router: Router,
              private dialog: MatDialog,
              private _location: Location,
              private route: ActivatedRoute,
              private cifService: IndivCifService,
              private accountService: AccountService,
              private missionService: MissionService,
              private errorHandler: ErrorHandlerService,
              private coOwnerService: CoOwnerAccountService,
  ) { }

  ngOnInit(): void {
    $('.childName').html('Tài khoản chung')
    $('.click-link').addClass("active")
    this.processId = this.route.snapshot.paramMap.get('processId')
    this.accountId = this.route.snapshot.paramMap.get('id')
    this.missionService.setLoading(true)
    this.route.paramMap.subscribe(paramMap => this.getProcessInformation(paramMap.get('processId')))
    this.getCoOwnerList()
  }
  getProcessInformation(processId) {
    if (processId) {
      this.processId = processId
      this.cifService.detailProcess(processId).subscribe(data => {
          this.detailProcess = new DetailProcess(data.customer)
        },
        error => {
          this.errorHandler.showError(error)
          this.missionService.setLoading(false);
        },
        () => {
          this.show.process = true
          this.checkLoading()
          if (!this.detailProcess.processId) this.errorHandler.showError('Không lấy được thông tin hồ sơ')
        }
      )
      this.missionService.setProcessId(processId)
    }
  }
  getCoOwnerList() {
    this.coOwnerService.list(this.accountId).subscribe(
      data => {
        if (data) {
          this.coOwnerList = data.item;
          this.response = data.responseStatus
        }
      },error => {
        this.errorHandler.showError(error);
        this.missionService.setLoading(false);
      }
      ,() => {
        this.show.coOwner = true
        this.checkLoading()
        if (this.response && this.response.success == false) {
          this.coOwnerList = []
          // this.errorHandler.showError('Không lấy được danh sách đồng sở hữu')
        }
      }
    )
  }
  getDetailCoOwner(coOwnerId: string, customerId: string) {
    this.router.navigate(['./smart-form/manager/co-owner/detail', {
      processId: this.processId,
      id: this.accountId,
      coOwnerId: coOwnerId,
      customerId: customerId
    }]);
  }
  checkLoading() {
    if (this.show.process == true && this.show.coOwner == true) {
      this.missionService.setLoading(false)
    }
  }
  backPage() {
    this._location.back();
  }
  create() {
    this.router.navigate(['./smart-form/manager/co-owner/create', {
      processId: this.processId,
      id: this.accountId
    }]);
  }
  deleteCoOwner(coOwnerId: string){
    let item={number: 16, code: ''}
    let dialogRef = this.dialog.open(PopupConfirmComponent, DialogConfig.configDialogConfirmDeleteAccount(item))
    dialogRef.afterClosed().subscribe(rs => {
        if (rs == 1) {
          this.delete(coOwnerId)
        }
      }
    )
  }
  delete(coOwnerId: string) {
    this.missionService.setLoading(true)
    this.coOwnerService.delete(coOwnerId).subscribe(
      data => {
        if (data) this.response = data.responseStatus
      }
      ,error => {
        this.missionService.setLoading(true)
        this.errorHandler.showError(error);
      }
      ,() => {
        if (this.response) {
          this.errorHandler.messageHandler(this.response, 'Xóa đồng sở hữu thành công')
          if (this.response.success == true) {
            //get again to co-owner list
            this.getCoOwnerList()
          }
        }
      }
    )
  }
}
