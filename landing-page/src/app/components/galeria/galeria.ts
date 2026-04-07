import {
  Component,
  signal,
  computed,
  ElementRef,
  ViewChild,
  ViewChildren,
  QueryList,
  AfterViewInit,
  OnDestroy,
  HostListener,
  inject,
  DestroyRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { SiteImagesService } from '../../services/site-images.service';

type Tab = 'fotos' | 'videos';

interface FotoItem {
  id: number;
  procedimento: string;
  categoria: string;
  /** URL da imagem; se vazio, exibe placeholder até o cliente enviar fotos */
  src?: string;
  alt?: string;
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
  styleUrl: './galeria.css',
})
export class Galeria implements AfterViewInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);
  readonly auth = inject(AuthService);
  private readonly siteImages = inject(SiteImagesService);

  @ViewChild('galeriaAdminFile') galeriaAdminFile?: ElementRef<HTMLInputElement>;
  private pendingGaleriaSlot: string | null = null;

  activeTab = signal<Tab>('fotos');

  fotos: FotoItem[] = [
    { id: 1,  procedimento: 'Otomodelação — Destaque',      categoria: 'Antes & Depois',
      src: 'assets/fotos/antes-depois/otomo-01-depois.jpg',  alt: 'Resultado Otomodelação — paciente 1' },
    { id: 2,  procedimento: 'Otomodelação — Caso 2',        categoria: 'Antes & Depois',
      src: 'assets/fotos/antes-depois/otomo-02-depois.jpg',  alt: 'Resultado Otomodelação — paciente 2' },
    { id: 3,  procedimento: 'Otomodelação — Caso 3',        categoria: 'Antes & Depois',
      src: 'assets/fotos/antes-depois/otomo-03-depois.jpg',  alt: 'Resultado Otomodelação — paciente 3' },
    { id: 4,  procedimento: 'Otomodelação — Caso 4',        categoria: 'Antes & Depois',
      src: 'assets/fotos/antes-depois/otomo-04-depois.jpg',  alt: 'Resultado Otomodelação — paciente 4' },
    { id: 5,  procedimento: 'Otomodelação — Caso 5',        categoria: 'Antes & Depois',
      src: 'assets/fotos/antes-depois/otomo-05-depois.jpg',  alt: 'Resultado Otomodelação — paciente 5' },
    { id: 6,  procedimento: 'Otomodelação — Caso 6',        categoria: 'Antes & Depois',
      src: 'assets/fotos/antes-depois/otomo-06-depois.jpg',  alt: 'Resultado Otomodelação — paciente 6' },
    { id: 7,  procedimento: 'Otomodelação — Caso 7',        categoria: 'Antes & Depois',
      src: 'assets/fotos/antes-depois/otomo-07-depois.jpg',  alt: 'Resultado Otomodelação — paciente 7' },
    { id: 8,  procedimento: 'Otomodelação — Caso 8',        categoria: 'Antes & Depois',
      src: 'assets/fotos/antes-depois/otomo-08-depois.jpg',  alt: 'Resultado Otomodelação — paciente 8' },
    { id: 9,  procedimento: 'Otomodelação — Caso 9',        categoria: 'Antes & Depois',
      src: 'assets/fotos/antes-depois/otomo-09-depois.jpg',  alt: 'Resultado Otomodelação — paciente 9' },
    { id: 10, procedimento: 'Otomodelação — Caso 10',       categoria: 'Antes & Depois',
      src: 'assets/fotos/antes-depois/otomo-10-depois.jpg',  alt: 'Resultado Otomodelação — paciente 10' },
  ];

  videos: VideoItem[] = [
    { id: 1, titulo: 'Resultado Otomodelação — Semana 1',  procedimento: 'Otomodelação', youtubeId: 'dQw4w9WgXcQ', duracao: '1:47' },
    { id: 2, titulo: 'Pós-operatório Otomodelação — Caso 2', procedimento: 'Otomodelação', youtubeId: 'dQw4w9WgXcQ', duracao: '2:05' },
    { id: 3, titulo: 'Evolução Otomodelação — 30 dias',    procedimento: 'Otomodelação', youtubeId: 'dQw4w9WgXcQ', duracao: '3:12' },
    { id: 4, titulo: 'Depoimento: Otomodelação',           procedimento: 'Otomodelação', youtubeId: 'dQw4w9WgXcQ', duracao: '2:34' },
  ];

  @ViewChildren('videoWrapper') videoWrappers!: QueryList<ElementRef<HTMLElement>>;
  private observer?: IntersectionObserver;
  loadedVideos = signal<Set<number>>(new Set());

  lightboxOpen = signal(false);
  lightboxIndex = signal(0);
  zoom = signal(1);

  private readonly minZoom = 1;
  private readonly maxZoom = 3;
  private readonly zoomStep = 0.12;

  currentLightboxFoto = computed(() => {
    const i = this.lightboxIndex();
    return this.fotos[i] ?? null;
  });

  setTab(tab: Tab) {
    this.activeTab.set(tab);
  }

  readonly thumbBase =
    'group relative w-full min-w-0 overflow-hidden rounded-md cursor-pointer text-left galeria-thumb ' +
    'border-0 p-0 appearance-none';

  openLightbox(index: number) {
    this.lightboxIndex.set(index);
    this.zoom.set(1);
    this.lightboxOpen.set(true);
    document.body.style.overflow = 'hidden';
  }

  closeLightbox() {
    this.lightboxOpen.set(false);
    this.zoom.set(1);
    document.body.style.overflow = '';
  }

  resolvedFotoSrc(photoIndex: number): string {
    const f = this.fotos[photoIndex];
    const fallback = f?.src ?? '';
    return this.siteImages.resolve(`galeria-foto-${photoIndex + 1}`, fallback);
  }

  startGaleriaUpload(photoIndex: number, ev: Event) {
    ev.stopPropagation();
    ev.preventDefault();
    const slot = `galeria-foto-${photoIndex + 1}`;
    this.pendingGaleriaSlot = slot;
    queueMicrotask(() => this.galeriaAdminFile?.nativeElement.click());
  }

  onGaleriaAdminFile(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0];
    const slot = this.pendingGaleriaSlot;
    this.pendingGaleriaSlot = null;
    input.value = '';
    if (!file || !slot) return;
    this.siteImages.upload(slot, file).subscribe();
  }

  lightboxNext() {
    const n = this.fotos.length;
    if (n === 0) return;
    this.lightboxIndex.update(i => (i + 1) % n);
    this.zoom.set(1);
  }

  lightboxPrev() {
    const n = this.fotos.length;
    if (n === 0) return;
    this.lightboxIndex.update(i => (i - 1 + n) % n);
    this.zoom.set(1);
  }

  zoomIn() {
    this.zoom.update(z => Math.min(this.maxZoom, z + this.zoomStep * 2));
  }

  zoomOut() {
    this.zoom.update(z => Math.max(this.minZoom, z - this.zoomStep * 2));
  }

  onLightboxWheel(event: WheelEvent) {
    event.preventDefault();
    const delta = event.deltaY > 0 ? -this.zoomStep : this.zoomStep;
    this.zoom.update(z => Math.min(this.maxZoom, Math.max(this.minZoom, z + delta)));
  }

  @HostListener('document:keydown', ['$event'])
  onDocumentKeydown(event: KeyboardEvent) {
    if (!this.lightboxOpen()) return;
    switch (event.key) {
      case 'Escape':
        this.closeLightbox();
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.lightboxNext();
        break;
      case 'ArrowLeft':
        event.preventDefault();
        this.lightboxPrev();
        break;
      case '+':
      case '=':
        event.preventDefault();
        this.zoomIn();
        break;
      case '-':
        event.preventDefault();
        this.zoomOut();
        break;
      default:
        break;
    }
  }

  ngAfterViewInit() {
    this.setupLazyVideos();
    this.videoWrappers.changes.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.setupLazyVideos());
  }

  private setupLazyVideos() {
    this.observer?.disconnect();
    this.observer = new IntersectionObserver(
      entries => {
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
    document.body.style.overflow = '';
  }
}
