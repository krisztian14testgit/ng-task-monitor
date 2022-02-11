import { HttpHeaders } from "@angular/common/http";

/**
 * Contains the defualt service options and httpHeader settings
 * 
 * @description Headers tutorial:
 * https://www.tutorialspoint.com/http/http_header_fields.htm
 * 
 */
export default class ServiceBase {
    private static readonly _httpHeaders = new HttpHeaders({
        'Cache-control': 'no-cache',
        'Content-type': 'application/json; charset="UTF-8',
        'Content-lenght': '348',
        'Authorization': ''
    });

    private constructor() {}

    /** 
     * Returns the copied httpHeaders default settings.
     * @returns object
     */
    public static get HttpHeaders() {
        // deep copy
        return {...this._httpHeaders};
    }
}