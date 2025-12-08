// Firebase Realtime Database REST API configuration
export const FIREBASE_DB_URL = 'https://daily-time-tracker-analytics-default-rtdb.asia-southeast1.firebasedatabase.app';

// REST API helper functions
export const firebaseApi = {
  async get<T>(path: string): Promise<T | null> {
    const response = await fetch(`${FIREBASE_DB_URL}/${path}.json`);
    if (!response.ok) throw new Error('Failed to fetch data');
    return response.json();
  },

  async post<T>(path: string, data: T): Promise<{ name: string }> {
    const response = await fetch(`${FIREBASE_DB_URL}/${path}.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create data');
    return response.json();
  },

  async put<T>(path: string, data: T): Promise<T> {
    const response = await fetch(`${FIREBASE_DB_URL}/${path}.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update data');
    return response.json();
  },

  async patch<T>(path: string, data: Partial<T>): Promise<T> {
    const response = await fetch(`${FIREBASE_DB_URL}/${path}.json`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to patch data');
    return response.json();
  },

  async delete(path: string): Promise<void> {
    const response = await fetch(`${FIREBASE_DB_URL}/${path}.json`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete data');
  },
};
