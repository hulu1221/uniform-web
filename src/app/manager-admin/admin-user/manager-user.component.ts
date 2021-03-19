import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Role } from 'src/app/_models/role';
import { Title } from 'src/app/_models/title';
import { RoleService } from 'src/app/_services/role.service';
import { TitleService } from 'src/app/_services/title.service';
import { FormBuilder } from '@angular/forms';
import { NotificationService } from 'src/app/_toast/notification_service';
import { SearchUser, SystemUsers } from 'src/app/_models/systemUsers';
import { Pager, Pagination } from 'src/app/_models/pager';
import { UserService } from 'src/app/_services/user.service';
import { PaginationService } from 'src/app/services/pagination.service';
import { PopupSystemEditUserComponent } from '../popup-system-edit-user/popupp-system-edit-user.component';
import { PopupSystemAddUserComponent } from '../popup-system-add-user/popup-system-add-user.component';
import { DialogConfig } from 'src/app/_utils/_dialogConfig';
import { PopupConfirmComponent } from 'src/app/_popup/popup-confirm.component';
import { BranchModels } from 'src/app/_models/branch';
import { PopupDetailUserComponent } from '../popup-detail-user/popup-detail-user.component';
@Component({
    selector: 'app-manager-user',
    templateUrl: './manager-user.component.html',
    styleUrls: ['./manager-user.component.scss']
})
export class ManagerUserComponent implements OnInit {
    objSearchUser: SearchUser = new SearchUser()
    userPager: Pagination
    lstUsers: SystemUsers[] = []
    lstAllTitle: Title[] = []
    lstBranch: BranchModels[] = []
    activePage: number = 1
    pageSize: number = 10
    total_count: any
    pagingStatus: string
    mode = 'indeterminate';
    value = 50;
    color = 'primary';
    displayProgressSpinnerInBlock = true
    constructor(
        private titleService: TitleService,
        private roleService: RoleService, private fb: FormBuilder,
        private userService: UserService, private paginationService: PaginationService,
        private notificationService: NotificationService,
        private dialog: MatDialog) { }
    ngOnInit() {
        this.getLstAllTitle()
        this.getLstUsers()
        this.getLstBranch()
    }

