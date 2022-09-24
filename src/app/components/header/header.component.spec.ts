import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Location } from "@angular/common";
import { RouterTestingModule } from '@angular/router/testing';
import { MatGridListModule } from '@angular/material/grid-list';

import { HeaderComponent } from './header.component';

@Component({})
class FakedRouteComponent {}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let router: Router;
  let location: Location;
  const routeTable: any[] =  [
    {path: 'home', component: FakedRouteComponent },
    {path: 'tasks/inprogress', component: FakedRouteComponent },
    {path: 'weekly', component: FakedRouteComponent },
    {path: '', redirectTo: '/home', pathMatch: 'full'}
  ];

  /** merged menu items from appMenu & optionMenu */
  const expectedRouterDict = {
    "tasks/all": "All tasks",
    "tasks/finished": "Finished",
    "statistic/daily": "Daily",
    "statistic/weekly": "In-Weekly",
    "location": "Change location"
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(routeTable),
        MatGridListModule
      ],
      declarations: [ HeaderComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);

    router.initialNavigation();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.optionMenus).toBeDefined();
    expect(component.appMenus).toBeDefined();
  });

  it('should checked filled the rotuer dict after the component declaration', () => {
    expect(component['_routerDict']).toEqual(expectedRouterDict);
  });

  it('should navigate to faked home site', fakeAsync(()=> {
    router.navigate(['']); // navige to tasks/inprogress
    tick(1);
    expect(location.path()).toBe('/home');
  }));

  it('should get titleOfRoute from the router event', fakeAsync(() => {
    // default rediretion '/tasks/all' in app-routing.module.ts
    const defaultRedirectionTitle = 'All tasks';
    expect(component.titleOfRoute).toBe(defaultRedirectionTitle);
    // subscribe on the chaging router event by ngOnInit
    component.ngOnInit();

    // tasks/inprogress and weekly are defined in a routerTable
    const navigationPaths = ['tasks/inprogress', 'weekly'];
    for (const navUrl of navigationPaths) {
      router.navigate([ navUrl ]);
      tick(1);
      expect(location.path()).toBe(`/${navUrl}`);
      // routerDict contains the title of each router path.
      expect(component.titleOfRoute).toBe(component['_routerDict'][navUrl]);
    }

    flush();
  }));
});
