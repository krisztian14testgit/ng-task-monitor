/**
 * Helping the extend primitve types with your functions:
 * https://codepunk.io/extending-strings-and-other-data-types-in-typescript/
 */

/** Tested and works, deep copy object, its own sub-objects. */
/*
const deepCopyComplexType_rec = function<T>(property: T): T {
    const copiedObj = Object.assign({}, property) as any;
    const props = Object.getOwnPropertyNames(copiedObj);
    
    // Checking obj property in the given property.
    for (const p of props) {
        if (typeof copiedObj[p] === 'object') {
            console.log('deepCopyCalled');
            copiedObj[p] = deepCopyComplexType_rec(copiedObj[p]);
        }
    }
    
    // exit condition, there is no more object type.
    return copiedObj;
};*/

interface Array<T> {
    /**
     * Deep copies the object/instance elements of the array.
     * That means if you changed property values of object, the original won't changed.
     * @exception
     * If the proprties value contains complex/reference types, it only copy the pointer of the object.
     * If copied complex's value changed then the original will be changed.
     * @example
     * const obj = {
     *  name: 'name1',  // copied
     *  size: 10,       // copied
     *  dog: { ... }    // copied only the reference
     * }
     * 
     * @return copied Items in same type array.
     */
    deepCopyObjects: () => T[];
}

Array.prototype.deepCopyObjects = function<T>(): T[] {
    const retArray: T[] = [];
    let copiedItem: T;

    if (this && this.length > 0) {
        for (const item of this) {
            if (item instanceof Object) {
                copiedItem = Object.assign({}, item);
            } else {
                // primitive types: (string, number, boolean)
                copiedItem = item;
            }
            retArray.push(copiedItem);
        }
    }

    return retArray;
};
