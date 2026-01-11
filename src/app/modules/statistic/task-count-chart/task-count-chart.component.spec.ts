import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskCountChartComponent } from './task-count-chart.component';
import { FakedTask } from 'src/app/tests/models/faked-task.model';

describe('TaskCountChartComponent', () => {
  let component: TaskCountChartComponent;
  let fixture: ComponentFixture<TaskCountChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ TaskCountChartComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskCountChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    // set taskList with faked Tasks
    component.taskList = FakedTask.list;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component['currentChartType']).toBe('pie');
    expect(component['currentChartOptions']).toBeDefined();
    expect(component['currentChartData']).toBeDefined();
    expect(component['_chartLabels'].length).toBe(2);
  });

  it('should make chart with creationDate is Today', () => {
    spyOn(component as any, 'filterByCreatedToday').and.callThrough();
    component.isShowedTodayDate = true;
    expect(component.filteredTaskList).toEqual([]);
    
    component.ngOnChanges();
    expect(component['filterByCreatedToday']).toHaveBeenCalled();
    expect(component.filteredTaskList.length).toBeGreaterThan(0);
    expect(component['_indexOfChartLabel']).toBe(0);
  });

  it('should make chart with weekly report', () => {
    spyOn(component as any, 'filterByCreatedToday').and.callThrough();
    component.isShowedTodayDate = false;
    expect(component.filteredTaskList).toEqual([]);
    
    component.ngOnChanges();
    expect(component['filterByCreatedToday']).not.toHaveBeenCalled();
    expect(component.filteredTaskList.length).toBeGreaterThan(0);
    expect(component['_indexOfChartLabel']).toBe(1);
  });

  it('should set pie-chart data(label, data props), showing daily report', () => {
    // checking initial chart data
    expect(component.currentChartData.datasets[0].label).toBe('Empty label of the chart');
    expect(component.currentChartData.datasets[0].data).toEqual([]);
    expect(component.currentChartData.labels).toEqual([]);

    // chart data showing the daily report
    component.isShowedTodayDate = true;
    component.ngOnChanges(); // it will call the setPieChartData func
    const labelIndex = component['_indexOfChartLabel'];
    // chart datasets
    expect(component.currentChartData.datasets[0].label).toBe(component['_chartLabels'][labelIndex]);
    expect(component.currentChartData.datasets[0].label?.includes('today')).toBeTrue();
    expect(component.currentChartData.datasets[0].data.length).toBeGreaterThan(0);
    // chart labels (x-axis)
    expect(component.currentChartData.labels?.length).toBeGreaterThan(0);
  });

  it('should set pie-chart data(label, data props), showing weekly report', () => {
    // checking initial chart data
    expect(component.currentChartData.datasets[0].label).toBe('Empty label of the chart');
    expect(component.currentChartData.datasets[0].data).toEqual([]);
    expect(component.currentChartData.labels).toEqual([]);

    // chart data showing the weekly report
    component.isShowedTodayDate = false;
    component.ngOnChanges(); // it will call the setPieChartData func
    const labelIndex = component['_indexOfChartLabel'];
    // chart datasets
    expect(component.currentChartData.datasets[0].label).toBe(component['_chartLabels'][labelIndex]);
    expect(component.currentChartData.datasets[0].label?.includes('weekly')).toBeTrue();
    expect(component.currentChartData.datasets[0].data.length).toBeGreaterThan(0);
    // chart labels (x-axis)
    expect(component.currentChartData.labels?.length).toBeGreaterThan(0);
  });
});
