import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { Task } from './task.model';

@Injectable()
export class TaskService {
  /** This subject emtis changes of the task list, if get/deted/updated item from the list. */
  public readonly taskList$: BehaviorSubject<Task[]>;
  private _taskList: Task[];

  constructor() {
    this._taskList = [];
    this.taskList$ = new BehaviorSubject<Task[]>(this._taskList);
  }

  /**
   * Retruns the all tasks from the electorn main process.
   * @returns Task[]
   */
  public getAll(): Observable<Task[]> {
    return from(this._electronGetAllTask())
    .pipe(map((rawTasks: object[]) => {
      const wrappedTasks = rawTasks.map(rawTask => {
        const task = Task.convertObjectToTask(rawTask);
        return task;
      });

      this._taskList = wrappedTasks;
      this.taskList$.next(wrappedTasks);
      return wrappedTasks;
    }));
  }

  /**
   * Returns the actual task by task id from stored task list.
   * @param taskId The id of the task instance.
   * @returns Task
   */
  public get(taskId: string): Observable<Task> {
    return of(this._taskList.find(task => task.id === taskId) as Task);
  }

  /**
   * Returns the new Task instance from electron main process if the inserting is success.
   * @param task The new Task instance.
   * @returns new Task
   */
  public add(task: Task): Observable<Task> {
    // get generated guid for task
    task['_id'] = this._createUUID();
    this._taskList.push(task);
    this.taskList$.next(this._taskList);
    this._electronSaveTasks(this._taskList);
    return of(task);
  }

  /**
   * Returns the updated Task instance from the electron main process if the updated is success.
   * @param task The modified Task instance.
   * @returns updated Task
   */
  public update(task: Task): Observable<Task> {
    const foundTaskIndex = this._taskList.findIndex(taskItem => taskItem.id === task.id);
    this._taskList[foundTaskIndex] = task;
    this.taskList$.next(this._taskList);
    this._electronSaveTasks(this._taskList);
    return of(task);
  }

  /**
   * Returns true if the delete request run successfully.
   * Deleting the tasks by the ids from taskList.json.
   * @param taskIdArgs It can be one or more ids of the tasks which will be removed.
   * @returns boolean
   */
  public delete(...taskIdArgs: string[]): Observable<boolean> {
    let taskIndex = -1;
    for (const taskId of taskIdArgs) {
      taskIndex = this._taskList.findIndex(task => task.id === taskId);
      if (taskIndex > -1) {
        this._taskList.splice(taskIndex, 1);
      }
    }

    this.taskList$.next(this._taskList);
    this._electronSaveTasks(this._taskList);
    return of(true);
  }

  /**
   * Emits the given taskList via ipc communication of electron to save list.
   * @param taskList Task items
   * @memberof Electron ipcTaskList
   */
  private _electronSaveTasks(taskList: Task[]) {
    if (taskList.length > 0) {
      try {
        (window as any).electronAPI.ipcTaskList.save(taskList);
      } catch (error: any) {
        throw Error(error.message);
      }
    }
  }

  /**
   * Retruns the saved task items from task.list.json via ipc communication of electron.
   * @returns Promise<Task[]>
   * @memberof Electron ipcTaskList
   */
  private _electronGetAllTask(): Promise<Task[]> {
    return (window as any).electronAPI.ipcTaskList.getAll();
  }

  /** 
   * Returns the genereted Uuid/Guid as string.
   * @return string*/
  private _createUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
       const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
       return v.toString(16);
    });
 }
}
