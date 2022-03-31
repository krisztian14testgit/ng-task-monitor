import { Component, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router, Event } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public titleOfRoute = '';
  /** Contains the structure of the menu with labels and its sub-menu items. */
  public menusItemList_dict: {[label: string]: { key: string, name: string}[] };
  /** Contains the structure of the option with labels and its sub-menu items. */
  public optionItemList_dict: {[label: string]: { key: string, name: string}[] };
  /**
   * * Contains the merged item from the menusItemList_dict and optionItemList_dict 
   * by the key-name pair.
   * * It helps display more readable name of the navigated routing path.
   */
  private routerDict: {[routerKey: string]: string} = {};

  constructor(private readonly router: Router) {
    this.menusItemList_dict = {
      Tasks: [
        {key: "inprogress", name: "In-Progress"},
        {key: "finished", name: "Finished"}
      ],
      Charts: [
        {key: "weekly", name: "In-Weekly"},
        {key: "statistic", name: "Statistic-all"}
      ]
    };

    this.optionItemList_dict = {
      Location: [
        {key: "location", name: "Change location"}
      ]
    };

    this.fillInRouterDictFrom(this.menusItemList_dict);
    this.fillInRouterDictFrom(this.optionItemList_dict);

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
   * Sets up the this.routerDict by menuKey from the menuItemList.
   * @param labelDict Contains the structure of the menu with labels and its sub-menu items
   */
  private fillInRouterDictFrom(labelDict: {[label: string]: { key: string, name: string}[] }): void {
    const listInList = Object.values(labelDict);
    for (let index = 0, k = listInList.length; index < k; index++) {
      for (const item of listInList[index]) {
        this.routerDict[item.key] = item.name;
      }
    }
  }

}
