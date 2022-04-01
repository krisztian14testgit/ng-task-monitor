/**
 * The statuses of the Task.
 */
export enum TaskStatus {
    /** The task initialized/default value. That's mean the task is new. */
    Started,
    /** The task started the measuring/working time. */
    Inprogress,
    /** The task is done/finished. */
    Completed
}

/**
 * The structure of the Task class.
 */
export class Task {
    /** The idetifier of the task. */
    id = '';
    /** The label/short name of the task. */
    name = '';
    /** The desscription of the task. */
    description = '';
    /** Stores the working/inProgress hours in Number(like double in C#). */
    timeHours = 0.0;
    private _status = TaskStatus.Started;

    /**
     * The current status of the task.
     * Statuses:
     * * Started
     * * Inprogress
     * * Completed
     */
    public get status(): TaskStatus {
        return this._status;
    }

    /** Returns true if task status is inprogress. */
    public isInProgress(): boolean {
        return this._status === TaskStatus.Inprogress;
    }

    /** Returns true if task status is completed/done. */
    public isCompleted(): boolean {
        return this._status === TaskStatus.Completed;
    }
}
