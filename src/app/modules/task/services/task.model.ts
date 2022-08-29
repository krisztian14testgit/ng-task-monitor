import { TaskTimer } from "./task-timer/task-timer.model";

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
    Yesterday,
    Week
}

/**
 * The structure of the Task class.
 */
export class Task {
    /**
     * Maximum value of the timeMinutes prop. 24*60 = 1440 in minutes.
     * Therefore the task timer only counts down from 24 hours, as the tasks are daily.
     */
    static readonly MAX_MINUTES = 1440;
    /** The label/short name of the task. */
    title: string;
    /** The desscription of the task. */
    description: string;
    /**
     * The task timer: working/inProgress (storing minutes & seconds in decimal).
     * @important
     * Timer also can override this value via counting.
     * @info
     * The decimal range: [1 min, 1440 min]; 1440 min => 24 hours 
     */
    timeMinutes: number;    
    /** The timer date when the counterClock is start counting. */
    timerStartedDate: Date | undefined;
     /** The timer date when the counterClock is over. */
    timerFinishedDate: Date | undefined;

    private _id: string;
    private _createdDate: Date;
    private _status: TaskStatus;
    private _initialTime = 0;

    /**
     * Creating a Task instance. Default is empty task. 
     * * createdDate: is set up after the creation of the task instance.
     * * status: default value is TaskStatus.Start.
    */
     constructor(id = '', title = '', description = '', inMinutes = 0,
     status = 0, createdDateStr = '', timerStartedDateStr = '', timerFinishedDateStr = '') {
        this._id = id;
        this.title = title;
        this.description = description;
        this.timeMinutes = inMinutes;
        this._initialTime = inMinutes;
        this._status = status;
        this._createdDate = createdDateStr ? new Date(createdDateStr) : new Date();
        this.timerStartedDate = timerStartedDateStr ? new Date(timerStartedDateStr) : undefined;
        this.timerFinishedDate = timerFinishedDateStr ? new Date(timerFinishedDateStr) : undefined; 
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
     * * Start = 0
     * * Inprogress = 1
     * * Completed = 2
     * @access Readonly
     * @defaultValue TaskStatus.Start
     * @todo task-timer component only adjust the status by the setStatus
     */
    public get status(): TaskStatus {
        return this._status;
    }

    /** 
     * Preserves the origin/initial value of the timeMinutes. 
     * @access Readonly
     * @defaultValue is the first set timeMinutes value.
     */
    public get initialTime(): number {
        return this._initialTime;
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
     * The createdDate of Task is not less then the cleints current date.
     * Date diff range: 24 hours.
     * @returns boolean
     */
    public isCreatedToday(): boolean {
        const systemClock_inMilliSec = new Date().getTime();
        const task_inMilliSec = this._createdDate.getTime();
        const one_MilliSec = 1000;
         // 24hours in milliSec: 23:59
        const diff24hours_inMilliSec = TaskTimer.convertsToMilliSec(Task.MAX_MINUTES - one_MilliSec);
        return systemClock_inMilliSec - task_inMilliSec < diff24hours_inMilliSec;
    }

    /**
     * Returns true if the Task's createdDate is the previous day(yesterday).
     * Yesterday: more than 24hours.
     * @returns boolean
     */
    public isCreatedYesterday(): boolean {
        const currentTimeDay = new Date().getDay();
        const taskCreatedDay = this._createdDate.getDay();
        const yesterdayDiff = 1;
        return currentTimeDay - taskCreatedDay === yesterdayDiff;
    }

    /**
     * Returns true if the task class has the property otherwise returns false.
     * @param propertyName The name of the property.
     * @returns boolean
     */
    public isHasOwnPoperty(propertyName: string): boolean {
        const propertiesOfTask = Object.getOwnPropertyNames(this);
        return propertiesOfTask.includes(propertyName);
    }

    /**
     * Sets the status of the task.
     * @todo countdown-timer adjusts it.
     * @param statusValue 
     */
    public setStatus(statusValue: TaskStatus) {
        this._status = statusValue;
    }

    /**
     * Retruns new Task instance during converting the given object to the Task.
     * 
     * The one property of the object is different from the Task proprerties 
     * then the converting process will break with the error message.
     * @param obj 
     * @returns Task
     */
    public static convertObjectToTask(obj: {[prop: string]: any}): Task {
        const propNames = Object.getOwnPropertyNames(obj);
        const tempTask = new Task();

        // checking the converting is possilbe
        for (const objProp of propNames) {
            if (!tempTask.isHasOwnPoperty(objProp)) {
                throw new TypeError(`The conversation failed!
                The given obj has one property(${objProp}) which Task class does NOT HAVE!`);
            } 
        }

        // Converting process
        const retTask = new Task(obj._id, obj.title, obj.description,
            obj.timeMinutes, obj._status, obj._createdDate,
            obj.timerStartedDate, obj.timerFinishedDate);
        retTask['_initialTime'] = obj._initialTime;
        
        return retTask;
    }
}
