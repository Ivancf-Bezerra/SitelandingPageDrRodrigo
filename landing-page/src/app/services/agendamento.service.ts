import { Injectable, signal } from '@angular/core';

export interface AgendamentoPayload {
  data: string;       // ISO date string 'YYYY-MM-DD'
  horario: string;    // ex: '09:00'
  nome: string;
  telefone: string;
  email: string;
  observacao?: string;
}

export interface AgendamentoResponse {
  sucesso: boolean;
  mensagem: string;
  protocolo?: string;
}

/**
 * Stub de serviço de agendamento.
 * Substitua o método `agendar` pela chamada real à sua API/banco de dados.
 *
 * Exemplo futuro com Firebase:
 *   import { Firestore, collection, addDoc } from '@angular/fire/firestore';
 *   return addDoc(collection(this.firestore, 'agendamentos'), payload);
 *
 * Exemplo futuro com Supabase:
 *   return this.supabase.from('agendamentos').insert(payload);
 */
@Injectable({ providedIn: 'root' })
export class AgendamentoService {
  readonly enviando = signal(false);

  async agendar(payload: AgendamentoPayload): Promise<AgendamentoResponse> {
    this.enviando.set(true);

    try {
      // Simula latência de rede (remover quando integrar API real)
      await new Promise(resolve => setTimeout(resolve, 1400));

      // TODO: substituir pelo POST real à sua API
      // const res = await fetch('/api/agendamentos', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(payload),
      // });
      // const data = await res.json();

      const protocolo = `OTO-${Date.now().toString(36).toUpperCase()}`;
      return { sucesso: true, mensagem: 'Agendamento recebido com sucesso!', protocolo };
    } finally {
      this.enviando.set(false);
    }
  }

  /** Retorna slots disponíveis para uma data.
   *  TODO: substituir pela consulta real ao banco de dados.
   */
  getSlots(_data: string): string[] {
    return ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
            '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'];
  }
}
