/**
 * Represents the those path property which are available.
 * It helps for the location.service to store the diff path into the diff properties.
 */
export class LocationSetting {
    appSettingPath!: string;
    taskPath!: string;
}

/**
 * Adjustable paths of the Location stuctucre.
 * It can help for setting the pathType
 */
export enum LocationPath {
    AppSettingPath,
    TaskPath
}
