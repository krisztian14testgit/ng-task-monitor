import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';

import { TaskService } from './services/task.service';
import { Task, TaskStatus } from './services/task.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit, AfterViewInit, OnDestroy {
  /** Stores the created tasks. */
  public taskList: Task[] = [];
  /** Statuses of the Task. */
  public taksStatusList: string[] = [];
  private _taskSubscription!: Subscription;

  constructor(private readonly taskService: TaskService) { }

  ngOnInit(): void {
    this.getAllTask();
  }

  ngAfterViewInit(): void {
    this.fillInStatusSelection();
  }

  ngOnDestroy(): void {
    this._taskSubscription.unsubscribe();
  }

  private getAllTask(): void {
    this._taskSubscription = this.taskService.getAll().subscribe(tasks => this.taskList = tasks);
  }

  private fillInStatusSelection(): void {
    const statuses = Object.values(TaskStatus) as string[];
    // get rid of number: "0", "1", 
    const notSingleNumber = 1;
    const filteredStatuses = statuses.filter((item: string) => item.length > notSingleNumber);
    
    for (const status of filteredStatuses) {
      this.taksStatusList.push(status.toLowerCase());
    }
  }

}
