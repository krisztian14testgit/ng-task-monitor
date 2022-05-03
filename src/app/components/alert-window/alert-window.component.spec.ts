import { SimpleChange } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AlertMessageService } from 'src/app/services/alert-message/alert-message.service';

import { AlertWindowComponent } from './alert-window.component';
import { AlertType } from './alert.model';

describe('AlertWindowComponent', () => {
  let component: AlertWindowComponent;
  let fixture: ComponentFixture<AlertWindowComponent>;
  let alertMsgService: AlertMessageService;

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

    alertMsgService = TestBed.inject(AlertMessageService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    
    // default values of alertLabel, test: setLabelBy
    expect(component.alertLabel.color).toBe('alert-blue');
    expect(component.alertLabel.name).toBe('Info');
    expect(component.alertLabel.type).toBe(AlertType.Info);
    expect(component.isDisplayed).toBeFalse();
  });

  it('should show the alert window with different alert types, texts', () => {
    const colorAlerTypes = component['_options'].alertTypeColors;
    const textArray = [
      'The basic text without keywords.', // info - blue
      'The process was failed.', // error - red
      'The process was success.', // success - green
      'The warning text.' // warning - yellow
    ];
    const strongTagValues = component['_options'].alertTypeLabels;
    
    let alertWin, strongTag = undefined;
    for (let i =0, k = colorAlerTypes.length; i < k; i++) {
      component['_alertType'] = component['getAlertTypeFromMessage'](textArray[i]);
      component.show();
      fixture.detectChanges();

      // get references from DOM
      alertWin = fixture.debugElement.query(By.css('.alert-window'));
      strongTag = fixture.debugElement.nativeElement.querySelector('strong');

      expect(component.isDisplayed).toBeTrue();
      // console.log('alert class =>', alertWin.classes);
      expect(alertWin.classes[colorAlerTypes[i]]).toBeTrue();
      expect(strongTag.innerText).toBe(`${strongTagValues[i]}:`);
    }
  });

  it('should disappear the alert window', () => {
    // displayed 
    component.show();
    fixture.detectChanges();
    let alertWin = fixture.debugElement.query(By.css('.alert-window'));
    expect(alertWin.name).toBeDefined();
    expect(component.isDisplayed).toBeTrue();

    // hide alert win
    component.onClose();
    fixture.detectChanges();
    alertWin = fixture.debugElement.query(By.css('.alert-window'));
    expect(alertWin).toBeNull();
    expect(component.isDisplayed).toBeFalse();
  });

  // fakeAsync used the timer faking for setTimemout
  it('should close window automatically, setTimeout test', fakeAsync(() => {
    spyOn(component as any, 'closeAutomatically').and.callThrough();
    spyOn(component, 'onClose').and.callThrough();
    // displayed after close
    component.alertMsg = 'Automatic close was successful!';
    component.ngOnChanges({'alertMsg': new SimpleChange('', component.alertMsg, true)});
    fixture.detectChanges();

    // get window from DOM
    let alertWin = fixture.debugElement.query(By.css('.alert-window'));
    expect(alertWin).not.toBeNull();
    expect(component.isDisplayed).toBeTrue();
    expect(component['closeAutomatically']).toHaveBeenCalled();
    tick(3000);

    // window is closed after 3 sec
    fixture.detectChanges();
    alertWin = fixture.debugElement.query(By.css('.alert-window'));
    expect(alertWin).toBeNull();
    expect(component.onClose).toHaveBeenCalled();
    expect(component.isDisplayed).toBeFalse();
    flush();
  }));

  it('should get alertType from the message', () => {
    const textArray = [
      'The basic text without keywords.', // info - blue
      'The process was failed.', // error - red
      'The process was success.', // success - green
      'The warning text.' // warning - yellow
    ];
    const expectedAlertType = [AlertType.Info, AlertType.Error, AlertType.Success, AlertType.Warning];

    for (let i = 0; i < textArray.length; i++) {
      expect(component['getAlertTypeFromMessage'](textArray[i])).toBe(expectedAlertType[i]);
    }
  });

  it('should test to get message from the service, alertMsgService', () => {
    spyOn(component, 'show').and.callThrough();

    // initial values
    expect(component.alertMsg).toBe('');
    expect(component['_alertType']).toBe(AlertType.Info);
    // subscribe on the alertService by ngOnInit
    component.ngOnInit();

    // emits error text
    let text = 'Error text';
    alertMsgService.sendMessage(text);
    expect(component.alertMsg).toBe(text);
    expect(component['_alertType']).toBe(AlertType.Error);
    expect(component.show).toHaveBeenCalled();

    // emits error text
    text = 'just an origin text with yellow';
    alertMsgService.sendMessage(text, AlertType.Warning);
    expect(component.alertMsg).toBe(text);
    expect(component['_alertType']).toBe(AlertType.Warning);
    expect(component.show).toHaveBeenCalled();
  });
});
