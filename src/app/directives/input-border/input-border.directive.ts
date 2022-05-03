import { Directive, HostListener, Input, OnChanges } from '@angular/core';

@Directive({
  selector: '[dirInputBorder]'
})
export class InputBorderDirective implements OnChanges {
  /** The switch of the validation. */
  @Input() public isValid = false;

  /** Stores the pre def key of the input-valid, input-invalid class. */
  private readonly preClassKey = 'input';
  /** The needle of the input element. */
  private refInput!: HTMLInputElement;

  /**
   * It triggers when the user click on the input field.
   * @param target target event of the input tag.
   */
  @HostListener('click', ['$event'])
  public onClick(target: Event): void {
    if (target.currentTarget) {
      this.refInput = target.currentTarget as HTMLInputElement;
      // it runs fist to change border of the input field
      this.changeBorderBy(this.refInput, this.isValid);
    }
  }

  /** It is triggered when the isValid input changes. */
  ngOnChanges(): void {
    if (this.refInput) {
      this.changeBorderBy(this.refInput, this.isValid);
    }
  }

  /**
   * Changes the border the of input tag by the isValid property.
   * Borders:
   * * Valid -> green
   * * Invalid -> red
   * @param refInput The input element tag.
   * @param isValid Input validation condition.
   */
  private changeBorderBy(refInput: HTMLInputElement ,isValid: boolean): void {
    const classValue = isValid ? 'valid': 'invalid';
    this.clearPreviousBorder(refInput);
    refInput.className += ` ${this.preClassKey}-${classValue}`;
  }

  /**
   * Removes the previous input class definiation from the class prop of input tag.
   * @param refInput The input element tag.
   */
  private clearPreviousBorder(refInput: HTMLInputElement): void {
    const classes: string[] = refInput.className.split(' ');
    let delIndex = -1;
    
    if (classes.length > 0) {
      delIndex = this.findCurrentClassBy(classes, this.preClassKey);
    }
    
    if (delIndex > -1) {
      // remove class by delIndex
      classes.splice(delIndex, 1);
      // save the rest class definiton without the removed one.
      refInput.className = classes.join(' ');
    }
  }

  /**
   * Returns the index of the found class definition by the findKey.
   * Returns -1 if the findKey is not found.
   * @param classes The clases of the input tag.
   * @param findKey The given key which will be found.
   * @returns found index of the classes.
   */
  private findCurrentClassBy(classes: string[], findKey: string): number {
    // Find item from the end of the classes, as the last class def was inserted.
    for (let i = classes.length-1; i > -1; i--) {
      if (classes[i].includes(findKey)) {
        return i;
      }
    }

    return -1;
  }
}
