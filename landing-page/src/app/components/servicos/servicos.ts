import { Component } from '@angular/core';

interface Servico {
  titulo: string;
  descricao: string;
  beneficios: string[];
  icone: string;
  destaque: boolean;
}

@Component({
  selector: 'app-servicos',
  imports: [],
  templateUrl: './servicos.html',
  styleUrl: './servicos.css'
})
export class Servicos {
  servicos: Servico[] = [
    {
      titulo: 'Harmonização Orofacial',
      descricao: 'Conjunto de procedimentos estéticos que visam equilibrar e harmonizar as proporções do rosto, valorizando os traços naturais de cada paciente.',
      beneficios: ['Preenchimento labial', 'Botox facial', 'Rinomodelação', 'Lipo de papada'],
      icone: 'face',
      destaque: true,
    },
    {
      titulo: 'Otomodelação',
      descricao: 'Procedimento não cirúrgico para remodelar e posicionar as orelhas de forma harmoniosa, sem cortes ou cicatrizes, com resultado imediato.',
      beneficios: ['Sem cirurgia', 'Procedimento rápido', 'Resultado imediato', 'Sem cicatrizes'],
      icone: 'ear',
      destaque: false,
    },
    {
      titulo: 'Design de Sorriso',
      descricao: 'Planejamento personalizado para criar o sorriso ideal para cada rosto, combinando estética dental com harmonia facial.',
      beneficios: ['Facetas de porcelana', 'Clareamento dental', 'Contorno gengival', 'Simulação digital'],
      icone: 'smile',
      destaque: false,
    },
    {
      titulo: 'Bioestimuladores',
      descricao: 'Tratamentos com bioestimuladores de colágeno para rejuvenescimento facial, melhorando a firmeza e a qualidade da pele de forma progressiva.',
      beneficios: ['Estimula colágeno natural', 'Rejuvenescimento gradual', 'Resultados duradouros', 'Melhora a textura da pele'],
      icone: 'sparkle',
      destaque: false,
    },
    {
      titulo: 'Fios de PDO',
      descricao: 'Técnica de lifting sem cirurgia utilizando fios biocompatíveis para reposicionar e suspender tecidos faciais com resultado natural.',
      beneficios: ['Lifting não cirúrgico', 'Estimula colágeno', 'Recuperação rápida', 'Resultado duradouro'],
      icone: 'thread',
      destaque: false,
    },
    {
      titulo: 'Toxina Botulínica',
      descricao: 'Aplicação precisa de botox para suavizar linhas de expressão, prevenir rugas e proporcionar um aspecto jovial e natural.',
      beneficios: ['Suaviza linhas de expressão', 'Prevenção de rugas', 'Resultado natural', 'Procedimento rápido'],
      icone: 'needle',
      destaque: false,
    },
  ];
}
