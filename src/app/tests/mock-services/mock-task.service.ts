import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";

import { FakedTask } from "../models/faked-task.model";
import { Task } from "../../modules/task/services/task.model";

@Injectable()
export class MockTaskService {
    /** It emtis changes of the task list, if get/deted/updated item from the list. */
    public readonly taskList$: BehaviorSubject<Task[]>;
    constructor() {
        this.taskList$ = new BehaviorSubject<Task[]>([]);
    }

    /**
     * Retruns the faked tasks from the server.
     * @returns Task[]
     * @memberof MockTaskService
     */
    public getAll(): Observable<Task[]> {
        return of(FakedTask.list);
    }

    /**
     * Returns the actual task by task id from the server.
     * @param taskId The id of the task instance.
     * @returns Task
     * @memberof MockTaskService
    */
    public get(taskId: string): Observable<Task> {
        return of(FakedTask.list.find(task => task.id === taskId) as Task);
    }

    /**
     * Returns the new Task instance into the Faked taskList.
     * @param task The new Task instance.
     * @returns new Task
     * @memberof MockTaskService
     */
    public add(task: Task): Observable<Task> {
        FakedTask.addNewTask(task);
        this.taskList$.next(FakedTask.list);
        return of(task);
    }

    /**
     * Returns the updated Task instance from the Faked taskList.
     * @param task The modified Task instance.
     * @returns updated Task
     * @memberof MockTaskService
     */
    public update(task: Task): Observable<Task> {
        const foundTaskIndex = FakedTask.list.findIndex(taskItem => taskItem.id === task.id);
        FakedTask.list[foundTaskIndex] = task;
        this.taskList$.next(FakedTask.list);
        return of(task);
    }

    /**
     * Return true if the saving all tasks is run well, 
     * otherwise returns false there is a trouble during saving.
     * @param tasks Task items
     * @returns boolean
     */
    public saveAllTask(tasks: Task[]): Observable<boolean> {
        if (tasks.length > 0) {
            FakedTask.list = tasks;
            this.taskList$.next(FakedTask.list);
            return of(true);
        }

        return of(false);
    }

    /**
     * Returns true if the delete request run successfully.
     * Deleting the task by task id from the faked taskList.
     * @param taskId The id of the task which will be removed.
     * @returns boolean
     * @memberof MockTaskService
     */
    public delete(taskId: string): Observable<boolean> {
        const fakedIndex = FakedTask.list.findIndex(task => task.id === taskId);
        FakedTask.list.splice(fakedIndex, 1);
        this.taskList$.next(FakedTask.list);
        return of(true);
    }
}
