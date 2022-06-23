import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskCountComponent } from './task-count.component';

describe('TaskCountComponent', () => {
  let component: TaskCountComponent;
  let fixture: ComponentFixture<TaskCountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskCountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
