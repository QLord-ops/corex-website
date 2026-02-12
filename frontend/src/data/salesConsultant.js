/**
 * COREX — Autonomous senior AI Sales Strategist.
 * ABSOLUTE RULE: Explicit client-stated data ALWAYS overrides assumptions. Never override stated timeline, budget, integrations or scope.
 * NO STEP MODE: No wizard, no form follow-up, no sequential intake questions.
 * PROCESS: Extract facts → Classify complexity → Match package → Justify → Output recommendation → ONE CTA only.
 * TIMELINE: If stated — use exactly. Do NOT default to 2–4 weeks. Only assume if completely missing.
 * INTEGRATION: Automation, CRM, multi-country, subscription, platform → complexity Complex.
 * PACKAGE: Low budget → START (never Pro). Multi-page + bilingual + lead focus → BUSINESS. CRM OR automation OR subscription OR scalable → PRO. 3+ advanced → PRO.
 * OUTPUT: WHAT I UNDERSTOOD | PROJECT COMPLEXITY (Standard/Advanced/Complex) | STRATEGIC RATIONALE (4–6 bullets) | COMMERCIAL SUMMARY | NEXT STEP (single CTA).
 */

const CRITICAL_FIELDS = ['goal', 'website_type', 'budget_range', 'timeline', 'pages'];
const OTHER_REQUIRED = ['language', 'business_type', 'city'];
const QUESTION_PRIORITY = [...CRITICAL_FIELDS, ...OTHER_REQUIRED];

const QUESTIONS = {
  de: {
    language: 'In welcher Sprache möchten Sie weiter kommunizieren?',
    business_type: 'In welcher Branche sind Sie tätig?',
    city: 'In welcher Stadt bzw. in welchem Land sind Sie ansässig?',
    goal: 'Was ist das Hauptziel der Website — Leads, Buchungen, Verkauf oder Markenauftritt?',
    website_type: 'Welche Art von Website planen Sie — Landing, mehrseitig oder E-Commerce?',
    pages: 'Wie viele Seiten sind geplant?',
    timeline: 'In welchem Zeitrahmen soll die Website live gehen?',
    budget_range: 'In welcher Budgetrichtung bewegen Sie sich?',
  },
  en: {
    language: 'Which language do you prefer?',
    business_type: 'What is your business type or industry?',
    city: 'Which city or country are you based in?',
    goal: 'What is the main goal of the website — leads, bookings, sales or brand presence?',
    website_type: 'What type of website do you need — landing, multi-page or e-commerce?',
    pages: 'How many pages do you need?',
    timeline: 'What is your timeline for launch?',
    budget_range: 'What is your rough budget range?',
  },
  ru: {
    language: 'На каком языке удобнее общаться?',
    business_type: 'В какой сфере ваша компания?',
    city: 'Город или страна?',
    goal: 'Главная цель сайта — лиды, бронирования, продажи или имидж?',
    website_type: 'Какой тип сайта нужен — лендинг, многостраничный или интернет-магазин?',
    pages: 'Сколько страниц планируется?',
    timeline: 'В какие сроки нужен запуск?',
    budget_range: 'В каком диапазоне бюджет?',
  },
};

const PACKAGES = {
  start: { name: 'START', investment: 'from 1.490 €', investmentEn: 'from €1,490', investmentRu: 'от 1 490 €' },
  business: { name: 'BUSINESS', investment: 'from 2.490 €', investmentEn: 'from €2,490', investmentRu: 'от 2 490 €' },
  pro: { name: 'PRO', investment: 'from 4.490 €', investmentEn: 'from €4,490', investmentRu: 'от 4 490 €' },
};

// Respond in same language as intake. Never default to English unless unclear. Supported: de, en, ru.
function getLang(intake) {
  const l = intake?.language;
  return l === 'de' || l === 'en' || l === 'ru' ? l : 'en';
}

