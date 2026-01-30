import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatMenuModule } from '@angular/material/menu';
import { provideRouter } from '@angular/router';

import { MenuItem } from 'src/app/services/models/app-menu.model';
import { MenuItemComponent } from './menu-item.component';
import { ComponentRef } from '@angular/core';

describe('MenuItemComponent', () => {
  let component: MenuItemComponent;
  let componentRef: ComponentRef<MenuItemComponent>;
  let fixture: ComponentFixture<MenuItemComponent>;
  let menuItemWithLabel: {[label: string]: MenuItem[]};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ MenuItemComponent, MatMenuModule ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [provideRouter([])]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuItemComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    
    menuItemWithLabel = {
      'label1': [
        {linkKey: 'menuItem1', title: 'Menu1'},
        {linkKey: 'menuItem2', title: 'Menu2'}
      ],
      label2: [
        {linkKey: 'menuItem3', title: 'Menu3'}
      ]
    };
    
    // Set required input
    componentRef.setInput('menuItems_dict', menuItemWithLabel);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display title button', fakeAsync(() => {
    const buttonTitle = fixture.debugElement.nativeElement.querySelector('button');
    expect(component.title()).toBe('');
    tick(100);

    componentRef.setInput('title', 'TestTitle');
    fixture.detectChanges();
    expect(buttonTitle).toBeDefined();
    expect(buttonTitle.innerText).toBe('TestTitle');
    tick(100);

    // set empty title
    componentRef.setInput('title', '');
    fixture.detectChanges();
    expect(buttonTitle).toBeDefined();
    expect(buttonTitle.innerText).toBe('');
  }));

  it('should adjust and display menuLabelKeys', () => {
    // Create a new fixture with undefined menuItems_dict to test the initial state
    const testFixture = TestBed.createComponent(MenuItemComponent);
    const testComponent = testFixture.componentInstance;
    const testComponentRef = testFixture.componentRef;
    
    // Don't set menuItems_dict initially - required input will have default empty object behavior
    // The effect won't run with meaningful data yet
    expect(testComponent.menuLabelKeys()).toEqual([]);

    // Now set menuItems_dict with values to get labels
    testComponentRef.setInput('menuItems_dict', menuItemWithLabel);
    testFixture.detectChanges();
    
    const expectedLabels = ['label1', 'label2'];
    expect(testComponent.menuLabelKeys()).toEqual(expectedLabels);
  });

  it('should test the isDisplayedLLabels switch to show labels or not', () => {
    const expectedLabels = ['label1', 'label2'];

    // not display labels by isDisplayedLabels
    componentRef.setInput('isDisplayedLabels', false);
    fixture.detectChanges();
    expect(component.menuLabelKeys()).toEqual([]);

    // display label again by isDisplayedLabels
    componentRef.setInput('isDisplayedLabels', true);
    fixture.detectChanges();
    expect(component.menuLabelKeys()).toEqual(expectedLabels);
  });
});
