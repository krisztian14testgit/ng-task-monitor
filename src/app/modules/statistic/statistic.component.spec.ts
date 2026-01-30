import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { MockTaskService } from 'src/app/tests/mock-services/mock-task.service';
import { TaskService } from '../task/services/task.service';
import { StatisticComponent } from './statistic.component';

describe('StatisticComponent', () => {
  let component: StatisticComponent;
  let fixture: ComponentFixture<StatisticComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // TODO: routing testing: https://codecraft.tv/courses/angular/unit-testing/routing/
      imports: [ RouterTestingModule.withRoutes([
        { path: 'statistic/daily', component: StatisticComponent },
        { path: 'statistic/weekly', component: StatisticComponent }
      ])],
      declarations: [ StatisticComponent ],
      providers: [
        { provide: TaskService, useClass: MockTaskService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisticComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get all tasks', () => {
    component.ngOnInit();
    expect(component.taskList).toBeDefined();
    expect(component.taskList.length).toBeGreaterThan(0);
  });
  
  it('should get report type from the url, isDailyReport to be true', fakeAsync(() => {
    spyOn(router, 'navigate').and.callThrough();
    router.navigateByUrl('statistic/daily');
    tick(100);
    
    component.ngOnInit();
    expect(component.isDailyReport()).toBeTrue();
    expect(component.loadedReportCharts).toEqual(component['_dailyReportCharts']);
  }));

  it('should get report type from the url, isDailyReport to be false', fakeAsync(() => {
    spyOn(router, 'navigate').and.callThrough();
    router.navigateByUrl('statistic/weekly');
    tick(100);
    
    component.ngOnInit();
    expect(component.isDailyReport()).toBeFalse();
    expect(component.loadedReportCharts).toEqual(component['_weeklyReportCharts']);
  }));

  it('should load the chart if selectedChartType has good value, daily statistic', () => {
    // pie-chart
    component.selectedChartType.set(0);
    component.isDailyReport.set(true);
    fixture.detectChanges();
    const chartDiv = fixture.debugElement.query(By.css('.chart'));
    expect(chartDiv).toBeDefined();
    expect(chartDiv.children.length).toBeGreaterThan(0);
  });

  it('should display one pie chart if the selectedChartType has wrong value, weekly statistic', () => {
    // contains one defualt pie-chart, comboBox does have 3 index option.
    component.selectedChartType.set(3);
    component.isDailyReport.set(false);
    fixture.detectChanges();
    let chartDiv = fixture.debugElement.query(By.css('.chart'));
    expect(chartDiv).toBeDefined();
    expect(chartDiv.children.length).toBe(1);

    // wrong value
    component.selectedChartType.set(null as any);
    fixture.detectChanges();
    chartDiv = fixture.debugElement.query(By.css('.chart'));
    expect(chartDiv).toBeDefined();
    expect(chartDiv.children.length).toBe(1);
  });
});
