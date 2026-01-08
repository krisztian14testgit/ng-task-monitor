import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import { AlertMessageService } from 'src/app/services/alert-message/alert-message.service';
import { AlertLabel, AlertOptions, AlertType } from './alert.model';

@Component({
    selector: 'app-alert-window',
    templateUrl: './alert-window.component.html',
    styleUrls: ['./alert-window.component.css'],
    standalone: false
})
export class AlertWindowComponent implements OnInit, OnChanges {
  /** Contains the given/adjusted alert message. */
  @Input() public alertMsg = '';
  /** 
   * Not closing automatically the alert window after 3 sec.
   * Default value is false. If it is true, alert window won't close itself.
   * 
   * Closed AlertTypes:
   * * Success
   * * Info
   */
  @Input() public notCloseAutomatically = false;
  /** It has name, color, type properties. */
  public alertLabel: AlertLabel;
  /** Alert message appears when it is true. */
  public isDisplayed: boolean;

  private readonly _options: AlertOptions;
  /** Stores the needle of the setTimeout. */
  private _timeoutRef!: NodeJS.Timeout;
  /** Stores type of the window. Default type is AlertyType.Info. */
  private _alertType: AlertType;
  /** Alert window closing secunds: 3sec  */
  private readonly _closeSec = 3000;

  constructor(private readonly alertMessageService: AlertMessageService) {
    this._options = {
      alertTypeFitlerWords: {
        'success-words': ['success', 'successful','done'],
        'error-words': ['failed', 'error'],
        'warning-words': ['warning', 'alert']
      },
      alertTypeColors: ['alert-info', 'alert-error', 'alert-success', 'alert-warning'],
      alertTypeLabels: ['Info', 'Error', 'Success', 'Warning'],
      defaultAlertType: AlertType.Info
    };

    this.alertLabel = new AlertLabel();
    this.setLabelBy(this._options.defaultAlertType);
    this.isDisplayed = false;
    this._alertType = AlertType.Info;
  }

  /** Subscription on the alertMessage service to get multicasted message from other component. */
  ngOnInit(): void {
    this.alertMessageService.getMessage()
    .subscribe(([message, alertType]) => {
      this.alertMsg = message;
      if (alertType) {
        this._alertType = alertType;
      } else {
        this._alertType = this.getAlertTypeFromMessage(this.alertMsg);
      }
      
      this.show();
      this.closeAutomatically(this._closeSec, [AlertType.Success, AlertType.Info]);
    });
  }

  /**
   * It runs when the alertMsg has been changed via @Input, alertWindow appears.
   * @param changes SimpleChanges
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['alertMsg'].previousValue !== this.alertMsg) {
      this._alertType = this.getAlertTypeFromMessage(this.alertMsg);
      this.show();
      this.closeAutomatically(this._closeSec, [AlertType.Success, AlertType.Info]);
    }
  }

  /**
   * Shows the Alert Window.
   * Setting up alert's label by the given alertMSG.
   * If the _alertType is adjusted the alert window skin changes.
   */
  public show(): void {
    this.setLabelBy(this._alertType);
    this.isDisplayed = true;
  }

  /**
   * This an event function.
   * It runs when the user click on the cross sign: (X)
   * Or If the window is success, info then it close automatically (setTimeout)
   * Alert window disappers/closed.
   */
  public onClose(): void {
    this.isDisplayed = false;
  }
  
  /** Sets the color, name, type of the label by the given alertType. */
  private setLabelBy(alertType: AlertType): void {
    this.alertLabel.color = this._options.alertTypeColors[alertType as number];
    this.alertLabel.name = this._options.alertTypeLabels[alertType as number];
    this.alertLabel.type = alertType;
  }

  /**
   * Closes Alert window after the given milli seconds.
   * 
   * @param closeSec this is milliseconds
   * @param closeTypes Contains those alert types when the Alert window have to close itself.
   * 
   * @Example
   * if closeTypes: [AlertType.Success, AlertType.Info] then
   * the type of alertLabel is the same the it will close automatically.
   */
  private closeAutomatically(closeSec: number, closeTypes: AlertType[]): void {
    // clear previous timeout process.
    clearTimeout(this._timeoutRef);
    if (!this.notCloseAutomatically && closeTypes.includes(this.alertLabel.type)) {
      this._timeoutRef = setTimeout(() => { this.onClose(); }, closeSec);
    }
    
  }

  /**
   * Returns AlertType enum from the given the alertKey.
   * 
   * @description
   * alertKey -> AlertType:
   * * success-words -> AlertType.Success
   * * warning-words -> AlertType.Warning
   * * error-words   -> AlertType.Error
   * @param alertKey It can be diff keys from the this.options.'alertTypeSubWords'.
   * @returns enum: number
   */
  private getAlertTypeFrom(alertKey: string): AlertType {
    const dashIndex = alertKey.indexOf('-');
    const key = alertKey.substring(0, dashIndex);
    // first letter to be upperCase
    const enumKey = key.toUpperCaseFirstChar();
    
    // return enum form the string key value
    return AlertType[enumKey as keyof typeof AlertType];
  }

  /**
   * Returns the suitable AlertType by the alert message what is contained.
   * 
   * @description
   * If the alert message contains the 'succes' or 'done' then AlertType will be Success.
   * If the alert message contauns the 'wrong, error' then AlertType will be Error.
   * 
   * @defaultValue
   * Returns the default: AlertType.Info if the messaga does not contains the filter key words.
   * @param alertMsg The adjusted alert message.
   * @returns enum: number
   */
  private getAlertTypeFromMessage(alertMsg: string): AlertType {
    alertMsg = alertMsg.toLowerCase();
    const alertTypeArray = Object.keys(this._options.alertTypeFitlerWords);
    
    // alertType can be: success-words, error-words and so on.
    for (const alertType of alertTypeArray) {
      // wordKey: ['success', 'done'] from 'success-words' key
      const wordKeys = this._options.alertTypeFitlerWords[alertType];

      for (const key of wordKeys ) {
        if (alertMsg.includes(key)) {
          return this.getAlertTypeFrom(alertType);
        }
      }
    }

    // return default AlertType if alertTypeSubWords does NOT contains the key-words.
    return this._options.defaultAlertType;
  }

}
