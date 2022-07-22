import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { TimerState } from './task-timer.model';

/**
 * It allows to multicast the timer state from one component to others.
 * * One component can emit the changed timer state by this service
 * * Other component can subscribe on stream to get changed state.
 * 
 * Timer States:
 * * Finsished
 * * Started
 * * Interrupted
 * * stopAll
 */
@Injectable()
export class TaskTimerService {
  private _timerState$ = new BehaviorSubject<[string, Date]>(['', new Date()]);

  /**
   * Emits the timer state as string
   * and eventDate of the counterdown timer in tuple.
   * 
   * The eventDate: when timer is started, over or interrupted.
   * @property
   * The interruptedMilliSec param: should be set if you emits the 'interrupted' state.
   * 
   * The timer states:
   * * 0: Finsished
   * * 1: Started
   * * 2: Interrupted
   * @param timerState It is can be 0, 1, 2.
   * @param interruptedMillisec The milliSec of the counterDown timer. Optional parameter, default: 0.
   */
   public emitState(timerState: TimerState, interruptedMillisec = 0): void {
    let systemDate = new Date();
    if (timerState === TimerState.Interrupted) {
      // timerFinished date(when will be done) =  timerStarted date + rest milliSec
      const startedDate_millisec = systemDate.getTime();
      const finishedDate_millisec = startedDate_millisec + interruptedMillisec;
      // future date when task timer is over.
      systemDate = new Date(finishedDate_millisec);
    }
    
    const timerStatusName = TimerState[timerState];
    this._timerState$.next([timerStatusName, systemDate]);
  }

  /**
   * Emits the 'stopAll' timer state with the current Date time in tuple.
   * * 0 => 'stopAll'
   * * 1 => current date.
   */
  public stopAllTimer(): void {
    const currentDate = new Date();
    this._timerState$.next(['stopAll', currentDate]);
  }

  /**
   * Gets the emitted tuple construction of the timer state
   * if the component subscribes on it.
   * 
   * Timer state tuple has two values:
   * * 0 => state name (Finished, Started, Interrupted)
   * * 1 => started/interrupted date of the timer
   * @returns tuple[string, date]
   */
  public onChangeState(): Observable<[string, Date]> {
    return this._timerState$.pipe(tuple => tuple);
  }
}
