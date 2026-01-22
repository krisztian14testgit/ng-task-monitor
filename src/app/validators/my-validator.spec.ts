import { FormControl, FormGroup, Validators } from "@angular/forms";
import { FormValidator } from "./my-validator";

describe('FormValidator - regExp Pattern', () => {
    let formGroup: FormGroup;
    let libarryPathControl: FormControl;
    let taskNameControl: FormControl;

    // validation the defined regular expressesion: library-path, task name
    beforeEach(() => {
        formGroup = new FormGroup({
            libraryPath: new FormControl('', [
                Validators.required,
                Validators.pattern(FormValidator.RegExpPatterns.getRule(FormValidator.RegExpKeys.LibraryPath))
            ]),
            taskName: new FormControl('', [
                Validators.required,
                Validators.pattern(FormValidator.RegExpPatterns.getRule(FormValidator.RegExpKeys.TaskName))
            ])
        });

        libarryPathControl = formGroup.get('libraryPath') as FormControl;
        taskNameControl = formGroup.get('taskName') as FormControl;
    });

    it('should initialize the libraryPath', () => {
        const expectedValue = '';
        expect(libarryPathControl).toBeDefined();
        expect(libarryPathControl.value).toBe(expectedValue);
        
        libarryPathControl.updateValueAndValidity();
        expect(libarryPathControl.valid).toBeFalse();
    });

    it('should validate the libraryPath regExp to be True', () => {
        let fineVAlue = 'C:/';
        libarryPathControl.setValue(fineVAlue);
        libarryPathControl.updateValueAndValidity();
        expect(libarryPathControl.value).toBe(fineVAlue);
        expect(libarryPathControl.valid).toBeTrue();

        fineVAlue = 'B:/';
        libarryPathControl.setValue(fineVAlue);
        libarryPathControl.updateValueAndValidity();
        expect(libarryPathControl.value).toBe(fineVAlue);
        expect(libarryPathControl.valid).toBeTrue();

        fineVAlue = 'Z:/';
        libarryPathControl.setValue(fineVAlue);
        libarryPathControl.updateValueAndValidity();
        expect(libarryPathControl.value).toBe(fineVAlue);
        expect(libarryPathControl.valid).toBeTrue();

        fineVAlue = 'C:/folder/';
        libarryPathControl.setValue(fineVAlue);
        libarryPathControl.updateValueAndValidity();
        expect(libarryPathControl.value).toBe(fineVAlue);
        expect(libarryPathControl.valid).toBeTrue();

        fineVAlue = 'C:/folder/sub-folder/';
        libarryPathControl.setValue(fineVAlue);
        libarryPathControl.updateValueAndValidity();
        expect(libarryPathControl.value).toBe(fineVAlue);
        expect(libarryPathControl.valid).toBeTrue();

        fineVAlue = 'C:/folder/sub-folder/folder/';
        libarryPathControl.setValue(fineVAlue);
        libarryPathControl.updateValueAndValidity();
        expect(libarryPathControl.value).toBe(fineVAlue);
        expect(libarryPathControl.valid).toBeTrue();
    });

    it('should invalid the libraryPath regExp to be False', () => {
        // the expected value contains wrong string
        let wrongValue = 'a';
        libarryPathControl.setValue(wrongValue);
        libarryPathControl.updateValueAndValidity();
        expect(libarryPathControl.value).toBe(wrongValue);
        expect(libarryPathControl.valid).toBeFalse();

        wrongValue = 'c';
        libarryPathControl.setValue(wrongValue);
        libarryPathControl.updateValueAndValidity();
        expect(libarryPathControl.value).toBe(wrongValue);
        expect(libarryPathControl.valid).toBeFalse();

        wrongValue = 'c:';
        libarryPathControl.setValue(wrongValue);
        libarryPathControl.updateValueAndValidity();
        expect(libarryPathControl.value).toBe(wrongValue);
        expect(libarryPathControl.valid).toBeFalse();
        
        wrongValue = 'c:/';
        libarryPathControl.setValue(wrongValue);
        libarryPathControl.updateValueAndValidity();
        expect(libarryPathControl.value).toBe(wrongValue);
        expect(libarryPathControl.valid).toBeTrue();

        wrongValue = 'C://';
        libarryPathControl.setValue(wrongValue);
        libarryPathControl.updateValueAndValidity();
        expect(libarryPathControl.value).toBe(wrongValue);
        expect(libarryPathControl.valid).toBeFalse();

        wrongValue = 'C://a';
        libarryPathControl.setValue(wrongValue);
        libarryPathControl.updateValueAndValidity();
        expect(libarryPathControl.value).toBe(wrongValue);
        expect(libarryPathControl.valid).toBeFalse();

        wrongValue = 'C:///';
        libarryPathControl.setValue(wrongValue);
        libarryPathControl.updateValueAndValidity();
        expect(libarryPathControl.value).toBe(wrongValue);
        expect(libarryPathControl.valid).toBeFalse();

        wrongValue = 'C:/folder';
        libarryPathControl.setValue(wrongValue);
        libarryPathControl.updateValueAndValidity();
        expect(libarryPathControl.value).toBe(wrongValue);
        expect(libarryPathControl.valid).toBeFalse();

        wrongValue = 'C:/folder//';
        libarryPathControl.setValue(wrongValue);
        libarryPathControl.updateValueAndValidity();
        expect(libarryPathControl.value).toBe(wrongValue);
        expect(libarryPathControl.valid).toBeFalse();

        wrongValue = 'C:/folder/.../folder';
        libarryPathControl.setValue(wrongValue);
        libarryPathControl.updateValueAndValidity();
        expect(libarryPathControl.value).toBe(wrongValue);
        expect(libarryPathControl.valid).toBeFalse();

        wrongValue = 'C:/folder/sub-folder/..';
        libarryPathControl.setValue(wrongValue);
        libarryPathControl.updateValueAndValidity();
        expect(libarryPathControl.value).toBe(wrongValue);
        expect(libarryPathControl.valid).toBeFalse();

        wrongValue = 'C:/folder/sub-folder/.../';
        libarryPathControl.setValue(wrongValue);
        libarryPathControl.updateValueAndValidity();
        expect(libarryPathControl.value).toBe(wrongValue);
        expect(libarryPathControl.valid).toBeFalse();
    });

    it('should initialize the taskName', () => {
        const expectedValue = '';
        expect(taskNameControl).toBeDefined();
        expect(taskNameControl.value).toBe(expectedValue);
        
        taskNameControl.updateValueAndValidity();
        expect(taskNameControl.valid).toBeFalse();
    });

    it('should validate the taskName regExp to be True', () => {
        let fineValue = 'tt'; 
        taskNameControl.setValue(fineValue);
        taskNameControl.updateValueAndValidity();
        expect(taskNameControl.value).toBe(fineValue);
        expect(taskNameControl.valid).toBeTrue();

        fineValue = '_task1';
        taskNameControl.setValue(fineValue);
        taskNameControl.updateValueAndValidity();
        expect(taskNameControl.value).toBe(fineValue);
        expect(taskNameControl.valid).toBeTrue();

        fineValue = 'task1';
        taskNameControl.setValue(fineValue);
        taskNameControl.updateValueAndValidity();
        expect(taskNameControl.value).toBe(fineValue);
        expect(taskNameControl.valid).toBeTrue();

        fineValue = 'task-1';
        taskNameControl.setValue(fineValue);
        taskNameControl.updateValueAndValidity();
        expect(taskNameControl.value).toBe(fineValue);
        expect(taskNameControl.valid).toBeTrue();

        fineValue = 'task_1';
        taskNameControl.setValue(fineValue);
        taskNameControl.updateValueAndValidity();
        expect(taskNameControl.value).toBe(fineValue);
        expect(taskNameControl.valid).toBeTrue();

        fineValue = 'task-01';
        taskNameControl.setValue(fineValue);
        taskNameControl.updateValueAndValidity();
        expect(taskNameControl.value).toBe(fineValue);
        expect(taskNameControl.valid).toBeTrue();

        fineValue = 'task-1-';
        taskNameControl.setValue(fineValue);
        taskNameControl.updateValueAndValidity();
        expect(taskNameControl.value).toBe(fineValue);
        expect(taskNameControl.valid).toBeTrue();

        fineValue = 'task-1-_';
        taskNameControl.setValue(fineValue);
        taskNameControl.updateValueAndValidity();
        expect(taskNameControl.value).toBe(fineValue);
        expect(taskNameControl.valid).toBeTrue();
    });

    it('should validate the taskName regExp to be False', () => {
        let wrongValue = '0t';
        taskNameControl.setValue(wrongValue);
        taskNameControl.updateValueAndValidity();
        expect(taskNameControl.value).toBe(wrongValue);
        expect(taskNameControl.valid).toBeFalse();

        wrongValue = '1t';
        taskNameControl.setValue(wrongValue);
        taskNameControl.updateValueAndValidity();
        expect(taskNameControl.value).toBe(wrongValue);
        expect(taskNameControl.valid).toBeFalse();

        wrongValue = '-1t';
        taskNameControl.setValue(wrongValue);
        taskNameControl.updateValueAndValidity();
        expect(taskNameControl.value).toBe(wrongValue);
        expect(taskNameControl.valid).toBeFalse();
        
        wrongValue = 't k';
        taskNameControl.setValue(wrongValue);
        taskNameControl.updateValueAndValidity();
        expect(taskNameControl.value).toBe(wrongValue);
        expect(taskNameControl.valid).toBeFalse();

        wrongValue = '- k';
        taskNameControl.setValue(wrongValue);
        taskNameControl.updateValueAndValidity();
        expect(taskNameControl.value).toBe(wrongValue);
        expect(taskNameControl.valid).toBeFalse();

        wrongValue = 'k'; // no contains one char
        taskNameControl.setValue(wrongValue);
        taskNameControl.updateValueAndValidity();
        expect(taskNameControl.value).toBe(wrongValue);
        expect(taskNameControl.valid).toBeFalse();
    });
});
