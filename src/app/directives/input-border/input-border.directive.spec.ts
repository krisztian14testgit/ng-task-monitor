import { Component, DebugElement, input } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { InputBorderDirective } from './input-border.directive';

@Component({
    template: `
    <input dirInputBorder [isValid]="isValid"
      id="test-input" type="text" class="input-control"/>
  `,
    standalone: false
})
class HostTestComponent {
  // signal input to test directive easily
  isValid = input(false);
}

describe('InputBorderDirective', () => {
  let fixture: ComponentFixture<HostTestComponent>;
  let directive: InputBorderDirective;
  let inputTag: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputBorderDirective],
      declarations: [HostTestComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(HostTestComponent);
    fixture.detectChanges();

    // get directive instance via debugElement
    inputTag = fixture.debugElement.query(By.css('#test-input'));
    directive = inputTag.injector.get(InputBorderDirective);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should find the class by findKey', () => {
    // when it is empty
    let classes: string[] = [];
    let findKey = 'myClass';
    let expectedIndex = -1;
    
    let foundIndex = directive['findCurrentClassBy'](classes, findKey);
    expect(foundIndex).toBe(expectedIndex);

    // when classes is not empty, not find class by findKey
    classes = ['input-control', 'other-class'];
    foundIndex = directive['findCurrentClassBy'](classes, findKey);
    expect(foundIndex).toBe(expectedIndex);

    // when find is empty, not find class
    findKey = '';
    foundIndex = directive['findCurrentClassBy'](classes, findKey);
    expect(foundIndex).toBe(expectedIndex);

    // when class found class
    classes = ['input-control', 'other-class', 'myClass'];
    findKey = 'myClass';
    expectedIndex = 2;
    foundIndex = directive['findCurrentClassBy'](classes, findKey);
    expect(foundIndex).toBe(expectedIndex);

    // when get found class, classes order is changed.
    classes = ['input-control', 'myClass', 'other-class'];
    expectedIndex = 1;
    foundIndex = directive['findCurrentClassBy'](classes, findKey);
    expect(foundIndex).toBe(expectedIndex);
  });

  it('should add/remove the input-valid or input-invalid class from inputTag', () => {
    // add input-valid class
    let className = 'input-valid';
    inputTag.nativeElement.className += ' ' + className;
    directive['_refInput'] = inputTag.nativeElement;
    expect(directive['_refInput'].className.includes(className)).toBeTrue();

    // remove input-valid class by clearPreviousBorderClass
    directive['clearPreviousBorderClass']();
    expect(directive['_refInput'].className.includes(className)).toBeFalse();

    // add input-invalid class
    className = 'input-invalid';
    inputTag.nativeElement.className += ' ' + className;
    directive['_refInput'] = inputTag.nativeElement;
    expect(directive['_refInput'].className.includes(className)).toBeTrue();

    // remove input-invalid class by clearPreviousBorderClass
    directive['clearPreviousBorderClass']();
    expect(directive['_refInput'].className.includes(className)).toBeFalse();

    // add random class with 'input' keyword
    className = 'input-random';
    inputTag.nativeElement.className += ' ' + className;
    directive['_refInput'] = inputTag.nativeElement;
    expect(directive['_refInput'].className.includes(className)).toBeTrue();

    // remove random class by clearPreviousBorderClass
    directive['clearPreviousBorderClass']();
    expect(directive['_refInput'].className.includes(className)).toBeFalse();
  });

  it('should not call clearPreviousBorderClass, if input className is empy!', () => {
    spyOn(directive as any, 'findCurrentClassBy').and.callThrough();
    
    inputTag.nativeElement.className = '';
    directive['_refInput'] = inputTag.nativeElement;
    directive['clearPreviousBorderClass']();
    expect(directive['findCurrentClassBy']).not.toHaveBeenCalled();
  });

  it('should apply input classes(valid) if the directive isValid is true', fakeAsync(() => {
    directive['_refInput'] = inputTag.nativeElement;
    // apply the input-valid
    fixture.componentRef.setInput('isValid', true);
    fixture.detectChanges();
    tick(100);
    expect(directive['_refInput']).toBeDefined();
    expect(directive['_refInput'].className.includes('input-valid')).toBeTrue();
  }));

  xit('should apply input classes(invalid) if the directive isValid is false', fakeAsync(() => {
    directive['_refInput'] = inputTag.nativeElement;
    // apply the input-invalid
    fixture.componentRef.setInput('isValid', false);
    fixture.detectChanges();
    tick(100);
    expect(directive['_refInput']).toBeDefined();
    expect(directive['_refInput'].className.includes('input-invalid')).toBeTrue();
  }));
});
