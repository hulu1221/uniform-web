import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lst-account',
  templateUrl: './lst-account.component.html',
  styleUrls: ['./lst-account.component.scss']
})
export class LstAccountComponent implements OnInit {
    constructor(private router:Router) { }
    ngOnInit() {
    }
    createAccount(){
      this.router.navigate(['./smart-form/createAccount']);
    }
    detailAccount(){
      this.router.navigate(['./smart-form/detailAccount']);
    }
}
