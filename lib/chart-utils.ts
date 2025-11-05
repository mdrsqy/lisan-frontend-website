// Fungsi untuk mendapatkan nilai HSL dari variable CSS Shadcn
export function getCssVar(name: string): string {
  if (typeof window !== 'undefined') {
    // Ambil nilai HSL string (misal: "222.2 47.4% 11.2%")
    return `hsl(${getComputedStyle(document.documentElement).getPropertyValue(`--${name}`).trim()})`;
  }
  // Fallback untuk server-side rendering (SSR)
  return 'hsl(222.2 47.4% 11.2%)'; // Fallback ke nilai Dark Mode Default Shadcn
}