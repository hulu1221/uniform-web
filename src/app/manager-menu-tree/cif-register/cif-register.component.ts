import { Component, OnInit } from '@angular/core';
import {CategoryList} from '../../_models/category/categoryList';
import {CategoryService} from '../../_services/category/category.service';
import {ActivatedRoute, Router} from '@angular/router';
import {IndivCifService} from '../../_services/indiv-cif.service';
import {Location} from '@angular/common';
import {ErrorHandlerService} from '../../_services/error-handler.service';
import {GeneralInformationCIF} from '../../_models/CustomerInformationFile';
import {FormGroup, Validators} from '@angular/forms';
import {cifFormValidator} from '../../_models/cif';
import {DetailProcess} from '../../_models/process';
import {Bigger3Date, Bigger3Date2, Bigger3Date3, BiggerDate, futureDate, pastDate} from '../../_validator/cif.register.validator';
import {MisCifComponent} from '../../manager-smart-form/mis-cif/mis-cif.component';
import {DialogConfig} from '../../_utils/_dialogConfig';
import {UdfCifComponent} from '../../manager-smart-form/udf-cif/udf-cif.component';
import {MatDialog} from '@angular/material/dialog';
import {ConstantUtils} from '../../_utils/_constant';
import {Category} from '../../_models/category/category';
import {CustomerInformationFileForm} from '../../_models/CustomerInformationFileForm';
import * as moment from 'moment';

declare var $: any;
@Component({
  selector: 'app-cif-register',
  templateUrl: './cif-register.component.html',
  styleUrls: ['./cif-register.component.css']
})
export class CifRegisterComponent implements OnInit {
  submitted: boolean
  showUpdate: boolean
  showFatca: boolean
  showVisa: boolean
  constantUtils: ConstantUtils = new ConstantUtils()
  maxPerDocNo: any = {no: '12', no2: '12', no3: '12'}

  cifForm: FormGroup
  categories: CategoryList = new CategoryList()
  formValidator: cifFormValidator = new cifFormValidator()
  cif: CustomerInformationFileForm = new CustomerInformationFileForm()
  cifFieldToValidate: string[] = []

  detailProcess: DetailProcess = new DetailProcess(null)
  userInfo: any
  tmpCountries: any
  tmpCities: any
  tmpCities2: any
  tmpPerDocTypes: any
  nationalityCodes: any = {code2: false, code3: false, code4: false}
  perDocs: any = {code2: false, code3: false}
  objMis:any
  showContentFATCA:boolean
  constructor(private router: Router,
              private route: ActivatedRoute,
              private category: CategoryService,
              private cifService: IndivCifService,
              private _location: Location,
              private errorHandler: ErrorHandlerService,
              private dialog: MatDialog,

  ) { }

  ngOnInit(): void {
    $('.parentName').html('Đăng ký dịch vụ')
    $('.childName').html('Tạo mới khách hàng')
    this.cifForm = this.cif.cifFormGroup
    this.cifFieldToValidate = this.cif.cifFieldToValidate
    this.categoriesLoader()
    this.userInfo = JSON.parse(localStorage.getItem("userInfo"))

    if (true) {
      // create
      this.cifForm.get('branchCode').setValue(this.userInfo.branchCode)
      this.cifForm.get('branchCodeActive').setValue(this.userInfo.branchCode)
      this.cifForm.get('employeeId').setValue(this.userInfo.userCode)
    } else {
      // update
      this.cifForm.get('branchCodeActive').setValue(this.userInfo.userCode)
    }
  }

  get f() {
    return this.cifForm.controls;
  }

