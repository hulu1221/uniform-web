import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Role } from 'src/app/_models/role';
import { Title, TitlePage } from 'src/app/_models/title';
import { TitleService } from 'src/app/_services/title.service';
import { FormBuilder } from '@angular/forms';
import {Pager, Pagination} from 'src/app/_models/pager';
import { PaginationService } from 'src/app/services/pagination.service';
import { DialogConfig } from 'src/app/_utils/_dialogConfig';
import { PopupSystemEditTitleComponent } from '../popup-system-edit-title/popup-system-edit-title.component';
import { PopupSystemAddTitleComponent } from '../popup-system-add-title/popup-system-add-title.component';
import { PopupGroupTitleRoleComponent } from '../popup-group-title-role/popup-group-title-role.component';
import { PopupConfirmComponent } from 'src/app/_popup/popup-confirm.component';
import { NotificationService } from 'src/app/_toast/notification_service';
import { RoleService } from 'src/app/_services/role.service';
@Component({
    selector: 'app-manager-title',
    templateUrl: './manager-title.component.html',
    styleUrls: ['./manager-title.component.scss']
})
export class ManagerTitleComponent implements OnInit {
    lstTitles: Title[] = []
    lstAllTitle: Title[] = []
    activePage: number = 1
    pageSize: number = 10
    pager: Pagination
    total_count: any
    pagingStatus: string
    lstRoles: Role[] = []
    constructor(
        private titleService: TitleService,
        private fb: FormBuilder,
        private paginationService: PaginationService,
        private notificationService: NotificationService,
        private roleService: RoleService,
        private dialog: MatDialog) { }
    ngOnInit() {
        this.getLstTitle()
        this.getLstAllRole()
    }

    getLstAllRole() {
        this.roleService.getLstAllRoles().subscribe(rs => {
          this.lstRoles = rs.items
        }, err => { })
    }
    getLstTitle() {
        let obj = new TitlePage()
        obj.page = this.activePage
        obj.size = this.pageSize
        this.titleService.getlstTitle(obj).subscribe(rs => {
            this.lstTitles = rs.items
            if (this.lstTitles !== null && this.lstTitles.length > 0) {
                this.total_count = rs.count;
              this.pager = new Pagination(this.total_count, this.activePage, this.pageSize)
            } else {
                this.lstTitles = null
            }
        }, err => {
            this.lstTitles = null
        })
    }
    addTitle() {
        let dialogRef = this.dialog.open(PopupSystemAddTitleComponent, DialogConfig.configDialog(null))
        dialogRef.afterClosed().subscribe(rs => {
            this.getLstTitle()
        })
    }
    addRoleInTitle() {
        let dialogRef = this.dialog.open(PopupGroupTitleRoleComponent, DialogConfig.configDialog(null))
        dialogRef.afterClosed().subscribe(rs => {
            this.getLstTitle()
        })
    }
    editTitle(item: any) {
        let data = {}
        data['id'] = item
        data['lstRoles'] = this.lstRoles
        let dialogRef = this.dialog.open(PopupSystemEditTitleComponent, DialogConfig.configDialog(data))
        dialogRef.afterClosed().subscribe(rs => {
            this.getLstTitle()
        })
    }
    deleteTitle(item:any){
        item['number'] = 5
        let dialogRef = this.dialog.open(PopupConfirmComponent, DialogConfig.configDialogConfirm(item))
        dialogRef.afterClosed().subscribe(rs => {
            if (rs == 1) {
                let id = {}
                id['id'] = item.id
                this.titleService.deleteTitle(id).subscribe(rs => {
                    for (let index = 0; index < rs.responseStatus.codes.length; index++) {
                        if (rs.responseStatus.codes[index].code === "200") {
                            this.notificationService.showSuccess("Chức danh xóa thành công", "")
                            this.getLstTitle()
                        } else {
                            this.notificationService.showError("Chức danh xóa thất bại", "")
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
        this.getLstTitle()
    }
    changePageSize(size: string, index: any) {
        this.pageSize = parseInt(size);
        this.activePage = 1
        this.getLstTitle()
    }
    getLstRoleMapTitle(roles: any) {
        let ar = roles !== null ? roles : []
        let returnName = []
        for (let i = 0; i < this.lstRoles.length; i++) {
            for (let j = 0; j < ar.length; j++) {
                if (this.lstRoles[i].id === ar[j]) {
                    returnName.push(this.lstRoles[i].name)
                }
            }
        }
        return returnName
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
