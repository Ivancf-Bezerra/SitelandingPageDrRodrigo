import { Component } from '@angular/core';

interface Destaque {
  valor: string;
  label: string;
  descricao: string;
}

@Component({
  selector: 'app-sobre',
  imports: [],
  templateUrl: './sobre.html',
  styleUrl: './sobre.css'
})
export class Sobre {
  destaques: Destaque[] = [
    { valor: '500+', label: 'Pacientes', descricao: 'Atendidos com excelência' },
    { valor: '5+', label: 'Anos', descricao: 'De experiência clínica' },
    { valor: '3', label: 'Especializações', descricao: 'Em procedimentos estéticos' },
    { valor: '98%', label: 'Satisfação', descricao: 'Avaliação dos pacientes' },
  ];

  formacoes = [
    'Especialização em Harmonização Orofacial',
    'Técnicas Avançadas de Otomodelação',
    'Pós-graduação em Odontologia Estética',
    'Membro da Associação Brasileira de Cirurgiões-Dentistas',
  ];
}
