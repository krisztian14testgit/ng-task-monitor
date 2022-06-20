import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';

import { TaskTimer, TimerState } from '../services/task-timer.model';
import { TaskStatus } from '../services/task.model';

/**
 * It is respansible the start countdown timer. Start counting.
 * 
 * Emits/handles status of the timer if it is over or interrupted.
 */
@Component({
  selector: 'app-task-timer',
  templateUrl: './task-timer.component.html',
  styleUrls: ['./task-timer.component.css']
})
export class TaskTimerComponent implements OnChanges, OnDestroy {
  /** The Task minutes of time. */
  @Input() public timerInMinutes = 0;
  /** The status label of the status. */
  @Input() public statusLabel = '';
  /** 
   * It triggers when the timer start counting and it is over.
   * 
   * Timer states:
   * * Finsished
   * * Started
   * * Interrupted
   */
  @Output() public timerStatusEmitter: EventEmitter<[string, Date]> = new EventEmitter();

  /** 
   * Rest milliSeconds of timer of task. Measuring time.
   * Counter clock reduces this value if it is already started.
   */
  public timerInMillisec = 0;
  /** Contains true if the timer is started. */
  public isTimerStarted = false;
  /** Contains true if the timer is over.*/
  public isTimerFinished = false;
  /** Stores the interval Id of the setInterval function. */
  private clockIntervalId!: NodeJS.Timeout;
  private timerStartedDate!: Date;

  /** 
   * It runs when the task input is changed.
   * Sets this.timerInMillisec by converting task.timeMinutes to millisec.
   * Sets the statusLabel by the TaskStatus enum key.
   */
  ngOnChanges(changes : SimpleChanges): void {
    if (changes.timerInMinutes?.isFirstChange() && this.timerInMinutes > 0) {
      this.timerInMillisec = TaskTimer.convertsToMilliSec(this.timerInMinutes);
      
      // If timer is interrupted, it was inprogress, start timer again.
      if (this.statusLabel == TaskStatus[TaskStatus.Inprogress]) {
        this.startTimer();
      }
    }
  }

  /**
   * Stops the counterClock.
   * Destroys the setInvertal's id if it exists when the task timer disappears
   * like the card is in edit mode.
   */
  ngOnDestroy(): void {
    // The countdown timer is broken, save finished timer date by the emitter.
    if (this.isTimerStarted && !this.isTimerFinished) {
      this.emitsTimerState(TimerState.Interrupted);
    }

    this.isTimerFinished = this.isTimerStarted  = false;
    this.stopCounterClock();
  }

  /**
   * Starts counterdown timer of the task by clicking on 'start' button.
   * Measuring the time if the timerInmillisec is not zero.
   */
  public startTimer() {
    if (this.timerInMillisec > 0) {
      this.emitsTimerState(TimerState.Started);
      this.startCounterClock();
    }
  }

  /**
   * Starts counterdown timer.
   */
  private startCounterClock() {
    // 1sec -> 1000ms
    const milliSec = 1000;
    if (this.timerInMillisec > 0) {
      this.isTimerStarted = true;
      this.clockIntervalId = setInterval(() => {
        // exit condition: counterClock is over!
        if (this.timerInMillisec <= 0) {
          this.stopCounterClock();
          this.emitsTimerState(TimerState.Finished);
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
    this.isTimerFinished = true;
    this.timerInMillisec = 0;
  }

  /**
   * Emits the state and eventDate of the counterdown timer in Tuple.
   * 
   * The eventDate: when timer is started, over or interrupted.
   *
   * The timer mode can be
   * * 0: Finsished
   * * 1: Started
   * * 2: Interrupted
   * @param mode It can be 0, 1, 2.
   */
  private emitsTimerState(mode: TimerState) {
    let systemClock = new Date();
    if (mode === TimerState.Started) {
      this.timerStartedDate = systemClock;
    } else if (mode === TimerState.Interrupted) {
      // timerFinished date(when will be done) =  timerStarted date + rest milliSec
      const startedDate_millisec = this.timerStartedDate.getTime();
      const finishedDate_millisec = startedDate_millisec + this.timerInMillisec;
      // future date when task timer is over.
      systemClock = new Date(finishedDate_millisec);
    }
    
    const timerStatus = TimerState[mode];
    this.timerStatusEmitter.emit([timerStatus, systemClock]);
  }

}
