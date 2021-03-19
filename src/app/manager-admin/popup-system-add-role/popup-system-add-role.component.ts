import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Role } from 'src/app/_models/role';
import { RoleService } from 'src/app/_services/role.service';
import { NotificationService } from 'src/app/_toast/notification_service';
declare var $: any;
@Component({
  selector: 'app-popup-system-add-role',
  templateUrl: './popup-system-add-role.component.html',
  styleUrls: ['./popup-system-add-role.component.scss']
})
export class PopupSystemAddRoleComponent implements OnInit {
    addRoleForm: FormGroup
    submitted = false
    validateCode = false
    validateName = false
    code:any
    name:any
    description:any
    constructor(@Inject(MAT_DIALOG_DATA)public data:any,
    private dialogRef:MatDialogRef<PopupSystemAddRoleComponent>,private notificationService:NotificationService,
    private roleService:RoleService,private _el: ElementRef) { }
    ngOnInit() {
      this.addRoleForm = new FormGroup({
        code: new FormControl('', Validators.required),
        name: new FormControl('', Validators.required),
        description: new FormControl('' )
      })
    }
    get f() {
      return this.addRoleForm.controls;
    }
    keyPress(event: KeyboardEvent) {
      const initalValue = event.key
      this._el.nativeElement.value = initalValue.replace(/[a-zA-Z0-9._]*/g, '');
      if (initalValue.indexOf(' ') >= 0) {
        event.preventDefault();
      }else{
        if(initalValue === this._el.nativeElement.value){
          event.preventDefault();
        }
      }
    }

    onEnter(){
      this.saveRole(1)
    }

    saveRole(index: any) {
      let role = new Role()
      this.submitted = true
      if(this.code !== undefined){
        this.validateCode = this.code.trim() === "" ? true : false
      }
      if(this.name !== undefined){
        this.validateName = this.name.trim() === "" ? true : false
      }
      if (this.addRoleForm.invalid || this.validateCode || this.validateName) {
        return;
      }
      role.code = this.code
      role.name = this.name
      role.description = this.description
      this.roleService.insertRole(role).subscribe(rs => {
        for (let index = 0; index < rs.responseStatus.codes.length; index++) {
          if(rs.responseStatus.codes[index].code === "200"){
            this.notificationService.showSuccess("Thêm quyền thành công", "")
            this.dialogRef.close(index);
          }else{
            if(rs.responseStatus.codes[index].code === "302"){
              this.notificationService.showError("Quyền đã tồn tại", "")
            }else{
              this.notificationService.showError("Thêm quyền thất bại", "")
            }
          }
        }
      }, err => {
        console.log(err);
      })
    }
    closeDialog(index:any){
        this.dialogRef.close(index);
    }
}
