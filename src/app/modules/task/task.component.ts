import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { MatSelectChange } from '@angular/material/select';

import { TaskService } from './services/task.service';
import { Task, TaskStatus, TaskTime } from './services/task.model';
import { AlertMessageService } from 'src/app/services/alert-message/alert-message.service';
import { AlertType } from 'src/app/components/alert-window/alert.model';
import { CountdownTimerService } from 'src/app/services/countdown-timer/countdown-timer.service';
import { TaskTimerService } from './services/task-timer/task-timer.service';
import { TimerState } from './services/task-timer/task-timer.model';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit, AfterViewInit, OnDestroy {
  /** Stores task items. */
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
   * It will be true, when task creation date is yesterday or week,
   * otherwise it's false when task creation date is today.
   */
  public isLockedTasks = false;
  public readonly MAX_LIMIT_TASKS = 10;
  /** Stores the reference of task stream. */
  private _taskSubscription!: Subscription;
  /**
   * Stores the all original task items which got from the service.
   * It is helping for the task filtering methods.
   */
  private _preservedTaskList: Task[] = [];
  /** Stores those tasks which are filtered by the time period. Created: today/yesterday or in the week. */
  private _filteredTaskListByDate: Task[] = [];

  constructor(private readonly taskService: TaskService,
              private readonly taskTimerService: TaskTimerService,
              private readonly alertMessageService: AlertMessageService,
              private readonly timerWorkerService: CountdownTimerService,
              private readonly router: Router) {
    this.defaultTaskTime = TaskTime.Today.toString();
  }

  /** Gets tasks form the service. */
  ngOnInit(): void {
    this.getAllTask();
  }

  /** StatusList is filled in before the view rendering. */
  ngAfterViewInit(): void {
    this.fillInStatusSelection();
  }

  /** Unsubscribes the task stream if the task side is leaved. */
  ngOnDestroy(): void {
    this._taskSubscription.unsubscribe();
    this.timerWorkerService.terminateWorker();
  }

  /** Performance helping for ngFor directive, iterable elements not re-rendering all. */
  trackByTaskID(index: number, task: Task): string {
    return task.id;
  }

  /**
   * This is a combobox change event function.
   * It is triggered when the selection tag value is changed in the comboBox.
   * 
   * Filtering the taks elements by the selected status value.
   * E.g.: get only the completed, inProgress tasks.
   * @event onChange
   */
  public onFilterStatus(): void {
    // All: not filtering by status, all task will display
    
    // If time period filtering was run at once time
     if (this._filteredTaskListByDate.length > 0) {
      this.taskList = [...this._filteredTaskListByDate];
    } else {
      this.taskList = [...this._preservedTaskList];
      this._filteredTaskListByDate = [...this._preservedTaskList];
    }

    // convert string to enum type
    let statusValue = -1;
    if (this.selectedStatus) {
      const statusKey = this.selectedStatus.toUpperCaseFirstChar();
      statusValue = TaskStatus[statusKey as keyof typeof TaskStatus];
    }

    // If it is InProgess, calculate the rest time of all tasks again.
    if (statusValue === TaskStatus.Inprogress) {
      this.calculateRestTimeOfTasksByWebWorker(this._filteredTaskListByDate);
      // Sleeping the main thread, because of the background thread has time for the calculation.
      const delayedMilliSec = 500;
      setTimeout(() => {
        // filters task items by the status
        this.taskList = this._filteredTaskListByDate.filter((task:Task) => task.status === statusValue);
      }, delayedMilliSec);
    }

    // Stop all countdown timers, status is Completed or Start,
    if (statusValue === TaskStatus.Completed || statusValue === TaskStatus.Start) {
      this.stopCountdownTimerOnInprogressTasks();
      // filters task items by the status
      this.taskList = this._filteredTaskListByDate.filter((task:Task) => task.status === statusValue);
    }
  }

  /**
   * This a combobox change event function.
   * It run when the user select an item from Task time period combobox.
   * 
   * Filtering the tasks by the creationDate which is created today/yesterday or in week.
   * @event onChange
   */
  public onChangedTimePeriod(matSelectionEvent: MatSelectChange): void {
    const lastTastTimeValue = TaskTime.Week;
    if (matSelectionEvent.value <= lastTastTimeValue) {
      const timeFilter = Number(matSelectionEvent.value);
      this.taskList = this.filterTasksByDate(timeFilter);
      // Yesterday, week tasks cannot be editable.
      this.isLockedTasks = timeFilter !== TaskTime.Today;
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
      this._preservedTaskList = [...this.taskList];
      this.filteredTaskCount = this.taskList.length;
    } else {
      this.alertMessageService.sendMessage(`You cannot add news task, max: ${this.MAX_LIMIT_TASKS}!`, 
                                            AlertType.Warning);
    }
  }

  /**
   * It occures when the task creation is canceled, or is not saved.
   * Removes that empty card from the container which belongs to the removed id
   * @param $removedTaskId The id of new task which is not saved. The id includes 'new' keyword with number.
   */
  public onRemoveFailedNewTask($removedTaskId: string): void {
    if ($removedTaskId) {
      const removedIndex = this.taskList.findIndex((task: Task) => task.id === $removedTaskId);
      if (removedIndex > -1) {
        this.taskList.splice(removedIndex, 1);
        this.filteredTaskCount = this.taskList.length;
      }
    }
  }

  /**
   * Returns the reference of the filtered Task list by the time period.
   * Tasks are filtered by the created date when they are created.
   * 
   * If timePeriod is week, showing all tasks.
   * @param timePeriod Can be 'today' | 'yesterday' | 'week'.
   * @returns The filtered task by time period.
   */
  private filterTasksByDate(timePeriod: TaskTime): Task[] {
    this._filteredTaskListByDate = [];
    if (this._preservedTaskList.length > 0) {
      switch (timePeriod) {
        case TaskTime.Today:
          this._filteredTaskListByDate = this._preservedTaskList
          .filter((task:Task) => task.isCreatedToday() === true);
          break;

        case TaskTime.Yesterday:
          this._filteredTaskListByDate = this._preservedTaskList
          .filter((task:Task) => task.isCreatedYesterday() === true);
          break;
        
        default:
          // show all tasks, deep copy origin task items
          this._filteredTaskListByDate = [...this._preservedTaskList];
          break;
      }
    }

    this.filteredTaskCount = this._filteredTaskListByDate.length;
    return this._filteredTaskListByDate;
  }

  /**
   * Stores the tasks from the service into the taskList.
   * taskList is filtered by the "today" date.
   */
  private getAllTask(): void {
    let inProgressTasks: Task[] = [];
    this._taskSubscription = this.taskService.getAll()
    .subscribe(tasks => {
      this._preservedTaskList = [...tasks];
      inProgressTasks = this.calculateRestTimeOfTasksByWebWorker(this._preservedTaskList);

      // Sleeping main thread a little, hence the sub-thread timer calculation to be executed.
      const delayMilliSec = 500;
      setTimeout(() => {
        this.taskList = this.filterTasksByDate(TaskTime.Today);
        // filters tasks by the selected status
        this.selectedStatus = this.getStatusFromUrl();
        this.onFilterStatus();

        // If there is inProgress task, re-saved all changes, 
        // because the web-worker changes inprogress Task data by reference
        if (inProgressTasks.length > 0) {
          this.saveAllTask(this.taskList);
        }
      }, delayMilliSec);
    }, () => {
      this.alertMessageService.sendMessage('Your task list is empty!', AlertType.Info);
    });
  }

  /** 
   * Fills in taksStatusList from the TaskStatus enum items.
   * The collected status names will be displayed on the status combobox
   * on the template. 
   * 
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
   * If returned value empty string(''), not selected status.
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

  /** Stops all countdown timer where the status of tasks are inprogress. */
  private stopCountdownTimerOnInprogressTasks(): void {
    // Collects those tasks' id where their status is InProgress, stop those timers
    const inProgressTasks = this._filteredTaskListByDate
    .filter((task:Task) => task.status === TaskStatus.Inprogress);
    const inprogressTaskIds = inProgressTasks.map(task => task.id);
    this.taskTimerService.emitState(TimerState.Interrupted, inprogressTaskIds);
  }

  /**
   * Saving task list which are in the list.
   * @param taskList The task items.
   */
  private saveAllTask(taskList: Task[]): void {
    if (taskList.length > 0) {
      this.taskService.saveAllTask(taskList)
      .subscribe((isSaved: boolean) => {
        if (isSaved) {
          this.alertMessageService.sendMessage('Tasks are saved.', AlertType.Success);
        }
      }, ((error: Error) => {
        if (error) {
          this.alertMessageService.sendMessage('Saving tasks is failed!', AlertType.Error);
        }
      }));
    }
  }
  
  /**
   * Web-wroker process.
   * Returns the inProgress tasks into array.
   * If There is no inPrgoress tasks the calculaton wont run,
   * returns empty array.
   * 
   * @description
   * Calculates the rest time of the tasks which are inProgress.
   * Fills the timeMinutes property with the rest time.
   * 
   * Rest time: How much time is left when the task Countdown-Timer is over.
   * @param taskList The task items.
   * @returns inProgress task array
   */
  private calculateRestTimeOfTasksByWebWorker(taskList: Task[]): Task[] {
    const inProgressTasks = taskList.filter(task => task.isInProgress());
    if (inProgressTasks.length > 0) {
      this.timerWorkerService.calculateTaskExpirationTime(inProgressTasks)
      .catch((err: Error) => console.error(err));
    }

    return inProgressTasks;
  }
}
