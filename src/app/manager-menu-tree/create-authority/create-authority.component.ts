import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe, Location } from "@angular/common";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DetailProcess } from 'src/app/_models/process';
import { MissionService } from 'src/app/services/mission.service';
import { IndivCifService } from 'src/app/_services/indiv-cif.service';
import { ErrorHandlerService } from 'src/app/_services/error-handler.service';
import { NotificationService } from 'src/app/_toast/notification_service';
import { Nationality } from 'src/app/_models/nationality';
import { CategoryAuthority } from 'src/app/_models/category/categoryList';
import { ValidatorSpace } from 'src/app/_validator/otp.validator';
import { ElementRef } from '@angular/core';
import { AuthorityModel, AuthorizationScope } from 'src/app/_models/authority';
import { CategoryAuthorityService } from 'src/app/_services/category/category.authority.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfig } from 'src/app/_utils/_dialogConfig';
import { PopupSearchComponent } from 'src/app/_popup-search/popup.search.component';
import { AccountService } from 'src/app/_services/account.service';
import { AccountModel } from 'src/app/_models/account';
import { AuthorityAccountService } from 'src/app/_services/authority-account.service';
import { ConstantUtils } from 'src/app/_utils/_constant';
declare var $: any;
import * as moment from 'moment';
@Component({
  selector: 'app-create-authority',
  templateUrl: './create-authority.component.html',
  styleUrls: ['./create-authority.component.scss']
})
export class CreateAuthorityComponent implements OnInit {
  nationalityFormAdds: Nationality[] = []
  isChecked: boolean
  checkAddNationality: boolean
  submitted = false
  lstAuthorType: any = []
  lstAuthorExpire: any = []
  processId: any
  detailProcess: DetailProcess = new DetailProcess(null)
  startDate: any
  endDate: any
  disableFromdate: boolean
  disableTodate: boolean
  categories: CategoryAuthority = new CategoryAuthority()
  hiddenInformationCustomer = false
  orderPVUQ: any[] = []
  booleanPVUQ: boolean
  limitValue: any
  checkRadioValue: any
  customer: any
  booleanLimitValue: boolean
  booleanCheckRadio: boolean
  booleanOrther: boolean
  duplicateAddress: boolean
  booleanCheckResident: boolean
  booleanCheckQT: boolean
  valueBooleanResident: boolean
  valueOrther: string
  expireAuthorCode: string
  objCreateAuthority: AuthorityModel = new AuthorityModel()
  accountId: string
  booleanChangeQT1: boolean
  booleanChangeQT2: boolean
  booleanChangeQT3: boolean
  booleanChangeQT4: boolean
  nationCode: string
  objAccount: AccountModel = new AccountModel()
  numberAccount: any
  _constant: ConstantUtils = new ConstantUtils()
  booleanValidForm: boolean
  booleanValidTo: boolean
  booleanDateForm: boolean
  addStr: string = null
  viewCountry: any = []
  returnButton: boolean
  national1: boolean = false
  nationalCode1Str: string
  national2: boolean = false
  nationalCode2Str: string
  national3: boolean = false
  nationalCode3Str: string
  booleanNull2: boolean
  booleanNull3: boolean
  booleanNull4: boolean
  lstCountriesNew:any [] = []
  returnValueCode:string
  createAuthorityForm = new FormGroup({
    searchCustomer: new FormControl(null, [Validators.required, ValidatorSpace.cannotContainSpace]),
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
    currentWards: new FormControl('', Validators.required),
    permanentWards: new FormControl('', Validators.required),
    numberHome: new FormControl('', Validators.required),
    currentAddress: new FormControl(null, [Validators.required, ValidatorSpace.cannotContainSpace]),
    permanentAddress: new FormControl(null, [Validators.required, ValidatorSpace.cannotContainSpace]),
  })
  @Output() dateOnInput: EventEmitter<any> = new EventEmitter<any>();
  constructor(private router: Router, private cifService: IndivCifService,
    private errorHandler: ErrorHandlerService,
    private notificationService: NotificationService,
    private category: CategoryAuthorityService,
    private _el: ElementRef,
    private dialog: MatDialog,
    private accountService: AccountService,
    private authorityService: AuthorityAccountService,
    private route: ActivatedRoute, private _location: Location, private missionService: MissionService,
    private datePipe: DatePipe) {
  }
  ngOnInit() {
    this.startDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    $('.childName').html('Thêm ủy quyền')
    this.processId = this.route.snapshot.paramMap.get('processId')
    this.accountId = this.route.snapshot.paramMap.get("accountId")
    this.route.paramMap.subscribe(paramMap => this.getProcessInformation(paramMap.get('processId')))
    this.getDataSelect()
    this.getDetailAccount(this.accountId)
    
  }
  onInputChange(event: any) {
    this.dateOnInput.emit(moment(event.target.value, 'DD/MM/YYYY'))
  }
  searchCustomer() {
    if(this.customer === undefined){
      this.returnButton = true
    }
    if (this.customer !== undefined && !this.createAuthorityForm.get("searchCustomer").errors) {
      let dialogRef = this.dialog.open(PopupSearchComponent, DialogConfig.configDialogSearch(null))
      dialogRef.afterClosed().subscribe(rs => {
        if (rs == 1) {
          this.hiddenInformationCustomer = true
          this.returnButton = false
        }
      })
    }
  }
  checkDate(event: any, controlName: string) {
    this.createAuthorityForm.get(controlName).markAsTouched()
    if (event?.isValid()) {
      this.createAuthorityForm.get(controlName).setValue(event.format('YYYY-MM-DD'))
    } else {
      this.createAuthorityForm.get(controlName).setValue('')
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
  get f() {
    return this.createAuthorityForm.controls;
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
    }, error => {
    })
  }
  getDataSelect() {
    this.category.getGenders().subscribe(data => this.categories.genders = data)
    this.category.getPerDocTypes().subscribe(data => this.categories.perDocTypes = data)
    this.category.getCountries().subscribe(data => {
      this.categories.countries = data
      this.viewCountry = this.categories.countries.filter(e => e.code === "VN")
      this.createAuthorityForm.get("nationality").setValue(this.viewCountry[0].code)
      this.createAuthorityForm.get("currentCountry").setValue(this.viewCountry[0].code)
      this.createAuthorityForm.get("permanentCountry").setValue(this.viewCountry[0].code)
    })
    this.category.getCities().subscribe(data => this.categories.cites = data)
    this.category.getIndustries().subscribe(data => this.categories.industries = data)
    this.category.getAuthorType().subscribe(data => { this.lstAuthorType = data.items })
    this.category.getAuthorExpire().subscribe(data => { this.lstAuthorExpire = data.items })

  }
  onAddressChange(controlName: string) {
    switch (controlName) {
      case 'currentProvince':
        debugger
        // will get list of district on city id
        if (this.f.currentProvince.value != '' && this.f.currentProvince.value != null) {
          this.category.getDistrictByCityId(this.f.currentProvince.value).subscribe(data => this.categories.currentDistricts = data)
          this.createAuthorityForm.get('currentDistrict').setValue(null)
          this.createAuthorityForm.get('currentWards').setValue('')
        } else {
          this.categories.currentDistricts = []
          this.createAuthorityForm.get('currentDistrict').setValue(null)
        }
        break;
      case 'currentDistrict':
        // will get list of ward on district id
        if (this.f.currentDistrict.value != '' && this.f.currentDistrict.value != null) {
          this.category.getWardByDistrictId(this.f.currentDistrict.value).subscribe(data => this.categories.currentWards = data)
          this.createAuthorityForm.get('currentWards').setValue('')
        } else {
          this.categories.currentWards = []
          this.createAuthorityForm.get('currentWards').setValue(null)
        }
        break;
      case 'permanentProvince':
        // will get list of district on city id
        if (this.f.permanentProvince.value != '' && this.f.permanentProvince.value != null) {
          this.category.getDistrictByCityId(this.f.permanentProvince.value).subscribe(data => this.categories.permanentDistricts = data)
          this.createAuthorityForm.get('permanentDistrict').setValue(null)
          this.createAuthorityForm.get('permanentWards').setValue('')
        } else {
          this.categories.permanentDistricts = []
          this.createAuthorityForm.get('permanentDistrict').setValue(null)
        }
        break;
      case 'permanentDistrict':
        // will get list of ward on district id
        if (this.f.permanentDistrict.value != '' && this.f.permanentDistrict.value != null) {
          this.category.getWardByDistrictId(this.f.permanentDistrict.value).subscribe(data => this.categories.permanentWards = data)
          this.createAuthorityForm.get('permanentWards').setValue('')
        } else {
          this.categories.permanentWards = []
          this.createAuthorityForm.get('permanentWards').setValue(null)
        }
        break;
      default:
        // to do
        break;
    }
  }
  
