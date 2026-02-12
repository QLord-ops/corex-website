// Sales Consultant flow: DE / EN

export const consultationCopy = {
  de: {
    title: 'Projekt-Check',
    subtitle: 'In wenigen Schritten zum passenden Angebot.',
    chooseLanguage: 'Sprache wählen',
    next: 'Weiter',
    back: 'Zurück',
    questions: [
      { id: 'industry', label: 'In welcher Branche bzw. welchem Geschäftsfeld sind Sie tätig?', placeholder: 'z.B. Handwerk, Beratung, Gastronomie, Gesundheitswesen, E-Commerce' },
      { id: 'location', label: 'Stadt / Land?', placeholder: 'z.B. Berlin, Deutschland' },
      { id: 'goal', label: 'Hauptziel der Website?', options: ['Leads generieren', 'Buchungen / Reservierungen', 'Verkauf (E-Commerce)', 'Markenauftritt / Präsenz'] },
      { id: 'type', label: 'Welche Art von Website?', options: ['Landing (1 Seite)', 'Mehrseitig (5–8 Seiten)', 'E-Commerce / Shop', 'Buchungssystem / Termine'] },
      { id: 'content', label: 'Haben Sie bereits Logo, Branding und Texte?', options: ['Ja, alles vorhanden', 'Teilweise (Logo oder Texte)', 'Nein, brauche Unterstützung'] },
      { id: 'languages', label: 'Benötigen Sie mehrere Sprachen?', options: ['Nein, eine Sprache', 'Ja, zwei Sprachen', 'Ja, drei oder mehr'] },
      { id: 'integrations', label: 'Welche Anbindungen sind geplant?', options: ['Keine / nur Kontaktformular', 'CRM (z.B. HubSpot, Pipedrive)', 'Buchungssystem', 'Zahlung (Stripe, PayPal)', 'E-Mail-Automatisierung', 'Mehrere davon'] },
      { id: 'timeline', label: 'Zeitrahmen für den Launch?', options: ['So schnell wie möglich', '2–4 Wochen', '1–2 Monate', 'Flexibel'] },
      { id: 'budget', label: 'Grobe Budgetrichtung?', options: ['Bis 2.000 €', '2.000 – 4.000 €', '4.000 – 8.000 €', 'Über 8.000 €'] },
      { id: 'references', label: 'Referenzen / Wünsche (optional)', placeholder: 'z.B. ähnliche Websites, die Ihnen gefallen' },
    ],
    packages: {
      start: { name: 'START – Launch Website', from: '1.490 €', why: 'Passt zu lokalen Betrieben und klarem Fokus auf Sichtbarkeit und Kontakt.' },
      business: { name: 'BUSINESS – Growth Website', from: '2.490 €', why: 'Passt zu Dienstleistern und Agenturen, die Struktur, SEO und eine zweite Sprache nutzen wollen.' },
      pro: { name: 'PRO – Automation & Authority', from: '4.490 €', why: 'Nur empfohlen, wenn Buchungen, Online-Zahlungen oder mehrere technische Anbindungen erforderlich sind.' },
    },
    briefTitle: 'Projekt-Brief',
    commercialTitle: 'Kommerzielle Zusammenfassung',
    recommendedPackage: 'Empfohlenes Paket',
    estimatedInvestment: 'Geschätztes Investment',
    estimatedTimeline: 'Geschätzter Zeitrahmen',
    timelineStandard: '2 Wochen',
    ctaTitle: 'Nächster Schritt',
    cta1: 'Detailangebot senden und Slot reservieren',
    cta2: 'Strategiegespräch vereinbaren',
    briefLabels: {
      overview: 'Projektüberblick',
      goal: 'Geschäftsziel',
      audience: 'Zielgruppe',
      structure: 'Website-Struktur',
      content: 'Content / Branding',
      languages: 'Sprachen',
      integrations: 'Anbindungen',
      timeline: 'Zeitrahmen',
      references: 'Referenzen / Anmerkungen',
    },
    reasoningTitle: 'Warum dieses Paket passt',
    reasoningIntro: 'Ihre Website als Wachstumssystem — keine einmalige Gestaltung, sondern eine Grundlage, die Besucher zu Kunden führt.',
    outputWhatUnderstood: 'Was ich verstanden habe',
    outputComplexity: 'Projektkomplexität',
    outputStrategicRationale: 'Strategische Begründung',
    outputCommercialSummary: 'Kommerzielle Zusammenfassung',
    outputNextStep: 'Nächster Schritt',
    describeTitle: 'Beschreiben Sie Ihr Projekt',
    describePlaceholder: 'z.B. Wir sind eine Beratungsfirma in Berlin. Wir brauchen eine mehrseitige Website auf Deutsch und Englisch für Lead-Generierung. Budget bis 4.000 €, Launch in 2–4 Wochen.',
    analyzeButton: 'Analysieren',
  },
  en: {
    title: 'Project Check',
    subtitle: 'Get the right offer in a few steps.',
    chooseLanguage: 'Choose language',
    next: 'Next',
    back: 'Back',
    questions: [
      { id: 'industry', label: 'What is your business type or industry?', placeholder: 'e.g. trade, consulting, hospitality, healthcare, e-commerce' },
      { id: 'location', label: 'City / Country?', placeholder: 'e.g. Berlin, Germany' },
      { id: 'goal', label: 'Main goal of the website?', options: ['Generate leads', 'Bookings / reservations', 'Sales (e-commerce)', 'Brand presence'] },
      { id: 'type', label: 'What type of website?', options: ['Landing (1 page)', 'Multi-page (5–8 pages)', 'E-commerce / shop', 'Booking system / appointments'] },
      { id: 'content', label: 'Do you already have logo, branding and content?', options: ['Yes, all ready', 'Partly (logo or copy)', 'No, need support'] },
      { id: 'languages', label: 'Do you need multiple languages?', options: ['No, one language', 'Yes, two languages', 'Yes, three or more'] },
      { id: 'integrations', label: 'Which integrations are planned?', options: ['None / contact form only', 'CRM (e.g. HubSpot, Pipedrive)', 'Booking system', 'Payment (Stripe, PayPal)', 'Email automation', 'Several of these'] },
      { id: 'timeline', label: 'Timeline for launch?', options: ['As soon as possible', '2–4 weeks', '1–2 months', 'Flexible'] },
      { id: 'budget', label: 'Rough budget range?', options: ['Up to €2,000', '€2,000 – €4,000', '€4,000 – €8,000', 'Over €8,000'] },
      { id: 'references', label: 'References / preferences (optional)', placeholder: 'e.g. websites you like' },
    ],
    packages: {
      start: { name: 'START – Launch Website', from: '1.490 €', why: 'Fits local businesses and a clear focus on visibility and contact.' },
      business: { name: 'BUSINESS – Growth Website', from: '2.490 €', why: 'Fits service companies and agencies that want structure, SEO and a second language.' },
      pro: { name: 'PRO – Automation & Authority', from: '4.490 €', why: 'Only recommended when bookings, online payments or multiple technical integrations are required.' },
    },
    briefTitle: 'Project Brief',
    commercialTitle: 'Commercial Summary',
    recommendedPackage: 'Recommended Package',
    estimatedInvestment: 'Estimated Investment',
    estimatedTimeline: 'Estimated Timeline',
    timelineStandard: '2 weeks',
    ctaTitle: 'Next step',
    cta1: 'Send me the detailed offer and reserve my slot.',
    cta2: 'Schedule a strategy call.',
    briefLabels: {
      overview: 'Project Overview',
      goal: 'Business Goal',
      audience: 'Target Audience',
      structure: 'Website Structure',
      content: 'Content / Branding',
      languages: 'Languages',
      integrations: 'Integrations',
      timeline: 'Timeline',
      references: 'References / Notes',
    },
    reasoningTitle: 'Why this package fits',
    reasoningIntro: 'Your website as a growth system — not a one-off design, but a foundation that turns visitors into customers.',
    outputWhatUnderstood: 'What I understood',
    outputComplexity: 'Project complexity',
    outputStrategicRationale: 'Strategic rationale',
    outputCommercialSummary: 'Commercial summary',
    outputNextStep: 'Next step',
    describeTitle: 'Describe your project',
    describePlaceholder: 'e.g. We are a consulting firm in Berlin. We need a multi-page website in German and English for lead generation. Budget up to €4,000, launch in 2–4 weeks.',
    analyzeButton: 'Analyze',
  },
  ru: {
    title: 'Проверка проекта',
    subtitle: 'За несколько шагов — подходящее предложение.',
    chooseLanguage: 'Выбор языка',
    next: 'Далее',
    back: 'Назад',
    questions: [
      { id: 'industry', label: 'Сфера деятельности компании?', placeholder: 'например: консалтинг, производство, услуги, e-commerce' },
      { id: 'location', label: 'Город / страна?', placeholder: 'например: Москва, Россия' },
      { id: 'goal', label: 'Главная цель сайта?', options: ['Лиды и заявки', 'Бронирования', 'Продажи (интернет-магазин)', 'Имидж и присутствие'] },
      { id: 'type', label: 'Тип сайта?', options: ['Лендинг (1 страница)', 'Многостраничный (5–8 страниц)', 'Интернет-магазин', 'Бронирование / записи'] },
      { id: 'content', label: 'Есть ли логотип, тексты, бренд?', options: ['Да, всё есть', 'Частично', 'Нет, нужна помощь'] },
      { id: 'languages', label: 'Нужно несколько языков?', options: ['Нет, один', 'Да, два', 'Да, три и больше'] },
      { id: 'integrations', label: 'Какие интеграции планируются?', options: ['Нет / только форма', 'CRM (HubSpot, Pipedrive)', 'Бронирование', 'Оплата (Stripe, PayPal)', 'Email-автоматизация', 'Несколько'] },
      { id: 'timeline', label: 'Сроки запуска?', options: ['Как можно скорее', '2–4 недели', '1–2 месяца', 'Гибко'] },
      { id: 'budget', label: 'Ориентир по бюджету?', options: ['До 2 000 €', '2 000 – 4 000 €', '4 000 – 8 000 €', 'Более 8 000 €'] },
      { id: 'references', label: 'Пожелания (необязательно)', placeholder: 'например, понравившиеся сайты' },
    ],
    packages: {
      start: { name: 'START – Запуск сайта', from: '1 490 €', why: 'Подходит для локального бизнеса и фокуса на видимость и контакты.' },
      business: { name: 'BUSINESS – Рост', from: '2 490 €', why: 'Подходит для услуг и агентств: структура, SEO, второй язык.' },
      pro: { name: 'PRO – Автоматизация', from: '4 490 €', why: 'Рекомендуется при бронированиях, оплате и сложных интеграциях.' },
    },
    briefTitle: 'Бриф проекта',
    commercialTitle: 'Коммерческое резюме',
    recommendedPackage: 'Рекомендуемый пакет',
    estimatedInvestment: 'Оценка инвестиции',
    estimatedTimeline: 'Оценка сроков',
    timelineStandard: '2 недели',
    ctaTitle: 'Следующий шаг',
    cta1: 'Пришлите детальное предложение и зарезервируйте слот.',
    cta2: 'Назначить стратегический звонок.',
    briefLabels: {
      overview: 'Контекст',
      goal: 'Цель',
      audience: 'Аудитория',
      structure: 'Структура сайта',
      content: 'Контент / бренд',
      languages: 'Языки',
      integrations: 'Интеграции',
      timeline: 'Сроки',
      references: 'Пожелания',
    },
    reasoningTitle: 'Почему этот пакет',
    reasoningIntro: 'Сайт как система роста — не разовая верстка, а основа, которая ведёт посетителей к заявкам.',
    outputWhatUnderstood: 'Что я понял',
    outputComplexity: 'Сложность проекта',
    outputStrategicRationale: 'Стратегическая логика',
    outputCommercialSummary: 'Коммерческое резюме',
    outputNextStep: 'Следующий шаг',
    describeTitle: 'Опишите проект',
    describePlaceholder: 'Например: Консалтинговая компания в Берлине. Нужен многостраничный сайт на немецком и английском для лидов. Бюджет до 4 000 €, запуск за 2–4 недели.',
    analyzeButton: 'Анализировать',
  },
};

