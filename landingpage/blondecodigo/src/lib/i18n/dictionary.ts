'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import landingTokens from '@/tokens/landing-tokens.json';

export type LocaleCode = 'en' | 'pt' | 'de' | 'fr' | 'es' | 'it';

export interface LocaleMeta {
  code: LocaleCode;
  label: string;
  name: string;
  hreflang: string;
  displayScaleMultiplier: number;
  trackingDisplay: string;
}

export const SUPPORTED_LOCALES: LocaleMeta[] = [
  {
    code: 'en',
    label: 'EN',
    name: 'English',
    hreflang: 'en-US',
    displayScaleMultiplier:
      landingTokens.typography.localeOpticalParity.en.displayScaleMultiplier,
    trackingDisplay:
      landingTokens.typography.localeOpticalParity.en.trackingDisplay,
  },
  {
    code: 'pt',
    label: 'PT',
    name: 'Português',
    hreflang: 'pt-BR',
    displayScaleMultiplier:
      landingTokens.typography.localeOpticalParity.pt.displayScaleMultiplier,
    trackingDisplay:
      landingTokens.typography.localeOpticalParity.pt.trackingDisplay,
  },
  {
    code: 'de',
    label: 'DE',
    name: 'Deutsch',
    hreflang: 'de-DE',
    displayScaleMultiplier:
      landingTokens.typography.localeOpticalParity.de.displayScaleMultiplier,
    trackingDisplay:
      landingTokens.typography.localeOpticalParity.de.trackingDisplay,
  },
  {
    code: 'fr',
    label: 'FR',
    name: 'Français',
    hreflang: 'fr-FR',
    displayScaleMultiplier:
      landingTokens.typography.localeOpticalParity.fr.displayScaleMultiplier,
    trackingDisplay:
      landingTokens.typography.localeOpticalParity.fr.trackingDisplay,
  },
  {
    code: 'es',
    label: 'ES',
    name: 'Español',
    hreflang: 'es-419',
    displayScaleMultiplier:
      landingTokens.typography.localeOpticalParity.es.displayScaleMultiplier,
    trackingDisplay:
      landingTokens.typography.localeOpticalParity.es.trackingDisplay,
  },
  {
    code: 'it',
    label: 'IT',
    name: 'Italiano',
    hreflang: 'it-IT',
    displayScaleMultiplier:
      landingTokens.typography.localeOpticalParity.it.displayScaleMultiplier,
    trackingDisplay:
      landingTokens.typography.localeOpticalParity.it.trackingDisplay,
  },
];

export interface EditorialHeadline {
  before: string;
  italicFlash: string;
  after: string;
}

export interface LocaleDictionary {
  meta: {
    title: string;
    description: string;
  };
  preloader: {
    line1: string;
    line2Italic: string;
    line2After: string;
    ctaSound: string;
    skip: string;
    log1: string;
    log2: string;
    log3: string;
  };
  nav: {
    soundOn: string;
    soundOff: string;
    cta: string;
    menuOpenLabel: string;
    menuCloseLabel: string;
    drawerTitle: string;
    languageLabel: string;
    audioLabel: string;
    audioDesc: string;
    sections: {
      spotlight: string;
      diagnosis: string;
      vision: string;
      engine: string;
      cast: string;
      circle: string;
    };
  };
  hero: {
    badge: string;
    headline: EditorialHeadline;
    subheadline: string;
    cta: string;
    microcopy: string;
    reelLabel: string;
    scrollCue: string;
  };
  act2: {
    kicker: string;
    headline: EditorialHeadline;
    body: string;
    quote: string;
    telemetry: {
      skipLatencyLabel: string;
      skipLatencyValue: string;
      greySaturationLabel: string;
      greySaturationValue: string;
      modeLabel: string;
      modeValue: string;
    };
  };
  act3: {
    kicker: string;
    headline: EditorialHeadline;
    manifesto: string;
    comparisonTable: {
      colDimension: string;
      colGreyCrowd: string;
      colBlonde: string;
      row1Label: string;
      row1Grey: string;
      row1Blonde: string;
      row2Label: string;
      row2Grey: string;
      row2Blonde: string;
      row3Label: string;
      row3Grey: string;
      row3Blonde: string;
    };
    i2: {
      sectionKicker: string;
      tabCreator: string;
      tabProduct: string;
      beforeBadge: string;
      afterBadge: string;
      beforeProductBadge: string;
      afterProductBadge: string;
      dragHint: string;
      creatorOverlayTitle: string;
      creatorOverlayTag: string;
      productOverlayTitle: string;
      productOverlayTag: string;
    };
  };
  act4: {
    kicker: string;
    headline: EditorialHeadline;
    engine1Code: string;
    engine1Title: string;
    engine1Body: string;
    engine2Code: string;
    engine2Title: string;
    engine2Body: string;
    i4: {
      sectionKicker: string;
      labelLeft: string;
      labelRight: string;
      lensHint: string;
      toggleGeneric: string;
      toggleBlonde: string;
      slopStatus: string;
      cleanStatus: string;
      vectorOverlayTitle: string;
      vectorOverlaySub: string;
      vectorOverlaySpec: string;
    };
  };
  act5: {
    kicker: string;
    headline: EditorialHeadline;
    col1Kicker: string;
    col1Title: string;
    col1Body: string;
    col1Tags: string[];
    col2Kicker: string;
    col2Title: string;
    col2Body: string;
    col2Tags: string[];
  };
  act6: {
    kicker: string;
    headline: EditorialHeadline;
    subtitle: string;
    pillars: {
      num: string;
      title: string;
      desc: string;
    }[];
    datesNote: string;
    timeline: {
      step1Date: string;
      step1Label: string;
      step2Date: string;
      step2Label: string;
      step3Date: string;
      step3Label: string;
    };
    cta: string;
  };
  colophon: {
    wordmark: string;
    slogan: string;
    sloganAux?: string;
    statusLine: string;
    whatsappCircleLabel: string;
    rights: string;
  };
}

