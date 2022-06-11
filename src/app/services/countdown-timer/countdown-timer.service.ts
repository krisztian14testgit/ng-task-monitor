import { Injectable } from '@angular/core';
import { Task, TaskStatus } from 'src/app/modules/task/services/task.model';

/**
 * This services works with the web-worker thread in the bacground.
 * It provides the worker terminates and timer calculation of each task.
 */
@Injectable()
export class CountdownTimerService {
  /** The reference of the timer-worker. */
  private _timerWorker!: Worker;

  /** 
   * Aborts the timer worker process. 
   * @Important The worker cannot used anymore after terminating.
   */
  public terminateWorker(): void {
    console.log('worker terminate');
    if (this._timerWorker) {
      this._timerWorker.terminate();
    }
  }

  /**
   * Calculates and adjusts the timer of tasks to be expired or not.
   * If task timer is not over then the web-worker give the rest timer in decimal number.
   * 
   * @description
   * Decimal number: Integer is minutes, fraction is seconds
   * @param taskList The task items where their timeMinutes will be modified.
   */
  public async calculateTaskExpirationTime(taskList: Task[]): Promise<void> {
    this._timerWorker = new Worker(new URL('src/app/web-workers/countdown-timer.worker', import.meta.url));
    
    if (window.Worker) {
      this._timerWorker.onmessage = function(wEvent: any) {
        console.log('Main thread received Date form web-worker');
        const restTimeList = wEvent.data as number[];

        // the taskList.length and restTimeList are equivalent array size.
        if (restTimeList && restTimeList.length > 0) {
          for (let i = 0; i < taskList.length; i++) {
            if (restTimeList[i] === 0) {
              // test setStatus, if them are zero
              taskList[i].setStatus(TaskStatus.Completed);
            }
            taskList[i].timeMinutes = restTimeList[i];
          }
        }
      };

      console.log('Main thread sended data to worker');
      this._timerWorker.postMessage(taskList);

    } else {
      throw Error('Web-worker, multiy thread cannot run!');
    }
  }
}