/** Reformulate user raw input for brief and reasoning. Do not copy raw input into structured fields. */
export function reformulateForBrief(fieldId, value, lang) {
  if (!value || typeof value !== 'string') return '–';
  const v = value.trim();
  if (!v) return '–';
  if (fieldId === 'references') {
    return lang === 'ru' ? 'Пожелания и референсы учтены.' : lang === 'de' ? 'Kundenwünsche und Referenzen berücksichtigt.' : 'Client preferences and references noted.';
  }
  if (fieldId === 'industry' || fieldId === 'location') {
    const cleaned = v.replace(/\s+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    return cleaned.length > 80 ? cleaned.slice(0, 77) + '…' : cleaned;
  }
  return v.length > 100 ? v.slice(0, 97) + '…' : v;
}

/**
 * Returns 3–5 reasoning bullets before the package recommendation.
 * Frames the website as a growth system. Language: 'de' | 'en'.
 */
export function getReasoningBullets(answers, packageKey, lang) {
  const t = consultationCopy[lang] || consultationCopy.en;
  const goal = (answers.goal || '').toLowerCase();
  const type = (answers.type || '').toLowerCase();
  const integrations = (answers.integrations || '').toLowerCase();
  const languages = (answers.languages || '').toLowerCase();
  const industry = (answers.industry || '').toLowerCase();
  const industryFormatted = industry ? reformulateForBrief('industry', answers.industry, lang) : '';
  const lowBudget = isLowBudget(answers);

  const bullets = [];

  if (lang === 'de') {
    if (lowBudget) bullets.push('Bei Ihrem genannten Budgetrahmen priorisieren wir einen schlanken Einstieg — Sie können später ausbauen.');
    bullets.push('Ihr Ziel (Leads, Buchungen oder Verkauf) braucht einen klaren Weg vom Besuch zur Conversion — die gewählte Struktur unterstützt genau das.');
    if (industryFormatted && industryFormatted !== '–') bullets.push(`Ihre Branche (${industryFormatted}) profitiert von einer klaren Positionierung und einer technisch stabilen Basis.`);
    if (integrations && !integrations.includes('keine') && !integrations.includes('nur kontakt')) {
      bullets.push('Die geplanten Anbindungen erfordern eine solide technische Basis, damit das System mitwächst und nicht nachbessern muss.');
    } else {
      bullets.push('Ohne komplexe Anbindungen reicht eine starke Struktur und klare Inhalte — Sie können später erweitern.');
    }
    if (languages.includes('zwei') || languages.includes('drei')) {
      bullets.push('Mehrsprachigkeit erweitert Ihre Reichweite systematisch; die Architektur der Website sollte das von Anfang an abbilden.');
    }
    if (packageKey === 'pro') {
      bullets.push('Buchungen, Zahlungen oder mehrere Integrationen machen die Website zum zentralen System — dafür ist PRO ausgelegt.');
    } else if (packageKey === 'start') {
      bullets.push('Ein fokussierter Einstieg mit einer klaren Seite reduziert Reibung und bringt Sie schnell online.');
    } else {
      bullets.push('BUSINESS baut die richtige Grundlage für Wachstum: Struktur, SEO und optional zweite Sprache — ohne unnötige Komplexität.');
    }
  } else {
    if (lowBudget) bullets.push('Given your indicated budget, we prioritise a lean start — you can scale later.');
    bullets.push('Your goal (leads, bookings or sales) needs a clear path from visit to conversion — the structure you chose supports exactly that.');
    if (industryFormatted && industryFormatted !== '–') bullets.push(`Your industry (${industryFormatted}) benefits from clear positioning and a technically solid foundation.`);
    if (integrations && !integrations.includes('none') && !integrations.includes('contact form only')) {
      bullets.push('The integrations you plan require a solid technical base so the system can scale with you, not hold you back.');
    } else {
      bullets.push('Without complex integrations, strong structure and clear content are enough — you can extend later.');
    }
    if (languages.includes('two') || languages.includes('three')) {
      bullets.push('Multiple languages extend your reach systematically; the site architecture should reflect that from the start.');
    }
    if (packageKey === 'pro') {
      bullets.push('Bookings, payments or multiple integrations make the site your central system — PRO is built for that.');
    } else if (packageKey === 'start') {
      bullets.push('A focused start with a single clear page reduces friction and gets you online quickly.');
    } else {
      bullets.push('BUSINESS builds the right foundation for growth: structure, SEO and optional second language — without unnecessary complexity.');
    }
  }

  return bullets.slice(0, 5);
}

// Low-budget: explicit lowest tier or user mentions cheap/low budget. Never recommend PRO to low-budget clients.
export function isLowBudget(answers) {
  const budget = (answers.budget || '').toLowerCase();
  const references = (answers.references || '').toLowerCase();
  const industry = (answers.industry || '').toLowerCase();
  const lowBudgetOption =
    budget.includes('bis 2') || budget.includes('up to') || budget.includes('2.000 €') || budget.includes('€2,000');
  const explicitLowBudget =
    references.includes('günstig') || references.includes('cheap') || references.includes('low budget') ||
    references.includes('kleines budget') || references.includes('minimal') || references.includes('billig') ||
    industry.includes('günstig') || industry.includes('cheap');
  return lowBudgetOption || explicitLowBudget;
}

// Package selection: use overall project complexity. Simple booking or Stripe/payment alone does NOT require PRO.
// Hierarchy: (1) low budget → Start. (2) multi-page 5–8 + leads + basic integrations → Business. (3) Pro only if multiple complex (CRM + automation + payments) or platform/scalability.
export function getRecommendedPackage(answers) {
  const type = (answers.type || '').toLowerCase();
  const integrations = (answers.integrations || '').toLowerCase();
  const goal = (answers.goal || '').toLowerCase();
  const notes = (answers.references || '').toLowerCase();
  const industry = (answers.industry || '').toLowerCase();
  const lowBudget = isLowBudget(answers);

  const isMultiPage58 = type.includes('mehrseitig') || type.includes('multi') || type.includes('5-8') || type.includes('5–8') || type.includes('6-8');
  const isGoalLeads = goal.includes('lead') || !goal;
  const hasBooking = integrations.includes('buchung') || integrations.includes('booking');
  const hasPayment = integrations.includes('zahlung') || integrations.includes('payment');
  const hasCrm = integrations.includes('crm');
  const hasAutomation = integrations.includes('automatisierung') || integrations.includes('automation') || integrations.includes('mehrere') || integrations.includes('several');
  const basicIntegrations = (hasBooking || hasPayment) && !hasCrm && !hasAutomation;
  const onlySimpleBookingOrPayment = basicIntegrations;
  const multipleComplex = (hasCrm && hasAutomation) || (hasCrm && hasPayment) || (hasAutomation && hasPayment) || (hasCrm && hasAutomation && hasPayment);
  const platformOrScalability = notes.includes('platform') || notes.includes('skalier') || notes.includes('scalab') || notes.includes('scale');

  if (lowBudget) return 'start';

  if (isMultiPage58 && isGoalLeads && (basicIntegrations || (!hasCrm && !hasAutomation && !hasPayment))) return 'business';

  if (onlySimpleBookingOrPayment) return 'business';
  if (multipleComplex || platformOrScalability) return 'pro';

  const smallLocal = [
    industry.includes('handwerk') || industry.includes('trade'),
    (type.includes('landing') || type.includes('1 seite') || type.includes('1 page')),
    (!integrations || integrations.includes('keine') || integrations.includes('none') || integrations.includes('nur kontakt') || integrations.includes('contact form only')),
  ].filter(Boolean).length >= 2;
  if (smallLocal) return 'start';

  return 'business';
}
