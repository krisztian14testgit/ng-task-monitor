import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineChartComponent } from './line-chart.component';
import { FakedTask } from 'src/app/tests/models/faked-task.model';
import { LineChartReport } from '../services/chart.model';

describe('LineChartComponent', () => {
  let component: LineChartComponent;
  let fixture: ComponentFixture<LineChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LineChartComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // set taskList with faked Tasks
    component.taskList = FakedTask.list;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component['currentChartType']).toBe('line');
    expect(component['currentChartOptions']).toBeDefined();
    expect(component['currentChartData']).toBeDefined();
    expect(component['_chartLabels'].length).toBe(2);
    expect(component['_chartDataCallBack'].length).toBe(2);
  });

  it('should set line-chart data(label, data props), showing counted completed tasks', () => {
    // checking initial chart data
    expect(component.currentChartData.datasets[0].label).toBe('Empty label of the chart');
    expect(component.currentChartData.datasets[0].data).toEqual([]);
    expect(component.currentChartData.labels).toEqual([]);
    
    // chart data showing the counted of completed tasks
    component.lineType = LineChartReport.CompletedTask;
    component.ngOnChanges(); // it will call the setLineChartData func
    // chart datasets
    expect(component.currentChartData.datasets[0].label).toBe(component['_chartLabels'][component.lineType]);
    expect(component.currentChartData.datasets[0].label?.includes('Completed task')).toBeTrue();
    expect(component.currentChartData.datasets[0].data.length).toBeGreaterThan(0);
    // chart labels (x-axis)
    expect(component.currentChartData.labels?.length).toBeGreaterThan(0);
  });

  it('should set line-chart data(label, data props), showing spent times on the completed tasks', () => {
    // checking initial chart data
    expect(component.currentChartData.datasets[0].label).toBe('Empty label of the chart');
    expect(component.currentChartData.datasets[0].data).toEqual([]);
    expect(component.currentChartData.labels).toEqual([]);
    
    // chart data showing the counted of completed tasks
    component.lineType = LineChartReport.SpentTime;
    component.ngOnChanges(); // it will call the setLineChartData func
    // chart datasets
    expect(component.currentChartData.datasets[0].label).toBe(component['_chartLabels'][component.lineType]);
    expect(component.currentChartData.datasets[0].label?.includes('spent times')).toBeTrue();
    expect(component.currentChartData.datasets[0].data.length).toBeGreaterThan(0);
    // chart labels (x-axis)
    expect(component.currentChartData.labels?.length).toBeGreaterThan(0);
  });
});
