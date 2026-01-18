import { Component, DebugElement, input } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { InputBorderDirective } from './input-border.directive';

@Component({
    template: `
    <input dirInputBorder [isValid]="isValid()"
      id="test-input" type="text" class="input-control"/>
  `,
    standalone: true,
    imports: [InputBorderDirective]
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
      imports: [InputBorderDirective, HostTestComponent],
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

  it('should add/remove the input-valid or input-invalid class from inputTag by click trigger', fakeAsync(() => {
    directive['_refInput'] = inputTag.nativeElement;
    inputTag.triggerEventHandler('click', { currentTarget: inputTag.nativeElement });
    expect(directive['_refInput']).toBeDefined();

    // add input-valid class
    let className = ' input-valid';
    fixture.componentRef.setInput('isValid', true);
    fixture.detectChanges();
    tick(100);
    expect(directive['_refInput'].className).toContain(className);

    // remove input-valid class by clearPreviousBorderClass
    directive['clearPreviousBorderClass']();
    expect(directive['_refInput'].className).not.toContain(className);

    // add input-invalid class
    className = ' input-invalid';
    fixture.componentRef.setInput('isValid', false);
    fixture.detectChanges();
    tick(100);
    expect(directive['_refInput'].className).toContain(className);

    // remove input-invalid class by clearPreviousBorderClass
    directive['clearPreviousBorderClass']();
    expect(directive['_refInput'].className).not.toContain(className);

    // set input-valid class again
    className = ' input-valid';
    fixture.componentRef.setInput('isValid', true);
    fixture.detectChanges();
    tick(100);
    expect(directive['_refInput'].className).toContain(className);

    // remove random class by clearPreviousBorderClass
    directive['clearPreviousBorderClass']();
    expect(directive['_refInput'].className).not.toContain(className);
  }));

  it('should not call clearPreviousBorderClass, if input className is empy!', () => {
    spyOn(directive as any, 'findCurrentClassBy').and.callThrough();
    
    inputTag.nativeElement.className = '';
    directive['_refInput'] = inputTag.nativeElement;
    directive['clearPreviousBorderClass']();
    expect(directive['findCurrentClassBy']).not.toHaveBeenCalled();
  });

  it('should apply input classes(valid) if the directive isValid is true', fakeAsync(() => {
    directive['_refInput'] = inputTag.nativeElement;
    inputTag.triggerEventHandler('click', { currentTarget: inputTag.nativeElement });
    fixture.detectChanges();
    // change detectChanges to wait for effect to run
    tick(100);
    
    // apply the input-valid
    fixture.componentRef.setInput('isValid', true);
    fixture.detectChanges();
    // change detectChanges to wait for effect to run
    tick(100);
    
    expect(directive['_refInput']).toBeDefined();
    expect(directive['_refInput'].className).toContain('input-valid');
  }));

  it('should apply input classes(invalid) if the directive isValid is false', fakeAsync(() => {
    directive['_refInput'] = inputTag.nativeElement;
    inputTag.triggerEventHandler('click', { currentTarget: inputTag.nativeElement });
    // change detectChanges to wait for effect to run
    fixture.detectChanges();
    tick(100);
    
    // apply the input-invalid
    fixture.componentRef.setInput('isValid', false);
    // change detectChanges to wait for effect to run
    fixture.detectChanges();
    tick(100);

    expect(directive['_refInput']).toBeDefined();
    expect(directive['_refInput'].className).toContain('input-invalid');
  }));
});
