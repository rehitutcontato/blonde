import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        obsidian: '#090B0A',
        carbon: '#121614',
        panelDeep: '#181E1B',
        mutedStone: '#9CA39E',
        editorialBeige: '#EAE2D3',
        softSand: '#F5EFE4',
        royalEmerald: '#0B4635',
        royalPineDark: '#072E23',
        royalBorder: '#13634C',
        blondeVolt: '#CCFF29',
        voltElectric: '#D4FF33',
      },
      fontFamily: {
        display: ['var(--font-barlow-condensed)', 'Arial Narrow', 'sans-serif'],
        serifItalic: ['var(--font-instrument-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-plus-jakarta)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'ui-monospace', 'monospace'],
      },
      transitionTimingFunction: {
        shutter: 'cubic-bezier(0.16, 1, 0.3, 1)',
        liquid: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
