import { Component, OnInit, Inject, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Title } from 'src/app/_models/title';
import { TitleService } from 'src/app/_services/title.service';
import { NotificationService } from 'src/app/_toast/notification_service';
import { ValidatorSpace } from 'src/app/_validator/otp.validator';
@Component({
    selector: 'app-refuse-file',
    templateUrl: './refuse-file.component.html',
    styleUrls: ['./refuse-file.component.scss']
})
export class RefuseFileComponent implements OnInit {
  message: string
  submitted: boolean
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
      private dialogRef: MatDialogRef<RefuseFileComponent>) { }
  ngOnInit() {}
  closeDialog(index: any) {
    this.submitted = true
    if (this.validMessage()) {
      this.dialogRef.close(
        {
          selected: index,
          message: this.message
        }
      );
    }
  }
  exitDialog() {
    this.dialogRef.close()
  }
  validMessage() {
    return this.message != '' && this.message != null && this.message != undefined
  }
  messageValidator() {
    return this.submitted && this.message == '' || this.submitted && this.message == null || this.submitted && this.message == undefined
  }
}