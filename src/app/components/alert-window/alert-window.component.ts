import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AlertLabel, AlertOptions, AlertType } from './alert.model';

@Component({
  selector: 'app-alert-window',
  templateUrl: './alert-window.component.html',
  styleUrls: ['./alert-window.component.css']
})
export class AlertWindowComponent implements OnInit, OnChanges {
  /** Contains the given/adjusted alert message. */
  @Input() public alertMsg = '';

  public alertLabel: AlertLabel;
  public isDisplayed: boolean;

  private readonly options: AlertOptions;
  private timeoutRef!: any;

  constructor() {
    this.options = {
      alertTypeFitlerWords: {
        'success-words': ['success', 'done'],
        'error-words': ['failed'],
        'warning-words': ['warning', 'alert']
      },
      alertTypeColors: ['alert-blue', 'alert-red', 'alert-green', 'alert-yellow'],
      alertTypeLabels: ['Info', 'Error', 'Success', 'Warning'],
      defaultAlertType: AlertType.Info
    };

    this.alertLabel = new AlertLabel();
    this.setLabelBy(this.options.defaultAlertType);
    this.isDisplayed = false;
  }

  ngOnInit(): void {
  }

  /**
   * It runs when the alertMsg has been changed, alertWindow appears.
   * @param changes SimpleChanges
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['alertMsg'].previousValue !== this.alertMsg) {
      const alertType = this.getAlertTypeFromMessage(this.alertMsg);
      this.setLabelBy(alertType);
      this.show();

      const closeSec = 3000; // 3 sec
      this.closeAutomatically(closeSec, [AlertType.Success, AlertType.Info]);
    }
  }

  /**
   * Shows the Alert Window
   */
  public show(): void {
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
  
  private setLabelBy(alertType: AlertType): void {
    this.alertLabel.color = this.options.alertTypeColors[alertType as number];
    this.alertLabel.name = this.options.alertTypeLabels[alertType as number];
    this.alertLabel.type = alertType;
  }

  /**
   * Closes Alert window after the given sec.
   * 
   * @param closeSec this is milliseconds
   * @param closeTypes Contains those alert types when the Alert window have to close itself.
   * 
   * @Example
   * if closeTypes: [AlertType.Success, AlertType.Info] then type of alertLabel is the same the it will close automatically.
   */
  private closeAutomatically(closeSec: number, closeTypes: AlertType[]): void {
    // clear previous timeout process.
    clearTimeout(this.timeoutRef);
    if (closeTypes.includes(this.alertLabel.type)) {
      this.timeoutRef = setTimeout(() => { this.onClose(); }, closeSec);
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
    const firstLetter = key[0].toUpperCase();
    const skipFirstLetterIndex = 1;
    const enumKey = firstLetter + key.substring(skipFirstLetterIndex);
    
    // return enum form the string key value
    return AlertType[enumKey as keyof typeof AlertType];
  }

  /**
   * Returns the suitable AlertType by the alert message what is contained.
   * 
   * @description
   * If the alert message contains the 'succes' or 'done' then AlertType will be Success
   * If the alert message contauns the 'wrong, error' then AlertType will be Error.
   * 
   * @defaultValue
   * Returns the default: AlertType.Info if the messaga does not contains the filter key words
   * @param alertMsg The adjusted alert message.
   * @returns enum: number
   */
  private getAlertTypeFromMessage(alertMsg: string): AlertType {
    const alertTypeArray = Object.keys(this.options.alertTypeFitlerWords);
    
    // alertType can be: success-words, error-words and so on.
    for (const alertType of alertTypeArray) {
      // wordKey: ['success', 'done'] from 'success-words' key
      const wordKeys = this.options.alertTypeFitlerWords[alertType];

      for (const key of wordKeys ) {
        if (alertMsg.includes(key)) {
          return this.getAlertTypeFrom(alertType);
        }
      }
    }

    // return default AlertType if alertTypeSubWords does NOT contains the key-words.
    return this.options.defaultAlertType;
  }

}
