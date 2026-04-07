# Fotos — Antes & Depois (Otomodelação)

Coloque aqui as fotos de resultados de Otomodelação no formato **par antes/depois**.

## Nomenclatura sugerida

```
otomo-01-antes.jpg
otomo-01-depois.jpg
otomo-02-antes.jpg
otomo-02-depois.jpg
...
```

## Formatos aceitos
- JPG / JPEG (recomendado para fotos)
- PNG (para imagens com fundo transparente)
- WebP (melhor compressão, recomendado)

## Dimensões recomendadas
- **Proporção**: 4:5 (ex: 800×1000px) — ideal para os cards da galeria
- **Tamanho máximo**: 500 KB por arquivo (use https://squoosh.app para compressão)

## Como referenciar no código
Após adicionar as fotos, edite `galeria.ts` e preencha o campo `src` de cada item:

```typescript
{ id: 1, procedimento: 'Otomodelação', categoria: 'Antes & Depois',
  src: 'assets/fotos/antes-depois/otomo-01-depois.jpg',
  alt: 'Resultado de Otomodelação — paciente 1' },
```
