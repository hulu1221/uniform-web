import { Component, OnInit, ElementRef, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe, Location } from "@angular/common";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DetailProcess } from 'src/app/_models/process';
import { MissionService } from 'src/app/services/mission.service';
import { IndivCifService } from 'src/app/_services/indiv-cif.service';
import { ErrorHandlerService } from 'src/app/_services/error-handler.service';
import { NotificationService } from 'src/app/_toast/notification_service';
import { AuthorExpireAndAuthorType, CategoryAuthority } from '../../_models/category/categoryList';
import { CategoryAuthorityService } from 'src/app/_services/category/category.authority.service';
import { ValidatorSpace } from 'src/app/_validator/otp.validator';
import { AccountService } from 'src/app/_services/account.service';
import { AuthorityAccountService } from 'src/app/_services/authority-account.service';
import { AccountModel } from 'src/app/_models/account';
import { AuthorityModel, AuthorizationScope } from 'src/app/_models/authority';
import { ConstantUtils } from 'src/app/_utils/_constant';
import * as moment from 'moment';
declare var $: any;
@Component({
  selector: 'app-update-authority',
  templateUrl: './update-authority.component.html',
  styleUrls: ['./update-authority.component.scss']
})
export class UpdateAuthorityComponent implements OnInit {
  // updateAuthorityForm: FormGroup
  submitted = false
  processId: any
  accountId: any
  id: any
  detailProcess: DetailProcess = new DetailProcess(null)
  categories: CategoryAuthority = new CategoryAuthority()
  lstAuthorType: AuthorExpireAndAuthorType[]
  lstAuthorExpire: AuthorExpireAndAuthorType[]
  objAccount: AccountModel = new AccountModel()
  numberAccount: any
  objAuthority: AuthorityModel = new AuthorityModel()
  objUpdateAuthority: AuthorityModel = new AuthorityModel()
  radioCheck: any
  _constant: ConstantUtils = new ConstantUtils()
  valueOrther: any
  isChecked: boolean
  limitValue: any
  booleanOrther: boolean
  booleanLimitValue: boolean
  orderPVUQ: any[] = []
  booleanPVUQ: boolean
  // radioCheckExpire: any
  checkBoxTrue: boolean
  birthDate: any
  issueDate: any
  startDate: any
  endDate: any
  disableFromdate: boolean
  disableTodate: boolean
  booleanChangeQT1: boolean
  booleanChangeQT2: boolean
  booleanChangeQT3: boolean
  booleanChangeQT4: boolean
  nationCode: string
  national1: boolean = false
  nationalCode1Str: string
  national2: boolean = false
  nationalCode2Str: string
  national3: boolean = false
  nationalCode3Str: string
  lstCountries: any[] = []
  expireAuthorCode: string
  booleanNull2: boolean
  booleanNull3: boolean
  booleanNull4: boolean
  booleanValidForm: boolean
  booleanValidTo: boolean
  booleanDateForm: boolean
  addStr: string = ""
  booleanDateOfbirth: boolean
  booleanDateProvided: boolean
  booleanDateProvidedLessDateOfbirth: boolean
  numberGTXM: any
  returnValueCode: string
  updateAuthorityForm = new FormGroup({
    fullName: new FormControl(null, [Validators.required, ValidatorSpace.cannotContainSpace]),
    typeGTXM: new FormControl('', [Validators.required]),
    numberGTXM: new FormControl(null, [Validators.required, ValidatorSpace.cannotContainSpace]),
    dateProvided: new FormControl('', Validators.required),
    placeProvided: new FormControl(null, [Validators.required, ValidatorSpace.cannotContainSpace]),
    regency: new FormControl(null, [Validators.required, ValidatorSpace.cannotContainSpace]),
    gender: new FormControl('', Validators.required),
    dateOfBirth: new FormControl('', Validators.required),
    nationality: new FormControl(null, Validators.required),
    phoneNumber: new FormControl(null, [Validators.required, ValidatorSpace.cannotContainSpace]),
    job: new FormControl('', Validators.required),
    currentCountry: new FormControl(null, Validators.required),
    permanentCountry: new FormControl(null, Validators.required),
    currentProvince: new FormControl(null, Validators.required),
    permanentProvince: new FormControl(null, Validators.required),
    currentDistrict: new FormControl(null, Validators.required),
    permanentDistrict: new FormControl(null, Validators.required),
    currentWards: new FormControl(null, Validators.required),
    permanentWards: new FormControl(null, Validators.required),
    currentAddress: new FormControl(null, [Validators.required, ValidatorSpace.cannotContainSpace]),
    permanentAddress: new FormControl(null, [Validators.required, ValidatorSpace.cannotContainSpace]),
  })
  @Output() dateOnInput: EventEmitter<any> = new EventEmitter<any>();
  constructor(private router: Router, private cifService: IndivCifService,
    private errorHandler: ErrorHandlerService,
    private notificationService: NotificationService,
    private category: CategoryAuthorityService,
    private route: ActivatedRoute, private _location: Location, private missionService: MissionService,
    private accountService: AccountService,
    private authorityService: AuthorityAccountService,
    private datePipe: DatePipe, private _el: ElementRef) {
  }
  ngOnInit() {
    $('.childName').html('Cập nhật ủy quyền')
    this.processId = this.route.snapshot.paramMap.get('processId')
    this.accountId = this.route.snapshot.paramMap.get('accountId')
    this.id = this.route.snapshot.paramMap.get('id')
    this.route.paramMap.subscribe(paramMap => this.getProcessInformation(paramMap.get('processId')))
    this.getDataSelect()
    this.getDetailAccount(this.accountId)
    this.getDetailAuthority(this.id)
  }
  onInputChange(event: any) {
    this.dateOnInput.emit(moment(event.target.value, 'DD/MM/YYYY'))
  }
  ngAfterViewInit() {

  }
  getProcessInformation(processId) {
    this.missionService.setLoading(true)
    if (processId) {
      this.processId = processId
      this.cifService.detailProcess(processId).subscribe(data => {
        this.detailProcess = new DetailProcess(data.customer)
        this.missionService.setLoading(false)
      },
        error => {
          this.errorHandler.showError(error)
          this.missionService.setLoading(false)
        },
        () => {
          this.missionService.setLoading(false)
          if (!this.detailProcess.processId) this.errorHandler.showError('Không lấy được thông tin hồ sơ')
        }
      )
      this.missionService.setProcessId(processId)
    }
  }
  getDetailAccount(id: any) {
    let obj = {}
    obj["id"] = id
    this.accountService.getDetailAccount(obj).subscribe(data => {
      this.objAccount = data.item
      if (this.objAccount.accountIndex !== null && this.objAccount.accountNumber === null) {
        this.numberAccount = "Tài khoản mới " + this.objAccount.accountIndex
      } else if (this.objAccount.accountIndex !== null && this.objAccount.accountNumber !== null) {
        this.numberAccount = this.objAccount.accountNumber
      }
    })
  }
  addNationality() {
    this.submitted = false
    if (!this.national1) {
      this.national1 = true
      this.booleanNull2 = true
    } else if (!this.national2) {
      this.national2 = true
      this.booleanNull3 = true
    } else if (!this.national3) {
      this.national3 = true
      this.booleanNull4 = true
    }
  }

