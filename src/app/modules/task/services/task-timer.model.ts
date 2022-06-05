/**
 * It is in charge of converting different task times to desired one.
 */
 export class TaskTimer { // => moved into new model file: TaskTimer.model.ts
    /** Returns the milliSeconds from the given minutes. */
    static convertsToMilliSec(inMinutes: number): number {
        if (inMinutes === 0) { return 0; }
        
        const sec = 60;
        const milliSec = 1000;
        return inMinutes * sec * milliSec;
    }
}

/** Represents the states of the Countdown Timer. */
export enum TimerState {
    Finished,
    Started,
    Interrupted
}
