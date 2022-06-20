import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { AlertType } from 'src/app/components/alert-window/alert.model';

/**
 * It allows to multicast the message from one component to other
 * which is the observer and subscribing on the 'message' stream to get current alert messeage from the component.
 */
@Injectable()
export class AlertMessageService {

  /** The message subject emits the message text and alert type(Warning, Error, Info, Success). */
  private _message$ = new Subject<[string, AlertType | undefined]>();

  /**
   * Gets the emitted message from the other component. If the component subscribes on it.
   * @returns tuple: [alertMessage, AlertType]
   */
  public getMessage(): Observable<[string, AlertType | undefined]> {
    return this._message$.pipe(map(tuple => tuple));
  }

  /**
   * Sends the message via the service to notice another subscribed compoenents.
   * @param message The message will be sent fruther.
   * @param alertType The message type: Info, Error, Succes, Wanring via AlertType
   */
  public sendMessage(text: string, alertType?: AlertType): void {
    this._message$.next([text, alertType]);
  }
}
