import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-popup-search',
  templateUrl: './popup.search.component.html',
  styleUrls: ['./popup.search.component.scss']
})
export class PopupSearchComponent implements OnInit {
  showCLose: boolean
  constructor(@Inject(MAT_DIALOG_DATA)public data:any,
  private dialogRef:MatDialogRef<PopupSearchComponent>) { }
  ngOnInit() {
    this.showCLose = this.data.data != null
  }

  closeDialog(index:any){
      this.dialogRef.close(index);
  }
}
