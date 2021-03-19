import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Role } from 'src/app/_models/role';
import { FormBuilder } from '@angular/forms';
import {Pager, Pagination} from 'src/app/_models/pager';
import { PaginationService } from 'src/app/services/pagination.service';
import { DialogConfig } from 'src/app/_utils/_dialogConfig';
import { RoleService } from 'src/app/_services/role.service';
import { PopupSystemAddRoleComponent } from '../popup-system-add-role/popup-system-add-role.component';
import { PopupSystemEditRoleComponent } from '../popup-system-edit-role/popup-system-edit-role.component';
import { PopupConfirmComponent } from 'src/app/_popup/popup-confirm.component';
import { NotificationService } from 'src/app/_toast/notification_service';
@Component({
    selector: 'app-manager-role',
    templateUrl: './manager-role.component.html',
    styleUrls: ['./manager-role.component.scss']
})
export class ManagerRoleComponent implements OnInit {
    lstAllRole: Role[] = []
    role: Role = new Role()
    activePage: number = 1
    pageSize: number = 10
    pager: Pagination
    total_count: any
    pagingStatus: string
    constructor(
        private roleService: RoleService,
        private fb: FormBuilder,
        private paginationService: PaginationService,
        private notificationService: NotificationService,
        private dialog: MatDialog) { }
    ngOnInit() {
        this.getAllRole()
    }

    getAllRole() {
        this.role.titleCode = ""
        this.role['page'] = this.activePage
        this.role['size'] = this.pageSize
        this.roleService.getAllRoles(this.role).subscribe(rs => {
          this.lstAllRole = rs.items
          if (this.lstAllRole !== null && this.lstAllRole.length > 0) {
            this.total_count = rs.count;
            this.pager = new Pagination(this.total_count, this.activePage, this.pageSize)
          } else {
            this.lstAllRole = null
          }
        }, err => {
          this.lstAllRole = null
        //   debugger
        })
        // this.getLstAllRole()
      }
      addRole() {
        let dialogRef = this.dialog.open(PopupSystemAddRoleComponent, DialogConfig.configDialog(null))
        dialogRef.afterClosed().subscribe(rs => {
          this.getAllRole()
          // if(rs == 1){
          //   this.router.navigate(['./smart-form/registerService']);
          // }
        }
        )
      }
      editRole(item: any) {
        let dialogRef = this.dialog.open(PopupSystemEditRoleComponent, DialogConfig.configDialog(item))
        dialogRef.afterClosed().subscribe(rs => {
          this.getAllRole()
          // if(rs == 1){
          //   this.router.navigate(['./smart-form/registerService']);
          // }
        }
        )
      }
      deleteRole(item:any){
        item['number'] = 6
        let dialogRef = this.dialog.open(PopupConfirmComponent, DialogConfig.configDialogConfirm(item))
        dialogRef.afterClosed().subscribe(rs => {
            if (rs == 1) {
                let id = {}
                id['id'] = item.id
                this.roleService.deleteRole(id).subscribe(rs => {
                    for (let index = 0; index < rs.responseStatus.codes.length; index++) {
                        if (rs.responseStatus.codes[index].code === "200") {
                            this.notificationService.showSuccess("Xóa quyền thành công", "")
                            this.getAllRole()
                        } else {
                            this.notificationService.showError("Xóa quyền thất bại", "")
                        }
                    }
                }, err => {
                })
            }
        })
    }
      setActionPage(page: number) {
        this.activePage = page
        if (page < 1 || page > this.pager.pager.totalPages) {
            return;
        }
        this.getAllRole()
    }
    changePageSize(size: string, index: any) {
        this.pageSize = parseInt(size);
        this.activePage = 1
        this.getAllRole()
    }
      getStatusCode(statusCode: string) {
        if (statusCode == 'A') {
          return 'Hoạt động';
        } else if (statusCode == 'I') {
          return 'Không hoạt động';
        } else if (statusCode == 'C') {
          return 'Đóng';
        } else return '';
      }
}
