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
 */
@Injectable()
export class TaskTimerService {
  private _timerState$: BehaviorSubject<[number, string[]]>;

  constructor() {
    const initialTimerState: [number, string[]] = [-1, [] ];
    this._timerState$  = new BehaviorSubject<[number, string[]]>(initialTimerState);
  }

  /**
   * Emits the given timer state and task ids array.
   * 
   * If you emit interruption of the timer, you can collect those tasks which are inprogress status.
   * The app-task-timer component will close the inProgress tasks and stops the their timer counting 
   * by the given ids.
   * 
   * The timer states:
   * * 0: Finsished
   * * 1: Started
   * * 2: Interrupted
   * @param timerState It is can be 0, 1, 2.
   * @param taskIds Task id array.
   */
   public emitState(timerState: TimerState, taskIds: string[]): void {
    if (timerState > -1 && timerState < Object.values(TimerState).length) {
      this._timerState$.next([timerState, taskIds]);
    }
  }

  /**
   * Gets the emitted tuple construction
   * if the components subscribes on it.
   * 
   * Timer tuple construction has two values:
   * * 0 => timerState (Finished, Started, Interrupted)
   * * 1 => task ids in array
   * @returns tuple[number, string[]]
   */
  public onChangeState(): Observable<[number, string[]]> {
    return this._timerState$.pipe(tuple => tuple);
  }
}
