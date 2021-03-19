import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
const smartFormMaterial = [
    BrowserModule,
    BrowserAnimationsModule,
    MatDatepickerModule, 
    MatInputModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule
]
@NgModule({
   imports: [
      CommonModule,
      ...smartFormMaterial
   ],
    exports:[
        ...smartFormMaterial
    ]
})
export class SmartFormMaterialModule { }