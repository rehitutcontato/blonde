# Sound Design Spec — Sistema de Áudio Tátil (`Interação #6`)

> **Direção Sonora:** Estética **Teenage Engineering OP-1 × Câmera Leica M6 × Cinema Atmosférico**.  
> **Estratégia Recomendada:** Síntese em tempo real via **Web Audio API** (`0 KB` de peso em rede, `< 2ms` de latência, zero clipping com `DynamicsCompressorNode`) documentada em [`../../como-criar/06-como-criar-sound-design-e-sistema-audio.md`](../../como-criar/06-como-criar-sound-design-e-sistema-audio.md).

---

## Mapa Rápido dos 8 Sinais Sonoros

| # | Token do Evento | Onde Dispara | Duração | Frequência / Timbre |
| :-: | :--- | :--- | :---: | :--- |
| 1 | `irisOpen` | Clique em `[ENTER WITH SOUND]` no Preloader | `650ms` | Sub-drop `110Hz → 38Hz` + sopro bandpass `400Hz → 1800Hz` |
| 2 | `shutterClick` | Hover em tabs, links do jornal e toggles | `18ms` | Impulso mecânico seco `2400Hz+` |
| 3 | `bladeTick` | Arraste do slider *Before → After* (a cada 8%) | `9ms` | Micro-escovado metálico `3200Hz` ascendente |
| 4 | `loupeFocus` | Movimento/ativação da Lupa Técnica (#4) | `120ms` | Sopro ótico `520Hz → 780Hz` + filtro lowpass |
| 5 | `metalHover` | Movimento rápido sobre o Hero Liquid Metal | Contínuo | Drone sutil `146.8Hz + 220.2Hz` (quinta justa, gain `0.035`) |
| 6 | `broadsheetTurn` | Entrada em viewport da Folha Editorial Beige | `280ms` | Sopro de papel pesado `650Hz → 1200Hz` |
| 7 | `localeSwitch` | Troca entre `EN / PT / DE / FR / ES / IT` | `45ms` | Clique duplo de dial (`1900Hz` + `1400Hz`) |
| 8 | `waitlistPulse` | Hover/Click nos CTAs do WhatsApp Circle | `380ms` | Acorde quente `110/165/220Hz` filtrado `750Hz` |

*(Caso a equipe prefira complementar com arquivos `.wav` gravados de foley mecânico, mapear os mesmos 8 tokens acima na pasta `assets/audio/` usando buffers pré-carregados no `AudioContext` após o primeiro gesto do usuário).*
