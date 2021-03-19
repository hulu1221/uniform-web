import { Routes } from '@angular/router';
import { AccountComponent } from './account/account-component';
import { AuthorityComponent } from './authority/authority-component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { CreateAuthorityComponent } from './create-authority/create-authority.component';
import { DetailCustomerComponent } from './customer/detail-customer.component';
import { DetailAccountComponent } from './detail-account/detail-account.component';
import { DetailAuthorityComponent } from './detail-authority/detail-authority.component';
import { EbankingComponent } from './ebanking/ebanking.component';
import { ManagerMenuTreeComponent } from './manager-menu-tree.component';
// import { MenuTreeComponent } from '../manager-smart-form/menu-tree/menu-tree.component';
import { SendForApprovalComponent } from './sendForApproval/send-for-approval.component';
import { ServiceBrowsingComponent } from './service-browsing/service-browsing.component';
import { UpdateAccountComponent } from './update-account/update-account.component';
import { UpdateAuthorityComponent } from './update-authority/update-authority.component';
import {CreateCoOwnerComponent} from './create-co-owner/create-co-owner.component';
import {CoOwnerAccountComponent} from './co-owner-account/co-owner-account.component';
import {DetailCoOwnerComponent} from './detail-co-owner/detail-co-owner.component';


export const routesMenuTree: Routes = [
    { path: '', component: ManagerMenuTreeComponent,
        children:[
            {path:'confirm',component:SendForApprovalComponent},
            {path: 'account', component:AccountComponent,runGuardsAndResolvers: 'always'},
            {path:'createAccount',component: CreateAccountComponent},
            {path:'detailAccount',component:DetailAccountComponent},
            {path:'customer',component:DetailCustomerComponent},
            {path:'ebanking',component:EbankingComponent},
            {path:'service-approval',component:ServiceBrowsingComponent},
            {path: 'updateAccount', component:UpdateAccountComponent},
          // {path: 'authority/:processId/:accountId', component:AuthorityComponent},
            {path: 'authority', component:AuthorityComponent},
            {path: 'createAuthority', component:CreateAuthorityComponent},
            {path: 'detailAuthority', component:DetailAuthorityComponent},
            {path: 'updateAuthority', component:UpdateAuthorityComponent},
            {path: 'co-owner', component: CoOwnerAccountComponent},
            {path: 'co-owner/create', component: CreateCoOwnerComponent},
            {path: 'co-owner/update', component: CreateCoOwnerComponent},
            {path: 'co-owner/detail', component: DetailCoOwnerComponent},
            // {path:'processRequest', component:ProcessTheRequestComponent},
            // {path:'detailCustomer',component: DetailCustomerComponent},
            // {path:'lstAccount',component: LstAccountComponent},
            // {path:'createAccount',component: CreateAccountComponent},
            // {path:'detailAccount',component:DetailAccountComponent}
        ]
    },

];

