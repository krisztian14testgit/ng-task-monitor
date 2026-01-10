import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatMenuModule } from '@angular/material/menu';

import { MenuItem } from 'src/app/services/models/app-menu.model';
import { MenuItemComponent } from './menu-item.component';

describe('MenuItemComponent', () => {
  let component: MenuItemComponent;
  let fixture: ComponentFixture<MenuItemComponent>;
  let menuItemWithLabel: {[label: string]: MenuItem[]};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuItemComponent ],
      imports: [MatMenuModule],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    menuItemWithLabel = {
      'label1': [
        {linkKey: 'menuItem1', title: 'Menu1'},
        {linkKey: 'menuItem2', title: 'Menu2'}
      ],
      label2: [
        {linkKey: 'menuItem3', title: 'Menu3'}
      ]
    };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display title button', () => {
    expect(component.title).toBe('');
    component.title = 'TestTitle';

    fixture.detectChanges();
    let buttonTitle = fixture.debugElement.nativeElement.querySelector('button');
    expect(buttonTitle).toBeDefined();
    expect(buttonTitle.innerText).toBe('TestTitle');

    // set empty title
    component.title = '';
    fixture.detectChanges();
    buttonTitle = fixture.debugElement.nativeElement.querySelector('button');
    expect(buttonTitle).toBeDefined();
    expect(buttonTitle.innerText).toBe('');
  });

  it('should adjust and display menuLabelKeys', () => {
    // menuItems dict does not exist yet
    component.menuItems_dict = undefined as any;
    expect(component.menuLabelKeys).toEqual([]);

    // menuItems dict has values to get labels
    component.menuItems_dict = menuItemWithLabel;
    const expectedLabels = ['label1', 'label2'];
    component.ngOnChanges({ menuItems_dict: new SimpleChange(undefined, menuItemWithLabel, true) });
    expect(component.menuLabelKeys).toEqual(expectedLabels);
  });

  it('should test the isDisplayedLAbels switch to show labels or not', () => {
    component.menuItems_dict = menuItemWithLabel;
    const expectedLabels = ['label1', 'label2'];

    // not display labels by this.isDisplayedLabels
    component.isDisplayedLabels = false;
    component.ngOnChanges( {menuItems_dict: new SimpleChange('', '', false)} );
    expect(component.menuLabelKeys).toEqual([]);

    // display label again by by this.isDisplayedLabels
    component.isDisplayedLabels = true;
    component.ngOnChanges( {menuItems_dict: new SimpleChange('', '', false)} );
    expect(component.menuLabelKeys).toEqual(expectedLabels);
  });
});
