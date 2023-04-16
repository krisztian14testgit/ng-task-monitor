/**
 * @description
 * Contains the basic method for the menu-item controller which have to be implemented.
 * 
 */
export interface IMenuController {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    /** Displays the sub-menu items. */
    show(): void;
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    /** Hides the sub-menu items */
    close(): void;
}