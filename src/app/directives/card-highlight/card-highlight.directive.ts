import { Directive, ElementRef, HostListener } from '@angular/core';

/**
 * The directive highlight the border of the card with blue color.
 * Only one card is selected by the onclick event.
 */
@Directive({
    selector: '[dirCardHighlight]',
    standalone: false
})
export class CardHighlightDirective {
  /** Normal border of the class. The Definition in task-card.comp.css */
  private readonly _originalBorderClass = 'task-card-default-border';
  /** Highlighted border of the class. The class definition in task-card.comp.css */
  private readonly _highlightBorderClass = 'task-card-highlight';

  constructor(private readonly elementRef: ElementRef) { }

  /**
   * It runs when the user clicks on the task-card.
   * It highlights the border of the clicked cards and
   * removes the previous highlighting.
   */
  @HostListener('click')
  public onClick(): void {
    const currentCardDiv = this.getCardDiv();
    if (currentCardDiv) {
      const isHighlighted = this.isHighlighted(currentCardDiv); 
      // not removing the highlight if the cardDiv is same, not run for cycle uneccessary
      if (!isHighlighted) {
        this.removeAllCardHighLighting();
        this.highLightBorder(currentCardDiv);
      }
    }
  }

  /**
   * Returns the reference of the card div by the elementRef.
   * @returns Reference of the div card.
   */
  private getCardDiv(): HTMLDivElement | null {
    if (this.elementRef.nativeElement) {
      return this.elementRef.nativeElement;
    }

    return null;
  }

  /**
   * Removes the class form the className prop of the card div.
   * @param divRef The reference of the Div tag.
   * @param delClassName className to be removed from the className.
   */
  private removeClass(divRef: HTMLDivElement, delClassName: string): void {
    const classArray = divRef.className.split(' ');
    const delIndex = classArray.indexOf(delClassName);
    if (delIndex > -1) {
      classArray.splice(delIndex, 1);
    }

    // updates className without deleted class
    divRef.className = classArray.join(' ');
  }

  /**
   * Inserts the class into className prop of the card div.
   * @param divRef The reference of the Div tag.
   * @param className className to be removed from the className.
   */
  private insertClass(divRef: HTMLDivElement, className: string): void {
    divRef.className += ` ${className}`;
  }

  /**
   * Highlights the border of the selected div.
   * @param divRef The reference of the Div tag.
   */
  private highLightBorder(divRef: HTMLDivElement): void {
    this.removeClass(divRef, this._originalBorderClass);
    // add highlighted class
    this.insertClass(divRef, this._highlightBorderClass);
  }

  /**
   * Removes this highlighting on the selected div.
   * @param divRef The reference of the Div tag.
   */
  private removeHighLighting(divRef: HTMLDivElement): void {
    this.removeClass(divRef, this._highlightBorderClass);
    // set default border class
    this.insertClass(divRef, this._originalBorderClass);
  }

  /**
   * Returns true if the card has blue border, otherwise false.
   * @param divRef The reference of the Div tag.
   * @returns booelan
   */
  private isHighlighted(divRef: HTMLDivElement | Element): boolean {
    return divRef.className.includes(this._highlightBorderClass);
  }

  /** Removes the highlighting from the all card if they was selected before. */
  private removeAllCardHighLighting(): void {
    const cardList = document.getElementsByClassName('task-card');
    for (let i = 0, k = cardList.length; i < k; i++) {
      // if it has highlighting, selected before.
      if (this.isHighlighted(cardList[i])) {
        this.removeHighLighting(cardList[i] as HTMLDivElement);
      }
    }
  }
}
