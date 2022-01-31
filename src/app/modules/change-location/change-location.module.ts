import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChangeLocationRoutingModule } from './change-location-routing.module';
import { ChangeLocationComponent } from './change-location.component';


@NgModule({
  declarations: [
    ChangeLocationComponent
  ],
  imports: [
    CommonModule,
    ChangeLocationRoutingModule
  ]
})
export class ChangeLocationModule { }
