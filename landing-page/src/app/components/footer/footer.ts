import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer {
  anoAtual = new Date().getFullYear();

  navLinks = [
    { label: 'Sobre', anchor: '#sobre' },
    { label: 'Serviços', anchor: '#servicos' },
    { label: 'Depoimentos', anchor: '#depoimentos' },
    { label: 'Galeria', anchor: '#galeria' },
    { label: 'FAQ', anchor: '#faq' },
    { label: 'Contato', anchor: '#contato' },
  ];

  servicos = [
    'Harmonização Orofacial',
    'Otomodelação',
    'Design de Sorriso',
    'Bioestimuladores',
    'Fios de PDO',
    'Toxina Botulínica',
  ];
}
