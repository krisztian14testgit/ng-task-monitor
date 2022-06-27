import { WeekDay } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import { ChartType, ChartConfiguration, ChartData } from 'chart.js';
import { TaskDate } from '../../task/services/task-timer.model';

import { Task, TaskStatus } from '../../task/services/task.model';
import { ChartLineReport } from '../services/chart-date.model';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnChanges {
  @Input() taskList: Task[] = [];
  @Input() lineType: ChartLineReport = ChartLineReport.CompletedTask;

  public lineChartType: ChartType;
  public lineChartOptions: ChartConfiguration['options'];
  public lineChartData: ChartData<'line', number[], string | string[]>;
  public lineChartPlugins = [];

  private lineChartLabels: string[];

  constructor() {
    this.lineChartType = 'line';
    this.lineChartOptions = {
      elements: {
        line: {
          tension: 0.5
        }
      },
    };
    this.lineChartData = {
      labels: ['mon', 'tue', 'wed'],
      datasets: [{
        label: 'Completed task numbers in This week',
        data: [4, 6, 10],
        fill: false,
      }]
    };
    this.lineChartLabels = [
      'Completed task numbers in This week',
      'Spent timer on the task in This week'
    ];
  }
  

  /**
   * 1. doing spentTime showing
   * 2. weekly comp: show 3 types reports
      * extre field for task => stored initial value of timer
     3. chart resizing, reponisve
   */
  ngOnChanges(): void {
    if (this.taskList && this.taskList.length > 0) {
      this.setLineChartDataBy(this.taskList);
    }
  }

  private setLineChartDataBy(taskList: Task[]): void {
    this.sortTaskByDays(taskList);
    // set labels
    this.lineChartData.labels = this.getChartLabelDays(taskList);
    // set datasets (label-title, data)
    this.lineChartData.datasets[0].label = this.lineChartLabels[this.lineType];
    this.lineChartData.datasets[0].data = this.getCompletedTaskCounts(taskList);
  }

  /**
   * Insreasing orders of the task items by the days
   * The reference is the same???
   * @param taskList 
   */
  private sortTaskByDays(taskList: Task[]): void {
    taskList.sort((task1: Task, task2: Task) => {
      const date1 = new Date(task1.createdDate);
      const date2 = new Date(task2.createdDate);
      return date1.getTime() - date2.getTime();
    });
  }

  private getChartLabelDays(taskList: Task[]): string[] {
    // not stores the repeted elements
    const retDays = new Set<string>();
    let taskCreatedDate: Date;
    let dayIndex: number;

    for (const task of taskList) {
      taskCreatedDate = new Date(task.createdDate);
      dayIndex = taskCreatedDate.getDay();
      const [monthUTC, dayUTC] = TaskDate.getLocalTime_monthsAndDays(taskCreatedDate);
      // e.g: Monday(06.20)
      retDays.add(WeekDay[dayIndex] + `(${monthUTC}.${dayUTC})`);
    }

    return Array.from(retDays);
  }

  private getCompletedTaskCounts(taskList: Task[]): number[] {
    const completedCounts_dict: {[isoDate: string]: number} = {};
    let isoDate: string;

    for (const task of taskList) {
      isoDate = TaskDate.getYearMonthDaysISO(task.createdDate);
      if (!completedCounts_dict[isoDate]) {
        completedCounts_dict[isoDate] = 0;
      }

      if (task.isCompleted()) {
        completedCounts_dict[isoDate]++;
      }
    }

    // returns only the values of the dict.
    return Object.values(completedCounts_dict);
  }
}
