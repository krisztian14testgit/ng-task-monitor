import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle'

import { StatisticRoutingModule } from './statistic-routing.module';
import { NgChartsModule } from 'ng2-charts';

import { StatisticComponent } from './statistic.component';
import { TaskCountComponent } from './task-count/task-count.component';
import { TaskService } from '../task/services/task.service';

@NgModule({
  declarations: [
    StatisticComponent,
    TaskCountComponent
  ],
  imports: [
    CommonModule,
    StatisticRoutingModule,
    FormsModule,
    NgChartsModule,
    /** Angular material */
    MatCardModule,
    MatSlideToggleModule
  ],
  providers: [
    TaskService
  ]
})
export class StatisticModule { }
