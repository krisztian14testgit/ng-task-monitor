import { Component, OnInit } from '@angular/core';

import { TaskService } from '../task/services/task.service';
import { Task } from '../task/services/task.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.css']
})
export class StatisticComponent implements OnInit {
  /** Contains the task instances from the task Service. */
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
  private readonly dailyReportCharts: string[];
  /** Contains the weekly report selection items. */
  private readonly weeklyReportCharts: string[];

  constructor(private readonly taskService: TaskService,
              private readonly router: Router) {
    this.dailyReportCharts = ['Task status counts'];
    this.weeklyReportCharts = ['Task Status counts', 'Completed tasks in week', 'Spent time on tasks'];
  }

  /** Gets all tasks from the service. */
  ngOnInit(): void {
    this.setReportTypeFromUrl();
    this.getAllTasks();
  }

  private getAllTasks(): void {
    this.taskService.getAll()
    .subscribe((tasks: Task[]) => this.taskList = tasks);
  }

  /**
   * Adjusts the isDailyReport switcher by the url path.
   */
  private setReportTypeFromUrl(): void {
    const reportType = 'daily';
    this.isDailyReport = this.router.url.includes(reportType);
    this.loadedReportCharts = this.isDailyReport ? this.dailyReportCharts : this.weeklyReportCharts;
  }

}
