import { Component, Input, OnChanges } from '@angular/core';

/**
 * Displays the menu with nested menus.
 */
@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.css']
})
export class MenuItemComponent implements OnChanges {
  @Input() public title!: string;
  @Input() public subMenuItems_dict!: {[topic: string]: { key: string, name: string}[] };
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
      Object.values(this.subMenuItems_dict).forEach(getList => this.subMenuValues = [...this.subMenuValues, ...getList]);
    }
  }

}