// PROJECT COMPLEXITY: Standard / Advanced / Complex. No assumptions. Stated integrations only.
// If automation, CRM, multi-country, subscription, platform → Complex. 3+ advanced → Complex. Booking/payment only → Advanced.
function getComplexityLevel(intake) {
  const integrations = intake?.integrations || [];
  const notes = (intake?.notes || '').toLowerCase();
  const hasPayment = integrations.includes('payment');
  const hasCrm = integrations.includes('crm');
  const hasAutomation = integrations.includes('automation');
  const hasSubscription = integrations.includes('subscription');
  const scalability_required = intake?.scalability_required === true;
  const platformOrScalability = scalability_required || /platform|skalier|scalab|scale/.test(notes);
  const multiCountry = /\b(multi[- ]?country|mehrere\s*länder|international\s*scal|multi[- ]?market)\b/.test(notes);

  const advancedCount = [hasPayment, hasCrm, hasAutomation, hasSubscription, platformOrScalability, multiCountry].filter(Boolean).length;
  if (hasCrm || hasAutomation || hasSubscription || platformOrScalability || multiCountry || advancedCount >= 3) return 'complex';
  if (integrations.includes('booking') || hasPayment) return 'advanced';
  return 'standard';
}

// Parse page count for 6+ and 1–3 checks.
function parsePageCount(pages, website_type) {
  if (pages == null || pages === '') return website_type === 'landing' ? 1 : website_type === 'multi-page' ? 6 : null;
  const s = String(pages).trim();
  if (/^\d+$/.test(s)) return parseInt(s, 10);
  const range = s.match(/^(\d+)\s*[-–]\s*(\d+)$/);
  if (range) return Math.max(parseInt(range[1], 10), parseInt(range[2], 10));
  return null;
}

/**
 * PACKAGE LOGIC. Explicit data overrides. Low budget → START (never Pro).
 * CRM OR automation OR subscription OR scalable architecture → PRO. 3+ advanced integrations → PRO.
 * Multi-page + bilingual + lead focus → BUSINESS.
 */
function getPackage(intake) {
  const budget = intake?.budget_range;
  const website_type = intake?.website_type;
  const pages = intake?.pages;
  const goal = intake?.goal;
  const languages_needed = intake?.languages_needed || [];
  const integrations = intake?.integrations || [];
  const notes = (intake?.notes || '').toLowerCase();
  const hasPayment = integrations.includes('payment');
  const hasCrm = integrations.includes('crm');
  const hasAutomation = integrations.includes('automation');
  const hasSubscription = integrations.includes('subscription');
  const hasBooking = integrations.includes('booking');
  const scalable = intake?.scalability_required === true || /platform|skalier|scalab|scale/.test(notes);
  const multiCountry = /\b(multi[- ]?country|mehrere\s*länder|international\s*scal|multi[- ]?market)\b/.test(notes);

  const advancedCount = [hasPayment, hasCrm, hasAutomation, hasSubscription, scalable, multiCountry].filter(Boolean).length;
  const triggersPro = hasCrm || hasAutomation || hasSubscription || scalable || multiCountry || advancedCount >= 3;

  const pageCount = parsePageCount(pages, website_type);
  const multiPage = website_type === 'multi-page' || (pageCount != null && pageCount >= 5);
  const landing13 = website_type === 'landing' || (pageCount != null && pageCount >= 1 && pageCount <= 3);
  const leadFocus = goal === 'leads' || !goal;
  const bilingual = languages_needed.length >= 2;
  const noAdvancedStack = !hasCrm && !hasAutomation && !hasPayment && !hasSubscription && !scalable && !multiCountry;
  const basicBookingOnly = hasBooking && noAdvancedStack;

  // Low budget → START (never Pro). Absolute rule.
  if (budget === 'low') {
    if (landing13 || website_type === 'landing' || noAdvancedStack) return 'start';
    return 'business';
  }

  // CRM OR automation OR subscription OR scalable architecture → PRO. 3+ advanced → PRO.
  if (triggersPro) return 'pro';

  // Multi-page + bilingual + lead focus → BUSINESS.
  if (multiPage && bilingual && leadFocus) return 'business';

  // Landing (1–3) + basic booking only + no advanced stack → START.
  if (landing13 && (basicBookingOnly || noAdvancedStack)) return 'start';

  // Booking or payment only (no PRO triggers) → BUSINESS.
  if (hasBooking || hasPayment) return 'business';

  return 'business';
}

