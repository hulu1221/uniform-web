import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ApprovableProcess, Process} from "../../_models/process";
import {CifCondition} from "../../_models/cif";
import {IndivCifService} from "../../_services/indiv-cif.service";
import {ApprovalCifService} from "../../_services/approval-cif.service";
import {ErrorHandlerService} from "../../_services/error-handler.service";
import {RegistrableService} from "../../_models/registrable-service";
import {PopupConfirmComponent} from "../../_popup/popup-confirm.component";
import {DialogConfig} from "../../_utils/_dialogConfig";
import {MatDialog} from "@angular/material/dialog";
import {ResponseStatus} from "../../_models/response";
import {MissionService} from "../../services/mission.service";
import {Location} from "@angular/common";
import {PopupHistoryProcessComponent} from "../../_popup/popup-history-process/popup-history-process.component";
declare var $: any;

@Component({
  selector: 'app-send-for-approval.component',
  templateUrl: './send-for-approval.component.html',
  styleUrls: ['./send-for-approval.component.css']
})
export class SendForApprovalComponent implements OnInit {
  processId: string
  process: Process = new Process()
  serviceLst: RegistrableService[]
  messageCif: string
  response: ResponseStatus
  constructor(private router: Router,
              private route: ActivatedRoute,
              private dialog: MatDialog,
              private cifService: IndivCifService,
              private approvalCifService: ApprovalCifService,
              private errorHandler: ErrorHandlerService,
              private missionService: MissionService,
              private _location: Location) {
    }

  ngOnInit() {
    $('.childName').html('Gửi duyệt')
    this.route.paramMap.subscribe( paramMap => this.getProcessInformation(paramMap.get('processId')))
  }
  backPage() {
    //  $('.childName').html('Danh sách tài khoản')
    this._location.back();
   }
  getProcessInformation(processId: string) {
    if (processId) {
      this.missionService.setProcessId(processId)
      this.processId = processId
      let condition = new CifCondition();
      condition.id = processId
      // thong tin ho so
      this.cifService.getCifList(condition).subscribe(data => {
        if (data.items) this.process = new Process(data.items[0])
      }, error => {
        this.errorHandler.showError(error)
        },
        () => {
          if (this.process.statusId != 'E') this.missionService.setMission('Thông tin duyệt dịch vụ')
          if (!this.process.id) {
            this.errorHandler.showError("Hồ sơ không tồn tại")
            // this.router.navigate(['./smart-form'])
          }
        }
      )
      // danh sach dich vu dang ky
      this.approvalCifService.getRegistrableServiceList(processId).subscribe(
        data => {
          if (data && data.items && data.responseStatus.success == true) {
            this.response = data.responseStatus
            this.serviceLst = data.items.map(service => new RegistrableService(service))
          } else if (data.responseStatus.success == false) {
            this.response = data.responseStatus
          }
        },
        error => {
          this.errorHandler.showError(error)
        },
        () => {
          if (this.response.success == false) this.errorHandler.showError('Không có danh sách dịch vụ')
        }
      )
    }
  }
  sendApprovableProcess(processId: string) {
    debugger
    this.missionService.setLoading(true)
    return this.approvalCifService.sendApprove(new ApprovableProcess(processId)).subscribe(
      data => {
        if (data.success && data.success == true) {
          this.response = data
          this.missionService.setMission('Thông tin duyệt dịch vụ')
        } else if (data && data.success == false) {
          this.response = data
        }
        // else {this.errorHandler.showError('Có lỗi xảy ra') }
      },
      error => {
        this.missionService.setLoading(false)
        this.errorHandler.showError(error)
      },
      () => {
        this.missionService.setLoading(false)
        this.errorHandler.messageHandler(this.response, 'Gửi duyệt hồ sơ thành công')
        this.getProcessInformation(this.processId)
      }
    )
  }
  closeApprovableProcess(processId: string) {
    this.missionService.setLoading(true)
    return this.approvalCifService.inputterClose(new ApprovableProcess(processId)).subscribe(
      data => {
        if (data && data.success == true) {
          this.response = data
        } else if (data && data.success == false) {
          this.response = data
        } else {this.errorHandler.showError('Có lỗi xảy ra') }
      },
      error => {
        this.missionService.setLoading(false)
        this.errorHandler.showError(error)
      },
      () => {
        this.missionService.setLoading(false)
        this.errorHandler.messageHandler(this.response, 'Đóng hồ sơ thành công')
        this.getProcessInformation(this.processId)
      }
    )
  }
  deleteApprovableProcess(processId: string) {
    this.missionService.setLoading(true)
    return this.cifService.deleteProcess(processId).subscribe(
      data => {
        if (data.responseStatus) {
          this.response = data.responseStatus
        } else if (data.responseStatus && data.responseStatus.success == false) {
          this.response = data.responseStatus
        } else {this.errorHandler.showError('Có lỗi xảy ra') }
      },
      error => {
        this.missionService.setLoading(false)
        this.errorHandler.showError(error)
      },
      () => {
        this.missionService.setLoading(false)
        this.errorHandler.messageHandler(this.response, 'Xóa hồ sơ thành công')
        this.getProcessInformation(this.processId)
      }
    )
  }
  openDeleteFileDialog() {
    let dialogRef = this.dialog.open(PopupConfirmComponent, DialogConfig.configDialogConfirm({number: 13}))
    dialogRef.afterClosed().subscribe(rs => {
        if (rs == 1) {
          this.deleteApprovableProcess(this.processId)
        }
      }
    )
  }
  openCloseFileDialog() {
    let dialogRef = this.dialog.open(PopupConfirmComponent, DialogConfig.configDialogConfirm({number: 9}))
    dialogRef.afterClosed().subscribe(rs => {
        if (rs == 1) {
          this.closeApprovableProcess(this.processId)
        }
      }
    )
  }
  openSendFileDialog() {
    let dialogRef = this.dialog.open(PopupConfirmComponent, DialogConfig.configDialogConfirm({number: 12}))
    dialogRef.afterClosed().subscribe(rs => {
        if (rs == 1) {
          this.sendApprovableProcess(this.processId)
        }
      }
    )
  }
  openHistoryDialog() {
    let dialogRef = this.dialog.open(PopupHistoryProcessComponent, DialogConfig.configDialogHistory({number: 13}))
    dialogRef.afterClosed().subscribe(rs => {
        // if (rs == 1) {
        //   this.deleteApprovableProcess(this.processId)
        // }
      }
    )
  }

  showCloseButton() {
    return this.process.statusId == 'M'
  }
  showDeleteButton() {
    return this.process.statusId == 'E'
  }
  showSendButton() {
    return this.process.statusId == 'E' || this.process.statusId == 'M'
  }

}
