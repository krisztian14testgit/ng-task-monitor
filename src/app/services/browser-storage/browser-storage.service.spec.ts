import { TestBed } from '@angular/core/testing';

import { BrowserStorageService } from './browser-storage.service';

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

  describe('save', () => {
    it('should save data to localStorage', () => {
      const key = 'testKey';
      const data = { name: 'test', value: 123 };
      
      const result = service.save(key, data);
      
      expect(result).toBe(true);
      expect(localStorage.getItem(key)).toBeTruthy();
    });

    it('should return true on successful save', () => {
      const result = service.save('key', 'value');
      expect(result).toBe(true);
    });
  });

  describe('get', () => {
    it('should retrieve data from localStorage', () => {
      const key = 'testKey';
      const data = { name: 'test', value: 123 };
      localStorage.setItem(key, JSON.stringify(data));
      
      const result = service.get<typeof data>(key);
      
      expect(result).toEqual(data);
    });

    it('should return null if key does not exist', () => {
      const result = service.get('nonExistentKey');
      expect(result).toBeNull();
    });

    it('should return null if JSON parsing fails', () => {
      localStorage.setItem('badKey', 'invalid json');
      const result = service.get('badKey');
      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should remove data from localStorage', () => {
      const key = 'testKey';
      localStorage.setItem(key, 'test value');
      
      const result = service.remove(key);
      
      expect(result).toBe(true);
      expect(localStorage.getItem(key)).toBeNull();
    });

    it('should return true even if key does not exist', () => {
      const result = service.remove('nonExistentKey');
      expect(result).toBe(true);
    });
  });
});
