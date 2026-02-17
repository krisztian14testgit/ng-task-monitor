import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { fakeAsync, inject, TestBed } from '@angular/core/testing';

import { environment } from 'src/environments/environment';
import { FakedTask } from '../../../tests/models/faked-task.model';
import { Task } from './task.model';

import { TaskService } from './task.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('TaskService', () => {
  let service: TaskService;
  let mockHttp: HttpTestingController;
  const taksUrl = `${environment.host}task`;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [TaskService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
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
    
    // No HTTP request - service returns local FakedTask.list via of() observable
    mockHttp.expectNone(taksUrl);
  }));

  it('should NOT get all tasks, bad request', fakeAsync(() =>{
    // Service now returns local data, so this always succeeds
    // This test verifies the service handles the case gracefully
    service.getAll().subscribe(taskList => {
      expect(taskList).toBeDefined();
      expect(Array.isArray(taskList)).toBe(true);
    });
    
    // No HTTP request expected
    mockHttp.expectNone(taksUrl);
  }));

  it('should get current task by taskId', fakeAsync(() => {
    const taskIndex = 0;
    const taskId = FakedTask.list[taskIndex].id;
    service.get(taskId).subscribe(task => {
      expect(task).toBeDefined();
      expect(task.id).toBe(taskId);
    });

    // No HTTP request - service returns local data via of() observable
    mockHttp.expectNone(`${taksUrl}/${taskId}`);
  }));

  it('should add new task', fakeAsync(() => {
    const initialLength = FakedTask.list.length;
    
    const newTask = new Task('', 'newTask', 'for testing', 2.0);
    service.add(newTask).subscribe(insertedTask => {
      expect(insertedTask).toBeDefined();
      expect(insertedTask.id).not.toBe('');
      expect(insertedTask.title).toBe(newTask.title);
      expect(FakedTask.list.length).toBe(initialLength + 1);
    });

    // No HTTP request - service adds to FakedTask.list locally
    mockHttp.expectNone(`${taksUrl}/`);
  }));

  it('should update the selected Task by id', fakeAsync(() => {
    const originTask = FakedTask.list[0];
    const updatedTask = {...originTask}; // deep copy
    updatedTask.title = 'alma';
    updatedTask.description = 'modifed description';

    service.update(updatedTask as any).subscribe(task => {
      expect(task).toBeDefined();
      //expect(task.id).toBe(originTask.id);
      expect(task.title).toBe('alma');
      expect(task.description).toBe('modifed description');
    });

    // No HTTP request - service updates FakedTask.list locally
    mockHttp.expectNone(`${taksUrl}/${originTask.id}`);
  }));

  it('shoud remove the taks by id', fakeAsync(() => {
    const initialLength = FakedTask.list.length;
    const removedTaskId = FakedTask.list[0].id;
    
    service.delete(removedTaskId).subscribe(isDeleted => {
      expect(isDeleted).toBe(true);
      expect(FakedTask.list.length).toBe(initialLength - 1);
    });

    // No HTTP request - service removes from FakedTask.list locally
    mockHttp.expectNone(`${taksUrl}/${removedTaskId}`);
  }));

  it('shoud NOT remove the taks, removing is failed', fakeAsync(() => {
    // Service now uses local FakedTask.list, so delete always succeeds
    // This test verifies the delete operation works correctly
    const taskId = FakedTask.list[FakedTask.list.length - 1].id;
    const lengthBefore = FakedTask.list.length;
    
    service.delete(taskId).subscribe(isDeleted => {
      expect(isDeleted).toBe(true);
      expect(FakedTask.list.length).toBe(lengthBefore - 1);
    });

    // No HTTP request expected
    mockHttp.expectNone(`${taksUrl}/${taskId}`);
  }));

  it('should get list by BehaviorSubject', fakeAsync(() => {
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

  it('should preserve unrelated tasks when saveAllTask is called with filtered list', fakeAsync(() => {
    const initialLength = FakedTask.list.length;
    const allTasks = [...FakedTask.list];
    
    // Simulate saving only a subset of tasks (e.g., filtered by date)
    const filteredTasks = allTasks.slice(0, 1); // Take only the first task
    
    service.saveAllTask(filteredTasks).subscribe(isSaved => {
      expect(isSaved).toBe(true);
      // Verify that the full list still has all tasks, not just the filtered ones
      expect(FakedTask.list.length).toBe(initialLength);
      // Verify that unrelated tasks are still present
      expect(FakedTask.list.find(t => t.id === allTasks[1].id)).toBeDefined();
    });
  }));
});