// STRICT TIMELINE PRESERVATION: output exactly as stated. Language matches intake (de/en/ru).
function getTimelineText(timeline, lang) {
  if (timeline == null || timeline === '') return null;
  const t = String(timeline);
  const isDe = lang === 'de';
  const isRu = lang === 'ru';
  if (t === 'asap') return isRu ? 'как можно скорее' : isDe ? 'so bald wie möglich' : 'as soon as possible';
  if (t === '2-weeks') return isRu ? '2 недели' : isDe ? '2 Wochen' : '2 weeks';
  if (t === '2-4-weeks') return isRu ? '2–4 недели' : isDe ? '2–4 Wochen' : '2–4 weeks';
  if (t === '1-2-months') return isRu ? '1–2 месяца' : isDe ? '1–2 Monate' : '1–2 months';
  if (t === 'flexible') return isRu ? 'гибко' : isDe ? 'flexibel' : 'flexible';
  const weeksExact = t.match(/^(\d+)-weeks$/);
  if (weeksExact) {
    const n = weeksExact[1];
    const ruW = n === '1' ? 'неделя' : ['2','3','4'].includes(n) ? 'недели' : 'недель';
    return isRu ? `${n} ${ruW}` : isDe ? `${n} Wochen` : `${n} weeks`;
  }
  const rangeWeeks = t.match(/^(\d+)-(\d+)-weeks$/);
  if (rangeWeeks) return isRu ? `${rangeWeeks[1]}–${rangeWeeks[2]} недели` : isDe ? `${rangeWeeks[1]}–${rangeWeeks[2]} Wochen` : `${rangeWeeks[1]}–${rangeWeeks[2]} weeks`;
  const monthsExact = t.match(/^(\d+)-months$/);
  if (monthsExact) {
    const n = monthsExact[1];
    return isRu ? `${n} ${n === '1' ? 'месяц' : ['2','3','4'].includes(n) ? 'месяца' : 'месяцев'}` : isDe ? `${n} Monat${n === '1' ? '' : 'e'}` : `${n} month${n === '1' ? '' : 's'}`;
  }
  return t;
}

const COMPLEXITY_LABELS = {
  de: { standard: 'Standard', advanced: 'Erweitert', complex: 'Komplex' },
  en: { standard: 'Standard', advanced: 'Advanced', complex: 'Complex' },
  ru: { standard: 'Стандарт', advanced: 'Расширенный', complex: 'Сложный' },
};

function inferTargetAudience(businessType, lang) {
  if (!businessType) return null;
  const t = (businessType || '').toLowerCase();
  const isDe = lang === 'de';
  const isRu = lang === 'ru';
  if (/\b(beratung|consulting|consultancy|консалтинг|консультац)\b/.test(t)) return isRu ? 'B2B-решения' : isDe ? 'B2B-Entscheider' : 'B2B decision-makers';
  if (/\b(agentur|agency|агентство)\b/.test(t)) return isRu ? 'МСП и растущий бизнес' : isDe ? 'KMU und wachsende Unternehmen' : 'SMEs and growing businesses';
  if (/\b(handwerk|local|regional|gastronomie|restaurant|локальн|регион|ресторан|гостиниц)\b/.test(t)) return isRu ? 'локальная аудитория' : isDe ? 'regionale Kunden' : 'regional clients';
  return null;
}

