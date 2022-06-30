import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';

import { StatisticRoutingModule } from './statistic-routing.module';
import { NgChartsModule } from 'ng2-charts';

import { StatisticComponent } from './statistic.component';
import { TaskCountChartComponent } from './task-count-chart/task-count-chart.component';
import { TaskService } from '../task/services/task.service';
import { LineChartComponent } from './line-chart/line-chart.component';

@NgModule({
  declarations: [
    StatisticComponent,
    TaskCountChartComponent,
    LineChartComponent
  ],
  imports: [
    CommonModule,
    StatisticRoutingModule,
    FormsModule,
    NgChartsModule,
    /** Angular material */
    MatCardModule,
    MatSelectModule,
  ],
  providers: [
    TaskService
  ]
})
export class StatisticModule { }
