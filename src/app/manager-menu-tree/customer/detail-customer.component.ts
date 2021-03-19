import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {IndivCifService} from "../../_services/indiv-cif.service";
import {DetailProcess, Process} from "../../_models/process";
import {CifCondition} from "../../_models/cif";
import {Location} from "@angular/common";
import {ErrorHandlerService} from "../../_services/error-handler.service";
import {MissionService} from "../../services/mission.service";
import {MatDialog} from "@angular/material/dialog";
import {PopupConfirmComponent} from "../../_popup/popup-confirm.component";
import {DialogConfig} from "../../_utils/_dialogConfig";
import {PopupHistoryProcessComponent} from "../../_popup/popup-history-process/popup-history-process.component";
declare var $: any;
@Component({
  selector: 'app-detail-customer',
  templateUrl: './detail-customer.component.html',
  styleUrls: ['./detail-customer.component.css']
})
export class DetailCustomerComponent implements OnInit {
  detailProcess: DetailProcess = new DetailProcess(null)
  process: Process = new Process(null)
  constructor(private router: Router,
              private route: ActivatedRoute,
              private cifService: IndivCifService,
              private _location: Location,
              private errorHandler: ErrorHandlerService,
              private missionService: MissionService,
              private dialog: MatDialog
              ) {
    }
  ngOnInit() {
    $('.childName').html('Khách hàng')
    this.missionService.setLoading(true)
    this.route.paramMap.subscribe(paramMap => this.getProcessInformation(paramMap.get('processId')))
  }
  getProcessInformation(processId) {
    let condition = new CifCondition();
    condition.id = processId
    this.cifService.getCifList(condition).subscribe(data => {
      if (data.items) this.process = new Process(data.items[0])
    },
    error => {
      this.errorHandler.showError(error)
      this.missionService.setLoading(false)
    },
    () => {
      if (this.process.statusId == 'E' || this.process.statusId == 'M') {
        this.missionService.setMission('Gửi duyệt')
      }  else this.missionService.setMission('Thông tin duyệt dịch vụ')
    }
    )
    this.missionService.setProcessId(processId)
    if (processId) {
      this.cifService.detailProcess(processId).subscribe(data => {
        this.detailProcess = new DetailProcess(data.customer)
        if (!this.detailProcess.processId) {
          this.errorHandler.showError("Hồ sơ không tồn tại")
        }
        this.missionService.setLoading(false)
      },error => this.missionService.setLoading(false))
    } else this._location.back()
  }

  update(processId: string) {
    this.router.navigate(['./smart-form/updateCif', { processId: processId}]);
  }
  backPage() {
    this._location.back();
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
}
