import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface FaqItem {
  pergunta: string;
  resposta: string;
  aberto: boolean;
}

@Component({
  selector: 'app-faq',
  imports: [CommonModule],
  templateUrl: './faq.html',
  styleUrl: './faq.css'
})
export class Faq {
  itens = signal<FaqItem[]>([
    {
      pergunta: 'O que é Harmonização Orofacial?',
      resposta: 'Harmonização Orofacial é um conjunto de procedimentos estéticos realizados por dentistas capacitados para equilibrar as proporções do rosto. Inclui aplicações de toxina botulínica, preenchimentos com ácido hialurônico, bioestimuladores de colágeno e outros tratamentos minimamente invasivos que visam realçar a beleza natural do paciente.',
      aberto: true,
    },
    {
      pergunta: 'O que é Otomodelação e como funciona?',
      resposta: 'A Otomodelação é uma técnica não cirúrgica para corrigir o posicionamento das orelhas. Utiliza fios especiais ou procedimentos de modelagem para reposicionar a cartilagem auricular, eliminando a necessidade de cirurgia (otoplastia). O procedimento é rápido, praticamente indolor e o resultado é visível imediatamente.',
      aberto: false,
    },
    {
      pergunta: 'Os procedimentos são seguros? Causam dor?',
      resposta: 'Sim, todos os procedimentos são seguros quando realizados por um profissional qualificado e habilitado. Utilizamos anestesia local nos casos necessários para garantir máximo conforto. O desconforto é mínimo e passageiro. Nossa clínica segue rigorosos protocolos de biossegurança e higiene.',
      aberto: false,
    },
    {
      pergunta: 'Quanto tempo duram os resultados?',
      resposta: 'A duração varia conforme o procedimento: a toxina botulínica dura de 4 a 6 meses, os preenchimentos com ácido hialurônico de 12 a 18 meses, e os bioestimuladores de colágeno podem ter efeito de 2 a 3 anos. O Dr. Rodrigo indicará o tratamento e frequência de manutenção ideal para cada caso.',
      aberto: false,
    },
    {
      pergunta: 'Preciso de consulta prévia antes do procedimento?',
      resposta: 'Sim, a consulta de avaliação é fundamental. Nela, o Dr. Rodrigo analisa as características individuais do seu rosto, discute suas expectativas, avalia sua saúde geral e elabora um plano de tratamento personalizado. Só então os procedimentos são agendados.',
      aberto: false,
    },
    {
      pergunta: 'Qual é o tempo de recuperação após os procedimentos?',
      resposta: 'A maioria dos procedimentos tem recuperação muito rápida. Em geral, pequenos edemas ou vermelhidões podem aparecer e desaparecem em 24 a 72 horas. Para a Otomodelação, é recomendado repouso local por alguns dias. O Dr. Rodrigo passará todas as orientações pós-procedimento de forma detalhada.',
      aberto: false,
    },
    {
      pergunta: 'Como é feito o agendamento de consulta?',
      resposta: 'Você pode agendar sua consulta pelo WhatsApp, pelo formulário de contato nesta página ou por ligação telefônica. Nossa equipe retornará em até 24 horas para confirmar o melhor horário para você.',
      aberto: false,
    },
  ]);

  toggle(index: number) {
    this.itens.update(lista =>
      lista.map((item, i) => ({
        ...item,
        aberto: i === index ? !item.aberto : false,
      }))
    );
  }
}
