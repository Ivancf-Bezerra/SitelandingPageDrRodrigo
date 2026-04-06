import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Depoimento {
  nome: string;
  procedimento: string;
  texto: string;
  nota: number;
  iniciais: string;
  cor: string;
}

@Component({
  selector: 'app-depoimentos',
  imports: [CommonModule],
  templateUrl: './depoimentos.html',
  styleUrl: './depoimentos.css'
})
export class Depoimentos {
  depoimentos: Depoimento[] = [
    {
      nome: 'Ana Clara M.',
      procedimento: 'Harmonização Orofacial',
      texto: 'Resultado incrível! O Dr. Rodrigo foi muito atencioso, explicou cada etapa do procedimento e o resultado ficou completamente natural. Me sinto muito mais confiante.',
      nota: 5,
      iniciais: 'AC',
      cor: 'bg-rose-100 text-rose-700',
    },
    {
      nome: 'Beatriz S.',
      procedimento: 'Otomodelação',
      texto: 'Sempre tive insegurança com minhas orelhas e a otomodelação mudou completamente minha autoestima. Procedimento rápido, sem dor e com resultado imediato. Recomendo muito!',
      nota: 5,
      iniciais: 'BS',
      cor: 'bg-purple-100 text-purple-700',
    },
    {
      nome: 'Carlos R.',
      procedimento: 'Toxina Botulínica',
      texto: 'Profissional extremamente capacitado e cuidadoso. O resultado ficou muito natural, exatamente o que eu queria. Ambiente super agradável e acolhedor.',
      nota: 5,
      iniciais: 'CR',
      cor: 'bg-blue-100 text-blue-700',
    },
    {
      nome: 'Fernanda L.',
      procedimento: 'Design de Sorriso',
      texto: 'Meu sorriso ficou dos sonhos! O Dr. Rodrigo planejou tudo com muito cuidado, mostrou a simulação antes e o resultado final superou todas as minhas expectativas.',
      nota: 5,
      iniciais: 'FL',
      cor: 'bg-green-100 text-green-700',
    },
    {
      nome: 'Gabriela T.',
      procedimento: 'Bioestimuladores',
      texto: 'Tratamento incrível! A pele ficou muito mais firme e com brilho. O Dr. Rodrigo é muito atencioso e profissional. Já indiquei para várias amigas.',
      nota: 5,
      iniciais: 'GT',
      cor: 'bg-amber-100 text-amber-700',
    },
    {
      nome: 'Mariana F.',
      procedimento: 'Harmonização Orofacial',
      texto: 'Excelente profissional! Resultado natural e harmonioso. Me sentio super segura durante todo o procedimento. Com certeza voltarei para outras sessões.',
      nota: 5,
      iniciais: 'MF',
      cor: 'bg-teal-100 text-teal-700',
    },
  ];

  currentIndex = signal(0);
  itemsPerSlide = signal(3);

  totalSlides = computed(() =>
    Math.ceil(this.depoimentos.length / this.itemsPerSlide())
  );

  visibleDepoimentos = computed(() => {
    const start = this.currentIndex() * this.itemsPerSlide();
    return this.depoimentos.slice(start, start + this.itemsPerSlide());
  });

  stars(nota: number): number[] {
    return Array(nota).fill(0);
  }

  prev() {
    this.currentIndex.update(i => (i > 0 ? i - 1 : this.totalSlides() - 1));
  }

  next() {
    this.currentIndex.update(i => (i < this.totalSlides() - 1 ? i + 1 : 0));
  }

  goTo(index: number) {
    this.currentIndex.set(index);
  }

  slideIndices = computed(() =>
    Array.from({ length: this.totalSlides() }, (_, i) => i)
  );
}