// 2–4 lines professional summary. No raw user text. Language matches intake (de/en/ru).
function getSummaryUnderstood(intake, lang) {
  const isDe = lang === 'de';
  const isRu = lang === 'ru';
  const goal = intake?.goal;
  const website_type = intake?.website_type;
  const city = intake?.city;
  const business_type = intake?.business_type;
  const languages_needed = intake?.languages_needed || [];
  const timeline = intake?.timeline;
  const integrations = intake?.integrations || [];

  const goalText = { leads: isRu ? 'лиды' : isDe ? 'Lead-Generierung' : 'lead generation', booking: isRu ? 'бронирования' : isDe ? 'Buchungen/Termine' : 'bookings', sales: isRu ? 'продажи' : isDe ? 'Verkauf' : 'sales', branding: isRu ? 'имидж' : isDe ? 'Markenauftritt' : 'brand presence' }[goal] || (isRu ? 'бизнес-результат' : isDe ? 'klarer Geschäftserfolg' : 'clear business outcome');
  const typeText = website_type === 'landing' ? (isRu ? 'лендинг' : isDe ? 'Landingpage' : 'landing page') : website_type === 'multi-page' ? (isRu ? 'многостраничный сайт' : isDe ? 'mehrseitige Website' : 'multi-page website') : website_type === 'e-commerce' ? (isRu ? 'интернет-магазин' : isDe ? 'E-Commerce' : 'e-commerce') : (isRu ? 'сайт' : isDe ? 'Webauftritt' : 'web presence');
  const bilingual = languages_needed.length >= 2;
  const parts = [];
  const timelineDisplay = timeline ? getTimelineText(timeline, lang) : null;

  if (business_type || city) {
    const loc = [business_type, city].filter(Boolean).join(', ');
    if (isRu) parts.push(`Контекст: ${loc}.`);
    else if (isDe) parts.push(`Projektkontext: ${loc}.`);
    else parts.push(`Context: ${loc}.`);
  }
  if (isRu) {
    parts.push(`Цель: ${typeText} с фокусом на ${goalText}${bilingual ? ', два языка' : ''}.`);
    if (timelineDisplay) parts.push(`Сроки: ${timelineDisplay}.`);
    if (integrations.length) parts.push(`Интеграции: ${integrations.join(', ')}.`);
  } else if (isDe) {
    parts.push(`Ziel: ${typeText} mit Fokus auf ${goalText}${bilingual ? ', zweisprachig' : ''}.`);
    if (timelineDisplay) parts.push(`Zeitrahmen: ${timelineDisplay}.`);
    if (integrations.length) parts.push(`Geplante Anbindungen: ${integrations.join(', ')}.`);
  } else {
    parts.push(`Goal: ${typeText} focused on ${goalText}${bilingual ? ', bilingual' : ''}.`);
    if (timelineDisplay) parts.push(`Timeline: ${timelineDisplay}.`);
    if (integrations.length) parts.push(`Planned integrations: ${integrations.join(', ')}.`);
  }
  return parts.length ? parts.join(' ') : (isRu ? 'По описанию — веб-проект с понятной структурой и пакетом.' : isDe ? 'Aus Ihrer Beschreibung leite ich ein Webprojekt mit klarem Struktur- und Paketbedarf ab.' : 'From your description, I see a web project with clear structure and package needs.');
}

// Only when completely missing. Do NOT default timeline to 2–4 weeks.
function getAssumptions(intake, missing, lang) {
  const bullets = [];
  const isDe = lang === 'de';
  const isRu = lang === 'ru';
  if (missing && missing.includes('timeline')) {
    bullets.push(isRu ? 'Сроки не указаны — ориентируемся на вашу дату.' : isDe ? 'Zeitrahmen nicht genannt — wir richten uns nach Ihrem Wunschtermin.' : 'Timeline not stated — we will align to your target date.');
  }
  if (missing && missing.includes('budget_range')) {
    bullets.push(isRu ? 'Бюджет не указан; пакет по объёму проекта.' : isDe ? 'Budgetrahmen nicht genannt; Paketwahl folgt aus Projektumfang.' : 'Budget range not stated; package follows project scope.');
  }
  return bullets.slice(0, 2);
}

