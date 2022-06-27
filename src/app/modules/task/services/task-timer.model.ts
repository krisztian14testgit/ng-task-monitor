/** Represents the states of the Countdown Timer. */
export enum TimerState {
    Finished,
    Started,
    Interrupted
}

/**
 * It is in charge of converting different times to desired one.
 */
 export abstract class TaskTimer {
    /**
     * Returns the milliSeconds from the given minutesAndSecond.
     * It uses the 60 number system for minutes and seconds.
     * 
     * @description
     * At the decimal number:
     * * Integer => minutes
     * * Fraction => seconds
     * * E.g: 3.45 => Minutues: 3, seconds: 45.
     *
     * @param minutesAndSec It can be integer egy decimal number.
     */
    static convertsToMilliSec(minutesAndSec: number): number {
        // exit condition
        if (!minutesAndSec || minutesAndSec === 0) { return 0; }
        
        const sec = 60;
        const milliSec = 1000;
        // get fraction
        if (minutesAndSec % 1 !== 0) {
            // [mintues, seconds]
            const stringNumArray: string[] = minutesAndSec.toString().split('.');
            const minutesInSeconds = Number.parseInt(stringNumArray[0]) * 60;
            let seconds =  Number.parseInt(stringNumArray[1]);
            // 1.2 => 2 not sec, reather it will 20sec, increase the digit position: Tens
            seconds = seconds < 10 ? seconds * 10: seconds;
            return (minutesInSeconds + seconds) * milliSec;
        }

        // return interger number
        return minutesAndSec * sec * milliSec;
    }
}

export abstract class TaskDate {
    /**
     * Returns the ISO date form the createdDate of the task.
     * ISO Format: year-months-days.
     * 
     * Returned form example: "2022-06-24"
     * @param date Instance of the Date
     * @return ISO string
     */
    static getYearMonthDaysISO(taskCreatedDate: string): string {
        const date = new Date(taskCreatedDate);
        const isoSignSeparation = 'T';

        const isoDate = date.toISOString();
        const indexOfT = isoDate.indexOf(isoSignSeparation);
        return isoDate.substring(0, indexOfT);
    }

    /**
     * Retruns tuple of the locat months and days from the given createdDate of the task.
     * 
     * Returned tuple: [months, days] which are string.
     * @param taskCreatedDate the date which can be Date instance or simple string: year-months-days HH:mm:ss
     * @returns string tuple
     */
    static getLocalTime_monthsAndDays(taskCreatedDate: string | Date): string[] {
        const startedMonthIndex = 1;
        let taskDate: Date;
        if (typeof taskCreatedDate === 'string') {
            taskDate = new Date(taskCreatedDate);
        } else {
            taskDate = taskCreatedDate;
        }

        let days: number | string = taskDate.getDate();
        days = days < 10 ? '0' + days : days + '';

        let months: number | string = taskDate.getUTCMonth() + startedMonthIndex;
        months = months < 10 ? '0'+ months : months + '';
        
        return [months, days];
    }
}
