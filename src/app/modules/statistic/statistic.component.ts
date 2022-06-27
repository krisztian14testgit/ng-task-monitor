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
  constructor(private readonly taskService: TaskService,
              private readonly router: Router) {
    this.currentChartTitle = 'Number of Task status';
  }

  /** Gets all tasks from the service. */
  ngOnInit(): void {
    this.getReportTypeFromUrl();
    this.getAllTasks();
  }

  private getAllTasks(): void {
    this.taskService.getAll()
    .subscribe((tasks: Task[]) => this.taskList = tasks);
  }

  /**
   * Adjusts the isDailyReport switcher by the url path.
   */
  private getReportTypeFromUrl(): void {
    const reportType = 'daily';
    this.isDailyReport = this.router.url.includes(reportType);
  }

}
