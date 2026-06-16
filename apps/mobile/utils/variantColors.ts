const COLOR_MAP: Record<string, string> = {
  білий: '#FFFFFF',
  белый: '#FFFFFF',
  white: '#FFFFFF',
  чорний: '#1F2937',
  черный: '#1F2937',
  black: '#1F2937',
  червоний: '#EF4444',
  красный: '#EF4444',
  red: '#EF4444',
  синій: '#3B82F6',
  синий: '#3B82F6',
  blue: '#3B82F6',
  сірий: '#9CA3AF',
  серый: '#9CA3AF',
  gray: '#9CA3AF',
  grey: '#9CA3AF',
  зелений: '#22C55E',
  зеленый: '#22C55E',
  green: '#22C55E',
  жовтий: '#EAB308',
  желтый: '#EAB308',
  yellow: '#EAB308',
  рожевий: '#F472B6',
  розовый: '#F472B6',
  pink: '#F472B6',
  фіолетовий: '#A855F7',
  фиолетовый: '#A855F7',
  purple: '#A855F7',
  золотий: '#D4AF37',
  gold: '#D4AF37',
  срібний: '#C0C0C0',
  silver: '#C0C0C0',
};

export function getVariantColor(label: string): string {
  const key = label.trim().toLowerCase();
  return COLOR_MAP[key] ?? '#9CA3AF';
}
