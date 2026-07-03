/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        "admin-bg": "var(--admin-bg)",
        "admin-surface": "var(--admin-surface)",
        "admin-surface-muted": "var(--admin-surface-muted)",
        "admin-border": "var(--admin-border)",
        "admin-text": "var(--admin-text)",
        "admin-muted": "var(--admin-muted)",
        "admin-accent": "var(--admin-accent)",
        "admin-accent-contrast": "var(--admin-accent-contrast)",
        "admin-hover": "var(--admin-hover)",
        "admin-warning": "var(--admin-warning)",
        "admin-success": "var(--admin-success)"
      }
    },
  },
  plugins: [],
}

