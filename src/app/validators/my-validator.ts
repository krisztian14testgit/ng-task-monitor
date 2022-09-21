/* eslint-disable @typescript-eslint/no-namespace */
/**
 * This module includes the validation features under the 'MyValidator' namespsace.
 * It can comprise class, variables, functions, enum, interfaces.
 * @namespace
 */
export namespace MyValidator {
    /** 
     * Contains the default Validdation patter keys.
     * @memberof MyValidator
     */
    export enum PatternRuleKeys {
        /** library path regExp: C:/folder/sub-folder/ or folder/../*/
        LibraryPath,
        /** task name regExp: digits, abc, -, _ */
        TaskName,
        /** decimal regExp: only allow the digits and dot sign. */
        Number
    }
    
    /**
     * This class contains the regExpressions in its own rules array.
     * You can get the actual rule by getRule() method with PatternRuleKeys.
     * @memberof MyValidator
     */
    export class Patterns {
        private static _rules: string[] = [
            // library path regExp: C:/folder/sub-folder/ or folder/
            '([a-zA-Z0-9-_: ]+/{1})*$',
            // task name regExp: tt, Task1, task-22, task_01
            '[^-0-9]{1}[a-zA-Z0-9-_]+',
            // decimal regExp: only allow the digits and dot sign.
            '[0-9.]+'
        ];

        /**
         * Returns the actual regExp rule by PatternRuleKeys.
         * @returns string
         * @memberof MyValidator.Patterns
         */
        public static getRule(patterKey: PatternRuleKeys) {
            return this._rules[patterKey];
        }

        
    }

}