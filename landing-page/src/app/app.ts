import { Component } from '@angular/core';
import { Header } from './components/header/header';
import { Hero } from './components/hero/hero';
import { Sobre } from './components/sobre/sobre';
import { Servicos } from './components/servicos/servicos';
import { Depoimentos } from './components/depoimentos/depoimentos';
import { Galeria } from './components/galeria/galeria';
import { Faq } from './components/faq/faq';
import { Contato } from './components/contato/contato';
import { Localizacao } from './components/localizacao/localizacao';
import { Footer } from './components/footer/footer';
import { WhatsappFab } from './components/whatsapp-fab/whatsapp-fab';

@Component({
  selector: 'app-root',
  imports: [
    Header,
    Hero,
    Sobre,
    Servicos,
    Depoimentos,
    Galeria,
    Faq,
    Contato,
    Localizacao,
    Footer,
    WhatsappFab,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
