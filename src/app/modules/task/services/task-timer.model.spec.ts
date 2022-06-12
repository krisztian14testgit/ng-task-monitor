import { TaskTimer } from "./task-timer.model";

describe('TaskTimer class', () => {
    let HelperTimer: {
        minutesToMilliSec: ((minutes: number) => number),
        secodnsToMilliSec: ((seconds: number) => number),
        decimalToMilliSec: ((seconds: number) => number)
    };
    beforeAll(() => {
        HelperTimer = {
            minutesToMilliSec: (minutes: number) => {
                return minutes * 60 * 1000;
            },

            secodnsToMilliSec: (seconds: number) => {
                let sec: number;
                if (seconds % 1 !== 0) {
                    const stringNumArray: string[] = seconds.toString().split('.');
                    sec = Number(stringNumArray[1]);
                    // 1.2 => 2 not sec, reather it will 20sec, increase the digit position: Tens
                    sec = sec < 10 ? sec * 10: sec;
                } else {
                    sec = seconds;
                }
               
                return sec * 1000;
            },

            decimalToMilliSec: (decimal: number) => {
                if (decimal % 1 !== 0) {
                    const stringNumArray: string[] = decimal.toString().split('.');
                    const [minStr, secStr] = stringNumArray;
                    const min = Number(minStr);
                    let sec = Number(secStr);
                    sec = sec < 10 ? sec * 10: sec;
                    return HelperTimer.minutesToMilliSec(min)
                           + HelperTimer.secodnsToMilliSec(sec);
                }

                const sec = 60;
                const milliSec = 1000;
                return decimal * sec * milliSec;
            }
        };
    });

    it('should NOT create taskTimer instance', () => {
        const taskTimer: TaskTimer | undefined = undefined;
        expect(taskTimer).toBeUndefined();
    });

    it('should convert minutes numbers to milliSeconds', () => {
        const minutes = [0, 1, 30, 60, 120, 180];
        const expectedMinutesResults: number[] = [];
        for (const min of minutes) {
            expectedMinutesResults.push(HelperTimer.minutesToMilliSec(min));
        }

        for (let i = 0; i < minutes.length; i++) {
            expect(TaskTimer.convertsToMilliSec(minutes[i])).toBe(expectedMinutesResults[i]);
        }
    });

    it('should convert seconds to milliSeconds', () => {
        const seconds = [0, 0.1, 0.20, 0.30, 0.90, 0.99];
        const expectedSecondsResults: number[] = [];
        for (const sec of seconds) {
            expectedSecondsResults.push(HelperTimer.secodnsToMilliSec(sec));
        }

        for (let i = 0; i < seconds.length; i++) {
            expect(TaskTimer.convertsToMilliSec(seconds[i])).toBe(expectedSecondsResults[i]);
        }
    });

    it('should converts Min.Sec to milliSecons', () => {
        const decimals = [0, 0.0, 10.1, 60.60, 100.100, 100.99];
        const expectedDecimalResults: number[] = [];
        for (const actNum of decimals) {
            expectedDecimalResults.push(HelperTimer.decimalToMilliSec(actNum));
        }

        for (let i = 0; i < decimals.length; i++) {
            expect(TaskTimer.convertsToMilliSec(decimals[i])).toBe(expectedDecimalResults[i]);
        }
    });
});
