import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { By } from '@angular/platform-browser';

import { CardHighlightDirective } from './card-highlight.directive';

@Component({
    template: `
    <mat-card dirCardHighlight>
      <mat-card-title>Title of the card</mat-card-title>
      <mat-card-content>
        The content of the card. It has more text here.
      </mat-card-content>
    </mat-card>
  `,
    standalone: false
})
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class HighLightTestComponent {}

describe('CardHighlightDirective', () => {
  let fixture: ComponentFixture<HighLightTestComponent>;
  let directive: CardHighlightDirective;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HighLightTestComponent, CardHighlightDirective],
      imports: [MatCardModule]
    }).compileComponents();

    fixture = TestBed.createComponent(HighLightTestComponent);
    fixture.detectChanges();
    
    // get directive instance via debugElement
    const matCard = fixture.debugElement.query(By.directive(CardHighlightDirective));
    directive = matCard.injector.get(CardHighlightDirective);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should get mat-card instance', () => {
    const matCard = directive['getCardDiv']();
    expect(matCard).not.toBeNull();
    if (matCard) {
      expect(matCard.tagName).toBe('MAT-CARD');
    }
  });

  it('should NOT get mat-card instance, return value is null', () => {
    directive['elementRef'].nativeElement = null;
    const matCard = directive['getCardDiv']();
    expect(matCard).toBeNull();
  });

  it('should check the mat-card tag is highligted or not', () => {
    const cardDiv = document.createElement('div');

    // div is not selected
    let isHighlighted = directive['isHighlighted'](cardDiv);
    expect(isHighlighted).toBeFalse();

    // div is selected
    cardDiv.className += directive['_highlightBorderClass'];
    isHighlighted = directive['isHighlighted'](cardDiv);
    expect(isHighlighted).toBeTrue();
  });

  it('should highlight the cards', () => {
    const cardDiv = document.createElement('div');
    cardDiv.className += 'card-test-class';
    directive['highLightBorder'](cardDiv);
    const actualClassDefList = cardDiv.className.split(' ');
    expect(actualClassDefList.length).toBe(2);
    expect(actualClassDefList[0]).toBe('card-test-class');
    expect(actualClassDefList[1]).toBe(directive['_highlightBorderClass']);
  });

  it('should remove the highlighting from the cards', () => {
    const cardDiv = document.createElement('div');
    cardDiv.className += 'card-test-class';
    directive['highLightBorder'](cardDiv);
    expect(directive['isHighlighted'](cardDiv)).toBeTrue();
    
    directive['removeHighLighting'](cardDiv);
    expect(cardDiv.className).toBe(`card-test-class ${directive['_originalBorderClass']}`);
    expect(directive['isHighlighted'](cardDiv)).toBeFalse();
  });

  it('should check the mat-card is selected again by onClick', () => {
    spyOn(directive as any, 'getCardDiv').and.callThrough();
    spyOn(directive as any, 'highLightBorder').and.callThrough();
    spyOn(directive as any, 'removeAllCardHighLighting').and.callThrough();
    directive.onClick();

    expect(directive['getCardDiv']).toHaveBeenCalled();
    // the card is highlighted, removeAllCardHighLighting is called.
    expect(directive['removeAllCardHighLighting']).toHaveBeenCalled();
    expect(directive['highLightBorder']).toHaveBeenCalled();
  });

  it('should check the mat-card is not selected by onClick', () => {
    spyOn(directive as any, 'getCardDiv').and.callThrough();
    directive.onClick();
    fixture.detectChanges();
    // card is already selected
    directive.onClick();

    expect(directive['getCardDiv']).toHaveBeenCalled();
    // the card is highlighted
    const card = directive['getCardDiv']() as HTMLDivElement;
    expect(directive['isHighlighted'](card)).toBeTrue();
  });
});
