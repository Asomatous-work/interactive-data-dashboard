// Color palette for data visualization
export const colors = {
  primary: "hsl(var(--primary))",
  secondary: "hsl(var(--secondary))",
  accent: "hsl(var(--accent))",
  background: "hsl(var(--background))",
  foreground: "hsl(var(--foreground))",
  muted: "hsl(var(--muted))",
  border: "hsl(var(--border))",

  // Dashboard specific colors
  blue: "hsl(var(--dashboard-blue))",
  green: "hsl(var(--dashboard-green))",
  purple: "hsl(var(--dashboard-purple))",
  orange: "hsl(var(--dashboard-orange))",
  red: "hsl(var(--dashboard-red))",
  teal: "hsl(var(--dashboard-teal))",
  yellow: "hsl(var(--dashboard-yellow))",
  pink: "hsl(var(--dashboard-pink))",
}

// Get a color based on value (for heat maps or conditional coloring)
export function getColorByValue(value: number, min: number, max: number): string {
  // Normalize the value between 0 and 1
  const normalized = Math.max(0, Math.min(1, (value - min) / (max - min)))

  // Choose color based on the normalized value
  if (normalized < 0.25) return colors.red
  if (normalized < 0.5) return colors.orange
  if (normalized < 0.75) return colors.yellow
  return colors.green
}

// Get a color from the palette by index (for consistent category colors)
export function getCategoryColor(index: number): string {
  const palette = [
    colors.blue,
    colors.green,
    colors.purple,
    colors.orange,
    colors.teal,
    colors.pink,
    colors.yellow,
    colors.red,
  ]
  return palette[index % palette.length]
}

// Generate an array of colors for a dataset
export function getDatasetColors(count: number): string[] {
  return Array.from({ length: count }, (_, i) => getCategoryColor(i))
}
