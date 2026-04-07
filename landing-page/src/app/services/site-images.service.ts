import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { ApiRuntimeConfigService } from './api-runtime-config.service';

@Injectable({ providedIn: 'root' })
export class SiteImagesService {
  private readonly http = inject(HttpClient);
  private readonly apiConfig = inject(ApiRuntimeConfigService);

  /** Caminhos públicos retornados pela API (ex. `/uploads/arquivo.jpg`). */
  readonly overrides = signal<Record<string, string>>({});

  private apiBase(): string {
    return this.apiConfig.apiBase();
  }

  load(): Observable<void> {
    const base = this.apiBase();
    if (!base) {
      this.overrides.set({});
      return of(undefined);
    }
    return this.http.get<{ overrides: Record<string, string> }>(`${base}/api/site-images`).pipe(
      tap((r) => this.overrides.set(r.overrides || {})),
      map(() => undefined),
      catchError(() => {
        this.overrides.set({});
        return of(undefined);
      }),
    );
  }

  resolve(slotId: string, fallback: string): string {
    const path = this.overrides()[slotId];
    if (path) {
      const base = this.apiBase();
      if (!base) return fallback;
      return `${base}${path.startsWith('/') ? path : `/${path}`}`;
    }
    return fallback;
  }

  hasOverride(slotId: string): boolean {
    return !!this.overrides()[slotId];
  }

  upload(slotId: string, file: File): Observable<{ slotId: string; publicPath: string }> {
    const base = this.apiBase();
    const fd = new FormData();
    fd.append('file', file);
    return this.http
      .post<{ slotId: string; publicPath: string }>(
        `${base}/api/admin/images/${encodeURIComponent(slotId)}`,
        fd,
      )
      .pipe(
        tap((res) => {
          this.overrides.update((o) => ({ ...o, [res.slotId]: res.publicPath }));
        }),
      );
  }

  clearSlot(slotId: string): Observable<void> {
    const base = this.apiBase();
    return this.http.delete(`${base}/api/admin/images/${encodeURIComponent(slotId)}`).pipe(
      tap(() => {
        this.overrides.update((o) => {
          const n = { ...o };
          delete n[slotId];
          return n;
        });
      }),
      map(() => undefined),
    );
  }
}
