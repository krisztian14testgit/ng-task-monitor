/**
 * The statuses of the Task.
 */
export enum TaskStatus {
    /**
     * The task is new, ready to stared count timer.
     * The task initialized/default value.  */
    Start,
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

    /**
     * Creating a Task instance. Default is empty task. 
     * * createdDate: is set up after the creation of the task instance.
     * * status: default value is TaskStatus.Start.
    */
    constructor(id = '', title = '', description = '', timeSeconds = 0) {
        this._id = id;
        this.title = title;
        this.description = description;
        this.timeSeconds = timeSeconds;
        this._status = TaskStatus.Start;
        // when it is created
        this._createdDate = new Date();
    }

    /**
     * The idetifier of the task. 
     * @access Readonly
     */
    public get id(): string {
        return this._id;
    }

    /** 
     * The date of the task when it was created.
     * @access Readonly
     */
    public get createdDate(): string {
        return this._createdDate.toDateString();
    }

    /**
     * The current status of the task.
     * @Statuses:
     * * Start
     * * Inprogress
     * * Completed
     * @access Readonly
     * @defaultValue TaskStatus.Start
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

    /** 
     * Returns true if the task is new by id (not saved yet), otherwise false.
     * New condition: id contains 'new' keyword.
     */
    public isNewTask(): boolean {
        return this._id.indexOf('new') !== -1;
    }

    /**
     * Returns true if the Task is created today.
     * 
     * @description
     * The createdDate of Task is not less then the cleint current date.
     * Date diff range: 24 hours.
     * @returns boolean
     */
    public isCreatedToday(): boolean {
        const currentClient_inMilliSec = new Date().getMilliseconds();
        const task_inMilliSec = this._createdDate.getMilliseconds();
        //                             h    min  sec  milliSec
        const diff24hours_inMilliSec = 24 * 60 * 60 * 1000;
        return currentClient_inMilliSec - task_inMilliSec < diff24hours_inMilliSec;
    }
}
