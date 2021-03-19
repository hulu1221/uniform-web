import { Role } from "./role";
import {Title} from "./title";
import {FormControl, FormGroup, Validators} from "@angular/forms";

export class User {
    expires_in: string;
    jti: string;
    refresh_token: string;
    scope: string;
    token_type: string;
    access_token?: string;
    // role:Role
}

export class UserInfo {
  id: string
  department: string
  email: string
  employeeId: string
  fullName: string
  phone: string
  branchIds: string[]
  titleIds: string[]
  // userAd: string
  userCore: string
  userName: string
  validFrom: string
  validTo: string
  roleIds:string[]
  constructor(data: any, id: string = '') {
    this.id = id
    this.department = data.department.value.trim()
    this.email = data.email.value.trim()
    this.employeeId = data.employeeId.value.trim()
    this.fullName = data.fullName.value.trim()
    this.phone = data.phone.value.trim()
    this.branchIds = Array.isArray(data.branchIds.value) ? data.branchIds.value : data.branchIds.value.split(',')
    this.titleIds = data.titleIds.value
    // this.userAd = data.userAd.value.trim()
    this.userCore = data.userCore.value.trim()
    this.userName = data.userName.value.trim()
    this.validFrom = data.validFrom.value
    this.validTo = data.validTo.value
    this.roleIds = data.roleIds.value
  }
}

export class UserUpdateForm {
  userFormGroup: FormGroup
  fieldToValidate = [ "employeeId", "fullName", "department", "phone", "email", "branchIds", "titleIds", "userCore", "userName","roleIds"]
  userFormValidator: UserFormValidator

  constructor(formData: any, viewable: boolean) {
    this.userFormGroup = new FormGroup({
      // userAd: new FormControl({ value: formData.userAd, disabled: viewable }, Validators.required, ),
      employeeId: new FormControl({ value: formData.employeeId, disabled: viewable }, Validators.required),
      fullName: new FormControl({ value: formData.fullName, disabled: viewable }, Validators.required),
      department: new FormControl({ value: formData.department, disabled: viewable }, Validators.required),
      phone: new FormControl({ value: formData.phone, disabled: viewable }, Validators.required),
      email: new FormControl({ value: formData.email, disabled: viewable }, Validators.required),
      validFrom: new FormControl({ value: formData.validFrom, disabled: true }),
      validTo: new FormControl({ value: formData.validTo, disabled: true }),
      branchIds: new FormControl({ value: formData.branchIds, disabled: viewable }, Validators.required),
      titleIds: new FormControl({ value: formData.titleIds, disabled: viewable },Validators.required),
      userCore: new FormControl({ value: formData.userCore, disabled: viewable }, Validators.required),
      userName: new FormControl({ value: formData.userName, disabled: viewable }, Validators.required),
      roleIds: new FormControl({ value: formData.roleIds, disabled: viewable }),
    })
    this.userFormValidator = new UserFormValidator()
  }
  f() {
    return this.userFormGroup.controls
  }
}

export class UserFormValidator {
    // userAd: boolean
    employeeId: boolean
    fullName: boolean
    department: boolean
    phone: boolean
    email: boolean
    branchIds: boolean
    titleIds: boolean
    userCore: boolean
    userName: boolean
    roleIds:boolean
  validate() {
      // return this.userAd &&
         return this.employeeId &&
        this.fullName &&
        this.department &&
        this.phone &&
        this.email &&
        this.branchIds &&
        this.titleIds &&
        this.userCore &&
        this.userName && this.roleIds
  }
}
