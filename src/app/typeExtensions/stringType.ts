/**
 * Helping the extend primitve types with your functions:
 * https://codepunk.io/extending-strings-and-other-data-types-in-typescript/
 */

interface String {
    /** 
     * Returns new string where the first character is converted to upper case.
     * The rest are not changed.
     */
    toUpperCaseFirstChar: () => string;
}

String.prototype.toUpperCaseFirstChar = function(): string {
    if (this.length > 0) {
        let firstChar = this[0];
        firstChar = firstChar.toUpperCase();
        return firstChar + this.substring(1, this.length);
    }
    
    return '';
};


