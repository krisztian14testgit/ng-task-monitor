import { Directive, HostListener, Input, OnChanges } from '@angular/core';

/**
 * Sets the border of the input tag by isValid input property.
 * If isValid is true then border is green, otherwise border is red.
 */
@Directive({
  selector: '[dirInputBorder]'
})
export class InputBorderDirective implements OnChanges {
  /** The switch of the validation. */
  @Input() public isValid = false;

  /** Stores the pre def keyword of the input-valid, input-invalid class. */
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
      this.changeBorderBy(this.isValid);
    }
  }

  /** It is triggered when the isValid input changes. */
  ngOnChanges(): void {
    if (this.refInput) {
      this.changeBorderBy(this.isValid);
    }
  }

  /**
   * Changes the border the of input tag by the isValid property.
   * Borders:
   * * Valid -> green
   * * Invalid -> red
   * @param isValid Input validation condition.
   */
  private changeBorderBy(isValid: boolean): void {
    const classValue = isValid ? 'valid': 'invalid';
    this.clearPreviousBorderClass();
    this.refInput.className += ` ${this.preClassKey}-${classValue}`;
  }

  /**
   * Removes the previous input class definiation from the class prop of input tag.
   * Only removes that class def which contains the 'input' keywords,
   * such as input-valid, input-invalid
   */
  private clearPreviousBorderClass(): void {
    let delIndex = -1;
    let classes: string[] = [];

    if (this.refInput.className.length > 0) {
      classes = this.refInput.className.split(' ');
      delIndex = this.findCurrentClassBy(classes, this.preClassKey);
    }
    
    if (delIndex > -1) {
      // remove class by delIndex
      classes.splice(delIndex, 1);
      // save the rest class definiton without the removed one.
      this.refInput.className = classes.join(' ');
    }
  }

  /**
   * Returns the index of the found class definition by the findKey.
   * Returns -1 if the findKey is not found.
   * @param classes The clases of the input tag.
   * @param findKey The searched class key.
   * @returns found index of the classes.
   */
  private findCurrentClassBy(classes: string[], findKey: string): number {
    // Find item from the end of the classes, as the last class def was inserted.
    if (!findKey) return -1;
    
    for (let i = classes.length-1; i > -1; i--) {
      if (classes[i].includes(findKey)) {
        return i;
      }
    }

    return -1;
  }
}
