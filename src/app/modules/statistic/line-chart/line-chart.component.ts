import { WeekDay } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import { ChartType, ChartConfiguration, ChartData } from 'chart.js';

import { TaskDate } from '../../task/services/task-timer.model';
import { Task } from '../../task/services/task.model';
import { ChartLineReport } from '../services/chart.model';

/**
 * This line-chart component can show two type of charts:
 * * 1. Counted completed Tasks by creation date.
 * * 2. Amont of spent times on the completed tasks by creationd date.
 */
@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnChanges {
  /** The tasks elements. */
  @Input() taskList: Task[] = [];
  /** 
   * The line-chart type which showing on the chart. 
   * * CompletedTask: Showing the count of the completed tasks.
   * * SpentTime: Showing the spent times on the completed tasks.
   */
  @Input() lineType: ChartLineReport = ChartLineReport.CompletedTask;

  /** The chartjs types: line, pie, bar, ... */
  public lineChartType: ChartType;
  /** The chartjs options settings. */
  public lineChartOptions: ChartConfiguration['options'];
  /** The chartjs Data structure. */
  public lineChartData: ChartData<'line', number[], string | string[]>;
  /** The chartjs plugins setting. */
  public lineChartPlugins = [];

  /** Stores the line-chart titles which showing on the chart. */
  private lineChartLabels: string[];
  /** Stores the callback funtion references which calculate the completed Task or spent time data. */
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
      'Amount of pent times on the completed tasks in This week'
    ];
    this.lineChartDataCallBack = [
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
      this.setLineChartDataBy(this.taskList);
    }
  }

  /**
   * Sets the line-chart data which display on the chart.
   * Settings the label and datasets of the line chart.
   * @param taskList The elements of the taskList.
   */
  private setLineChartDataBy(taskList: Task[]): void {
    this.sortTaskByDays(taskList);
    /* Reset the lineChart data stuct, because of the pointer of lineChartDate
     * to refreshing the line-chart's data, displaying. */
    this.lineChartData = {...this.lineChartData};
    // Set labels
    this.lineChartData.labels = this.getChartLabelDays(taskList);
    // Set datasets (label-title, data)
    this.lineChartData.datasets[0].label = this.lineChartLabels[this.lineType];
    this.lineChartData.datasets[0].data = this.lineChartDataCallBack[this.lineType](taskList);
  }

  /**
   * Insreasing orders of the task items by the day date.
   * The ordering is changed in the given elements of the list, because of the reference.
   * @param taskList The elements of the taskList.
   */
  private sortTaskByDays(taskList: Task[]): void {
    taskList.sort((task1: Task, task2: Task) => {
      const date1 = new Date(task1.createdDate);
      const date2 = new Date(task2.createdDate);
      return date1.getTime() - date2.getTime();
    });
  }

  /**
   * Returns the collected day names from the tasks when they were created by date.
   * The collected day names will be label(x-axis) of the line-chart.
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
   * Return the number of completed tasks by the creation date.
   * The counted values will be into array, as creation date of thask can be differnt.
   * If the creation date are same then returns the one counted number in the array.
   * 
   * @description
   * The return array index lenght are the line-chart labels length. Their index postion are equal.
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

    // returns only the values of the dict.
    return Object.values(completedCounts_dict);
  }

  /**
   * Returns spent times sum on the completed tasks by the creation date.
   * Return them into array, as creation date of thask can be differnt.
   * If the creation date are same returns the one element in the array.
   * 
   * @description
   * The return array index lenght are the line-chart labels length. Their index postion are equal.
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

    // returns only the values of the dict.
    return Object.values(spentTimeSum_dict);
  }
}
