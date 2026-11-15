# Inventário Oficial de Assets — `landingpage/assets/` (`blonde AI`)

> **Finalidade:** Catálogo completo e verificado de todos os arquivos visuais, vetoriais, vídeos 3D e especificações sonoras prontos para consumo pelo próximo agente / engenheiro frontend no projeto Next.js (`/public/assets/...`).

---

## 1. Vetores de Marca & Moodboard (`assets/brand/` — 11 arquivos)

| Arquivo | Tamanho | Uso Recomendado na Landing Page |
| :--- | :---: | :--- |
| [`blonde-ai-horizontal-dark.svg`](brand/blonde-ai-horizontal-dark.svg) | 1.340 B | **Header Fixo (Fundo Obsidian `#090B0A`)** e telas escuras padrão. |
| [`blonde-ai-horizontal-light.svg`](brand/blonde-ai-horizontal-light.svg) | 1.321 B | **Folhas Editoriais Beige (`#EAE2D3`)** no Ato III e cabeçalhos claros/impressão. |
| [`blonde-ai-lockup-launch-dark.svg`](brand/blonde-ai-lockup-launch-dark.svg) | 2.010 B | **Preloader / Colophon Monumental (EN/Global)** com tagline *STAND OUT IN THE CROWD.* |
| [`blonde-ai-lockup-launch-pt-dark.svg`](brand/blonde-ai-lockup-launch-pt-dark.svg) | 2.023 B | Variante **PT-BR** do lockup de lançamento (*BRILHE NO MEIO DA MULTIDÃO.*). |
| [`blonde-ai-lockup-launch-beige.svg`](brand/blonde-ai-lockup-launch-beige.svg) | 1.996 B | Selo de encerramento na folha **Warm Beige / Travertino**. |
| [`blonde-ai-lockup-launch-royal.svg`](brand/blonde-ai-lockup-launch-royal.svg) | 2.046 B | Aplicação na zona **Royal Emerald (`#0B4635`)** / Ato IV. |
| [`blonde-ai-mark-volt.svg`](brand/blonde-ai-mark-volt.svg) | 619 B | **`favicon.svg`**, geometria guia do anel no **Ato 0 (Preloader)** e cursor/selos. |
| [`blonde-ai-mark-beige.svg`](brand/blonde-ai-mark-beige.svg) | 516 B | Marca d'água discreta de coluna editorial e metadados em `JetBrains Mono`. |
| [`blonde-ai-mark-royal.svg`](brand/blonde-ai-mark-royal.svg) | 639 B | Carimbo técnico sobre fundos claros/travertino. |
| [`blonde-ai-mark-mono.svg`](brand/blonde-ai-mark-mono.svg) | 454 B | Fallback monocromático / impressão / badges minimalistas. |
| [`blonde-moodboard.jpg`](brand/blonde-moodboard.jpg) | 606.361 B | Referência visual de direção de arte (lente titânio + travertino + vidro canelado + Volt `#CCFF29`). |

---

## 2. Imagens de Estúdio, Texturas & Interações (`assets/images/` — 12 arquivos)

