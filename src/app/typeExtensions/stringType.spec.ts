// TODO: stringType.ts extension is imported in test.ts

describe('StringType extension', () => {
    it('should be defined', () => {
        expect(''.toUpperCaseFirstChar).toBeDefined();
    });

    it('should get empty string, input is empty', () => {
        const text = '';
        expect(text.toUpperCaseFirstChar()).toBe('');
    });

    it('should convert one letter to upperCase', () => {
        expect('b'.toUpperCaseFirstChar()).toBe('B');
        expect('a'.toUpperCaseFirstChar()).toBe('A');
        expect('ab'.toUpperCaseFirstChar()).toBe('Ab');
        expect('aB'.toUpperCaseFirstChar()).toBe('AB');
    });

    it('should test on special character', () => {
        expect('@'.toUpperCaseFirstChar()).toBe('@');
        expect('#'.toUpperCaseFirstChar()).toBe('#');
        expect('&'.toUpperCaseFirstChar()).toBe('&');
        expect('_'.toUpperCaseFirstChar()).toBe('_');
        expect('-'.toUpperCaseFirstChar()).toBe('-');
    });

    it('should get uppercase first chart of the string', () => {
        const text = 'testString';
        const expected = 'TestString';
        expect(text.toUpperCaseFirstChar()).toBe(expected);
    });

    it('should check the other characters not changed instead of the first', () =>{
        const text = 'testString@';
        const changedText = text.toUpperCaseFirstChar();
        const expectedText = 'TestString@';
        
        for (let i = 0; i < changedText.length; i++) {
            expect(changedText[i]).toBe(expectedText[i]);
        }
    });
});