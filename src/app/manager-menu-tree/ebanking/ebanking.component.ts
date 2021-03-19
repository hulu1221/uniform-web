import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ModalComponent} from '../../manager-smart-form/modal/modal.component';
import {FormControl, FormGroup} from '@angular/forms';
import { PopupConfirmComponent } from 'src/app/_popup/popup-confirm.component';
import { DialogConfig } from 'src/app/_utils/_dialogConfig';

@Component({
  selector: 'app-ebanking',
  templateUrl: './ebanking.component.html',
  styleUrls: ['./ebanking.component.css']
})
export class EbankingComponent implements OnInit {

  customerInfoShower: boolean;
  eBankingListShower: boolean;
  eBankingActionShower: boolean;
  eBankingUpdating: boolean;
  accLst: EBanking[] = [
    { loginAccount: 'LA1',
      defaultAccount: '[Tài khoản mới - 1]',
      email: 'email@email.com',
      accountPlan: 'plan1',
      authorizedMethod: 'smsOtp',
      phone: '0355848045',
      employeeId: 'thisIsEmployeeId',
      processStatus: 'Khởi tạo',
      serviceStatus: 'trạng thái 1'
    },
    { loginAccount: 'LA2',
      defaultAccount: '[Tài khoản mới - 2]',
      email: 'email@email.com',
      accountPlan: 'plan1',
      authorizedMethod: 'smsOtp',
      phone: '0355848045',
      employeeId: 'thisIsEmployeeId',
      processStatus: 'Khởi tạo',
      serviceStatus: 'trạng thái 2'
    },
  ];
  public eBankingForm = new FormGroup({
    loginAccount: new FormControl(''),
    email: new FormControl(''),
    paymentAccount: new FormControl(''),
    accountPlan: new FormControl(''),
    authorizedMethod: new FormControl(''),
    phone: new FormControl(''),
    employeeId: new FormControl(''),
  });

  constructor(public matDialog: MatDialog, private router: Router,private dialog: MatDialog) { }

  ngOnInit(): void {
    this.customerInfoShower = true;
    this.eBankingListShower = true;
    this.eBankingActionShower = false;
    this.eBankingUpdating = false;
  }

  // tslint:disable-next-line:typedef
  createAccount() {
    this.eBankingListShower = false;
    this.eBankingUpdating = false;
    console.log('create new e-banking account');
  }

  // tslint:disable-next-line:typedef
  public onSubmit() {
    const newAccount = {};
    for (const controlName in this.eBankingForm.controls) {
      if (controlName) {
        newAccount[controlName] = this.eBankingForm.controls[controlName].value;
      }
    }
    console.log(newAccount);
    this.accLst.push(newAccount as EBanking);
  }

  // tslint:disable-next-line:typedef
  backToList() {
    this.eBankingListShower = true;
  }


  // tslint:disable-next-line:typedef
  updateAccount(eBankingAccount: any) {
    console.log('update e-banking account');
    console.log(eBankingAccount);
    this.eBankingListShower = false;
    this.eBankingUpdating = true;
  }

  // tslint:disable-next-line:typedef
  detailAccount(loginAccount: any) {
    console.log(loginAccount);
    this.eBankingListShower = false;
    this.eBankingUpdating = true;
  }

  // tslint:disable-next-line:typedef
  openDeleteModal(data: any) {
    data['number'] = 11
    data.code = 'UNI123'
    let dialogRef = this.dialog.open(PopupConfirmComponent, DialogConfig.configDialogConfirm(data))
    dialogRef.afterClosed().subscribe(rs => {
        // if (rs == 1) {
        //   this.approvalFile()
        // }
      }
    )
  }
  // openDeleteModal(eBankingAccount: any) {
  //   const eBankingId = 'eb1';
  //   const dialogConfig = new MatDialogConfig();
  //   dialogConfig.disableClose = false;
  //   dialogConfig.id = 'modal-component';
  //   dialogConfig.height = '211';
  //   dialogConfig.width = '600px';
  //   dialogConfig.data = {
  //     name: 'delete-e-banking-account',
  //     title: 'Bạn chắc chắn thực hiện thao tác?',
  //     description: 'Xóa thông tin dịch vụ EBANKING',
  //     actionButtonText: 'Xóa',
  //     eBankingId
  //   };
  //   this.matDialog.open(ModalComponent, dialogConfig);
  // }


}

export interface EBanking {
  loginAccount: string;
  defaultAccount: string;
  email: string;
  accountPlan: string;
  authorizedMethod: string;
  phone: string;
  employeeId: string;
  processStatus: string;
  serviceStatus: string;
}




