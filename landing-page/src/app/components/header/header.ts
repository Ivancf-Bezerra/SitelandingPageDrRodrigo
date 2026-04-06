import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface NavLink {
  label: string;
  anchor: string;
}

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  isScrolled = signal(false);
  menuOpen = signal(false);

  navLinks: NavLink[] = [
    { label: 'Sobre', anchor: '#sobre' },
    { label: 'Serviços', anchor: '#servicos' },
    { label: 'Depoimentos', anchor: '#depoimentos' },
    { label: 'Galeria', anchor: '#galeria' },
    { label: 'FAQ', anchor: '#faq' },
    { label: 'Contato', anchor: '#contato' },
  ];

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled.set(window.scrollY > 20);
  }

  toggleMenu() {
    this.menuOpen.update(v => !v);
  }

  closeMenu() {
    this.menuOpen.set(false);
  }
}