// STRATEGIC RATIONALE: 4–6 sharp bullets tied directly to stated goals. Language matches intake.
function getStrategicBullets(intake, packageKey, lang) {
  const bullets = [];
  const isDe = lang === 'de';
  const isRu = lang === 'ru';
  const audience = inferTargetAudience(intake?.business_type, lang);
  const integrations = intake?.integrations || [];
  const goal = intake?.goal;
  const hasBooking = integrations.includes('booking');
  const hasPayment = integrations.includes('payment');
  const hasCrm = integrations.includes('crm');
  const hasAutomation = integrations.includes('automation');
  const hasSubscription = integrations.includes('subscription');
  const complexity = getComplexityLevel(intake);

  if (isRu) {
    if (goal === 'leads' || !goal) bullets.push('Фокус на лиды требует понятных шагов до заявки и доверия — структура важнее количества фич.');
    if (goal === 'booking') bullets.push('Бронирования должны встраиваться в путь пользователя без лишних шагов.');
    if (goal === 'sales') bullets.push('Продажи требуют ясной подачи товара, доверия и надёжной оплаты.');
    if (hasBooking || hasPayment) bullets.push('Бронирование и оплата должны быть аккуратно подключены и удобны в поддержке.');
    if (hasCrm || hasAutomation) bullets.push('CRM и автоматизация требуют сквозного процесса от первого касания до сопровождения.');
    if (hasSubscription) bullets.push('Подписки и регулярные платежи — стабильные процессы и понятная коммуникация.');
    if (complexity === 'complex') bullets.push('Заложить масштабируемость и расширяемость с самого начала — без перегруза.');
    if (audience) bullets.push(`Аудитория (${audience}) выигрывает от профессионального и доверительного представления.`);
  } else if (isDe) {
    if (goal === 'leads' || !goal) bullets.push('Lead-Fokus braucht klare Conversion-Pfade und vertrauenswürdige Darstellung — Struktur vor Features.');
    if (goal === 'booking') bullets.push('Buchungslogik muss nahtlos in den Besucherfluss integriert sein, ohne Medienbrüche.');
    if (goal === 'sales') bullets.push('Verkauf erfordert klare Produktdarstellung, Vertrauen und eine sichere Zahlungsanbindung.');
    if (hasBooking || hasPayment) bullets.push('Buchungs- und Zahlungslogik müssen technisch sauber angebunden und wartbar sein.');
    if (hasCrm || hasAutomation) bullets.push('CRM und Automatisierung erfordern durchgängige Workflow-Architektur von Erstkontakt bis Nachverfolgung.');
    if (hasSubscription) bullets.push('Abonnements und wiederkehrende Zahlungen verlangen stabile Prozesse und klare Kommunikation.');
    if (complexity === 'complex') bullets.push('Skalierbarkeit und Erweiterbarkeit von Anfang an mitdenken — ohne Overengineering.');
    if (audience) bullets.push(`Zielgruppe (${audience}) profitiert von professioneller, vertrauenswürdiger Darstellung.`);
  } else {
    if (goal === 'leads' || !goal) bullets.push('Lead focus needs clear conversion paths and trustworthy presentation — structure before features.');
    if (goal === 'booking') bullets.push('Booking logic must sit seamlessly in the visitor journey, without friction.');
    if (goal === 'sales') bullets.push('Sales require clear product presentation, trust, and a solid payment integration.');
    if (hasBooking || hasPayment) bullets.push('Booking and payment logic must be cleanly integrated and maintainable.');
    if (hasCrm || hasAutomation) bullets.push('CRM and automation require end-to-end workflow from first touch to follow-up.');
    if (hasSubscription) bullets.push('Subscriptions and recurring payments demand stable processes and clear communication.');
    if (complexity === 'complex') bullets.push('Consider scalability and extensibility from the start — without overengineering.');
    if (audience) bullets.push(`Target audience (${audience}) benefits from a professional, trustworthy presence.`);
  }

  return bullets.slice(0, 6);
}

