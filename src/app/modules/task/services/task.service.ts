import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

import { Task, TaskStatus } from './task.model';
import { environment } from '../../../../environments/environment';

import { BrowserStorageService } from '../../../services/browser-storage/browser-storage.service';

@Injectable()
export class TaskService {
  private readonly _taskUrl = `${environment.host}task`;
  private _taskList: Task[];
  private readonly STORAGE_KEY = 'ng-task-monitor-tasks';
  private readonly http = inject(HttpClient);
  private readonly browserStorage = inject(BrowserStorageService);

  /** This subject emtis changes of the task list, if get/deted/updated item from the list. */
  public readonly taskList$ =  new BehaviorSubject<Task[]>([]);

  constructor() {
    this._taskList = [];
    
    // Todo: temporay, add new faked task for test cases
    const task1 = new Task('', 'statusChanged');
    task1.setStatus(TaskStatus.Start);
    task1.description = 'This task is created to test status change';
    this._taskList.push (task1);

    const task2 = new Task('', 'oldTask-yesterday', '', 10);
    task2.setStatus(TaskStatus.Start);
    const yesterdayDay = new Date();
    yesterdayDay.setDate(yesterdayDay.getDate() - 1);
    task2.createdDate = yesterdayDay;
    this._taskList.push (task2);
    
    // storing faked tasks into localStorage
    this.browserStorage.save(this.STORAGE_KEY, this._taskList);
    this.taskList$.next(this._taskList);
  }

  /**
   * Loads tasks from localStorage.
   * Extracted to avoid code duplication.
   */
  private receiveTasksFromStorage(): Task[] {
    const storedTasks = this.browserStorage.get<unknown[]>(this.STORAGE_KEY);

    if (storedTasks === null) {
      return [];
    }

    const retTaskArray: Task[] = [];
    let tempTask: Task;
    for (let i = 0; i < storedTasks.length; i++) {
      // Check if the item is already a Task instance
      if (storedTasks[i] instanceof Task) {
        retTaskArray.push(storedTasks[i] as Task);
      } else {
        const taskItem = storedTasks[i] as {[prop: string]: string | number | Date};
        taskItem['_id'] = `faked-${i}-${taskItem['title']}`;
        tempTask = Task.convertObjectToTask(taskItem);
        retTaskArray.push(tempTask);
      }
    }
    
    return retTaskArray;
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
    
    this._taskList = this.receiveTasksFromStorage();
    this.taskList$.next(this._taskList);
    return of(this._taskList);
  }

  /**
   * Returns the actual task by task id from the server.
   * @param taskId The id of the task instance.
   * @returns Task
   */
  public get(taskId: string): Observable<Task> {
    // return this.http.get<Task>(`${this._taskUrl}/${taskId}`, {headers: ServiceBase.HttpHeaders});
    return of(this._taskList.find(task => task.id === taskId) as Task);
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

    this._taskList.push(task);
    this.browserStorage.save(this.STORAGE_KEY, this._taskList);
    this.taskList$.next(this._taskList);
    return of(this._taskList[this._taskList.length - 1]);
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
    if (foundTaskIndex > -1) {
      this._taskList[foundTaskIndex] = task;
      this.browserStorage.save(this.STORAGE_KEY, this._taskList);
      this.taskList$.next(this._taskList);
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
      this.browserStorage.save(this.STORAGE_KEY, this._taskList);
      this.taskList$.next(this._taskList);
      return of(true);
    }

    return of(false);
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

    const foundIndex = this._taskList.findIndex(task => task.id === taskId);
    this._taskList.splice(foundIndex, 1);
    this.browserStorage.save(this.STORAGE_KEY, this._taskList);
    this.taskList$.next(this._taskList);
    return of(true);
  }
  
  
  /** 
   * Returns true if the task is already exist in the list, otherwise false.
   * @param taskId The id of the task which will be removed.
   * @returns boolean
   */
  public isTaskAlreadyExist(task: Task): boolean {
    return this._taskList.findIndex(taskItem => taskItem.id === task.id) > -1;
  }
}
