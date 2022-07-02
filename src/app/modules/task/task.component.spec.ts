import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AlertMessageService } from 'src/app/services/alert-message/alert-message.service';
import { CountdownTimerService } from 'src/app/services/countdown-timer/countdown-timer.service';
import { MockCountdownTimerService } from 'src/app/tests/mock-services/mock-countdown-timer.service';
import { MockTaskService } from 'src/app/tests/mock-services/mock-task.service';
import { TaskService } from './services/task.service';

import { TaskComponent } from './task.component';

describe('TaskComponent', () => {
  let component: TaskComponent;
  let fixture: ComponentFixture<TaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ RouterTestingModule.withRoutes([]) ],
      declarations: [ TaskComponent ],
      providers: [
        { provide: TaskService, useClass: MockTaskService },
        { provide: CountdownTimerService, useClass: MockCountdownTimerService },
        { provide: AlertMessageService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
