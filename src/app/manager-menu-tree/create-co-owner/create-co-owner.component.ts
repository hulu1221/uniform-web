import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DetailProcess, Process} from '../../_models/process';
import {IndivCifService} from '../../_services/indiv-cif.service';
import {ErrorHandlerService} from '../../_services/error-handler.service';
import {MissionService} from '../../services/mission.service';
import {Location} from '@angular/common';
import {FormGroup, Validators} from '@angular/forms';
import {Cif, cifFormValidator, IndividualCif} from '../../_models/cif';
import {CategoryService} from '../../_services/category/category.service';
import {CategoryList} from '../../_models/category/categoryList';
import {PopupSearchComponent} from '../../_popup-search/popup.search.component';
import {DialogConfig} from '../../_utils/_dialogConfig';
import {MatDialog} from '@angular/material/dialog';
import {CoOwnerAccountService} from '../../_services/co-owner-account.service';
import {Response, ResponseStatus} from '../../_models/response';
import {Bigger3Date, BiggerDate} from '../../_validator/cif.register.validator';

import * as moment from 'moment';
import {ConstantUtils} from '../../_utils/_constant';

declare var $: any; //declaration for jQuery
@Component({
  selector: 'app-create-co-owner',
  templateUrl: './create-co-owner.component.html',
  styleUrls: ['./create-co-owner.component.scss']
})
export class CreateCoOwnerComponent implements OnInit {
  processId: string
  accountId: string
  coOwnerId: string
  customerId: string
  maxPerDocNo: string = '50'
  userInfo: any
  branchInfo: string
  constantUtils: ConstantUtils = new ConstantUtils()
  registerCifResponse: Response
  response: Response
  responseStatus: ResponseStatus

  detailProcess: DetailProcess = new DetailProcess(null)
  detailCoOwner: DetailProcess = new DetailProcess(null)
  cifForm: Cif = new Cif(null)
  formValidator: cifFormValidator = new cifFormValidator()
  coOwnerForm: FormGroup
  categories: CategoryList = new CategoryList()
  submitted: boolean
  showCIF: boolean
  isUpdate: boolean
  showFatca: boolean
  showVisa: boolean
  constructor(private router: Router,
              private dialog: MatDialog,
              private route: ActivatedRoute,
              private cifService: IndivCifService,
              private errorHandler: ErrorHandlerService,
              private category: CategoryService,
              private missionService: MissionService,
              private _location: Location,
              private indivCifService: IndivCifService,
              private coOwnerAccountService: CoOwnerAccountService
  ) { }

