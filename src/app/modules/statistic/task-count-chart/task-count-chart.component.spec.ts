import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskCountChartComponent } from './task-count-chart.component';
import { FakedTask } from 'src/app/tests/models/faked-task.model';

describe('TaskCountChartComponent', () => {
  let component: TaskCountChartComponent;
  let fixture: ComponentFixture<TaskCountChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskCountChartComponent ],
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
    expect(component['pieChartType']).toBe('pie');
    expect(component['pieChartOptions']).toBeDefined();
    expect(component['pieChartData']).toBeDefined();
    expect(component['_pieChartLabels'].length).toBe(2);
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
    expect(component.pieChartData.datasets[0].label).toBe('Empty label of the chart');
    expect(component.pieChartData.datasets[0].data).toEqual([]);
    expect(component.pieChartData.labels).toEqual([]);

    // chart data showing the daily report
    component.isShowedTodayDate = true;
    component.ngOnChanges(); // it will call the setPieChartData func
    const labelIndex = component['_indexOfChartLabel'];
    // chart datasets
    expect(component.pieChartData.datasets[0].label).toBe(component['_pieChartLabels'][labelIndex]);
    expect(component.pieChartData.datasets[0].label?.includes('today')).toBeTrue();
    expect(component.pieChartData.datasets[0].data.length).toBeGreaterThan(0);
    // chart labels (x-axis)
    expect(component.pieChartData.labels?.length).toBeGreaterThan(0);
  });

  it('should set pie-chart data(label, data props), showing weekly report', () => {
    // checking initial chart data
    expect(component.pieChartData.datasets[0].label).toBe('Empty label of the chart');
    expect(component.pieChartData.datasets[0].data).toEqual([]);
    expect(component.pieChartData.labels).toEqual([]);

    // chart data showing the weekly report
    component.isShowedTodayDate = false;
    component.ngOnChanges(); // it will call the setPieChartData func
    const labelIndex = component['_indexOfChartLabel'];
    // chart datasets
    expect(component.pieChartData.datasets[0].label).toBe(component['_pieChartLabels'][labelIndex]);
    expect(component.pieChartData.datasets[0].label?.includes('weekly')).toBeTrue();
    expect(component.pieChartData.datasets[0].data.length).toBeGreaterThan(0);
    // chart labels (x-axis)
    expect(component.pieChartData.labels?.length).toBeGreaterThan(0);
  });
});
