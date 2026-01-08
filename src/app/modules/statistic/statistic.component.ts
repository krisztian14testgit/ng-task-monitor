import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { TaskService } from '../task/services/task.service';
import { Task } from '../task/services/task.model';

@Component({
    selector: 'app-statistic',
    templateUrl: './statistic.component.html',
    styleUrls: ['./statistic.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class StatisticComponent implements OnInit, OnDestroy {
  /** Contains the task instance from the task Service. */
  public taskList: Task[] = [];
  /**
   * This a switcher of the report. 
   * If it is true showing daily report, otherwise weekly report.
   */
  public isDailyReport!: boolean;
  /** 
   * Contains items for the selection tag. Items come from the dailyReportCharts or weeklyReportCharts arrays 
   * depens on the isDailyReport switcher.
   * 
   * If isDailyReport is true the loadedReportCharts will contain the dailyReportCharts elements
   * otherwise it is false, then weeklyReportCharts elements will be loaded.
   */
  public loadedReportCharts!: string[];
  // showing count of the completed Tasks in daily, and weekly
  public selectedChartType = 0;
  /** Contains the daily report selection items. */
  private readonly _dailyReportCharts: string[];
  /** Contains the weekly report selection items. */
  private readonly _weeklyReportCharts: string[];
  /** The subcription of the task service. */
  private _taskService$!: Subscription;

  constructor(private readonly taskService: TaskService,
              private readonly router: Router,
              private readonly changeDetectorRef: ChangeDetectorRef) {
    this._dailyReportCharts = ['Task status counts'];
    this._weeklyReportCharts = ['Task Status counts', 'Completed tasks in week', 'Spent time on tasks'];
  }

  /** Gets all tasks from the service. */
  ngOnInit(): void {
    this.setReportTypeFromUrl();
    this.getAllTasks();
  }

  /** Unsubscription from the task data streams */
  ngOnDestroy(): void {
    this._taskService$.unsubscribe();
  }

  private getAllTasks(): void {
    this._taskService$ = this.taskService.getAll()
      .subscribe((tasks: Task[]) => {
        this.taskList = tasks;
        // triggers change detection manually to re-render view
        this.changeDetectorRef.markForCheck();
      });
  }

  /**
   * Adjusts the isDailyReport switcher by the url path.
   */
  private setReportTypeFromUrl(): void {
    const reportType = 'daily';
    this.isDailyReport = this.router.url.includes(reportType);
    this.loadedReportCharts = this.isDailyReport ? this._dailyReportCharts : this._weeklyReportCharts;
  }

}
