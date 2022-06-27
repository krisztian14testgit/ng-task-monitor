import { Component, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router, Event } from '@angular/router';
import { AppMenu, MenuItem } from 'src/app/services/models/app-menu.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public titleOfRoute = '';
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
  private routerDict: {[routerKey: string]: string} = {};

  constructor(private readonly router: Router) {
    this.appMenus = new AppMenu();
    this.appMenus.title = 'Menu';
    this.appMenus.isDisplayedLable = true;
    this.appMenus.menuItemsWithLabel = {
      Tasks: [
        {linkKey: "tasks/inprogress", title: "In-Progress"},
        {linkKey: "tasks/finished", title: "Finished"}
      ],
      Charts: [
        {linkKey: "statistic/daily", title: "Daily"},
        {linkKey: "statistic/weekly", title: "In-Weekly"}
      ]
    };

    this.optionMenus = new AppMenu();
    this.optionMenus.title = 'Options';
    this.optionMenus.isDisplayedLable = false;
    this.optionMenus.menuItemsWithLabel = {
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
        this.titleOfRoute = this.routerDict[urlKey];
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
        this.routerDict[item.linkKey] = item.title;
      }
    }
  }

}
