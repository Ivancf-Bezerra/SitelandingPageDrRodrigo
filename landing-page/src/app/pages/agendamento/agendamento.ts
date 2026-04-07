import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AgendamentoService, AgendamentoPayload } from '../../services/agendamento.service';

type Etapa = 1 | 2 | 3 | 'confirmado';

interface DiaMes {
  dia: number;
  mes: number;
  ano: number;
  desabilitado: boolean;
}

@Component({
  selector: 'app-agendamento',
  imports: [FormsModule, RouterLink],
  templateUrl: './agendamento.html',
  styleUrl: './agendamento.css',
})
export class Agendamento {
  private readonly svc = inject(AgendamentoService);

  readonly enviando = this.svc.enviando;

  // ── Etapa atual ───────────────────────────────────────────────────────────
  etapa = signal<Etapa>(1);

  // ── Etapa 1 — Calendário ─────────────────────────────────────────────────
  hoje = new Date();
  viewAno  = signal(this.hoje.getFullYear());
  viewMes  = signal(this.hoje.getMonth()); // 0-indexed
  dataSelecionada = signal<string>('');    // 'YYYY-MM-DD'

  readonly MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho',
                    'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  readonly DIAS_SEMANA = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];

  readonly diasDoMes = computed<DiaMes[]>(() => {
    const ano = this.viewAno();
    const mes = this.viewMes();
    const primeiroDia = new Date(ano, mes, 1).getDay();
    const ultimoDia   = new Date(ano, mes + 1, 0).getDate();
    const resultado: DiaMes[] = [];

    for (let i = 0; i < primeiroDia; i++) {
      resultado.push({ dia: 0, mes, ano, desabilitado: true });
    }
    for (let d = 1; d <= ultimoDia; d++) {
      const data = new Date(ano, mes, d);
      const diaSemana = data.getDay();
      const passado = data < new Date(this.hoje.getFullYear(), this.hoje.getMonth(), this.hoje.getDate());
      resultado.push({ dia: d, mes, ano, desabilitado: passado || diaSemana === 0 });
    }
    return resultado;
  });

  readonly tituloMes = computed(() => `${this.MESES[this.viewMes()]} ${this.viewAno()}`);

  /** Só mês atual e o imediatamente seguinte podem ser exibidos. */
  private viewIndex(ano: number, mes: number): number {
    return ano * 12 + mes;
  }

  private readonly indiceMesMin = this.viewIndex(this.hoje.getFullYear(), this.hoje.getMonth());
  private readonly indiceMesMax = this.indiceMesMin + 1;

  readonly podeIrMesAnterior = computed(
    () => this.viewIndex(this.viewAno(), this.viewMes()) > this.indiceMesMin
  );

  readonly podeIrProximoMes = computed(
    () => this.viewIndex(this.viewAno(), this.viewMes()) < this.indiceMesMax
  );

  mesAnterior() {
    if (!this.podeIrMesAnterior()) return;
    if (this.viewMes() === 0) {
      this.viewMes.set(11);
      this.viewAno.update((a) => a - 1);
    } else {
      this.viewMes.update((m) => m - 1);
    }
  }

  proximoMes() {
    if (!this.podeIrProximoMes()) return;
    if (this.viewMes() === 11) {
      this.viewMes.set(0);
      this.viewAno.update((a) => a + 1);
    } else {
      this.viewMes.update((m) => m + 1);
    }
  }

  selecionarDia(d: DiaMes) {
    if (d.dia === 0 || d.desabilitado) return;
    const mm = String(d.mes + 1).padStart(2, '0');
    const dd = String(d.dia).padStart(2, '0');
    this.dataSelecionada.set(`${d.ano}-${mm}-${dd}`);
    this.etapa.set(2);
  }

  isDiaSelecionado(d: DiaMes): boolean {
    if (d.dia === 0) return false;
    const mm = String(d.mes + 1).padStart(2, '0');
    const dd = String(d.dia).padStart(2, '0');
    return this.dataSelecionada() === `${d.ano}-${mm}-${dd}`;
  }

  readonly dataFormatada = computed(() => {
    if (!this.dataSelecionada()) return '';
    const [ano, mes, dia] = this.dataSelecionada().split('-');
    return `${dia}/${mes}/${ano}`;
  });

  // ── Etapa 2 — Horários ───────────────────────────────────────────────────
  readonly slots = computed(() => this.svc.getSlots(this.dataSelecionada()));
  horarioSelecionado = signal('');

  selecionarHorario(h: string) {
    this.horarioSelecionado.set(h);
    this.etapa.set(3);
  }

  // ── Etapa 3 — Dados do paciente ──────────────────────────────────────────
  nome       = '';
  telefone   = '';
  email      = '';
  observacao = '';

  // ── Resultado ─────────────────────────────────────────────────────────────
  protocolo = signal('');
  erroEnvio = signal('');

  // ── Navegação entre etapas ────────────────────────────────────────────────
  avancarEtapa1() {
    if (!this.dataSelecionada()) return;
    this.etapa.set(2);
  }

  avancarEtapa2() {
    if (!this.horarioSelecionado()) return;
    this.etapa.set(3);
  }

  voltarEtapa(e: 1 | 2) { this.etapa.set(e); }

  async confirmarAgendamento() {
    if (!this.nome.trim() || !this.telefone.trim() || !this.email.trim()) return;
    this.erroEnvio.set('');

    const payload: AgendamentoPayload = {
      data: this.dataSelecionada(),
      horario: this.horarioSelecionado(),
      nome: this.nome.trim(),
      telefone: this.telefone.trim(),
      email: this.email.trim(),
      observacao: this.observacao.trim() || undefined,
    };

    try {
      const res = await this.svc.agendar(payload);
      if (res.sucesso) {
        this.protocolo.set(res.protocolo ?? '');
        this.etapa.set('confirmado');
      } else {
        this.erroEnvio.set(res.mensagem);
      }
    } catch {
      this.erroEnvio.set('Erro ao enviar. Tente novamente ou entre em contato pelo WhatsApp.');
    }
  }
}
