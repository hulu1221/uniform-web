import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { DatePipe, Location } from '@angular/common';
import {FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {Cif, cifFormValidator, IndividualCif} from "../../_models/cif";
import {CategoryService} from "../../_services/category/category.service";
import {CategoryList} from "../../_models/category/categoryList";
import {IndivCifService} from "../../_services/indiv-cif.service";
import {ErrorHandlerService} from "../../_services/error-handler.service";
import {DetailProcess} from "../../_models/process";
import * as moment from "moment";
import { MatDialog } from '@angular/material/dialog';
import { MisCifComponent } from '../mis-cif/mis-cif.component';
import { DialogConfig } from 'src/app/_utils/_dialogConfig';
import { UdfCifComponent } from '../udf-cif/udf-cif.component';
declare var $: any;
@Component({
  selector: 'app-register-cif.component',
  templateUrl: './register-cif.component.html',
  styleUrls: ['./register-cif.component.css']
})
export class RegisterCifComponent implements OnInit {
  tabIndex = {
    fullName: 1,
    gender: 2,
    birthDate: 3,
    perDocNo: 6,
    perDocType: 5,
    issueDate: 7,
    issuePlace: 8,
    expireDate: 9,
    mobilePhone: 10,
    birthPlace: 4,
    residence: 11,
    industry: 12,
    position: 13,
    cifKH78: 15,
    cifMANKT: 17,
    employeeId: 14,
    maritalStatus: 19,
    branchCode: 16,
    education: 21,
    email: 18,
    workPhone: 20,
    homePhone: 22,
    socialNetwork: 24,
    income: 28,
    personalIncomeTax: 31,
    nationalityCode: 23,
    usingOverdraft: 29,
    salaryInBank: 30,

    ccountryCode: 32,
    ccityCode: 33,
    cdistrictCode: 34,
    cwardCode: 35,
    cstreetNumber: 36,

    rcountryCode: 37,
    rcityCode: 38,
    rdistrictCode: 39,
    rwardCode: 40,
    rstreetNumber: 41,

    fatcaId1: 42,
    fatcaId2: 43,
    openNewAcc: 44,
    cardService: 45,
    saveProcess: 46,

    freeVisa: 25,

    visaExpireDate: 27,
    visaIssueDate: 26,
  }
  genderN: string = ""
  processId: string
  selectMade:any
  sameAddress:boolean
  cifRegisterForm: FormGroup
  formValidator: cifFormValidator
  submitted: boolean
  showFatca: boolean
  showVisa: boolean
  freeVisa: boolean
  cifForm: Cif
  categories: CategoryList
  date2: Date
  detailProcess: DetailProcess = new DetailProcess(null)
  constructor(private router: Router,
              private route: ActivatedRoute,
              private datePipe: DatePipe,
              private category: CategoryService,
              private cifService: IndivCifService,
              private _location: Location,
              private dialog: MatDialog,
              private errorHandler: ErrorHandlerService
  ) { }
  ngOnInit() {
    $('.parentName').html('Đăng ký dịch vụ')
    $('.childName').html('Tạo mới khách hàng')
    this.getDetailProcess()
    this.cifForm = new Cif(null)
    this.cifRegisterForm = this.cifForm.cifFormGroup
    this.formValidatorInit()
    this.categoriesLoader()
    this.onNgSelectStartup()
    if (this.processId) {
      this.cifRegisterForm.get('employeeId').reset({value : this.cifRegisterForm.get('employeeId').value, disabled: false}, Validators.compose([Validators.required, Validators.maxLength(20)]))
      this.cifRegisterForm.get('branch').reset({value : this.cifRegisterForm.get('branch').value, disabled: false}, Validators.required)
    }

  }


  setUserInfo () {
    let userInfo = JSON.parse(localStorage.getItem('userInfo'))
    this.cifRegisterForm.get('employeeId').setValue(userInfo.userCode)
    this.cifRegisterForm.get('branch').setValue(userInfo.branchId)
  }
  getDetailProcess() {
    this.route.paramMap.subscribe( paramMap => {
      this.processId = paramMap.get('processId')
      return new Promise<DetailProcess>(resolve => {
        this.cifService.detailProcess(this.processId).subscribe(data => {
          this.detailProcess = new DetailProcess(data.customer)
          if (this.detailProcess.processId != '' && this.detailProcess.processId != null && this.detailProcess.processId != undefined) {
            this.category.getDistrictByCityId(this.detailProcess.ccityCode).subscribe(data => this.categories.currentDistricts = data)
            this.category.getWardByDistrictId(this.detailProcess.cdistrictCode).subscribe(data => this.categories.currentWards = data)
            this.category.getDistrictByCityId(this.detailProcess.rcityCode).subscribe(data => this.categories.permanentDistricts = data)
            this.category.getWardByDistrictId(this.detailProcess.rdistrictCode).subscribe(data => this.categories.permanentWards = data)
          }
          resolve(this.detailProcess)
        })
      }).then(process => {
        if (process.processId != '' && process.processId != null && process.processId != undefined) {
          this.processId = process.processId
          this.cifForm = new Cif(process)
          this.cifRegisterForm = this.cifForm.cifFormGroup
        } else this.setUserInfo()
      })
    })
  }
  catchDate2(event) {
    console.log(event);
    if (event?.isValid()) {
      this.cifRegisterForm.get('birthday').setValue(event.format('YYYY-MM-DD'))
      this.date2 = event;
    } else this.cifRegisterForm.get('birthday').setValue('')
    this.onInput('birthday')
  }
  catchDate(event) {
    console.log(event.target.name);
    if (event?.isValid()) {
      this.cifRegisterForm.get('birthday').setValue(event.format('YYYY-MM-DD'))
      this.date2 = event;
    } else this.cifRegisterForm.get('birthday').setValue('')
    this.onInput('birthday')
  }
  bdayMessage() {
    return this.f.birthday.errors && this.f.birthday.errors?.futureDate ?
      'Ngày sinh không được lớn hơn ngày hiện tại':
      'Ngày sinh không hợp lệ'
  }
  categoriesLoader() {
    this.categories = new CategoryList();
    this.category.getGenders().subscribe(data => this.categories.genders = data)
    this.category.getPerDocTypes().subscribe(data => this.categories.perDocTypes = data)
    this.category.getIndustries().subscribe(data => this.categories.industries = data)
    this.category.getMaritalStatus().subscribe(data => this.categories.maritalStatus = data)
    // this.category.getSector().subscribe(data => this.categories.sector = data)
    this.category.getCountries().subscribe(data => this.categories.countries = data)
    this.category.getCities().subscribe(data => this.categories.cites = data)
    // this.category.getPosition().subscribe(data => this.categories.positions = data)
    this.category.getIncomeLevel().subscribe(data => this.categories.incomes = data)
    this.category.getEducation().subscribe(data => this.categories.educations = data)
    this.category.getBranch().subscribe(data => this.categories.branches = data)
  }
  formValidatorInit() {
    this.formValidator = new cifFormValidator();
  }
  get f() {
    return this.cifRegisterForm.controls;
  }
  expiredDateValidator(startDate: string, endDate: string) {
    let start = moment(new Date(this.cifRegisterForm.get(startDate).value))
    let end = moment(new Date(this.cifRegisterForm.get(endDate).value))
    let cond = end.diff(start, "day")
    return cond < 0
  }
  onInput(controlName: string) {
    let controlValue = this.cifRegisterForm.get(controlName).value
    let expiredDate = this.cifRegisterForm.get('expiredDate').value
    if (controlValue != undefined) {
      if (controlName == 'expiredDate') {
        // Ngay het han
        this.formValidator[controlName] = this.f.expiredDate.errors || this.cifRegisterForm.errors?.biggerDate.value =='expiredDate' ? true: false
      } else if (controlName == 'issuedDate') {
        //Ngay cap
        this.formValidator[controlName] = this.f.issuedDate.errors || this.cifRegisterForm.errors?.biggerDate.value =='issuedDate' ? true: false
      }else if (controlName == 'birthday') {
        // Ngay sinh
         this.formValidator[controlName] = this.f.birthday.errors ? true : false
        if (expiredDate !='' && expiredDate != undefined) { //nếu ngày cấp đã có thì check luôn ngày cấp
          this.formValidator['issuedDate'] = this.f.issuedDate.errors || this.cifRegisterForm.errors?.biggerDate.value =='issuedDate' ? true: false
        }
      }
      else this.formValidator[controlName] = controlValue == ''
      this.onNameAffectGender()
    } else this.formValidator[controlName] = true
    // console.log(controlName + ' = ' + this.formValidator[controlName] + 'value: ' + this.cifRegisterForm.get(controlName).value.trim())
    this.onAddressChange(controlName)
  }
  onNameAffectGender() {
    if (this.f.fullName.value) {
      let male = ["văn"];
      let female = ["thị"];
      let fullName = this.f.fullName.value.toLowerCase()
      male.map(subName => {
        if (fullName.includes(subName)) this.genderN = 'MALE'
      })
      female.map(subName => {
        if (fullName.includes(subName)) this.genderN = 'FEMALE'
      })
    }
  }
  onAddressChange(controlName: string) {
    switch(controlName) {
      case 'currentProvince':
        // will get list of district on city id
        if (this.f.currentProvince.value != '' && this.f.currentProvince.value != null) {
          this.category.getDistrictByCityId(this.f.currentProvince.value).subscribe(data => this.categories.currentDistricts = data)
        } else {
          this.categories.currentDistricts = []
          this.cifRegisterForm.get('currentDistrict').setValue(null)
        }
        break;
      case 'currentDistrict':
        // will get list of ward on district id
        if (this.f.currentDistrict.value != '' && this.f.currentDistrict.value != null) {
          this.category.getWardByDistrictId(this.f.currentDistrict.value).subscribe(data => this.categories.currentWards = data)
        } else {
          this.categories.currentWards = []
          this.cifRegisterForm.get('currentWards').setValue(null)
        }
        break;
      case 'permanentProvince':
        // will get list of district on city id
        if (this.f.permanentProvince.value != '' && this.f.permanentProvince.value != null) {
          this.category.getDistrictByCityId(this.f.permanentProvince.value).subscribe(data => this.categories.permanentDistricts = data)
        } else {
          this.categories.permanentDistricts = []
          this.cifRegisterForm.get('permanentDistrict').setValue(null)

        }
        break;
      case 'permanentDistrict':
        // will get list of ward on district id
        if (this.f.permanentDistrict.value != '' && this.f.permanentDistrict.value != null) {
          this.category.getWardByDistrictId(this.f.permanentDistrict.value).subscribe(data => this.categories.permanentWards = data)
        } else {
          this.categories.permanentWards = []
          this.cifRegisterForm.get('permanentWards').setValue(null)
        }
        break;
      default:
        // to do
        break;
    }
  }

  getFieldValidation(fieldName: string) {
    return (this.submitted && this.f[fieldName].errors) || this.formValidator[fieldName]
  }

  cifFormValidator() {
    this.cifForm.cifFieldToValidate.forEach(controlName => {
      this.onInput(controlName)
    })
    return this.formValidator.getFormValidator()
  }
  // create new cif here
  save() {
    this.submitted = true;
    if (this.cifFormValidator()) {
      if (this.detailProcess && this.processId != '' && this.processId != null && this.processId != undefined) {
        //update
        this.cifService.updateCif(new IndividualCif(this.cifRegisterForm.controls, this.processId)).subscribe(
          data => {
            this.errorHandler.messageHandler(data.responseStatus, "Cập nhật CIF thành công!")
            if (data.responseStatus.success == true) {
              this.router.navigate(['./smart-form/manager/customer', { processId: this.processId}]);
            }
          }
          ,error => {
            this.errorHandler.showError(error)
          }
        )
      } else {
        // add new
        this.cifService.openCif(new IndividualCif(this.cifRegisterForm.controls)).subscribe(
          data => {
            this.errorHandler.messageHandler(data.responseStatus, "Mở CIF thành công!")
            if (data.responseStatus.success == true) {
              this.router.navigate(['./smart-form/manager/customer', { processId: data.processId}]);
            }
          }
          ,error => {
            this.errorHandler.showError(error)
          }
        )
      }

    } else {
      if (!this.cifRegisterForm.valid) {
        this.errorHandler.showError('Dữ liệu không hợp lệ')
      } else this.errorHandler.showError('Có lỗi xày ra')
    }

  }
  onCheckSameAddress(checked: boolean) {
    if (checked) {
      this.categories.permanentDistricts = this.categories.currentDistricts
      this.categories.permanentWards = this.categories.currentWards
      this.cifRegisterForm.controls['permanentCountry'].setValue(this.cifRegisterForm.get('currentCountry').value)
      this.cifRegisterForm.controls['permanentProvince'].setValue(this.cifRegisterForm.get('currentProvince').value)
      this.cifRegisterForm.controls['permanentDistrict'].setValue(this.cifRegisterForm.get('currentDistrict').value)
      this.cifRegisterForm.controls['permanentWards'].setValue(this.cifRegisterForm.get('currentWards').value)
      this.cifRegisterForm.controls['permanentAddress'].setValue(this.cifRegisterForm.get('currentAddress').value)
    } else {
      this.cifRegisterForm.controls['permanentCountry'].setValue(null)
      this.cifRegisterForm.controls['permanentProvince'].setValue(null)
      this.cifRegisterForm.controls['permanentDistrict'].setValue(null)
      this.cifRegisterForm.controls['permanentWards'].setValue(null)
      this.cifRegisterForm.controls['permanentAddress'].setValue('')
    }
    this.onInput('permanentCountry')
    this.onInput('permanentProvince')
    this.onInput('permanentDistrict')
    this.onInput('permanentWards')
    this.onInput('permanentAddress')
  }
  onNgSelectStartup() {
    this.cifRegisterForm.get('currentCountry').setValue(null)
    this.cifRegisterForm.get('currentProvince').setValue(null)
    this.cifRegisterForm.get('currentDistrict').setValue(null)
    this.cifRegisterForm.get('currentWards').setValue(null)

    this.cifRegisterForm.get('permanentCountry').setValue(null)
    this.cifRegisterForm.get('permanentProvince').setValue(null)
    this.cifRegisterForm.get('permanentDistrict').setValue(null)
    this.cifRegisterForm.get('permanentWards').setValue(null)

    this.cifRegisterForm.get('branch').setValue(null)
    this.cifRegisterForm.get('nationality').setValue(null)
    this.cifRegisterForm.get('birthPlace').setValue(null)
    this.cifRegisterForm.get('job').setValue(null)
    this.cifRegisterForm.get('salary').setValue(null)

  }
  onNationalityChange() {
    let nationality = this.cifRegisterForm.get('nationality').value
    // show FATCA information when nationality is US
    this.showFatca = nationality == 'US'
    this.showVisa = nationality != 'VN' && nationality != null
    if (!this.showVisa) {
      this.cifRegisterForm.get('freeVisa').setValue(null)
      this.cifRegisterForm.get('visaIssueDate').setValue(null)
      this.cifRegisterForm.get('visaExpireDate').setValue(null)
    }
  }
  getValidatorMessage(formControl: string) {
    let control = this.cifRegisterForm.get(formControl)
    if (control.errors) {
      if (control.errors.required) {
        return 'không được để trống'
      } else if (control.errors.maxlength) {
        return `không được vượt quá ${control.errors.maxlength.requiredLength} ký tự`
      }
    }
  }
  showUpdate() {
    return this.detailProcess && this.detailProcess.processId
  }
  backPage() {
    this._location.back();
  }
  getMinDate() {
    let birthDate = this.cifRegisterForm.get('birthday').value
    let defaultMinDate = '1900-12-31'
    if (birthDate != '' && birthDate != null && birthDate != undefined) {
      return birthDate
    } else return defaultMinDate
  }
  objMis:any
  showPopupMIS(){
    let dialogRef = this.dialog.open(MisCifComponent,DialogConfig.configInfomationPopupCIF(this.objMis))
    dialogRef.afterClosed().subscribe(rs => {
      if (rs.index == 1) {
        this.objMis = rs.obj
        // this.router.navigate(['./smart-form/registerService']);
      }
    }
    )
  }
  showPopupUDF(){
    let dialogRef = this.dialog.open(UdfCifComponent,DialogConfig.configInfomationPopupCIF(null))
    dialogRef.afterClosed().subscribe(rs => {
      if (rs == 1) {
        // this.router.navigate(['./smart-form/registerService']);
      }
    }
    )
  }
}
