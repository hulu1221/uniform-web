import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DecimalPipe, Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DetailProcess } from 'src/app/_models/process';
import { AccountModel, CreateAccount } from 'src/app/_models/account';
import { IndivCifService } from 'src/app/_services/indiv-cif.service';
import { ErrorHandlerService } from 'src/app/_services/error-handler.service';
import { NotificationService } from 'src/app/_toast/notification_service';
import { MissionService } from 'src/app/services/mission.service';
import { AccountService } from 'src/app/_services/account.service';
import { isNumeric } from "../../_validator/number.validator";
import { ResponseStatus } from "../../_models/response";
declare var $: any;
@Component({
  selector: 'app-update-account',
  templateUrl: './update-account.component.html',
  styleUrls: ['./update-account.component.scss']
})
export class UpdateAccountComponent implements OnInit {
  updateAccountForm: FormGroup
  submitted: boolean
  processId: any
  detailProcess: DetailProcess = new DetailProcess(null)
  objCreateAccount: CreateAccount = new CreateAccount()
  branchName: string
  accountNumber: any
  lstCurrency: [] = []
  lstAccountProduct: [] = []
  lstAccountClass: [] = []
  typeAccount = ""
  typeCurren = ""
  typeCurrency: any
  accountId: any
  detailAccount: AccountModel = new AccountModel()
  response: ResponseStatus
  constructor(private router: Router, private cifService: IndivCifService, private decimalPipe: DecimalPipe,
    private errorHandler: ErrorHandlerService,
    private notificationService: NotificationService,
    private route: ActivatedRoute, private _location: Location, private missionService: MissionService, private accountService: AccountService) {
  }
  ngOnInit() {
    $('.childName').html('Chỉnh sửa tài khoản')
    this.processId = this.route.snapshot.paramMap.get('processId')
    this.accountId = this.route.snapshot.paramMap.get('id')
    let userInfo = JSON.parse(localStorage.getItem("userInfo"))
    this.objCreateAccount.branchCode = userInfo.branchCode
    this.branchName = userInfo.branchName.toUpperCase()
    this.accountNumber = "Tài khoản mới - " + Math.floor(100000 + Math.random() * 900000)
    this.route.paramMap.subscribe(paramMap => this.getProcessInformation(paramMap.get('processId')))
    this.updateAccountForm = new FormGroup({
      accountName: new FormControl({ value: '', disabled: true }),
      acountNumber: new FormControl({ value: '', disabled: true }),
      typeCurrency: new FormControl({ value: '', disabled: true }),
      typeAccountHtml: new FormControl({ value: '', disabled: true }),
      codeAccount: new FormControl({ value: '', disabled: true }),
      packageAccount: new FormControl('',),
      minimumMaintenanceBalance: new FormControl('', Validators.required),
      employeeCode: new FormControl({ value: '', disabled: true }),
      description: new FormControl('', Validators.required),
    })
    this.updateAccountForm.controls['acountNumber'].setValue('Số tài khoản mới')
  }
  ngAfterViewInit() {
    this.getDetailAccountInformation(this.accountId)
  }
  getDetailAccountInformation(accountId) {
    return this.accountService.getDetailAccount({ id: accountId }).subscribe(
      data => {
        this.detailAccount = data.item
        if (this.detailAccount.minBalance !== null && this.detailAccount.minBalance !== "" && this.detailAccount.minBalance !== undefined) {
          this.onBlurMethod(this.detailAccount.minBalance)
        }

      }, error => this.errorHandler.handleError(error)
      , () => {
        if (!this.detailAccount) {
          this.detailAccount = new AccountModel()
          this.errorHandler.showError('Không lấy được thông tin chi tiết tài khoản')
        }
      }
    )
  }
  getProcessInformation(processId) {
    if (processId) {
      this.processId = processId
      this.cifService.detailProcess(processId).subscribe(data => {
        this.detailProcess = new DetailProcess(data.customer)
        this.objCreateAccount.accountName = this.detailProcess.fullName.toUpperCase()
      },
        error => {
          this.errorHandler.showError(error)
        },
        () => {
          if (!this.detailProcess.processId) this.errorHandler.showError('Không lấy được thông tin hồ sơ')
        }
      )
      this.missionService.setProcessId(processId)
    }
  }
  getLstAllCurrency() {
    this.accountService.getLstAllCurrency().subscribe(rs => {
      this.lstCurrency = rs.items
      if (this.lstCurrency !== undefined && this.lstCurrency.length > 0) {
        let tA = this.typeAccount !== "" ? " - " + this.typeAccount : ""
        this.typeCurren = " - " + rs.items[0].value
        this.typeCurrency = rs.items[0].value
        this.objCreateAccount.accountDescription = this.objCreateAccount.accountName + tA + this.typeCurren
      } else {
        this.objCreateAccount.accountDescription = this.objCreateAccount.accountName + " - " + this.typeCurren
      }
    })
  }

  //loại tài khoản
  getLstAccountProduct() {
    this.accountService.getLstAccountProduct().subscribe(rs => {
      this.lstAccountProduct = rs.items
    })
  }
  //mã tài khoản
  getLstAccountClass() {
    this.accountService.getLstAccountClass().subscribe(rs => {
      this.lstAccountClass = rs.items
    })
  }

  // số dư tối thiểu
  getAccountMinBal(value: any) {
    this.accountService.getAccountMinBal().subscribe(rs => {
      if (rs.items.length > 0) {
        for (let index = 0; index < rs.items.length; index++) {
          if (value.search(rs.items[index].classes) >= 0) {
            this.objCreateAccount.minBalance = rs.items[index].minBalance
            break
          }
        }
      }
    })
  }
  get f() {
    return this.updateAccountForm.controls;
  }
  onBlurMethod(val: any) {
    let str = val.toString(),
      parts = false, output = [], i = 1, formatted = null;
    str = str.split("").reverse();
    if (str.indexOf(".") < 0) {
      for (let j = 0, len = str.length; j < len; j++) {
        if (str[j] != ",") {
          output.push(str[j]);
          if (i % 3 == 0 && j < (len - 1)) {
            output.push(".");
          }
          i++;
        }
      }
    } else {
      output = val
    }

    formatted = output.reverse().join("");
    this.detailAccount.minBalance = formatted
  }
  saveChange() {
    this.submitted = true
    if (this.updateAccountForm.invalid) {
      return;
    }
    this.detailAccount.minBalance = this.accountService.minBalanceBuilder(this.detailAccount.minBalance)
    return this.accountService.updateAccount(this.detailAccount).subscribe(
      data => {
        // console.log(data);
        if (data.responseStatus) this.response = data.responseStatus
      },
      error => {
        this.detailAccount.minBalance = this.decimalPipe.transform(this.detailAccount.minBalance, '1.0', 'vi')
        this.errorHandler.showError(error);
      }
      , () => {
        if (this.response) {
          this.detailAccount.minBalance = this.decimalPipe.transform(this.detailAccount.minBalance, '1.0', 'vi')
          this.errorHandler.messageHandler(this.response, 'Cập nhật tài khoản thành công')
          if (this.response.success == true) this.router.navigate(['./smart-form/manager/account', { processId: this.processId}]);
        }
      }
    )

  }
  backPage() {
    this._location.back();
  }
  removeText() {
    this.f.minimumMaintenanceBalance.setValue(this.detailAccount.minBalance.replace(/[A-Za-z]/g, ''))
  }
  showUpdateButton() {
    // return this.deta
  }
}
