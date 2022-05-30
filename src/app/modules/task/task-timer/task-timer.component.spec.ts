import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskTimerComponent } from './task-timer.component';

describe('TaskTimerComponent', () => {
  let component: TaskTimerComponent;
  let fixture: ComponentFixture<TaskTimerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskTimerComponent ]
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
