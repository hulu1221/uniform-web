import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';
declare var $: any;
@Component({
  selector: 'smart-form',
  templateUrl: './smart-form.components.html',
  styleUrls: ['./smart-form.components.scss']
})
export class SmartFormComponent implements OnInit {
  title: string = 'a'
  time = new Date()
  timer: any
  permissions: any = []
  permissionMenu: any = []
  name: any
  index: any
  parentName: string
  childrenName: any
  returnUrl: string;
  roleLogin: any = []
  functionLogin: any = []
  actionLogin: any = []
  constructor(public authenticationService: AuthenticationService, private router: Router,
    private route: ActivatedRoute,) { }
  ngOnDestroy() {
    clearInterval(this.timer);
  }
  ngOnInit(): void {
    let userInfo = JSON.parse(localStorage.getItem("userInfo"))
    let flag = JSON.parse(sessionStorage.getItem("flag"))
    this.name = userInfo.userName
    this.roleLogin = JSON.parse(localStorage.getItem("role"))
    this.functionLogin = JSON.parse(localStorage.getItem("function"))
    this.actionLogin = JSON.parse(localStorage.getItem("action"))
    let index = JSON.parse(localStorage.getItem("index"))
    this.timer = setInterval(() => {
      this.time = new Date();
    }, 1000);
    if ((index === undefined || index === null) && flag === null) {
      this.checkPermission()
    } else {
      let permissionMenu = this.functionLogin
      let permissions = this.actionLogin
      let permissionMenuList = $('.menuParent')
      permissionMenuList.each(function (index) {
        let p = $(this).children().attr('menu-data')
        if (!permissionMenu.includes(p)) {
          $(this).hide()
        }
      })
      let element = $('.checkPermission')
      element.each(function (index) {
        let p = $(this).attr('permission-data')
        if (!permissions.includes(p)) {
          $(this).hide()
        }
      })
    }
  }
  clickMenuAdmin(id: any) {
    localStorage.setItem('index', id)
    window.location.href = "/smart-form/admin";
  }
  checkPermission() {
    let permissionMenu = this.functionLogin
    let permissions = this.actionLogin
    let permissionMenuList = $('.menuParent')
    permissionMenuList.each(function (index) {
      let p = $(this).children().attr('menu-data')
      if (!permissionMenu.includes(p)) {
        $(this).hide()
      }
    })
    let element = $('.checkPermission')
    element.each(function (index) {
      let p = $(this).attr('permission-data')
      if (!permissions.includes(p)) {
        $(this).hide()
      }
    })
    sessionStorage.setItem('flag','0');
    if (this.roleLogin.length == 1) {
      for (let i = 0; i < this.roleLogin.length; i++) {
        if (this.roleLogin[i] === "UNIFORM.BANK.QUANTRI") {
          this.returnUrl = 'smart-form/admin'
          this.router.navigate([this.returnUrl])
        }else if(this.roleLogin[i] === "UNIFORM.BANK.GDV"){
          this.returnUrl = 'smart-form/fileProcessed'
          this.router.navigate([this.returnUrl])
        }else if(this.roleLogin[i] === "UNIFORM.BANK.KSV"){
          this.returnUrl = 'smart-form/process/list'
          this.router.navigate([this.returnUrl])
        }else{
          this.returnUrl = 'smart-form'
          this.router.navigate([this.returnUrl])
        }
      }
    } else {
      if (this.roleLogin.includes("UNIFORM.BANK.GDV")) {
        this.returnUrl = 'smart-form/fileProcessed'
        this.router.navigate([this.returnUrl])
      } else if (this.roleLogin.includes("UNIFORM.BANK.KSV")) {
        this.returnUrl = 'smart-form/process/list'
        this.router.navigate([this.returnUrl])
      } else {
        this.returnUrl = 'smart-form'
        this.router.navigate([this.returnUrl])
      }
    }

  }
  logout() {
    this.authenticationService.logout()
  }

}
