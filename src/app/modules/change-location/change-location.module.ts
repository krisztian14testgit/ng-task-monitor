import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';

import { ChangeLocationRoutingModule } from './change-location-routing.module';
import { ChangeLocationComponent } from './change-location.component';
import { LocationService } from './services/location/location-service';


@NgModule({
  declarations: [
    ChangeLocationComponent
  ],
  imports: [
    CommonModule,
    ChangeLocationRoutingModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule
  ],
  providers: [
    LocationService
  ]
})
export class ChangeLocationModule { }
