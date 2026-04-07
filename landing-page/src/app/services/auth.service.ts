import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AdminSessionStore } from './admin-session.store';

export interface MeUser {
  id: string;
  email: string;
  role: string;
  nivel: number;
  nomeExibicao?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly store = inject(AdminSessionStore);

  readonly user = signal<MeUser | null>(null);

  readonly isAdminNivel0 = computed(() => {
    const u = this.user();
    return u?.role === 'admin' && u?.nivel === 0;
  });

  private apiBase(): string {
    return (environment.apiUrl || '').replace(/\/$/, '');
  }

  restoreSession(): Observable<void> {
    const base = this.apiBase();
    if (!base || !this.store.getToken()) {
      this.user.set(null);
      return of(undefined);
    }
    return this.http.get<MeUser>(`${base}/api/auth/me`).pipe(
      tap((u) => this.user.set(u)),
      map(() => undefined),
      catchError(() => {
        this.store.clear();
        this.user.set(null);
        return of(undefined);
      }),
    );
  }

  login(email: string, password: string): Observable<void> {
    const base = this.apiBase();
    return this.http
      .post<{ token: string; user: MeUser }>(`${base}/api/auth/login`, { email, password })
      .pipe(
        tap(({ token, user }) => {
          this.store.setToken(token);
          this.user.set(user);
        }),
        map(() => undefined),
      );
  }

  logout(): void {
    this.store.clear();
    this.user.set(null);
  }
}
