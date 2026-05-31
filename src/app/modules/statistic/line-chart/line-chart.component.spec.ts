import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

import { LineChartComponent } from './line-chart.component';
import { FakedTask } from 'src/app/tests/models/faked-task.model';
import { LineChartReport } from '../services/chart.model';

describe('LineChartComponent', () => {
  let component: LineChartComponent;
  let fixture: ComponentFixture<LineChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ LineChartComponent ],
      providers: [ provideCharts(withDefaultRegisterables()) ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LineChartComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('taskList', FakedTask.list);
    fixture.detectChanges();
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
    // chart data showing the counted of completed tasks
    fixture.componentRef.setInput('lineType', LineChartReport.CompletedTask);
    fixture.detectChanges();
    // chart datasets
    expect(component.currentChartData.datasets[0].label).toBe(component['_chartLabels'][component.lineType()]);
    expect(component.currentChartData.datasets[0].label?.includes('Completed task')).toBeTrue();
    expect(component.currentChartData.datasets[0].data.length).toBeGreaterThan(0);
    // chart labels (x-axis)
    expect(component.currentChartData.labels?.length).toBeGreaterThan(0);
  });

  it('should set line-chart data(label, data props), showing spent times on the completed tasks', () => {
    // chart data showing the counted of completed tasks
    fixture.componentRef.setInput('lineType', LineChartReport.SpentTime);
    fixture.detectChanges();
    // chart datasets
    expect(component.currentChartData.datasets[0].label).toBe(component['_chartLabels'][component.lineType()]);
    expect(component.currentChartData.datasets[0].label?.includes('spent times')).toBeTrue();
    expect(component.currentChartData.datasets[0].data.length).toBeGreaterThan(0);
    // chart labels (x-axis)
    expect(component.currentChartData.labels?.length).toBeGreaterThan(0);
  });
});
