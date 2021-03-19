import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MissionService } from "../services/mission.service";
import {AccountService} from '../_services/account.service';
import {AccountModel} from '../_models/account';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import {MenuTree, TreeNode} from '../_models/menu.tree';

declare var $: any;

@Component({
  selector: 'app-manager-menu-tree',
  templateUrl: './manager-menu-tree.component.html',
  styleUrls: ['./manager-menu-tree.component.scss'],
  providers: [MissionService]
})
export class ManagerMenuTreeComponent implements OnInit {
  menuTree: MenuTree = new MenuTree()
  mocl: boolean
  accounts: AccountModel[] = []
  navigationSubscription;
  roleLogin: any = []
  processId: string
  isKSV: boolean
  isGDV: boolean
  message: string
  param: any
  mode = 'indeterminate';
  value = 50;
  color = 'primary';
  displayProgressSpinnerInBlock: boolean

  recursive: boolean = true;
  levels = new Map<TreeNode, number>();
  treeControl: NestedTreeControl<TreeNode>;
  dataSource: MatTreeNestedDataSource<TreeNode>;
  aRouter: any = ['customer', {processId: '123'}]
  constructor(private router: Router,
    private accountService: AccountService,
    private _changeDetectionRef: ChangeDetectorRef,
    private missionService: MissionService) {
    this.treeControl = new NestedTreeControl<TreeNode>(this.getChildren);
    this.dataSource = new MatTreeNestedDataSource();
    this.dataSource.data = this.menuTree.getTree()
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
  }
  getChildren = (node: TreeNode) => {
    return node.children;
  };

  hasChildren = (index: number, node: TreeNode) => {
    return node.children.value.length > 0;
  }
  getMission() {
    this.missionService.missionAnnounced$.subscribe(message => this.message = message)
    this.missionService.processId$.subscribe(id => {
      this.param = { processId: id }
      this.menuTree.setProcessId(id)
      this.getAccountList(id)
    })
    this.missionService.showLoading$.subscribe(loading => {
      this.displayProgressSpinnerInBlock = loading;
      this._changeDetectionRef.detectChanges();
    })
  }
  ngOnDestroy(): void {
    // Destroy navigationSubscription to avoid memory leaks
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }
  click() {
    // const $ = document.querySelector.bind(document)
    // const $$ = document.querySelectorAll.bind(document)

    // const tabs = $$('.trigger')
    // const panes = $$('ul.tree-parent')
    // tabs.forEach((tab, index) => {
    //   tab.onclick = function () {
    //     if ($('.trigger.activeTree') !== null) {
    //       $('.trigger.activeTree').classList.remove('activeTree')
    //     } else {
    //       this.classList.add('activeTree')
    //     }
    //     // var x = document.getElementById("triggerAccount");
    //     // var childUl = $(this).siblings("ul.tree-parent");
    //     // if (childUl.hasClass('open')) {
    //     //   childUl.removeClass('open');
    //     //   x.innerText = "add"
    //     // } else {
    //     //   childUl.addClass('open');
    //     //   x.innerText = "remove"
    //     // }
    //     console.log(this)
    //   }
    // });
    $('.trigger').click(function (e) {
      e.preventDefault();
      var x = document.getElementById("triggerAccount");
      // x.classList.toggle("fa-angle-down");

      var childUl = $(this).siblings("ul.tree-parent");
      if (childUl.hasClass('open')) {
        childUl.removeClass('open');
        x.innerText = "add"
      } else {
        childUl.addClass('open');
        x.innerText = "remove"
      }
    });
    $('.view').click(function (e) {
      e.preventDefault();
      var child = $(this).siblings("ul.tree-parent");
      if (child.hasClass('child')) {
        child.removeClass('child');
      } else {
        child.addClass('child');
      }
    })
  }
  fun_reload() {
    this.navigationSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Trick the Router into believing it's last link wasn't previously loaded
        this.router.navigated = false;
        location.reload()
        window.scrollTo(0, 0)
      }
    });
  }
  ngOnInit() {
    this.roleLogin = JSON.parse(localStorage.getItem("role"))
    this.displayProgressSpinnerInBlock= false
    $('.parentName').html('Tài khoản')
    for (let i = 0; i < this.roleLogin.length; i++) {
      if (this.roleLogin[i] === "UNIFORM.BANK.GDV") {
        this.isGDV = true
      } else if (this.roleLogin[i] === "UNIFORM.BANK.KSV") {
        this.isKSV = true
      }
    }

    this.mocl = true
    var childUl = $('ul.tree-parent');
    if (childUl.hasClass('open')) {
      childUl.removeClass('open')
    }
    if (childUl.hasClass('child')) {
      childUl.removeClass('child')
    }
    this.click()
    this.getMission()

  }
  getAccountList(id: string){
    this.accountService.getAccountList({processId: id}).subscribe(rs =>{
      if( rs.items !==undefined && rs.items.length >0){
        this.accounts = rs.items
        this.menuTree.setAccountList(this.accounts)
        this.refreshTree()

      }else{
        this.accounts = null
      }
    })
  }
  refreshTree() {
    this.dataSource.data = []
    this.dataSource.data = this.menuTree.getTree()
  }
  // ngAfterViewInit(){
  //   // $( ".custom-height" ).attr("style", `height: ${window.innerHeight -138}px`);
  //   // $( ".custom-card" ).attr("style", `height: ${window.innerHeight -137}px`);
  // }
  getOutHeight() {
    return window.innerHeight -138
  }
  getInHeight() {
    return window.innerHeight -137
  }
}
