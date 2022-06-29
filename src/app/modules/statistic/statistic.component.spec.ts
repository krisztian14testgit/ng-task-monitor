import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
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

  fit('should create', () => {
    expect(component).toBeTruthy();
  });

  fit('should get all tasks', () => {
    component.ngOnInit();
    expect(component.taskList).toBeDefined();
    expect(component.taskList.length).toBeGreaterThan(0);
  });
  
  fit('should get report type from the url, isDailyReport to be true', fakeAsync(() => {
    router.navigateByUrl('statistic/daily');
    tick(100);
    
    component.ngOnInit();
    expect(component.isDailyReport).toBeTrue();
    expect(component.loadedReportCharts).toEqual(component['dailyReportCharts']);
  }));

  fit('should get report type from the url, isDailyReport to be false', fakeAsync(() => {
    router.navigateByUrl('statistic/weekly');
    tick(100);
    
    component.ngOnInit();
    expect(component.isDailyReport).toBeFalse();
    expect(component.loadedReportCharts).toEqual(component['weeklyReportCharts']);
  }));
});
