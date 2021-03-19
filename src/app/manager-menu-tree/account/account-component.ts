import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from "@angular/common";
import { CifCondition } from "../../_models/cif";
import { DetailProcess, Process } from "../../_models/process";
import { ErrorHandlerService } from "../../_services/error-handler.service";
import { MissionService } from "../../services/mission.service";
import { IndivCifService } from "../../_services/indiv-cif.service";
import { AccountService } from 'src/app/_services/account.service';
import { AccountModel } from 'src/app/_models/account';
declare var $: any;
@Component({
  selector: 'app-account',
  templateUrl: './account-component.html',
  styleUrls: ['./account-component.scss']
})
export class AccountComponent implements OnInit {
  lstAccount :AccountModel[] =[]
  constructor(private router: Router,
    private route: ActivatedRoute,
    private _location: Location,
    private cifService: IndivCifService,
    private errorHandler: ErrorHandlerService,
    private missionService: MissionService,private accountService:AccountService) {
  }
  processId: string
  detailProcess: DetailProcess = new DetailProcess(null)
  hiddenAccount: boolean
  hiddenCreateAccount: boolean
  hiddenDetailAccount: boolean
  roleLogin:any
  checkButtonCreate:boolean
  ngOnInit() {
    this.roleLogin = JSON.parse(localStorage.getItem("role"))
    $('.childName').html('Danh sách tài khoản')
    this.processId = this.route.snapshot.paramMap.get('processId')
    this.route.paramMap.subscribe(paramMap => this.getProcessInformation(paramMap.get('processId')))
    this.hiddenAccount = true
    this.hiddenCreateAccount = false
    this.hiddenDetailAccount = false
    this.getAccountList()
    if(this.roleLogin.includes("UNIFORM.BANK.GDV")){
      this.checkButtonCreate = true
    }
  }
  getProcessInformation(processId) {
    if (processId) {
      this.processId = processId
      this.cifService.detailProcess(processId).subscribe(data => {
        this.detailProcess = new DetailProcess(data.customer)
        if (this.detailProcess.statusId == 'E' || this.detailProcess.statusId == 'M') {
          this.missionService.setMission('Gửi duyệt')
        } else this.missionService.setMission('Thông tin duyệt dịch vụ')
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
  getAccountList(){
    this.accountService.getAccountList({processId: this.processId}).subscribe(rs =>{
      if( rs.items !==undefined && rs.items.length >0){
        this.lstAccount = rs.items
      }else{
        this.lstAccount = null
      }
    },err =>{
      this.lstAccount = null
    })
  }
  backPage() {
    $('.childName').html('Danh sách tài khoản')
    if (this.hiddenAccount && !this.hiddenCreateAccount && !this.hiddenDetailAccount) {
      this._location.back();
    }
  }
  // eventBack(){
  //   $('.childName').html('Danh sách tài khoản')
  //   this.hiddenAccount = true
  //   this.hiddenCreateAccount = false
  //   this.hiddenDetailAccount = false
  // }
  createAccount() {
    this.router.navigate(['./smart-form/manager/createAccount', { processId: this.processId }]);
    // $('.childName').html('Thêm tài khoản')
    // this.hiddenAccount = false
    // this.hiddenCreateAccount = true
    // this.hiddenDetailAccount = false
    // debugger
    // this.router.navigate(['./smart-form/account/createAccount']);
    // this.child.ngOnInit()
  }
  detailAccount(item:any) {
    this.router.navigate(['./smart-form/manager/detailAccount', { processId: this.processId, id: item.id }]);
    // this.router.navigate(['./smart-form/account/detailAccount']);
  }
}
