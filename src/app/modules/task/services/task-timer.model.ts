/**
 * It is in charge of converting different times to desired one.
 */
 export class TaskTimer {
    /**
     * Returns the milliSeconds from the given minutesAndSecond.
     * @description
     * At the decimal number:
     * * Integer => minutes
     * * Fraction => seconds
     * * E.g: 3.45 => Minutues: 3, seconds: 45.
     *
     * @param minutesAndSec It can be integer egy decimal number.
     * */
    static convertsToMilliSec(minutesAndSec: number): number {
        if (minutesAndSec === 0) { return 0; }
        
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

/** Represents the states of the Countdown Timer. */
export enum TimerState {
    Finished,
    Started,
    Interrupted
}
