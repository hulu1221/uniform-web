import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-popup-confirm',
  templateUrl: './popup-confirm.component.html',
  styleUrls: ['./popup-confirm.component.scss']
})
export class PopupConfirmComponent implements OnInit {
    title:any
    content:any
    hidden = false
    constructor(@Inject(MAT_DIALOG_DATA)public data:any,
    private dialogRef:MatDialogRef<PopupConfirmComponent>) { }
    ngOnInit() {
      this.title = 'Xác nhận'
      if(this.data.data.number == 1){
        this.hidden = true
        this.content = 'Bạn chưa lưu thông tin thay đổi'
      }else if(this.data.data.number == 2){
        this.content = 'Bạn có chắc xóa nhân viên có mã '+this.data.data.employeeId
      }else if(this.data.data.number == 3){
        this.content = 'Bạn có muốn khóa nhân viên có mã '+this.data.data.employeeId
      }else if(this.data.data.number == 4){
        this.content = 'Bạn có muốn mở khóa cho nhân viên có mã '+this.data.data.employeeId
      }else if(this.data.data.number == 5){
        this.content = 'Bạn có muốn xóa chức danh có mã '+this.data.data.code
      }else if(this.data.data.number == 6){
        this.content = 'Bạn có muốn xóa quyền có mã '+this.data.data.code
      }else if(this.data.data.number == 7){
        this.content = 'Bạn có muốn xóa hồ sơ có mã ' + this.data.data.code
      }else if(this.data.data.number == 8){
        this.content = 'Duyệt dịch vụ này?'
      }else if(this.data.data.number == 9){
        this.content = 'Bạn có chắc chắn muốn đóng hồ sơ?'
      }else if(this.data.data.number == 10){
        this.content = 'Bạn có chắc chắn muốn duyệt tất cả dịch vụ?'
      }else if(this.data.data.number == 11){
        this.content = 'Bạn có chắc chắn thực hiện thao tác?'
      }else if(this.data.data.number == 12){
        this.content = 'Gửi duyệt hồ sơ này?'
      }else if(this.data.data.number == 13){
        this.content = 'Xóa hồ sơ này?'
      }else if(this.data.data.number == 14){
        this.content = 'Bạn có muốn xóa tài khoản ' + this.data.data.code +' này không?'
      }
      else if(this.data.data.number == 15){
        this.content = 'Xóa quyền?'
      }
      else if(this.data.data.number == 16){
        this.content = 'Bạn có chắc chắn muốn xóa đồng sở hữu này?'
      }
      else{
        this.content = 'Bạn có đồng ý với thay đổi'
      }
    }

    closeDialog(index:any){
        this.dialogRef.close(index);
    }
}
