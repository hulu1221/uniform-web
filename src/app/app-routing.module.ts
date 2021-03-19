import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './_helpers/auth.guard';
import { Permission, Role } from './_models/role';

const routes: Routes = [
  { path: '',redirectTo:'login',pathMatch:'full',},
  // {
  //   path:'smart-form',
  //   canActivate:[AuthGuard],
  //   component:MenubarComponent
  // },
  { path: 'smart-form',
    // canActivate: [AuthGuard],
    loadChildren:() => import('./manager-smart-form/manager-smart-form-routing.module').then(m => m.ManagerSmartFormRoutingModule)
  },
  // { path: 'admin',
  //   canActivate: [AuthGuard],
  //   // data: { roles: [Permission.SYSTEM_MANAGEMENT] },
  //   loadChildren:() => import('./manager-admin/manager-admin.module').then(m => m.ManagerAdminModule)
  // },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ onSameUrlNavigation: 'reload', relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
