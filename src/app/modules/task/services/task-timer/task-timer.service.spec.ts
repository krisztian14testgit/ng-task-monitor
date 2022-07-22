import { TestBed } from '@angular/core/testing';

import { TaskTimerService } from './task-timer.service';

describe('TaskTimerService', () => {
  let service: TaskTimerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskTimerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
