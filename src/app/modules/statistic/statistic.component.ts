import { Component, OnInit } from '@angular/core';

import { TaskService } from '../task/services/task.service';
import { Task } from '../task/services/task.model';

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.css']
})
export class StatisticComponent implements OnInit {
  /** Contains the task instances from the task Service. */
  public taskList: Task[] = [];
  /** This a switcher, the tasks are created today or not. */
  public isFilteredToday = true;
  public toggleName: 'daily' | 'weekly';
  /** Contains the actual title of the diagramm. */
  public currentChartTitle!: string;
  constructor(private readonly taskService: TaskService) {
    this.currentChartTitle = 'Number of Task status';
    this.toggleName = 'daily';
  }

  /** Gets all tasks from the service. */
  ngOnInit(): void {
    this.getAllTasks();
  }

  public onChangeToggle(): void {
    this.toggleName = this.isFilteredToday ? 'daily' : 'weekly';
  }

  private getAllTasks(): void {
    this.taskService.getAll()
    .subscribe((tasks: Task[]) => this.taskList = tasks);
  }

}
