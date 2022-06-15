// Info: Info: stringType.ts extension is imported in test.ts
class AddressType {

    constructor(public address: string = '',
                public zipcode: number = 0) {}
}

describe('ArrayType extension', () => {
    let originItems: {name: string, size: number, addr: AddressType}[];
    let copiedItems: object[];

    beforeAll(() => {
        originItems = [
            { name: 'name1', size: 0, addr: new AddressType('faked street 21.', 3333) },
            { name: 'name2', size: 23, addr: new AddressType('faked street 41.', 1010) }
        ];
    });

    it('should be defined', () => {
        expect([].deepCopyObjects).toBeDefined();
    });

    it('should get empty array if array is empty', () => {
        expect([].deepCopyObjects()).toEqual([]);
    });

    it('should get the copied version of originItems', () => {
        copiedItems = originItems.deepCopyObjects();
        expect(copiedItems).toBeDefined();
        expect(copiedItems.length).toBe(originItems.length);

        const props = Object.getOwnPropertyNames(originItems[0]);
        for (let i = 0; i < copiedItems.length; i++) {
            expect(copiedItems[i]).toEqual(originItems[i]);
            // check field values
            for (const propName of props) {
                expect((copiedItems[i] as any)[propName]).toEqual((originItems[i] as any)[propName]);
            }
        }
    });

    it('should change copiedItem fields, original does not change', () => {
        copiedItems = originItems.deepCopyObjects();
        type TestType = {name: string, size: number, addr: AddressType};
        const firstItem = copiedItems[0] as TestType;
        firstItem.name = 'changed';
        firstItem.size = 1111;

        // first items values are differenct.
        expect(firstItem.name).not.toBe(originItems[0].name);
        expect(firstItem.size).not.toBe(originItems[0].size);
        expect(firstItem.addr).toEqual(originItems[0].addr);

        // second items value sare same.
        const secondItem = copiedItems[1] as any;
        expect(secondItem.name).toBe(originItems[1].name);
        expect(secondItem.size).toBe(originItems[1].size);
        expect(secondItem.addr).toEqual(originItems[1].addr);
    });

    it('should NOT work deep copy on complex/reference types like AddressType', () => {
        // If you change the field values of the AddressType after deepCopy the original will be changed.
        copiedItems = originItems.deepCopyObjects();
        type ObjType = {name: string, size: number, addr: AddressType};
        const firstItem = copiedItems[0] as ObjType;
        expect(firstItem.addr).toEqual(originItems[0].addr);

        // Modify the values of addr object
        firstItem.addr.address = 'changed';
        firstItem.addr.zipcode = 9999;

        // only just cppied the reference of the addr object, solution deep recursively
        expect(firstItem.addr).toEqual(originItems[0].addr);
        expect(originItems[0].addr.address).toBe(firstItem.addr.address);
        expect(originItems[0].addr.zipcode).toBe(firstItem.addr.zipcode);

    });
    
    it('should copied items of list if they are primitive types', () => {
        // testing on: number, boolean, string, undefined, null
        const originTuple = ['', 'string', 0, 12.3, true, null, undefined];
        const copiedTuple = originTuple.deepCopyObjects();

        for (let i = 0; i < originTuple.length; i++) {
            expect(copiedTuple[i]).toBe(originTuple[i]);
        }
    });

    // TODO: not implemented yet, not too effectively
    xit('should check deepCopyComplexType reccursively', () => {
        const origin = {name: 'alma', size: 0, obj1: {name: 'alma2', size: 12, obj2: {name: 'alma3', size: 32}}};
        const copied = deepCopyComplexType_rec(origin);
        
        copied.obj1.name = 'CHANGED';
        copied.obj1.obj2.name = 'CHANGED2';
        expect(copied.obj1.name).not.toBe(origin.obj1.name);
        expect(copied.obj1.obj2.name).not.toBe(origin.obj1.obj2.name);
    });

});