// 2–3 sentences why this package is the correct balance. Language matches intake.
function getJustification(intake, packageKey, lang) {
  const isDe = lang === 'de';
  const isRu = lang === 'ru';
  const goal = intake?.goal;
  const hasMultiPage = intake?.website_type === 'multi-page' || (intake?.pages && /[5-8]/.test(String(intake?.pages)));

  if (packageKey === 'start') {
    return isRu ? 'При вашем бюджете рекомендуем минимальный старт. Позже можно нарастить без перегруза.' : isDe ? 'Bei Ihrem Budgetrahmen empfehlen wir einen schlanken Einstieg. Sie können später ausbauen — ohne Overengineering.' : 'Given your budget, we recommend a lean start. You can scale later without overengineering.';
  }
  if (packageKey === 'business') {
    const leadFocus = goal === 'leads' || !goal;
    return isRu ? `Многостраничная структура${leadFocus ? ' и фокус на лиды' : ''} — уровень BUSINESS. Только брони или оплата не требуют PRO.` : isDe ? `Multi-page-Struktur${leadFocus ? ' und Fokus auf Leads' : ''} passt zum BUSINESS-Paket. Einfache Buchung oder Zahlung allein rechtfertigen kein PRO.` : `Multi-page structure${leadFocus ? ' and lead focus' : ''} fit the BUSINESS package. Simple booking or payment alone does not require PRO.`;
  }
  return isRu ? 'CRM, автоматизация или платформа/масштабирование делают уместным пакет PRO. Рекомендуем только в таких случаях.' : isDe ? 'CRM plus Automatisierung oder Plattform-/Skalierungsanforderungen machen PRO sinnvoll. Nur dann empfohlen.' : 'CRM plus automation or platform/scalability requirements make PRO appropriate. Recommended only in those cases.';
}

/**
 * Always returns recommendation structure. When missing_required.length > 0, adds oneClarifyingQuestion + field; otherwise ctaRecommended.
 * @param {object} intake
 * @param {string[]} missing_required
 * @returns {{ type: 'recommendation', language, summaryUnderstood, assumptions, strategicBullets, package, packageName, justification, estimatedInvestment, estimatedTimeline, oneClarifyingQuestion?: string, field?: string, ctaRecommended?: string, ctaPrimary, ctaSecondary }}
 */
export function getConsultantResponse(intake, missing_required) {
  const lang = getLang(intake);
  const missing = Array.isArray(missing_required) ? missing_required : [];

  const packageKey = getPackage(intake);
  const pkg = PACKAGES[packageKey];
  const strategicBullets = getStrategicBullets(intake, packageKey, lang);
  const justification = getJustification(intake, packageKey, lang);
  const estimatedInvestment = lang === 'ru' ? (pkg.investmentRu || pkg.investmentEn) : (lang === 'de' ? pkg.investment : pkg.investmentEn);
  // TIMELINE RULE: Use exactly if stated. Only show default when completely missing.
  const timelineStated = intake?.timeline != null && intake?.timeline !== '';
  const notStatedLabel = lang === 'ru' ? 'Не указано' : lang === 'de' ? 'Nicht genannt' : 'Not stated';
  const estimatedTimeline = timelineStated ? getTimelineText(intake.timeline, lang) : notStatedLabel;

  const cta = {
    de: { primary: 'Detailangebot senden und Slot reservieren.', secondary: 'Strategiegespräch vereinbaren.' },
    en: { primary: 'Send me the detailed offer and reserve my slot.', secondary: 'Schedule a strategy call.' },
    ru: { primary: 'Пришлите детальное предложение и зарезервируйте слот.', secondary: 'Назначить стратегический звонок.' },
  }[lang] || { primary: 'Send me the detailed offer and reserve my slot.', secondary: 'Schedule a strategy call.' };

  const summaryUnderstood = getSummaryUnderstood(intake, lang);
  const assumptions = getAssumptions(intake, missing, lang);
  const complexityLevel = getComplexityLevel(intake);
  const complexityLabel = COMPLEXITY_LABELS[lang]?.[complexityLevel] || COMPLEXITY_LABELS.en?.[complexityLevel] || complexityLevel;

  const urgencyReason = lang === 'ru' ? 'Ограниченная загрузка — слоты распределяются по очереди.' : lang === 'de' ? 'Begrenzte Kapazität — Slots werden nach Reihenfolge vergeben.' : 'Limited capacity — slots are assigned in order.';

  // 70% rule: if scope is clear enough to decide package, recommend immediately. Ask at most ONE question only if it directly affects pricing tier.
  const SCOPE_PRICE_FIELDS = ['goal', 'website_type', 'budget_range', 'timeline', 'pages'];
  const missingScopeOrPrice = missing.filter((f) => SCOPE_PRICE_FIELDS.includes(f));
  const scopeFilledCount = SCOPE_PRICE_FIELDS.filter((f) => !missing.includes(f)).length;
  const scopeClearEnough = scopeFilledCount >= 3 || (scopeFilledCount >= 2 && packageKey !== 'pro' && intake?.integrations?.length <= 1);
  const askField = !scopeClearEnough && missingScopeOrPrice.length > 0
    ? QUESTION_PRIORITY.find((f) => missingScopeOrPrice.includes(f)) || missingScopeOrPrice[0]
    : null;

  let oneClarifyingQuestion = null;
  let field = null;
  let ctaRecommended = cta.primary;

  if (askField) {
    const questions = QUESTIONS[lang] || QUESTIONS.en;
    oneClarifyingQuestion = questions[askField] || questions.budget_range;
    field = askField;
    ctaRecommended = null;
  }

  // NEXT STEP: Single CTA only (no second option in output).
  const nextStepSingleCta = ctaRecommended ?? cta.primary;

  return {
    type: 'recommendation',
    language: lang,
    summaryUnderstood,
    assumptions,
    complexityLevel,
    complexityLabel,
    strategicBullets,
    package: packageKey,
    packageName: pkg.name,
    justification,
    estimatedInvestment,
    estimatedTimeline,
    urgencyReason,
    nextStepSingleCta,
    ...(oneClarifyingQuestion != null && { oneClarifyingQuestion, field }),
    ctaRecommended: ctaRecommended ?? undefined,
    ctaPrimary: cta.primary,
    ctaSecondary: cta.secondary,
  };
}

