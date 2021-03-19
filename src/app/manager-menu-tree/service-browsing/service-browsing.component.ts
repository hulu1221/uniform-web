import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ApprovableProcess, Process} from "../../_models/process";
import {CifCondition} from "../../_models/cif";
import {IndivCifService} from "../../_services/indiv-cif.service";
import { MatDialog } from '@angular/material/dialog';
import { DialogConfig } from 'src/app/_utils/_dialogConfig';
import { RefuseFileComponent } from '../refuse-file/refuse-file.component';
import {Location} from "@angular/common";
import {ErrorHandlerService} from "../../_services/error-handler.service";
import {PopupConfirmComponent} from "../../_popup/popup-confirm.component";
import {ApprovalCifService} from "../../_services/approval-cif.service";
import {RegistrableService} from "../../_models/registrable-service";
import {ResponseStatus} from "../../_models/response";
import {MissionService} from "../../services/mission.service";
import {PopupHistoryProcessComponent} from "../../_popup/popup-history-process/popup-history-process.component";

declare var $: any;

@Component({
  selector: 'service-browsing',
  templateUrl: './service-browsing.component.html',
  styleUrls: ['./service-browsing.component.scss']
})
export class ServiceBrowsingComponent implements OnInit {
  processId: string
  process: Process = new Process()
  serviceLst: RegistrableService[]
  response: ResponseStatus
  constructor(private router: Router,private dialog: MatDialog,
              private route: ActivatedRoute,
              private cifService: IndivCifService,
              private approvalCifService: ApprovalCifService,
              private _location: Location,
              private errorHandler: ErrorHandlerService,
              private missionService: MissionService) {
    }
  ngOnInit() {
    $('.childName').html('Duyệt dịch vụ')
    this.route.paramMap.subscribe( paramMap => this.getApprovalInformation(paramMap.get('processId')))
  }
  backPage() {
    this._location.back();
  }
  getApprovalInformation(processId: string) {
    if (processId) {
      this.missionService.setProcessId(processId)
      this.processId = processId
      // thong tin ho so
      this.getProcessInformation(processId)
      // danh sach dich vu dang ky
      this.getRegistrableService(processId)
    }
  }
  getProcessInformation(processId: string) {
    let condition = new CifCondition();
    condition.id = processId
    this.cifService.getCifList(condition).subscribe(data => {
      if (data.items) this.process = new Process(data.items[0])
      if (!this.process.id) {
        this.errorHandler.showError("Hồ sơ không tồn tại")
        // this.router.navigate(['./smart-form'])
      }
    })
  }
  getRegistrableService(processId: string) {
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
        this.missionService.setLoading(false)
        this.errorHandler.showError(error)
      },
      () => {
        if (this.response.success == false) this.errorHandler.showError('Không có danh sách dịch vụ')
      }
    )
  }

  closeApprovableProcess(processId: string) {
    this.missionService.setLoading(true)
    return this.approvalCifService.approverClose(new ApprovableProcess(processId)).subscribe(
      data => {
        if (data && data.success == true) {
          this.response = data
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
        this.errorHandler.messageHandler(this.response, 'Đóng hồ sơ thành công')
        this.getApprovalInformation(this.processId)
      }
    )
  }
  closeRefusedFileDialog() {
    let dialogRef = this.dialog.open(PopupConfirmComponent, DialogConfig.configDialogConfirm({number: 9}))
    dialogRef.afterClosed().subscribe(rs => {
        if (rs == 1) {
          this.closeApprovableProcess(this.processId)
        }
      }
    )
  }

  approvalOne(integratedId: string) {
    this.missionService.setLoading(true)
    return this.approvalCifService.approval(integratedId).subscribe(
      data => {
        console.log(data);
        if (data && data.success == true) {
          this.response = data
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
        this.errorHandler.messageHandler(this.response, 'Duyệt dịch vụ thành công')
        this.getApprovalInformation(this.processId)
      }
    )
  }
  approvalOneDialog(service: RegistrableService) {
    let dialogRef = this.dialog.open(PopupConfirmComponent, DialogConfig.configDialogConfirm({number: 8}))
    dialogRef.afterClosed().subscribe(rs => {
        if (rs == 1) {
          this.approvalOne(service.id)
        }
      }
    )
  }
  approvalAll() {
    this.missionService.setLoading(true)
    return this.approvalCifService.approvalAll(new ApprovableProcess(this.processId)).subscribe(
      data => {
        if (data && data.success == true) {
          this.response = data
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
        this.errorHandler.messageHandler(this.response, 'Duyệt tất cả dịch vụ thành công')
        this.getApprovalInformation(this.processId)
      }
    )
  }
  approvalAllDialog() {
    let dialogRef = this.dialog.open(PopupConfirmComponent, DialogConfig.configDialogConfirm({number: 10}))
    dialogRef.afterClosed().subscribe(rs => {
        if (rs == 1) {
          this.approvalAll()
        }
      }
    )
  }

  sendModifyProcess(processId: string, note: string) {
    this.missionService.setLoading(true)
    return this.approvalCifService.sendModify(new ApprovableProcess(processId, note)).subscribe(
      data => {
        if (data && data.success == true) {
          this.response = data
        }else if (data && data.success == false) {
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
        this.errorHandler.messageHandler(this.response, 'Yêu cầu bổ sung hồ sơ thành công')
        this.getApprovalInformation(this.processId)
      }
    )
  }
  sendRejectProcess(processId: string, note: string) {
    this.missionService.setLoading(true)
    return this.approvalCifService.sendReject(new ApprovableProcess(processId, note)).subscribe(
      data => {
        if (data && data.success == true) {
          this.response = data
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
        this.errorHandler.messageHandler(this.response, 'Từ chối hồ sơ thành công')
        this.getApprovalInformation(this.processId)
      }
    )
  }
  refuseFileDialog(){
    let dialogRef = this.dialog.open(RefuseFileComponent, DialogConfig.configDialog(null))
    dialogRef.afterClosed().subscribe(
      rs => {
        if (rs) {
          if (rs.selected == 1) {
            // Yêu cầu bổ sung
            this.sendModifyProcess(this.processId, rs.message)
          } else if (rs.selected == 0) {
            // Từ chối hồ sơ
            this.sendRejectProcess(this.processId, rs.message)
          }
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

  showSuccessfullyApproval(service: RegistrableService) {
    return service.statusId == 'A'
  }
  showSendModify(service: RegistrableService) {
    return service.statusId == 'M'
  }
  showNeedApproval(service: RegistrableService) {
    return service.statusId == 'W' && this.process.statusId == 'W'
  }
  showCloseButton() {
    return this.process.statusId == 'W' ||
      this.process.statusId == 'P'
  }
  showRefuseButton() {
    return this.process.statusId == 'W' ||
      this.process.statusId == 'P'
  }
  showApproveAllButton() {
    return this.process.statusId == 'W' ||
      this.process.statusId == 'P'
  }
}
