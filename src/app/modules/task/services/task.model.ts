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
 * It is in charge of converting different task times to desired one.
 */
export class TaskTimer {
    /** Returns the milliSeconds from the given minutes. */
    static convertsToMilliSec(inMinutes: number): number {
        const sec = 60;
        const milliSec = 1000;
        return inMinutes * sec * milliSec;
    }
}

/**
 * The structure of the Task class.
 */
export class Task {
    /** The label/short name of the task. */
    title: string;
    /** The desscription of the task. */
    description: string;
    /** The task timer: working/inProgress in minutes. */
    timeMinutes: number;
    /** The timer date when the counterClock is start counting. */
    timerStartedDate: Date | undefined;
     /** The timer date when the counterClock is over. */
    timerFinishedDate: Date | undefined;

    private _id: string;
    private _createdDate: Date;
    private _status: TaskStatus;

    /**
     * Creating a Task instance. Default is empty task. 
     * * createdDate: is set up after the creation of the task instance.
     * * status: default value is TaskStatus.Start.
    */
    constructor(id = '', title = '', description = '', inMinutes = 0) {
        this._id = id;
        this.title = title;
        this.description = description;
        this.timeMinutes = inMinutes;
        this._status = TaskStatus.Start;
        // when it is created, not changeable
        this._createdDate = new Date();
        this.timerStartedDate = undefined;
        this.timerFinishedDate = undefined;
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
     * @todo task-timer component only adjust the status by the setStatus
     */
    public get status(): TaskStatus {
        return this._status;
    }

    /** Returns true if task status is inprogress. */
    public isInProgress(): boolean {
        return this._status === TaskStatus.Inprogress && this.timeMinutes > 0;
    }

    /** Returns true if task status is completed/done. */
    public isCompleted(): boolean {
        return this._status === TaskStatus.Completed && this.timeMinutes <= 0;
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
        //     24hours in milliSec:                                 h    min
        const diff24hours_inMilliSec = TaskTimer.convertsToMilliSec(24 * 60);
        return currentClient_inMilliSec - task_inMilliSec < diff24hours_inMilliSec;
    }

    /**
     * Sets the status of the task.
     * @todo task-timer comp adjuts it.
     * @param statusValue 
     */
    private setStatus(statusValue: TaskStatus) {
        this._status = statusValue;
    }
}
