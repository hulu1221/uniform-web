import { Component, OnInit } from '@angular/core';
import {CoOwnerAccount} from '../../_models/CoOwnerAccount';
import {DetailProcess} from '../../_models/process';
import {AccountModel} from '../../_models/account';
import {ResponseStatus} from '../../_models/response';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {Location} from '@angular/common';
import {IndivCifService} from '../../_services/indiv-cif.service';
import {AccountService} from '../../_services/account.service';
import {MissionService} from '../../services/mission.service';
import {ErrorHandlerService} from '../../_services/error-handler.service';
import {CoOwnerAccountService} from '../../_services/co-owner-account.service';
import {PopupConfirmComponent} from '../../_popup/popup-confirm.component';
import {DialogConfig} from '../../_utils/_dialogConfig';
import {delay} from 'rxjs/operators';

declare var $: any;
@Component({
  selector: 'app-detail-co-owner',
  templateUrl: './detail-co-owner.component.html',
  styleUrls: ['./detail-co-owner.component.css']
})
export class DetailCoOwnerComponent implements OnInit {
  processId: string
  accountId: string
  coOwnerId: string
  customerId: string
  coOwnerList: CoOwnerAccount[]
  detailProcess: DetailProcess = new DetailProcess(null)
  detailCoOwner: DetailProcess = new DetailProcess(null)
  detailAccount: AccountModel = new AccountModel()
  showLoading1: boolean
  showLoading2: boolean
  showLoading3: boolean
  response: ResponseStatus
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
    $('.childName').html('Thông tin chi tiết đồng sở hữu')
    $('.click-link').addClass("active")
    this.processId = this.route.snapshot.paramMap.get('processId')
    this.accountId = this.route.snapshot.paramMap.get('id')
    this.coOwnerId = this.route.snapshot.paramMap.get('coOwnerId')
    this.customerId = this.route.snapshot.paramMap.get('customerId')
    this.missionService.setLoading(true)
    this.route.paramMap.subscribe(paramMap => this.getProcessInformation(paramMap.get('processId')))
    this.getDetailCoOwner(this.customerId)
    this.getDetailAccount(this.accountId)
  }
  getProcessInformation(processId) {
    if (processId) {
      this.processId = processId
      this.cifService.detailProcess(processId).subscribe(data => {
          this.detailProcess = new DetailProcess(data.customer)
        },
        error => {
          this.errorHandler.showError(error)
        },
        () => {
          this.showLoading1 = true
          this.checkLoading()
          if (!this.detailProcess.processId) this.errorHandler.showError('Không lấy được thông tin hồ sơ')
        }
      )
      this.missionService.setProcessId(processId)
    }
  }
  getDetailCoOwner(coOwnerId: string) {
    // this.coOwnerService.detail(coOwnerId).subscribe(
    //   data => {
    //     console.log(data);
    //   }
    // )
    this.cifService.detailCustomer(coOwnerId).subscribe(
      data => {
        if (data) {
          this.detailCoOwner = new DetailProcess(data.customer)
          console.log(this.detailCoOwner);
          this.response = data.responseStatus
        }
      },error => this.errorHandler.showError(error)
      ,() => {
        this.showLoading2 = true
        this.checkLoading()
        if (this.response) {
          if (this.response.success == false) {
            this.errorHandler.showError('Không lấy được thông tin đồng sở hữu')
          }
        }
      }
    )
  }
  getDetailAccount(accountId) {
    return this.accountService.getDetailAccount({id: accountId}).subscribe(
      data => {
        this.detailAccount = data.item
      }, error => this.errorHandler.handleError(error)
      ,() => {
        this.showLoading3 = true
        this.checkLoading()
        if (!this.detailCoOwner) {
          this.errorHandler.showError('Không lấy được thông tin tài khoản')
          this.detailAccount = new AccountModel()
        }
      }
    )
  }
  checkLoading() {
    if (this.showLoading1 == true && this.showLoading2 == true && this.showLoading3 == true) {
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
  updateCoOwner(){
    this.router.navigate(['./smart-form/manager/co-owner/update', {
      processId: this.processId,
      id: this.accountId,
      coOwnerId: this.coOwnerId,
      customerId: this.customerId
    }]);
  }
  deleteCoOwner(){
    let item={number: 16, code: ''}
    let dialogRef = this.dialog.open(PopupConfirmComponent, DialogConfig.configDialogConfirmDeleteAccount(item))
    dialogRef.afterClosed().subscribe(rs => {
        if (rs == 1) {
          this.delete()
        }
      }
    )
  }
  delete() {
    this.missionService.setLoading(true)
    this.coOwnerService.delete(this.coOwnerId).subscribe(
      data => {
        if (data) this.response = data.responseStatus
      }
      ,error => {
        this.missionService.setLoading(false)
        this.errorHandler.showError(error);
      }
      ,() => {
        this.missionService.setLoading(false)
        if (this.response) {
          this.errorHandler.messageHandler(this.response, 'Xóa đồng sở hữu thành công')
          if (this.response.success == true) {
            //redirect to list co-owner page
            this.router.navigate(['./smart-form/manager/co-owner', {processId: this.processId, id: this.accountId}])
          }
        }
      }
    )
  }
}