  changeNational(idx: any) {
    let valueNation = this.updateAuthorityForm.get("nationality").value
    let rsValueNation = valueNation !== null ? valueNation : undefined
    let rsNationalCode1 = this.nationalCode1Str !== null ? this.nationalCode1Str : undefined
    let rsNationalCode2 = this.nationalCode2Str !== null ? this.nationalCode2Str : undefined
    let rsNationalCode3 = this.nationalCode3Str !== null ? this.nationalCode3Str : undefined
    if (idx == 1) {
      this.booleanChangeQT1 = (rsValueNation === rsNationalCode1 && rsNationalCode1 !== undefined)
        || (rsValueNation === rsNationalCode2 && rsNationalCode2 !== undefined) ||
        (rsValueNation === rsNationalCode3 && rsNationalCode3 !== undefined) ? true : false
    } else if (idx == 2) {
      this.booleanChangeQT2 = (rsNationalCode1 === rsValueNation && rsValueNation !== undefined) ||
        (rsNationalCode1 === rsNationalCode2 && rsNationalCode2 !== undefined) ||
        (rsNationalCode1 === rsNationalCode3 && rsNationalCode3 !== undefined) ? true : false
      this.booleanNull2 = rsNationalCode1 == undefined ? true : false
    } else if (idx == 3) {
      this.booleanChangeQT3 = (rsNationalCode2 === rsValueNation && rsValueNation !== undefined) ||
        (rsNationalCode2 === rsNationalCode1 && rsNationalCode1 !== undefined) ||
        (rsNationalCode2 === rsNationalCode3 && rsNationalCode3 !== undefined) ? true : false
      this.booleanNull3 = rsNationalCode2 == undefined ? true : false
    } else if (idx == 4) {
      this.booleanChangeQT4 = (rsNationalCode3 === rsValueNation && rsValueNation !== undefined) ||
        (rsNationalCode3 === rsNationalCode1 && rsNationalCode1 !== undefined) ||
        (rsNationalCode3 === rsNationalCode2 && rsNationalCode2 !== undefined) ? true : false
      this.booleanNull4 = rsNationalCode3 == undefined ? true : false
    }
  }
  removeNationality(idx: any) {
    if (idx == 1) {
      this.national1 = false
    } else if (idx == 2) {
      this.national2 = false
    } else {
      this.national3 = false
    }
  }
  checkValue(event: any, idx: any, item: any) {
    if (event.target.checked) {
      let obj = {}
      if (item.code === this._constant.DEPOSIT_AND_WITHDRAW) {
        this.isChecked = true
      } else if (item.code === this._constant.OTHER) {
        this.booleanOrther = true
      }
      obj["code"] = item.code
      this.orderPVUQ.push(obj)
    } else {
      let returnCheckCode: boolean
      for (let index = 0; index < this.orderPVUQ.length; index++) {
        if (this.orderPVUQ[index].code === item.code) {
          this.orderPVUQ.splice(index, 1)
          break
        }
      }
      if (item.code === this._constant.DEPOSIT_AND_WITHDRAW || item.code === this._constant.ALL) {
        for (let index = 0; index < this.orderPVUQ.length; index++) {
          if (this.orderPVUQ[index].code === this._constant.DEPOSIT_AND_WITHDRAW || this.orderPVUQ[index].code === this._constant.ALL) {
            returnCheckCode = true
            break
          } else {
            returnCheckCode = false
          }
        }
        if (!returnCheckCode) {
          this.isChecked = false
          this.booleanLimitValue = false
        }
      } else if (item.code === this._constant.OTHER) {
        this.booleanOrther = false
      }
    }
    if (this.orderPVUQ.length === 0) {
      this.booleanPVUQ = true
    } else {
      this.booleanPVUQ = false
    }
  }

