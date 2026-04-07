import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';

/**
 * URL da API admin: primeiro `environment.apiUrl` (build), senão `api-config.json` na raiz do site (GitHub Pages).
 */
@Injectable({ providedIn: 'root' })
export class ApiRuntimeConfigService {
  private readonly resolved = signal<string>('');

  /** Base da API sem barra final. */
  readonly apiBaseUrl = this.resolved.asReadonly();

  async load(): Promise<void> {
    const fromEnv = (environment.apiUrl || '').trim().replace(/\/$/, '');
    let fromFile = '';
    if (!fromEnv) {
      try {
        const configUrl = new URL('api-config.json', document.baseURI).href;
        const r = await fetch(configUrl, { cache: 'no-store' });
        if (r.ok) {
          const j = (await r.json()) as { apiUrl?: string };
          fromFile = (j.apiUrl ?? '').trim().replace(/\/$/, '');
        }
      } catch {
        /* rede ou JSON inválido */
      }
    }
    this.resolved.set(fromEnv || fromFile);
  }

  /** Base da API (sem barra final), após `load()`. */
  apiBase(): string {
    return this.resolved();
  }
}
