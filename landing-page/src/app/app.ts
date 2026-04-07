import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { WhatsappFab } from './components/whatsapp-fab/whatsapp-fab';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, WhatsappFab],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