  ngOnInit(): void {
    $('.childName').html('Thêm tài khoản đồng sở hữu')
    $('.click-link').addClass("active")
    this.processId = this.route.snapshot.paramMap.get('processId')
    this.accountId = this.route.snapshot.paramMap.get('id')
    this.coOwnerId = this.route.snapshot.paramMap.get('coOwnerId')
    this.customerId = this.route.snapshot.paramMap.get('customerId')
    this.isUpdate = this.route.snapshot.routeConfig.path == 'co-owner/update'
    if (this.isUpdate) {
      if (!(this.coOwnerId != '' && this.coOwnerId != null && this.coOwnerId != undefined &&
        this.processId != '' && this.processId != null && this.processId != undefined &&
        this.accountId != '' && this.accountId != null && this.accountId != undefined
      )) {
        this._location.back()
      }
    }
    this.showCIF = this.isUpdate
    this.userInfo = JSON.parse(localStorage.getItem("userInfo"))
    this.branchInfo = `${this.userInfo.branchCode} - ${this.userInfo.branchName}`
    this.coOwnerForm = this.cifForm.cifFormGroup
    this.coOwnerForm.get('branch').setValue(this.userInfo.branchCode)
    this.route.paramMap.subscribe(paramMap => this.getProcessInformation(paramMap.get('processId')))
    this.categoryLoader()
    if (this.isUpdate) this.getDetailCoOwner(this.customerId)

  }
  get f() {
    return this.coOwnerForm.controls;
  }
  checkDate(event: any, controlName: string) {
    this.coOwnerForm.get(controlName).markAsTouched()
    if (event?.isValid()) {
      this.coOwnerForm.get(controlName).setValue(event.format('YYYY-MM-DD'))
    } else this.coOwnerForm.get(controlName).setValue('')
    this.onInput(controlName)
  }
  dpMessage(controlName: string) {
    switch(controlName) {
      case 'birthday':
        return this.f.birthday.errors && this.f.birthday.errors?.futureDate ?
          'Ngày sinh không được lớn hơn ngày hiện tại':
          'Ngày sinh không hợp lệ hoặc không được để trống';
        break;
      case 'issuedDate':
        if (this.f.issuedDate.errors?.required) {
          return 'Ngày cấp không hợp lệ hoặc không được để trống'
          break;
        } if (this.f.issuedDate.errors?.futureDate) {
          return 'Ngày cấp không được lớn hơn ngày hiện tại'
          break;
        }
        if (this.coOwnerForm.errors?.biggerDate && this.coOwnerForm.errors?.biggerDate.value == 'issuedDate') {
          return 'Ngày cấp phải lớn hơn ngày sinh'
          break;
        }
        break;
      case 'expiredDate':
        if (this.f.expiredDate.errors?.pastDate) {
          return 'Ngày hết hiệu lực không được nhỏ hơn ngày hiện tại'
          break;
        }
        if (this.f.expiredDate.errors?.required) {
          return 'Ngày hết hiệu lực không hợp lệ hoặc không được để trống'
          break;
        } else
        if (this.coOwnerForm.errors?.biggerDate && this.coOwnerForm.errors?.biggerDate.value == 'expiredDate' && (this.f.expiredDate.dirty)) {
          return 'Ngày hết hiệu lực phải lớn hơn ngày cấp'
          break;
        }
        break;
      case 'visaIssueDate':
        if (this.coOwnerForm.errors.smallerDate && (this.f.visaIssueDate.dirty)) {
          return 'Ngày bắt đầu phải nhỏ hơn ngày hết hạn'
          break;
        }
        return ''
        break;
      case 'visaExpireDate':
        if (this.coOwnerForm.errors.smallerDate && (this.f.visaExpireDate.dirty)) {
          return 'Ngày bắt đầu phải lớn hơn ngày hết hạn'
          break;
        }
        return ''
        break;
      default:
        return ''
        break;
    }
  }
  expiredDateValidator(startDate: string, endDate: string) {
    let start = moment(new Date(this.coOwnerForm.get(startDate).value))
    let end = moment(new Date(this.coOwnerForm.get(endDate).value))
    let cond = end.diff(start, "day")
    return cond < 0
  }
  getFieldValidation(fieldName: string) {
    return (this.submitted && this.f[fieldName].errors) || this.formValidator[fieldName]
  }
  cifFormValidator() {
    this.f.birthday.markAsTouched()
    this.f.issuedDate.markAsTouched()
    this.f.expiredDate.markAsTouched()
    this.cifForm.cifFieldToValidate.forEach(controlName => {
      this.onInput(controlName)
      // console.log(controlName + this.formValidator[controlName].toString());
    })
    return this.formValidator.getFormValidator()
  }
  getProcessInformation(processId: string) {
    this.missionService.setLoading(true)
    if (processId) {
      this.processId = processId
      this.cifService.detailProcess(processId).subscribe(data => {
          this.detailProcess = new DetailProcess(data.customer)
        },
        error => {
          this.missionService.setLoading(false)
          this.errorHandler.showError(error)
        },
        () => {
          if (this.isUpdate == false) {
            this.missionService.setLoading(false)
          }
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
          console.log(data);
          this.detailCoOwner = new DetailProcess(data.customer)
          this.responseStatus = data.responseStatus
        }
      },error => {
        this.missionService.setLoading(false)
        this.errorHandler.showError(error);
      }
      ,() => {
        this.missionService.setLoading(false)
        if (this.responseStatus) {
          if (this.responseStatus.success) {
            this.cifForm.setFormData(this.detailCoOwner)
            this.category.getDistrictByCityId(this.detailCoOwner.ccityCode).subscribe(data => this.categories.currentDistricts = data)
            this.category.getWardByDistrictId(this.detailCoOwner.cdistrictCode).subscribe(data => this.categories.currentWards = data)
            this.category.getDistrictByCityId(this.detailCoOwner.rcityCode).subscribe(data => this.categories.permanentDistricts = data)
            this.category.getWardByDistrictId(this.detailCoOwner.rdistrictCode).subscribe(data => this.categories.permanentWards = data)
            this.branchInfo = `${this.detailCoOwner.branchCode} - ${this.detailCoOwner.branchName}`
            this.coOwnerForm.get('branch').setValue(this.userInfo.branchCode)
            this.onNationalityChange()
          }
          if (!this.responseStatus.success) {
            this.errorHandler.showError('Không lấy được thông tin đồng sở hữu')
          }
        }
      }
    )
  }
  categoryLoader() {
    this.category.getGenders().subscribe(data => this.categories.genders = data)
    this.category.getPerDocTypes().subscribe(data => this.categories.perDocTypes = data)
    this.category.getIndustries().subscribe(data => this.categories.industries = data)
    this.category.getMaritalStatus().subscribe(data => this.categories.maritalStatus = data)
    this.category.getCountries().subscribe(data => this.categories.countries = data)
    this.category.getCities().subscribe(data => this.categories.cites = data)
    this.category.getIncomeLevel().subscribe(data => this.categories.incomes = data)
    this.category.getEducation().subscribe(data => this.categories.educations = data)
    this.category.getBranch().subscribe(data => this.categories.branches = data)
  }
  onInput(controlName: string, otherCheck: boolean = false) {
    let controlValue = this.coOwnerForm.get(controlName).value
    let expiredDate = this.coOwnerForm.get('expiredDate').value
    if (controlValue != undefined) {
      if (controlName == 'expiredDate') {
        // Ngay het han
        this.formValidator[controlName] = this.f.expiredDate.errors || this.coOwnerForm.errors?.biggerDate?.value =='expiredDate' ? true: false
      } else if (controlName == 'issuedDate') {
        //Ngay cap
        this.formValidator[controlName] = this.f.issuedDate.errors || this.coOwnerForm.errors?.biggerDate?.value =='issuedDate' ? true: false
      } else if (controlName == 'birthday') {
        // Ngay sinh
        this.formValidator[controlName] = this.f.birthday.errors ? true : false
        if (expiredDate !='' && expiredDate != undefined) { //nếu ngày cấp đã có thì check luôn ngày cấp
          this.formValidator['issuedDate'] = this.f.issuedDate.errors || this.coOwnerForm.errors?.biggerDate?.value =='issuedDate' ? true: false
        }
      }
      else this.formValidator[controlName] = this.coOwnerForm.get(controlName).errors ? true: false
    } else this.formValidator[controlName] = true
    if (controlName == 'perDocType' && otherCheck == true) this.onPerDocTypeChange()
    if (otherCheck == true) this.onAddressChange(controlName)
  }
  onPerDocTypeChange() {
    let docType = this.f.perDocType.value
    if (docType == this.constantUtils.CCCD) {
      this.f.perDocNo.setValidators([Validators.required, Validators.minLength(12), Validators.maxLength(12)])
      this.maxPerDocNo = '12'
    } else if (docType == this.constantUtils.CMTND) {
      this.f.perDocNo.setValidators([Validators.required, Validators.maxLength(12)])
      this.maxPerDocNo = '12'
    } else {
      this.f.perDocNo.setValidators(Validators.required)
      this.maxPerDocNo = '50'
    }
    this.f.perDocNo.setValue('')
  }
  onNationalityChange() {
    this.onInput('nationality')
    let nationality = this.coOwnerForm.get('nationality').value
    // show FATCA information when nationality is US
    this.showFatca = nationality == 'US'
    this.showVisa = nationality != 'VN' && nationality != null
    if (!this.showVisa) {
      this.coOwnerForm.get('freeVisa').setValue(null)
      this.coOwnerForm.get('visaIssueDate').setValue(null)
      this.coOwnerForm.get('visaExpireDate').setValue(null)
      this.coOwnerForm.setValidators([
        Bigger3Date('birthday', 'issuedDate', 'expiredDate')
      ])
    } else {
      this.coOwnerForm.setValidators([
        Bigger3Date('birthday', 'issuedDate', 'expiredDate'),
        BiggerDate('visaIssueDate', 'visaExpireDate')
      ])
    }
    this.coOwnerForm.updateValueAndValidity()
  }
  onAddressChange(controlName: string) {
    switch(controlName) {
      case 'currentProvince':
        // will get list of district on city id
        if (this.f.currentProvince.value != '' && this.f.currentProvince.value != null) {
          this.category.getDistrictByCityId(this.f.currentProvince.value).subscribe(data => this.categories.currentDistricts = data)
          this.coOwnerForm.get('currentDistrict').setValue(null)
          this.coOwnerForm.get('currentWards').setValue(null)
        } else {
          this.categories.currentDistricts = []
          this.coOwnerForm.get('currentDistrict').setValue(null)
        }
        break;
      case 'currentDistrict':
        // will get list of ward on district id
        if (this.f.currentDistrict.value != '' && this.f.currentDistrict.value != null) {
          this.category.getWardByDistrictId(this.f.currentDistrict.value).subscribe(data => this.categories.currentWards = data)
          this.coOwnerForm.get('currentWards').setValue(null)
        } else {
          this.categories.currentWards = []
          this.coOwnerForm.get('currentWards').setValue(null)
        }
        break;
      case 'permanentProvince':
        // will get list of district on city id
        if (this.f.permanentProvince.value != '' && this.f.permanentProvince.value != null) {
          this.category.getDistrictByCityId(this.f.permanentProvince.value).subscribe(data => this.categories.permanentDistricts = data)
          this.coOwnerForm.get('permanentDistrict').setValue(null)
          this.coOwnerForm.get('permanentWards').setValue(null)
        } else {
          this.categories.permanentDistricts = []
          this.coOwnerForm.get('permanentDistrict').setValue(null)
        }
        break;
      case 'permanentDistrict':
        // will get list of ward on district id
        if (this.f.permanentDistrict.value != '' && this.f.permanentDistrict.value != null) {
          this.category.getWardByDistrictId(this.f.permanentDistrict.value).subscribe(data => this.categories.permanentWards = data)
          this.coOwnerForm.get('permanentWards').setValue(null)
        } else {
          this.categories.permanentWards = []
          this.coOwnerForm.get('permanentWards').setValue(null)
        }
        break;
      default:
        // to do
        break;
    }
  }