  getFieldValidation(fieldName: string) {
    return (this.submitted && this.f[fieldName].errors) || this.formValidator[fieldName]
  }
  cifFormValidator() {
    this.cif.cifFieldToTouch.forEach(controlName => this.f[controlName].markAsTouched())
    this.cifFieldToValidate.forEach(controlName => {
      this.onInput(controlName)
      /**
       * Mở comment phần bên dưới để check xem trường lỗi khi submit; value trường lỗi = false
       */
      // console.log(`${controlName}: ${this.formValidator[controlName]}`);
    })
    return this.formValidator.getFormValidator()
  }
  save() {
    // test
    this.cifFormValidator()
    console.log(this.cifForm.controls);
    console.log(new GeneralInformationCIF(this.cifForm.controls));
    console.log(`Form Valid: ${this.cifFormValidator()}`);
    // end test
    if (this.cifFormValidator()) {
      console.log('start action');
      if (true) {
        //create action
      } else {
        //update action
      }
    } else {
      this.errorHandler.showError('Dữ liệu chưa hợp lệ')
    }
  }
  dpMessage(controlName: string) {
    switch(controlName) {
      case 'birthDate':
        return this.f.birthDate.errors && this.f.birthDate.errors?.futureDate ?
          'Ngày sinh không được lớn hơn ngày hiện tại':
          'Ngày sinh không hợp lệ hoặc không được để trống';
        break;
      case 'issuedDate':
        if (this.f.issuedDate.errors?.required) {
          return 'Ngày cấp không hợp lệ hoặc không được để trống'
          break;
        }
        if (this.f.issuedDate.errors?.futureDate) {
          return 'Ngày cấp không được lớn hơn ngày hiện tại'
          break;
        }
        if (this.cifForm.errors?.biggerDate && this.cifForm.errors?.biggerDate.value == 'issuedDate') {
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
        }
        if (this.cifForm.errors?.biggerDate && this.cifForm.errors?.biggerDate.value == 'expiredDate' && (this.f.expiredDate.dirty)) {
          return 'Ngày hết hiệu lực phải lớn hơn ngày cấp'
          break;
        }
        break;
      case 'issuedDate2':
        if (this.f.issuedDate2.errors?.required) {
          return 'Ngày cấp không hợp lệ hoặc không được để trống'
          break;
        }
        if (this.f.issuedDate2.errors?.futureDate) {
          return 'Ngày cấp không được lớn hơn ngày hiện tại'
          break;
        }
        if (this.cifForm.errors?.biggerDate2 && this.cifForm.errors?.biggerDate2.value == 'issuedDate2') {
          return 'Ngày cấp phải lớn hơn ngày sinh'
          break;
        }
        break;
      case 'expiredDate2':
        if (this.f.expiredDate2.errors?.pastDate) {
          return 'Ngày hết hiệu lực không được nhỏ hơn ngày hiện tại'
          break;
        }
        if (this.f.expiredDate2.errors?.requried) {
          return 'Ngày hết hiệu lực không hợp lệ hoặc không được để trống'
          break;
        }
        if (this.cifForm.errors?.biggerDate2 && this.cifForm.errors?.biggerDate2.value == 'expiredDate2' && (this.f.expiredDate2.dirty)) {
          return 'Ngày hết hiệu lực phải lớn hơn ngày cấp'
          break;
        }
        break;
      case 'issuedDate3':
        if (this.f.issuedDate3.errors?.required) {
          return 'Ngày cấp không hợp lệ hoặc không được để trống'
          break;
        } if (this.f.issuedDate3.errors?.futureDate) {
          return 'Ngày cấp không được lớn hơn ngày hiện tại'
          break;
        }
        if (this.cifForm.errors?.biggerDate3 && this.cifForm.errors?.biggerDate3.value == 'issuedDate3') {
          return 'Ngày cấp phải lớn hơn ngày sinh'
          break;
        }
        break;
      case 'expiredDate3':
        if (this.f.expiredDate3.errors?.pastDate) {
          return 'Ngày hết hiệu lực không được nhỏ hơn ngày hiện tại'
          break;
        }
        if (this.f.expiredDate3.errors?.required) {
          return 'Ngày hết hiệu lực không hợp lệ hoặc không được để trống'
          break;
        }
        if (this.cifForm.errors?.biggerDate3 && this.cifForm.errors?.biggerDate3.value == 'expiredDate3' && (this.f.expiredDate3.dirty)) {
          return 'Ngày hết hiệu lực phải lớn hơn ngày cấp'
          break;
        }
        break;
      default:
        return ''
        break;
    }
  }
  getValidatorMessage(formControl: string) {
    let control = this.cifForm.get(formControl)
    if (control.errors) {
      if (control.errors.required) {
        return 'không được để trống'
      } else if (control.errors.maxlength) {
        return `không được vượt quá ${control.errors.maxlength.requiredLength} ký tự`
      }
    }
  }
  checkDate(event: any, controlName: string) {
    this.cifForm.get(controlName).markAsTouched()
    if (event?.isValid()) {
      this.cifForm.get(controlName).setValue(event.format('YYYY-MM-DD'))
    } else this.cifForm.get(controlName).setValue('')
    this.onInput(controlName)
  }
  expiredDateValidator(startDate: string, endDate: string) {
    let start = moment(new Date(this.cifForm.get(startDate).value))
    let end = moment(new Date(this.cifForm.get(endDate).value))
    let cond = end.diff(start, "day")
    return cond < 0
  }
  onInput(controlName: string, extendAction: boolean = false, order: string = '', value: any = {}) {
    let controlValue = this.cifForm.get(controlName).value
    if (controlValue != undefined) {
      this.totalValidator(controlName)
    } else this.formValidator[controlName] = true
    // console.log(controlName + ' = ' + this.formValidator[controlName] + 'value: ' + this.cifRegisterForm.get(controlName).value.trim())

    if ((controlName == 'perDocType' || controlName == 'perDocType2' || controlName == 'perDocType3') && extendAction == true) {
      this.onPerDocTypeChange(controlName, order)
    }
    if ((controlName == 'currentCountry' || controlName == 'permanentCountry') && extendAction == true) {
      if (this.f.currentCountry.value != 'VN' && this.f.currentCountry.value != 'Vietnam' && this.f.currentCountry.value != 'Việt Nam') {
        this.tmpCities = []
      } else this.tmpCities = this.categories.cites
      if (this.f.permanentCountry.value != 'VN' && this.f.currentCountry.value != 'Vietnam' && this.f.currentCountry.value != 'Việt Nam') {
        this.tmpCities2 = []
      } else this.tmpCities2 = this.categories.cites
    }
    if (extendAction == true && this.cif.cifFieldWhenChangeAddress.includes(controlName)) {
      this.onAddressChange(controlName, value)
    }
    this.onOtherPerDocTypeChange()
  }
  totalValidator(controlName: string) {
    let expiredDate = this.cifForm.get('expiredDate').value
    let expiredDate2 = this.cifForm.get('expiredDate2').value
    let expiredDate3 = this.cifForm.get('expiredDate3').value
    if (controlName == 'expiredDate') {
      // Ngay het han
      this.formValidator[controlName] = this.f.expiredDate.errors || this.cifForm.errors?.biggerDate?.value =='expiredDate' ? true: false
    } else if (controlName == 'issuedDate') {
      //Ngay cap
      this.formValidator[controlName] = this.f.issuedDate.errors || this.cifForm.errors?.biggerDate?.value =='issuedDate' ? true: false
    } else if (controlName == 'expiredDate2') {
      // Ngay het han
      this.formValidator[controlName] = this.f.expiredDate2.errors || this.cifForm.errors?.biggerDate2?.value =='expiredDate2' ? true: false
    } else if (controlName == 'issuedDate2') {
      //Ngay cap
      this.formValidator[controlName] = this.f.issuedDate2.errors || this.cifForm.errors?.biggerDate2?.value =='issuedDate2' ? true: false
    } else if (controlName == 'expiredDate3') {
      // Ngay het han
      this.formValidator[controlName] = this.f.expiredDate3.errors || this.cifForm.errors?.biggerDate3?.value =='expiredDate3' ? true: false
    } else if (controlName == 'issuedDate3') {
      //Ngay cap
      this.formValidator[controlName] = this.f.issuedDate3.errors || this.cifForm.errors?.biggerDate3?.value =='issuedDate3' ? true: false
    }
    else if (controlName == 'birthDate') {
      // Ngay sinh
      this.formValidator[controlName] = this.f.birthDate.errors ? true : false
      if (expiredDate !='' && expiredDate != undefined) { //nếu ngày cấp đã có thì check luôn ngày cấp
        this.formValidator['issuedDate'] = this.f.issuedDate.errors || this.cifForm.errors?.biggerDate?.value =='issuedDate' ? true: false
      }
      if (expiredDate2 !='' && expiredDate2 != undefined) { //nếu ngày cấp đã có thì check luôn ngày cấp
        this.formValidator['issuedDate2'] = this.f.issuedDate2.errors || this.cifForm.errors?.biggerDate2?.value =='issuedDate2' ? true: false
      }
      if (expiredDate3 !='' && expiredDate3 != undefined) { //nếu ngày cấp đã có thì check luôn ngày cấp
        this.formValidator['issuedDate3'] = this.f.issuedDate3.errors || this.cifForm.errors?.biggerDate3?.value =='issuedDate3' ? true: false
      }
    }
    else this.formValidator[controlName] = this.cifForm.get(controlName).errors ? true : false
  }
  onPerDocTypeChange(controlName: string, order: string) {
    let docType = this.cifForm.get(controlName).value
    if (docType == this.constantUtils.CCCD) {
      this.f[`perDocNo${order}`].setValidators([Validators.required, Validators.minLength(12), Validators.maxLength(12)])
      this.maxPerDocNo[`no${order}`] = '12'
    } else if (docType == this.constantUtils.CMTND) {
      this.f[`perDocNo${order}`].setValidators([Validators.required, Validators.maxLength(12)])
      this.maxPerDocNo[`no${order}`] = '12'
    } else {
      this.f[`perDocNo${order}`].setValidators(Validators.required)
      this.maxPerDocNo[`no${order}`] = '50'
    }
    this.f[`perDocNo${order}`].setValue('')
  }
  onCheckSameAddress(checked: boolean) {
    if (checked) {
      this.categories.permanentDistricts = this.categories.currentDistricts
      this.categories.permanentWards = this.categories.currentWards
      this.cifForm.controls['permanentCountry'].setValue(this.cifForm.get('currentCountry').value)
      this.cifForm.controls['permanentProvince'].setValue(this.cifForm.get('currentProvince').value)
      this.cifForm.controls['permanentDistrict'].setValue(this.cifForm.get('currentDistrict').value)
      this.cifForm.controls['permanentWards'].setValue(this.cifForm.get('currentWards').value)
      this.cifForm.controls['permanentAddress'].setValue(this.cifForm.get('currentAddress').value)
    } else {
      this.cifForm.controls['permanentCountry'].setValue(null)
      this.cifForm.controls['permanentProvince'].setValue(null)
      this.cifForm.controls['permanentDistrict'].setValue(null)
      this.cifForm.controls['permanentWards'].setValue(null)
      this.cifForm.controls['permanentAddress'].setValue('')
    }
    this.onInput('permanentCountry')
    this.onInput('permanentProvince')
    this.onInput('permanentDistrict')
    this.onInput('permanentWards')
    this.onInput('permanentAddress')
  }
  onNationalityChange() {
    this.onInput('nationality')
    this.onOtherNationalityChange()
    let nationality = this.cifForm.get('nationality').value
    // show FATCA information when nationality is US
    this.showFatca = nationality == 'US'
    this.showVisa = nationality != 'VN' && nationality != null
    this.cifForm.get('visaExemption').setValue('')
    this.cifForm.get('visaIssueDate').setValue('')
    this.cifForm.get('visaExpireDate').setValue('')
    this.addPerDocValidator()
  }
  onOtherNationalityChange() {
    let excludeCountries = []
    if (this.f.nationality.value != null && this.f.nationality.value != '' && this.f.nationality.value != undefined) {
      excludeCountries.push(this.f.nationality.value)
    }
    if (this.f.nationality2.value != null && this.f.nationality2.value != '' && this.f.nationality2.value != undefined) {
      excludeCountries.push(this.f.nationality2.value)
    }
    if (this.f.nationality3.value != null && this.f.nationality3.value != '' && this.f.nationality3.value != undefined) {
      excludeCountries.push(this.f.nationality3.value)
    }
    if (this.f.nationality4.value != null && this.f.nationality4.value != '' && this.f.nationality4.value != undefined) {
      excludeCountries.push(this.f.nationality4.value)
    }
    this.tmpCountries = this.categories.countries?.filter(
      item => {
        if (!excludeCountries.includes(item.id)) {
          return item
        }
      }
    )
  }
  onOtherPerDocTypeChange() {
    let excludeDocTypes = []
    if (this.f.perDocType.value != null && this.f.perDocType.value != '' && this.f.perDocType.value != undefined) {
      excludeDocTypes.push(this.f.perDocType.value)
    }
    if (this.f.perDocType2.value != null && this.f.perDocType2.value != '' && this.f.perDocType2.value != undefined) {
      excludeDocTypes.push(this.f.perDocType2.value)
    }
    if (this.f.perDocType3.value != null && this.f.perDocType3.value != '' && this.f.perDocType3.value != undefined) {
      excludeDocTypes.push(this.f.perDocType3.value)
    }
    this.tmpPerDocTypes = this.categories.perDocTypes?.filter(
      item => {
        if (!excludeDocTypes.includes(item.id)) {
          item['disable'] = false
          return item
        } else {
          item['disable'] = true
          return item
        }
      }
    )
  }
  onAddressChange(controlName: string, value: Category) {
    let cateId = value.id
    switch(controlName) {
      case 'currentProvince':
        // will get list of district on city id
        if (this.f.currentProvince.value != '' && this.f.currentProvince.value != null) {
          this.category.getDistrictByCityId(cateId).subscribe(data => this.categories.currentDistricts = data)
          this.cifForm.get('currentDistrict').setValue(null)
          this.cifForm.get('currentWards').setValue(null)
        } else {
          this.categories.currentDistricts = []
          this.cifForm.get('currentDistrict').setValue(null)
        }
        break;
      case 'currentDistrict':
        // will get list of ward on district id
        if (this.f.currentDistrict.value != '' && this.f.currentDistrict.value != null) {
          this.category.getWardByDistrictId(cateId).subscribe(data => this.categories.currentWards = data)
          this.cifForm.get('currentWards').setValue(null)
        } else {
          this.categories.currentWards = []
          this.cifForm.get('currentWards').setValue(null)
        }
        break;
      case 'permanentProvince':
        // will get list of district on city id
        if (this.f.permanentProvince.value != '' && this.f.permanentProvince.value != null) {
          this.category.getDistrictByCityId(cateId).subscribe(data => this.categories.permanentDistricts = data)
          this.cifForm.get('permanentDistrict').setValue(null)
          this.cifForm.get('permanentWards').setValue(null)
        } else {
          this.categories.permanentDistricts = []
          this.cifForm.get('permanentDistrict').setValue(null)
        }
        break;
      case 'permanentDistrict':
        // will get list of ward on district id
        if (this.f.permanentDistrict.value != '' && this.f.permanentDistrict.value != null) {
          this.category.getWardByDistrictId(cateId).subscribe(data => this.categories.permanentWards = data)
          this.cifForm.get('permanentWards').setValue(null)
        } else {
          this.categories.permanentWards = []
          this.cifForm.get('permanentWards').setValue(null)
        }
        break;
      default:
        // to do
        break;
    }
  }
  addPerDocValidator() {
    if (this.showVisa == true) {
      if (this.perDocs.code2 == true && this.perDocs.code3 == true) {
        this.cifForm.setValidators([
          Bigger3Date('birthDate', 'issuedDate', 'expiredDate'),
          Bigger3Date2('birthDate', 'issuedDate2', 'expiredDate2'),
          Bigger3Date3('birthDate', 'issuedDate3', 'expiredDate3'),
          BiggerDate('visaIssueDate', 'visaExpireDate')
        ])
        this.cifForm.updateValueAndValidity()
      } else if (this.perDocs.code2 == true && this.perDocs.code3 == false) {
        this.cifForm.setValidators([
          Bigger3Date('birthDate', 'issuedDate', 'expiredDate'),
          Bigger3Date2('birthDate', 'issuedDate2', 'expiredDate2'),
          BiggerDate('visaIssueDate', 'visaExpireDate')
        ])
        this.cifForm.updateValueAndValidity()
      } else if (this.perDocs.code2 == false && this.perDocs.code3 == true) {
        this.cifForm.setValidators([
          Bigger3Date('birthDate', 'issuedDate', 'expiredDate'),
          Bigger3Date3('birthDate', 'issuedDate3', 'expiredDate3'),
          BiggerDate('visaIssueDate', 'visaExpireDate')
        ])
        this.cifForm.updateValueAndValidity()
      } else this.cifForm.setValidators([Bigger3Date('birthDate', 'issuedDate', 'expiredDate'),
        BiggerDate('visaIssueDate', 'visaExpireDate')])
      this.cifForm.updateValueAndValidity()
    } else {
      if (this.perDocs.code2 == true && this.perDocs.code3 == true) {
        this.cifForm.setValidators([
          Bigger3Date('birthDate', 'issuedDate', 'expiredDate'),
          Bigger3Date2('birthDate', 'issuedDate2', 'expiredDate2'),
          Bigger3Date3('birthDate', 'issuedDate3', 'expiredDate3'),
        ])
        this.cifForm.updateValueAndValidity()
      } else if (this.perDocs.code2 == true && this.perDocs.code3 == false) {
        this.cifForm.setValidators([
          Bigger3Date('birthDate', 'issuedDate', 'expiredDate'),
          Bigger3Date2('birthDate', 'issuedDate2', 'expiredDate2'),
        ])
        this.cifForm.updateValueAndValidity()
      } else if (this.perDocs.code2 == false && this.perDocs.code3 == true) {
        this.cifForm.setValidators([
          Bigger3Date('birthDate', 'issuedDate', 'expiredDate'),
          Bigger3Date3('birthDate', 'issuedDate3', 'expiredDate3'),
        ])
        this.cifForm.updateValueAndValidity()
      } else this.cifForm.setValidators([Bigger3Date('birthDate', 'issuedDate', 'expiredDate')])
      this.cifForm.updateValueAndValidity()
    }
  }
  addPerDoc() {
    this.onOtherPerDocTypeChange()
    if (this.perDocs.code2 == false) {
      this.perDocs.code2 = true
      this.f.perDocType2.setValidators([Validators.required])
      this.f.perDocNo2.setValidators(Validators.compose([Validators.required, Validators.maxLength(50)]))
      this.f.issuedPlace2.setValidators(Validators.compose([Validators.required, Validators.maxLength(200)]))
      this.f.issuedDate2.setValidators(Validators.compose([Validators.required, futureDate]))
      this.f.expiredDate2.setValidators(Validators.compose([Validators.required, pastDate]))
      this.f.perDocType2.updateValueAndValidity()
      this.f.perDocNo2.updateValueAndValidity()
      this.f.issuedPlace2.updateValueAndValidity()
      this.f.issuedDate2.updateValueAndValidity()
      this.f.expiredDate2.updateValueAndValidity()
      this.cifFieldToValidate.push('perDocType2', 'perDocNo2', 'issuedPlace2', 'issuedDate2', 'expiredDate2')
      this.addPerDocValidator()
      return
    }
    if (this.perDocs.code3 == false) {
      this.perDocs.code3 = true
      this.f.perDocType3.setValidators([Validators.required])
      this.f.perDocNo3.setValidators(Validators.compose([Validators.required, Validators.maxLength(50)]))
      this.f.issuedPlace3.setValidators(Validators.compose([Validators.required, Validators.maxLength(200)]))
      this.f.issuedDate3.setValidators(Validators.compose([Validators.required, futureDate]))
      this.f.expiredDate3.setValidators(Validators.compose([Validators.required, pastDate]))
      this.f.perDocType3.updateValueAndValidity()
      this.f.perDocNo3.updateValueAndValidity()
      this.f.issuedPlace3.updateValueAndValidity()
      this.f.issuedDate3.updateValueAndValidity()
      this.f.expiredDate3.updateValueAndValidity()
      this.cifFieldToValidate.push('perDocType3', 'perDocNo3', 'issuedPlace3', 'issuedDate3', 'expiredDate3')
      this.addPerDocValidator()
      return
    }
    this.addPerDocValidator()
  }
  removePerDoc(order: number) {
    if (this.perDocs.code2 == true && order == 2) {
      this.perDocs.code2 = false
      this.f.perDocType2.reset('')
      this.f.perDocNo2.reset('')
      this.f.issuedPlace2.reset('')
      this.f.issuedDate2.reset('')
      this.f.expiredDate2.reset('')
      this.f.perDocType2.clearValidators()
      this.f.perDocNo2.clearValidators()
      this.f.issuedPlace2.clearValidators()
      this.f.issuedDate2.clearValidators()
      this.f.expiredDate2.clearValidators()
      this.f.perDocType2.updateValueAndValidity()
      this.f.perDocNo2.updateValueAndValidity()
      this.f.issuedPlace2.updateValueAndValidity()
      this.f.issuedDate2.updateValueAndValidity()
      this.f.expiredDate2.updateValueAndValidity()
      this.onOtherPerDocTypeChange()
      return
    }
    if (this.perDocs.code3 == true && order == 3) {
      this.perDocs.code3 = false
      this.f.perDocType3.reset('')
      this.f.perDocNo3.reset('')
      this.f.issuedPlace3.reset('')
      this.f.issuedDate3.reset('')
      this.f.expiredDate3.reset('')
      this.f.perDocType3.clearValidators()
      this.f.perDocNo3.clearValidators()
      this.f.issuedPlace3.clearValidators()
      this.f.issuedDate3.clearValidators()
      this.f.expiredDate3.clearValidators()
      this.f.perDocType3.updateValueAndValidity()
      this.f.perDocNo3.updateValueAndValidity()
      this.f.issuedPlace3.updateValueAndValidity()
      this.f.issuedDate3.updateValueAndValidity()
      this.f.expiredDate3.updateValueAndValidity()
      this.onOtherPerDocTypeChange()
      return
    }

  }
  addNationality() {
    this.onOtherNationalityChange()
    if (this.nationalityCodes.code2 == false) {
      this.nationalityCodes.code2 = true
      return
    }
    if (this.nationalityCodes.code3 == false) {
      this.nationalityCodes.code3 = true
      return
    }
    if (this.nationalityCodes.code4 == false) {
      this.nationalityCodes.code4 = true
      return
    }
  }
  removeNationality(order: number) {
    debugger
    if (this.nationalityCodes.code2 == true && order == 2) {
      this.nationalityCodes.code2 = false
      this.f.nationality2.reset(null)
      return
    }
    if (this.nationalityCodes.code3 == true && order == 3) {
      this.nationalityCodes.code3 = false
      this.f.nationality3.reset(null)
      return
    }
    if (this.nationalityCodes.code4 == true && order == 4) {
      this.nationalityCodes.code4 = false
      this.f.nationality4.reset(null)
      return
    }
  }

