import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from "@angular/common";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DetailProcess } from 'src/app/_models/process';
import { MissionService } from 'src/app/services/mission.service';
import { IndivCifService } from 'src/app/_services/indiv-cif.service';
import { ErrorHandlerService } from 'src/app/_services/error-handler.service';
import { CreateAccount } from 'src/app/_models/account';
import { AccountService } from 'src/app/_services/account.service';
import { NotificationService } from 'src/app/_toast/notification_service';
import { ConstantUtils } from 'src/app/_utils/_constant';
declare var $: any;
@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss']
})
export class CreateAccountComponent implements OnInit {
  createAccountForm: FormGroup
  submitted = false
  processId: any
  detailProcess: DetailProcess = new DetailProcess(null)
  objCreateAccount: CreateAccount = new CreateAccount()
  branchName: string
  accountNumber: any
  lstCurrency: [] = []
  lstAccountProduct: [] = []
  lstAccountClass: [] = []
  lstAccountClassMap: any[] = []
  typeAccount = ""
  typeCurren = ""
  typeCurrency: any
  accClassId: any
  checkAccoutClass: boolean
  accountClassName: any
  _constant:ConstantUtils = new ConstantUtils()
  constructor(private router: Router, private cifService: IndivCifService,
    private errorHandler: ErrorHandlerService,
    private notificationService: NotificationService,
    private route: ActivatedRoute, private _location: Location, private missionService: MissionService, private accountService: AccountService) {
  }
  ngOnInit() {
    $('.childName').html('Thêm tài khoản')
    $('.click-link').addClass("active")
    this.processId = this.route.snapshot.paramMap.get('processId')
    let userInfo = JSON.parse(localStorage.getItem("userInfo"))
    this.objCreateAccount.branchCode = userInfo.branchCode
    this.branchName = userInfo.branchName.toUpperCase()
    this.accountNumber = "Tài khoản mới - " + Math.floor(100000 + Math.random() * 900000)
    this.route.paramMap.subscribe(paramMap => this.getProcessInformation(paramMap.get('processId')))
    this.createAccountForm = new FormGroup({
      accountName: new FormControl('',),
      acountNumber: new FormControl('', Validators.required),
      typeCurrency: new FormControl('', Validators.required),
      typeAccountHtml: new FormControl('', Validators.required),
      codeAccount: new FormControl('', Validators.required),
      packageAccount: new FormControl('',),
      minimumMaintenanceBalance: new FormControl('', Validators.required),
      employeeCode: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
    })
    // this.lstAccountClassMap = []
    this.getLstAllCurrency()
    this.getLstAccountProduct()
    this.getLstAccountClass()

  }
  ngAfterViewInit() {
    this.createAccountForm.get("codeAccount").setValue("")
  }
  getProcessInformation(processId) {
    if (processId) {
      this.processId = processId
      this.cifService.detailProcess(processId).subscribe(data => {
        this.detailProcess = new DetailProcess(data.customer)
        this.objCreateAccount.accountName = this.detailProcess.fullName.toUpperCase()
        this.objCreateAccount.accountDescription = this.objCreateAccount.accountName + " - " + this.typeAccount + this.typeCurren
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
      let returnLstCurrency = rs.items.filter(e => e['code'] == this._constant.VND || e['code'] == this._constant.USD || e['code'] == this._constant.EUR)
      this.lstCurrency = returnLstCurrency
      if (this.lstCurrency !== undefined && this.lstCurrency.length > 0) {
        let tA = this.typeAccount !== "" ? " - " + this.typeAccount : ""
        this.typeCurren = " - " + rs.items[0].code
        this.objCreateAccount.currencyCode = rs.items[0]["id"]
        this.typeCurrency = rs.items[0].code
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
  onChangeAccountClass(value) {
    this.objCreateAccount.minBalance = undefined
    this.lstAccountClassMap.forEach(rs => {
      if (value == rs["code"]) {
        this.objCreateAccount.accountClassCode = rs["code"]
        // this.checkAccoutClass = true
        // this.accountClassName = rs["name"]
        return
      }
    })
    this.getAccountMinBal(value)
  }
  onBlurMethod(val: any) {
    let str = val.toString(),
      parts = false, output = [], i = 1, formatted = null;
    // if (str.indexOf(".") > 0) {
    //   parts = str.split(".");
    //   str = parts[0];
    // }
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
    }else{
      output = val
    }

    formatted = output.reverse().join("");
    this.objCreateAccount.minBalance = formatted
  }

  onChangeAccountCurrency(value) {
    this.typeCurren = " - " + value
    let typeAccount = this.typeAccount !== "" ? " - " + this.typeAccount : ""
    // this.getAccountMinBal(value)
    this.objCreateAccount.accountDescription = this.objCreateAccount.accountName + typeAccount + this.typeCurren
    this.lstCurrency.forEach(rs => {
      let val: string = rs["code"]
      if (val === value) {
        this.objCreateAccount.currencyCode = rs["code"]
        this.changeCodeAccount()
        return
      }
    })
  }

  onChangeAccountProduct(value) {
    // this.getAccountMinBal(value)
    this.lstAccountProduct.forEach(rs => {
      let val: string = rs["code"]
      if (val === value) {
        this.objCreateAccount.accountProductCode = rs["code"]
        this.typeAccount = rs["name"]
        this.objCreateAccount.accountDescription = this.objCreateAccount.accountName + " - " + this.typeAccount + this.typeCurren
        this.changeCodeAccount()
        return
      }
    })

  }
  changeCodeAccount() {
    this.lstAccountClassMap = []
    this.checkAccoutClass = false
    this.objCreateAccount.minBalance = undefined
    this.objCreateAccount.accountClassCode = undefined
    this.accountClassName = ""

    if (this.objCreateAccount.currencyCode !== undefined && this.objCreateAccount.accountProductCode !== undefined) {
      this.lstAccountClass.forEach(rs => {
        let currencies: [] = rs['currencies']
        let products: [] = rs['products']
        if (rs['currencies'] !== null && rs['products'] !== null && rs['currencies'] !== undefined && rs['products'] !== undefined) {
          for (let i = 0; i < currencies.length; i++) {
            for (let j = 0; j < products.length; j++) {
              if(currencies[i]['currencyCode'] === this.objCreateAccount.currencyCode && products[j]['accountProductCode'] === this.objCreateAccount.accountProductCode){
                let obj = {}
                obj["code"] = rs["code"] + " - " + this.objCreateAccount.accountProductCode
                obj["name"] = rs["code"] + " - " + rs["name"]
                obj["value"] = rs["code"]
                this.lstAccountClassMap.push(obj)
              }
            }
          }

        }
      })
      this.createAccountForm.get("codeAccount").setValue("")
    }
  }
  // số dư tối thiểu
  getAccountMinBal(value: any) {
    this.accountService.getAccountMinBal().subscribe(rs => {
      // debugger
      if (rs.items.length > 0) {
        for (let index = 0; index < rs.items.length; index++) {
          if (rs.items[index]['accountClassCode'].includes(value)) {
            if (rs.items[index].minBalance !== null && rs.items[index].minBalance !== "" && rs.items[index].minBalance !== undefined) {
              this.onBlurMethod(rs.items[index].minBalance)
            }
            break
          }
        }
      }
    })
  }
  get f() {
    return this.createAccountForm.controls;
  }
  backPage() {
    //  $('.childName').html('Danh sách tài khoản')
    this._location.back();
  }
  createAccount() {
    this.submitted = true
    if (this.createAccountForm.invalid) {
      return;
    }
    this.objCreateAccount.accountTypeCode = "SINGLE"
    this.objCreateAccount.processId = this.processId
    this.objCreateAccount.minBalance = this.objCreateAccount.minBalance.toString().replace(/\./g,'')
    this.accountService.createAccount(this.objCreateAccount).subscribe(rs => {
      for (let index = 0; index < rs.responseStatus.codes.length; index++) {
        if (rs.responseStatus.codes[index].code === "200") {
          this.notificationService.showSuccess("Thêm mới tài khoản thành công", "")
          setTimeout(() => {
            this.router.navigate(['./smart-form/manager/account', { processId: this.processId }]);
          }, 1000);
        } else {
          this.notificationService.showError("Thêm mới tài khoản thất bại", "")
        }
      }
    }, err => {
      debugger
    })
    // $('.childName').html('Thêm tài khoản')
  }

}