  backPage() {
    this._location.back();
  }

  registerCif() {
    return new Promise((resolve, reject) => {
      this.indivCifService.openCif(new IndividualCif(this.coOwnerForm.controls, this.processId)).subscribe(
        data => {
            if (data) this.registerCifResponse = data
        },error => {
          this.missionService.setLoading(false)
          this.errorHandler.showError(error)
          reject(false)
        },
        () => {
          if (this.registerCifResponse && this.registerCifResponse.responseStatus) {
            this.errorHandler.messageHandler(this.registerCifResponse.responseStatus,'Đã tạo Khách hàng')
            if (this.registerCifResponse.responseStatus.success == true) {
              resolve(true)
            }
          } else {
            this.missionService.setLoading(false)
            this.errorHandler.showError('Không tạo được Khách hàng')
            reject(false)
          }
        }
      )
    })
  }

  registerCoOwner(obj: any) {
    return new Promise((resolve) => {
      this.coOwnerAccountService.create(obj).subscribe(
        data => {
          if (data) this.response = data
        }
        ,error => {
          this.missionService.setLoading(false)
          this.errorHandler.showError(error);
        }
        ,() => {
          this.missionService.setLoading(false)
          if (this.response) {
            this.errorHandler.messageHandler(this.response.responseStatus, 'Thêm mới đồng sở hữu thành công')
            if (this.response.responseStatus.success == true) {
              resolve(true)
            }
          } else this.errorHandler.showError('Lỗi không xác định')
        }
      )
    }).then(
      rs => {
        if (rs) {
          this.router.navigate(['./smart-form/manager/co-owner/detail', {
            processId: this.processId,
            id: this.accountId,
            coOwnerId: this.response.item.id,
            customerId: this.response.item.customerId
          }]);
        }
      }
    )

  }
  updateCoOwner() {
    this.coOwnerAccountService.update(this.customerId, new IndividualCif(this.coOwnerForm.controls, this.customerId)).subscribe(
      data => {
        console.log(data);
        if (data.responseStatus) {
          this.responseStatus = data.responseStatus
        }
      }
      ,error => {
        this.errorHandler.showError(error)
        this.missionService.setLoading(false)
      }
      ,() => {
        this.missionService.setLoading(false)
        if (this.responseStatus) {
          this.errorHandler.messageHandler(this.responseStatus, 'Cập nhật đồng sở hữu thành công')
          if (this.responseStatus.success == true) {
            this.router.navigate(['./smart-form/manager/co-owner/detail', {
              processId: this.processId,
              id: this.accountId,
              coOwnerId: this.coOwnerId,
              customerId: this.customerId
            }]);
          }
        } else this.errorHandler.showError('Lỗi không xác định')
    }
    )
  }

