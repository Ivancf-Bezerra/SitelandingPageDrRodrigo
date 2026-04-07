import { Injectable } from '@angular/core';

const KEY = 'admin_jwt';

@Injectable({ providedIn: 'root' })
export class AdminSessionStore {
  getToken(): string | null {
    try {
      return sessionStorage.getItem(KEY);
    } catch {
      return null;
    }
  }

  setToken(token: string): void {
    try {
      sessionStorage.setItem(KEY, token);
    } catch {
      /* ignore */
    }
  }

  clear(): void {
    try {
      sessionStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
  }
}
