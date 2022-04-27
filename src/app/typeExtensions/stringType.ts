/**
 * Helping the extend primitve types with your functions:
 * https://codepunk.io/extending-strings-and-other-data-types-in-typescript/
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface String {
    /** Converts the first character to upper case. */
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


