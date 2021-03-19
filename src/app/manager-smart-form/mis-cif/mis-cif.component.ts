import { Component, OnInit, Inject, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationService } from 'src/app/_toast/notification_service';

@Component({
  selector: 'app-mis-cif',
  templateUrl: './mis-cif.component.html',
  styleUrls: ['./mis-cif.component.scss']
})
export class MisCifComponent implements OnInit {
  misForm: FormGroup
  submitted:boolean
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialog: MatDialog,
    private dialogRef: MatDialogRef<MisCifComponent>, 
    private notificationService: NotificationService,private _el: ElementRef) { }
  ngOnInit() {
    this.misForm = new FormGroup({
        CIF_LOAI: new FormControl(null, ),
        CIF_LHKT: new FormControl(null,),
        CIF_TPKT: new FormControl(null,Validators.required),
        CIF_TCTD: new FormControl(null,),
        CIF_KBHTG: new FormControl(null,),
        LHNNNTVAY: new FormControl(null,),
        TD_MANKT: new FormControl(null,),
        CIF_NGANH: new FormControl(null,),
        CIF_PNKH: new FormControl(null,),
        COM_TSCT: new FormControl(null,),
        DC_GH: new FormControl(null,),
        HHXNK: new FormControl(null,),
        LOAI_DN: new FormControl(null,),
        CIF_MANKT: new FormControl(null,),
        CIF_KH78: new FormControl(null,Validators.required),
    });
  }
  get f() {
    return this.misForm.controls;
  }
  returnObj(){

  }
  filterObj(){

  }
  getDataSelect(){
    
  }
  save(index:any){
    this.submitted = true
    if(this.misForm.invalid){
      return
    }
    let returnData = {}
    returnData['index'] = index
    returnData['obj'] = "tesst"
    this.dialogRef.close(returnData);
  }
  closeDialog(index: any) {
    this.dialogRef.close(index);
  }
}
