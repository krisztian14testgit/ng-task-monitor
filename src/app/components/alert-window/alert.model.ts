/**
 * Includes what kind of Alert window is available.
 * 
 * Types:
 * * Info window: blue
 * * Error window: red
 * * Success window: green
 * * Warning window: yellow
 */
export enum AlertType {
    Info,
    Error,
    Success,
    Warning
}

/** The condition of the AlertLable class. */
export class AlertLabel {
    color = '';
    name = '';
    /** The default value is AlertType.Info, blue schema. */
    type = AlertType.Info;
}

/**
 * Contaisn the properties of teh AlertOptions which you can modify the style, color of the alert window.
 */
export class AlertOptions {
    /** 
     * The key-value pairs of the that key-words which alert message can contains.
     * If given sub-words are included in text then the window skin become those color
     * which you set in the 'alertTypeColors' property.
     */
    alertTypeFitlerWords: {[prop: string]: string[]} = {};
    /**
     * The skins of the alert window. 
     * The order is important in array by the index of the AlertType enum.
     * 
     * For example:
     * * (0. index) => Info color
     * * (1. index) => Error color
     * * (2. index) => Success color
     * * (3. index) => Warning color
     */
    alertTypeColors: string[] = [];
    /**
     * The Label of the alert window. 
     * The order is important in array by the index of the AlertType enum.
     * 
     * For example:
     * * (0. index) => Info label, alias name
     * * (1. index) => Error label, alias name
     * * (2. index) => Success label, alias name
     * * (3. index) => Warning label, alias name
     */
    alertTypeLabels: string[] = [];
    /** Default type of the Alert window: Info */
    defaultAlertType = AlertType.Info;
}