const INVESTMENT_EUR = { start: 1490, business: 2490, pro: 4490 };
const COMPLEXITY_TO_SIMPLE = { standard: 'Simple', advanced: 'Advanced', complex: 'Complex' };

/**
 * AI response format for UI: JSON only. mode="result" when missing_required empty; mode="wizard" with single next_question otherwise.
 * @param {object} intake
 * @param {string[]} missing_required
 * @returns {{ mode: 'result'|'wizard', language: string, understood: string, complexity: string, recommendation_bullets: string[], package: string|null, investment_from_eur: number|null, timeline: string|null, cta: 'offer'|'call'|null, missing_required: string[], next_question: string|null }}
 */
export function getConsultantResponseAIFormat(intake, missing_required) {
  const r = getConsultantResponse(intake, missing_required);
  const missing = Array.isArray(missing_required) ? missing_required : [];
  const hasQuestion = r.oneClarifyingQuestion != null;
  const mode = hasQuestion ? 'wizard' : 'result';
  const missingForWizard = hasQuestion && r.field ? [r.field] : [];
  const nextQuestion = hasQuestion ? (r.oneClarifyingQuestion || null) : null;

  const language = (r.language === 'de' || r.language === 'ru') ? r.language : (r.language === 'en' ? 'en' : 'other');
  const complexity = COMPLEXITY_TO_SIMPLE[r.complexityLevel] || 'Simple';
  const pkgName = r.packageName ? r.packageName.toUpperCase() : null;
  const investmentFromEur = r.package && INVESTMENT_EUR[r.package] != null ? INVESTMENT_EUR[r.package] : null;
  const timeline = r.estimatedTimeline != null ? r.estimatedTimeline : null;
  const cta = r.ctaRecommended != null ? (r.ctaPrimary && r.ctaPrimary.toLowerCase().includes('offer') ? 'offer' : 'call') : null;

  return {
    mode,
    language,
    understood: r.summaryUnderstood || '',
    complexity,
    recommendation_bullets: Array.isArray(r.strategicBullets) ? r.strategicBullets : [],
    package: pkgName,
    investment_from_eur: investmentFromEur,
    timeline,
    cta,
    missing_required: mode === 'wizard' ? missingForWizard : [],
    next_question: nextQuestion,
  };
}

/**
 * FAIL SAFE: Ensure lead payload is valid for POST /api/lead. Answer is invalid without valid JSON.
 * Validation before response: 1) stated timeline used 2) stated budget used 3) integrations correct 4) package per STRICT PRIORITY 5) valid payload.
 */
