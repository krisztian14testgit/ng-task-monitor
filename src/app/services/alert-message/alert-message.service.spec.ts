import { fakeAsync, inject, TestBed } from '@angular/core/testing';
import { AlertType } from 'src/app/components/alert-window/alert.model';

import { AlertMessageService } from './alert-message.service';

describe('AlertMessageService', () => {
  let service: AlertMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AlertMessageService]
    });
    service = TestBed.inject(AlertMessageService);
  });

  it('should be created', inject([AlertMessageService], (service: AlertMessageService) => {
    expect(service).toBeTruthy();
  }));

  it('get message via stream', fakeAsync(() => {
    const expectedMessage = 'test';
    const expectedAlertType = AlertType.Error;
    service.getMessage().subscribe(([message, alertType]) => {
      expect(message).toBeDefined();
      expect(typeof message == 'string');
      expect(message.length).toBeGreaterThan(0);
      expect(message).toBe(expectedMessage);

      expect(alertType).toBeDefined();
      expect(alertType).toBe(expectedAlertType);
    });

    // sending messeage
    service.sendMessage(expectedMessage, expectedAlertType);
  }));

  it('Send empty message via stream', fakeAsync(() => {
    const expectedMessage = '';
    const expectedAlertType = AlertType.Error;
    service.getMessage().subscribe(([message, alertType]) => {
      expect(message).toBeDefined();
      expect(message).toBe(expectedMessage);

      expect(alertType).toBeDefined();
      expect(alertType).toBe(expectedAlertType);
    });

    // sending messeage when it's empty
    service.sendMessage(expectedMessage, expectedAlertType);
  }));

  it('Send different messages, alertType is undefined', fakeAsync(() => {
    const expectedMessage = '';
    const expectedAlertType = undefined;
    service.getMessage().subscribe(([message, alertType]) => {
      expect(message).toBeDefined();
      expect(message).toBe(expectedMessage);

      expect(alertType).toBeUndefined();
      expect(alertType).toBe(expectedAlertType);
    });

    // sending alertType when it is undefined
    service.sendMessage(expectedMessage);
  }));

  it('Send messages, alertType is Warning', fakeAsync(() => {
    const expectedMessage = '';
    const expectedAlertType = AlertType.Warning;
    service.getMessage().subscribe(([message, alertType]) => {
      expect(message).toBeDefined();
      expect(message).toBe(expectedMessage);

      expect(alertType).toBeDefined();
      expect(alertType).toBe(expectedAlertType);
    });

    // sending message tuple
    service.sendMessage(expectedMessage, expectedAlertType);
  }));

  it('Send messages, alertType is Success', fakeAsync(() => {
    const expectedMessage = '';
    const expectedAlertType = AlertType.Success;
    service.getMessage().subscribe(([message, alertType]) => {
      expect(message).toBeDefined();
      expect(message).toBe(expectedMessage);

      expect(alertType).toBeDefined();
      expect(alertType).toBe(expectedAlertType);
    });

     // sending message tuple
     service.sendMessage(expectedMessage, expectedAlertType);
  }));

  it('Send messages, alertType is Info', fakeAsync(() => {
    const expectedMessage = '';
    const expectedAlertType = AlertType.Info;
    service.getMessage().subscribe(([message, alertType]) => {
      expect(message).toBeDefined();
      expect(message).toBe(expectedMessage);

      expect(alertType).toBeDefined();
      expect(alertType).toBe(expectedAlertType);
    });

    // sending message tuple
    service.sendMessage(expectedMessage, expectedAlertType);
  }));

  it('Send messages, alertType is Error', fakeAsync(() => {
    const expectedMessage = 'err';
    const expectedAlertType = AlertType.Error;
    service.getMessage().subscribe(([message, alertType]) => {
      expect(message).toBeDefined();
      expect(message).toBe(expectedMessage);

      expect(alertType).toBeDefined();
      expect(alertType).toBe(expectedAlertType);
    });

    // sending message tuple
    service.sendMessage(expectedMessage, expectedAlertType);
  }));
});