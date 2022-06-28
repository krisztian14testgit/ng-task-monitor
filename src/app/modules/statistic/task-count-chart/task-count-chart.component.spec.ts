import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskCountChartComponent } from './task-count-chart.component';

describe('TaskCountChartComponent', () => {
  let component: TaskCountChartComponent;
  let fixture: ComponentFixture<TaskCountChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskCountChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskCountChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
