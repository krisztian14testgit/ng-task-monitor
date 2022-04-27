import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, inject, TestBed } from '@angular/core/testing';

import { environment } from 'src/environments/environment';
import { FakedTask } from '../../../tests/models/faked-task.model';
import { Task } from './task.model';

import { TaskService } from './task.service';

describe('TaskService', () => {
  let service: TaskService;
  let mockHttp: HttpTestingController;
  const taksUrl = `${environment.host}task`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskService]
    });

    service = TestBed.inject(TaskService);
    mockHttp = TestBed.inject(HttpTestingController);
  });

  it('should be created', inject([TaskService], (instance: TaskService) => {
    expect(instance).toBeTruthy();
  }));

  it('should get all tasks', fakeAsync(() =>{
    const fakedTaskList = FakedTask.list;
    
    service.getAll().subscribe(taskList => {
      expect(taskList).toBeDefined();
      expect(taskList.length).toBe(fakedTaskList.length);
      expect(taskList.length).toBeGreaterThan(0);
      expect(taskList[0].id).toBe(fakedTaskList[0].id);
    });
    
    const reqPointer = mockHttp.expectOne({url: taksUrl, method: 'GET'});
    expect(reqPointer.request.method).toBe('GET');

    // send dummy data
    reqPointer.flush(fakedTaskList);
  }));

  it('should NOT get all tasks, bad request', fakeAsync(() =>{
    const fakedTaskList = FakedTask.list;
    
    service.getAll().subscribe(_ => {}, (err) => {
      expect(err.status).toBe(503);
      expect(err.statusText).toBe('Bad request');
    });
    
    const reqPointer = mockHttp.expectOne({url: taksUrl, method: 'GET'});
    expect(reqPointer.request.method).toBe('GET');

    // send dummy data
    reqPointer.flush(fakedTaskList, {status: 503, statusText: 'Bad request'});
  }));

  it('should get current task by taskId', fakeAsync(() => {
    const taskIndex = 0;
    const taskId = FakedTask.list[taskIndex].id;
    service.get(taskId).subscribe(task => {
      expect(task).toBeDefined();
      expect(task.id).toBe(taskId);
    });

    const reqPointer = mockHttp.expectOne({url: `${taksUrl}/${taskId}`, method: 'GET'});
    expect(reqPointer.request.method).toBe('GET');

    // send dummy task
    reqPointer.flush(FakedTask.list[taskIndex]);
  }));

  it('should add new task', fakeAsync(() => {
    expect(service['_taskList'].length).toBe(0);
    
    const newTask = new Task('', 'newTask', 'for testing', 2.0);
    service.add(newTask).subscribe(insertedTask => {
      console.log(insertedTask);
      expect(insertedTask).toBeDefined();
      expect(insertedTask.id).not.toBe('');
      expect(insertedTask.title).toBe(newTask.title);
    });

    const reqPointer = mockHttp.expectOne({url: `${taksUrl}/`, method: 'POST'});
    expect(reqPointer.request.method).toBe('POST');

    // send task
    const dummyTask = FakedTask.addNewTask(newTask);
    reqPointer.flush(dummyTask);
  }));

  it('should update the selected Task by id', fakeAsync(() => {
    const originTask = FakedTask.list[0];
    const updatedTask = Object.assign({}, originTask); // deep copy
    updatedTask.title = 'alma';
    updatedTask.description = 'modifed description';

    service.update(updatedTask).subscribe(task => {
      expect(task).toBeDefined();
      expect(task['_id']).toBe(originTask.id);
      expect(task.title).not.toBe(originTask.title);
      expect(task.description).not.toBe(originTask.description);
    });

    const reqPointer = mockHttp.expectOne({url: `${taksUrl}/${updatedTask.id}`, method: 'PUT'});
    expect(reqPointer.request.method).toBe('PUT');

    // dummy Task
    reqPointer.flush(updatedTask);
  }));

  it('shoud remove the taks by id', fakeAsync(() => {
    const removedTaskId = FakedTask.list[0].id;
    service.delete(removedTaskId).subscribe(isDeleted => {
      expect(isDeleted).toBeTrue();
    });

    const reqPointer = mockHttp.expectOne({url: `${taksUrl}/${removedTaskId}`, method: 'DELETE'});
    expect(reqPointer.request.method).toBe('DELETE');

    // removing is success
    reqPointer.flush(true);
  }));

  it('shoud NOT remove the taks, removing is failed', fakeAsync(() => {
    const removedTaskId = FakedTask.list[0].id;
    service.delete(removedTaskId).subscribe(_ => {}, (err) => {
      expect(err.status).toBe(500);
      expect(err.statusText).toBe('Internal Server Error');
    });

    const reqPointer = mockHttp.expectOne({url: `${taksUrl}/${removedTaskId}`, method: 'DELETE'});
    expect(reqPointer.request.method).toBe('DELETE');

    // removing is success
    reqPointer.flush(false, {status: 500, statusText: 'Internal Server Error'});
  }));

  it('should get list by BehaviorSubject', fakeAsync(() => {
    service.taskList$.subscribe(list => {
      if (list.length !== 0) {
        expect(list.length).toBeGreaterThan(0);
        expect(list.length).toBe(FakedTask.list.length);
      }
      expect(list.length).toBe(0);
    });

    service.getAll().subscribe();
  }));
});
