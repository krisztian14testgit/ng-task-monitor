/**
 * This module includes the validation features under the 'FormValidator' namespsace.
 * It can comprise class, variables, functions, enum, interfaces.
 * @namespace
 */
export namespace FormValidator {
    /** 
     * Contains the default Validdation patter keys.
     * @memberof FormValidator
     */
    export enum RegExpKeys {
        /** library path regExp: C:/folder/sub-folder/ */
        LibraryPath,
        /** task name regExp: digits, abc, -, _ */
        TaskName,
        /** decimal regExp: only allow the digits and dot sign. */
        Number
    }
    
    /**
     * This class contains the regExpressions in its own rules array.
     * You can get the actual rule by getRule() method with PatternRuleKeys.
     * @memberof FormValidator
     */
    export class RegExpPatterns {
        private static _rules: string[] = [
            // library path regExp: C:/folder/sub-folder/
            '[A-Z]?:/{1}([a-zA-Z0-9-_ ]+/{1})*$',
            // task name regExp: tt, Task1, task-22, task_01
            '[^-0-9]{1}[a-zA-Z0-9-_]+',
            // decimal regExp: only allow the digits and dot sign.
            '[0-9.]+'
        ];

        /**
         * Returns the actual regExp rule by RegExpKeys.
         * @returns string
         * @memberof FormValidator.RegExpPatterns
         */
        public static getRule(patterKey: RegExpKeys) {
            return this._rules[patterKey];
        }

        
    }

}
