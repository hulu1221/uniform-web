import { Component, OnInit, Inject, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationService } from 'src/app/_toast/notification_service';

@Component({
  selector: 'app-udf-cif',
  templateUrl: './udf-cif.component.html',
  styleUrls: ['./udf-cif.component.scss']
})
export class UdfCifComponent implements OnInit {
  udfForm: FormGroup
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialog: MatDialog,
    private dialogRef: MatDialogRef<UdfCifComponent>, 
    private notificationService: NotificationService,private _el: ElementRef) { }
  ngOnInit() {
    this.udfForm = new FormGroup({
        CAN_BO_GIOI_THIEU: new FormControl(null),
        THUONG_TAT: new FormControl(null),
        CIF_PNKH: new FormControl(null, Validators.required),
        KHUT: new FormControl(null),
        TEN_DOI_NGOAI: new FormControl(null),
        LV_UD_CN_CAO_CIF: new FormControl(null),
        WEBSITE: new FormControl(null),
        CN_UTPT_1843: new FormControl(null),
        DIEN_THOAI: new FormControl(null),
        DB_KH_VAY: new FormControl(null),
        TONG_SO_LD_HIEN_TAI: new FormControl(null),
        CONG_TY_NN: new FormControl(null),
        NGANH_NGHE_KINH_DOANH: new FormControl(null),
        GROUP_CODE: new FormControl(null),
        TEN_VIET_TAT: new FormControl(null),
        KENH_TAO: new FormControl(null),
        HO_TEN_VO_CHONG: new FormControl(null),
        CIF_DINHDANH: new FormControl(null),
        SO_CMND_HC: new FormControl(null),
        DANG_KY_DV_GD_EMAIL: new FormControl(null),
        NGAY_CAP_CMND_HC: new FormControl(null),
        TONG_DOANH_THU: new FormControl(null),
        NOI_CAP_CMND_HC: new FormControl(null),
        KHOI_DON_VI_GT: new FormControl(null),
        VON_CO_DINH: new FormControl(null),
        DIA_BAN_NONG_THON: new FormControl(null),
        VON_LUU_DONG: new FormControl(null),
        MA_CBNV_LPB: new FormControl(null),
        NO_PHAI_THU: new FormControl(null),
        CIF_GIAM_DOC: new FormControl(null),
        NO_PHAI_TRA: new FormControl(null),
        CIF_KE_TOAN_TRUONG: new FormControl(null),
        MA_HUYEN_THI_XA: new FormControl(null),
        COMBO_SAN_PHAM_2018: new FormControl(null),
        VI_TRI_TO_LKET: new FormControl(null),
        EXPIRED_DATE: new FormControl(null),
        MA_TCTD: new FormControl(null),
        PNKH_KHDK: new FormControl(null),
        TC_K_TCTD: new FormControl(null),
        TRA_CUU_TT_STK: new FormControl(null),
        TONG_NGUON_VON: new FormControl(null),
        SDT_NHAN_SMS: new FormControl(null),
        KY_DANH_GIA_TNV: new FormControl(null),
        SO_BAO_HIEM_XA_HOI: new FormControl(null),
        KHACH_HANG: new FormControl(null),
        NGUOI_DAI_DIEN_PHAP_LUAT: new FormControl(null),
        LOAI_CHUONG_TRINH: new FormControl(null),
        CMND_CCCD_HC: new FormControl(null),
        TU_NGAY: new FormControl(null),
        NHA_HDDT_QUA_EMAIL: new FormControl(null),
        DEN_NGAY: new FormControl(null),
    });
  }
  get f() {
    return this.udfForm.controls;
  }
 
  closeDialog(index: any) {
    this.dialogRef.close(index);
  }
}
