import { fakeAsync, flush, TestBed } from '@angular/core/testing';

import { CountdownTimerService } from './countdown-timer.service';
import { Task } from '../../modules/task/services/task.model';
import { TaskTimer } from 'src/app/modules/task/services/task-timer.model';

describe('CountdownTimerService', () => {
  let service: CountdownTimerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CountdownTimerService]
    });
    service = TestBed.inject(CountdownTimerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  
  it('should NOT call worker terminate', () => {
    service['_timerWorker'] = null;
    service.terminateWorker();
    expect(service['_timerWorker']).toBeNull();
  });

  it('should call worker terminate', () => {
    service['createWorkerInstance']();
    
    service.terminateWorker();
    expect(service['_timerWorker']).toBeDefined();
    expect(service['_timerWorker']).toBeNull();
  });

  it('should calculate the timer expiration of task', fakeAsync(() => {
    const currentDateTime = new Date().getTime();
    const taskList = [
      new Task('faked-task-guid-1', 'Task1', 'never started', 0),
      new Task('faked-task-guid-2', 'Task2', 'completed', 10),
      new Task('faked-task-guid-3', 'Task3', 'interrupted', 10.10),
      new Task('faked-task-guid-4', 'Task4', 'interrupted', 5.2),
    ];
    const expectedTaskTimeMinutes = [0, 0, 10.9, 5.19];

    const [_, completedTask, interruptedTask1, interruptedTask2] = taskList;
    completedTask.timerStartedDate = new Date('2022.06.13 07:10:10');
    completedTask.timerFinishedDate = new Date('2022.06.13 08:10:10');
   
    let restTime_inMilliSec = TaskTimer.convertsToMilliSec(interruptedTask1.timeMinutes);
    interruptedTask1.timerStartedDate = new Date(currentDateTime);
    interruptedTask1.timerFinishedDate = new Date(currentDateTime + restTime_inMilliSec);
    
    restTime_inMilliSec = TaskTimer.convertsToMilliSec(interruptedTask2.timeMinutes);
    interruptedTask2.timerStartedDate = new Date(currentDateTime);
    interruptedTask2.timerFinishedDate = new Date(currentDateTime + restTime_inMilliSec);

    spyOn((service['_timerWorker'] as Worker), 'postMessage').and.callThrough();
    service.calculateTaskExpirationTime(taskList);
    expect((service['_timerWorker'] as Worker).postMessage).toHaveBeenCalled();

    // subscribes on the message event. It triggers when the worker finishes.
    (service['_timerWorker'] as Worker).addEventListener('message', (wEvent: MessageEvent) => {
      const restTimeList = wEvent.data as number[];
      expect(restTimeList).toEqual(expectedTaskTimeMinutes);
      
      for (let i = 0; i < taskList.length; i++) {
        expect(taskList[i].timeMinutes).toBe(expectedTaskTimeMinutes[i]);
      }
      
      // terminates the workers thread
      service.terminateWorker();
      flush();
    });
  }));

  it('should get empty array from worker if it got empty list, undefined', () => {
    let tasks: unknown = [];
    service.calculateTaskExpirationTime(tasks as Task[]);

    (service['_timerWorker'] as Worker).addEventListener('message', (wEvent: MessageEvent) => {
      const restTimeList = wEvent.data as number[];
      expect(restTimeList).toEqual([]);
      // terminates the workers thread
      service.terminateWorker();
      flush();
    });

    // when tasks is undefined
    tasks = undefined;
    service.calculateTaskExpirationTime(tasks as Task[]);
  });
});
