import { Component, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router, Event } from '@angular/router';
import { AppMenu, MenuItem } from 'src/app/services/models/app-menu.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
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

  constructor(private readonly router: Router) {
    this.appMenus = new AppMenu();
    this.appMenus.title = 'Menu';
    this.appMenus.isDisplayedLable = true;
    this.appMenus.menuItemsWithLabel = {
      Tasks: [
        {linkKey: "tasks/all", title: "All tasks"},
        {linkKey: "tasks/finished", title: "Finished"}
      ],
      Charts: [
        {linkKey: "statistic/daily", title: "Daily"},
        {linkKey: "statistic/weekly", title: "In-Weekly"}
      ]
    };
    // contains default the "All tasks" title.
    this.titleOfRoute = this.appMenus.menuItemsWithLabel['Tasks'][0].title;

    this.optionMenus = new AppMenu();
    this.optionMenus.title = 'Options';
    this.optionMenus.isDisplayedLable = false;
    this.optionMenus.menuItemsWithLabel = {
      Themes: [ /** app-style-themes loading, not attaching link*/ ],
      Location: [
        {linkKey: "location", title: "Change location"}
      ]
    };

    this.fillInRouterDictFrom(this.appMenus.menuItemsWithLabel);
    this.fillInRouterDictFrom(this.optionMenus.menuItemsWithLabel);

  }

  /** Subscribes on the url chaging event to get info url change detection.  */
  ngOnInit(): void {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        // Show progress spinner or progress bar
        console.log('Route change detected');
      }

      if (event instanceof NavigationEnd) {
        // Hide progress spinner or progress bar 
        console.log('Navigated route:', event.url);
        // remove slash sign
        const urlKey = event.url.substring(1);
        if (urlKey) {
          this.titleOfRoute = this._routerDict[urlKey];
        }
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
