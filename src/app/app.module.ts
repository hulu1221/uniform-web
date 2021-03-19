import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA, LOCALE_ID } from '@angular/core';
import '@angular/common/locales/global/vi';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './angular-material.module';
import { HTTP_INTERCEPTORS,HttpClientModule } from '@angular/common/http';
import { JwtInterceptor } from './_helpers/jwt.interceptor';
import { ErrorInterceptor } from './_helpers/error.interceptor';
// import { fakeBackendProvider } from './_helpers/fake-backend';
import { GecoDialogModule } from 'angular-dynamic-dialog';
import {DatePipe, DecimalPipe} from '@angular/common';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { ToastrModule } from 'ngx-toastr';
import { NgOtpInputModule } from 'ng-otp-input';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import {SharedModule} from "./shared.module";
import {NgSelectModule} from "@ng-select/ng-select";
import { ProgressSpinnerModule } from './progress-spinner/progress-spinner.module';
// import { PaginatorDirective } from './_directive/paginator.directive';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    // PaginatorDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    HttpClientModule,
    ReactiveFormsModule,
    GecoDialogModule,
    FormsModule,
    ToastrModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    NgOtpInputModule,
    SharedModule,
    NgSelectModule,
    ProgressSpinnerModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
    { provide: LOCALE_ID, useValue: 'vi' }, DecimalPipe,
    // provider used to create fake backend
    // fakeBackendProvider,
    DatePipe],
  bootstrap: [AppComponent],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
