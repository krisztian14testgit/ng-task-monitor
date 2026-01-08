import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MenuItem } from 'src/app/services/models/app-menu.model';
import { StyleThemeComponent } from '../style-theme/style-theme.component';

/**
 * Displays the menu with nested menus with labels.
 */
@Component({
    selector: 'app-menu-item',
    templateUrl: './menu-item.component.html',
    styleUrls: ['./menu-item.component.css'],
    standalone: true,
    imports: [CommonModule, RouterModule, MatButtonModule, MatMenuModule, MatIconModule, StyleThemeComponent]
})
export class MenuItemComponent implements OnChanges {
  /** The title of the menu. */
  @Input() public title = '';
  /** The main menu icon will be displayed if it get value from outside. */
  @Input() public mainMenuIcon: string | undefined = undefined;
  /** The structure of the menu items with label in dictionary. */
  @Input() public menuItems_dict!: {[label: string]: MenuItem[] };
  /** Showing labels of the sub-menus if it is true otherwise it hides the labels. */
  @Input() public isDisplayedLabels = true;

  /** Contains the menu items with linkKey and title. */
  public menuItemValues: MenuItem[] = [];
  /** Contains the menu labels: Tasks, Charts, and so on. */
  public menuLabelKeys: string[] = [];

  /**
   * If this.isDisplayKeys is false, it collects the list items from dictionary without topic key.
   * Showing the submenus item without topic key.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (this.menuItems_dict && this.menuItems_dict === changes.menuItems_dict.currentValue) {
      this.setMenuItemsWithLables();
    }

    if (this.menuItems_dict && !this.isDisplayedLabels) {
      this.setMenuItemsWithoutLabelTag();
      // reset menu labels
      this.menuLabelKeys = [];
    }
    
    this.setMenuLabels();
  }

  /**
   * Collects the label keys from `the this.menuItems_dict` and 
   * displaying complex menu(group label with menu items) by the `the this.menuItems_dict`
   * with its own labelKeys
   */
  private setMenuItemsWithLables(): void {
    this.menuLabelKeys = Object.keys(this.menuItems_dict);
    this.isDisplayedLabels = this.menuLabelKeys.length > 0;
  }

  /**
   * Fills in the menuItemValues from menuItemsWithLabel without lables tag.
   * @description
   * menu-container:
   * * menu-item1
   * * menu-item2
   * * menu-item3
   */
  private setMenuItemsWithoutLabelTag(): void {
    // get menu items into one array: [ [a,b], [c,d] ] => [a,b,c,d]
    const sublistInList = Object.values(this.menuItems_dict);
    for (const getList of sublistInList) {
      this.menuItemValues = [...this.menuItemValues, ...getList];
    }
  }

  private setMenuLabels(): void {
    if (this.menuItems_dict && this.isDisplayedLabels) {
      // displayed true to collect labelKeys again.
      this.menuLabelKeys = Object.keys(this.menuItems_dict);
    }
  }
}
