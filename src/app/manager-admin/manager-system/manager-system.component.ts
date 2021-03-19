
import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PopupSystemEditUserComponent } from '../popup-system-edit-user/popupp-system-edit-user.component';
import { PopupSystemAddUserComponent } from '../popup-system-add-user/popup-system-add-user.component';
import { PopupSystemAddRoleComponent } from '../popup-system-add-role/popup-system-add-role.component';
import { PopupSystemEditRoleComponent } from '../popup-system-edit-role/popup-system-edit-role.component';
import { PopupSystemAddTitleComponent } from '../popup-system-add-title/popup-system-add-title.component';
import { PopupSystemEditTitleComponent } from '../popup-system-edit-title/popup-system-edit-title.component';
import { DialogConfig } from 'src/app/_utils/_dialogConfig';
import { SearchUser, SystemUsers } from 'src/app/_models/systemUsers';
import { UserService } from 'src/app/_services/user.service';
import { TitleService } from 'src/app/_services/title.service';
import { Title, TitlePage } from 'src/app/_models/title';
import { BranchModels } from 'src/app/_models/branch';
import { RoleService } from 'src/app/_services/role.service';
import { Role } from 'src/app/_models/role';
import { FunctionService } from '../../_services/function.service';
import { MainFunction } from '../../_models/mainFunction';
import { ActionService } from '../../_services/action.service';
import { Action, ActionRequest } from '../../_models/action';
import { PaginationService } from '../../services/pagination.service';
import { Pager, Pagination } from '../../_models/pager';
import { PopupGroupTitleRoleComponent } from '../popup-group-title-role/popup-group-title-role.component';
import { NotificationService } from 'src/app/_toast/notification_service';
import { PopupConfirmComponent } from 'src/app/_popup/popup-confirm.component';
import { PopupDetailUserComponent } from '../popup-detail-user/popup-detail-user.component';
import { PermissionName } from 'src/app/_utils/_returnPermissionName';
import { ActivatedRoute } from '@angular/router';
import { delay } from 'rxjs/operators';
declare var $: any;
@Component({
  selector: 'app-manager-system',
  templateUrl: './manager-system.component.html',
  styleUrls: ['./manager-system.component.scss'],
})

