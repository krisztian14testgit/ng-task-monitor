import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output } from '@angular/core';
import { TaskStatus, TaskTimer } from '../services/task.model';

/** Represents the states of the Timer. */
enum TimerState {
  Finished,
  Started,
  Inprogress
}

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
   * Emits 'timerStarted' when timer is start counting, otherwise emtis 'timerFinished'.
   */
  @Output() public timerStartedEnded: EventEmitter<string> = new EventEmitter();

  /** 
   * Stores the millisec of the converted task minutes.
   * Counter clock reduces this value if it is started. */
  public timerInMillisec = 0;
  /** Contains true if the timer is started. */
  public isTimerStarted = false;
  /** Contains true if the timer is over.*/
  public isTimerFinished = false;
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
    if (this.timerInMinutes > 0) {
      this.timerInMillisec = TaskTimer.convertsToMilliSec(this.timerInMinutes);
    }

    // If timer is interrupted
    /*if (this.timerInMinutes > 0 && this.statusLabel == TaskStatus[TaskStatus.Completed]) {
      this.isTimerFinished = false;
      this.startCounterClock();
    }*/
  }

  /**
   * Stops the counterClock.
   * Destroys the setInvertal's id if it exists when the task timer disappears
   * like the card is in edit mode.
   */
  ngOnDestroy(): void {
    // The countdown timer is broken, save finished timer date by the emitter.
    if (this.isTimerStarted && !this.isTimerFinished) {
      this.emitsTimerState(TimerState.Finished);
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

  private startCounterClock() {
    // 1sec -> 1000ms
    const milliSec = 1000;
    if (this.timerInMillisec > 0) {
      this.isTimerStarted = true;
      this.clockIntervalId = setInterval(() => {
        // exit condition: finish counterClock
        if (this.timerInMillisec <= 0) {
          this.stopCounterClock();
          this.emitsTimerState(TimerState.Finished);
        }

        // todo: just helping
        console.log('timer ', this.timerInMillisec);
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
   * Emits the state of the counterdown timer
   * when timer is started or over.
   *
   * The mode can be
   * * 0: timerFinsished
   * * 1: timerStarted
   * * 2: timerInprogress
   * @param mode It can be 0, 1.
   */
  private emitsTimerState(mode: TimerState) {
    const timerStateNames = Object.keys(TimerState).filter(prop => prop.length > 1);
    // inserts 'timer' keywords to each enum fields: timerStarted, timerFinished, timerInprogress 
    const timerEmittedValues = timerStateNames.map(item => 'timer' + item);
    
    if (mode < timerEmittedValues.length) {
      const emitValue = timerEmittedValues[mode];
      this.timerStartedEnded.emit(emitValue);
    }
  }

}
