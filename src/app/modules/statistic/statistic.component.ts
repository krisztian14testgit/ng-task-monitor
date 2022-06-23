import { Component, OnInit } from '@angular/core';

import { TaskService } from '../task/services/task.service';
import { Task } from '../task/services/task.model';

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.css']
})
export class StatisticComponent implements OnInit {

  public taskList: Task[] = [];
  public isFilteredToday = true;
  constructor(private readonly taskService: TaskService) { }

  ngOnInit(): void {
    this.getAllTasks();
  }

  private getAllTasks(): void {
    this.taskService.getAll()
    .subscribe((tasks: Task[]) => this.taskList = tasks);
  }

}
