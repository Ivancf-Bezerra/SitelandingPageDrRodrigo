import { Component, computed, inject, input, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { SiteImagesService } from '../../services/site-images.service';

@Component({
  selector: 'app-editable-image',
  imports: [],
  templateUrl: './editable-image.html',
  styleUrl: './editable-image.css',
})
export class EditableImage {
  protected auth = inject(AuthService);
  protected images = inject(SiteImagesService);

  slotId = input.required<string>();
  fallbackSrc = input<string>('');
  alt = input<string>('');
  placeholderLabel = input<string>('Foto do Dr. Rodrigo');
  wrapperClass = input<string>('');
  imgClass = input<string>('absolute inset-0 w-full h-full object-cover');

  uploading = signal(false);
  errorMsg = signal<string | null>(null);

  src = computed(() => this.images.resolve(this.slotId(), this.fallbackSrc()));

  onFile(ev: Event) {
    const el = ev.target as HTMLInputElement;
    const file = el.files?.[0];
    el.value = '';
    if (!file) return;
    this.uploading.set(true);
    this.errorMsg.set(null);
    this.images.upload(this.slotId(), file).subscribe({
      next: () => this.uploading.set(false),
      error: (e: unknown) => {
        this.uploading.set(false);
        if (e instanceof HttpErrorResponse) {
          const body = e.error as { error?: string } | undefined;
          this.errorMsg.set(body?.error ?? e.message ?? 'Falha no envio');
        } else {
          this.errorMsg.set('Falha no envio');
        }
      },
    });
  }

  revert(ev: Event) {
    ev.stopPropagation();
    ev.preventDefault();
    this.errorMsg.set(null);
    this.images.clearSlot(this.slotId()).subscribe({
      error: (e: unknown) => {
        if (e instanceof HttpErrorResponse) {
          const body = e.error as { error?: string } | undefined;
          this.errorMsg.set(body?.error ?? e.message ?? 'Falha ao restaurar');
        } else {
          this.errorMsg.set('Falha ao restaurar');
        }
      },
    });
  }
}
