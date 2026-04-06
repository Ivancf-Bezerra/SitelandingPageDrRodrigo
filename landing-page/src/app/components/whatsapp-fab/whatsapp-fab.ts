import { Component, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-whatsapp-fab',
  imports: [CommonModule],
  templateUrl: './whatsapp-fab.html',
  styleUrl: './whatsapp-fab.css'
})
export class WhatsappFab {
  visible = signal(false);
  showTooltip = signal(false);

  readonly whatsappUrl = 'https://wa.me/5500000000000?text=Ol%C3%A1%20Dr.%20Rodrigo%2C%20gostaria%20de%20agendar%20uma%20consulta.';

  @HostListener('window:scroll')
  onScroll() {
    this.visible.set(window.scrollY > 300);
  }
}
