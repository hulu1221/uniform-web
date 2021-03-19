import { Component, OnInit, Inject, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Role } from 'src/app/_models/role';
import { Title } from 'src/app/_models/title';
import { PopupConfirmComponent } from 'src/app/_popup/popup-confirm.component';
import { TitleService } from 'src/app/_services/title.service';
import { NotificationService } from 'src/app/_toast/notification_service';
import { DialogConfig } from 'src/app/_utils/_dialogConfig';
import { isBuffer } from 'util';
@Component({
  selector: 'app-popup-system-edit-title',
  templateUrl: './popup-system-edit-title.component.html',
  styleUrls: ['./popup-system-edit-title.component.scss']
})
export class PopupSystemEditTitleComponent implements OnInit {
  objTitle: Title = new Title()
  dropdownSettings: any = {}
  loginForm: FormGroup
  submitted = false
  validateCode = false
  validateName = false
  ShowFilter = false
  oldStatusCode:any
  selectedItems: any[]
  lstRoles: Role[] = []
  lstStatus = [
    { statusCode: 'A', name: 'Hoạt động' },
    { statusCode: 'I', name: 'Không hoạt động' },
    { statusCode: 'C', name: 'Đóng' }
  ]
  statusCode: any
  code: any
  name: any
  description: any
  roleIds = []
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialog: MatDialog,
    private dialogRef: MatDialogRef<PopupSystemEditTitleComponent>, private titleService: TitleService,
    private notificationService: NotificationService,private _el: ElementRef) { }
  ngOnInit() {
    debugger
    this.lstRoles = this.data.data.lstRoles
    this.loginForm = new FormGroup({
      code: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      description: new FormControl(''),
      statusCode: new FormControl(''),
      role:new FormControl('', Validators.required)
    });
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Chọn tất cả',
      unSelectAllText: 'Hủy chọn tất cả',
      itemsShowLimit: 2,
      allowSearchFilter: this.ShowFilter,
      defaultOpen: false
    }
    this.getDetailId()
  }
  getDetailId(){
    this.titleService.detail(this.data.data.id).subscribe(rs => {
      this.code = rs.item.code
      this.name = rs.item.name
      this.description = rs.item.description
      this.objTitle.id = rs.item.id
      if(rs.item.roleIds !== null){
        this.roleIds = rs.item.roleIds
      }
      this.lstStatus.forEach(e => {
        if (e.statusCode === rs.item.statusCode) {
          this.statusCode = e.statusCode
          this.objTitle.statusCode = this.statusCode
          this.oldStatusCode = this.statusCode
        }
      })
      this.selectedItems = this.getLstRoleMapTitle(rs.item.roleIds)
    })
  }
  getLstRoleMapTitle(roles: any) {
    let returnName = []
    roles = roles !== null ? roles : []
    for (let i = 0; i < this.lstRoles.length; i++) {
      for (let j = 0; j < roles.length; j++) {
        if (this.lstRoles[i].id === roles[j]) {
          returnName.push(this.lstRoles[i])
        }
      }
    }
    return returnName
  }
  get f() {
    return this.loginForm.controls;
  }
  selectTitle(item: any) {
    this.objTitle.statusCode = item
  }
  onDeSelect(items: any) {
    if (this.roleIds.length > 0) {
      this.roleIds = this.roleIds.filter(e => e !== items.id)
    }
  }
  onSelectAll(items: any) {
    items.forEach(e => {
      this.roleIds.push(e.id)
    });
  }
  onItemSelect(item: any) {
    this.roleIds.push(item.id)
    
  }
  onDeSelectAll(items: any) {
    this.roleIds = items.length == 0 ? [] : []
  }
  keyPress(event: KeyboardEvent) {
    const initalValue = event.key
    this._el.nativeElement.value = initalValue.replace(/^[a-z0-9._]$/g, '');
    if (initalValue.indexOf(' ') >= 0) {
      event.preventDefault();
    }else{
      if(initalValue === this._el.nativeElement.value){
        event.preventDefault();
      }
    }
  }
  saveEdit(index: any) {
    let rolIds = []
    this.submitted = true
    if (this.code !== undefined) {
      this.validateCode = this.code.trim() === "" ? true : false
    }
    if (this.name !== undefined) {
      this.validateName = this.name.trim() === "" ? true : false
    }
    if (this.loginForm.invalid || this.validateCode || this.validateName) {
      return;
    }
    this.roleIds.forEach(e => {
      rolIds.push(e)
    });
    rolIds = rolIds.filter((element, i) => i === rolIds.indexOf(element))
    this.objTitle.code = this.code
    this.objTitle.name = this.name
    this.objTitle.description = this.description
    this.objTitle.roleIds = rolIds
    if (this.objTitle.statusCode == this.oldStatusCode) {
      this.callApi(index)
    } else {
      let dialogRef = this.dialog.open(PopupConfirmComponent, DialogConfig.configDialogConfirm(0))
      dialogRef.afterClosed().subscribe(rs => {
        if (rs == 1) {
          this.callApi(index)
        }
      })
    }
  }
  callApi(i:any) {
    this.titleService.updateTitle(this.objTitle).subscribe(rs => {
      for (let index = 0; index < rs.responseStatus.codes.length; index++) {
        if (rs.responseStatus.codes[index].code === "200") {
          this.notificationService.showSuccess("Cập nhập chức danh thành công", "")
          this.dialogRef.close(i);
        } else {
          if(rs.responseStatus.codes[index].code === "302" && rs.responseStatus.codes[index].detail == "code exists"){
            this.notificationService.showError("Mã chức danh đã tồn tại", "")
          }else if(rs.responseStatus.codes[index].code === "302" && rs.responseStatus.codes[index].detail == "name exists"){
            this.notificationService.showError("Tên chức danh đã tồn tại", "")
          }else{
            this.notificationService.showError("Cập nhập chức danh thất bại", "")
          }
        }
      }
    }, err => {

    })
  }
  closeDialog(index: any) {
    this.dialogRef.close(index);
  }
}
