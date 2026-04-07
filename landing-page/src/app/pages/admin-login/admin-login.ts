import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { ApiRuntimeConfigService } from '../../services/api-runtime-config.service';

@Component({
  selector: 'app-admin-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.css',
})
export class AdminLogin {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly apiConfig = inject(ApiRuntimeConfigService);

  email = '';
  password = '';
  busy = signal(false);
  error = signal<string | null>(null);

  readonly apiConfigured = computed(() => !!this.apiConfig.apiBaseUrl());

  submit() {
    if (!this.apiConfig.apiBase()) {
      this.error.set(
        'API não configurada. Preencha public/api-config.json com apiUrl (e rode deploy) ou defina environment.apiUrl no build.',
      );
      return;
    }
    this.busy.set(true);
    this.error.set(null);
    this.auth.login(this.email.trim(), this.password).subscribe({
      next: () => {
        this.busy.set(false);
        this.password = '';
        void this.router.navigateByUrl('/');
      },
      error: (e: unknown) => {
        this.busy.set(false);
        if (e instanceof HttpErrorResponse) {
          const body = e.error as { error?: string } | undefined;
          this.error.set(body?.error ?? 'Falha no login');
        } else {
          this.error.set('Falha no login');
        }
      },
    });
  }
}
