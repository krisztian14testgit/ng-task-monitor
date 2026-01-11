import { Component, effect, EventEmitter, input, OnDestroy, OnInit, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { TaskTimer, TimerState } from '../services/task-timer/task-timer.model';
import { TaskTimerService } from '../services/task-timer/task-timer.service';
import { TaskStatus } from '../services/task.model';

/**
 * This component is responsible for the start countdown timer,
 * Start timer counting 
 * 
 * Emits/handles status of the timer if it is over or interrupted.
 */
@Component({
    selector: 'app-task-timer',
    templateUrl: './task-timer.component.html',
    styleUrls: ['./task-timer.component.css'],
    standalone: true,
    imports: [CommonModule, MatButtonModule, MatProgressBarModule]
})
export class TaskTimerComponent implements OnInit, OnDestroy {
  public taskId = input('');
  /** The Task minutes of time. */
  public timerInMinutes = input(0);
  /** The status label of the status. */
  public statusLabel = input('');
  /** This switcher is true then Task-timer 'start' button is active, otherwise it is disabled. */
  public isTimePeriodToday = input(true);
  /** 
   * It triggers when the timer start counting or it is over.
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
  public timerInMillisec = signal(0);
  /** Contains true if the timer is started. */
  public isTimerStarted = signal(false);
  /** Contains true if the timer is over.*/
  public isTimerFinished = signal(false);
  /** 
   * This value is percentage. Max value is 100%
   * 
   * Contains the calculated percentage of spent time from the timer. 
   * Mat-ProgressBar shows this value.
   */
  public progessBarPercent = signal(0);
  /** Stores the interval Id of the setInterval function. */
  private _clockIntervalId!: NodeJS.Timeout;
  /** Stores the started date which is the current Date of system clock. */
  private _timerStartedDate!: Date;
  /** Preserves the original value of the timerInMilliesc(when we got) of the task. */
  private _preTimerInMillisec = 0;

  constructor(private readonly taskTimerService: TaskTimerService) {
    // Effect to react to timerInMinutes input signal changes
    effect(() => {
      const minutes = this.timerInMinutes();
      const status = this.statusLabel();
      
      if (minutes > 0) {
        this.timerInMillisec.set(TaskTimer.convertsToMilliSec(minutes));
        this._preTimerInMillisec = this.timerInMillisec();
        
        // If timer is interrupted, it was inprogress, start timer again.
        if (status === TaskStatus[TaskStatus.Inprogress]) {
          this.startTimer();
        }
      }
    });
  }

  /** 
   * Subscribes on the taskTimer data stream to get emitted timer state.
   * If the timer state is 'stopAll', it will terminate all task timer counting.
   */
  ngOnInit(): void {
    this.taskTimerService.onChangeState()
      .subscribe(([timerState, interruptedTaskIds]: [number, string[]]) => {
        if (timerState === TimerState.Interrupted && interruptedTaskIds.includes(this.taskId())) {
          // Interrupt the all counterdown clock
          this.emitsTimerState(TimerState.Interrupted);
        }
      });
  }

  /**
   * Stops the counterClock.
   * Destroys the setInvertal's id if it exists when the task timer disappears
   * like the card edit mode is closed.
   */
  ngOnDestroy(): void {
    // The countdown timer is broken, save finished timer date by the emitter.
    if (this.isTimerStarted() && !this.isTimerFinished()) {
      this.emitsTimerState(TimerState.Interrupted);
    }

    this.isTimerFinished.set(false);
    this.isTimerStarted.set(false);
    this.stopCounterClock();
  }

  /**
   * This a button click event.
   * Starts counterdown timer of the task by clicking on 'start' button.
   * Measuring the time if the timerInmillisec is not zero.
   */
  public startTimer() {
    if (this.timerInMillisec() > 0) {
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
    if (this.timerInMillisec() > 0) {
      this.isTimerStarted.set(true);
      this._clockIntervalId = setInterval(() => {
        // exit condition: counterClock is over!
        if (this.timerInMillisec() <= 0) {
          this.stopCounterClock();
          this.emitsTimerState(TimerState.Finished);
        }

        this.timerInMillisec.update(val => val - milliSec);
        this.progessBarPercent.set(this.calculateProgressBarValue(this.timerInMillisec()));
      }, milliSec);
    }
  }

  /**
   * Stops the counter clock counting.
   */
  private stopCounterClock() {
    clearInterval(this._clockIntervalId);
    this.isTimerFinished.set(true);
    this.timerInMillisec.set(0);
  }

  /**
   * Emits the state and eventDate of the counterdown timer in Tuple.
   * 
   * The eventDate: when timer is started, over or interrupted.
   *
   * The timerState can be
   * * 0: Finsished
   * * 1: Started
   * * 2: Interrupted
   * @param mode It can be 0, 1, 2.
   */
  private emitsTimerState(mode: TimerState) {
    let systemClock = new Date();
    this._timerStartedDate = systemClock;
    if (mode === TimerState.Interrupted) {
      // timerFinished date(when will be done) =  timerStarted date + rest milliSec
      const startedDate_millisec = this._timerStartedDate.getTime();
      const finishedDate_millisec = startedDate_millisec + this.timerInMillisec();
      // future date when task timer is over.
      systemClock = new Date(finishedDate_millisec);
    }
    
    const timerStatus = TimerState[mode];
    this.timerStatusEmitter.emit([timerStatus, systemClock]);
  }

  /**
   * Returns the spent time percentage from the current timer value.
   * It is on charge of the progressBar animation.
   * 
   * Spent time = The percentage of the difference the preserved timer and current timer.
   * @param timerInMillisec actual value of the Timer.
   * @returns spent percentage of the spent timer.
   */
  private calculateProgressBarValue(timerInMillisec: number): number {
    const wholePercentage = 100;
    const restPercentage = timerInMillisec / this._preTimerInMillisec * 100;
    // 100% - restTime% = percentage of the spent time
    return Math.round(wholePercentage - restPercentage);
  }
}
