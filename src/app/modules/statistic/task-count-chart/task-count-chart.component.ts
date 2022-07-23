import { Component, Input, OnChanges } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

import { Task, TaskStatus } from '../../task/services/task.model';
import { ChartBackGroundColor } from '../services/chart.model';

/**
 * This pie-chart component can show daily and weekly reports
 * of the counted tasks number by the task statuses.
 */
@Component({
  selector: 'app-task-count-chart',
  templateUrl: './task-count-chart.component.html',
  styleUrls: ['./task-count-chart.component.css']
})
export class TaskCountChartComponent implements OnChanges {
  /** The tasks elements. */
  @Input() taskList: Task[] = [];
  /** 
   * The boolen switcher of today. 
   * * If it is true, shows daily tasks.
   * * If it is false, shows weekly tasks.
   */
  @Input() isShowedTodayDate = false;

  /** Contains the filtered task elements by the creation date(today or weekly). */
  public filteredTaskList: Task[] = [];

  /** The chartjs types: line, pie, bar, ... */
  public readonly pieChartType: ChartType;
  /** The chartjs options settings. */
  public readonly pieChartOptions: ChartConfiguration['options'];
  /** The chartjs Data structure. */
  public readonly pieChartData: ChartData<'pie', number[], string | string[]>;
  /** The chartjs plugins setting. */
  public readonly pieChartPlugins = [];

  /** Stores the pie-chart titles which will be shown on the chart. */
  private readonly _pieChartLabels: string[];
  /** 
   * The default value is 0. 
   * If this.isShowedTodayDate is true then it will be 0 as well,
   * otherwise it will be 1, showing inWeekly report.
   */
  private _indexOfChartLabel = 0;

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
        label: 'Empty label of the chart',
        data: [],
        backgroundColor: [
          ChartBackGroundColor.Purple,
          ChartBackGroundColor.Orange,
          ChartBackGroundColor.DarkGreen
        ],
        hoverBackgroundColor: [
          ChartBackGroundColor.Purple,
          ChartBackGroundColor.Orange,
          ChartBackGroundColor.DarkGreen
        ]
      } ]
    };
    this._pieChartLabels = [
      'Counts of Task statuses today',
      'Counts of task statuses in weekly'
    ];
  }

  /**
   * It triggers when taskList or isShowedTodayDate are changed.
   * 
   * Filtering task list by creation date if this.isShowedTodayDate is true.
   * Setting the labels and datasets of the pie-chart.
   */
  ngOnChanges(): void {
    if (this.isShowedTodayDate && this.taskList.length > 0) {
      this.filteredTaskList = this.filterByCreatedToday(this.taskList);
      this._indexOfChartLabel = 0;
    } else if (this.taskList.length > 0) {
      this.filteredTaskList = this.taskList;
      this._indexOfChartLabel = 1;
    }

    this.setPieChartDataBy(this.filteredTaskList);
  }

  /**
   * Returns the filtered tasks by the creation date which are created today date.
   * @param taskList The elements of the taskList.
   * @returns task array.
   */
  private filterByCreatedToday(taskList: Task[]): Task[] {
    return taskList.filter(task => task.isCreatedToday());
  }

  /**
   * Sets the pie-chart data which display on the chart.
   * Settings the label and datasets of the pie-chart.
   * @param taskList The elements of the taskList.
   */
  private setPieChartDataBy(taskList: Task[]): void {
    // reset datasets
    const taskStatusCounts = this.getCountOfTaskStatuses(taskList);
    // set datasets (label, data)
    this.pieChartData.datasets[0].label = this._pieChartLabels[this._indexOfChartLabel];
    this.pieChartData.datasets[0].data = taskStatusCounts;
    // set chart labels
    this.pieChartData.labels = this.getChartLabelsByTaskStatus(taskStatusCounts);
  }

  /**
   * Returns the collected status names of the given tasks.
   * The collected statuses will be shown on the x-axis of the pie-chart.
   * 
   * @description
   * The statuses with counted number like: Start(2), InProgress(1), Completed(3).
   * 
   * @param displayStatusCounts The count of the statuses which are printed at end of the statuses. 
   * @returns task statuses in string array.
   */
  private getChartLabelsByTaskStatus(displayStatusCounts: number[]): string[] {
    const notBeIndexNumber = 1;
    const retLables = Object.keys(TaskStatus).filter(key => key.length > notBeIndexNumber);
    for (let i = 0; i < retLables.length; i++) {
      retLables[i] += `(${displayStatusCounts[i]})`;
    }

    return retLables;
  }

  /**
   * Returns the amount numbers of tasks by statuses.
   * The counted values will be into array in different task statuses: Start, Inprogress, Completed.
   * If task statuses are equivalent(there is only one) returns the one number in the array.
   * 
   * @description
   * The return array index lenght are same like the pie-chart labels length. Their index position are equal.
   * 
   * @param taskList The elements of the taskList.
   * @returns counted numbers in array.
   */
  private getCountOfTaskStatuses(taskList: Task[]): number[] {
    // 0. pos => Start, 1. pos => inprogress, 2. pos => completed
    const taskStatusCounters = [0, 0, 0];
    for (const task of taskList) {
      taskStatusCounters[task.status] += 1;
    }

    return taskStatusCounters;
  }
}
