import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule,NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {RouterModule } from '@angular/router';
import { routesSmartForm } from './smart-form-routing.module';
import { SmartFormComponent } from './smart-form.components';
import { CommonModule } from '@angular/common';
import { PopupManagerFileComponent } from './popup/popup-manager-file.component';
import { GecoDialogModule } from 'angular-dynamic-dialog';
import { RegisterCifComponent } from './resgisterCif/register-cif.component';
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
import { ProcessTheRequestComponent } from './processtheRequest/process-the-request.component';
import { LstAccountComponent } from './lst-account/lst-account.component';
import { DatePipe } from '@angular/common';
import {ModalComponent} from './modal/modal.component';
import {ManagerFileProcessedComponent} from './managerFileProcessed/manager-file-processed.component';
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatRadioModule} from "@angular/material/radio";
import {SharedModule} from "../shared.module";
import {NgSelectModule} from "@ng-select/ng-select";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {ProgressSpinnerModule} from "../progress-spinner/progress-spinner.module";
import { ListProcessComponent } from './list-process/list-process.component';
import { CanDeactivateGuard } from '../_helpers/canDeactiveGuard';
import {DatePickerComponent} from '../_datepicker/date-picker.component';
import { MisCifComponent } from './mis-cif/mis-cif.component';
import { UdfCifComponent } from './udf-cif/udf-cif.component';

@NgModule({
  declarations: [
    SmartFormComponent,
    PopupManagerFileComponent,
    RegisterCifComponent,
    ProcessTheRequestComponent,
    // DetailCustomerComponent,
    LstAccountComponent,
    ModalComponent,
    ManagerFileProcessedComponent,
    ListProcessComponent,
    DatePickerComponent,
    MisCifComponent,
    UdfCifComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routesSmartForm),
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
    MatCheckboxModule,
    MatRadioModule,
    SharedModule,
    NgSelectModule,
    MatProgressSpinnerModule,
    ProgressSpinnerModule,
  ],
  entryComponents:[
    PopupManagerFileComponent,
    MisCifComponent,
    UdfCifComponent
  ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
    CanDeactivateGuard,
    DatePipe
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class ManagerSmartFormModule { }
