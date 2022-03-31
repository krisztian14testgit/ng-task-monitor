import { Component, Input, OnChanges } from '@angular/core';

/**
 * Displays the menu with nested menus with labels.
 */
@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.css']
})
export class MenuItemComponent implements OnChanges {
  /** The title of the menu. */
  @Input() public title!: string;
  /** The structure of the sub-menu with label in dictionary. */
  @Input() public subMenuItems_dict!: {[label: string]: { key: string, name: string}[] };
  /** Showing labels of the sub-menus if it is true otherwise it hides the labels. */
  @Input() public isDisplayedKeys = true;

  public subMenuValues: {key: string, name: string}[] = [];
  public subMenuKeys: string[] = [];

  constructor() { }

  /**
   * If this.isDisplayKeys is false, it collects the list items from dictionary without topic key.
   * Showing the submenus item without topic key.
   */
  ngOnChanges(): void {
    if (this.subMenuItems_dict) {
      this.subMenuKeys = Object.keys(this.subMenuItems_dict);
    }

    if (!this.isDisplayedKeys) {
      // get sub-array into one array: [ [a,b], [c,d] ] => [a,b,c,d]
      const subMenulistInList = Object.values(this.subMenuItems_dict);
      for (const getList of subMenulistInList) {
        this.subMenuValues = [...this.subMenuValues, ...getList];
      }
    }
  }

}
