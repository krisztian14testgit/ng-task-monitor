import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatSelectChange } from '@angular/material/select';

import { TaskService } from './services/task.service';
import { Task, TaskStatus, TaskTime } from './services/task.model';
import { AlertMessageService } from 'src/app/services/alert-message/alert-message.service';
import { AlertType } from 'src/app/components/alert-window/alert.model';

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
  /**
   * Stores the all original task items which got form the service.
   * It is helping for the task filtering methods.
   */
  private _preservedTaskList: Task[] = [];

  constructor(private readonly taskService: TaskService,
              private readonly alertMessageService: AlertMessageService) {
    this.defaultTaskTime = TaskTime.Today.toString();
  }

  /** Gets tasks form the service. */
  ngOnInit(): void {
    this.getAllTask();
  }

  /** StatusList is filled in for the status filter. */
  ngAfterViewInit(): void {
    this.fillInStatusSelection();
  }

  /** Unsubscribe the task stream if the task side is leaved. */
  ngOnDestroy(): void {
    this._taskSubscription.unsubscribe();
  }

  /**
   * This is an Model change event function.
   * It is triggered when the selection tag value is changed in the comboBox.
   */
  public onFilterStatus(): void {
    // get original task items form the preserved list.
    this.taskList = [...this._preservedTaskList];
    const statusKey = this.selectedStatus.toUpperCaseFirstChar();
    // convert string to enum type
    const statusValue = TaskStatus[statusKey as keyof typeof TaskStatus];
    this.taskList = this.taskList.filter((task:Task) => task.status === statusValue);
  }

  /**
   * This an chage event function.
   * It run when the user select an item from Task time combobox.
   */
  public onChangedTimePeriod(matSelectionEvent: MatSelectChange): void {
    console.log(matSelectionEvent.value);
  }

  /**
   * Adds new empty task into the task list.
   * The max item limit: 10.
   */
  public addNewTask(): void {
    const maxItemNumber = 10;
    if (this.taskList.length + 1 < maxItemNumber) {
      // add new task with new-$count id
      this.taskList.unshift(new Task(`new-${this.taskList.length}`));
    } else {
      this.alertMessageService.sendMessage('You cannot add news task, max: 10!', AlertType.Warning);
    }
  }

  /**
   * Removed that empty card from the container which belongs to the removed id
   * @param $removedTaskId The id of new task which is not saved. The id includes 'new' keyword with number.
   */
  public onRemoveFailedNewTask($removedTaskId: string): void {
    if ($removedTaskId) {
      const removedIndex = this.taskList.findIndex((task: Task) => task.id === $removedTaskId);
      this.taskList.splice(removedIndex, 1);
    }
  }

  /**
   * Stores the tasks from the service into the taskList.
   */
  private getAllTask(): void {
    this._taskSubscription = this.taskService.getAll()
    .subscribe(tasks => {
      this.taskList = tasks;
      this._preservedTaskList = [...tasks];
    });
  }

  /** 
   * Fills in taksStatusList from the TaskStatus enum items.
   * Result: tasksStatusList: ['started', 'inprogress', 'completed']
   */
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
