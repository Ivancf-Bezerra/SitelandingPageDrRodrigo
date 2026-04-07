import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-contato-page',
  imports: [FormsModule, RouterLink],
  templateUrl: './contato-page.html',
})
export class ContatoPage {
  constructor(private sanitizer: DomSanitizer) {
    this.mapEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.1975535!2d-46.6557!3d-23.5505!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDMzJzAxLjgiUyA0NsKwMzknMjEuOCJX!5e0!3m2!1spt-BR!2sbr!4v0000000000'
    );
  }

  /** URL do WhatsApp (placeholder — alinhar com o botão flutuante / número real). */
  readonly whatsappHref = 'https://wa.me/5500000000000';

  nome       = '';
  telefone   = '';
  email      = '';
  mensagem   = '';
  enviando   = signal(false);
  enviado    = signal(false);
  erro       = signal('');

  mapEmbedUrl: SafeResourceUrl;

  readonly horarios = [
    { dia: 'Segunda — Sexta', hora: '08:00 às 18:00' },
    { dia: 'Sábado',          hora: '08:00 às 13:00' },
    { dia: 'Domingo',         hora: 'Fechado' },
  ];

  async enviarMensagem() {
    if (!this.nome.trim() || !this.email.trim() || !this.mensagem.trim()) return;
    this.enviando.set(true);
    this.erro.set('');
    try {
      await new Promise(r => setTimeout(r, 1200));
      // TODO: substituir pelo POST real à sua API de mensagens
      this.enviado.set(true);
    } catch {
      this.erro.set('Não foi possível enviar. Tente pelo WhatsApp abaixo.');
    } finally {
      this.enviando.set(false);
    }
  }
}