export const DICTIONARY: Record<LocaleCode, LocaleDictionary> = {
  en: {
    meta: {
      title: 'blonde AI — Stand Out in the Crowd | Autonomous Creative Engine (AaaS)',
      description:
        'Bring your creative vision and raw footage or phone photos—blonde AI delivers finished, studio-grade ad campaigns ready to run. Brazil Genesis Access · Beta v0.5 opens April 9, 2027.',
    },
    preloader: {
      line1: 'Welcome to what sets you',
      line2Italic: 'apart',
      line2After: 'from everyone else.',
      ctaSound: 'ENTER WITH SOUND',
      skip: 'ENTER SILENTLY',
      log1: 'CALIBRATING OPTICAL LENS',
      log2: 'SHAPING LIQUID CHROME FIELD',
      log3: 'LOCKING SPOTLIGHT',
    },
    nav: {
      soundOn: 'SOUND: ON',
      soundOff: 'SOUND: OFF',
      cta: 'JOIN WAITLIST ↗',
      menuOpenLabel: 'MENU',
      menuCloseLabel: 'CLOSE',
      drawerTitle: 'LIVING BROADSHEET // NAVIGATION',
      languageLabel: 'EDITORIAL EDITION (6 LANGUAGES)',
      audioLabel: 'STUDIO SOUND ENGINE (#6)',
      audioDesc: 'OP-1 × Leica M6 tactile optical audio synthesis',
      sections: {
        spotlight: '01 / THE SPOTLIGHT',
        diagnosis: '02 / THE DIAGNOSIS',
        vision: '03 / AaaS & BLADE (#2)',
        engine: '04 / VECTOR ENGINE (#4)',
        cast: '05 / THE CAST',
        circle: '06 / FOUNDING ROOM',
      },
    },
    hero: {
      badge: 'BRAZIL GENESIS ACCESS · GLOBAL STANDARD · BETA 0.5: 09 APR 2027',
      headline: {
        before: 'THE CROWD IS GREY.',
        italicFlash: 'Own',
        after: 'THE SPOTLIGHT.',
      },
      subheadline:
        'Not another editing dashboard that makes you work. Bring your creative vision and raw footage or phone photos—blonde AI delivers finished, studio-grade ad campaigns ready to run.',
      cta: 'ENTER THE PRIVATE WAITLIST ↗',
      microcopy:
        'Direct founder access · Beta v0.5 & Founder seats drop exclusively inside the WhatsApp circle on Apr 9, 2027.',
      reelLabel: 'STUDIO MOTION PROOF // 30° VOLT ANAMORPHIC',
      scrollCue: 'READ LIVING BROADSHEET ↓',
    },
    act2: {
      kicker: 'EDITION 001 // THE DIAGNOSIS',
      headline: {
        before: 'SCROLL FOR TEN SECONDS.',
        italicFlash: 'Everything',
        after: 'LOOKS THE SAME.',
      },
      body: 'Plastic AI avatars. Recycled CapCut templates. Melted text that betrays the illusion in 0.4 seconds. Millions of brands fighting for attention while wearing the exact same grey uniform. Nobody stops for what blends in. People stop for what radiates.',
      quote: '“Nobody stops for what blends in. People stop for what radiates.”',
      telemetry: {
        skipLatencyLabel: 'HUMAN AI-SLOP DETECTION',
        skipLatencyValue: '0.4 SEC',
        greySaturationLabel: 'FEED CLONE UNIFORMITY',
        greySaturationValue: '94.2%',
        modeLabel: 'CATEGORY SHIFT',
        modeValue: 'SaaS → AaaS',
      },
    },
    act3: {
      kicker: 'AaaS // AGENCY-AS-A-SERVICE',
      headline: {
        before: 'KEEP THE',
        italicFlash: 'Vision.',
        after: 'WE DELIVER THE WORK.',
      },
      manifesto:
        'Tools sell you complexity. Agencies sell you weeks of waiting. blonde AI is built to become the central engine for ad creators and media buyers—and the end of operational friction for founders. You shouldn’t need a traffic manager or an agency to translate an idea into a studio commercial. Bring the creative vision. We execute the rest.',
      comparisonTable: {
        colDimension: 'DIMENSION',
        colGreyCrowd: 'THE GREY CROWD (LEGACY SaaS)',
        colBlonde: 'blonde AI (AUTONOMOUS AaaS)',
        row1Label: 'Deliverable',
        row1Grey: 'Fragmented timelines requiring hours in CapCut, Runway & Canva.',
        row1Blonde: 'Finished work ready to run: creative vision + real assets → studio commercial.',
        row2Label: 'Founder & Creator Role',
        row2Grey: 'Chasing slow agencies or cutting silences and fixing captions manually.',
        row2Blonde: 'Pure creative direction. Technical and aesthetic execution happens inside the engine.',
        row3Label: 'Visual Integrity',
        row3Grey: 'Plastic AI avatars and melted text that audiences skip in 0.4s.',
        row3Blonde: 'Creative AI + Deterministic FFmpeg: real people & products intact with razor-sharp vector type.',
      },
      i2: {
        sectionKicker: 'INTERACTION #2 // OPTICAL BLADE COMPARATOR',
        tabCreator: '01 / CREATOR & FOUNDER',
        tabProduct: '02 / REAL PRODUCT',
        beforeBadge: 'RAW TAKE · [00:08 SILENCE]',
        afterBadge: 'STUDIO MASTER · BEAT-SYNCED',
        beforeProductBadge: 'RAW PHONE SNAPSHOT · [FLAT FLUORESCENT]',
        afterProductBadge: 'STUDIO AD · [PRODUCT GEOMETRY LOCKED]',
        dragHint: 'DRAG BLADE',
        creatorOverlayTitle: '“STOP SELLING TOOLS. DELIVER',
        creatorOverlayTag: 'THE WORK.”',
        productOverlayTitle: 'CHRONOGRAPH OBSIDIAN //',
        productOverlayTag: 'TRAVERTINE EDITION',
      },
    },
    act4: {
      kicker: 'ACT IV // UNDER THE LENS',
      headline: {
        before: 'CREATIVE DIRECTION',
        italicFlash: 'Meets',
        after: 'DETERMINISTIC PRECISION.',
      },
      engine1Code: 'ENGINE 01 // STUDIO EDIT',
      engine1Title: 'Studio Edit Engine',
      engine1Body:
        'Cuts silences, locks beats, amplifies hooks, burns razor-sharp editorial typography.',
      engine2Code: 'ENGINE 02 // AUTONOMOUS AD DIRECTOR',
      engine2Title: 'Autonomous Ad Engine',
      engine2Body:
        'Directs real camera motion around your true product—without ever melting your brand, label, or price.',
      i4: {
        sectionKicker: 'INTERACTION #4 // PIXEL INTEGRITY LOUPE',
        labelLeft: 'GENERIC AI VIDEO // TEXT MELT',
        labelRight: 'blonde AI // DETERMINISTIC VECTOR ENGINE',
        lensHint: 'MOVE LENS TO INSPECT PIXEL INTEGRITY',
        toggleGeneric: 'INSPECT: GENERIC AI MELT',
        toggleBlonde: 'INSPECT: blonde AI VECTOR ENGINE',
        slopStatus: 'ARTIFACT DETECTED: HALLUCINATED GLYPHS & WAX MESH',
        cleanStatus: '00:04:12 · FFMPEG + LIBASS VECTOR LAYER LOCKED',
        vectorOverlayTitle: '$240',
        vectorOverlaySub: 'LIMITED DROP // VOLT SPEC',
        vectorOverlaySpec: '100% REAL PRODUCT GEOMETRY · ZERO AI HALLUCINATION',
      },
    },
    act5: {
      kicker: 'ACT V // THE CAST',
      headline: {
        before: 'BUILT FOR THOSE WHO',
        italicFlash: 'Command',
        after: 'ATTENTION.',
      },
      col1Kicker: '01 // CORE FOCUS: CREATORS, FOUNDERS & INFOPRODUCERS',
      col1Title: 'Creators, Founders & Infoproducers',
      col1Body:
        'You carry the message, the face, the offer. Stop burning nights on timelines or waiting days for external revisions. Speak to the camera—or shoot raw moments—and step out with studio presence every single day.',
      col1Tags: ['DIRECT-TO-CAMERA CREATORS', 'VISIONARY FOUNDERS', 'HIGH-TICKET INFOPRODUCERS'],
      col2Kicker: '02 // COUPLED VERTICALS: REAL BRANDS & PERFORMANCE OPERATORS',
      col2Title: 'Real Brands, E-Commerce D2C & Media Buyers',
      col2Body:
        'Physical products, D2C storefronts, and performance buyers lock straight into the same engine—scaling cinema-grade product ads and multi-hook tests at autonomous speed.',
      col2Tags: ['PHYSICAL PRODUCT BRANDS', 'D2C E-COMMERCE', 'PERFORMANCE MEDIA BUYERS'],
    },
    act6: {
      kicker: 'GENESIS WAITLIST // BRAZIL FIRST · GLOBAL STANDARD',
      headline: {
        before: 'NOT AN OPEN BETA.',
        italicFlash: 'The',
        after: 'FOUNDING ROOM.',
      },
      subtitle:
        'We are opening first behind closed doors in Brazil—engineered to global standards from day one. No public plans yet. Only the circle.',
      pillars: [
        {
          num: '01',
          title: 'Direct Founder Access',
          desc: 'Open channel inside the private WhatsApp room directly with the builder during Genesis construction.',
        },
        {
          num: '02',
          title: 'Co-Create Updates & Insights',
          desc: 'Share feedback, creative workflows, and product insights that directly shape upcoming engine releases.',
        },
        {
          num: '03',
          title: 'High-Signal Operator Networking',
          desc: 'Connect with selected creators, founders, infoproducers, and media operators operating at the top.',
        },
        {
          num: '04',
          title: 'Exclusive Founder Pre-Sale Key',
          desc: 'The private Founder seat pre-sale link drops exclusively inside this group 1 month before May launch.',
        },
      ],
      datesNote:
        'BETA v0.5 OPENS APRIL 9, 2027 — Founder pre-sale link drops exclusively inside WhatsApp 1 month before the May 2027 Official Launch.',
      timeline: {
        step1Date: 'NOW',
        step1Label: 'Private WhatsApp Waitlist (Brazil First · Open for Founding Voices)',
        step2Date: '09 APR 2027',
        step2Label: 'Closed Beta v0.5 + Exclusive Founder Pre-Sale Link (Dropped Only in Group)',
        step3Date: 'MAY 2027',
        step3Label: 'Global Public Launch (blonde.ai)',
      },
      cta: 'ENTER THE PRIVATE WAITLIST ↗',
    },
    colophon: {
      wordmark: 'blonde AI',
      slogan: 'STAND OUT IN THE CROWD.',
      statusLine:
        'BRAZIL GENESIS ACCESS · BETA v0.5: 09 APR 2027 · GLOBAL LAUNCH: MAY 2027 · TARGET URL: blonde.ai',
      whatsappCircleLabel: 'WHATSAPP GENESIS CIRCLE ↗',
      rights: '© 2026–2027 blonde AI — All Rights Reserved. Target future domain: blonde.ai',
    },
  },

  pt: {
    meta: {
      title: 'blonde AI — Brilhe no Meio da Multidão | Motor Criativo Autônomo (AaaS)',
      description:
        'Traga sua visão criativa e gravações ou fotos reais do celular—a blonde AI entrega campanhas de estúdio finalizadas, prontas para rodar. Acesso Gênese Brasil · Beta v0.5 abre em 09 de Abril de 2027.',
    },
    preloader: {
      line1: 'Bem-vindo ao que separa você',
      line2Italic: 'de todos',
      line2After: 'os outros.',
      ctaSound: 'ENTRAR COM SOM',
      skip: 'ENTRAR EM SILÊNCIO',
      log1: 'CALIBRANDO LENTE ÓTICA',
      log2: 'MOLDANDO CAMPO CROMO LÍQUIDO',
      log3: 'TRAVANDO HOLOFOTE 30°',
    },
    nav: {
      soundOn: 'SOM: ON',
      soundOff: 'SOM: OFF',
      cta: 'ENTRAR NA LISTA ↗',
      menuOpenLabel: 'MENU',
      menuCloseLabel: 'FECHAR',
      drawerTitle: 'JORNAL VIVO // NAVEGAÇÃO',
      languageLabel: 'EDIÇÃO EDITORIAL (6 IDIOMAS)',
      audioLabel: 'MOTOR DE SOM TÁTIL (#6)',
      audioDesc: 'Síntese acústica OP-1 × Leica M6 em tempo real',
      sections: {
        spotlight: '01 / O HOLOFOTE',
        diagnosis: '02 / O DIAGNÓSTICO',
        vision: '03 / VISÃO AaaS & LÂMINA (#2)',
        engine: '04 / MOTOR VETORIAL (#4)',
        cast: '05 / PRA QUEM',
        circle: '06 / SALA FUNDADORA',
      },
    },
    hero: {
      badge: 'ACESSO GÊNESE BRASIL · PADRÃO GLOBAL · BETA 0.5: 09 ABR 2027',
      headline: {
        before: 'A MULTIDÃO É CINZA.',
        italicFlash: 'Domine',
        after: 'O HOLOFOTE.',
      },
      subheadline:
        'Não é mais um painel de edição que faz você trabalhar. Traga sua visão criativa e gravações ou fotos reais do celular—a blonde AI entrega campanhas de estúdio finalizadas, prontas para rodar.',
      cta: 'ENTRAR NA LISTA DE ESPERA VIP ↗',
      microcopy:
        'Acesso direto ao fundador · Vagas Founder e Beta v0.5 liberados exclusivamente no grupo em 09 de Abr, 2027.',
      reelLabel: 'PROVA DE ESTÚDIO // LENTE ANAMÓRFICA 30° VOLT',
      scrollCue: 'LER JORNAL VIVO ↓',
    },
    act2: {
      kicker: 'EDIÇÃO 001 // O DIAGNÓSTICO',
      headline: {
        before: 'ROLE DEZ SEGUNDOS.',
        italicFlash: 'Tudo',
        after: 'PARECE IGUAL.',
      },
      body: 'Avatares plásticos de IA. Templates reciclados de CapCut. Textos derretidos que entregam o amadorismo em 0,4 segundo. Milhões de marcas brigando por atenção usando exatamente o mesmo uniforme cinza. Ninguém para para quem se mistura. As pessoas param para quem brilha.',
      quote: '“Ninguém para para quem se mistura. As pessoas param para quem brilha.”',
      telemetry: {
        skipLatencyLabel: 'DETECÇÃO HUMANA DE IA GENÉRICA',
        skipLatencyValue: '0,4 SEG',
        greySaturationLabel: 'UNIFORMIDADE DE CLONES NO FEED',
        greySaturationValue: '94,2%',
        modeLabel: 'TRANSIÇÃO DE CATEGORIA',
        modeValue: 'SaaS → AaaS',
      },
    },
    act3: {
      kicker: 'AaaS // AGÊNCIA COMO SERVIÇO',
      headline: {
        before: 'FIQUE COM A',
        italicFlash: 'Visão.',
        after: 'NÓS ENTREGAMOS A OBRA.',
      },
      manifesto:
        'Softwares vendem complexidade. Agências vendem semanas de espera. A blonde AI nasce para ser o motor principal de criadores de anúncio e gestores de tráfego—e libertar o empresário. Você não deveria precisar de um gestor ou agência para transformar uma ideia em comercial de estúdio. Traga apenas a visão criativa. O sistema entrega pronto.',
      comparisonTable: {
        colDimension: 'DIMENSÃO',
        colGreyCrowd: 'MULTIDÃO CINZA (SaaS COMUM)',
        colBlonde: 'blonde AI (MOTOR AaaS AUTÔNOMO)',
        row1Label: 'O Que Entrega',
        row1Grey: 'Ferramenta solta que ainda exige horas no CapCut, Runway e editor humano.',
        row1Blonde: 'O trabalho completo pronto: visão criativa + ativos reais → comercial de estúdio.',
        row2Label: 'Papel do Founder & Creator',
        row2Grey: 'Cobrar agência lenta ou perder 10h por semana cortando silêncios e legendas.',
        row2Blonde: 'Apenas visão criativa. A execução técnica e estética nível estúdio ocorre no motor.',
        row3Label: 'Qualidade Visual',
        row3Grey: 'Avatares plásticos e textos derretidos (AI Slop) ignorados em 0,4s.',
        row3Blonde: 'IA Criativa + FFmpeg Determinístico: pessoas e produtos reais intactos com vetor cirúrgico.',
      },
      i2: {
        sectionKicker: 'INTERAÇÃO #2 // LÂMINA ÓTICA ANTES → DEPOIS',
        tabCreator: '01 / CREATOR & FOUNDER',
        tabProduct: '02 / PRODUTO REAL',
        beforeBadge: 'TAKE CRU · [00:08 SILÊNCIO]',
        afterBadge: 'MASTER DE ESTÚDIO · NO BEAT',
        beforeProductBadge: 'FOTO CRUA DE CELULAR · [LUZ COMUM]',
        afterProductBadge: 'COMERCIAL DE ESTÚDIO · [PRODUTO TRAVADO]',
        dragHint: 'ARRASTE A LÂMINA',
        creatorOverlayTitle: '“PARE DE VENDER PAINEL. ENTREGUE',
        creatorOverlayTag: 'A OBRA PRONTA.”',
        productOverlayTitle: 'CRONÓGRAFO OBSIDIAN //',
        productOverlayTag: 'EDIÇÃO TRAVERTINO',
      },
    },
    act4: {
      kicker: 'ATO IV // SOB A LENTE',
      headline: {
        before: 'DIREÇÃO CRIATIVA',
        italicFlash: 'Encontra',
        after: 'PRECISÃO DETERMINÍSTICA.',
      },
      engine1Code: 'MOTOR 01 // STUDIO EDIT',
      engine1Title: 'Motor Studio Edit',
      engine1Body:
        'Corta silêncios, crava cortes no beat, amplia retenção e grava tipografia editorial nítida.',
      engine2Code: 'MOTOR 02 // DIRETOR AD AUTÔNOMO',
      engine2Title: 'Motor Ad Autônomo',
      engine2Body:
        'Dirige câmera cinematográfica ao redor do seu produto real—sem jamais derreter sua marca, rótulo ou preço.',
      i4: {
        sectionKicker: 'INTERAÇÃO #4 // LUPA DE INTEGRIDADE DE PIXELS',
        labelLeft: 'IA GENÉRICA // TEXTO DERRETIDO',
        labelRight: 'blonde AI // MOTOR VETORIAL DETERMINÍSTICO',
        lensHint: 'MOVA A LENTE PARA INSPECIONAR NITIDEZ',
        toggleGeneric: 'INSPECIONAR: IA GENÉRICA',
        toggleBlonde: 'INSPECIONAR: MOTOR blonde AI',
        slopStatus: 'ARTEFATO DETECTADO: GLIFOS DERRETIDOS & TEXTURA DE CERA',
        cleanStatus: '00:04:12 · CAMADA VETORIAL FFMPEG + LIBASS TRAVADA',
        vectorOverlayTitle: '$240',
        vectorOverlaySub: 'EDIÇÃO LIMITADA // VOLT SPEC',
        vectorOverlaySpec: '100% GEOMETRIA REAL DO PRODUTO · ZERO ALUCINAÇÃO',
      },
    },
    act5: {
      kicker: 'ATO V // ELENCO PRINCIPAL',
      headline: {
        before: 'FEITO PARA QUEM',
        italicFlash: 'Comanda',
        after: 'A ATENÇÃO.',
      },
      col1Kicker: '01 // FOCO CENTRAL: CREATORS, FOUNDERS & INFOPRODUTORES',
      col1Title: 'Creators, Founders & Infoprodutores',
      col1Body:
        'Você carrega a mensagem, o rosto e a oferta. Pare de queimar noites em timelines ou esperar dias por revisões externas. Fale para a câmera—ou capte takes crus—e saia com presença de estúdio todos os dias.',
      col1Tags: ['CREATORS DE CONTEÚDO', 'FOUNDERS & EMPRESÁRIOS', 'INFOPRODUTORES'],
      col2Kicker: '02 // VERTICAIS ACOPLADAS: MARCAS REAIS & GESTORES DE PERFORMANCE',
      col2Title: 'Marcas Físicas, E-Commerce D2C & Gestores de Tráfego',
      col2Body:
        'Marcas físicas, e-commerces D2C e gestores de tráfego acoplam direto no mesmo motor—escalando comerciais de produto real e múltiplos ganchos em velocidade autônoma.',
      col2Tags: ['MARCAS DE PRODUTO FÍSICO', 'E-COMMERCE D2C', 'GESTORES DE TRÁFEGO'],
    },
    act6: {
      kicker: 'LISTA GÊNESE // BRASIL PRIMEIRO · PADRÃO GLOBAL',
      headline: {
        before: 'NÃO É UM BETA ABERTO. É A',
        italicFlash: 'Sala',
        after: 'FUNDADORA.',
      },
      subtitle:
        'Estamos abrindo primeiro a portas fechadas no Brasil—com engenharia e padrão global desde o dia um. Ainda sem planos públicos. Apenas o círculo.',
      pillars: [
        {
          num: '01',
          title: 'Acesso Direto ao Fundador',
          desc: 'Canal aberto dentro do grupo privado no WhatsApp direto com quem está construindo o motor.',
        },
        {
          num: '02',
          title: 'Co-Crie Atualizações & Ideias',
          desc: 'Envie feedbacks, ideias e insights práticos que moldam diretamente as próximas atualizações.',
        },
        {
          num: '03',
          title: 'Networking de Alto Nível',
          desc: 'Conexão direta com outros creators, founders, infoprodutores e operadores selecionados.',
        },
        {
          num: '04',
          title: 'Link Secreto das Vagas Founder',
          desc: 'O link exclusivo da pré-venda Founder será liberado apenas no grupo 1 mês antes do lançamento de Maio.',
        },
      ],
      datesNote:
        'BETA v0.5 ABRE EM 09 DE ABRIL DE 2027 — O link da pré-venda Founder será enviado exclusivamente no WhatsApp 1 mês antes do Lançamento Oficial em Maio de 2027.',
      timeline: {
        step1Date: 'AGORA',
        step1Label: 'Lista de Espera Privada no WhatsApp (Brasil Primeiro · Aberto para Vozes Fundadoras)',
        step2Date: '09 ABR 2027',
        step2Label: 'Beta Fechado v0.5 + Link Exclusivo Pré-Venda Founder (Enviado Só no Grupo)',
        step3Date: 'MAIO 2027',
        step3Label: 'Lançamento Público Global (blonde.ai)',
      },
      cta: 'ENTRAR NA LISTA DE ESPERA VIP ↗',
    },
    colophon: {
      wordmark: 'blonde AI',
      slogan: 'STAND OUT IN THE CROWD.',
      sloganAux: 'BRILHE NO MEIO DA MULTIDÃO.',
      statusLine:
        'BRAZIL GENESIS ACCESS · BETA v0.5: 09 APR 2027 · GLOBAL LAUNCH: MAY 2027 · TARGET URL: blonde.ai',
      whatsappCircleLabel: 'CÍRCULO GÊNESE WHATSAPP ↗',
      rights: '© 2026–2027 blonde AI — Todos os direitos reservados. Domínio alvo futuro: blonde.ai',
    },
  },

  de: {
    meta: {
      title: 'blonde AI — Stand Out in the Crowd | Autonome Creative Engine (AaaS)',
      description:
        'Bring deine kreative Vision und echtes Rohmaterial—blonde AI liefert fertige Studio-Kampagnen, bereit zum Schalten. Beta v0.5 startet am 09. April 2027.',
    },
    preloader: {
      line1: 'Willkommen bei dem, was dich',
      line2Italic: 'von allen',
      line2After: 'anderen trennt.',
      ctaSound: 'MIT TON STARTEN',
      skip: 'LAUTLOS STARTEN',
      log1: 'OPTISCHE LINSE KALIBRIEREN',
      log2: 'FLÜSSIGCHROM-FELD FORMEN',
      log3: 'SPOTLIGHT FIXIEREN',
    },
    nav: {
      soundOn: 'TON: AN',
      soundOff: 'TON: AUS',
      cta: 'WARTELISTE ↗',
      menuOpenLabel: 'MENÜ',
      menuCloseLabel: 'SCHLIESSEN',
      drawerTitle: 'LIVING BROADSHEET // NAVIGATION',
      languageLabel: 'AUSGABE (6 SPRACHEN)',
      audioLabel: 'STUDIO-SOUND-SYSTEM (#6)',
      audioDesc: 'Taktile OP-1 × Leica M6 Web-Audio-Synthese',
      sections: {
        spotlight: '01 / DAS LICHT',
        diagnosis: '02 / DIE DIAGNOSE',
        vision: '03 / AaaS & KLINGE (#2)',
        engine: '04 / VEKTOR-ENGINE (#4)',
        cast: '05 / FÜR WEN',
        circle: '06 / GRÜNDER-KREIS',
      },
    },
    hero: {
      badge: 'BRASILIEN GENESIS-ZUGANG · GLOBAL STANDARD · BETA 0.5: 09. APR 2027',
      headline: {
        before: 'DIE MASSE IST GRAU.',
        italicFlash: 'Beherrsche',
        after: 'DAS LICHT.',
      },
      subheadline:
        'Kein weiteres Schnitt-Tool, das dich arbeiten lässt. Bring deine kreative Vision und echtes Rohmaterial—blonde AI liefert fertige Studio-Kampagnen, bereit zum Schalten.',
      cta: 'AUF DIE PRIVATE WARTELISTE ↗',
      microcopy:
        'Direkter Gründer-Zugang · Beta v0.5 & Founder-Plätze exklusiv in der WhatsApp-Gruppe am 09. Apr 2027.',
      reelLabel: 'STUDIO-BEWEIS // 30° VOLT ANAMORPHISCH',
      scrollCue: 'AUSGABE LESEN ↓',
    },
    act2: {
      kicker: 'AUSGABE 001 // DIE DIAGNOSE',
      headline: {
        before: 'SCROLLE ZEHN SEKUNDEN.',
        italicFlash: 'Alles',
        after: 'SIEHT GLEICH AUS.',
      },
      body: 'Plastische KI-Avatare. Recycelte CapCut-Vorlagen. Verschmolzener Text, der alles in 0,4 Sekunden verrät. Millionen Marken im exakt gleichen grauen Einheitslook. Niemand stoppt für Durchschnitt. Man stoppt für echte Strahlkraft.',
      quote: '„Niemand stoppt für Durchschnitt. Man stoppt für echte Strahlkraft.“',
      telemetry: {
        skipLatencyLabel: 'KI-SLOP-ERKENNUNG',
        skipLatencyValue: '0,4 SEK',
        greySaturationLabel: 'FEED-EINHEITSLOOK',
        greySaturationValue: '94,2%',
        modeLabel: 'KATEGORIE-WECHSEL',
        modeValue: 'SaaS → AaaS',
      },
    },
    act3: {
      kicker: 'AaaS // AGENTUR ALS SYSTEM',
      headline: {
        before: 'BEHALTE DIE',
        italicFlash: 'Vision.',
        after: 'WIR LIEFERN DAS WERK.',
      },
      manifesto:
        'Tools verkaufen Komplexität. Agenturen verkaufen Wartezeit. blonde AI ist der zentrale Motor für Ad-Creator und Media Buyer—und befreit Unternehmer von operativer Last. Du brauchst keine klassische Agentur mehr, um eine Idee in Studio-Qualität umzusetzen. Bring die Vision. Wir liefern das Ergebnis.',
      comparisonTable: {
        colDimension: 'DIMENSION',
        colGreyCrowd: 'GRAUE MASSE (KLASSISCHES SaaS)',
        colBlonde: 'blonde AI (AUTONOMES AaaS)',
        row1Label: 'Ergebnis',
        row1Grey: 'Einzelne Tools, die Stunden in CapCut & Timelines kosten.',
        row1Blonde: 'Fertiges Werk: Kreative Vision + echte Assets → Studio-Commercial.',
        row2Label: 'Rolle des Founders',
        row2Grey: 'Warten auf Agenturen oder manuelles Schneiden von Pausen.',
        row2Blonde: 'Reine kreative Richtung. Die Studio-Umsetzung übernimmt die Engine.',
        row3Label: 'Visuelle Präzision',
        row3Grey: 'Plastik-Avatare und verschmolzene Texte, die in 0,4s übersprungen werden.',
        row3Blonde: 'Kreative KI + Deterministisches FFmpeg: Echte Produkte & gestochen scharfe Vektoren.',
      },
      i2: {
        sectionKicker: 'INTERAKTION #2 // OPTISCHE VORHER-NACHHER-KLINGE',
        tabCreator: '01 / CREATOR & FOUNDER',
        tabProduct: '02 / ECHTES PRODUKT',
        beforeBadge: 'ROHMATERIAL · [00:08 STILLE]',
        afterBadge: 'STUDIO-MASTER · BEAT-SYNC',
        beforeProductBadge: 'ROHES HANDYFOTO · [FLACHES LICHT]',
        afterProductBadge: 'STUDIO-AD · [PRODUKT FIXIERT]',
        dragHint: 'KLINGE ZIEHEN',
        creatorOverlayTitle: '„VERKAUFE KEINE TOOLS. LIEFERT',
        creatorOverlayTag: 'DAS WERK.“',
        productOverlayTitle: 'CHRONOGRAPH OBSIDIAN //',
        productOverlayTag: 'TRAVERTIN-EDITION',
      },
    },
    act4: {
      kicker: 'AKT IV // UNTER DER LINSE',
      headline: {
        before: 'KREATIVE REGIE',
        italicFlash: 'Trifft',
        after: 'DETERMINISTISCHE PRÄZISION.',
      },
      engine1Code: 'ENGINE 01 // STUDIO EDIT',
      engine1Title: 'Studio Edit Engine',
      engine1Body:
        'Entfernt Pausen, schneidet exakt auf den Beat, brennt gestochen scharfe Typografie.',
      engine2Code: 'ENGINE 02 // AUTONOMOUS AD ENGINE',
      engine2Title: 'Autonomous Ad Engine',
      engine2Body:
        'Führt virtuelle Kameras um dein echtes Produkt—ohne jemals Logo oder Preis zu verzerren.',
      i4: {
        sectionKicker: 'INTERAKTION #4 // PIXEL-INTEGRITÄTS-LUPE',
        labelLeft: 'STANDARD-KI // VERZERRTER TEXT',
        labelRight: 'blonde AI // VEKTOR-ENGINE',
        lensHint: 'LUPE BEWEGEN ZUR PRÜFUNG',
        toggleGeneric: 'PRÜFEN: STANDARD-KI',
        toggleBlonde: 'PRÜFEN: blonde AI VEKTOR-ENGINE',
        slopStatus: 'ARTEFAKT ERKANNT: VERSCHMOLZENE SCHRIFT & WACHS-TEXTUR',
        cleanStatus: '00:04:12 · FFMPEG + LIBASS VEKTOR-EBENE GESPERRT',
        vectorOverlayTitle: '$240',
        vectorOverlaySub: 'LIMITED DROP // VOLT SPEC',
        vectorOverlaySpec: '100% ECHTE PRODUKTGEOMETRIE · NULL HALLUZINATION',
      },
    },
    act5: {
      kicker: 'AKT V // DIE BESETZUNG',
      headline: {
        before: 'GEBAUT FÜR ALLE, DIE AUFMERKSAMKEIT',
        italicFlash: 'Führen.',
        after: '',
      },
      col1Kicker: '01 // KERNFOKUS: CREATOR, FOUNDER & INFOPRODUZENTEN',
      col1Title: 'Creator, Founder & Infoproduzenten',
      col1Body:
        'Du trägst die Botschaft, das Gesicht, das Angebot. Verschwende keine Nächte mehr in Schnittprogrammen. Sprich in die Kamera und tritt jeden Tag mit Studio-Autorität auf.',
      col1Tags: ['CREATOR & PERSONAL BRANDS', 'UNTERNEHMER & FOUNDER', 'INFOPRODUZENTEN'],
      col2Kicker: '02 // GEKOPPELTE VERTIKALEN: ECHTE MARKEN & MEDIA BUYER',
      col2Title: 'Physische Marken, D2C-Shops & Performance-Buyer',
      col2Body:
        'Physische Marken, D2C-Shops und Performance-Buyer docken direkt an denselben Motor an—für skalierbare Produkt-Ads in Kinoqualität.',
      col2Tags: ['PHYSISCHE PRODUKTMARKEN', 'D2C E-COMMERCE', 'PERFORMANCE MEDIA BUYER'],
    },
    act6: {
      kicker: 'GENESIS WARTELISTE // BRASILIEN ZUERST · WELTSTANDARD',
      headline: {
        before: 'KEINE OFFENE BETA.',
        italicFlash: 'Der',
        after: 'GRÜNDER-KREIS.',
      },
      subtitle:
        'Wir öffnen zuerst hinter verschlossenen Türen in Brasilien—gebaut für den Weltstandard. Noch keine öffentlichen Pläne. Nur der innere Kreis.',
      pillars: [
        {
          num: '01',
          title: 'Direkter Gründer-Zugang',
          desc: 'Offener Draht direkt zum Gründer innerhalb des privaten WhatsApp-Zirkels während der Aufbauphase.',
        },
        {
          num: '02',
          title: 'Updates & Ideen Mitgestalten',
          desc: 'Teile Feedback, Ideen und Insights, die direkt in kommende Produkt-Updates einfließen.',
        },
        {
          num: '03',
          title: 'Starkes Operator-Netzwerk',
          desc: 'Austausch auf Augenhöhe mit ausgewählten Creatorn, Foundern und Performance-Operatoren.',
        },
        {
          num: '04',
          title: 'Exklusiver Founder-Vorverkauf',
          desc: 'Der geheime Link für die limitierten Founder-Plätze wird exklusiv in der Gruppe 1 Monat vor dem Mai-Launch geteilt.',
        },
      ],
      datesNote:
        'BETA v0.5 STARTET AM 09. APRIL 2027 — Der exklusive Founder-Vorverkauf erfolgt nur in WhatsApp, 1 Monat vor dem offiziellen Launch im Mai 2027.',
      timeline: {
        step1Date: 'JETZT',
        step1Label: 'Private WhatsApp-Warteliste (Brasilien Zuerst · Offen für Gründerstimmen)',
        step2Date: '09. APR 2027',
        step2Label: 'Closed Beta v0.5 + Exklusiver Founder-Vorverkauf (Nur in der Gruppe)',
        step3Date: 'MAI 2027',
        step3Label: 'Offizieller Globaler Launch (blonde.ai)',
      },
      cta: 'AUF DIE PRIVATE WARTELISTE ↗',
    },
    colophon: {
      wordmark: 'blonde AI',
      slogan: 'STAND OUT IN THE CROWD.',
      statusLine:
        'BRAZIL GENESIS ACCESS · BETA v0.5: 09 APR 2027 · GLOBAL LAUNCH: MAY 2027 · TARGET URL: blonde.ai',
      whatsappCircleLabel: 'WHATSAPP GENESIS-ZIRKEL ↗',
      rights: '© 2026–2027 blonde AI — Alle Rechte vorbehalten. Zukünftige Domain: blonde.ai',
    },
  },

  fr: {
    meta: {
      title: 'blonde AI — Stand Out in the Crowd | Moteur Créatif Autonome (AaaS)',
      description:
        'Apportez votre vision créative et vos rushs bruts—blonde AI livre des campagnes studio terminées, prêtes à diffuser. Bêta v0.5 le 09 avril 2027.',
    },
    preloader: {
      line1: 'Bienvenue dans ce qui vous',
      line2Italic: 'distingue',
      line2After: 'de tous les autres.',
      ctaSound: 'ENTRER AVEC SON',
      skip: 'ENTRER SANS SON',
      log1: 'CALIBRAGE DE L’OPTIQUE',
      log2: 'SCULPTURE DU CHROME LIQUIDE',
      log3: 'VERROUILLAGE DU PROJECTEUR',
    },
    nav: {
      soundOn: 'SON: ON',
      soundOff: 'SON: OFF',
      cta: 'LISTE PRIVÉE ↗',
      menuOpenLabel: 'MENU',
      menuCloseLabel: 'FERMER',
      drawerTitle: 'JOURNAL VIVANT // NAVIGATION',
      languageLabel: 'ÉDITION ÉDITORIALE (6 LANGUES)',
      audioLabel: 'MOTEUR SONORE STUDIO (#6)',
      audioDesc: 'Synthèse acoustique tactile OP-1 × Leica M6',
      sections: {
        spotlight: '01 / LA LUMIÈRE',
        diagnosis: '02 / LE DIAGNOSTIC',
        vision: '03 / AaaS & LAME (#2)',
        engine: '04 / MOTEUR VECTORIEL (#4)',
        cast: '05 / LE CASTING',
        circle: '06 / CERCLE FONDATEUR',
      },
    },
    hero: {
      badge: 'ACCÈS GENÈSE BRÉSIL · STANDARD MONDIAL · BÊTA 0.5 : 09 AVR 2027',
      headline: {
        before: 'LA FOULE EST GRISE.',
        italicFlash: 'Prenez',
        after: 'LA LUMIÈRE.',
      },
      subheadline:
        'Pas un énième outil qui vous fait travailler. Apportez votre vision créative et vos rushs bruts—blonde AI livre des campagnes studio terminées, prêtes à diffuser.',
      cta: 'REJOINDRE LA LISTE PRIVÉE ↗',
      microcopy:
        'Accès direct au fondateur · Bêta v0.5 et places Founder envoyés en exclusivité dans le groupe le 09 avr. 2027.',
      reelLabel: 'PREUVE STUDIO // ANAMORPHIQUE 30° VOLT',
      scrollCue: 'LIRE LE JOURNAL ↓',
    },
    act2: {
      kicker: 'ÉDITION 001 // LE DIAGNOSTIC',
      headline: {
        before: 'SCROLLEZ DIX SECONDES.',
        italicFlash: 'Tout',
        after: 'SE RESSEMBLE.',
      },
      body: 'Avatars IA en plastique. Modèles CapCut recyclés. Textes fondus qui trahissent l’illusion en 0,4 seconde. Des millions de marques portant exactement le même uniforme gris. Personne ne s’arrête sur ce qui se fond. On s’arrête sur ce qui rayonne.',
      quote: '« Personne ne s’arrête sur ce qui se fond. On s’arrête sur ce qui rayonne. »',
      telemetry: {
        skipLatencyLabel: 'DÉTECTION IA GÉNÉRIQUE',
        skipLatencyValue: '0,4 SEC',
        greySaturationLabel: 'UNIFORMITÉ DES FLUX',
        greySaturationValue: '94,2%',
        modeLabel: 'MUTATION DE CATÉGORIE',
        modeValue: 'SaaS → AaaS',
      },
    },
    act3: {
      kicker: 'AaaS // AGENCE AUTONOME',
      headline: {
        before: 'GARDEZ LA',
        italicFlash: 'Vision.',
        after: 'NOUS LIVRONS L’ŒUVRE.',
      },
      manifesto:
        'Les outils vendent de la complexité. Les agences vendent de l’attente. blonde AI devient le moteur central des créateurs d’ads et media buyers—et libère les fondateurs. Plus besoin d’une agence lourde pour transformer une idée en film studio. Apportez la vision. Nous livrons l’exécution.',
      comparisonTable: {
        colDimension: 'DIMENSION',
        colGreyCrowd: 'LA FOULE GRISE (SaaS CLASSIQUE)',
        colBlonde: 'blonde AI (MOTEUR AaaS AUTONOME)',
        row1Label: 'Livrable',
        row1Grey: 'Outils dispersés exigeant des heures sur CapCut et Canva.',
        row1Blonde: 'Œuvre complète prête à diffuser : vision créative + actifs réels → film studio.',
        row2Label: 'Rôle du Fondateur',
        row2Grey: 'Attendre une agence lente ou couper les silences à la main.',
        row2Blonde: 'Direction créative pure. L’exécution technique et esthétique est autonome.',
        row3Label: 'Qualité Visuelle',
        row3Grey: 'Avatars plastiques et textes fondus ignorés en 0,4s.',
        row3Blonde: 'IA Créative + FFmpeg Déterministe : produits réels intacts et typographie vectorielle.',
      },
      i2: {
        sectionKicker: 'INTERACTION #2 // LAME OPTIQUE AVANT → APRÈS',
        tabCreator: '01 / CRÉATEUR & FONDATEUR',
        tabProduct: '02 / PRODUIT RÉEL',
        beforeBadge: 'RUSH BRUT · [00:08 SILENCE]',
        afterBadge: 'MASTER STUDIO · SUR LE BEAT',
        beforeProductBadge: 'PHOTO MOBILE BRUTE · [LUMIÈRE PLATE]',
        afterProductBadge: 'FILM STUDIO · [PRODUIT VERROUILLÉ]',
        dragHint: 'GLISSER LA LAME',
        creatorOverlayTitle: '« CESSEZ DE VENDRE DES OUTILS. LIVREZ',
        creatorOverlayTag: 'L’ŒUVRE. »',
        productOverlayTitle: 'CHRONOGRAPHE OBSIDIAN //',
        productOverlayTag: 'ÉDITION TRAVERTIN',
      },
    },
    act4: {
      kicker: 'ACTE IV // SOUS L’OBJECTIF',
      headline: {
        before: 'DIRECTION CRÉATIVE',
        italicFlash: 'Et',
        after: 'PRÉCISION DÉTERMINISTE.',
      },
      engine1Code: 'MOTEUR 01 // STUDIO EDIT',
      engine1Title: 'Moteur Studio Edit',
      engine1Body:
        'Coupe les blancs, cale le rythme sur le beat, incruste une typo chirurgicale.',
      engine2Code: 'MOTEUR 02 // MOTEUR AD AUTONOME',
      engine2Title: 'Moteur Ad Autonome',
      engine2Body:
        'Dirige la caméra autour de votre vrai produit—sans jamais déformer marque ou prix.',
      i4: {
        sectionKicker: 'INTERACTION #4 // LOUPE D’INTÉGRITÉ PIXEL',
        labelLeft: 'IA GÉNÉRIQUE // TEXTE FONDU',
        labelRight: 'blonde AI // MOTEUR VECTORIEL',
        lensHint: 'DÉPLACER LA LOUPE D’INSPECTION',
        toggleGeneric: 'INSPECTER : IA GÉNÉRIQUE',
        toggleBlonde: 'INSPECTER : MOTEUR blonde AI',
        slopStatus: 'ARTEFACT DÉTECTÉ : TEXTE ILLISIBLE & TEXTURE PLASTIQUE',
        cleanStatus: '00:04:12 · COUCHE VECTORIELLE FFMPEG + LIBASS VERROUILLÉE',
        vectorOverlayTitle: '$240',
        vectorOverlaySub: 'ÉDITION LIMITÉE // VOLT SPEC',
        vectorOverlaySpec: '100% GÉOMÉTRIE PRODUIT RÉEL · ZÉRO HALLUCINATION',
      },
    },
    act5: {
      kicker: 'ACTE V // LE CASTING',
      headline: {
        before: 'CONÇU POUR CEUX QUI',
        italicFlash: 'Captivent',
        after: 'L’ATTENTION.',
      },
      col1Kicker: '01 // CŒUR DE CIBLE : CRÉATEURS, FONDATEURS & INFOPRODUCTEURS',
      col1Title: 'Créateurs, Fondateurs & Infoproducteurs',
      col1Body:
        'Vous portez le message, le visage, l’offre. Cessez de perdre vos nuits sur des timelines ou d’attendre des retours. Parlez face caméra et imposez une stature de studio chaque jour.',
      col1Tags: ['CRÉATEURS FACE CAMÉRA', 'FONDATEURS & DIRIGEANTS', 'INFOPRODUCTEURS'],
      col2Kicker: '02 // VERTICALES COUPLÉES : MARQUES RÉELLES & MEDIA BUYERS',
      col2Title: 'Marques Physiques, E-Commerce D2C & Media Buyers',
      col2Body:
        'Marques physiques, e-commerces D2C et media buyers se branchent sur le même moteur—pour scaler des publicités produit à vitesse autonome.',
      col2Tags: ['MARQUES PHYSIQUES', 'E-COMMERCE D2C', 'MEDIA BUYERS PERFORMANCE'],
    },
    act6: {
      kicker: 'LISTE GENÈSE // BRÉSIL D’ABORD · STANDARD MONDIAL',
      headline: {
        before: 'PAS UNE BÊTA OUVERTE.',
        italicFlash: 'Le',
        after: 'CERCLE FONDATEUR.',
      },
      subtitle:
        'Ouverture initiale à huis clos au Brésil—conçu au standard mondial dès le premier jour. Aucun tarif public encore. Uniquement le cercle.',
      pillars: [
        {
          num: '01',
          title: 'Accès Direct Fondateur',
          desc: 'Canal direct dans le groupe privé WhatsApp avec le fondateur pendant la construction du moteur.',
        },
        {
          num: '02',
          title: 'Co-Créez Mises à Jour & Idées',
          desc: 'Partagez vos retours, idées et insights pour façonner directement les prochaines versions.',
        },
        {
          num: '03',
          title: 'Networking Haut Niveau',
          desc: 'Échangez avec des créateurs, fondateurs et opérateurs sélectionnés.',
        },
        {
          num: '04',
          title: 'Lien Secret Places Founder',
          desc: 'Le lien privé de prévente Founder sera partagé uniquement dans le groupe 1 mois avant le lancement de mai.',
        },
      ],
      datesNote:
        'BÊTA v0.5 LE 09 AVRIL 2027 — Le lien exclusif Founder est partagé uniquement sur WhatsApp 1 mois avant le lancement officiel de mai 2027.',
      timeline: {
        step1Date: 'MAINTENANT',
        step1Label: 'Liste Privée WhatsApp (Brésil d’abord · Ouvert aux Voix Fondatrices)',
        step2Date: '09 AVR 2027',
        step2Label: 'Bêta Fermée v0.5 + Lien Exclusif Prévente Founder (Dans le Groupe)',
        step3Date: 'MAI 2027',
        step3Label: 'Lancement Public Mondial (blonde.ai)',
      },
      cta: 'REJOINDRE LA LISTE PRIVÉE ↗',
    },
    colophon: {
      wordmark: 'blonde AI',
      slogan: 'STAND OUT IN THE CROWD.',
      statusLine:
        'BRAZIL GENESIS ACCESS · BETA v0.5: 09 APR 2027 · GLOBAL LAUNCH: MAY 2027 · TARGET URL: blonde.ai',
      whatsappCircleLabel: 'CERCLE GENÈSE WHATSAPP ↗',
      rights: '© 2026–2027 blonde AI — Tous droits réservés. Domaine futur cible : blonde.ai',
    },
  },

  es: {
    meta: {
      title: 'blonde AI — Stand Out in the Crowd | Motor Creativo Autónomo (AaaS)',
      description:
        'Trae tu visión creativa y tomas o fotos reales—blonde AI entrega campañas de estudio terminadas, listas para lanzar. Beta v0.5 abre el 09 de abril de 2027.',
    },
    preloader: {
      line1: 'Bienvenido a lo que te separa',
      line2Italic: 'de todos',
      line2After: 'los demás.',
      ctaSound: 'ENTRAR CON SONIDO',
      skip: 'ENTRAR EN SILENCIO',
      log1: 'CALIBRANDO LENTE ÓPTICA',
      log2: 'MOLDEANDO CAMPO DE CROMO LÍQUIDO',
      log3: 'FIJANDO EL FOCO 30°',
    },
    nav: {
      soundOn: 'SONIDO: ON',
      soundOff: 'SONIDO: OFF',
      cta: 'LISTA PRIVADA ↗',
      menuOpenLabel: 'MENÚ',
      menuCloseLabel: 'CERRAR',
      drawerTitle: 'PERIÓDICO VIVO // NAVEGACIÓN',
      languageLabel: 'EDICIÓN EDITORIAL (6 IDIOMAS)',
      audioLabel: 'MOTOR DE SONIDO TÁCTIL (#6)',
      audioDesc: 'Síntesis acústica OP-1 × Leica M6 en tiempo real',
      sections: {
        spotlight: '01 / EL FOCO',
        diagnosis: '02 / EL DIAGNÓSTICO',
        vision: '03 / AaaS Y HOJA (#2)',
        engine: '04 / MOTOR VECTORIAL (#4)',
        cast: '05 / PARA QUIÉN',
        circle: '06 / SALA FUNDADORA',
      },
    },
    hero: {
      badge: 'ACCESO GÉNESIS BRASIL · ESTÁNDAR GLOBAL · BETA 0.5: 09 ABR 2027',
      headline: {
        before: 'LA MULTITUD ES GRIS.',
        italicFlash: 'Domina',
        after: 'EL FOCO.',
      },
      subheadline:
        'No es otro panel que te hace trabajar. Trae tu visión creativa y tomas o fotos reales—blonde AI entrega campañas de estudio terminadas, listas para lanzar.',
      cta: 'ENTRAR A LA LISTA PRIVADA ↗',
      microcopy:
        'Acceso directo al fundador · Beta v0.5 y cupos Founder liberados solo en el grupo el 09 abr, 2027.',
      reelLabel: 'PRUEBA DE ESTUDIO // LENTE ANAMÓRFICO 30° VOLT',
      scrollCue: 'LEER PERIÓDICO VIVO ↓',
    },
    act2: {
      kicker: 'EDICIÓN 001 // EL DIAGNÓSTICO',
      headline: {
        before: 'DESLIZA DIEZ SEGUNDOS.',
        italicFlash: 'Todo',
        after: 'PARECE IGUAL.',
      },
      body: 'Avatares plásticos de IA. Plantillas recicladas de CapCut. Textos derretidos que delatan el truco en 0,4 segundos. Millones de marcas vistiendo exactamente el mismo uniforme gris. Nadie frena por lo común. Todos frenan por lo que brilla.',
      quote: '“Nadie frena por lo común. Todos frenan por lo que brilla.”',
      telemetry: {
        skipLatencyLabel: 'DETECCIÓN DE IA GENÉRICA',
        skipLatencyValue: '0,4 SEG',
        greySaturationLabel: 'UNIFORMIDAD EN EL FEED',
        greySaturationValue: '94,2%',
        modeLabel: 'CAMBIO DE CATEGORÍA',
        modeValue: 'SaaS → AaaS',
      },
    },
    act3: {
      kicker: 'AaaS // AGENCIA AUTÓNOMA',
      headline: {
        before: 'GUARDA LA',
        italicFlash: 'Visión.',
        after: 'NOSOTROS LA OBRA.',
      },
      manifesto:
        'Las herramientas venden complejidad. Las agencias venden espera. blonde AI nace como el motor central de creadores de anuncios y media buyers—y libera al fundador. No deberías depender de una agencia para llevar una idea a nivel estudio. Trae la visión creativa. Entregamos todo listo.',
      comparisonTable: {
        colDimension: 'DIMENSIÓN',
        colGreyCrowd: 'MULTITUD GRIS (SaaS COMÚN)',
        colBlonde: 'blonde AI (MOTOR AaaS AUTÓNOMO)',
        row1Label: 'Entregable',
        row1Grey: 'Herramientas sueltas que exigen horas en CapCut y editores.',
        row1Blonde: 'Obra terminada lista para rodar: visión creativa + activos reales → comercial de estudio.',
        row2Label: 'Rol del Fundador',
        row2Grey: 'Perseguir agencias lentas o cortar silencios y subtítulos a mano.',
        row2Blonde: 'Pura visión creativa. La ejecución técnica y estética ocurre en el motor.',
        row3Label: 'Integridad Visual',
        row3Grey: 'Avatares plásticos y textos derretidos ignorados en 0,4s.',
        row3Blonde: 'IA Creativa + FFmpeg Determinista: productos reales intactos y tipografía vectorial.',
      },
      i2: {
        sectionKicker: 'INTERACCIÓN #2 // HOJA ÓPTICA ANTES → DESPUÉS',
        tabCreator: '01 / CREATOR & FOUNDER',
        tabProduct: '02 / PRODUCTO REAL',
        beforeBadge: 'TOMA CRUDA · [00:08 SILENCIO]',
        afterBadge: 'MASTER ESTUDIO · EN EL BEAT',
        beforeProductBadge: 'FOTO DE MÓVIL CRUDA · [LUZ PLANA]',
        afterProductBadge: 'ANUNCIO ESTUDIO · [PRODUCTO FIJADO]',
        dragHint: 'ARRASTRA LA HOJA',
        creatorOverlayTitle: '“DEJA DE VENDER PANELES. ENTREGA',
        creatorOverlayTag: 'LA OBRA.”',
        productOverlayTitle: 'CRONÓGRAFO OBSIDIAN //',
        productOverlayTag: 'EDICIÓN TRAVERTINO',
      },
    },
    act4: {
      kicker: 'ACTO IV // BAJO LA LENTE',
      headline: {
        before: 'DIRECCIÓN CREATIVA',
        italicFlash: 'Y',
        after: 'PRECISIÓN DETERMINISTA.',
      },
      engine1Code: 'MOTOR 01 // STUDIO EDIT',
      engine1Title: 'Motor Studio Edit',
      engine1Body:
        'Elimina silencios, clava cortes al beat e incrusta tipografía editorial nítida.',
      engine2Code: 'MOTOR 02 // MOTOR AD AUTÓNOMO',
      engine2Title: 'Motor Ad Autónomo',
      engine2Body:
        'Dirige cámara de cine sobre tu producto real—sin derretir jamás tu marca o precio.',
      i4: {
        sectionKicker: 'INTERACCIÓN #4 // LUPA DE INTEGRIDAD DE PÍXELES',
        labelLeft: 'IA GENÉRICA // TEXTO DERRETIDO',
        labelRight: 'blonde AI // MOTOR VECTORIAL',
        lensHint: 'MUEVE LA LUPA PARA INSPECCIONAR',
        toggleGeneric: 'INSPECCIONAR: IA GENÉRICA',
        toggleBlonde: 'INSPECCIONAR: MOTOR blonde AI',
        slopStatus: 'ARTEFACTO DETECTADO: TEXTO ILEGIBLE Y TEXTURA PLÁSTICA',
        cleanStatus: '00:04:12 · CAPA VECTORIAL FFMPEG + LIBASS BLOQUEADA',
        vectorOverlayTitle: '$240',
        vectorOverlaySub: 'EDICIÓN LIMITADA // VOLT SPEC',
        vectorOverlaySpec: '100% GEOMETRÍA REAL DEL PRODUCTO · CERO ALUCINACIÓN',
      },
    },
    act5: {
      kicker: 'ACTO V // EL ELENCO',
      headline: {
        before: 'HECHO PARA QUIENES',
        italicFlash: 'Dominan',
        after: 'LA ATENCIÓN.',
      },
      col1Kicker: '01 // FOCO CENTRAL: CREATORS, FOUNDERS E INFOPRODUCTORES',
      col1Title: 'Creators, Founders e Infoproductores',
      col1Body:
        'Tú llevas el mensaje, el rostro y la oferta. Deja de quemar noches editando o esperando revisiones externas. Habla a la cámara y proyecta autoridad de estudio cada día.',
      col1Tags: ['CREATORS FRENTE A CÁMARA', 'FOUNDERS Y EMPRESARIOS', 'INFOPRODUCTORES'],
      col2Kicker: '02 // VERTICALES ACOPLADAS: MARCAS REALES Y MEDIA BUYERS',
      col2Title: 'Marcas Físicas, E-Commerce D2C y Media Buyers',
      col2Body:
        'Marcas físicas, e-commerce D2C y media buyers se acoplan al mismo motor—escalando anuncios de producto real a velocidad autónoma.',
      col2Tags: ['MARCAS DE PRODUCTO FÍSICO', 'E-COMMERCE D2C', 'MEDIA BUYERS DE PERFORMANCE'],
    },
    act6: {
      kicker: 'LISTA GÉNESIS // BRASIL PRIMERO · ESTÁNDAR GLOBAL',
      headline: {
        before: 'NO ES UNA BETA ABIERTA. ES LA',
        italicFlash: 'Sala',
        after: 'FUNDADORA.',
      },
      subtitle:
        'Abrimos primero a puerta cerrada en Brasil—diseñado bajo estándar global desde el día uno. Sin planes públicos aún. Solo el círculo.',
      pillars: [
        {
          num: '01',
          title: 'Acceso Directo al Fundador',
          desc: 'Canal abierto en el grupo privado de WhatsApp directo con quien construye el motor.',
        },
        {
          num: '02',
          title: 'Co-Crea Mejoras e Ideas',
          desc: 'Comparte feedback, ideas e insights que moldean directamente las próximas actualizaciones.',
        },
        {
          num: '03',
          title: 'Networking de Alto Nivel',
          desc: 'Conecta con otros creators, founders e infoproductores seleccionados.',
        },
        {
          num: '04',
          title: 'Enlace Secreto Cupos Founder',
          desc: 'El enlace exclusivo de preventa Founder se enviará solo en el grupo 1 mes antes del lanzamiento de mayo.',
        },
      ],
      datesNote:
        'BETA v0.5 ABRE EL 09 DE ABRIL DE 2027 — El enlace de preventa Founder se enviará solo por WhatsApp 1 mes antes del lanzamiento oficial en mayo de 2027.',
      timeline: {
        step1Date: 'AHORA',
        step1Label: 'Lista Privada en WhatsApp (Brasil Primero · Abierto a Voces Fundadoras)',
        step2Date: '09 ABR 2027',
        step2Label: 'Beta Cerrada v0.5 + Enlace Exclusivo Preventa Founder (Solo en el Grupo)',
        step3Date: 'MAYO 2027',
        step3Label: 'Lanzamiento Público Global (blonde.ai)',
      },
      cta: 'ENTRAR A LA LISTA PRIVADA ↗',
    },
    colophon: {
      wordmark: 'blonde AI',
      slogan: 'STAND OUT IN THE CROWD.',
      statusLine:
        'BRAZIL GENESIS ACCESS · BETA v0.5: 09 APR 2027 · GLOBAL LAUNCH: MAY 2027 · TARGET URL: blonde.ai',
      whatsappCircleLabel: 'CÍRCULO GÉNESIS WHATSAPP ↗',
      rights: '© 2026–2027 blonde AI — Todos los derechos reservados. Dominio futuro: blonde.ai',
    },
  },

  it: {
    meta: {
      title: 'blonde AI — Stand Out in the Crowd | Motore Creativo Autonomo (AaaS)',
      description:
        'Porta la tua visione creativa e clip o foto reali—blonde AI consegna campagne da studio finite, pronte a girare. Beta v0.5 apre il 09 aprile 2027.',
    },
    preloader: {
      line1: 'Benvenuto in ciò che ti distingue',
      line2Italic: 'da tutti',
      line2After: 'gli altri.',
      ctaSound: 'ENTRA CON AUDIO',
      skip: 'ENTRA IN SILENZIO',
      log1: 'CALIBRAZIONE LENTE OTTICA',
      log2: 'MODELLAZIONE CAMPO CROMO LIQUIDO',
      log3: 'BLOCCO RIFLETTORE 30°',
    },
    nav: {
      soundOn: 'AUDIO: ON',
      soundOff: 'AUDIO: OFF',
      cta: 'LISTA PRIVATA ↗',
      menuOpenLabel: 'MENU',
      menuCloseLabel: 'CHIUDI',
      drawerTitle: 'GIORNALE VIVO // NAVIGAZIONE',
      languageLabel: 'EDIZIONE EDITORIALE (6 LINGUE)',
      audioLabel: 'MOTORE AUDIO STUDIO (#6)',
      audioDesc: 'Sintesi acustica tattile OP-1 × Leica M6',
      sections: {
        spotlight: '01 / LA SCENA',
        diagnosis: '02 / LA DIAGNOSI',
        vision: '03 / AaaS E LAMA (#2)',
        engine: '04 / MOTORE VETTORIALE (#4)',
        cast: '05 / PER CHI',
        circle: '06 / SALA FONDATRICE',
      },
    },
    hero: {
      badge: 'ACCESSO GENESI BRASILE · STANDARD GLOBALE · BETA 0.5: 09 APR 2027',
      headline: {
        before: 'LA FOLLA È GRIGIA.',
        italicFlash: 'Prendi',
        after: 'LA SCENA.',
      },
      subheadline:
        'Non è l’ennesimo software che ti fa lavorare. Porta la tua visione creativa e clip o foto reali—blonde AI consegna campagne da studio finite, pronte a girare.',
      cta: 'ENTRA NELLA LISTA PRIVATA ↗',
      microcopy:
        'Accesso diretto al fondatore · Beta v0.5 e posti Founder sbloccati solo nel gruppo il 09 apr 2027.',
      reelLabel: 'PROVA STUDIO // LENTE ANAMORFICA 30° VOLT',
      scrollCue: 'LEGGI IL GIORNALE ↓',
    },
    act2: {
      kicker: 'EDIZIONE 001 // LA DIAGNOSI',
      headline: {
        before: 'SCORRI DIECI SECONDI.',
        italicFlash: 'Tutto',
        after: 'SEMBRA UGUALE.',
      },
      body: 'Avatar IA di plastica. Template CapCut riciclati. Testi sciolti che tradiscono l’illusione in 0,4 secondi. Milioni di brand con la stessa identica uniforme grigia. Nessuno si ferma per chi si confonde. Ci si ferma per chi splende.',
      quote: '“Nessuno si ferma per chi si confonde. Ci si ferma per chi splende.”',
      telemetry: {
        skipLatencyLabel: 'RILEVAMENTO IA GENERICA',
        skipLatencyValue: '0,4 SEC',
        greySaturationLabel: 'UNIFORMITÀ DEI CLONI',
        greySaturationValue: '94,2%',
        modeLabel: 'CAMBIO DI CATEGORIA',
        modeValue: 'SaaS → AaaS',
      },
    },
    act3: {
      kicker: 'AaaS // AGENZIA AUTONOMA',
      headline: {
        before: 'TIENI LA',
        italicFlash: 'Visione.',
        after: 'NOI CONSEGNIAMO L’OPERA.',
      },
      manifesto:
        'I software vendono complessità. Le agenzie vendono attese. blonde AI diventa il motore centrale per creator e media buyer—e libera gli imprenditori. Non serve più una vecchia agenzia per portare un’idea a livello studio. Porta la visione creativa. Al risultato pensiamo noi.',
      comparisonTable: {
        colDimension: 'DIMENSIONE',
        colGreyCrowd: 'FOLLA GRIGIA (SaaS CLASSICO)',
        colBlonde: 'blonde AI (MOTORE AaaS AUTONOMO)',
        row1Label: 'Risultato',
        row1Grey: 'Strumenti sparsi che richiedono ore su CapCut e timeline.',
        row1Blonde: 'Opera finita pronta al lancio: visione creativa + asset reali → spot da studio.',
        row2Label: 'Ruolo del Founder',
        row2Grey: 'Inseguire agenzie lente o tagliare silenzi e sottotitoli a mano.',
        row2Blonde: 'Pura visione creativa. L’esecuzione tecnica ed estetica avviene nel motore.',
        row3Label: 'Integrità Visiva',
        row3Grey: 'Avatar di plastica e testi sciolti ignorati in 0,4s.',
        row3Blonde: 'IA Creativa + FFmpeg Deterministico: prodotti reali intatti e tipografia vettoriale.',
      },
      i2: {
        sectionKicker: 'INTERAZIONE #2 // LAMA OTTICA PRIMA → DOPO',
        tabCreator: '01 / CREATOR & FOUNDER',
        tabProduct: '02 / PRODOTTO REALE',
        beforeBadge: 'CLIP GREZZO · [00:08 SILENZIO]',
        afterBadge: 'MASTER STUDIO · A TEMPO',
        beforeProductBadge: 'FOTO TELEFONO GREZZA · [LUCE PIATTA]',
        afterProductBadge: 'SPOT STUDIO · [PRODOTTO BLOCCATO]',
        dragHint: 'TRASCINA LA LAMA',
        creatorOverlayTitle: '“SMETTI DI VENDERE TOOL. CONSEGNA',
        creatorOverlayTag: 'L’OPERA.”',
        productOverlayTitle: 'CRONOGRAFO OBSIDIAN //',
        productOverlayTag: 'EDIZIONE TRAVERTINO',
      },
    },
    act4: {
      kicker: 'ATTO IV // SOTTO LA LENTE',
      headline: {
        before: 'REGIA CREATIVA',
        italicFlash: 'Incontra',
        after: 'PRECISIONE DETERMINISTICA.',
      },
      engine1Code: 'MOTORE 01 // STUDIO EDIT',
      engine1Title: 'Motore Studio Edit',
      engine1Body:
        'Taglia i silenzi, aggancia i tagli al beat e fonde tipografia editoriale nitida.',
      engine2Code: 'MOTORE 02 // MOTORE AD AUTONOMO',
      engine2Title: 'Motore Ad Autonomo',
      engine2Body:
        'Dirige la camera sul tuo prodotto reale—senza mai deformare brand, etichetta o prezzo.',
      i4: {
        sectionKicker: 'INTERAZIONE #4 // LENTE D’INTEGRITÀ PIXEL',
        labelLeft: 'IA GENERICA // TESTO SCIOLTO',
        labelRight: 'blonde AI // MOTORE VETTORIALE',
        lensHint: 'MUOVI LA LENTE PER ISPEZIONARE',
        toggleGeneric: 'ISPEZIONA: IA GENERICA',
        toggleBlonde: 'ISPEZIONA: MOTORE blonde AI',
        slopStatus: 'ARTEFATTO RILEVATO: GLIFI SCIOLTI E TEXTURE PLASTICA',
        cleanStatus: '00:04:12 · LIVELLO VETTORIALE FFMPEG + LIBASS BLOCCATO',
        vectorOverlayTitle: '$240',
        vectorOverlaySub: 'EDIZIONE LIMITATA // VOLT SPEC',
        vectorOverlaySpec: '100% GEOMETRIA PRODOTTO REALE · ZERO ALLUCINAZIONI',
      },
    },
    act5: {
      kicker: 'ATTO V // IL CAST',
      headline: {
        before: 'CREATO PER CHI',
        italicFlash: 'Comanda',
        after: 'L’ATTENZIONE.',
      },
      col1Kicker: '01 // FOCUS CENTRALE: CREATOR, FOUNDER E INFOPRODUTTORI',
      col1Title: 'Creator, Founder e Infoproduttori',
      col1Body:
        'Tu porti il messaggio, il volto e l’offerta. Smetti di bruciare notti sulle timeline o attendere revisioni esterne. Parla in camera ed esci con autorità da studio ogni giorno.',
      col1Tags: ['CREATOR FRONTE CAMERA', 'FOUNDER E IMPRENDITORI', 'INFOPRODUTTORI'],
      col2Kicker: '02 // VERTICALI ACCOPPIATE: BRAND REALI E MEDIA BUYER',
      col2Title: 'Brand Fisici, E-Commerce D2C e Media Buyer',
      col2Body:
        'Brand fisici, e-commerce D2C e media buyer si innestano sullo stesso motore—scalando spot di prodotto reale a velocità autonoma.',
      col2Tags: ['BRAND DI PRODOTTO FISICO', 'E-COMMERCE D2C', 'PERFORMANCE MEDIA BUYER'],
    },
    act6: {
      kicker: 'LISTA GENESI // BRASILE PRIMA · STANDARD GLOBALE',
      headline: {
        before: 'NON È UNA BETA APERTA. È LA',
        italicFlash: 'Sala',
        after: 'FONDATRICE.',
      },
      subtitle:
        'Apriamo prima a porte chiuse in Brasile—progettato su standard globale dal giorno uno. Nessun piano pubblico ancora. Solo il cerchio.',
      pillars: [
        {
          num: '01',
          title: 'Accesso Diretto al Fondatore',
          desc: 'Canale aperto nel gruppo privato WhatsApp direttamente con chi costruisce il motore.',
        },
        {
          num: '02',
          title: 'Co-Crea Update e Idee',
          desc: 'Invia feedback, idee e insight pratici che plasmano direttamente i prossimi aggiornamenti.',
        },
        {
          num: '03',
          title: 'Networking d’Alto Livello',
          desc: 'Confronto diretto con altri creator, founder e operatori selezionati.',
        },
        {
          num: '04',
          title: 'Link Segreto Posti Founder',
          desc: 'Il link esclusivo della prevendita Founder sarà inviato solo nel gruppo 1 mese prima del lancio di maggio.',
        },
      ],
      datesNote:
        'BETA v0.5 APRE IL 09 APRILE 2027 — Il link esclusivo Founder sarà inviato solo su WhatsApp 1 mese prima del lancio ufficiale di maggio 2027.',
      timeline: {
        step1Date: 'ORA',
        step1Label: 'Lista Privata WhatsApp (Brasile Prima · Aperto alle Voci Fondatrici)',
        step2Date: '09 APR 2027',
        step2Label: 'Closed Beta v0.5 + Link Esclusivo Prevendita Founder (Solo nel Gruppo)',
        step3Date: 'MAGGIO 2027',
        step3Label: 'Lancio Pubblico Globale (blonde.ai)',
      },
      cta: 'ENTRA NELLA LISTA PRIVATA ↗',
    },
    colophon: {
      wordmark: 'blonde AI',
      slogan: 'STAND OUT IN THE CROWD.',
      statusLine:
        'BRAZIL GENESIS ACCESS · BETA v0.5: 09 APR 2027 · GLOBAL LAUNCH: MAY 2027 · TARGET URL: blonde.ai',
      whatsappCircleLabel: 'CERCHIO GENESI WHATSAPP ↗',
      rights: '© 2026–2027 blonde AI — Tutti i diritti riservati. Dominio futuro: blonde.ai',
    },
  },
};

