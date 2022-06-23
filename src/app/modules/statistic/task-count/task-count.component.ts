import { Component, Input, OnChanges } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

import { Task, TaskStatus } from '../../task/services/task.model';

enum ChartBackGroundColor {
  Start = 'rgb(125, 125, 200)',
  InProgress = 'rgb(255, 100, 0)',
  Completed = 'rgb(0, 155, 0)'
}

@Component({
  selector: 'app-task-count',
  templateUrl: './task-count.component.html',
  styleUrls: ['./task-count.component.css']
})
export class TaskCountComponent implements OnChanges {
  @Input() taskList: Task[] = [];
  @Input() isShowedTodayDate = false;

  public filteredTaskList: Task[] = [];

  public pieChartType: ChartType;
  public pieChartOptions: ChartConfiguration['options'];
  public pieChartData: ChartData<'pie', number[], string | string[]>;
  public pieChartPlugins = [];

  constructor() {
    this.pieChartType = 'pie';
    this.pieChartOptions = {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: 'top',
        }
      }
    };
    this.pieChartData = {
      labels: [],
      datasets: [ {
        label: 'Counts of Task status',
        data: [],
        backgroundColor: [
          ChartBackGroundColor.Start,
          ChartBackGroundColor.InProgress,
          ChartBackGroundColor.Completed
        ],
        hoverBackgroundColor: [
          ChartBackGroundColor.Start,
          ChartBackGroundColor.InProgress,
          ChartBackGroundColor.Completed
        ]
      } ]
    };
  }

  ngOnChanges(): void {
    if (this.isShowedTodayDate && this.taskList.length > 0) {
      this.filteredTaskList = this.filterByCreatedToday(this.taskList);
    } else if (this.taskList.length > 0) {
      this.filteredTaskList = this.taskList;
    }
    console.log('isShowed changed', this.isShowedTodayDate);
    this.setPieChartDataBy(this.filteredTaskList);
  }

  private filterByCreatedToday(taskList: Task[]): Task[] {
    return taskList.filter(task => task.isCreatedToday());
  }

  private setPieChartDataBy(taskList: Task[]): void {
    // datasets reset
    const taskStatusCounts = this.getCountOfTaskStatuses(taskList);
    this.pieChartData.datasets[0].data = taskStatusCounts;
    this.pieChartData.labels = this.getChartLabelsByTaskStatus(taskStatusCounts);
  }

  private getChartLabelsByTaskStatus(displayStatusCounts: number[]): string[] {
    const notBeIndexNumber = 1;
    const retLables = Object.keys(TaskStatus).filter(key => key.length > notBeIndexNumber);
    for (let i = 0; i < retLables.length; i++) {
      retLables[i] += `(${displayStatusCounts[i]})`;
    }

    return retLables;
  }

  private getCountOfTaskStatuses(taskList: Task[]): number[] {
    // 0. pos => Start, 1. pos => inprogress, 2. pos => completed
    const taskStatusCounters = [0, 0, 0];
    for (const task of taskList) {
      taskStatusCounters[task.status] += 1;
    }

    return taskStatusCounters;
  }
}
