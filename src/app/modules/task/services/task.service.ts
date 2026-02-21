import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, from } from 'rxjs';
import { map } from 'rxjs/operators';

import { Task, TaskStatus } from './task.model';
import { environment } from '../../../../environments/environment';

@Injectable()
export class TaskService {
  /** This subject emtis changes of the task list, if get/deted/updated item from the list. */
  public readonly taskList$: BehaviorSubject<Task[]>;
  private _taskList: Task[];
  private readonly _isElectron: boolean;

  constructor() {
    this._taskList = [];
    this.taskList$ = new BehaviorSubject<Task[]>(this._taskList);

     // Check if running in Electron
    this._isElectron = !!(window && (window as any).electronAPI);

    // Only seed with faked tasks in non-production when not running in Electron
    if (!environment.production && !this._isElectron) {
      // Todo: temporary, add new faked task for test cases
      const task1 = new Task('', 'statusChanged');
      task1.setStatus(TaskStatus.Start);
      task1.description = 'This task is created to test status change';
      this._taskList.push(task1);

      const task2 = new Task('', 'oldTask-yesterday', '', 10);
      task2.setStatus(TaskStatus.Completed);
      const yesterdayDay = new Date();
      yesterdayDay.setDate(yesterdayDay.getDate() - 1);
      task2.createdDate = yesterdayDay;
      task2.timerStartedDate = yesterdayDay;
      const tenMinsInMillisecond = 10 * 60*1000;
      task2.timerFinishedDate = new Date(yesterdayDay.getTime() + tenMinsInMillisecond);
      this._taskList.push(task2);
    }

    this.taskList$.next(this._taskList);
  }

  /**
   * Returns the all tasks from the server or Electron.
   * @returns Task[]
   */
  public getAll(): Observable<Task[]> {
    // If running in Electron, use Electron API
    if (this._isElectron) {
      return from(this._electronGetAllTask())
      .pipe(map((rawTasks: object[]) => {
        const wrappedTasks = rawTasks.map(rawTask => {
          const typedTask = rawTask as  {[prop: string]: string | number | Date};
          const task = Task.convertObjectToTask(typedTask);
          return task;
        });
        
        this._taskList = wrappedTasks;
        this.taskList$.next(wrappedTasks);
        return wrappedTasks;
      }));
    }
    
    /*return this.http.get<Task[]>(this._taskUrl, {headers: ServiceBase.HttpHeaders})
    .pipe(map((tasks: Task[]) => {
      this._taskList = tasks;
      this.taskList$.next(tasks);
      return tasks;
    }));*/
    this.taskList$.next(this._taskList);
    return of(this._taskList);
  }

  /**
   * Returns the actual task by task id from stored task list.
   * @param taskId The id of the task instance.
   * @returns Task
   */
  public get(taskId: string): Observable<Task> {
    // return this.http.get<Task>(`${this._taskUrl}/${taskId}`, {headers: ServiceBase.HttpHeaders});
    return of(this._taskList.find(task => task.id === taskId) as Task);
  }

  /**
   * Returns the new Task instance from electron main process if the inserting is success.
   * @param task The new Task instance.
   * @returns new Task
   */
  public add(task: Task): Observable<Task> {
    /*return this.http.post<Task>(`${this._taskUrl}/`, task, {headers: ServiceBase.HttpHeaders})
    .pipe(map((newTask: Task) => {
      this._taskList.push(newTask);
      this.taskList$.next(this._taskList);
      return newTask;
    }));*/

    // get generated guid for task
    task['_id'] = this._createUUID();
    this._taskList.push(task);
    this.taskList$.next(this._taskList);
    if (this._isElectron) {
      this._electronSaveTasks(this._taskList);
    }
    return of(task);
  }

  /**
   * Returns the updated Task instance from the electron main process if the updated is success.
   * @param task The modified Task instance.
   * @returns updated Task
   */
  public update(task: Task): Observable<Task> {
    /*return this.http.put<Task>(`${this._taskUrl}/${task.id}`, task, {headers: ServiceBase.HttpHeaders})
    .pipe(map((updatedTask: Task) => {
      // The checking is unnecessary as the request run into good branch,
      // so server found the item in the list and updated it.
      const foundTaskIndex = this._taskList.findIndex(taskItem => taskItem.id === updatedTask.id);
      this._taskList[foundTaskIndex] = updatedTask;
      this.taskList$.next(this._taskList);
      return updatedTask;
    }));*/

    const foundTaskIndex = this._taskList.findIndex(taskItem => taskItem.id === task.id);
    if (foundTaskIndex > -1) {
      this._taskList[foundTaskIndex] = task;
      this.taskList$.next(this._taskList);
      if (this._isElectron) {
        this._electronSaveTasks(this._taskList);
      }
    }
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
      /*return this.http.post<Task>(`${this._taskUrl}/`, tasks, {headers: ServiceBase.HttpHeaders})
      .pipe(map((savedAllTask: Task[]) => {
        this.taskList$.next(savedAllTask);
        return true;
      }));*/

      this._taskList = tasks;
      this.taskList$.next(this._taskList);
      if (this._isElectron) {
        this._electronSaveTasks(this._taskList);
      }
      return of(true);
    }

    return of(false);
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
    if (this._isElectron) {
      this._electronSaveTasks(this._taskList);
    }
    return of(true);
  }

  /** 
   * Returns true if the task is already exist in the list, otherwise false.
   * @param task The task instance to check.
   * @returns boolean
   */
  public isTaskAlreadyExist(task: Task): boolean {
    return this._taskList.findIndex(taskItem => taskItem.id === task.id) > -1;
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
      } catch (error: unknown) {
        throw Error(error instanceof Error ? error.message : 'Unknown error occurred');
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