    getLstAllTitle() {
        this.titleService.getAllTitle().subscribe(rs => {
            this.lstAllTitle = rs.items
        })
    }
    getLstBranch() {
        this.titleService.getLstAllBranch().subscribe(rs => {
            this.lstBranch = rs.items
        }, err => {
        })
    }
    getLstUsers(activePage: number = 1, pageSize: number = 10) {
        this.displayProgressSpinnerInBlock = true
        this.activePage = activePage
        this.pageSize = pageSize
        this.objSearchUser.page = this.activePage
        this.objSearchUser.size = this.pageSize
        this.userService.getAllUsers(this.objSearchUser).subscribe(rs => {
            this.lstUsers = rs.items
            if (this.lstUsers !== null && this.lstUsers.length > 0) {
              this.userPager = new Pagination(rs.count, this.activePage, this.pageSize)
                this.displayProgressSpinnerInBlock = false
            } else {
                this.lstUsers = null
                this.userPager.pager = new Pager();
                this.displayProgressSpinnerInBlock = false
            }
        }, err => {
            this.lstUsers = null
            this.userPager.pager = new Pager();
            this.displayProgressSpinnerInBlock = false
        })
    }
    selectBranch(item: any) {
        this.objSearchUser.branchId = item != 0 ? item : ""
    }
    selectTitle(item: any) {
        this.objSearchUser.titleId = item != 0 ? item : ""
    }
    onEnter() {
        this.searchUser();
    }
    searchUser() {
        if (this.objSearchUser.employeeId !== undefined) {
            this.objSearchUser.employeeId = this.objSearchUser.employeeId.toString().trim()
        }
        if (this.objSearchUser.fullName !== undefined) {
            this.objSearchUser.fullName = this.objSearchUser.fullName.toString().trim()
        }
        if (this.objSearchUser.username !== undefined) {
            this.objSearchUser.username = this.objSearchUser.username.toString().trim()
        }
        this.getLstUsers(1, this.userPager.pageSize)
    }
    addUser() {
        let dialogRef = this.dialog.open(PopupSystemAddUserComponent, DialogConfig.configAddOrDetailUser(null))
        dialogRef.afterClosed().subscribe(rs => {
            if (rs == 1) {
                this.getLstUsers()
            }
        }
        )
    }
    unlockUser(item: any) {
        item['number'] = 4
        let dialogRef = this.dialog.open(PopupConfirmComponent, DialogConfig.configDialogConfirm(item))
        dialogRef.afterClosed().subscribe(rs => {
            if (rs == 1) {
                let id = {}
                id['id'] = item.id
                this.userService.unlockUser(id).subscribe(rs => {
                    for (let index = 0; index < rs.responseStatus.codes.length; index++) {
                        if (rs.responseStatus.codes[index].code === "200") {
                            this.notificationService.showSuccess("Mở khóa user thành công", "")
                            this.getLstUsers()
                        } else {
                            this.notificationService.showError("Mở khóa user thất bại", "")
                        }
                    }
                }, err => {
                })
            }
        })

    }
    deleteUser(item: any) {
        item['number'] = 2
        let dialogRef = this.dialog.open(PopupConfirmComponent, DialogConfig.configDialogConfirm(item))
        dialogRef.afterClosed().subscribe(rs => {
            if (rs == 1) {
                let id = {}
                id['id'] = item.id
                this.userService.deleteUser(id).subscribe(rs => {
                    for (let index = 0; index < rs.responseStatus.codes.length; index++) {
                        if (rs.responseStatus.codes[index].code === "200") {
                            this.notificationService.showSuccess("Xóa user thành công", "")
                            this.getLstUsers()
                        } else {
                            this.notificationService.showError("Xóa user thất bại", "")
                        }
                    }
                }, err => {
                })
            }
        }
        )
    }
    lockUser(item: any) {
        item['number'] = 4
        let dialogRef = this.dialog.open(PopupConfirmComponent, DialogConfig.configDialogConfirm(item))
        dialogRef.afterClosed().subscribe(rs => {
            if (rs == 1) {
                let id = {}
                id['id'] = item.id
                this.userService.lockUser(id).subscribe(rs => {
                    for (let index = 0; index < rs.responseStatus.codes.length; index++) {
                        if (rs.responseStatus.codes[index].code === "200") {
                            this.notificationService.showSuccess("Khóa user thành công", "")
                            this.getLstUsers()
                        } else {
                            this.notificationService.showError("Khóa user thất bại", "")
                        }
                    }
                }, err => {
                })
            }
        })

    }
    detailUser(item: any) {
        let dialogRef = this.dialog.open(PopupSystemEditUserComponent, DialogConfig.configAddOrDetailUser(item))
        dialogRef.afterClosed().subscribe(rs => {
            if (rs == 1) {
                this.getLstUsers()
            }
        }
        )
    }
    detailUserById(item: any) {
        let dialogRef = this.dialog.open(PopupDetailUserComponent, DialogConfig.configAddOrDetailUser(item))
        dialogRef.afterClosed().subscribe(rs => { })
    }
    setActionPage(page: number, index: any) {
        this.activePage = page
        if (index == 0) {
            if (page < 1 || page > this.userPager.pager.totalPages) {
                return;
            }
            this.getLstUsers(page, this.userPager.pageSize)
        }
    }
    changePageSize(size: string, index: any) {
        this.pageSize = parseInt(size);
        let pageSize = parseInt(size);
        this.activePage = 1

        this.userPager.activePage = pageSize;
        this.getLstUsers(1, pageSize)


    }
    getStatusCodeUser(statusCode: string) {
        if (statusCode == 'A') {
            return 'Hoạt động';
        } else if (statusCode == 'L') {
            return 'Khóa';
        } else if (statusCode == 'C') {
            return 'Đóng';
        } else return '';
    }
}
