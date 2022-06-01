import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { Task, TaskStatus, TaskTimer } from '../services/task.model';

@Component({
  selector: 'app-task-timer',
  templateUrl: './task-timer.component.html',
  styleUrls: ['./task-timer.component.css']
})
export class TaskTimerComponent implements OnChanges, OnDestroy {
  /** The given task through input. */
  @Input() public task: Task | undefined = undefined;
  /** 
   * Stores the millisec of the converted task minutes.
   * Counter clock reduces this value if it is started. */
  public timerInMillisec = 0;
  /** Contains true if the timer is started. */
  public isStartedTimer = false;
  /** The status label of the status. */
  public statusLabel = '';
  /** Stores the interval Id of the setInterval function. */
  private clockIntervalId!: NodeJS.Timeout;

  /**
   * webWorker
   * 1. calculate counterClock which time is spent all task(inprogress)
   * 2. counterclock stop when the taskCard lost focus(on monitor)
   * 
   * Main thread
   * 1 update taskcard counterClock (done)
   * 
   */
  constructor() { }

  /** 
   * It runs when the task input is changed.
   * Sets this.timerInMillisec by converting task.timeMinutes to millisec.
   * Sets the statusLabel by the TaskStatus enum key.
   */
  ngOnChanges(): void {
    if (this.task && this.task.id.length > 0 && this.task.timeMinutes > 0) {
      this.timerInMillisec = TaskTimer.convertsToMilliSec(this.task.timeMinutes);
      this.statusLabel = TaskStatus[this.task.status];
    }
  }

  /**
   * Destroys the setInvertal's id if it exists after leaving the task card.
   */
  ngOnDestroy(): void {
    this.stopCounterClock();
  }

  /**
   * Starts counterClock of the task.
   * Measuring the time.
   */
  public startCounterClock() {
    // 1sec -> 1000ms
    const milliSec = 1000;
    if (this.timerInMillisec > 0) {
      this.isStartedTimer = true;
      this.updateTaskStatusLabel(TaskStatus.Inprogress);
      this.updateTaskTimerDate(1); // startedDate

      this.clockIntervalId = setInterval(() => {
        // exit condition: finish counterClock
        if (this.timerInMillisec <= 0) {
          this.stopCounterClock();
          this.updateTaskStatusLabel(TaskStatus.Completed);
          this.updateTaskTimerDate(0); // finishedDate
        }

        this.timerInMillisec -= milliSec;
      }, milliSec);
    }
  }

  /**
   * Stops the counter clock counting.
   */
  private stopCounterClock() {
    clearInterval(this.clockIntervalId);
    // this.isStartedTimer = false;
    this.timerInMillisec = 0;
  }

  /**
   * Updates the status of the task by the given status.
   * If status is completed the timeMinutes of task will be zero.
   * @param taskStatus 
   */
  private updateTaskStatusLabel(taskStatus: TaskStatus) {
    if (this.task) {
      if (taskStatus === TaskStatus.Completed) {
        this.task.timeMinutes = 0;
      }
     
      this.task['setStatus'](taskStatus);
      this.statusLabel = TaskStatus[this.task.status];
    }
  }

  /**
   * Updates the task timer date properties by the mode.
   * The mode can be
   * * 0: timerFinsishedDate
   * * 1: timerStartedDate
   * @param mode It can be 0, 1.
   */
  private updateTaskTimerDate(mode: number) {
    if (this.task) {
      const timerFuncArray = ['timerFinishedDate', 'timerStartedDate'];
      if (mode < timerFuncArray.length) {
        const prop = timerFuncArray[mode];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (this.task as any)[prop] = new Date();
      }
    }
  }

}