  checkRadioContentAuthority(event: any, value: any) {
    this.booleanValidForm = false
    this.booleanValidTo = false
    this.booleanDateForm = false
    if (event.target.checked && value.code === this._constant.ONE) {
      this.startDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
      this.disableTodate = false
      this.disableFromdate = true
      this.returnValueCode = this._constant.ONE
    } else if (event.target.checked && value.code === this._constant.VALID_TIME_RANGE) {
      this.disableTodate = true
      this.disableFromdate = true
      this.startDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
      this.returnValueCode = undefined
    } else {
      this.startDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
      this.disableTodate = false
      this.disableFromdate = true
      this.returnValueCode = undefined
    }
    this.expireAuthorCode = value.code
    this.checkRadioValue = value
    this.booleanCheckRadio = false
  }
  checkRadioResident(event: any, index: any) {
    if (event.target.checked) {
      this.booleanCheckResident = false
      if (index === 1) {
        this.valueBooleanResident = true
      } else {
        this.valueBooleanResident = false
      }
    }
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
  backPage() {
    this._location.back();
  }
  
  addNationality() {
    this.lstCountriesNew = this.categories.countries
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
  removeNationality(idx: any) {
    if (idx == 1) {
      this.national1 = false
    } else if (idx == 2) {
      this.national2 = false
    } else {
      this.national3 = false
    }
  }
  changeNational(idx: any) {
    let valueNation = this.createAuthorityForm.get("nationality").value
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
  checkValue(event: any, idx: any, item: any) {
    if (event.target.checked) {
      if (item.code === this._constant.DEPOSIT_AND_WITHDRAW || item.code === this._constant.ALL) {
        this.isChecked = true
      } else if (item.code === this._constant.OTHER) {
        this.booleanOrther = true
      }
      this.orderPVUQ.push(item)
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
        this.valueOrther = undefined
      }

    }
    if (this.orderPVUQ.length === 0) {
      this.booleanPVUQ = true
    } else {
      this.booleanPVUQ = false
    }

  }
  checkLstAddFormNationality() {
    if (this.nationalityFormAdds.length > 0) {
      for (let index = 0; index < this.nationalityFormAdds.length; index++) {
        if (this.nationalityFormAdds[index].nationlityCode === undefined) {
          this.nationalityFormAdds[index]["checked"] = true
        } else {
          this.nationalityFormAdds[index]["checked"] = false
        }
      }
      for (let index = 0; index < this.nationalityFormAdds.length; index++) {
        if (this.nationalityFormAdds[index]["checked"] === true) {
          this.booleanCheckQT = true
          break
        } else {
          this.booleanCheckQT = false
        }
      }
    } else {
      this.booleanCheckQT = false
    }
  }
  changeTypeGTXM() {
    for (let index = 0; index < this.categories.perDocTypes.length; index++) {
      if (this.categories.perDocTypes[index].name === this.createAuthorityForm.get("typeGTXM").value) {
        this.createAuthorityForm.get("numberGTXM").setValue(null)
        this.addStr = null
        break
      }
    }
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

    formatted = output.length > 0 ? output.reverse().join("") : output
    this.limitValue = formatted
  }
  keyPressOnlyNUmber(event: KeyboardEvent) {
    const initalValue = event.key
    this._el.nativeElement.value = initalValue.replace(/[0-9]*/g, '');
    if (initalValue.indexOf(' ') >= 0) {
      event.preventDefault();
    } else {
      if (initalValue === this._el.nativeElement.value) {
        event.preventDefault();
      }
    }
  }
  keyPress(event: KeyboardEvent) {
    let str = ""
    const initalValue = event.key
    // let keyId = event.keyCode
    for (let index = 0; index < this.categories.perDocTypes.length; index++) {
      if (this.categories.perDocTypes[index].name === this.createAuthorityForm.get("typeGTXM").value) {
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
          if (this.addStr !== null && this.addStr.length >= 12) {
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
  returnObj() {
    this.objCreateAuthority.accountId = this.accountId
    let genderCode = this.categories.genders.filter(e => e.name === this.createAuthorityForm.get("gender").value)
    let perDocTypeCode = this.categories.perDocTypes.filter(e => e.name === this.createAuthorityForm.get("typeGTXM").value)
    let upperName = this.createAuthorityForm.get("fullName").value
    this.objCreateAuthority.fullName = upperName !== null ? upperName.toUpperCase().trim() : null
    this.objCreateAuthority.genderCode = genderCode.length > 0 ? genderCode[0].code : null
    this.objCreateAuthority.perDocTypeCode = perDocTypeCode.length > 0 ? perDocTypeCode[0].code : null
    this.objCreateAuthority.perDocNo = this.createAuthorityForm.get("numberGTXM").value
    this.objCreateAuthority.issueDate = this.createAuthorityForm.get("dateProvided").value !== "" ||
    this.createAuthorityForm.get("dateProvided").value !== null ? this.datePipe.transform(this.createAuthorityForm.get("dateProvided").value, 'yyyy-MM-dd') : null
    this.objCreateAuthority.issuePlace = this.createAuthorityForm.get("placeProvided").value
    this.objCreateAuthority.residence = this.valueBooleanResident
    this.objCreateAuthority.position = this.createAuthorityForm.get("regency").value
    this.objCreateAuthority.birthDate = this.createAuthorityForm.get("dateOfBirth").value !== "" ||
    this.createAuthorityForm.get("dateOfBirth").value !== null ? this.datePipe.transform(this.createAuthorityForm.get("dateOfBirth").value, 'yyyy-MM-dd') : null
    this.objCreateAuthority.mobilePhone = this.createAuthorityForm.get("phoneNumber").value
    // this.objCreateAuthority.email = this.createAuthorityForm.get("email").value
    this.objCreateAuthority.industry = this.createAuthorityForm.get("job").value
    this.objCreateAuthority.currentCityCode = this.createAuthorityForm.get("currentProvince").value
    this.objCreateAuthority.currentDistrictCode = this.createAuthorityForm.get("currentDistrict").value
    this.objCreateAuthority.currentWardCode = this.createAuthorityForm.get("currentWards").value
    this.objCreateAuthority.currentStreetNumber = this.createAuthorityForm.get("currentAddress").value
    this.objCreateAuthority.residenceDistrictCode = this.createAuthorityForm.get("permanentDistrict").value
    this.objCreateAuthority.residenceStreetNumber = this.createAuthorityForm.get("permanentAddress").value
    this.objCreateAuthority.residenceCityCode = this.createAuthorityForm.get("permanentProvince").value
    this.objCreateAuthority.residenceWardCode = this.createAuthorityForm.get("permanentWards").value
    this.objCreateAuthority.residenceStreetNumber = this.createAuthorityForm.get("permanentAddress").value
    this.objCreateAuthority.currentCountryCode = this.createAuthorityForm.get("currentCountry").value
    this.objCreateAuthority.residenceCountryCode = this.createAuthorityForm.get("permanentCountry").value
    this.objCreateAuthority.nationality1Code = this.createAuthorityForm.get("nationality").value
    this.objCreateAuthority.nationality2Code = this.nationalCode1Str !== null ? this.nationalCode1Str : undefined
    this.objCreateAuthority.nationality3Code = this.nationalCode2Str !== null ? this.nationalCode2Str : undefined
    this.objCreateAuthority.nationality4Code = this.nationalCode3Str !== null ? this.nationalCode3Str : undefined
    let authorTypeCodes = []
    this.orderPVUQ.forEach(e => {
      let obj = new AuthorizationScope()
      obj.authorTypeCode = e.code
      obj.authorTypeFreeText = e.code === this._constant.OTHER ? this.valueOrther : undefined
      obj.limitAmount = e.code === this._constant.DEPOSIT_AND_WITHDRAW || e.code === this._constant.ALL ? Number(this.limitValue.replaceAll('.', '')) : undefined
      authorTypeCodes.push(obj)
    })
    let startDate = this.datePipe.transform(this.startDate, 'yyyy-MM-dd');
    let endDate = this.datePipe.transform(this.endDate, 'yyyy-MM-dd');
    this.objCreateAuthority.authorTypes = authorTypeCodes
    this.objCreateAuthority.expireAuthorCode = this.expireAuthorCode
    this.objCreateAuthority.validFrom = startDate
    this.objCreateAuthority.validTo = endDate
    return this.objCreateAuthority
  }
  checkFromToDate() {
    if (this.expireAuthorCode === this._constant.VALID_TIME_RANGE || this.expireAuthorCode === this._constant.ONE) {
      if (this.objCreateAuthority.validFrom === null || this.objCreateAuthority.validFrom === undefined) {
        this.booleanValidForm = true
        this.booleanDateForm = false
      }
      if ((this.objCreateAuthority.validTo === null || this.objCreateAuthority.validTo === undefined) && this.expireAuthorCode !== this._constant.ONE) {
        this.booleanValidTo = true
        this.booleanDateForm = false
      }
      if ((this.objCreateAuthority.validFrom !== null && this.objCreateAuthority.validFrom !== undefined)
        && (this.objCreateAuthority.validTo !== null && this.objCreateAuthority.validTo !== undefined)) {
        let dateForm = this.objCreateAuthority.validFrom !== null ? new Date(this.objCreateAuthority.validFrom) : null
        let dateTo = this.objCreateAuthority.validTo !== null ? new Date(this.objCreateAuthority.validTo) : null
        if (dateForm.getTime() > dateTo.getTime()) {
          this.booleanDateForm = true
          this.booleanValidForm = false
          this.booleanValidTo = false
        } else {
          this.booleanDateForm = false
          this.booleanValidForm = false
          this.booleanValidTo = false
        }
      }else{
        if(this.objCreateAuthority.validFrom !== null){
          this.booleanValidForm = false
          this.booleanDateForm = false
        }else if(this.objCreateAuthority.validTo !== null && this.objCreateAuthority.validTo !== undefined){
          this.booleanValidForm = false
          this.booleanValidTo = false
        }
      }
    } else if (this.expireAuthorCode === this._constant.WAIT_UPDATE) {
      if (this.objCreateAuthority.validFrom === "" || this.objCreateAuthority.validFrom === null) {
        this.booleanValidForm = true
        this.booleanDateForm = false
      }
    } else {
      this.booleanValidForm = false
      this.booleanDateForm = false
      this.booleanValidTo = false
    }

  }
  booleanDateOfbirth:boolean
  booleanDateProvided:boolean
  booleanDateProvidedLessDateOfbirth:boolean
  checkDateOfBirthAndDateProvided(){
    if(this.createAuthorityForm.get("dateOfBirth").value !== null && this.createAuthorityForm.get("dateOfBirth").value !== ""){
      let dateOfBirth = this.createAuthorityForm.get("dateOfBirth").value
      if(dateOfBirth.getTime() > new Date().getTime()){
        this.booleanDateOfbirth = true
      }else{
        this.booleanDateOfbirth = false
      }
    }
    if(this.createAuthorityForm.get("dateProvided").value !== null && this.createAuthorityForm.get("dateProvided").value !== ""
    && this.createAuthorityForm.get("dateOfBirth").value !== null && this.createAuthorityForm.get("dateOfBirth").value !== ""){
      let dateProvided = this.createAuthorityForm.get("dateProvided").value
      let dateOfBirth = this.createAuthorityForm.get("dateOfBirth").value
      if(dateProvided.getTime() < dateOfBirth.getTime()){
        this.booleanDateProvidedLessDateOfbirth = true
      }else{
        this.booleanDateProvidedLessDateOfbirth = false
        this.booleanDateProvided = false
      }
    }else{
      let dateProvided = this.createAuthorityForm.get("dateProvided").value
      if(dateProvided.getTime() > new Date().getTime()){
        this.booleanDateProvided = true
      }else{
        this.booleanDateProvided = false
        this.booleanDateProvidedLessDateOfbirth = false
      }
    }
  }
  createAuthority() {
    this.returnButton = true
    if (this.hiddenInformationCustomer) {
      this.booleanPVUQ = this.orderPVUQ.length === 0 ? true : false
      this.booleanCheckRadio = this.checkRadioValue === undefined ? true : false
      if (this.isChecked) {
        this.booleanLimitValue = this.limitValue === undefined ? true : false
      }
      this.submitted = true
      this.checkLstAddFormNationality()
      if ((this.booleanCheckResident === undefined && this.hiddenInformationCustomer) || (this.booleanCheckResident === undefined && !this.hiddenInformationCustomer)) {
        this.booleanCheckResident = true
      } else {
        this.booleanCheckResident = this.booleanCheckResident ? true : false
      }
      this.returnObj()
      this.checkFromToDate()
      this.checkDateOfBirthAndDateProvided()
      if (this.createAuthorityForm.invalid &&
        this.booleanCheckQT || this.booleanCheckResident ||
        (this.booleanPVUQ || this.booleanLimitValue) &&
        this.booleanCheckRadio || !this.hiddenInformationCustomer ||
        (this.national1 && this.booleanChangeQT2) || (this.national1 && this.booleanNull2) ||
      (this.national2 && this.booleanChangeQT3) || (this.national2 && this.booleanNull3) ||
      (this.national3 && this.booleanChangeQT4) || (this.national3 && this.booleanNull4) ||
      this.booleanValidForm || this.booleanValidTo || this.booleanDateForm || this.booleanDateOfbirth
      || this.booleanDateProvided || this.booleanDateProvidedLessDateOfbirth) {
        return;
      }
      this.authorityService.createAuthority(this.objCreateAuthority).subscribe(rs => {
        for (let index = 0; index < rs.responseStatus.codes.length; index++) {
          if (rs.responseStatus.codes[index].code === "200") {
            this.notificationService.showSuccess("Thêm mới ủy quyền thành công", "")
            setTimeout(() => {
              this.router.navigate(['./smart-form/manager/authority', { processId: this.processId, id: this.accountId }]);
            }, 1000);
          } else {
            if (rs.responseStatus.codes[index].code === "204") {
              this.notificationService.showError(rs.responseStatus.codes[index].detail, "")
            } else {
              this.notificationService.showError("Thêm mới ủy quyền thất bại", "")
            }

          }
        }
      }, err => {
        debugger
      })
    }
  }
  onCloneAddress(event: any) {
    if (event.target.checked) {
      this.categories.permanentDistricts = this.categories.currentDistricts
      this.categories.permanentWards = this.categories.currentWards
      this.createAuthorityForm.get('permanentCountry').setValue(this.createAuthorityForm.get('currentCountry').value)
      this.createAuthorityForm.get('permanentProvince').setValue(this.createAuthorityForm.get('currentProvince').value)
      this.createAuthorityForm.get('permanentDistrict').setValue(this.createAuthorityForm.get('currentDistrict').value)
      this.createAuthorityForm.get('permanentWards').setValue(this.createAuthorityForm.get('currentWards').value)
      this.createAuthorityForm.get('permanentAddress').setValue(this.createAuthorityForm.get('currentAddress').value)
    } else {
      this.createAuthorityForm.get('permanentCountry').setValue(null)
      this.createAuthorityForm.get('permanentProvince').setValue(null)
      this.createAuthorityForm.get('permanentDistrict').setValue(null)
      this.createAuthorityForm.get('permanentWards').setValue('')
      this.createAuthorityForm.get('permanentAddress').setValue('')
    }
  }
}
