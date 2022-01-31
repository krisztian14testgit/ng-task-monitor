import { Component, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router, Event } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  /** Contains the structure of the menu with labels and sub-menu items. */
  public menusItemList_dict: {[label: string]: { key: string, name: string}[] };
  public optionItemList_dict: {[label: string]: { key: string, name: string}[] };

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
    }

    this.optionItemList_dict = {
      Location: [
        {key: "location", name: "Change location"}
      ]
    }
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
      }
    });
  }

}
