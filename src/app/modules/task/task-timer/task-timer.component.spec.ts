import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskTimerComponent } from './task-timer.component';
import { TaskTimerService } from '../services/task-timer/task-timer.service';

describe('TaskTimerComponent', () => {
  let component: TaskTimerComponent;
  let fixture: ComponentFixture<TaskTimerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskTimerComponent ],
      providers: [
        { provide: TaskTimerService }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskTimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
