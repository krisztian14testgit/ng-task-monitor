import { Component, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatGridListModule } from '@angular/material/grid-list';
import { AppMenu, MenuItem } from 'src/app/services/models/app-menu.model';
import { MenuItemComponent } from '../menu-item/menu-item.component';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css'],
    standalone: true,
    imports: [MatGridListModule, MenuItemComponent]
})
export class HeaderComponent {
  /** Stores the title of the side by url navigation. */
  public titleOfRoute: string;
  /** Contains the structure of the menu with labels. */
  public appMenus: AppMenu;
  /** Contains the structure of the option menu with labels. */
  public optionMenus: AppMenu;
  /**
   * * Contains the linkKey and title of the menuItems.
   * * It helps display more readable name of the navigated routing path.
   * @example
   * routerDict: { 
   *  'linkey': 'menuTitle'
   * }
   */
  private _routerDict: {[routerKey: string]: string} = {};

  private readonly router = inject(Router);

  constructor() {
    this.appMenus = new AppMenu();
    this.appMenus.title = 'Menu';
    this.appMenus.icon = 'menu'
    this.appMenus.isDisplayedLable = true;
    this.appMenus.menuItemsWithLabel = {
      Tasks: [
        {linkKey: "tasks/all", title: "All tasks", icon: "summarize"},
        {linkKey: "tasks/finished", title: "Finished", icon: "done_all"}
      ],
      Charts: [
        {linkKey: "statistic/daily", title: "Daily", icon: "donut_small"},
        {linkKey: "statistic/weekly", title: "In-Weekly", icon: "timeline"}
      ]
    };
    // contains default the "All tasks" title.
    this.titleOfRoute = this.appMenus.menuItemsWithLabel['Tasks'][0].title;

    this.optionMenus = new AppMenu();
    this.optionMenus.title = 'Options';
    this.optionMenus.icon = 'settings';
    this.optionMenus.isDisplayedLable = true;
    this.optionMenus.menuItemsWithLabel = {
      Themes: [ /** app-style-themes loading at line 20 in menu-item.component.html, not attaching by link*/ ],
      Location: [
        {linkKey: "location", title: "Change location"}
      ]
    };

    this.fillInRouterDictFrom(this.appMenus.menuItemsWithLabel);
    this.fillInRouterDictFrom(this.optionMenus.menuItemsWithLabel);

    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      takeUntilDestroyed()
    ).subscribe(event => {
      const urlKey = event.url.substring(1);
      if (urlKey) {
        this.titleOfRoute = this._routerDict[urlKey];
      }
    });
  }

  /**
   * Sets up the this.routerDict by menu linkKEy from the menuItemList.
   * The routerDict will contains the all menu title with menu linkKey.
   * @param labelDict Contains the structure of the menu with labels and its sub-menu items
   */
  private fillInRouterDictFrom(labelDict: {[label: string]: MenuItem[] }): void {
    const listInList = Object.values(labelDict);
    for (let index = 0, k = listInList.length; index < k; index++) {
      for (const item of listInList[index]) {
        this._routerDict[item.linkKey] = item.title;
      }
    }
  }

}
