import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AdminSessionStore } from './admin-session.store';
import { ApiRuntimeConfigService } from './api-runtime-config.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const base = inject(ApiRuntimeConfigService).apiBase();
  if (!base || !req.url.startsWith(base)) {
    return next(req);
  }
  const token = inject(AdminSessionStore).getToken();
  if (!token) {
    return next(req);
  }
  return next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
};
