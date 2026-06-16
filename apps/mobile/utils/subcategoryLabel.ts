const SLUG_LABELS: Record<string, string> = {
  'category-zashtitnie-stekla': 'Захисні скла',
  'category-plenki-dlya-plottera': 'Плівки для плоттера',
  'category-aksessuari-dlya-plotterov': 'Аксесуари для плоттерів',
  'category-plotteri': 'Плоттери',
  'category-kabeli-aux-i-hdmi': 'Кабелі AUX і HDMI',
  'category-akkumulyatori-dlya-telefonov': 'Акумулятори для телефонів',
  'category-setevie-zaryadnie-ustroystva': 'Мережеві зарядні пристрої',
  'category-portativnie-batarei': 'Портативні батареї',
  'category-avtomobilynie-derzhateli': 'Автомобільні тримачі',
  'category-chehli-dlya-planshetov-i-noutbukov': 'Чохли для планшетів і ноутбуків',
  'category-aksessuari-dlya-umnih-chasov-i-fitnes-trekerov':
    'Аксесуари для годинників і фітнес-трекерів',
  'category-kolytsevie-lampi': 'Кільцеві лампи',
  'category-monopodi': 'Моноподи',
  'category-drugie-gadzheti': 'Інші гаджети',
  'category-usb-nakopiteli': 'USB-накопичувачі',
  'category-klaviaturi': 'Клавіатури',
  'category-naushniki-dlya-telefona': 'Навушники для телефона',
  paverbanky: 'Powerbank',
  'merezhevi-zaryadni-prystroyi': 'Мережеві зарядні пристрої',
  trymachi: 'Тримачі',
  myshky: 'Миші',
};

const WORD_LABELS: Record<string, string> = {
  apple: 'Apple',
  samsung: 'Samsung',
  xiaomi: 'Xiaomi',
  lightning: 'Lightning',
  'type-c': 'Type-C',
  'type-c-to-type-c': 'Type-C to Type-C',
  'type-c-to-lightning': 'Type-C to Lightning',
};

export function formatSubcategoryLabel(slug: string): string {
  if (SLUG_LABELS[slug]) {
    return SLUG_LABELS[slug];
  }

  if (WORD_LABELS[slug]) {
    return WORD_LABELS[slug];
  }

  const normalized = slug.replace(/^category-/, '');

  return normalized
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