  onVisaExemptionChange() {
    if (this.f.visaExemption.value == '1') {
      this.f.visaIssueDate.setValue('')
      this.f.visaExpireDate.setValue('')
      this.f.visaIssueDate.clearValidators()
      this.f.visaExpireDate.clearValidators()
      this.f.visaIssueDate.markAsUntouched()
      this.f.visaExpireDate.markAsUntouched()
      this.f.visaIssueDate.updateValueAndValidity()
      this.f.visaExpireDate.updateValueAndValidity()
    } else {
      this.f.visaIssueDate.setValidators(Validators.required)
      this.f.visaExpireDate.setValidators(Validators.required)
      this.f.visaIssueDate.markAsUntouched()
      this.f.visaExpireDate.markAsUntouched()
      this.f.visaIssueDate.updateValueAndValidity()
      this.f.visaExpireDate.updateValueAndValidity()
    }
  }
  categoriesLoader() {
    this.categories = new CategoryList();
    this.category.getGenders().subscribe(data => this.categories.genders = data)
    this.category.getPerDocTypes().subscribe(data => {
      this.categories.perDocTypes = data;
      this.tmpPerDocTypes = data
    })
    this.category.getIndustries().subscribe(data => this.categories.industries = data)
    this.category.getMaritalStatus().subscribe(data => this.categories.maritalStatus = data)
    // this.category.getSector().subscribe(data => this.categories.sector = data)
    this.category.getCountries().subscribe(data => {
      this.categories.countries = data;
      this.tmpCountries = data
    })
    this.category.getCities().subscribe(data => {
      this.categories.cites = data;
      this.tmpCities = data
      this.tmpCities2 = data
    })
    // this.category.getPosition().subscribe(data => this.categories.positions = data)
    this.category.getIncomeLevel().subscribe(data => this.categories.incomes = data)
    this.category.getEducation().subscribe(data => this.categories.educations = data)
    this.category.getBranch().subscribe(data => this.categories.branches = data)
  }

  backPage() {
    this._location.back();
  }

  checkRadioFATCA(event: any, index: any){
    if (event.target.checked) {
      if (index === 1) {
        this.showContentFATCA = true
      } else {
        this.showContentFATCA = false
      }
    }
  }
  showPopupMIS(){
    let dialogRef = this.dialog.open(MisCifComponent,DialogConfig.configAddOrDetailUser(this.objMis))
    dialogRef.afterClosed().subscribe(rs => {
      if (rs.index == 1) {
        this.objMis = rs.obj
      }
      }
    )
  }
  showPopupUDF(){
    let dialogRef = this.dialog.open(UdfCifComponent,DialogConfig.configAddOrDetailUser(null))
    dialogRef.afterClosed().subscribe(rs => {
        if (rs == 1) {
        }
      }
    )
  }
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
    taxNumber: 31,
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

    visaExemption: 25,

    visaExpireDate: 27,
    visaIssueDate: 26,
  }
}