  getDetailAuthority(id: any) {
    let obj = {}
    obj["id"] = id
    this.authorityService.getDetailAuthority(obj).subscribe(rs => {
      this.objAuthority = rs['item']
      this.lstCountries = this.categories.countries
      this.updateAuthorityForm.get("typeGTXM").setValue(this.objAuthority.perDocTypeName)
      this.updateAuthorityForm.get("fullName").setValue(this.objAuthority.fullName)
      this.updateAuthorityForm.get("gender").setValue(this.objAuthority.genderName)
      this.updateAuthorityForm.get("job").setValue(this.objAuthority.industry)
      this.updateAuthorityForm.get("currentCountry").setValue(this.objAuthority.currentCountryCode)
      this.updateAuthorityForm.get("currentAddress").setValue(this.objAuthority.currentStreetNumber)
      this.updateAuthorityForm.get("currentProvince").setValue(this.objAuthority.currentCityCode)
      this.getCurrentDistrictsByCityCodeHT()
      this.updateAuthorityForm.get("nationality").setValue(this.objAuthority.nationality1Code)
      this.nationalCode1Str = this.objAuthority.nationality2Code
      this.nationalCode2Str = this.objAuthority.nationality3Code
      this.nationalCode3Str = this.objAuthority.nationality4Code
      this.national1 = this.objAuthority.nationality2Code !== null ? true : false
      this.national2 = this.objAuthority.nationality3Code !== null ? true : false
      this.national3 = this.objAuthority.nationality4Code !== null ? true : false
      this.updateAuthorityForm.get("permanentCountry").setValue(this.objAuthority.residenceCountryCode)
      this.updateAuthorityForm.get("permanentAddress").setValue(this.objAuthority.residenceStreetNumber)
      this.updateAuthorityForm.get("permanentProvince").setValue(this.objAuthority.residenceCityCode)
      this.getCurrentDistrictsByCityCodeTT()
      this.checkBoxTrue = (this.objAuthority.currentCountryCode === this.objAuthority.residenceCountryCode)
        && (this.objAuthority.currentCityCode === this.objAuthority.residenceCityCode) &&
        (this.objAuthority.currentDistrictCode === this.objAuthority.residenceDistrictCode) &&
        (this.objAuthority.currentWardCode === this.objAuthority.residenceWardCode) &&
        (this.objAuthority.currentStreetNumber === this.objAuthority.residenceStreetNumber) ? true : undefined
      this.updateAuthorityForm.get("numberGTXM").setValue(this.objAuthority.perDocNo)
      this.numberGTXM = this.objAuthority.perDocNo
      let newBirthDate = this.objAuthority.birthDate !== null ? new Date(this.objAuthority.birthDate) : null
      this.birthDate = newBirthDate !== null ? this.datePipe.transform(newBirthDate, 'yyyy-MM-dd') : null
      this.updateAuthorityForm.get("dateOfBirth").setValue(this.birthDate)
      let newIssueDate = this.objAuthority.issueDate !== null ? new Date(this.objAuthority.issueDate) : null
      this.issueDate = newIssueDate !== null ? this.datePipe.transform(newIssueDate, 'yyyy-MM-dd') : null
      this.updateAuthorityForm.get("dateProvided").setValue(this.issueDate)
      let newDateFrom = this.objAuthority.validFrom !== null ? new Date(this.objAuthority.validFrom) : null
      this.startDate = newDateFrom !== null ? this.datePipe.transform(newDateFrom, 'yyyy-MM-dd') : null
      let newDateTo = this.objAuthority.validTo !== null ? new Date(this.objAuthority.validTo) : null
      this.endDate = newDateTo !== null ? this.datePipe.transform(newDateTo, 'yyyy-MM-dd') : null
      this.updateAuthorityForm.get("placeProvided").setValue(this.objAuthority.issuePlace)
      this.updateAuthorityForm.get("phoneNumber").setValue(this.objAuthority.mobilePhone)
      this.radioCheck = this.objAuthority.residence == true ? true : false
      this.updateAuthorityForm.get("regency").setValue(this.objAuthority.position)
      if (this.lstAuthorType !== undefined) {
        for (let index = 0; index < this.objAuthority.authorTypes.length; index++) {
          this.returnCheckBox(this.objAuthority.authorTypes[index])
          if (this.objAuthority.authorTypes[index].authorTypeCode === this._constant.OTHER) {
            this.booleanOrther = true
            this.valueOrther = this.objAuthority.authorTypes[index].authorTypeFreeText
          } else if (this.objAuthority.authorTypes[index].authorTypeCode === this._constant.DEPOSIT_AND_WITHDRAW ||
            this.objAuthority.authorTypes[index].authorTypeCode === this._constant.ALL) {
            this.isChecked = true
            this.onBlurMethod(this.objAuthority.authorTypes[index].limitAmount)
          }
        }
      }
      if(this.lstAuthorExpire !== undefined){
        
        for (let index = 0; index < this.lstAuthorExpire.length; index++) {
          if (this.objAuthority.expireAuthorCode === this.lstAuthorExpire[index].code) {
            this.lstAuthorExpire[index]['checked'] = true
            this.expireAuthorCode = this.objAuthority.expireAuthorCode
            // this.radioCheckExpire = true
          }
          if (this.objAuthority.expireAuthorCode === this._constant.ONE) {
            this.disableTodate = false
            this.disableFromdate = true
            this.returnValueCode = this._constant.ONE
          } else if (this.objAuthority.expireAuthorCode === this._constant.VALID_TIME_RANGE) {
            this.disableTodate = true
            this.disableFromdate = true
          } else {
            this.disableTodate = false
            this.disableFromdate = true
          }
        }
      }
      
    })
  }
  checkDate(event: any, controlName: string) {
    this.updateAuthorityForm.get(controlName).markAsTouched()
    if (event?.isValid()) {
      this.updateAuthorityForm.get(controlName).setValue(event.format('YYYY-MM-DD'))
    } else {
      this.updateAuthorityForm.get(controlName).setValue('')
    }
  }
  dpMessage(controlName: string) {
    switch (controlName) {
      case 'dateOfBirth':
        return 'Ngày sinh không hợp lệ'
        break;
      case 'dateProvided':
        return 'Ngày cấp không hợp lệ'
        break;
      default:
        return ''
        break;
    }
  }
  returnCheckBox(item: any) {
    for (let index = 0; index < this.lstAuthorType.length; index++) {
      let obj = {}
      if (this.lstAuthorType[index].code === item.authorTypeCode) {
        obj["code"] = item.authorTypeCode
        this.lstAuthorType[index]['checked'] = true
        this.orderPVUQ.push(obj)
      }
    }
  }
  getCurrentDistrictsByCityCodeHT() {
    let obj = {}
    obj['cityCode'] = this.objAuthority.currentCityCode
    this.category.apiDistrict(obj).subscribe(rs => {
      this.categories.currentDistricts = rs.items
      this.updateAuthorityForm.get("currentDistrict").setValue(this.objAuthority.currentDistrictCode)
      this.getCurrentWardsByCurrentDistrictsHT()
    })
  }
  getCurrentDistrictsByCityCodeTT() {
    let obj = {}
    obj['cityCode'] = this.objAuthority.currentCityCode
    this.category.apiDistrict(obj).subscribe(rs => {
      this.categories.permanentDistricts = rs.items
      this.updateAuthorityForm.get("permanentDistrict").setValue(this.objAuthority.residenceDistrictCode)
      this.getCurrentWardsByCurrentDistrictsTT()
    })
  }
  getCurrentWardsByCurrentDistrictsHT() {
    let obj = {}
    obj['districtCode'] = this.objAuthority.currentDistrictCode
    this.category.apiWard(obj).subscribe(rs => {
      this.categories.currentWards = rs.items
      this.updateAuthorityForm.get("currentWards").setValue(this.objAuthority.currentWardCode)
    })
  }
  getCurrentWardsByCurrentDistrictsTT() {
    let obj = {}
    obj['districtCode'] = this.objAuthority.currentDistrictCode
    this.category.apiWard(obj).subscribe(rs => {
      this.categories.permanentWards = rs.items
      this.updateAuthorityForm.get("permanentWards").setValue(this.objAuthority.residenceWardCode)
    })
  }