  saveCoOwner() {
    this.missionService.setLoading(true)
    if (this.cifFormValidator()) {
      if (this.isUpdate) {
        // start update co owner
        this.updateCoOwner()
        // end update co owner
      } else {
        // start create co owner
        this.registerCif()
          .then(
            rs => {
              if (rs == true) {
                // create co owner with customerId after create temp cif
                this.registerCoOwner({
                  accountId: this.accountId,
                  customerId: this.registerCifResponse.customerId
                })
              }
            }
          )
        // end create co owner
      }
    } else {
      // show form error
      this.missionService.setLoading(false)
      this.errorHandler.showError('Dữ liệu chưa hợp lệ')
    }
  }
  searchCif() {
    return new Promise((resolve, reject) => {
      if (true) {
        resolve(true)
      } else {
        reject(false)
      }
    }).then(
      rs => {
        if (rs == true) {
          // open list cif dialog
          this.openCifListDialog()
        } else {
          //show no cif with button create new
        }
      }
    )
  }
  openCifListDialog() {
    let dialogRef = this.dialog.open(PopupSearchComponent, DialogConfig.configDialogSearch(null))
    dialogRef.afterClosed().subscribe(rs => {
      if (rs == 1) {
        this.showCIF = true
      }
    })
  }
  onCheckSameAddress(checked: boolean) {
    if (checked) {
      this.categories.permanentDistricts = this.categories.currentDistricts
      this.categories.permanentWards = this.categories.currentWards
      this.coOwnerForm.controls['permanentCountry'].setValue(this.coOwnerForm.get('currentCountry').value)
      this.coOwnerForm.controls['permanentProvince'].setValue(this.coOwnerForm.get('currentProvince').value)
      this.coOwnerForm.controls['permanentDistrict'].setValue(this.coOwnerForm.get('currentDistrict').value)
      this.coOwnerForm.controls['permanentWards'].setValue(this.coOwnerForm.get('currentWards').value)
      this.coOwnerForm.controls['permanentAddress'].setValue(this.coOwnerForm.get('currentAddress').value)
    } else {
      this.coOwnerForm.controls['permanentCountry'].setValue(null)
      this.coOwnerForm.controls['permanentProvince'].setValue(null)
      this.coOwnerForm.controls['permanentDistrict'].setValue(null)
      this.coOwnerForm.controls['permanentWards'].setValue(null)
      this.coOwnerForm.controls['permanentAddress'].setValue('')
    }
    this.onInput('permanentCountry')
    this.onInput('permanentProvince')
    this.onInput('permanentDistrict')
    this.onInput('permanentWards')
    this.onInput('permanentAddress')
  }
  addTagFn(name) {
    return { name: name, value: name, tag: true };
  }
}