export class ManagerSystemComponent implements OnInit {
  lstAllTitle: Title[] = []
  lstRoles: Role[] = []
  lstAllRoles: Role[] = []
  lstAllFunction: MainFunction[] = []
  lstAllAction: Action[] = []
  objRole: Role = new Role()
  objFun: any = {}
  actionIds = []
  activePage: number = 1
  pageSize: number = 10
  pager: Pagination = new Pagination()
  total_count: any
  pagingStatus: string
  disabled = false
  arrayBoth = false
  lstTabActionInFuntion = []
  objSearchUser: SearchUser = new SearchUser()
  userPager: Pagination
  lstUsers: SystemUsers[] = []
  lstBranch: BranchModels[] = []
  mode = 'indeterminate';
  value = 50;
  color = 'primary';
  lstTitles: Title[] = []
  displayProgressSpinnerInBlock: boolean
  newLstAction = []
  addLstOldLstCheckAction = []
  numberCheck = 0
  lstAllRole: Role[] = []
  role: Role = new Role()
  functions: MainFunction[] = []
  actions: Action[] = []
  permissions: any = []
  actionCode: string
  selectedIndex: any
  lstIndex = []
  iconEditUer = false
  iconLockUser = false
  iconDeleteUser = false
  iconUnlockUser = false
  iconEditTitle = false
  iconDeleteTitle = false
  iconUpdateRole = false
  iconDeleteRole = false
  constructor(private dialog: MatDialog,
    private userService: UserService, private titleService: TitleService,
    private roleService: RoleService, private paginationService: PaginationService,
    private functionService: FunctionService, private actionService: ActionService,
    private notificationService: NotificationService, private route: ActivatedRoute) { }
  ngOnInit() {
    $('.parentName').html('Quản trị hệ thống')
    // console.log(document.documentElement.scrollHeight)
    this.permissions = JSON.parse(localStorage.getItem("action"))
    let returnIndex: any = PermissionName.returnIndex()
    // this.lstIndex = JSON.parse(localStorage.getItem("lstIndex"))
    // this.selectedIndex = localStorage.getItem('index') !==undefined ? localStorage.getItem('index') : 0
    this.getLstAllTitle()
    this.getLstAllRole()
    this.getLstBranch()
    if (localStorage.getItem('index') !== undefined && localStorage.getItem('index') !== null) {
      this.selectedIndex = localStorage.getItem('index')
      returnIndex = localStorage.getItem('index')
    } else {
      this.selectedIndex = returnIndex
    }
    let index = {}
    index['index'] = parseInt(returnIndex)
    this.onTabChanged(index)
    this.returnShowHidePermissionIcon()
  }
  returnShowHidePermissionIcon() {
    this.iconEditUer = this.permissions.includes('SYS_MANAGEMENT_USER_UPDATE') ? true : false
    this.iconLockUser = this.permissions.includes('SYS_MANAGEMENT_USER_LOCK') ? true : false
    this.iconUnlockUser = this.permissions.includes('SYS_MANAGEMENT_USER_UNLOCK') ? true : false
    this.iconDeleteUser = this.permissions.includes('SYS_MANAGEMENT_USER_DELETE') ? true : false
    this.iconEditTitle = this.permissions.includes('SYS_MANAGEMENT_TITLE_UPDATE') ? true : false
    this.iconDeleteTitle = this.permissions.includes('SYS_MANAGEMENT_TITLE_DELETE') ? true : false
    this.iconUpdateRole = this.permissions.includes('SYS_MANAGEMENT_ROLE_UPDATE') ? true : false
    this.iconDeleteRole = this.permissions.includes('SYS_MANAGEMENT_ROLE_DELETE') ? true : false
  }
  ngAfterViewInit() {
    this.checkPermission()
  }
  checkPermission() {
    let permissions = this.permissions
    let element = $('.mat-tab-label')
    for (let i = 0; i < element.length; i++) {
      let permissionName: string
      let index = element[i].id.substr(element[i].id.length - 1)
      permissionName = PermissionName.returnPermissionName(index)
      if (!permissions.includes(permissionName)) {
        $('#mat-tab-content-0-' + parseInt(index)).css("display", "none")
        $('#' + element[i].id).css("display", "none")
      }
    }
    if (this.lstIndex !== null && this.lstIndex.length > 0 && this.selectedIndex !== undefined) {
      this.selectedIndex = this.lstIndex[0]
    }
    PermissionName.checkPermissionAdmin(permissions)
  }
  //user
  getLstUsers(activePage: number = 1, pageSize: number = 10) {
    this.displayProgressSpinnerInBlock = true
    this.activePage = activePage
    this.pageSize = pageSize
    this.objSearchUser.page = this.activePage
    this.objSearchUser.size = this.pageSize
    this.userService.getAllUsers(this.objSearchUser).subscribe(rs => {
      // setTimeout(() => {
      this.lstUsers = rs.items
      if (this.lstUsers !== null && this.lstUsers.length > 0) {
        this.userPager = new Pagination(rs.count, this.activePage, this.pageSize)
      } else {
        this.lstUsers = null
        this.userPager.pager = new Pager();
      }
      this.displayProgressSpinnerInBlock = false
      // }, 2000);
    }, err => {
      setTimeout(() => {
        this.lstUsers = null
        this.userPager.pager = new Pager();
        this.displayProgressSpinnerInBlock = false
      }, 2000);
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
    if (this.objSearchUser.userCore !== undefined) {
      this.objSearchUser.userCore = this.objSearchUser.userCore.toString().trim()
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
    item['number'] = 3
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
    item['lstRoles'] = this.lstRoles
    let dialogRef = this.dialog.open(PopupSystemEditUserComponent, DialogConfig.configAddOrDetailUser(item))
    dialogRef.afterClosed().subscribe(rs => {
      if (rs == 1) {
        this.getLstUsers()
      }
    }
    )
  }
  detailUserById(item: any) {
    let permissions = this.permissions
    let p = $('.view-deatil').attr('permission-data')
    if (permissions.includes(p)) {
      let dialogRef = this.dialog.open(PopupDetailUserComponent, DialogConfig.configAddOrDetailUser(item))
      dialogRef.afterClosed().subscribe(rs => { })
    }
  }
  //ket thuc usser
  //phan quyen
  getLstTitle() {
    let obj = new TitlePage()
    obj.page = this.activePage
    obj.size = this.pageSize
    this.displayProgressSpinnerInBlock = true
    this.titleService.getlstTitle(obj).subscribe(rs => {

      // setTimeout(() => {
      this.lstTitles = rs.items
      if (this.lstTitles !== null && this.lstTitles.length > 0) {
        this.total_count = rs.count;
        this.pager = new Pagination(this.total_count, this.activePage, this.pageSize)
      } else {
        this.lstTitles = null
      }
      this.displayProgressSpinnerInBlock = false
      // }, 2000);
    }, err => {
      setTimeout(() => {
        this.lstTitles = null
        this.displayProgressSpinnerInBlock = false
      }, 2000);
      
    })
  }
  addTitle() {
    let dialogRef = this.dialog.open(PopupSystemAddTitleComponent, DialogConfig.configDialog(null))
    dialogRef.afterClosed().subscribe(rs => {
      if (rs == 1) {
        this.getLstTitle()
      }
    })
  }
  addRoleInTitle() {
    let dialogRef = this.dialog.open(PopupGroupTitleRoleComponent, DialogConfig.configDialog(null))
    dialogRef.afterClosed().subscribe(rs => {
      if (rs == 1) {
        this.getLstTitle()
      }
    })
  }
  editTitle(item: any) {
    let data = {}
    data['id'] = item
    data['lstRoles'] = this.lstRoles
    let dialogRef = this.dialog.open(PopupSystemEditTitleComponent, DialogConfig.configDialog(data))
    dialogRef.afterClosed().subscribe(rs => {
      if (rs == 1) {
        this.getLstTitle()
      }
    })
  }
  deleteTitle(item: any) {
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
  //ket thuc phan quyen
  //role
  getAllRole() {
    this.role.titleCode = ""
    this.displayProgressSpinnerInBlock = true
    this.role['page'] = this.activePage
    this.role['size'] = this.pageSize
    this.roleService.getAllRoles(this.role).subscribe(rs => {
      // setTimeout(() => {
      this.lstAllRole = rs.items
      if (this.lstAllRole !== null && this.lstAllRole.length > 0) {
        this.total_count = rs.count;
        this.pager = new Pagination(this.total_count, this.activePage, this.pageSize)
      } else {
        this.lstAllRole = null
      }
      this.displayProgressSpinnerInBlock = false
      // 

    }, err => {
      setTimeout(() => {
        this.lstAllRole = null
        this.displayProgressSpinnerInBlock = false
      }, 2000);
    })

  }
  addRole() {
    let dialogRef = this.dialog.open(PopupSystemAddRoleComponent, DialogConfig.configDialog(null))
    dialogRef.afterClosed().subscribe(rs => {
      this.getAllRole()
    }
    )
  }
  editRole(item: any) {
    let dialogRef = this.dialog.open(PopupSystemEditRoleComponent, DialogConfig.configDialog(item))
    dialogRef.afterClosed().subscribe(rs => {
      this.getAllRole()
    }
    )
  }
  deleteRole(item: any) {
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
  //ket thuc role
  //function
  getAllFunction() {
    let obj = {}
    obj['page'] = this.activePage
    obj['size'] = this.pageSize
    this.displayProgressSpinnerInBlock = true
    this.functionService.getAllFunction(obj).subscribe((data) => {
      this.functions = data['items'];
      if (this.functions !== null && this.functions.length > 0) {
        this.total_count = data.count;
        this.pager = new Pagination(this.total_count, this.activePage, this.pageSize)
      } else {
        this.functions = null
      }
      this.displayProgressSpinnerInBlock = false
    }, error => {
      setTimeout(() => {
        this.functions = null
        this.displayProgressSpinnerInBlock = false
      }, 2000);
    });
  }
  //ket thuc function
  // action
  getAction() {
    let obj = new ActionRequest()
    obj.functionCode = this.actionCode === undefined ? "" : this.actionCode
    obj.page = this.activePage
    obj.size = this.pageSize
    this.displayProgressSpinnerInBlock = true
    return this.actionService.getByFunctionCode(obj).subscribe(
      (data) => {
        // setTimeout(() => {
        this.actions = data['items']
        // this.lstAllAction = this.actions
        if (this.actions !== null && this.actions.length > 0) {
          this.total_count = data.count;
          this.pager = new Pagination(this.total_count, this.activePage, this.pageSize)
        } else {
          this.actions = null
        }
        this.displayProgressSpinnerInBlock = false
        // }, 2000);
      }, error => {
        setTimeout(() => {
          this.actions = null
          this.displayProgressSpinnerInBlock = false
        }, 2000);
      }
    )
  }
  searchAction(functionName: string = '') {
    this.actionCode = functionName;
    this.activePage = 1
    this.pageSize = 10
    this.getAction();
  }
  //ket thuc action
  getLstBranch() {
    this.titleService.getLstAllBranch().subscribe(rs => {
      this.lstBranch = rs.items
    }, err => {
    })
  }
  getLstAllTitle() {
    this.titleService.getAllTitle().subscribe(rs => {
      this.lstAllTitle = rs.items
    })
  }
  getLstAllRole() {
    this.roleService.getLstAllRoles().subscribe(rs => {
      this.lstRoles = rs.items
      if (this.lstRoles !== null && this.lstRoles.length > 0) {
        this.lstAllRoles = this.lstRoles
      }
    }, err => { })
  }
  setActionPage(page: number, index: any) {
    this.activePage = page

    if (index == 0) {
      if (page < 1 || page > this.userPager.pager.totalPages) {
        return;
      }
      this.getLstUsers(page, this.userPager.pageSize)
    } else if (index == 1) {
      this.getLstTitle()
    } else if (index == 2) {
      this.getAllRole()
    } else if (index == 3) {
      this.getAllFunction()
    } else {
      this.getAction()
    }

  }
  changePageSize(size: string, index: any) {
    this.pageSize = parseInt(size);
    let pageSize = parseInt(size);
    this.activePage = 1
    if (index == 0) {
      this.userPager.activePage = pageSize;
      this.getLstUsers(1, pageSize)
    } else if (index == 1) {
      this.getLstTitle()
    } else if (index == 2) {
      this.getAllRole()
    } else if (index == 3) {
      this.getAllFunction()
    }
    else {
      this.getAction()
    }

  }
  //ket thuc hanh dong
  onTabChanged(index: any) {
    this.activePage = 1
    this.pageSize = 10
    let tabIndex = index.index
    this.lstUsers = []
    this.lstTitles = []
    this.actions = []
    this.functions = []
    this.lstAllRole = []
    this.pager = new Pagination()
    this.userPager = new Pagination()
    // this.pager = new Pager()
    this.checkPermission()
    this.viewLabel(tabIndex)
    // this.actionCode = ""
    if (tabIndex == 0) {
      this.getLstUsers()
    } else if (tabIndex == 1) {
      this.getLstTitle()
    } else if (tabIndex == 2) {
      this.getAllRole()
    } else if (tabIndex == 3) {
      this.getAllFunction()
    } else if (tabIndex == 4) {
      this.lstAllFunction = []
      this.actionCode = ""
      this.getListAllFunction(0)
      this.getAction()
    } else {
      this.displayProgressSpinnerInBlock = true
      this.newLstAction = []
      this.getListAllAction(0)
      this.getListAllFunction(0)
      this.getLstAllRole()
      setTimeout(() => {
        this.disabled = this.arrayBoth ? true : false
        this.forcusFirtRow()
        this.forcusFunction()
        this.displayProgressSpinnerInBlock = false
      }, 1000);
    }
  }
  viewLabel(i: any) {
    if (i == 0) {
      $('.childName').html('Quản lý người dùng')
    } else if (i == 1) {
      $('.childName').html('Quản lý chức danh')
    } else if (i == 2) {
      $('.childName').html('Quản lý role')
    } else if (i == 3) {
      $('.childName').html('Quản lý function')
    } else if (i == 4) {
      $('.childName').html('Quản lý hành động')
    } else if (i == 5) {
      $('.childName').html('Map quyền')
    }
  }
  forcusFirtRow() {
    // this.arrayWhenCheckAction = []
    for (let i = 0; i < this.lstRoles.length; i++) {
      if (i == 0) {
        this.lstRoles[i]['onFocus'] = true
        this.objRole = this.lstRoles[i]
        continue
      } else {
        this.lstRoles[i]['onFocus'] = false
      }
    }
  }
  saveDefineRole() {
    this.actionIds = []
    let obj = {}
    let roles = {
      roles: []
    }
    let lstActionChecked = this.lstAllAction.filter(e => e.checked)
    for (let index = 0; index < this.lstAllAction.length; index++) {
      let char = this.lstAllAction[index].roles !== null ? this.lstAllAction[index].roles : ""
      if (char.search(this.objRole.code) >= 0) {
        if (this.lstAllAction[index]['checked'] !== undefined) {
          if (this.lstAllAction[index]['checked']) {
            lstActionChecked.push(this.lstAllAction[index])
          }
        } else {
          lstActionChecked.push(this.lstAllAction[index])
        }
      }
    }
    lstActionChecked = lstActionChecked.filter((element, i) => i === lstActionChecked.indexOf(element))
    lstActionChecked.forEach(e => {
      this.actionIds.push(e.id)
    })
    obj['roleId'] = this.objRole.id
    obj['actionIds'] = this.actionIds.length > 0 ? this.actionIds : []
    roles.roles.push(obj)
    this.displayProgressSpinnerInBlock = true
    this.roleService.mapAction(roles).subscribe(rs => {
      setTimeout(() => {
        for (let index = 0; index < rs.responseStatus.codes.length; index++) {
          if (rs.responseStatus.codes[index].code === "200") {
            this.notificationService.showSuccess("Map quyền thành công", "")
            this.arrayBoth = false
            this.disabled = false
            // this.forcusFirtRow()
            this.getListAllFunction(5)
          } else {
            this.notificationService.showError("Map quyền thất bại", "")
          }
          this.displayProgressSpinnerInBlock = false
        }
      }, 1000);

    }, error => {
      this.displayProgressSpinnerInBlock = false
    })
  }
  //tab dinh nghia quyen
  getListAllFunction(index: any) {
    this.functionService.getAll().subscribe(rs => {
      this.lstAllFunction = rs.items
      this.getListAllAction(index)
    })
  }
  getListAllAction(index: any) {
    this.actionService.getAllAction().subscribe(rs => {
      this.lstAllAction = rs.items
      if (index == 5) {
        this.forcusFunction()
      }
    })
  }

  forcusFunction() {
    for (let index = 0; index < this.lstAllFunction.length; index++) {
      let char = this.lstAllFunction[index].roles !== null ? this.lstAllFunction[index].roles : ""
      if (char.search(this.objRole.code) >= 0) {
        this.lstAllFunction[index]['checked'] = true
      } else {
        this.lstAllFunction[index]['checked'] = false
      }
      if (index == 0) {
        this.objFun = this.lstAllFunction[index]
        this.lstAllFunction[index]['onFocus'] = true
        this.lstAllFunction[index]['color'] = true
        this.lstAllFunction[index]['returnColor'] = false
        this.showAction(this.objRole, this.lstAllFunction[index])
      } else {
        this.lstAllFunction[index]['onFocus'] = false
        this.lstAllFunction[index]['color'] = false
        this.lstAllFunction[index]['returnColor'] = true
      }
    }

  }

  showAction(objRole: any, objFuntion: any) {
    this.newLstAction = []
    // this.oldLstCheckAction = []
    this.addLstOldLstCheckAction = []
    this.lstTabActionInFuntion = []
    for (let index = 0; index < this.lstAllAction.length; index++) {
      let char = this.lstAllAction[index].roles !== null ? this.lstAllAction[index].roles : ""
      if (char.search(objRole.code) >= 0 && objFuntion.code == this.lstAllAction[index].functionCode) {
        this.lstAllAction[index]['checkedFunctionId'] = this.lstAllAction[index].functionId
        if (this.lstAllAction[index].checked !== undefined) {
          this.lstAllAction[index]['checked'] = this.lstAllAction[index].checked ? true : false
        } else {
          this.lstAllAction[index]['checked'] = true
        }
        this.addLstOldLstCheckAction.push(this.lstAllAction[index])
        this.numberCheck = this.addLstOldLstCheckAction.length
      }
      if (this.lstAllAction[index].functionCode == objFuntion.code) {
        this.newLstAction.push(this.lstAllAction[index])
      }
    }
    for (let i = 0; i < this.newLstAction.length; i++) {
      let char = this.newLstAction[i].roles !== null ? this.newLstAction[i].roles : ""
      if (char.search(objRole.code) >= 0) {
        this.newLstAction[i]['checked'] = this.newLstAction[i].checked ? true : false
        this.lstTabActionInFuntion.push(this.newLstAction[i])
      }
    }
  }
  viewDetail(item: any) {
    this.objFun = {}
    for (let i = 0; i < this.lstAllFunction.length; i++) {
      if (this.lstAllFunction[i].id == item.id) {
        this.objFun = item
        this.lstAllFunction[i]['onFocus'] = true
        this.lstAllFunction[i]['color'] = true
        this.lstAllFunction[i]['returnColor'] = false
        continue
      } else {
        this.lstAllFunction[i]['onFocus'] = false
        this.lstAllFunction[i]['returnColor'] = true
        this.lstAllFunction[i]['color'] = false
      }
    }
    this.showAction(this.objRole, item)
  }
  selectRoleInTab(item: any, index: any) {
    this.objRole = item
    this.addLstOldLstCheckAction = []
    let data = {}
    data['number'] = 1
    if (this.arrayBoth) {
      this.dialog.open(PopupConfirmComponent, DialogConfig.configDialogConfirm(data))
    }
    if (!this.arrayBoth) {
      for (let index = 0; index < this.lstRoles.length; index++) {
        if (this.lstRoles[index].id == item.id) {
          this.lstRoles[index]['onFocus'] = true
          continue
        } else {
          this.lstRoles[index]['onFocus'] = false
        }
      }
      for (let i = 0; i < this.lstAllFunction.length; i++) {
        let char = this.lstAllFunction[i].roles !== null ? this.lstAllFunction[i].roles : ""
        if (char.search(item.code) >= 0) {
          this.lstAllFunction[i]['checked'] = true
        }
      }
      for (let i = 0; i < this.lstAllAction.length; i++) {
        this.lstAllAction[i].checked = undefined
        this.lstAllAction[i]['checkedFunctionId'] = undefined
      }
      this.forcusFunction()
    }
  }
  setLstAllFunctionIsTrue() {
    for (let index = 0; index < this.lstAllFunction.length; index++) {
      if (this.lstAllFunction[index].id == this.objFun.id) {
        this.lstAllFunction[index]['checked'] = true
      }
    }
  }
  setCheckedFalseAction(item: any) {
    this.newLstAction.forEach(r => {
      if (r.id == item.id) {
        r.checked = false
        r.checkedFunctionId = this.objFun.id
      }
    })
  }
  setLstAllFunctionIsFalse() {
    for (let index = 0; index < this.lstAllFunction.length; index++) {
      if (this.lstAllFunction[index].id == this.objFun.id) {
        this.lstAllFunction[index]['checked'] = false
      }
    }
  }
  selectAction(item: any, e) {
    if (e.target.checked) {
      this.lstAllAction.forEach(e => {
        if (item.id == e.id) {
          e.checked = true
        }

      })
      for (let index = 0; index < this.lstAllFunction.length; index++) {
        if (item.functionId == this.lstAllFunction[index].id) {
          this.lstAllFunction[index]['checked'] = true
        }
      }
    } else {
      this.lstAllAction.forEach(e => {
        if (e.id == item.id) {
          e.checked = false
        }
      })
      if (this.lstTabActionInFuntion.length > 0) {
        let arr = this.lstTabActionInFuntion.filter(e => e.checked)
        if (arr.length == 0) {
          this.lstAllFunction.forEach(e => {
            if (item.functionId == e.id) {
              e['checked'] = false
            }
          })
        }
      } else {
        let lst = this.lstAllAction.filter(e => e.checked && e.functionId == item.functionId)
        if (lst.length == 0) {
          this.lstAllFunction.forEach(e => {
            if (item.functionId == e.id) {
              e['checked'] = false
            }
          })
        }
      }

    }
    this.openOrCloseButton(item, e)
    this.disabled = this.arrayBoth ? true : false

  }

  openOrCloseButton(item, e) {
    let ar = []
    let arrCheck = []
    if (this.lstTabActionInFuntion.length > 0) {
      let arr = this.lstTabActionInFuntion.filter(e => !e.checked)
      ar = this.lstAllAction.filter(e => e.checked)
      arrCheck = this.lstTabActionInFuntion.filter(e => e.checked)
      if (arr.length > 0) {
        this.arrayBoth = true
      } else {
        if (this.arrayBoth && ar.length == arrCheck.length) {
          this.arrayBoth = false
        } else {
          this.arrayBoth = true
        }
      }
    } else {
      ar = this.lstAllAction.filter(e => e.checked && e.functionId != item.functionId)
      if (e.target.checked) {
        if (!this.arrayBoth && this.lstTabActionInFuntion.length == 0) {
          this.arrayBoth = true
        }
        return
      } else {
        let lst = this.lstAllAction.filter(e => e.checked && e.functionId == item.functionId)
        if (ar.length == this.numberCheck && lst.length == 0) {
          this.arrayBoth = false
        }
      }
    }
  }
  filterArray = (addLstOldLstCheckAction, newLstCheckAction) => {
    const filtered = addLstOldLstCheckAction.filter(el => {
      return newLstCheckAction.indexOf(el) === -1;
    });
    return filtered;
  }
  addCheckWhenTickAction(item: any, e) {
    for (let index = 0; index < this.lstAllAction.length; index++) {
      if (e.target.checked && (item.id == this.lstAllAction[index].id)) {
        this.lstAllAction[index]['checked'] = true
        this.lstAllAction[index]['checkedFunctionId'] = this.objFun.id
        break
      }
    }
  }
  //ket thuc
  getStatusCode(statusCode: string) {
    if (statusCode == 'A') {
      return 'Hoạt động';
    } else if (statusCode == 'I') {
      return 'Không hoạt động';
    } else if (statusCode == 'C') {
      return 'Đóng';
    } else return '';
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
}

