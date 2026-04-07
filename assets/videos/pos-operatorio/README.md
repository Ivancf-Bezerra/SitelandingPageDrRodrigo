# Vídeos: pós-operatório e resultados

Coloque aqui os vídeos de evolução pós-operatória de Otomodelação.

## Opção 1: YouTube (recomendado)
Publique o vídeo no YouTube e copie apenas o **ID** do vídeo.
Exemplo: para `https://www.youtube.com/watch?v=AbCdEfGhIjK`, o ID é `AbCdEfGhIjK`.

Edite `galeria.ts` e preencha o campo `youtubeId`:
```typescript
{ id: 1, titulo: 'Resultado Otomodelação, semana 1',
  procedimento: 'Otomodelação',
  youtubeId: 'AbCdEfGhIjK',
  duracao: '1:47' },
```

## Opção 2: arquivo local
Formatos aceitos: **MP4** (H.264) ou **WebM**.

### Nomenclatura sugerida
```
otomo-resultado-01.mp4
otomo-pos-op-semana1.mp4
otomo-evolucao-01.mp4
```

### Dimensões recomendadas
- Resolução: 1080×1920 (vertical/stories) ou 1920×1080 (horizontal)
- Tamanho máximo: 50 MB por arquivo
- Codec: H.264 para máxima compatibilidade

### Como referenciar
Para usar vídeos locais, altere o componente `galeria.ts` adicionando um campo `videoSrc` à interface `VideoItem` e use `<video>` no template.
