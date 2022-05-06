/** The structure of the sub-menu items. */
export class AppSubMenu {
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
    menuItemsWithLabel: {[label: string]: AppSubMenu[] } = {};
    /**
     * Showing the label name in the menu list.
     * The labels can not be refered (not open as a link).
     * @defaultValue false
     */
    isDisplayedLable = false;
}
