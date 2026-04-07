import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { AdminSessionStore } from './admin-session.store';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const base = (environment.apiUrl || '').replace(/\/$/, '');
  if (!base || !req.url.startsWith(base)) {
    return next(req);
  }
  const token = inject(AdminSessionStore).getToken();
  if (!token) {
    return next(req);
  }
  return next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
};
