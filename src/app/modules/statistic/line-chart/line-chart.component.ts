import { WeekDay } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import { ChartType, ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import { IBaseChart } from '../../../interfaces/base-chart.interface';
import { TaskDate } from '../../task/services/task-timer/task-timer.model';
import { Task } from '../../task/services/task.model';
import { LineChartReport } from '../services/chart.model';

/**
 * This line-chart component can show two type of charts:
 * * 1. Counted completed Tasks by creation date.
 * * 2. Amount of spent times on the completed tasks by creation date.
 */
@Component({
    selector: 'app-line-chart',
    templateUrl: './line-chart.component.html',
    styleUrls: ['./line-chart.component.css'],
    standalone: true,
    imports: [BaseChartDirective]
})
export class LineChartComponent implements OnChanges, IBaseChart {
  /** The tasks elements. */
  @Input() taskList: Task[] = [];
  /** 
   * The line-chart type has two types: 
   * * CompletedTask: Showing the count of the completed tasks.
   * * SpentTime: Showing the spent times on the completed tasks.
   */
  @Input() lineType: LineChartReport = LineChartReport.CompletedTask;

  /** The chartjs types: line, pie, bar, ... */
  public readonly currentChartType: ChartType;
  /** The chartjs options settings. */
  public readonly currentChartOptions: ChartConfiguration['options'];
  /** The chartjs Data structure. */
  public currentChartData: ChartData<'line', number[], string | string[]>;
  /** The chartjs plugins setting. */
  public readonly currentChartPlugins = [];

  /** Stores the line-chart titles which will be shown on the chart. */
  public readonly _chartLabels: string[];
  /** Stores the callback funtion references which calculate the completed Task or spent time data. */
  public readonly _chartDataCallBack: ((taskList: Task[]) => number[])[];

  constructor() {
    this.currentChartType = 'line';
    this.currentChartOptions = {
      elements: {
        line: {
          tension: 0.5
        }
      },
    };
    this.currentChartData = {
      labels: [],
      datasets: [{
        label: 'Empty label of the chart',
        data: [],
        fill: false,
      }]
    };
    this._chartLabels = [
      'Completed task numbers in This week',
      'Amount of spent times on the completed tasks in This week'
    ];
    this._chartDataCallBack = [
      this.getCompletedTaskCounts,
      this.getSpentTimesOfWorkingOnTasks
    ];
  }
  
  /**
   * It triggers when the taskList input field is changed.
   * 
   * Setting the labels and datasets of the line-chart.
   */
  ngOnChanges(): void {
    if (this.taskList && this.taskList.length > 0) {
      this._setCurrentChartDataBy(this.taskList);
    }
  }

  /**
   * Sets the line-chart data which display on the chart.
   * Settings the label and datasets of the line chart.
   * @param taskList The elements of the taskList.
   */
  public _setCurrentChartDataBy(taskList: Task[]): void {
    taskList = this.sortTaskByDays(taskList);
    /* Reset the line-Chart data struct, because of the pointer of lineChartDate
     * to refreshing the line-chart's data by new reference. */
    this.currentChartData = {...this.currentChartData};
    // Set labels
    this.currentChartData.labels = this.getChartLabelDays(taskList);
    // Set datasets (label-title, data)
    this.currentChartData.datasets[0].label = this._chartLabels[this.lineType];
    this.currentChartData.datasets[0].data = this._chartDataCallBack[this.lineType](taskList);
  }

  /**
   * Returns new sorted task array where tasks are increased by date.
   * @param taskList The elements of the taskList.
   * @return Task[] array
   */
  private sortTaskByDays(taskList: Task[]): Task[] {
    const orderedTasks = [...taskList];
    orderedTasks.sort((task1: Task, task2: Task) => {
      const date1 = new Date(task1.createdDate);
      const date2 = new Date(task2.createdDate);
      return date1.getTime() - date2.getTime();
    });

    return orderedTasks;
  }

  /**
   * Returns the collected day names from the tasks when they were created by date.
   * The collected day names will be shown on the x-axis of the line-chart.
   * 
   * @description
   * Showing day names like: Monday(06.20), Tuesday(06.21), when the tasks were created.
   * 
   * @param taskList The elements of the taskList.
   * @returns string array
   */
  private getChartLabelDays(taskList: Task[]): string[] {
    // Set: each values are stored only once
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

  /**
   * Returns the number of completed tasks by the creation date.
   * The counted values will be into array, as creation date of task can be differnt.
   * If the creation date are equivalent then returns the one number in the array.
   * 
   * @description
   * The return array index lenght are same like the line-chart labels length. Their index position are equal.
   * 
   * @param taskList The elements of the taskList.
   * @returns number array
   */
  private getCompletedTaskCounts(taskList: Task[]): number[] {
    const completedCounts_dict: {[isoDate: string]: number} = {};
    let isoDate: string;

    for (const task of taskList) {
      isoDate = TaskDate.getYearMonthDaysISO(task.createdDate);
      // Adjusts the initial value: 0 if the key does not exist yet in dict.
      if (!completedCounts_dict[isoDate]) {
        completedCounts_dict[isoDate] = 0;
      }

      if (task.isCompleted()) {
        // Counting the completed Tasks
        completedCounts_dict[isoDate]++;
      }
    }

    // returns only the values of the dict into number array
    return Object.values(completedCounts_dict);
  }

  /**
   * Returns spent times summation of the completed tasks by the creation date.
   * The summary data will be into array, as creation date of thask can be differnt.
   * If the creation date are same returns the one element in the array.
   * 
   * @description
   * The return array index lenght are same like the line-chart labels length. Their index position are equal.
   * 
   * @param taskList The elements of the taskList.
   * @returns number array
   */
  private getSpentTimesOfWorkingOnTasks(taskList: Task[]): number[] {
    const spentTimeSum_dict: {[isoDate: string]: number} = {};
    let isoDate: string;

    
    for (const task of taskList) {
      isoDate = TaskDate.getYearMonthDaysISO(task.createdDate);
      // Adjusts the initial value: 0 if the key does not exist yet in dict.
      if (!spentTimeSum_dict[isoDate]) {
        spentTimeSum_dict[isoDate] = 0;
      }

      if (task.isCompleted()) {
        // Sum the time values.
        spentTimeSum_dict[isoDate] += task.initialTime;
      }
    }

    // returns only the values of the dict into number array
    return Object.values(spentTimeSum_dict);
  }
}
