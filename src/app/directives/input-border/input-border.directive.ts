import { Directive, effect, HostListener, input } from '@angular/core';

/**
 * Sets the border of the input tag by isValid input property.
 * If isValid is true then border is green, otherwise border is red.
 */
@Directive({
    selector: '[dirInputBorder]',
    standalone: true
})
export class InputBorderDirective {
  /** The switch of the validation. */
  public isValid = input(false);

  /** Stores the pre-define keyword of the 'input'-valid, 'input'-invalid class. */
  private readonly _preClassKey = 'input';
  /** The needle of the input element. */
  private _refInput!: HTMLInputElement;

  constructor() {
    // Effect to react to isValid input signal changes
    effect(() => {
      const valid = this.isValid();
      if (this._refInput) {
        this.changeBorderBy(valid);
      }
    });
  }

  /**
   * It triggers when the user click on the input field.
   * @param target target event of the input tag.
   */
  @HostListener('click', ['$event'])
  public onClick(target: Event): void {
    if (target.currentTarget) {
      this._refInput = target.currentTarget as HTMLInputElement;
      // it runs at first to change border of the input field
      this.changeBorderBy(this.isValid());
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
    this._refInput.className += ` ${this._preClassKey}-${classValue}`;
  }

  /**
   * Removes the previous input class definiation from the class prop of input tag.
   * Only removes that class def which contains the 'input' keywords,
   * such as input-valid, input-invalid
   */
  private clearPreviousBorderClass(): void {
    let delIndex = -1;
    let classes: string[] = [];

    if (this._refInput.className.length > 0) {
      classes = this._refInput.className.split(' ');
      delIndex = this.findCurrentClassBy(classes, this._preClassKey);
    }
    
    if (delIndex > -1) {
      // remove class by delIndex
      classes.splice(delIndex, 1);
      // save the rest class definiton without the removed one.
      this._refInput.className = classes.join(' ');
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