  checkRadioContentAuthority(event: any, value: any) {
    this.booleanValidForm = false
    this.booleanValidTo = false
    this.booleanDateForm = false
    if (event.target.checked && value.code === this._constant.ONE) {
      this.startDate = this.objAuthority.validFrom !== null ? new Date(this.objAuthority.validFrom) : new Date()
      this.endDate = undefined
      this.disableTodate = false
      this.disableFromdate = true
      this.returnValueCode = this._constant.ONE
    } else if (event.target.checked && value.code === this._constant.VALID_TIME_RANGE) {
      this.disableTodate = true
      this.disableFromdate = true
      let endDate = this.objAuthority.validTo !== null ? new Date(this.objAuthority.validTo) : null
      this.endDate = endDate !== null ? this.datePipe.transform(endDate, 'yyyy-MM-dd') : null
      let startDateForm = this.objAuthority.validFrom !== null ? new Date(this.objAuthority.validFrom) : new Date()
      this.startDate = startDateForm !== null ? this.datePipe.transform(startDateForm, 'yyyy-MM-dd') : null
      this.returnValueCode = undefined
    } else {
      let startDateForm = this.objAuthority.validFrom !== null ? new Date(this.objAuthority.validFrom) : new Date()
      this.startDate = startDateForm !== null ? this.datePipe.transform(startDateForm, 'yyyy-MM-dd') : null
      this.endDate = undefined
      this.disableTodate = false
      this.disableFromdate = true
      this.returnValueCode = undefined
    }
    this.expireAuthorCode = value.code
  }
  get f() {
    return this.updateAuthorityForm.controls;
  }
  backPage() {
    this._location.back();
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
    this.limitValue = formatted
  }
  changeTypeGTXM() {
    for (let index = 0; index < this.categories.perDocTypes.length; index++) {
      if (this.categories.perDocTypes[index].name === this.updateAuthorityForm.get("typeGTXM").value) {
        this.updateAuthorityForm.get("numberGTXM").setValue(null)
        this.addStr = null
        break
      }
    }
  }

