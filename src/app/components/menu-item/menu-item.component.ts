import { Component, effect, input, signal } from '@angular/core';
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
export class MenuItemComponent {
  /** The title of the menu. */
  public title = input<string>('');
  /** The main menu icon will be displayed if it get value from outside. */
  public mainMenuIcon = input<string | undefined>(undefined);
  /** The structure of the menu items with label in dictionary. */
  public menuItems_dict = input.required<{[label: string]: MenuItem[] }>();
  /** It shows the labels of the sub-menus if it is true otherwise it hides the labels. */
  public isDisplayedLabels = input<boolean>(true);

  /** Contains the menu items with linkKey and title. */
  public menuItemValues = signal<MenuItem[]>([]);
  /** Contains the menu labels: Tasks, Charts, and so on. */
  public menuLabelKeys = signal<string[]>([]);

  constructor() {
    /**
     * Effect that runs when signal inputs change.
     * If isDisplayedLabels is false, it collects the list items from dictionary without topic key.
     * Showing the submenus item without topic key.
     */
    effect(() => {
      const menuDict = this.menuItems_dict();
      const displayLabels = this.isDisplayedLabels();

      if (menuDict && !displayLabels) {
        this.setMenuItemsWithoutLabelTagBy(menuDict);
        // reset menu labels
        this.menuLabelKeys.set([]);
      }
      
      this.setMenuLabelsBy(menuDict, displayLabels);
    });
  }


  /**
   * Fills in the menuItemValues from menuItemsWithLabel without lables tag.
   * @description
   * menu-container:
   * * menu-item1
   * * menu-item2
   * * menu-item3
   */
  private setMenuItemsWithoutLabelTagBy(menuDict: {[label: string]: MenuItem[]}): void {
    // get menu items into one array: [ [a,b], [c,d] ] => [a,b,c,d]
    const sublistInList = Object.values(menuDict);
    const allItems: MenuItem[] = [];
    for (const getList of sublistInList) {
      allItems.push(...getList);
    }
    this.menuItemValues.set(allItems);
  }

  /**
   * Collects the label keys from `the this.menuItems_dict` and 
   * displaying complex menu(group label with menu items) 
   */
  private setMenuLabelsBy(menuDict: {[label: string]: MenuItem[]}, displayLabels: boolean): void {
    if (menuDict && displayLabels) {
      // displayed true to collect labelKeys again.
      this.menuLabelKeys.set(Object.keys(menuDict));
    }
  }
}
