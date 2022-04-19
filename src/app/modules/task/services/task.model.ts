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
 * The different time period of Task.
 * When task was created: 
 * * Today = 0, Yesterday = 1
 */
export enum TaskTime {
    Today,
    Yesterday
}

/**
 * The structure of the Task class.
 */
export class Task {
    /** The label/short name of the task. */
    title: string;
    /** The desscription of the task. */
    description: string;
    /** The working/inProgress in seconds. */
    timeSeconds: number;

    private _id: string;
    private _createdDate: Date;
    private _status: TaskStatus;

    /** Creating a Task instance. Default is empty task. */
    constructor(id = '', title = '', description = '', timeSeconds = 0) {
        this._id = id;
        this.title = title;
        this.description = description;
        this.timeSeconds = timeSeconds;
        this._status = TaskStatus.Started;
        // when it is created
        this._createdDate = new Date();
    }

    /** The idetifier of the task. */
    public get id(): string {
        return this._id;
    }

    /** The date of the task when it was created. */
    public get createdDate(): string {
        return this._createdDate.toDateString();
    }

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
