import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GecoDialogModule } from 'angular-dynamic-dialog';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {MatTreeModule} from '@angular/material/tree';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatButtonModule} from '@angular/material/button';
import { routesMenuTree } from './menu-tree-routing';
import { SendForApprovalComponent } from './sendForApproval/send-for-approval.component';
import { ManagerMenuTreeComponent } from './manager-menu-tree.component';
import { AccountComponent } from './account/account-component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { DetailAccountComponent } from './detail-account/detail-account.component';
import { DetailCustomerComponent } from './customer/detail-customer.component';
import { EbankingComponent } from './ebanking/ebanking.component';
import { ServiceBrowsingComponent } from './service-browsing/service-browsing.component';
import { RefuseFileComponent } from './refuse-file/refuse-file.component';
import {ProgressSpinnerModule} from "../progress-spinner/progress-spinner.module";
import { UpdateAccountComponent } from './update-account/update-account.component';
import { SharedModule } from '../shared.module';
import { AuthorityComponent } from './authority/authority-component';
import { DetailAuthorityComponent } from './detail-authority/detail-authority.component';
import { UpdateAuthorityComponent } from './update-authority/update-authority.component';
import { CreateAuthorityComponent } from './create-authority/create-authority.component';
import { DatePipe } from '@angular/common';
import { SharedDialogModule } from '../shared.dialog.module';
import { NgSelectModule } from '@ng-select/ng-select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { PopupSearchComponent } from '../_popup-search/popup.search.component';
import { CreateCoOwnerComponent } from './create-co-owner/create-co-owner.component';
import { CoOwnerAccountComponent } from './co-owner-account/co-owner-account.component';
import {MatRadioModule} from '@angular/material/radio';
import { DatePicker1Component } from './date-picker1/date-picker1.component';
import { DetailCoOwnerComponent } from './detail-co-owner/detail-co-owner.component';
import { CifRegisterComponent } from './cif-register/cif-register.component';

@NgModule({
  declarations: [
    ManagerMenuTreeComponent,
    SendForApprovalComponent,
    AccountComponent,
    CreateAccountComponent,
    DetailAccountComponent,
    DetailCustomerComponent,
    EbankingComponent,
    ServiceBrowsingComponent,
    RefuseFileComponent,
    UpdateAccountComponent,
    AuthorityComponent,
    DetailAuthorityComponent,
    UpdateAuthorityComponent,
    CreateAuthorityComponent,
    PopupSearchComponent,
    CreateCoOwnerComponent,
    CoOwnerAccountComponent,
    DatePicker1Component,
    DetailCoOwnerComponent,
    CifRegisterComponent,
  ],
    imports: [
        CommonModule,
        RouterModule.forChild(routesMenuTree),
        GecoDialogModule,
        MatDatepickerModule,
        MatSelectModule,
        MatInputModule,
        MatNativeDateModule,
        MatFormFieldModule,
        FormsModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatCardModule,
        MatIconModule,
        MatTreeModule,
        ReactiveFormsModule,
        ProgressSpinnerModule,
        SharedModule,
        NgSelectModule,
        SharedDialogModule,
        MatCheckboxModule,
        MatRadioModule
    ],
  entryComponents:[
    RefuseFileComponent,
    PopupSearchComponent
  ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
     DatePipe
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class ManagerMenutreeModule { }
