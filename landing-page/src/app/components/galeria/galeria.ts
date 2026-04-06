import { Component, signal, ElementRef, ViewChildren, QueryList, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

type Tab = 'fotos' | 'videos';

interface FotoItem {
  id: number;
  procedimento: string;
  categoria: string;
  aspectRatio: string;
}

interface VideoItem {
  id: number;
  titulo: string;
  procedimento: string;
  youtubeId: string;
  duracao: string;
}

@Component({
  selector: 'app-galeria',
  imports: [CommonModule],
  templateUrl: './galeria.html',
  styleUrl: './galeria.css'
})
export class Galeria implements AfterViewInit, OnDestroy {
  activeTab = signal<Tab>('fotos');

  fotos: FotoItem[] = [
    { id: 1, procedimento: 'Harmonização Orofacial', categoria: 'Antes & Depois', aspectRatio: 'aspect-square' },
    { id: 2, procedimento: 'Otomodelação', categoria: 'Antes & Depois', aspectRatio: 'aspect-[4/5]' },
    { id: 3, procedimento: 'Design de Sorriso', categoria: 'Antes & Depois', aspectRatio: 'aspect-square' },
    { id: 4, procedimento: 'Toxina Botulínica', categoria: 'Antes & Depois', aspectRatio: 'aspect-[3/4]' },
    { id: 5, procedimento: 'Bioestimuladores', categoria: 'Antes & Depois', aspectRatio: 'aspect-square' },
    { id: 6, procedimento: 'Fios de PDO', categoria: 'Antes & Depois', aspectRatio: 'aspect-[4/5]' },
  ];

  videos: VideoItem[] = [
    { id: 1, titulo: 'Pós-operatório: Harmonização Orofacial', procedimento: 'Harmonização Orofacial', youtubeId: 'dQw4w9WgXcQ', duracao: '2:34' },
    { id: 2, titulo: 'Resultado Otomodelação — Semana 1', procedimento: 'Otomodelação', youtubeId: 'dQw4w9WgXcQ', duracao: '1:47' },
    { id: 3, titulo: 'Evolução Design de Sorriso', procedimento: 'Design de Sorriso', youtubeId: 'dQw4w9WgXcQ', duracao: '3:12' },
    { id: 4, titulo: 'Pós-operatório Fios de PDO', procedimento: 'Fios de PDO', youtubeId: 'dQw4w9WgXcQ', duracao: '2:05' },
  ];

  @ViewChildren('videoWrapper') videoWrappers!: QueryList<ElementRef<HTMLElement>>;
  private observer?: IntersectionObserver;
  loadedVideos = signal<Set<number>>(new Set());

  setTab(tab: Tab) {
    this.activeTab.set(tab);
  }

  ngAfterViewInit() {
    this.setupLazyVideos();
    this.videoWrappers.changes.subscribe(() => this.setupLazyVideos());
  }

  private setupLazyVideos() {
    this.observer?.disconnect();
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = Number((entry.target as HTMLElement).dataset['videoId']);
            this.loadedVideos.update(set => new Set([...set, id]));
            this.observer?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    this.videoWrappers.forEach(ref => this.observer?.observe(ref.nativeElement));
  }

  isVideoLoaded(id: number): boolean {
    return this.loadedVideos().has(id);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
