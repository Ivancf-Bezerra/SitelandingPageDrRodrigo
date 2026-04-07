import { Component, computed, signal, ViewChild, ElementRef, AfterViewInit, OnDestroy, NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { EditableImage } from '../editable-image/editable-image';

interface Beneficio {
  titulo: string;
  descricao: string;
}

@Component({
  selector: 'app-servicos',
  imports: [RouterLink, FormsModule, EditableImage],
  templateUrl: './servicos.html',
  styleUrl: './servicos.css'
})
export class Servicos implements AfterViewInit, OnDestroy {
  constructor(private zone: NgZone) {}
  beneficios: Beneficio[] = [
    { titulo: 'Sem cirurgia',       descricao: 'Procedimento 100% não cirúrgico, sem bisturi e sem anestesia geral.' },
    { titulo: 'Resultado imediato', descricao: 'A remodelação é visível logo ao término do procedimento.' },
    { titulo: 'Sem cicatrizes',     descricao: 'Técnica atraumática que não deixa marcas ou cortes.' },
    { titulo: 'Recuperação rápida', descricao: 'Retorno às atividades normais no mesmo dia do procedimento.' },
    { titulo: 'Resultado natural',  descricao: 'As orelhas ficam harmoniosas, em proporção com os traços do rosto.' },
    { titulo: 'Alta durabilidade',  descricao: 'Com os cuidados adequados, o resultado se mantém por anos.' },
  ];

  etapas = [
    { numero: '01', label: 'Avaliação',    descricao: 'Consulta personalizada para análise do caso.' },
    { numero: '02', label: 'Moldagem',     descricao: 'Modelagem delicada com biomaterial especial.' },
    { numero: '03', label: 'Resultado',    descricao: 'Orelhas harmoniosas de forma imediata e natural.' },
  ];

  popupOpen    = signal(false);
  respostaA    = signal<'sim' | 'nao' | ''>('');
  respostaB    = signal<'sim' | 'nao' | ''>('');
  respostaC    = signal<'sim' | 'nao' | ''>('');
  nomeLead     = '';
  telefoneLead = '';
  fotosVisiveis    = signal(false);
  animacaoCompleta = signal(false);
  /** Qual card está ampliado (clique); só um por vez; mouseleave desse card ou 2º clique no mesmo desliga. */
  cardFoco = signal<'antes' | 'depois' | null>(null);

  private observer?: IntersectionObserver;
  private animFallbackId?: ReturnType<typeof setTimeout>;

  @ViewChild('fotosContainer') fotosContainerRef!: ElementRef<HTMLElement>;

  readonly todasSim = computed(() =>
    this.respostaA() === 'sim' && this.respostaB() === 'sim' && this.respostaC() === 'sim'
  );

  ngAfterViewInit() {
    queueMicrotask(() => this.iniciarObserverFotos());
  }

  ngOnDestroy() {
    this.observer?.disconnect();
    this.clearAnimFallback();
  }

  private iniciarObserverFotos() {
    const el = this.fotosContainerRef?.nativeElement;
    if (!el) return;

    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        this.observer?.disconnect();
        this.zone.run(() => {
          this.fotosVisiveis.set(true);
          this.clearAnimFallback();
          // Se a animação não rodar (ex.: reduced-motion) ou animationend não disparar, ainda ativa o estado final.
          this.animFallbackId = setTimeout(() => {
            this.zone.run(() => {
              this.animacaoCompleta.set(true);
              this.animFallbackId = undefined;
            });
          }, 1400);
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px 8% 0px' }
    );
    this.observer.observe(el);
  }

  private clearAnimFallback() {
    if (this.animFallbackId !== undefined) {
      clearTimeout(this.animFallbackId);
      this.animFallbackId = undefined;
    }
  }

  onAnimacaoFimEntrada(ev: AnimationEvent) {
    if (ev.target !== ev.currentTarget) return;
    if (ev.animationName !== 'entrarDepois') return;
    this.zone.run(() => {
      this.clearAnimFallback();
      this.animacaoCompleta.set(true);
    });
  }

  selecionarFotoCard(qual: 'antes' | 'depois') {
    if (!this.animacaoCompleta()) return;
    this.cardFoco.update((atual) => (atual === qual ? null : qual));
  }

  /** Saiu com o mouse do card: volta ao scale original (só se esse card estava ampliado). */
  onFotoCardMouseleave(qual: 'antes' | 'depois') {
    if (this.cardFoco() === qual) this.cardFoco.set(null);
  }

  onFotoCardKeydown(ev: KeyboardEvent, qual: 'antes' | 'depois') {
    if (ev.key !== 'Enter' && ev.key !== ' ') return;
    ev.preventDefault();
    this.selecionarFotoCard(qual);
  }

  abrirPopup()  { this.popupOpen.set(true);  }
  fecharPopup() { this.popupOpen.set(false); }
}
