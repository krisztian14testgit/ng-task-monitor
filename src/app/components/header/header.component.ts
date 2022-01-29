import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  /** Contains the structure of the menu with labels and sub-menu items. */
  public menusItemList_dict: {[label: string]: { key: string, name: string}[] };
  public optionItemList_dict: {[label: string]: { key: string, name: string}[] };

  constructor() {
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

  ngOnInit(): void {
  }

}
