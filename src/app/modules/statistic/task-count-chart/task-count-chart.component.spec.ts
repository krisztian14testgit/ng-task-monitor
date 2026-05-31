import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

import { TaskCountChartComponent } from './task-count-chart.component';
import { FakedTask } from 'src/app/tests/models/faked-task.model';

describe('TaskCountChartComponent', () => {
  let component: TaskCountChartComponent;
  let fixture: ComponentFixture<TaskCountChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ TaskCountChartComponent ],
      providers: [ provideCharts(withDefaultRegisterables()) ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskCountChartComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('taskList', FakedTask.list);
    fixture.detectChanges();
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
    fixture.componentRef.setInput('isShowedTodayDate', true);
    fixture.detectChanges();
    expect(component['filterByCreatedToday']).toHaveBeenCalled();
    expect(component.filteredTaskList.length).toBeGreaterThan(0);
    expect(component['_indexOfChartLabel']).toBe(0);
  });

  it('should make chart with weekly report', () => {
    spyOn(component as any, 'filterByCreatedToday').and.callThrough();
    fixture.componentRef.setInput('isShowedTodayDate', false);
    fixture.detectChanges();
    expect(component['filterByCreatedToday']).not.toHaveBeenCalled();
    expect(component.filteredTaskList.length).toBeGreaterThan(0);
    expect(component['_indexOfChartLabel']).toBe(1);
  });

  it('should set pie-chart data(label, data props), showing daily report', () => {
    // chart data showing the daily report
    fixture.componentRef.setInput('isShowedTodayDate', true);
    fixture.detectChanges();
    const labelIndex = component['_indexOfChartLabel'];
    // chart datasets
    expect(component.currentChartData.datasets[0].label).toBe(component['_chartLabels'][labelIndex]);
    expect(component.currentChartData.datasets[0].label?.includes('today')).toBeTrue();
    expect(component.currentChartData.datasets[0].data.length).toBeGreaterThan(0);
    // chart labels (x-axis)
    expect(component.currentChartData.labels?.length).toBeGreaterThan(0);
  });

  it('should set pie-chart data(label, data props), showing weekly report', () => {
    // chart data showing the weekly report
    fixture.componentRef.setInput('isShowedTodayDate', false);
    fixture.detectChanges();
    const labelIndex = component['_indexOfChartLabel'];
    // chart datasets
    expect(component.currentChartData.datasets[0].label).toBe(component['_chartLabels'][labelIndex]);
    expect(component.currentChartData.datasets[0].label?.includes('weekly')).toBeTrue();
    expect(component.currentChartData.datasets[0].data.length).toBeGreaterThan(0);
    // chart labels (x-axis)
    expect(component.currentChartData.labels?.length).toBeGreaterThan(0);
  });
});
