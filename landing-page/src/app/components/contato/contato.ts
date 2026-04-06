import { Component, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

type FormStatus = 'idle' | 'sending' | 'success' | 'error';

@Component({
  selector: 'app-contato',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contato.html',
  styleUrl: './contato.css'
})
export class Contato {
  formStatus = signal<FormStatus>('idle');

  procedimentos = [
    'Harmonização Orofacial',
    'Otomodelação',
    'Design de Sorriso',
    'Bioestimuladores',
    'Fios de PDO',
    'Toxina Botulínica',
    'Não sei ainda / Quero uma avaliação',
  ];

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      telefone: ['', [Validators.required, Validators.pattern(/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/)]],
      email: ['', [Validators.required, Validators.email]],
      procedimento: ['', Validators.required],
      mensagem: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.formStatus.set('sending');

    // Simula envio — integrar com EmailJS, backend ou serviço de e-mail
    setTimeout(() => {
      this.formStatus.set('success');
      this.form.reset();
    }, 1500);
  }

  resetForm() {
    this.formStatus.set('idle');
    this.form.reset();
  }
}
