import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Galeria } from '../../components/galeria/galeria';

@Component({
  selector: 'app-galeria-page',
  imports: [RouterLink, Galeria],
  templateUrl: './galeria-page.html',
})
export class GaleriaPage {}