  keyPress(event: KeyboardEvent) {
    let str = ""
    const initalValue = event.key
    for (let index = 0; index < this.categories.perDocTypes.length; index++) {
      if (this.categories.perDocTypes[index].name === this.updateAuthorityForm.get("typeGTXM").value) {
        // this.updateAuthorityForm.get("numberGTXM").setValue(null)
        str = this.categories.perDocTypes[index].code
        break
      }
    }
    if (str === this._constant.CCCD || str === this._constant.CMTND) {
      this._el.nativeElement.value = initalValue.replace(/[0-9]*/g, '');
      if (initalValue.indexOf(' ') >= 0) {
        event.preventDefault();
      } else {
        if (initalValue === this._el.nativeElement.value) {
          event.preventDefault();
        }
        else {
          // this.addStr = this.addStr + initalValue
          if (this.numberGTXM !== null && this.numberGTXM.length >= 12) {
            event.preventDefault();
          }
        }

      }
    } else if (str === this._constant.HC) {
      this._el.nativeElement.value = initalValue.replace(/[a-zA-Z0-9]*/g, '');
      if (initalValue.indexOf(' ') >= 0) {
        event.preventDefault();
      } else {
        if (initalValue === this._el.nativeElement.value) {
          event.preventDefault();
        }
      }
    }

  }
  checkFromToDate() {
    if (this.expireAuthorCode === this._constant.VALID_TIME_RANGE || this.expireAuthorCode === this._constant.ONE) {
      if (this.objUpdateAuthority.validFrom === "" || this.objUpdateAuthority.validFrom === null) {
        this.booleanValidForm = true
        this.booleanDateForm = false
      }
      if ((this.objUpdateAuthority.validTo === "" || this.objUpdateAuthority.validTo === null) && this.expireAuthorCode !== this._constant.ONE) {
        this.booleanValidTo = true
        this.booleanDateForm = false
      }
      if ((this.objUpdateAuthority.validFrom !== "" && this.objUpdateAuthority.validFrom !== null)
        && (this.objUpdateAuthority.validTo !== "" && this.objUpdateAuthority.validTo !== null)) {
        let dateForm = this.objUpdateAuthority.validFrom !== null ? new Date(this.objUpdateAuthority.validFrom) : null
        let dateTo = this.objUpdateAuthority.validTo !== null ? new Date(this.objUpdateAuthority.validTo) : null
        if (dateForm.getTime() > dateTo.getTime()) {
          this.booleanDateForm = true
          this.booleanValidForm = false
          this.booleanValidTo = false
        } else {
          this.booleanDateForm = false
          this.booleanValidForm = false
          this.booleanValidTo = false
        }
      } else {
        if (this.objUpdateAuthority.validFrom !== null) {
          this.booleanValidForm = false
          this.booleanDateForm = false
        } else if (this.objUpdateAuthority.validTo !== null && this.objUpdateAuthority.validTo !== undefined) {
          this.booleanValidForm = false
          this.booleanValidTo = false
        }
      }
    } else if (this.expireAuthorCode === this._constant.WAIT_UPDATE) {
      if (this.objUpdateAuthority.validFrom === "" || this.objUpdateAuthority.validFrom === null) {
        this.booleanValidForm = true
        this.booleanDateForm = false
      }
    } else {
      this.booleanValidForm = false
      this.booleanDateForm = false
      this.booleanValidTo = false
    }
  }

