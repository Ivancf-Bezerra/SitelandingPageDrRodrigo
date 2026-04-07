import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.css',
})
export class AdminLogin {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  email = '';
  password = '';
  busy = signal(false);
  error = signal<string | null>(null);

  readonly apiConfigured = !!environment.apiUrl;

  submit() {
    if (!environment.apiUrl) {
      this.error.set('API não configurada (environment.apiUrl vazio).');
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