| Arquivo | Tamanho | Papel & Onde Usar |
| :--- | :---: | :--- |
| [`hero-liquid-lens-studio.jpg`](images/hero-liquid-lens-studio.jpg) | 731.131 B | **Hero Keyframe / Poster / OpenGraph (`1200×630` crop):** Lente anamórfica envolta em metal líquido sobre pedestal travertino, flanqueada por vidro canelado Royal Emerald, feixe `30°` `#CCFF29` e multidão cinza dissolvendo ao fundo. |
| [`liquid-metal-sculpt-b.jpg`](images/liquid-metal-sculpt-b.jpg) | 504.611 B | **Escultura Ref 3D (`Z-1`):** Letra `b` + íris ótica em cromo líquido escuro com bordas iridescentes e bisel luminoso `#CCFF29` em `30°`. Serve como guia visual do shader e fallback estático do vídeo/WebGL. |
| [`matcap-liquid-chrome-volt.jpg`](images/matcap-liquid-chrome-volt.jpg) | 422.252 B | **Textura `uMatCap` Oficial do WebGL (`THREE.MeshMatcapMaterial` / Shader):** Esfera 1:1 centralizada em `#000000` com cromo líquido, reflexo esmeralda `#0B4635`, travertino quente `#EAE2D3`, bordas iridescentes e flash principal `#CCFF29`. Ver [`../como-criar/02-como-criar-webgl-liquid-metal-continuo.md`](../como-criar/02-como-criar-webgl-liquid-metal-continuo.md). |
| [`texture-fluted-emerald-glass.jpg`](images/texture-fluted-emerald-glass.jpg) | 702.882 B | **Mapa de Refração / Backdrop (Hero & Ato IV):** Vidro canelado vertical verde Royal Emerald refratando `#CCFF29` e brilho bege — útil para *fallback* CSS e mapa normal/altura em Tier Médio de GPU. |
| [`texture-travertine-editorial.jpg`](images/texture-travertine-editorial.jpg) | 901.617 B | **Superfície do Jornal Vivo (Ato III & Z-0):** Pedra calcária travertino polida com poros sutis e grão editorial fosco (`#EAE2D3`) para fundir a estética mineral às colunas do jornal. |
| [`interaction2-before-creator.jpg`](images/interaction2-before-creator.jpg) | 666.321 B | **Interação #2 (Modo `01 / CREATOR & FOUNDER` — `BEFORE`):** Still cru de home office com iluminação amarelada caseira e ruído de webcam. |
| [`interaction2-after-creator.jpg`](images/interaction2-after-creator.jpg) | 613.739 B | **Interação #2 (Modo `01 / CREATOR & FOUNDER` — `AFTER`):** Mesmo arquétipo de fundador transformado em enquadramento de cinema (`Obsidian` + bokeh Royal Emerald + recorte `#CCFF29`). *(Aplicar os overlays vetoriais HTML/CSS limpos por cima em tempo real, conforme `como-criar/05`)*. |
| [`interaction2-before-product.jpg`](images/interaction2-before-product.jpg) | 901.752 B | **Interação #2 (Modo `02 / REAL PRODUCT` — `BEFORE`):** Foto de celular crua de cronógrafo preto fosco sobre mesa bagunçada e luz fria de escritório. |
| [`interaction2-after-product.jpg`](images/interaction2-after-product.jpg) | 629.475 B | **Interação #2 (Modo `02 / REAL PRODUCT` — `AFTER`):** Cronógrafo heroico sobre bloco de travertino esculpido com vidro canelado verde e feixe `#CCFF29`. |
| [`interaction4-ai-slop-frame.jpg`](images/interaction4-ai-slop-frame.jpg) | 564.762 B | **Interação #4 (Camada Base — `AI GENERIC SLOP`):** Tênis de corrida gerado por IA genérica com aparência plástica e etiqueta de preço derretida/ilegível sob luz roxo-acinzentada. |
| [`interaction4-studio-clean-frame.jpg`](images/interaction4-studio-clean-frame.jpg) | 2.340.243 B | **Interação #4 (Camada Revelada pela Lupa — `DETERMINISTIC STUDIO`):** Mesmo tênis preservado em nitidez física sobre travertino + obsidiana + vidro canelado `#0B4635` + feixe `#CCFF29`, com espaço negativo limpo à direita para a UI sobrepor a tipografia vetorial nítida (`JetBrains Mono` / `Barlow Condensed`) sob a lupa. |
| [`video-3d-storyboard-frames.jpg`](images/video-3d-storyboard-frames.jpg) | 2.561.504 B | **Folha de Direção Cinematográfica 2×2 (Referência p/ Motion & WebGL):** Quatro beats visuais (*Multidão Cinza → Lente Liquid Chrome → Feixe `30°` no Travertino → Produto no Obsidian*) alinhando ritmo de scroll e pós-produção. |