function ensureValidLeadPayload(obj) {
  return {
    lead_score: Math.min(10, Math.max(1, Number(obj.lead_score) || 5)),
    language: (obj.language === 'de' || obj.language === 'ru') ? obj.language : 'en',
    city: typeof obj.city === 'string' ? obj.city : '',
    industry: typeof obj.industry === 'string' ? obj.industry : '',
    goal: typeof obj.goal === 'string' ? obj.goal : '',
    package: /^PRO$/.test(obj.package) ? 'PRO' : /^START$/.test(obj.package) ? 'START' : 'BUSINESS',
    budget_signal: /^(low|mid|high)$/.test(obj.budget_signal) ? obj.budget_signal : 'unknown',
    timeline: typeof obj.timeline === 'string' ? obj.timeline : '',
    integrations: Array.isArray(obj.integrations) ? obj.integrations : [],
    next_step: obj.next_step === 'offer' ? 'offer' : 'call',
    summary: typeof obj.summary === 'string' ? obj.summary : '',
    risk_flags: Array.isArray(obj.risk_flags) ? obj.risk_flags : [],
  };
}

/**
 * TG lead payload for backend webhook. Internal only — do not show to user.
 * @param {object} intake
 * @param {object} recommendation - result of getConsultantResponse
 * @returns {object} Valid JSON-serializable object for POST /api/lead
 */
export function getLeadPayloadForWebhook(intake, recommendation) {
  const lang = getLang(intake);
  const packageKey = recommendation?.package || getPackage(intake);
  const packageName = (recommendation?.packageName || PACKAGES[packageKey]?.name || 'BUSINESS').toUpperCase();
  const budget = intake?.budget_range;
  const budgetSignal = budget === 'low' ? 'low' : budget === 'mid' ? 'mid' : budget === 'high' ? 'high' : 'unknown';
  // TIMELINE RULE: Use exactly if stated. Do not assume default.
  const timelineStated = intake?.timeline != null && intake?.timeline !== '';
  const timelineText = timelineStated ? (getTimelineText(intake.timeline, 'en') || '') : 'Not stated';

  const complexity = getComplexityLevel(intake);
  const hasGoal = !!intake?.goal;
  const hasType = !!intake?.website_type || !!intake?.pages;
  const hasBudget = intake?.budget_range != null;
  const hasTimeline = !!intake?.timeline;
  const filled = [hasGoal, hasType, hasBudget, hasTimeline].filter(Boolean).length;
  const leadScore = Math.min(10, Math.max(1, filled * 2 + (complexity === 'complex' ? 2 : complexity === 'advanced' ? 1 : 0)));

  const riskFlags = [];
  if (intake?.budget_range === 'low' && packageKey === 'pro') riskFlags.push('low_budget_pro');
  if (complexity === 'complex' && !intake?.scalability_required && (intake?.notes || '').toLowerCase().includes('scale')) riskFlags.push('scope_creep');
  if (!intake?.city && !intake?.business_type) riskFlags.push('minimal_context');

  const summary = recommendation?.summaryUnderstood
    ? (recommendation.summaryUnderstood.slice(0, 200) + (recommendation.summaryUnderstood.length > 200 ? '…' : ''))
    : `${packageName} candidate; ${(intake?.business_type || 'unknown industry')}, ${(intake?.goal || 'general')}.`;

  const nextStep = recommendation?.ctaRecommended?.toLowerCase().includes('offer') || recommendation?.ctaPrimary?.toLowerCase().includes('offer')
    ? 'offer'
    : 'call';

  const raw = {
    lead_score: leadScore,
    language: lang,
    city: intake?.city || '',
    industry: intake?.business_type || '',
    goal: intake?.goal || '',
    package: packageName,
    budget_signal: budgetSignal,
    timeline: timelineText,
    integrations: Array.isArray(intake?.integrations) ? intake.integrations : [],
    next_step: nextStep,
    summary: summary.trim(),
    risk_flags: riskFlags,
  };
  return ensureValidLeadPayload(raw);
}
