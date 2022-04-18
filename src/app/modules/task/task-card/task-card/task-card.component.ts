import { Component, Input, OnChanges, OnInit } from '@angular/core';

import { Task, TaskStatus } from '../../services/task.model';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.css']
})
export class TaskCardComponent implements OnInit, OnChanges {
  /** The current task reference which was given. */
  @Input() public task: Task = new Task();
  
  /** The name of TaskStatus. */
  public statusLabel = '';
  public selectedTaskId = '';
  public isSelected = false;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    if (this.task.id) {
      // get TaskStatus key as string
      this.statusLabel = TaskStatus[this.task.status];
    }
  }

  public onClickMatCard(): void {
    this.selectedTaskId = this.task.id;
    this.isSelected = true;
    console.log('selected', this.selectedTaskId);
  }

}