---

## 3. Vídeos 3D Pré-Renderizados (`assets/videos/` — 3 arquivos `1080p` `16:9`)

Gerados com continuidade estrita dos *keyframes* acima para servir como **fallback instantâneo em Mobile/Low-GPU**, **loops de atmosfera** e **gabarito de física de iluminação do WebGL**:

| Arquivo | Tamanho | Duração & Keyframes | Onde Usar & Notas de Engenharia |
| :--- | :---: | :---: | :--- |
| [`hero-liquid-lens-loop.mp4`](videos/hero-liquid-lens-loop.mp4) | 6.180.488 B | `6s` loop contínuo (`hero-liquid-lens-studio.jpg` → `hero-liquid-lens-studio.jpg`) | **Fallback Principal do Hero (`Tier Mobile Light` / `Low GPU`):** O metal líquido gira e respira ao redor da lente anamórfica sobre o travertino enquanto o feixe `#CCFF29` pulsa suavemente. Usar `poster="../images/hero-liquid-lens-studio.jpg"`. |
| [`liquid-metal-b-morph.mp4`](videos/liquid-metal-b-morph.mp4) | 3.620.299 B | `6s` loop contínuo (`liquid-metal-sculpt-b.jpg` → `liquid-metal-sculpt-b.jpg`) | **Fallback do Rio de Metal Contínuo (Atos II, V, VI) / Preloader Loop:** Escultura `O b Holofote` em cromo viscoso respirando no espaço Obsidian com reflexo verde-esmeralda e aro Volt `30°`. |
| [`brand-teaser-motion.mp4`](videos/brand-teaser-motion.mp4) | 8.039.726 B | `8s` transição contínua (`liquid-metal-sculpt-b.jpg` → `interaction2-after-product.jpg`) | **Reel Cinematográfico (Ato I / Ato III / Teaser de Produto):** A câmera atravessa a íris de metal líquido por túneis de luz esmeralda e Volt até revelar o produto físico heroico sobre o travertino. |

### Regras Críticas de Produção para os Vídeos (Para o Próximo Agente)
1. **Mutado no Autoplay:** Os arquivos `.mp4` fonte gerados possuem faixa de áudio ambiente embutida. Em fundos automáticos, renderize sempre `<video autoPlay muted loop playsInline>` (e remova a faixa de áudio com `-an` ao gerar as versões web comprimidas WebM/H.264), deixando o sistema tátil **Interação #6 (`Web Audio API`)** controlar a experiência sonora sem duplicidade nem bloqueio de *autoplay* do navegador.
2. **Transcodificação Antes da CDN:** Execute o pipeline descrito em [`../como-criar/08-como-criar-videos-3d-loops-e-fallback-performance.md`](../como-criar/08-como-criar-videos-3d-loops-e-fallback-performance.md) para gerar pares `.webm` (`VP9` sem áudio, `720p`/`1080p`) e `.mp4` (`H.264 yuv420p -movflags +faststart`).

---

## 4. Sistema Sonoro (`assets/audio/` — 1 especificação)

- [`SOUND-DESIGN-SPEC-E-ASSETS.md`](audio/SOUND-DESIGN-SPEC-E-ASSETS.md): Tabela completa dos **8 sinais sonoros** (*Micro-Studio Optical Audio* inspirado em **Teenage Engineering OP-1 × Leica M6**), frequências exatas, curvas de *envelope* e pontos de disparo no **Preloader**, **Jornal** e **Interações #2 / #4 / #6**. Recomendado gerar em **Web Audio API pura** (`0 KB` em rede) conforme [`../como-criar/06-como-criar-sound-design-e-sistema-audio.md`](../como-criar/06-como-criar-sound-design-e-sistema-audio.md).
