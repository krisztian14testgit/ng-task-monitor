import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

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
    NgChartsModule
  ],
  providers: [
    TaskService
  ]
})
export class StatisticModule { }
