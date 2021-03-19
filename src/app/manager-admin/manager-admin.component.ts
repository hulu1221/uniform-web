import { Component, OnInit, Inject, Input,} from '@angular/core';
import {  Router} from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';
// import * as $ from 'jquery';
declare var $: any;
@Component({
  selector: 'app-manager-admin',
  templateUrl: './manager-admin.component.html',
  styleUrls: ['./manager-admin.component.scss'],
})
export class ManagerAdminComponent implements OnInit  {
  constructor(private router: Router,private authenticationService: AuthenticationService) {}
  ngOnInit() {
  }
  logout(){
    this.authenticationService.logout()
  }
}
