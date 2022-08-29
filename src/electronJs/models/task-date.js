"use strict";
/* eslint-disable no-undef */

/** diff7days milliSec = 7-days * 24-hours * 60-min * 60-sec * 1000-millisec */
const DIFF_7DAYS_MILLISEC  = 7 * 24 * 60 * 60 * 1000;

class TaskDate {

    /** Contains the current system date of pc. It will be adjusted/reset when callig removeOldTaskByDate method. */
    static _currentSystemDate = undefined;
    /**
     * Returns the new array which won't contain those tasks which are created more than 7 days/one week.
     * Removing those tasks which createdDate is more older then a week.
     * @param taskCreationDateProp The name of date property of Task. Where it can read date from the property.
     * @param taskList Task items in array
     * @returns fileted task array.
     */
    static removeOldTaskByDate(taskCreationDateProp= '', taskList = []) {
        // deep copy items by spread operators
        let retArray = [];
        TaskDate._currentSystemDate = new Date();

        if (taskCreationDateProp && taskList.length > 0) {
            retArray = [...taskList];
            for (let index = retArray.length -1; index > -1; index--) {
                const creationDate = retArray[index][taskCreationDateProp];
                if (TaskDate._isDateOlderThen7days(creationDate)) {
                    // remove one item
                    retArray.splice(index, 1);
                }

            }
        }

        return retArray;
    }

    /**
     * Returns true if the given creationDate is older then 7days(one week),
     * otherwise returns false
     * @param creationDate Date string when task is created.
     * @returns boolean
     */
    static _isDateOlderThen7days(creationDate = '') {
        if (creationDate) {
            const givenDate = new Date(creationDate);
            return TaskDate._currentSystemDate.getTime() - givenDate.getTime() >= DIFF_7DAYS_MILLISEC;
        }

        return false;
    }
}

module.exports = TaskDate;
