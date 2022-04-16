import { Component, OnDestroy, OnInit } from '@angular/core';

import { TaskService } from './services/task.service';
import { Task } from './services/task.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit, OnDestroy {
  public taskList: Task[] = [];
  private _taskSubscription!: Subscription;

  constructor(private readonly taskService: TaskService) { }

  ngOnInit(): void {
    this.getAllTask();
  }

  ngOnDestroy(): void {
    this._taskSubscription.unsubscribe();
  }

  private getAllTask(): void {
    this._taskSubscription = this.taskService.getAll().subscribe(tasks => this.taskList = tasks);
  }

}
