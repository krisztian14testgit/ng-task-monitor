import { Component, Input, OnInit } from '@angular/core';

/**
 * Displays the nested menu.
 */
@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.css']
})
export class MenuItemComponent implements OnInit {
  @Input() public title!: string;
  @Input() public subMenuItems_dict!: {[key: string]: string};
  @Input() public isDisplayedKeys = true;

  constructor() { }

  ngOnInit(): void {
  }

}
