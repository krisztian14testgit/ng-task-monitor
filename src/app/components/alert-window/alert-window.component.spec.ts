import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertMessageService } from 'src/app/services/alert-message/alert-message.service';

import { AlertWindowComponent } from './alert-window.component';

describe('AlertWindowComponent', () => {
  let component: AlertWindowComponent;
  let fixture: ComponentFixture<AlertWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlertWindowComponent ],
      providers: [
        {provide: AlertMessageService}
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