const STORAGE_LOCALE_KEY = 'blonde_locale';

interface LocaleContextValue {
  locale: LocaleCode;
  localeMeta: LocaleMeta;
  t: LocaleDictionary;
  isTransitioning: boolean;
  setLocale: (next: LocaleCode) => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<LocaleCode>('en');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const applyDocumentAttributes = useCallback((code: LocaleCode) => {
    if (typeof document === 'undefined') return;
    const meta =
      SUPPORTED_LOCALES.find((item) => item.code === code) ||
      SUPPORTED_LOCALES[0];
    document.documentElement.lang = meta.hreflang;
    document.documentElement.setAttribute('data-lang', code);
    document.documentElement.style.setProperty(
      '--display-parity-scale',
      String(meta.displayScaleMultiplier)
    );
    document.documentElement.style.setProperty(
      '--display-parity-tracking',
      meta.trackingDisplay
    );
    document.title = DICTIONARY[code].meta.title;
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const queryLang = params.get('lang')?.toLowerCase() as
      | LocaleCode
      | undefined;

    let initial: LocaleCode = 'en';
    if (
      queryLang &&
      SUPPORTED_LOCALES.some((item) => item.code === queryLang)
    ) {
      initial = queryLang;
    } else {
      try {
        const stored = window.localStorage.getItem(
          STORAGE_LOCALE_KEY
        ) as LocaleCode | null;
        if (stored && SUPPORTED_LOCALES.some((item) => item.code === stored)) {
          initial = stored;
        }
      } catch {}
    }

    setLocaleState(initial);
    applyDocumentAttributes(initial);
  }, [applyDocumentAttributes]);

  const setLocale = useCallback(
    (next: LocaleCode) => {
      if (next === locale) return;
      setIsTransitioning(true);
      window.setTimeout(() => {
        setLocaleState(next);
        applyDocumentAttributes(next);
        try {
          window.localStorage.setItem(STORAGE_LOCALE_KEY, next);
          const url = new URL(window.location.href);
          if (next === 'en') {
            url.searchParams.delete('lang');
          } else {
            url.searchParams.set('lang', next);
          }
          window.history.replaceState({}, '', url.toString());
        } catch {}
        window.setTimeout(() => {
          setIsTransitioning(false);
        }, 90);
      }, 65);
    },
    [locale, applyDocumentAttributes]
  );

  const localeMeta =
    SUPPORTED_LOCALES.find((item) => item.code === locale) ||
    SUPPORTED_LOCALES[0];

  return React.createElement(
    LocaleContext.Provider,
    {
      value: {
        locale,
        localeMeta,
        t: DICTIONARY[locale],
        isTransitioning,
        setLocale,
      },
    },
    children
  );
}

export function useLocale(): LocaleContextValue {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}
