import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatSelectChange } from '@angular/material/select';

import { TaskService } from './services/task.service';
import { Task, TaskStatus, TaskTime } from './services/task.model';
import { AlertMessageService } from 'src/app/services/alert-message/alert-message.service';
import { AlertType } from 'src/app/components/alert-window/alert.model';
import { CountdownTimerService } from 'src/app/services/countdown-timer/countdown-timer.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit, AfterViewInit, OnDestroy {
  /** Stores the reference of the tasks. */
  public taskList: Task[] = [];
  /** Statuses of the Task. */
  public readonly taksStatusList: string[] = [];
  /** Two-way bindign. Contains the selected status from the combobox. */
  public selectedStatus = '';
  /** 
   * Two-way bindig
   * TaskTime enum filer: when task was created.
   * * Default value: Today = 0 
   * * Yesterday = 1
   * * Week = 2
   */
  public readonly defaultTaskTime: string;
  /** Contains the count of tasks which are filtered by date. */
  public filteredTaskCount = 0;
  /** 
   * Locker of the Task cards, if it is true then the card is not editable.
   * @description
   * It will be true when task creation date is yesterday, or more later, NOT today.
   */
  public isLockedTasks = false;
  public readonly MAX_LIMIT_TASKS = 10;
  private _taskSubscription!: Subscription;
  /**
   * Stores the all original task items which got from the service.
   * It is helping for the task filtering methods.
   */
  private _preservedTaskList: Task[] = [];
  /** Stores those tasks which are filtered by the date. Created: today/yesterday or in the week. */
  private _filteredTaskListByDate: Task[] = [];

  constructor(private readonly taskService: TaskService,
              private readonly alertMessageService: AlertMessageService,
              private readonly timerWorkerService: CountdownTimerService,
              private readonly router: Router) {
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

  /** Unsubscribes the task stream if the task side is leaved. */
  ngOnDestroy(): void {
    this._taskSubscription.unsubscribe();
    this.timerWorkerService.terminateWorker();
  }

  /**
   * This is an Model change event function.
   * It is triggered when the selection tag value is changed in the comboBox.
   * 
   * Filtering the taks elements by the selected status value.
   * E.g.: get only the completed, inProgress tasks.
   * @event onChange
   */
  public onFilterStatus(): void {
    if (this.selectedStatus) {
      const statusKey = this.selectedStatus.toUpperCaseFirstChar();
      // convert string to enum type
      const statusValue = TaskStatus[statusKey as keyof typeof TaskStatus];
      this.taskList = this._filteredTaskListByDate.filter((task:Task) => task.status === statusValue);
    } else {
      // not filtering, contains all task statuses
      this.taskList = this._filteredTaskListByDate;
    }
  }

  /**
   * This an change event function.
   * It run when the user select an item from Task time period combobox.
   * 
   * Filtering the tasks by the creationDate which is created today/yesterday or in week.
   * @event onChange
   */
  public onChangedTimePeriod(matSelectionEvent: MatSelectChange): void {
    const lastTastTimeValue = TaskTime.Week;
    if ( matSelectionEvent.value <= lastTastTimeValue) {
      const timeFilter = matSelectionEvent.value;
      this.taskList = this.filterTasksByDate(timeFilter);
      // Yesterday, week tasks cannot be editable.
      this.isLockedTasks = timeFilter !== 'today';
    }
  }

  /**
   * Adds new empty task into the task list.
   * The max item limit: 10.
   */
  public addNewTask(): void {
    if (this.taskList.length < this.MAX_LIMIT_TASKS) {
      // add new task with new-$count id
      this.taskList.unshift(new Task(`new-${this.taskList.length}`));
      this.filteredTaskCount = this.taskList.length;
    } else {
      this.alertMessageService.sendMessage(`You cannot add news task, max: ${this.MAX_LIMIT_TASKS}!`, 
                                            AlertType.Warning);
    }
  }

  /**
   * Removes that empty card from the container which belongs to the removed id
   * @param $removedTaskId The id of new task which is not saved. The id includes 'new' keyword with number.
   */
  public onRemoveFailedNewTask($removedTaskId: string): void {
    if ($removedTaskId) {
      const removedIndex = this.taskList.findIndex((task: Task) => task.id === $removedTaskId);
      this.taskList.splice(removedIndex, 1);
      this.filteredTaskCount = this.taskList.length;
    }
  }

  /**
   * Returns the reference of the filtered Task list.
   * Tasks is filtered by the created date when they are created.
   * 
   * If timePeriod is week, showing all tasks.
   * @param timePeriod Can be 'today' | 'yesterday' | 'week'.
   * @returns The filtered task by time period.
   */
  private filterTasksByDate(timePeriod: TaskTime): Task[] {
    if (timePeriod === TaskTime.Today) {
      this._filteredTaskListByDate = this._preservedTaskList
        .filter((task:Task) => task.isCreatedToday() === true);
    } else if (timePeriod === TaskTime.Yesterday) {
      this._filteredTaskListByDate = this._preservedTaskList
        .filter((task:Task) => task.isCreatedYesterday() === true);
    } else {
      // show all tasks, deep copy origin task items
      this._filteredTaskListByDate = [...this._preservedTaskList];
    }
    
    this.filteredTaskCount = this._filteredTaskListByDate.length;
    return this._filteredTaskListByDate;
  }

  /**
   * Stores the tasks from the service into the taskList.
   * taskList is filtered by the "today" date.
   */
  private getAllTask(): void {
    this._taskSubscription = this.taskService.getAll()
    .subscribe(tasks => {
      this._preservedTaskList = [...tasks];
      this.timerWorkerService.calculateTaskExpirationTime(this._preservedTaskList)
      .catch((err: Error) => console.error(err));
      
      // Spleeping main thread a little the sub-thread timer calculation runs well.
      setTimeout(() => {
        this.taskList = this.filterTasksByDate(TaskTime.Today);
        // filters tasks by the selected status
        this.selectedStatus = this.getStatusFromUrl();
        this.onFilterStatus();
      }, 500);
    });
  }

  /** 
   * Fills in taksStatusList from the TaskStatus enum items.
   * Result: tasksStatusList: ['start', 'inprogress', 'completed']
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

  /**
   * Returns task status from the navigated url.
   * If returned value empty string(''), not selected statuses.
   * @returns string
   */
  private getStatusFromUrl(): string {
    const slashSign = '/';
    const indexOfSlash = this.router.url.lastIndexOf(slashSign);
    const nextChart = 1;

    let status = this.router.url.substring(indexOfSlash + nextChart);
    status = status === 'finished' ? 'completed': status;
    if (status === 'all') {
      return '';
    }

    return status;
  }
}
