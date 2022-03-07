/* eslint-disable @typescript-eslint/no-namespace */
/**
 * This module includes the validation features under the 'MyValidator' namespsace.
 * It can comprise class, variables, functions, enum, interfaces.
 */
export namespace MyValidator {
    /** 
     * Contains the default Validdation patter keys.
     * @memberof MyValidator
     */
    export enum PatternRuleKeys {
        LibraryPath,
        TaskName
    }
    
    /**
     * This class contains the regExpressions in its own rules array.
     * You can get the actual rule by getRule() method with PatternRuleKeys.
     * @memberof MyValidator
     */
    export class Patterns {
        private static _rules: string[] = [
            // library path regExp
            '[A-Z]?:/{1}([a-zA-Z0-9-_ ]+/{1})*$',
            // task name regExp
            '[a-zA-Z0-9-_]+'
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