/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}', './app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
    },
    extend: {
      /* ================= FONTS ================= */
      fontFamily: {
        head: ['var(--font-head)'],
        body: ['var(--font-body)'],
      },

      /* ================= TYPOGRAPHY ================= */
      fontSize: {
        h1: 'var(--h1)',
        h2: 'var(--h2)',
        h3: 'var(--h3)',
        h4: 'var(--h4)',
      },

      /* ================= COLORS ================= */
      colors: {
        primary: 'var(--c-primary)',
        secondary: 'var(--c-secondary)',
        cuaternary: 'var(--c-quaternary)',
        text: 'var(--c-text)',
        muted: 'var(--c-text-muted)',
        line: 'var(--c-line)',
        bg: 'var(--c-bg)',
        panel: 'var(--c-panel)',
        success: 'var(--c-success)',
        warning: 'var(--c-warning)',
        error: 'var(--c-error)',
        white: 'var(--c-white)',
        black: 'var(--c-black)',
      },

      /* ================= RADIUS ================= */
      borderRadius: {
        base: 'var(--radius)',
      },

      /* ================= SHADOWS ================= */
      boxShadow: {
        base: 'var(--shadow)',
        xl: 'var(--shadowXL)',
        inset: 'var(--shadowInset)',
        lg: 'var(--shadowL)',
      },

      /* ================= BACKGROUNDS ================= */
      backgroundImage: {
        'g-primary': 'var(--g-primary)',
        'g-primary-light': 'var(--g-primary-light)',
        'g-primary-dark': 'var(--g-primary-dark)',
        'g-cta': 'var(--g-cta)',
        'g-hero': 'var(--g-hero)',
      },
    },
  },
  plugins: [],
}