  checkDateOfBirthAndDateProvided() {
    if (this.updateAuthorityForm.get("dateOfBirth").value !== null && this.updateAuthorityForm.get("dateOfBirth").value !== "") {
      let dateOfBirth = this.updateAuthorityForm.get("dateOfBirth").value
      if (dateOfBirth.getTime() > new Date().getTime()) {
        this.booleanDateOfbirth = true
      } else {
        this.booleanDateOfbirth = false
      }
    }
    if (this.updateAuthorityForm.get("dateProvided").value !== null && this.updateAuthorityForm.get("dateProvided").value !== ""
      && this.updateAuthorityForm.get("dateOfBirth").value !== null && this.updateAuthorityForm.get("dateOfBirth").value !== "") {
      let dateProvided = this.updateAuthorityForm.get("dateProvided").value
      let dateOfBirth = this.updateAuthorityForm.get("dateOfBirth").value
      if (dateProvided.getTime() < dateOfBirth.getTime()) {
        this.booleanDateProvidedLessDateOfbirth = true
      } else {
        this.booleanDateProvidedLessDateOfbirth = false
        this.booleanDateProvided = false
      }
    } else {
      let dateProvided = this.updateAuthorityForm.get("dateProvided").value
      if (dateProvided.getTime() > new Date().getTime()) {
        this.booleanDateProvided = true
      } else {
        this.booleanDateProvided = false
        this.booleanDateProvidedLessDateOfbirth = false
      }
    }
  }
  createAuthority() {
    this.booleanPVUQ = this.orderPVUQ.length === 0 ? true : false
    this.submitted = true
    this.returnObj()
    this.checkFromToDate()
    if (this.isChecked) {
      this.booleanLimitValue = this.limitValue === undefined || this.limitValue === "" ? true : false
    }
    if (this.updateAuthorityForm.invalid || (this.booleanPVUQ || this.booleanLimitValue) ||
      (this.national1 && this.booleanChangeQT2) || (this.national1 && this.booleanNull2) ||
      (this.national2 && this.booleanChangeQT3) || (this.national2 && this.booleanNull3) ||
      (this.national3 && this.booleanChangeQT4) || (this.national3 && this.booleanNull4) ||
      this.booleanValidForm || this.booleanValidTo || this.booleanDateForm || this.booleanDateOfbirth
      || this.booleanDateProvided || this.booleanDateProvidedLessDateOfbirth
    ) {
      return;
    }
    this.authorityService.updateAuthority(this.objUpdateAuthority).subscribe(rs => {
      for (let index = 0; index < rs.responseStatus.codes.length; index++) {
        if (rs.responseStatus.codes[index].code === "200") {
          this.notificationService.showSuccess("Cập nhật ủy quyền thành công", "")
          setTimeout(() => {
            this.router.navigate(['./smart-form/manager/authority', { processId: this.processId, id: this.accountId }])
          }, 1000)
        } else {
          if (rs.responseStatus.codes[index].code === "204") {
            this.notificationService.showError(rs.responseStatus.codes[index].detail, "")
          } else {
            this.notificationService.showError("Cập nhật ủy quyền thất bại", "")
          }
        }
      }
    })
  }
  returnObj() {
    this.objUpdateAuthority.accountId = this.accountId
    this.objUpdateAuthority["id"] = this.id
    let genderCode = this.categories.genders.filter(e => e.name === this.updateAuthorityForm.get("gender").value)
    let perDocTypeCode = this.categories.perDocTypes.filter(e => e.name === this.updateAuthorityForm.get("typeGTXM").value)
    let upperName = this.updateAuthorityForm.get("fullName").value
    this.objUpdateAuthority.fullName = upperName.toUpperCase()
    this.objUpdateAuthority.genderCode = genderCode[0].code
    this.objUpdateAuthority.perDocTypeCode = perDocTypeCode[0].code
    this.objUpdateAuthority.perDocNo = this.updateAuthorityForm.get("numberGTXM").value
    this.objUpdateAuthority.issueDate = this.issueDate
    this.objUpdateAuthority.issuePlace = this.updateAuthorityForm.get("placeProvided").value
    this.objUpdateAuthority.residence = this.radioCheck
    this.objUpdateAuthority.position = this.updateAuthorityForm.get("regency").value
    this.objUpdateAuthority.birthDate = this.birthDate
    this.objUpdateAuthority.mobilePhone = this.updateAuthorityForm.get("phoneNumber").value
    // this.objUpdateAuthority.email = this.updateAuthorityForm.get("email").value
    this.objUpdateAuthority.industry = this.updateAuthorityForm.get("job").value
    this.objUpdateAuthority.currentCityCode = this.updateAuthorityForm.get("currentProvince").value
    this.objUpdateAuthority.currentDistrictCode = this.updateAuthorityForm.get("currentDistrict").value
    this.objUpdateAuthority.currentWardCode = this.updateAuthorityForm.get("currentWards").value
    this.objUpdateAuthority.currentStreetNumber = this.updateAuthorityForm.get("currentAddress").value
    this.objUpdateAuthority.residenceDistrictCode = this.updateAuthorityForm.get("permanentDistrict").value
    this.objUpdateAuthority.residenceStreetNumber = this.updateAuthorityForm.get("permanentAddress").value
    this.objUpdateAuthority.residenceCityCode = this.updateAuthorityForm.get("permanentProvince").value
    this.objUpdateAuthority.residenceWardCode = this.updateAuthorityForm.get("permanentWards").value
    this.objUpdateAuthority.residenceStreetNumber = this.updateAuthorityForm.get("permanentAddress").value
    this.objUpdateAuthority.currentCountryCode = this.updateAuthorityForm.get("currentCountry").value
    this.objUpdateAuthority.residenceCountryCode = this.updateAuthorityForm.get("permanentCountry").value
    this.objUpdateAuthority.nationality1Code = this.updateAuthorityForm.get("nationality").value
    this.objUpdateAuthority.nationality2Code = this.nationalCode1Str !== null ? this.nationalCode1Str : undefined
    this.objUpdateAuthority.nationality3Code = this.nationalCode2Str !== null ? this.nationalCode2Str : undefined
    this.objUpdateAuthority.nationality4Code = this.nationalCode3Str !== null ? this.nationalCode3Str : undefined
    let authorTypeCodes = []
    this.orderPVUQ.forEach(e => {
      let obj = new AuthorizationScope()
      obj.authorTypeCode = e.code
      obj.authorTypeFreeText = e.code === this._constant.OTHER ? this.valueOrther : undefined
      obj.limitAmount = e.code === this._constant.DEPOSIT_AND_WITHDRAW || e.code === this._constant.ALL ? Number(this.limitValue.replaceAll('.', '')) : undefined
      authorTypeCodes.push(obj)
    })

    this.objUpdateAuthority.authorTypes = authorTypeCodes
    this.objUpdateAuthority.expireAuthorCode = this.expireAuthorCode
    this.objUpdateAuthority.validFrom = this.startDate
    this.objUpdateAuthority.validTo = this.endDate
    return this.objUpdateAuthority
  }

