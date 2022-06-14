import { Injectable } from "@angular/core";
import { Task, TaskStatus } from "../../modules/task/services/task.model";

/** Faked countdown timer service of the timer web-worker. It does nothing, not running sub-thread. */
@Injectable()
export class MockCountdownTimerService {

    /** 
     * Aborts the timer worker process. 
     * @Important The worker cannot used anymore after terminating.
     * @memberof MockCountdownTimerService
     */
    public terminateWorker(): void {
        console.log('faked worker terminate');
    }

    /**
     * Calculates and adjusts the timer of tasks to be expired or not.
     * If task timer is not over then the web-worker sets the rest timer(decimal number).
     * @ChangingHints 
     * Changing the task timeMinutes:
     * * Not changing the given tasks' TimeMinutes, because not calculating.
     * * You can adjust them by the expected TimeMinutes param.
     * 
     * @description
     * Decimal number: Integer is minutes, fraction is seconds.
     * @param taskList The task items where their timeMinutes will be modified.
     * @memberof MockCountdownTimerService
     */
    public async calculateTaskExpirationTime(taskList: Task[], expectedTimeMinutes: number[] = []): Promise<void> {
        // the taskList.length and expectedTimeMinutes are equivalent array size.
        if (expectedTimeMinutes && expectedTimeMinutes.length > 0 &&
            taskList.length === expectedTimeMinutes.length) {
            
            for (let i = 0; i < taskList.length; i++) {
                if (expectedTimeMinutes[i] === 0) {
                    // status will completed, if them are zero
                    taskList[i].setStatus(TaskStatus.Completed);
                }
                taskList[i].timeMinutes = expectedTimeMinutes[i];
            }
        }
    }
}
