import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { Task, TaskStatus } from './task.model';
import { environment } from '../../../../environments/environment';

import { FakedTask } from '../../../tests/models/faked-task.model';

@Injectable()
export class TaskService {
  /** This subject emtis changes of the task list, if get/deted/updated item from the list. */
  public readonly taskList$: BehaviorSubject<Task[]>;
  private readonly _taskUrl = `${environment.host}task`;
  private _taskList: Task[];

  constructor(private readonly http: HttpClient) {
    this._taskList = [];
    this.taskList$ = new BehaviorSubject<Task[]>(this._taskList);
    
    // Todo: temporay, add new faked task for test cases
    const task1 = new Task('', 'statusChanged');
    FakedTask.addNewTask(task1, TaskStatus.Completed);

    const task2 = new Task('', 'oldTask-yesterday', '', 10);
    FakedTask.addNewTask(task2, TaskStatus.Completed, '2022-06-30 18:00:00');

    const task3 = new Task('', 'oldTask3', '', 10);
    FakedTask.addNewTask(task3, TaskStatus.Completed, '2022-06-28 18:00:00');
    this.taskList$.next(FakedTask.list);
  }

  /**
   * Retruns the all tasks from the server.
   * @returns Task[]
   */
  public getAll(): Observable<Task[]> {
    
    /*return this.http.get<Task[]>(this._taskUrl, {headers: ServiceBase.HttpHeaders})
    .pipe(map((tasks: Task[]) => {
      this._taskList = tasks;
      this.taskList$.next(tasks);
      return tasks;
    }));*/

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
   * Returns the actual task by task id from the server.
   * @param taskId The id of the task instance.
   * @returns Task
   */
  public get(taskId: string): Observable<Task> {
    // return this.http.get<Task>(`${this._taskUrl}/${taskId}`, {headers: ServiceBase.HttpHeaders});
    return of(FakedTask.list.find(task => task.id === taskId) as Task);
  }

  /**
   * Returns the new Task instance from the server if the inserting is success.
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
    this._electronSaveTasks(this._taskList);
    return of(task);
  }

  /**
   * Returns the updated Task instance from the server if the updated is success.
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
    this._taskList[foundTaskIndex] = task;
    this.taskList$.next(this._taskList);
    this._electronSaveTasks(this._taskList);
    return of(task);
  }

  /**
   * Returns true if the delete request run successfully.
   * Deleting the task by task id from the server.
   * @param taskId The id of the task which will be removed.
   * @returns boolean
   */
  public delete(taskId: string): Observable<boolean> {
    /*return this.http.delete(`${this._taskUrl}/${taskId}`, {headers: ServiceBase.HttpHeaders})
    .pipe(map(_ => {
      const taskIndex = this._taskList.findIndex(task => task.id === taskId);
      this._taskList.splice(taskIndex, 1);
      this.taskList$.next(this._taskList);
      return true;
    }));*/

    const fakedIndex = FakedTask.list.findIndex(task => task.id === taskId);
    FakedTask.list.splice(fakedIndex, 1);
    this.taskList$.next(FakedTask.list);
    return of(true);
  }

  /**
   * Emits the given taskList via ipc communication of electron to save list.
   * @param taskList Task items
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
   */
  private _electronGetAllTask(): Promise<Task[]> {
    return (window as any).electronAPI.ipcTaskList.getAll();
  }

  /** Returns the genereted Uuid/Guid as string. */
  private _createUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
       const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
       return v.toString(16);
    });
 }
}
