import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatSelectChange } from '@angular/material/select';

import { TaskService } from './services/task.service';
import { Task, TaskStatus, TaskTime } from './services/task.model';

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
  /** Contains the selected status from the combobox. */
  public selectedStatus = '';
  /** 
   * Task time filer: when task was created.
   * * Default value: Today = 0 
   * * Yesterday = 1
   */
  public defaultTaskTime: string;
  private _taskSubscription!: Subscription;

  constructor(private readonly taskService: TaskService) {
    this.defaultTaskTime = TaskTime.Today.toString();
  }

  ngOnInit(): void {
    this.getAllTask();
  }

  ngAfterViewInit(): void {
    this.fillInStatusSelection();
  }

  ngOnDestroy(): void {
    this._taskSubscription.unsubscribe();
  }

  /**
   * This an chage event function.
   * It run when the user select an item from Task time combobox.
   */
  public onChangedTimePeriod(matSelectionEvent: MatSelectChange): void {
    console.log(matSelectionEvent.value);
  }

  private getAllTask(): void {
    this._taskSubscription = this.taskService.getAll()
    .subscribe(tasks => this.taskList = tasks);
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
