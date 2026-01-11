/**
 * @description
 * Contains the basic method for the menu-item controller which have to be implemented.
 * 
 */
export interface IMenuController {
    /** Displays the sub-menu items. */
    show(): void;
    /** Hides the sub-menu items */
    close(): void;
}
