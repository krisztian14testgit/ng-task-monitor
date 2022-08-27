import { HttpClientTestingModule } from '@angular/common/http/testing';
import { fakeAsync, inject, TestBed } from '@angular/core/testing';
import { throwError } from 'rxjs';

import { FakedTask } from '../../../tests/models/faked-task.model';
import { Task } from './task.model';

import { TaskService } from './task.service';

describe('TaskService', () => {
  let service: TaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskService]
    });

    service = TestBed.inject(TaskService);

    // it is used for add, update, remove methods
    spyOn(service as any, '_electronSaveTasks').and.stub();
  });

  it('should be created', inject([TaskService], (instance: TaskService) => {
    expect(instance).toBeTruthy();
  }));

  it('should get all tasks', fakeAsync(() =>{
    spyOn(service as any, '_electronGetAllTask').and.returnValue(Promise.resolve(FakedTask.list));
    const fakedTaskList = FakedTask.list;
    service.getAll().subscribe(taskList => {
      expect(taskList).toBeDefined();
      expect(taskList.length).toBe(fakedTaskList.length);
      expect(taskList.length).toBeGreaterThan(0);
      expect(taskList[0].id).toBe(fakedTaskList[0].id);
    });
    
  }));

  it('should NOT get all tasks, Internal Electron Error', fakeAsync(() =>{
    spyOn(service, 'getAll').and.callFake(() => throwError(new Error('Internal Electron Error')));
    
    service.getAll().subscribe(()=> {return ;}, (err: Error) => {
      expect(err.message).toBe('Internal Electron Error');
    });

  }));

  it('should get current task by taskId', fakeAsync(() => {
    const taskIndex = 0;
    const taskId = FakedTask.list[taskIndex].id;
    service['_taskList'] = FakedTask.list;
    service.get(taskId).subscribe(task => {
      expect(task).toBeDefined();
      expect(task.id).toBe(taskId);
    });
  }));

  it('should add new task', fakeAsync(() => {
    expect(service['_taskList'].length).toBe(0);
    
    const newTask = new Task('', 'newTask', 'for testing', 2.0);
    service.add(newTask).subscribe(insertedTask => {
      expect(insertedTask).toBeDefined();
      expect(insertedTask.id).not.toBe('');
      expect(insertedTask.title).toBe(newTask.title);
    });
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
  }));

  it('shoud remove the taks by id', fakeAsync(() => {
    const removedTaskId = FakedTask.list[0].id;
    service.delete(removedTaskId).subscribe(isDeleted => {
      expect(isDeleted).toBeTrue();
    });
  }));

  it('shoud NOT remove the taks, removing is failed', fakeAsync(() => {
    spyOn(service, 'delete').and.callFake(() => throwError(new Error('Internal Electron Error')));
    
    const removedTaskId = FakedTask.list[0].id;
    service.delete(removedTaskId).subscribe(() => {return ;}, (err: Error) => {
      expect(err.message).toBe('Internal Electron Error');
    });
  }));

  it('should get list by BehaviorSubject', fakeAsync(() => {
    spyOn(service as any, '_electronGetAllTask').and.returnValue(Promise.resolve(FakedTask.list));
    
    service.taskList$.subscribe(list => {
      if (list.length > 0) {
        expect(list.length).toBeGreaterThan(0);
        expect(list.length).toBe(FakedTask.list.length);
      } else {
        expect(list.length).toBe(0);
      }
    });

    service.getAll().subscribe();
  }));
});
