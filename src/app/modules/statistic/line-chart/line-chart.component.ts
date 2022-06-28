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
  private lineChartDataCallBack: ((taskList: Task[]) => number[])[];

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
      labels: [],
      datasets: [{
        label: 'Empty label of the chart',
        data: [],
        fill: false,
      }]
    };
    this.lineChartLabels = [
      'Completed task numbers in This week',
      'Spent times on the completed tasks in This week'
    ];
    this.lineChartDataCallBack = [
      this.getCompletedTaskCounts,
      this.getSpentTimesOfWorkingOnTasks
    ];
  }
  

  /**
     3. chart resizing, reponisve
     4. renaming: app-task-count to app-task-count-chart
   */
  ngOnChanges(): void {
    if (this.taskList && this.taskList.length > 0) {
      this.setLineChartDataBy(this.taskList);
    }
  }

  private setLineChartDataBy(taskList: Task[]): void {
    this.sortTaskByDays(taskList);
    /* Reset the lineChart data stuct, because of the pointer of lineChartDate
     * to refreshing the line-chart's data, displaying. */
    this.lineChartData = {...this.lineChartData};
    // Set labels
    this.lineChartData.labels = this.getChartLabelDays(taskList);
    // Set datasets (label-title, data)
    this.lineChartData.datasets[0].label = this.lineChartLabels[this.lineType -1];
    this.lineChartData.datasets[0].data = this.lineChartDataCallBack[this.lineType - 1](taskList);
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
      // Adjust the initial value: 0 if the key does not exist yet in dict.
      if (!completedCounts_dict[isoDate]) {
        completedCounts_dict[isoDate] = 0;
      }

      if (task.isCompleted()) {
        // Counting the completed Tasks
        completedCounts_dict[isoDate]++;
      }
    }

    // returns only the values of the dict.
    return Object.values(completedCounts_dict);
  }

  private getSpentTimesOfWorkingOnTasks(taskList: Task[]): number[] {
    const spentTimeSum_dict: {[isoDate: string]: number} = {};
    let isoDate: string;

    
    for (const task of taskList) {
      isoDate = TaskDate.getYearMonthDaysISO(task.createdDate);
      // Adjust the initial value: 0 if the key does not exist yet in dict.
      if (!spentTimeSum_dict[isoDate]) {
        spentTimeSum_dict[isoDate] = 0;
      }

      if (task.isCompleted()) {
        // Sum the time values.
        spentTimeSum_dict[isoDate] += task.initialTime;
      }
    }

    // returns only the values of the dict.
    return Object.values(spentTimeSum_dict);
  }
}
