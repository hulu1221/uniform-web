import { Routes } from '@angular/router';
// import { DetailCustomerComponent } from './detail-customer/detail-customer.component';
import { LstAccountComponent } from './lst-account/lst-account.component';
import { ManagerFileProcessedComponent } from './managerFileProcessed/manager-file-processed.component';
import { ProcessTheRequestComponent } from './processtheRequest/process-the-request.component';
import { RegisterCifComponent } from './resgisterCif/register-cif.component';
import { SmartFormComponent } from './smart-form.components';
import {ListProcessComponent} from "./list-process/list-process.component";
import { CanDeactivateGuard } from '../_helpers/canDeactiveGuard';
import {CifRegisterComponent} from '../manager-menu-tree/cif-register/cif-register.component';

export const routesSmartForm: Routes = [
    { path: '', component: SmartFormComponent,
        children:[
          {path:'fileProcessed',component:ManagerFileProcessedComponent,canDeactivate:[CanDeactivateGuard]},
          {path: 'registerService', component:CifRegisterComponent},
          {path: 'updateCif', component:RegisterCifComponent},
          {path: 'manager',
              loadChildren:() => import('../manager-menu-tree/manager-menu-tree-routing').then(m => m.ManagerMenuTreeRoutingModule)
          },
          {
              path:'admin',
              loadChildren:() => import('../manager-admin/manager-admin.module').then(m => m.ManagerAdminModule),
              canDeactivate:[CanDeactivateGuard]
          },
          {
            path: 'process/list', component: ListProcessComponent,canDeactivate:[CanDeactivateGuard]
          }
          // {path:'processRequest', component:ProcessTheRequestComponent},
          // {path:'detailCustomer',component: DetailCustomerComponent},
          // {path:'lstAccount',component: LstAccountComponent},
          // {path:'createAccount',component: CreateAccountComponent},
          // {path:'detailAccount',component:DetailAccountComponent}
        ]
    },

];

