/** The structure of the menu items. */
export class MenuItem {
    /** The url reference key of the the sub-menu. */
    linkKey = '';
    /** The title of sub-menu. Displayed name. */
    title = '';
    /** Material icon name. */
    icon? = '';
}

/** The represent the menu with belong properties of the application. */
export class AppMenu {
    /** The title of the menu item. Displayed name. */
    title = '';
    /** 
     * The menu items by the lables. Orgonized with lables.
     * * label: can be the group name of the sub-menu items.
     * 
     * Displayed with labels:
     * @example 
     * menuItemsWithLabel = {
        Label1: [ // <-- label name
          {linkKey: "linkUrl", title: "TaskTitle1"},
          {linkKey: "linkUrl", title: "TaskTitle2"}
        ],
        Label2: [ // <-- label name
          {linkKey: "linkUrl", title: "TaskTitle1"},
          {linkKey: "linkUrl", title: "TaskTitle2"}
        ]
      };
     *
     * @example // Without labels
     * menuItemsWithNoLabel = {
        Menu: [ // <-- label name, not displayed, as there is one key.
          {linkKey: "linkUrl", title: "TaskTitle1"},
          {linkKey: "linkUrl", title: "TaskTitle2"},
          ...
        ]
      };
     */
    menuItemsWithLabel: {[label: string]: MenuItem[] } = {};
    /**
     * Showing the label name in the menu list.
     * The labels can not be refered (not open as a link).
     * @defaultValue false
     */
    isDisplayedLable = false;
    /** Material icon name. The icon will be display in `<mat-icon>` High-level class. */
    icon? = ''
}
