import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

import { TaskService } from '../task/services/task.service';
import { Task } from '../task/services/task.model';
import { TaskCountChartComponent } from './task-count-chart/task-count-chart.component';
import { LineChartComponent } from './line-chart/line-chart.component';

@Component({
    selector: 'app-statistic',
    templateUrl: './statistic.component.html',
    styleUrls: ['./statistic.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [FormsModule, MatCardModule, MatSelectModule, MatFormFieldModule, TaskCountChartComponent, LineChartComponent]
})
export class StatisticComponent implements OnInit {
  /**
   * This a switcher of the report. 
   * If it is true showing daily report, otherwise weekly report.
   */
  public isDailyReport = signal(true);
  /** 
   * Contains items for the selection tag. Items come from the dailyReportCharts or weeklyReportCharts arrays 
   * depens on the isDailyReport switcher.
   * 
   * If isDailyReport is true the loadedReportCharts will contain the dailyReportCharts elements
   * otherwise it is false, then weeklyReportCharts elements will be loaded.
   */
  public loadedReportCharts!: string[];
  // showing count of the completed Tasks in daily, and weekly
  public selectedChartType = signal(0);
  /** Contains the daily report selection items. */
  private readonly _dailyReportCharts: string[];
  /** Contains the weekly report selection items. */
  private readonly _weeklyReportCharts: string[];

  private readonly taskService = inject(TaskService);
  private readonly router = inject(Router);

  /** Contains the task instance from the task Service as a signal. */
  public readonly taskList = toSignal(this.taskService.getAll(), { initialValue: [] as Task[] });

  constructor() {
    this._dailyReportCharts = ['Task status counts'];
    this._weeklyReportCharts = ['Task Status counts', 'Completed tasks in week', 'Spent time on tasks'];
  }

  ngOnInit(): void {
    this.setReportTypeFromUrl();
  }

  /**
   * Adjusts the isDailyReport switcher by the url path.
   */
  private setReportTypeFromUrl(): void {
    const reportType = 'daily';
    const isDaily = this.router.url.includes(reportType);
    this.isDailyReport.set(isDaily);
    this.loadedReportCharts = isDaily ? this._dailyReportCharts : this._weeklyReportCharts;
  }

}
