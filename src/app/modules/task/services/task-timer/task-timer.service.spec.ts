import { fakeAsync, flush, inject, TestBed, tick } from '@angular/core/testing';
import { TimerState } from './task-timer.model';

import { TaskTimerService } from './task-timer.service';

describe('TaskTimerService', () => {
  let service: TaskTimerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ TaskTimerService ]
    });
    service = TestBed.inject(TaskTimerService);
  });

  it('should be created', inject([TaskTimerService], (service: TaskTimerService) => {
    expect(service).toBeTruthy();
  }));

  it('should emits initial timer state with empty array', fakeAsync(() => {
    const expectedTimerState = -1;
    const emptyIds: string[] = [];
    service.onChangeState().subscribe(([timerState, taskIds]: [number, string[]]) => {
      expect(timerState).toBe(expectedTimerState);
      expect(taskIds).toEqual(emptyIds);
    });
  }));

  it('should emits differs timerState with empty task ids', fakeAsync(() => {
    let expectedTimerState = TimerState.Started;
    const emptyIds: string[] = [];
    service.onChangeState().subscribe(([timerState, taskIds]: [number, string[]]) => {
      if (timerState > -1) {
        expect(timerState).toBe(expectedTimerState);
        expect(taskIds).toEqual(emptyIds);
      }
    });

    // emits the timer state
    service.emitState(expectedTimerState, emptyIds);
    tick(200);

    expectedTimerState = TimerState.Interrupted;
    service.emitState(expectedTimerState, emptyIds);
    tick(200);
    
    expectedTimerState = TimerState.Finished;
    service.emitState(expectedTimerState, emptyIds);
    flush();
  }));

  it('should emits differs timerState with task ids', fakeAsync(() => {
    let expectedTimerState = TimerState.Started;
    const expectedTaskIds = ['task1-fake-fake-fake-13tt9ag', 'task2-fake-fake-fake-13tt9ag'];
    service.onChangeState().subscribe(([timerState, taskIds]: [number, string[]]) => {
      if (timerState > -1) {
        expect(timerState).toBe(expectedTimerState);
        expect(taskIds).toEqual(expectedTaskIds);
      }
    });

    // emits the timer state
    service.emitState(expectedTimerState, expectedTaskIds);
    tick(200);

    expectedTimerState = TimerState.Interrupted;
    service.emitState(expectedTimerState, expectedTaskIds);
    tick(200);

    expectedTimerState = TimerState.Finished;
    service.emitState(expectedTimerState, expectedTaskIds);
    flush();
  }));

  it('should emits wrong data', fakeAsync(() => {
    service.onChangeState().subscribe(([timerState, taskIds]: [number, string[]]) => {
        expect(timerState).toBe(-1);
        expect(taskIds).toEqual([]);
    });

    // emits wrong data
    let expectedTimerState = 10;
    let expectedTaskIds = null as any;
    service.emitState(expectedTimerState, expectedTaskIds);
    tick(200);

    expectedTimerState = 5;
    expectedTaskIds = undefined as any;
    service.emitState(expectedTimerState, expectedTaskIds);
    tick(200);

     // one of them has wrong value
    expectedTimerState = null as any;
    expectedTaskIds = [];
    service.emitState(expectedTimerState, expectedTaskIds);
    tick(200);
   
    expectedTimerState = 1;
    expectedTaskIds = 'wrong' as any;
    service.emitState(expectedTimerState, expectedTaskIds);
    flush();
  }));
});
