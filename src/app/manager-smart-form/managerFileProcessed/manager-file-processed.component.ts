import { Component, Inject, OnInit } from '@angular/core';
import { PopupManagerFileComponent } from '../popup/popup-manager-file.component';
import { GecoDialog } from 'angular-dynamic-dialog';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import {  Router } from '@angular/router';
import {Pagination} from "../../_models/pager";
import {Process} from "../../_models/process";
import {IndivCifService} from "../../_services/indiv-cif.service";
import {CifCondition} from "../../_models/cif";
import { DialogConfig } from 'src/app/_utils/_dialogConfig';
declare var $: any;
@Component({
  selector: 'app-manager-file-processed.component',
  templateUrl: './manager-file-processed.component.html',
  styleUrls: ['./manager-file-processed.component.css']
})
export class ManagerFileProcessedComponent implements OnInit {
  processList: Process[]
  activePage: number = 1
  pageSize: number = 10
  count: number
  valueSearch: string
  filterSelected: string = '1'
  condition: CifCondition = new CifCondition()
  pagination: Pagination = new Pagination()
  constructor(private modal: GecoDialog,
              private dialog: MatDialog,
              private router: Router,
              private cifService: IndivCifService,
              ) { }

  ngOnInit(): void {
    $('.parentName').html('Quản lý hồ sơ')
    $('.childName').html('Danh sách hồ sơ đang xử lý')
    this.condition.statusId = 'E'
    // this.condition.inputBy = 'ANHTN1'
    this.getProcessList(this.condition);
  }

  getProcessList(condition: CifCondition) {
    this.cifService.getCifList(condition).subscribe(
      data => {
        if (data.items) {
          this.processList = data.items.map(item => new Process(item))
          this.pagination = new Pagination(data.count, this.activePage, this.pageSize)
        }
      }
    )
  }
  asyncSearch() {
    return new Promise(resolve => {
      this.cifService.getCifList(this.condition).subscribe(
        data => {
          if (data.items) {
            this.processList = data.items.map(item => new Process(item))
            this.pagination = new Pagination(data.count, this.activePage, this.pageSize)
            resolve(this.processList.length);
          } else {
            this.processList = null
            this.pagination = new Pagination(0, this.activePage, this.pageSize)
            resolve(0);
          }
        }
      )
    })
  }
  search(){
    if (this.onValueSearchChange()) {

    } else {
      this.onFilterChange(this.filterSelected)
      this.asyncSearch().then(processLength => {
          if (!processLength || processLength == 0) {
            this.openCifDialog()
          }
      });
    }
  }

  openCifDialog(){
    // const dialogConfig = new MatDialogConfig();
    // dialogConfig.width = "600px"
    // dialogConfig.position = {
    //   // top: '75px', left: '135px'
    //   top:'170px'
    // }
    // let dialogRef = this.dialog.open(PopupManagerFileComponent,dialogConfig)
    // dialogRef.afterClosed().subscribe(rs =>{
    //   if(rs == 1){
    //     this.router.navigate(['./smart-form/registerService']);
    //   }
    // }
    // )
    let dialogRef = this.dialog.open(PopupManagerFileComponent, DialogConfig.configSearchInfoCustom())
    dialogRef.afterClosed().subscribe(rs => {
      if (rs == 1) {
        this.router.navigate(['./smart-form/registerService']);
      }
    }
    )
  }
  detail(processId: string) {
    this.router.navigate(['./smart-form/manager/customer', { processId: processId}]);
  }
  changePageSize(size: string) {
    this.pageSize = parseInt(size);
    if (this.pageSize < 0) {return}
    this.activePage = 1
    this.condition.page = this.activePage
    this.condition.size = this.pageSize
    this.getProcessList(this.condition)
  }

  setPage(pageNumber: any) {
    if (pageNumber < 1 || pageNumber > this.pagination.pager.totalPages) {
      return;
    } else {
      this.activePage = pageNumber
      this.condition.page = pageNumber
      this.getProcessList(this.condition)
    }
  }
  // 1 CMND/ Ho Chieu; 2: Ma Khach hang
  onFilterChange(selection: string) {
    if (selection == '1') {
      this.condition.code = this.valueSearch
    } else if (selection == '2') {
      this.condition.code = this.valueSearch
    }
  }
  valueSearchValid: boolean
  onValueSearchChange() {
    return this.valueSearchValid = this.valueSearch ? !(this.valueSearch.length > 0) : true
  }

}
