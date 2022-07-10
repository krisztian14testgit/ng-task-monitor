import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StyleThemeComponent } from './style-theme.component';

describe('StyleThemeComponent', () => {
  let component: StyleThemeComponent;
  let fixture: ComponentFixture<StyleThemeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StyleThemeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StyleThemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
