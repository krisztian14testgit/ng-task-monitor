import { WeekDay } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ChartType, ChartConfiguration, ChartData } from 'chart.js';

import { Task, TaskStatus } from '../../task/services/task.model';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit {
  @Input() taskList: Task[] = [];

  public lineChartType: ChartType;
  public lineChartOptions: ChartConfiguration['options'];
  public lineChartData: ChartData<'line', number[], string | string[]>;
  public lineChartPlugins = [];

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
  }

  ngOnInit(): void {
  }

  private setLineChartDataBy(taskList: Task[]): void {
    //labels
    //datasets
      // - lables
      // - data
  }

  /**
   * Insreasing orders of the task items by the days
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
    let dayUTCNum: number;
    let month: number;

    for (const task of taskList) {
      taskCreatedDate = new Date(task.createdDate);
      dayIndex = taskCreatedDate.getDay();
      dayUTCNum = taskCreatedDate.getUTCDate();
      month = taskCreatedDate.getMonth();
      // e.g: Monday(06.20)
      retDays.add(WeekDay[dayIndex] + `(${month}.${dayUTCNum})`);
    }

    return Array.from(retDays);
  }

  private getCompletedTaskCounts(taskList: Task[]): number[] {
    const completedCounts_dict: {[isoDate: string]: number} = {};
    let isoDate: string;

    for (const task of taskList) {
      isoDate = this.getYearMonthDaysISO(task.createdDate);
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

  /** 
   * Returns the ISO date from the createdDate of task.
   * ISO Format: year-months-days.
   * E.g.: "2022-06-24"
   * @param date Instance of the Date
   * @return ISO string
   */
  private getYearMonthDaysISO(taskCreatedDate: string): string {
    const date = new Date(taskCreatedDate);
    const isoDate = date.toISOString();
    const indexOfT = isoDate.indexOf('T');
    return isoDate.substring(0, indexOfT);
  }
}
