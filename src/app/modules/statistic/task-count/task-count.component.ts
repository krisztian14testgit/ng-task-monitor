import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-task-count',
  templateUrl: './task-count.component.html',
  styleUrls: ['./task-count.component.css']
})
export class TaskCountComponent implements OnInit {

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
      labels: [ [ 'Download', 'Sales' ], [ 'In', 'Store', 'Sales' ], 'Mail Sales' ],
      datasets: [ {
        data: [ 300, 500, 100 ]
      } ]
    };
  }

  ngOnInit(): void {
  }

  

}
