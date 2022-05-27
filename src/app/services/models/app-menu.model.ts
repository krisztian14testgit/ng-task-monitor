/** The structure of the menu items. */
export class MenuItem {
    /** The url reference key of the the sub-menu. */
    linkKey = '';
    /** The title of sub-menu. Displayed name. */
    title = '';
}

/** The represent the menu with belong properties of the application. */
export class AppMenu {
    /** The title of the menu item. Displayed name. */
    title = '';
    /** 
     * The menu items by the lables. Orgonized with lables.
     * * label: can be the group name of the sub-menu items.*/
    menuItemsWithLabel: {[label: string]: MenuItem[] } = {};
    /**
     * Showing the label name in the menu list.
     * The labels can not be refered (not open as a link).
     * @defaultValue false
     */
    isDisplayedLable = false;
}
