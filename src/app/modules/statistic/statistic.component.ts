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
  /** Contains the actual title of the diagramm. */
  public currentChartTitle!: string;
  public loadedReportCharts!: string[];
  public selectedChartType = '';
  private dailyReportCharts: string[];
  private weeklyReportCharts: string[];


  constructor(private readonly taskService: TaskService,
              private readonly router: Router) {
    this.currentChartTitle = 'Number of Task status';
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
