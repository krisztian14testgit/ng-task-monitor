import { Injectable } from '@angular/core';

/**
 * Service for managing browser localStorage operations.
 * Provides methods to save, retrieve, and remove data from localStorage.
 */
@Injectable({
  providedIn: 'root'
})
export class BrowserStorageService {

  constructor() { }

  /**
   * Saves data to localStorage.
   * @param key The key under which to store the data
   * @param data The data to store (will be JSON stringified)
   * @returns true if save was successful, false otherwise
   */
  public save<T>(key: string, data: T): boolean {
    try {
      const jsonData = JSON.stringify(data);
      localStorage.setItem(key, jsonData);
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  }

  /**
   * Retrieves data from localStorage.
   * @param key The key of the data to retrieve
   * @returns The parsed data or null if not found or error occurs
   */
  public get<T>(key: string): T | null {
    try {
      const jsonData = localStorage.getItem(key);
      if (jsonData === null) {
        return null;
      }
      return JSON.parse(jsonData) as T;
    } catch (error) {
      console.error('Error retrieving from localStorage:', error);
      return null;
    }
  }

  /**
   * Removes data from localStorage.
   * @param key The key of the data to remove
   * @returns true if removal was successful, false otherwise
   */
  public remove(key: string): boolean {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  }
}
