import { Component } from '@angular/core';
import { Hero } from '../../components/hero/hero';
import { Sobre } from '../../components/sobre/sobre';
import { Servicos } from '../../components/servicos/servicos';
import { Depoimentos } from '../../components/depoimentos/depoimentos';
import { Faq } from '../../components/faq/faq';

@Component({
  selector: 'app-home',
  imports: [Hero, Sobre, Servicos, Depoimentos, Faq],
  templateUrl: './home.html',
})
export class Home {}
