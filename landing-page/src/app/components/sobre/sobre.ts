import { Component } from '@angular/core';
import { EditableImage } from '../editable-image/editable-image';

@Component({
  selector: 'app-sobre',
  imports: [EditableImage],
  templateUrl: './sobre.html',
  styleUrl: './sobre.css'
})
export class Sobre {
  formacoes = [
    'Especialização em Harmonização Orofacial',
    'Técnicas Avançadas de Otomodelação',
    'Pós-graduação em Odontologia Estética',
    'Membro da Associação Brasileira de Cirurgiões-Dentistas',
  ];
}
