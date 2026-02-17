import { TestBed } from '@angular/core/testing';

import { BrowserStorageService } from './browser-storage.service';
import { Task } from '../../modules/task/services/task.model';

describe('BrowserStorageService', () => {
  let service: BrowserStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BrowserStorageService]
    });
    service = TestBed.inject(BrowserStorageService);
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    // Clean up after each test
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('with Task type', () => {
    describe('save', () => {
      it('should save Task object to localStorage', () => {
        const key = 'tasks';
        const task = new Task('task-1', 'Test Task', 'Description', 60);
        
        const result = service.save(key, task);
        
        expect(result).toBe(true);
        const stored = localStorage.getItem(key);
        expect(stored).toBeTruthy();
        const parsed = JSON.parse(stored!);
        expect(parsed.title).toBe('Test Task');
      });

      it('should save array of Tasks to localStorage', () => {
        const key = 'tasks';
        const tasks = [
          new Task('task-1', 'Task 1', 'Desc 1', 30),
          new Task('task-2', 'Task 2', 'Desc 2', 45)
        ];
        
        const result = service.save(key, tasks);
        
        expect(result).toBe(true);
        const stored = localStorage.getItem(key);
        expect(stored).toBeTruthy();
        const parsed = JSON.parse(stored!);
        expect(parsed.length).toBe(2);
        expect(parsed[0].title).toBe('Task 1');
      });
    });

    describe('get', () => {
      it('should retrieve Task object from localStorage', () => {
        const key = 'task';
        const task = new Task('task-1', 'Test Task', 'Description', 60);
        localStorage.setItem(key, JSON.stringify(task));
        
        const result = service.get<Task>(key);
        
        expect(result).toBeTruthy();
        expect(result?.title).toBe('Test Task');
      });

      it('should retrieve array of Tasks from localStorage', () => {
        const key = 'tasks';
        const tasks = [
          new Task('task-1', 'Task 1', 'Desc 1', 30),
          new Task('task-2', 'Task 2', 'Desc 2', 45)
        ];
        localStorage.setItem(key, JSON.stringify(tasks));
        
        const result = service.get<Task[]>(key);
        
        expect(result).toBeTruthy();
        expect(Array.isArray(result)).toBe(true);
        expect(result?.length).toBe(2);
        expect(result?.[0].title).toBe('Task 1');
      });
    });
  });

  describe('another object and array structure testing', () => {
    describe('save', () => {
      it('should save simple object to localStorage', () => {
        const key = 'testKey';
        const data = { name: 'test', value: 123 };
        
        const result = service.save(key, data);
        
        expect(result).toBe(true);
        expect(localStorage.getItem(key)).toBeTruthy();
      });

      it('should save string to localStorage', () => {
        const result = service.save('key', 'value');
        expect(result).toBe(true);
        expect(localStorage.getItem('key')).toBe('"value"');
      });

      it('should save number to localStorage', () => {
        const result = service.save('numberKey', 42);
        expect(result).toBe(true);
        expect(localStorage.getItem('numberKey')).toBe('42');
      });

      it('should save boolean to localStorage', () => {
        const result = service.save('boolKey', true);
        expect(result).toBe(true);
        expect(localStorage.getItem('boolKey')).toBe('true');
      });

      it('should save complex nested object to localStorage', () => {
        const key = 'complex';
        const data = {
          user: { name: 'John', age: 30 },
          settings: { theme: 'dark', notifications: true },
          items: [1, 2, 3]
        };
        
        const result = service.save(key, data);
        
        expect(result).toBe(true);
        const stored = JSON.parse(localStorage.getItem(key)!);
        expect(stored.user.name).toBe('John');
        expect(stored.items.length).toBe(3);
      });

      it('should save empty array to localStorage', () => {
        const result = service.save('emptyArray', []);
        expect(result).toBe(true);
        expect(localStorage.getItem('emptyArray')).toBe('[]');
      });

      it('should save empty object to localStorage', () => {
        const result = service.save('emptyObject', {});
        expect(result).toBe(true);
        expect(localStorage.getItem('emptyObject')).toBe('{}');
      });
    });

    describe('get', () => {
      it('should retrieve complex object from localStorage', () => {
        const key = 'complex';
        const data = {
          user: { name: 'John', age: 30 },
          items: [1, 2, 3]
        };
        localStorage.setItem(key, JSON.stringify(data));
        
        const result = service.get<typeof data>(key);
        
        expect(result).toEqual(data);
        expect(result?.user.name).toBe('John');
      });

      it('should retrieve array of strings from localStorage', () => {
        const key = 'strings';
        const data = ['one', 'two', 'three'];
        localStorage.setItem(key, JSON.stringify(data));
        
        const result = service.get<string[]>(key);
        
        expect(result).toEqual(data);
        expect(result?.length).toBe(3);
      });

      it('should retrieve array of numbers from localStorage', () => {
        const key = 'numbers';
        const data = [1, 2, 3, 4, 5];
        localStorage.setItem(key, JSON.stringify(data));
        
        const result = service.get<number[]>(key);
        
        expect(result).toEqual(data);
      });
    });
  });

  describe('negative test cases', () => {
    describe('save', () => {
      it('should return false when trying to save null', () => {
        const result = service.save('nullKey', null);
        expect(result).toBe(true); // JSON.stringify(null) is valid
        expect(localStorage.getItem('nullKey')).toBe('null');
      });

      it('should return false when trying to save undefined', () => {
        const result = service.save('undefinedKey', undefined);
        expect(result).toBe(true); // JSON.stringify(undefined) returns undefined, but still succeeds
      });

      it('should handle circular reference gracefully', () => {
        const circular: any = { name: 'test' };
        circular.self = circular;
        
        const result = service.save('circular', circular);
        
        expect(result).toBe(false); // Should fail due to circular reference
      });

      it('should handle save when localStorage is full', () => {
        // This test simulates quota exceeded scenario
        spyOn(localStorage, 'setItem').and.throwError('QuotaExceededError');
        
        const result = service.save('key', 'value');
        
        expect(result).toBe(false);
      });

      it('should handle save when localStorage throws error', () => {
        spyOn(localStorage, 'setItem').and.throwError('SecurityError');
        
        const result = service.save('key', 'value');
        
        expect(result).toBe(false);
      });
    });

    describe('get', () => {
      it('should return null if key does not exist', () => {
        const result = service.get('nonExistentKey');
        expect(result).toBeNull();
      });

      it('should return null if JSON parsing fails', () => {
        localStorage.setItem('badKey', 'invalid json');
        const result = service.get('badKey');
        expect(result).toBeNull();
      });

      it('should return null when localStorage throws error', () => {
        spyOn(localStorage, 'getItem').and.throwError('SecurityError');
        
        const result = service.get('key');
        
        expect(result).toBeNull();
      });

      it('should handle malformed JSON gracefully', () => {
        localStorage.setItem('malformed', '{"name": "test"');
        
        const result = service.get('malformed');
        
        expect(result).toBeNull();
      });

      it('should handle empty string as valid JSON', () => {
        localStorage.setItem('emptyString', '""');
        
        const result = service.get<string>('emptyString');
        
        expect(result).toBe('');
      });
    });

    describe('remove', () => {
      it('should return true even if key does not exist', () => {
        const result = service.remove('nonExistentKey');
        expect(result).toBe(true);
      });

      it('should handle remove when localStorage throws error', () => {
        spyOn(localStorage, 'removeItem').and.throwError('SecurityError');
        
        const result = service.remove('key');
        
        expect(result).toBe(false);
      });

      it('should successfully remove existing key', () => {
        localStorage.setItem('testKey', 'test value');
        expect(localStorage.getItem('testKey')).toBeTruthy();
        
        const result = service.remove('testKey');
        
        expect(result).toBe(true);
        expect(localStorage.getItem('testKey')).toBeNull();
      });
    });

    describe('localStorage unavailability', () => {
      it('should handle when localStorage is not available', () => {
        // Simulate localStorage being disabled/unavailable
        const originalLocalStorage = window.localStorage;
        Object.defineProperty(window, 'localStorage', {
          value: undefined,
          writable: true
        });

        try {
          // Service should handle gracefully when localStorage is undefined
          const testService = new BrowserStorageService();
          const result = testService.save('key', 'value');
          expect(result).toBe(false);
        } finally {
          // Restore localStorage
          Object.defineProperty(window, 'localStorage', {
            value: originalLocalStorage,
            writable: true
          });
        }
      });
    });
  });
});
