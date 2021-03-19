import { Component, OnInit, Inject, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {UserFormValidator, UserInfo, UserUpdateForm} from "../../_models/user";
import {FormGroup} from "@angular/forms";
import {ThemePalette} from "@angular/material/core";
import {BranchModels} from "../../_models/branch";
import {Title} from "../../_models/title";
import {TitleService} from "../../_services/title.service";
import {UserService} from "../../_services/user.service";
import {NotificationService} from "../../_toast/notification_service";
import { RoleService } from 'src/app/_services/role.service';
import { Role } from 'src/app/_models/role';

@Component({
  selector: 'app-popup-system-edit-user',
  templateUrl: './popupp-system-edit-user.component.html',
  styleUrls: ['./popupp-system-edit-user.component.scss']
})
export class PopupSystemEditUserComponent implements OnInit {
  color: ThemePalette = 'primary'
  // this is hard fix data
  selectAllTitle: boolean
  isUnlocked: boolean= false
  lstBranch: BranchModels[] = []
  lstTitles: Title[] = []
  userForm: FormGroup
  userInfo: UserInfo
  errorCodes: []
  formValidator: UserFormValidator
  submitted: boolean
  dropdownSettings: any = {}
  selectedItems: any[]
  userUpdateForm: UserUpdateForm
  lstRoles:Role[] = []
  selectAllRoles: boolean
  constructor(@Inject(MAT_DIALOG_DATA)public data:any,
              private dialogRef:MatDialogRef<PopupSystemEditUserComponent>,
              private titleService: TitleService,
              private userService: UserService,
              private notificationService: NotificationService,
              private _el: ElementRef,private rolesService:RoleService
  ) { }
  ngOnInit() {
    this.lstRoles = this.data.data.lstRoles
    this.userUpdateForm = new UserUpdateForm(this.data.data, this.isUnlocked)
    this.userFormConstructor()
    this.formValidatorConstructor()
    this.onUnlockedChange()
    this.getLstBranch()
    this.getLstTitle()
    // this.getLstRoles()
  }
  // getLstRoles() {
  //   this.rolesService.getLstAllRoles().subscribe(rs => {
  //     this.lstRole = rs.items
  //   }, err => {
  //     this.lstRole = null
  //     // debugger
  //   })
  // }
  formValidatorConstructor() {
    this.formValidator = new UserFormValidator()
  }
  userFormConstructor() {
    this.userForm = this.userUpdateForm.userFormGroup
  }
  get f() {
    return this.userForm.controls;
  }
  closeDialog(index: any){
    // 1: add new; 0: cancel request
    this.dialogRef.close(0)

  }
  saveUser(index: any){
    if (index == true) {
      this.submitted = true;
      if (this.userForm.invalid || this.userFormValidator()) {
        return
      }
      this.userInfo = new UserInfo(this.userForm.controls, this.data.data.id);
      this.userService.update(this.userInfo).subscribe(data =>{
          this.messageHandler(data)
        },
        error => {this.notificationService.showError("Có lỗi xảy ra " + error.toString(), "Thông báo")})
    }
  }
  onInput(controlName: string = '') {
    if (controlName == 'titleIds' || controlName == 'branchIds' || controlName == 'roleIds') {
      this.formValidator[controlName] = this.userForm.get(controlName).value == null
    } else {
      this.formValidator[controlName] = this.userForm.get(controlName).value.trim() == ""
    }
  }
  keyPress(event: KeyboardEvent) {
    const initalValue = event.key
    this._el.nativeElement.value = initalValue.replace(/[a-zA-Z0-9]*/g, '');
    if (initalValue.indexOf(' ') >= 0) {
      event.preventDefault();
    }else{
      if(initalValue === this._el.nativeElement.value){
        event.preventDefault();
      }
    }
  }
  keyPressSpace(event: KeyboardEvent) {
    const initalValue = event.key
    if (initalValue.indexOf(' ') >= 0) {
      event.preventDefault();
    }
  }
  keyPressSymbol(event: KeyboardEvent) {
    const initalValue = event.key
    this._el.nativeElement.value = initalValue.replace(/[a-zA-Z0-9]*/g, '');
    if(initalValue === this._el.nativeElement.value){
      event.preventDefault();
    }
  }
  userFormValidator() {
    this.userUpdateForm.fieldToValidate.forEach(controlName => {
      this.onInput(controlName)
    })
    return this.formValidator.validate()
  }
  messageHandler(data: any) {
    let resStatusSuccess = data.responseStatus.success
    if (resStatusSuccess == true) {
      //notice success
      this.notificationService.showSuccess("Cập nhật người dùng thành công", "Thông báo")
      this.dialogRef.close(1);
    } else {
      //notice fail
      data.responseStatus.codes.map(code => {
        // if(code.code == "204" || code.code == "201"){
        //   let errorMsg = code.detail + ': ' + code.msg
        //   this.notificationService.showError(errorMsg, "Thông báo")
        // }else 
        if(code.code == "204" || code.code == "201"){
          let errorMsg = code.detail + ': ' + code.msg
          this.notificationService.showError(errorMsg, "Thông báo")
        }else if(code.code == "302" && code.detail == "userCore exists"){
          this.notificationService.showError("UserCore tồn tại", "Thông báo")
        }else if(code.code == "302" && code.detail == "userName exists"){
          this.notificationService.showError("Username tồn tại", "Thông báo")
        }else if(code.code == "302" && code.detail == "employeeId exists"){
          this.notificationService.showError("Mã nhân viên tồn tại", "Thông báo")
        }
      })
    }
  }

  onUnlockedChange() {
    this.toggleDisable()
    //If user has unlocked right
    if (this.isUnlocked) {
      //get list branch
      // this.getLstBranch()
      //get list title
      // this.getLstTitle()
    }
  }
  // unlock all field
  toggleDisable() {
    this.userUpdateForm.fieldToValidate.forEach(control => {
        this.userForm.get(control).reset({ value: this.userForm.get(control).value, disabled: !this.isUnlocked });
      }
    )
  }
  getLstBranch() {
    let obj = {}
    obj["page"] = 1
    obj["size"] = 1000
    this.titleService.getAllBranch(obj).subscribe(rs => {
      this.lstBranch = rs.items
    }, err => {
    })
  }
  getLstTitle() {
    this.titleService.getAllTitle().subscribe(rs => {
      this.lstTitles = rs.items
      if (this.lstTitles !== null && this.lstTitles.length > 0) {
      } else {
        this.lstTitles = null
      }
    }, err => {
      this.lstTitles = null
    })
  }
  toggleSelectAllTitle(checked: boolean) {
    return checked ?
      this.userForm.get('titleIds').reset({ value: this.lstTitles.map(title => title.id), disabled: !this.isUnlocked }) :
      this.userForm.get('titleIds').reset({ value: [], disabled: !this.isUnlocked })
  }
  toggleSelectAllRoles(checked: boolean) {
    return checked ?
      this.userForm.get('roleIds').reset({ value: this.lstRoles.map(r => r.id), disabled: !this.isUnlocked }) :
      this.userForm.get('roleIds').reset({ value: [], disabled: !this.isUnlocked })
  }
}
