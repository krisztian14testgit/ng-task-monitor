import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MenuItem } from 'src/app/services/models/app-menu.model';

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
  /** The structure of the menu items with label in dictionary. */
  @Input() public menuItems_dict!: {[label: string]: MenuItem[] };
  /** Showing labels of the sub-menus if it is true otherwise it hides the labels. */
  @Input() public isDisplayedLabels = true;

  /** Contains the menu items with linkKey and title. */
  public menuItemValues: MenuItem[] = [];
  /** Contains the menu labels: Tasks, Charts, and so on. */
  public menuLabelKeys: string[] = [];

  constructor() { }

  /**
   * If this.isDisplayKeys is false, it collects the list items from dictionary without topic key.
   * Showing the submenus item without topic key.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (this.menuItems_dict && this.menuItems_dict === changes.menuItems_dict.currentValue) {
      this.menuLabelKeys = Object.keys(this.menuItems_dict);
    }

    if (!this.isDisplayedLabels) {
      // get menu items into one array: [ [a,b], [c,d] ] => [a,b,c,d]
      const sublistInList = Object.values(this.menuItems_dict);
      for (const getList of sublistInList) {
        this.menuItemValues = [...this.menuItemValues, ...getList];
      }
    }
  }

}