  onAddressChange(controlName: string) {
    switch (controlName) {
      case 'currentProvince':
        // will get list of district on city id
        if (this.f.currentProvince.value != '' && this.f.currentProvince.value != null) {
          this.category.getDistrictByCityId(this.f.currentProvince.value).subscribe(data => this.categories.currentDistricts = data)
          this.updateAuthorityForm.get('currentDistrict').setValue(null)
          this.updateAuthorityForm.get('currentWards').setValue(null)
        } else {
          this.categories.currentDistricts = []
          this.updateAuthorityForm.get('currentDistrict').setValue(null)
          this.categories.currentWards = []
          this.updateAuthorityForm.get('currentWards').setValue(null)
        }
        break;
      case 'currentDistrict':
        // will get list of ward on district id
        if (this.f.currentDistrict.value != '' && this.f.currentDistrict.value != null) {
          this.category.getWardByDistrictId(this.f.currentDistrict.value).subscribe(data => this.categories.currentWards = data)
          this.updateAuthorityForm.get('currentWards').setValue(null)
        } else {
          this.categories.currentWards = []
          this.updateAuthorityForm.get('currentWards').setValue(null)
        }
        break;
      case 'permanentProvince':
        // will get list of district on city id
        if (this.f.permanentProvince.value != '' && this.f.permanentProvince.value != null) {
          this.category.getDistrictByCityId(this.f.permanentProvince.value).subscribe(data => this.categories.permanentDistricts = data)
          this.updateAuthorityForm.get('permanentDistrict').setValue(null)
          this.updateAuthorityForm.get('permanentWards').setValue(null)
        } else {
          this.categories.permanentDistricts = []
          this.updateAuthorityForm.get('permanentDistrict').setValue(null)
          this.categories.permanentWards = []
          this.updateAuthorityForm.get('permanentWards').setValue(null)
        }
        break;
      case 'permanentDistrict':
        // will get list of ward on district id
        if (this.f.permanentDistrict.value != '' && this.f.permanentDistrict.value != null) {
          this.category.getWardByDistrictId(this.f.permanentDistrict.value).subscribe(data => this.categories.permanentWards = data)
          this.updateAuthorityForm.get('permanentWards').setValue(null)
        } else {
          this.categories.permanentWards = []
          this.updateAuthorityForm.get('permanentWards').setValue(null)
        }
        break;
      default:
        // to do
        break;
    }
  }
  getDataSelect() {
    this.category.getGenders().subscribe(data => this.categories.genders = data)
    this.category.getPerDocTypes().subscribe(data => this.categories.perDocTypes = data)
    this.category.getCountries().subscribe(data => this.categories.countries = data)
    this.category.getCities().subscribe(data => this.categories.cites = data)
    this.category.getIndustries().subscribe(data => this.categories.industries = data)
    this.category.getLstAuthorType().subscribe(data => {
      this.lstAuthorType = data
    })
    this.category.getLstAuthorExpire().subscribe(data => {
      this.lstAuthorExpire = data
    })
  }
  onCloneAddress(event: any) {
    if (event.target.checked) {
      this.categories.permanentDistricts = this.categories.currentDistricts
      this.categories.permanentWards = this.categories.currentWards
      this.updateAuthorityForm.get('permanentCountry').setValue(this.updateAuthorityForm.get('currentCountry').value)
      this.updateAuthorityForm.get('permanentProvince').setValue(this.updateAuthorityForm.get('currentProvince').value)
      this.updateAuthorityForm.get('permanentDistrict').setValue(this.updateAuthorityForm.get('currentDistrict').value)
      this.updateAuthorityForm.get('permanentWards').setValue(this.updateAuthorityForm.get('currentWards').value)
      this.updateAuthorityForm.get('permanentAddress').setValue(this.updateAuthorityForm.get('currentAddress').value)
    } else {
      this.updateAuthorityForm.get('permanentCountry').setValue(null)
      this.updateAuthorityForm.get('permanentProvince').setValue(null)
      this.updateAuthorityForm.get('permanentDistrict').setValue(null)
      this.updateAuthorityForm.get('permanentWards').setValue('')
      this.updateAuthorityForm.get('permanentAddress').setValue('')
    }
  }

}
