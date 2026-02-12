/**
 * Intake state: conservative updates. Only set when explicitly stated or logically certain.
 * Explicit negation ("no CRM") MUST remove from state. Never keep old integrations if user contradicts.
 * Reset state when user indicates "new test" or new full scenario.
 */

const REQUIRED = ['goal', 'website_type', 'timeline', 'budget_range'];

export function detectReset(msg) {
  if (!msg || typeof msg !== 'string') return false;
  const t = msg.toLowerCase().trim();
  return /\b(new\s+test|neuer\s*test|start\s+over|reset|new\s+project|neues\s*projekt|from\s+scratch|von\s+vorne)\b/.test(t);
}

function applyNegationsToIntake(msg, intake) {
  if (!msg || typeof msg !== 'string' || !intake.integrations) return;
  const t = msg.toLowerCase().trim();
  let list = [...(intake.integrations || [])];
  if (/\b(no|without|keine|ohne|nicht)\s*(booking|buchung|reservierung|termin)/.test(t) || /\b(booking|buchung|reservierung|termin)\s*(nicht|not\s*needed)/.test(t)) list = list.filter((x) => x !== 'booking');
  if (/\b(no|without|keine|ohne|nicht)\s*(payment|zahlung|stripe|paypal)/.test(t) || /\b(payment|zahlung)\s*(nicht|not\s*needed)/.test(t)) list = list.filter((x) => x !== 'payment');
  if (/\b(no|without|keine|ohne|nicht)\s*crm\b/.test(t) || /\bcrm\s*(nicht|not\s*needed)/.test(t)) list = list.filter((x) => x !== 'crm');
  if (/\b(no|without|keine|ohne|nicht)\s*(automation|automatisierung)/.test(t) || /\b(automation|automatisierung)\s*(nicht|not\s*needed)/.test(t)) list = list.filter((x) => x !== 'automation');
  if (/\b(no|without|keine|ohne|nicht)\s*(subscription|abonnement|recurring)/.test(t)) list = list.filter((x) => x !== 'subscription');
  intake.integrations = list;
}
const OPTIONAL = ['language', 'business_type', 'city', 'pages', 'content_ready', 'languages_needed', 'integrations', 'scalability_required', 'references', 'notes'];

const URL_REGEX = /https?:\/\/[^\s<>"{}|\\^`[\]]+/gi;

function emptyIntake() {
  return {
    language: null,
    business_type: null,
    city: null,
    goal: null,
    website_type: null,
    pages: null,
    content_ready: null,
    languages_needed: [],
    integrations: [],
    timeline: null,
    budget_range: null,
    scalability_required: null,
    references: [],
    notes: null,
  };
}

/** Reformulate for structured fields. Never paste raw text. */
function reformulate(field, raw) {
  if (raw == null || typeof raw !== 'string') return null;
  const v = raw.trim().replace(/\s+/g, ' ');
  if (!v) return null;
  if (field === 'business_type' || field === 'city') {
    const capped = v.replace(/\b\w/g, (c) => c.toUpperCase());
    return capped.length > 100 ? capped.slice(0, 97) + '…' : capped;
  }
  if (field === 'notes') return 'Client preferences and context noted.';
  return v.length > 200 ? v.slice(0, 197) + '…' : v;
}

// LANGUAGE AUTO-DETECTION: detect primary language from intake text. Dominant in mixed. Never mention detection. Default to en only when unclear.
function extractLanguage(text) {
  if (!text || !text.trim()) return null;
  const raw = text.trim();
  const t = raw.toLowerCase();
  // Explicit preference (optional boost, but we still run dominance below if mixed)
  const wantDe = /\b(deutsch|german|auf\s*deutsch|in\s*german)\b/.test(t) && !/\b(english|englisch|in\s*english)\b/.test(t);
  const wantEn = /\b(english|englisch|in\s*english)\b/.test(t);
  const wantRu = /\b(по-русски|на\s*русском|русский|russian)\b/.test(t);
  // Russian: Cyrillic script
  const cyrillicCount = (raw.match(/[\u0400-\u04FF]/g) || []).length;
  // German: umlauts, ß, common words
  const deMarkers = (t.match(/\b(und|ist|der|die|das|für|mit|sind|haben|nicht|auch|noch|schon|sehr|mehr|bei|von|zum|zur|werden|kann|wird|wir|sie|sich|bei|nach|bei|oder|aber|wenn|dass|können|wollen|sollen|müssen|werden|werden|wurde|wird|eine?r?|einen?|einem?|einer?)\b/g) || []).length;
  const deChars = (raw.match(/[äöüßÄÖÜ]/g) || []).length;
  const deScore = deMarkers + deChars * 2 + (wantDe ? 20 : 0);
  // English: common words
  const enMarkers = (t.match(/\b(the|and|is|are|for|with|have|has|can|will|need|want|would|should|from|this|that|we|they|you|our|your|about|which|when|what|how|need|want|like|into|some|such|been|being|were|where)\b/g) || []).length;
  const enScore = enMarkers + (wantEn ? 20 : 0);
  // Russian score
  const ruScore = cyrillicCount + (wantRu ? 20 : 0);
  if (ruScore > 0 && ruScore >= deScore && ruScore >= enScore) return 'ru';
  if (deScore > enScore && deScore >= ruScore) return 'de';
  if (enScore > 0 || deScore > 0 || ruScore > 0) return enScore >= deScore && enScore >= ruScore ? 'en' : (deScore >= ruScore ? 'de' : 'ru');
  return null; // unclear → caller will use 'en' when needed
}

function extractBusinessType(text) {
  if (!text || !text.trim()) return null;
  const t = text.trim();
  const m = t.match(/(?:we are|we're|branch|branche|industry|business:?)\s*[:\-]?\s*([^.?!\n]{3,120})/i) || t.match(/(?:handwerk|beratung|gastronomie|healthcare|e-commerce|consulting|hospitality)/i);
  if (m) return reformulate('business_type', (m[1] || m[0]).trim());
  return null;
}

function extractCity(text) {
  if (!text || !text.trim()) return null;
  const t = text.trim();
  const match = t.match(/(?:in|from|stadt|city|located in|based in)\s+([A-Za-zäöüßÄÖÜ\s\-]+?)(?:\s*,|\s+[A-Z]{2}\b|\.|$)/i) || t.match(/^([A-Za-zäöüßÄÖÜ\s\-]+?)(?:\s*,|\s+Germany|\s+Deutschland)/i);
  const raw = match ? match[1].trim() : (/^[A-Za-zäöüßÄÖÜ\s\-]{2,60}$/.test(t) ? t : null);
  return raw ? reformulate('city', raw) : null;
}

function extractGoal(text) {
  if (!text) return null;
  const t = text.toLowerCase();
  if (/\b(leads|lead\s*generation|anfragen\s*generieren)\b/.test(t)) return 'leads';
  if (/\b(booking|buchung|reservierung|terminbuchung|appointment\s*booking|scheduling|terminplanung)\b/.test(t)) return 'booking';
  if (/\b(sales|verkauf|e-commerce|online\s*shop)\b/.test(t)) return 'sales';
  if (/\b(brand|marke|präsenz|presence|visibility)\b/.test(t)) return 'branding';
  return null;
}

function extractWebsiteType(text) {
  if (!text) return null;
  const t = text.toLowerCase();
  if (/\b(landing|one\s*page|1\s*page|eine\s*seite)\b/.test(t)) return 'landing';
  if (/\b(8[-–]10\s*pages?|10[-–]page|multi[- ]?page|mehrseitig|several\s*pages|5[-–]8|list\s+of\s+pages|seitenliste)\b/.test(t)) return 'multi-page';
  if (/\b(e-commerce|online\s*store|shop)\b/.test(t)) return 'e-commerce';
  return null;
}

function extractPages(text) {
  if (!text) return null;
  const m = text.match(/(\d+)\s*[-–]\s*(\d+)\s*(?:pages?|seiten?)/i) || text.match(/(\d+)\s*(?:pages?|seiten?)/i);
  if (m) return m[2] ? `${m[1]}-${m[2]}` : m[1];
  if (/\b(one|1)\s*page/.test(text.toLowerCase())) return '1';
  return null;
}

function extractContentReady(text) {
  if (!text) return null;
  const t = text.toLowerCase();
  if (/\b(ja|yes|vorhanden|ready)\b/.test(t) && !/\b(teilweise|partly|no|nein)\b/.test(t)) return true;
  if (/\b(nein|no|brauche|need support)\b/.test(t)) return false;
  if (/\b(teilweise|partly)\b/.test(t)) return false;
  return null;
}

function extractLanguagesNeeded(text) {
  const t = (text || '').toLowerCase();
  if (/\b(zweisprachig|bilingual|two\s*languages|zwei\s*sprachen|deutsch\s*und\s*englisch|german\s*and\s*english)\b/.test(t)) return ['de', 'en'];
  if (/\b(nur\s*deutsch|only\s*german|auf\s*deutsch|in\s*german)\b/.test(t)) return ['de'];
  if (/\b(nur\s*englisch|only\s*english|in\s*english|auf\s*englisch)\b/.test(t)) return ['en'];
  return [];
}

// ONLY if explicitly mentioned. Never infer. If user says "no booking/CRM/automation/payments" => do NOT add.
function extractIntegrations(text) {
  const out = [];
  const t = (text || '').toLowerCase();
  const noBooking = /\b(no|without|keine|ohne|nicht)\s*(booking|buchung|reservierung|termin)/.test(t) || /\b(booking|buchung|reservierung|termin)\s*(nicht|not\s*needed)/.test(t);
  const noPayment = /\b(no|without|keine|ohne|nicht)\s*(payment|zahlung|stripe|paypal)/.test(t) || /\b(payment|zahlung)\s*(nicht|not\s*needed)/.test(t);
  const noCrm = /\b(no|without|keine|ohne|nicht)\s*crm\b/.test(t) || /\bcrm\s*(nicht|not\s*needed)/.test(t);
  const noAutomation = /\b(no|without|keine|ohne|nicht)\s*(automation|automatisierung)/.test(t) || /\b(automation|automatisierung)\s*(nicht|not\s*needed)/.test(t);
  if (!noBooking && /\b(booking\s*system|buchungssystem|buchung|terminbuchung|reservierung|appointment\s*booking|terminplanung)\b/.test(t)) out.push('booking');
  if (!noPayment && /\b(stripe|online\s*payment|payment\s*gateway|zahlungsgateway|zahlung|paypal)\b/.test(t)) out.push('payment');
  if (!noCrm && /\b(crm|hubspot|pipedrive|salesforce)\b/.test(t)) out.push('crm');
  if (!noAutomation && /\b(automation|e-mail\s*automation|e-mail-automatisierung|mailchimp)\b/.test(t)) out.push('automation');
  const noSubscription = /\b(no|without|keine|ohne|nicht)\s*(subscription|abonnement|recurring)\b/.test(t);
  if (!noSubscription && /\b(subscription|abonnement|recurring\s*payment|wiederkehrende\s*zahlung|abo)\b/.test(t)) out.push('subscription');
  return [...new Set(out)];
}

// STRICT TIMELINE PRESERVATION: output exactly as written. Do not convert to ranges (e.g. "3 weeks" stays "3 weeks", not "2–4 weeks").
function extractTimeline(text) {
  if (!text) return null;
  const t = text.toLowerCase().replace(/\s+/g, ' ');
  // ASAP / flexible
  if (/\b(asap|so\s*schnell|as\s*soon\s*as|schnell\s*wie\s*möglich|möglichst\s*schnell|so\s*bald\s*wie)\b/.test(t)) return 'asap';
  if (/\b(flexible|flexibel|keine\s*eile|no\s*rush|unverbindlich)\b/.test(t)) return 'flexible';
  // Explicit ranges only when user says the range (2–4 weeks, 1–2 months)
  if (/\b(2-4|2–4|2\s*-\s*4)\s*(weeks?|wochen?)\b/.test(t)) return '2-4-weeks';
  if (/\b(1-2|1–2|1\s*-\s*2)\s*(months?|monate?)\b/.test(t)) return '1-2-months';
  // Exact range e.g. "2-3 weeks", "2–3 wochen" → preserve exactly
  const rangeWeeks = t.match(/\b(2\s*[-–]\s*3|3\s*[-–]\s*4|4\s*[-–]\s*5|5\s*[-–]\s*6)\s*(weeks?|wochen?)\b/);
  if (rangeWeeks) {
    const r = rangeWeeks[1].replace(/\s/g, '');
    return r.replace(/–/g, '-') + '-weeks'; // "2-3-weeks", "3-4-weeks"
  }
  // Single number + weeks → exact value (3 weeks → 3-weeks, 6 weeks → 6-weeks). Do not convert.
  const weeksMatch = t.match(/\b(?:in|bis|within|zeitrahmen|launch|frist|deadline|termine?|dauer|duration)?\s*(\d+)\s*(?:weeks?|wochen?)\b/);
  if (weeksMatch) return weeksMatch[1] + '-weeks'; // "2-weeks", "3-weeks", "6-weeks"
  // Single number + months → exact value (1 month → 1-month, 2 months → 2-months)
  const monthsMatch = t.match(/\b(?:in\s+)?(einem?|einer?|einen?|\d+)\s*(?:months?|monate?)\b/);
  if (monthsMatch) {
    const w = monthsMatch[1];
    const n = w === 'ein' || w === 'einen' || w === 'einem' || w === 'einer' ? 1 : parseInt(w, 10);
    return n + '-months';
  }
  if (/\b(1\s*month|1\s*monat|ein\s*monat)\b/.test(t)) return '1-months';
  if (/\b(2\s*months?|2\s*monate?|zwei\s*monate?)\b/.test(t)) return '2-months';
  // Russian: preserve exact (2 недели → 2-weeks, 3 недели → 3-weeks)
  const weeksRu = t.match(/(\d+)\s*недел/);
  if (weeksRu) return weeksRu[1] + '-weeks';
  const monthsRu = t.match(/(\d+)\s*месяц/);
  if (monthsRu) return monthsRu[1] + '-months';
  if (/\b(два|2)\s*месяц/.test(t)) return '2-months';
  if (/\b(один|1)\s*месяц/.test(t)) return '1-months';
  return null;
}

function extractBudgetRange(text) {
  if (!text) return null;
  const t = text.toLowerCase();
  if (/\b(bis 2\.?000|up to €2|low budget|günstig|cheap|kleines budget)\b/.test(t)) return 'low';
  if (/\b(2\.?000\s*[-–]\s*4\.?000|4\.?000\s*[-–]\s*8\.?000|mid|mittel)\b/.test(t)) return 'mid';
  if (/\b(über 8|over €8|high)\b/.test(t)) return 'high';
  return null;
}

function extractScalabilityRequired(text) {
  if (!text) return null;
  const t = text.toLowerCase();
  if (/\b(scalability|scalable|skalierbar|skalierung|platform-level|platform\s*level)\b/.test(t)) return true;
  return null;
}

function extractReferences(text) {
  const urls = text.match(URL_REGEX);
  return urls ? [...new Set(urls)] : [];
}

function extractNotes(text) {
  if (!text || !text.trim()) return null;
  return 'Client preferences and context noted.';
}

/**
 * @param {string} userMessage - Raw user message
 * @param {object} currentIntake - Existing intake (state) to merge into; kept across turns unless reset
 * @returns {{ intake: object, missing_required: string[], missing_optional: string[] }}
 */
export function extractIntake(userMessage, currentIntake = null) {
  const msg = (userMessage || '').trim();
  let intake;

  if (!msg) {
    intake = currentIntake ? { ...emptyIntake(), ...currentIntake } : emptyIntake();
    const missing_required = REQUIRED.filter((k) => intake[k] == null || (Array.isArray(intake[k]) && intake[k].length === 0));
    const missing_optional = OPTIONAL.filter((k) => intake[k] == null || (Array.isArray(intake[k]) && intake[k].length === 0));
    return { intake, missing_required, missing_optional };
  }

  if (detectReset(msg)) {
    intake = emptyIntake();
  } else {
    intake = currentIntake ? { ...emptyIntake(), ...currentIntake } : emptyIntake();
  }

  const lang = extractLanguage(msg);
  if (lang != null) intake.language = lang;

  const business_type = extractBusinessType(msg);
  if (business_type != null) intake.business_type = business_type;

  const city = extractCity(msg);
  if (city != null) intake.city = city;

  const goal = extractGoal(msg);
  if (goal != null) intake.goal = goal;

  const website_type = extractWebsiteType(msg);
  if (website_type != null) intake.website_type = website_type;

  const pages = extractPages(msg);
  if (pages != null) intake.pages = pages;

  const content_ready = extractContentReady(msg);
  if (content_ready != null) intake.content_ready = content_ready;

  const languages_needed = extractLanguagesNeeded(msg);
  if (languages_needed.length > 0) {
    const existing = intake.languages_needed || [];
    intake.languages_needed = [...new Set([...existing, ...languages_needed])];
  }

  const integrations = extractIntegrations(msg);
  if (integrations.length) {
    const existing = intake.integrations || [];
    intake.integrations = [...new Set([...existing, ...integrations])];
  }

  applyNegationsToIntake(msg, intake);

  const timeline = extractTimeline(msg);
  if (timeline != null) intake.timeline = timeline;

  const budget_range = extractBudgetRange(msg);
  if (budget_range != null) intake.budget_range = budget_range;

  const scalability_required = extractScalabilityRequired(msg);
  if (scalability_required === true) intake.scalability_required = true;

  const references = extractReferences(msg);
  if (references.length) intake.references = references;

  const notes = extractNotes(msg);
  if (notes != null) intake.notes = notes;

  const missing_required = REQUIRED.filter((k) => {
    const v = intake[k];
    return v == null || v === '' || (Array.isArray(v) && v.length === 0);
  });
  const missing_optional = OPTIONAL.filter((k) => {
    const v = intake[k];
    return v == null || (Array.isArray(v) && v.length === 0);
  });

  return { intake, missing_required, missing_optional };
}

/**
 * Same as extractIntake but returns a valid JSON string only (no explanations).
 * @param {string} userMessage
 * @param {object} currentIntake
 * @returns {string} JSON: { intake, missing_required, missing_optional }
 */
export function extractIntakeJSON(userMessage, currentIntake = null) {
  const result = extractIntake(userMessage, currentIntake);
  return JSON.stringify(result);
}

/**
 * Maps consultation flow answers (object keyed by question id) to intake schema.
 * @param {object} answers - e.g. { industry, location, goal, type, content, languages, integrations, timeline, budget, references }
 * @param {object} currentIntake - optional existing intake
 */
export function answersToIntake(answers, currentIntake = null) {
  const intake = currentIntake ? { ...emptyIntake(), ...currentIntake } : emptyIntake();
  if (!answers || typeof answers !== 'object') {
    const missing_required = REQUIRED.filter((k) => intake[k] == null || (Array.isArray(intake[k]) && intake[k].length === 0));
    const missing_optional = OPTIONAL.filter((k) => intake[k] == null || (Array.isArray(intake[k]) && intake[k].length === 0));
    return { intake, missing_required, missing_optional };
  }

  if (answers.industry != null && answers.industry !== '') intake.business_type = reformulate('business_type', String(answers.industry));
  if (answers.location != null && answers.location !== '') intake.city = reformulate('city', String(answers.location));
  const g = (answers.goal || '').toLowerCase();
  if (g.includes('lead')) intake.goal = 'leads';
  else if (g.includes('buchung') || g.includes('booking') || g.includes('reserv')) intake.goal = 'booking';
  else if (g.includes('verkauf') || g.includes('sales') || g.includes('e-commerce')) intake.goal = 'sales';
  else if (g.includes('marke') || g.includes('brand') || g.includes('präsenz')) intake.goal = 'branding';

  const wt = (answers.type || '').toLowerCase();
  if (wt.includes('landing') || wt.includes('1 seite') || wt.includes('1 page')) intake.website_type = 'landing';
  else if (wt.includes('mehrseitig') || wt.includes('multi') || wt.includes('5')) intake.website_type = 'multi-page';
  else if (wt.includes('e-commerce') || wt.includes('shop')) intake.website_type = 'e-commerce';
  else if (wt.includes('buchung') || wt.includes('booking') || wt.includes('termine')) intake.website_type = 'multi-page';

  if (answers.type && /(\d+)\s*[-–]\s*(\d+)/.test(answers.type)) intake.pages = answers.type.match(/(\d+)\s*[-–]\s*(\d+)/).slice(1).join('-');
  else if (answers.type && /\d+/.test(answers.type)) intake.pages = answers.type.match(/\d+/)?.[0] || null;

  const c = (answers.content || '').toLowerCase();
  if (c.includes('ja') || c.includes('yes') || c.includes('vorhanden') || c.includes('ready')) intake.content_ready = true;
  else if (c.includes('nein') || c.includes('no') || c.includes('unterstützung') || c.includes('teilweise')) intake.content_ready = false;

  const ln = (answers.languages || '').toLowerCase();
  intake.languages_needed = [];
  if (ln.includes('zwei') || ln.includes('two') || ln.includes('drei') || ln.includes('three')) intake.languages_needed = ['de', 'en'];

  const ints = (answers.integrations || '').toLowerCase();
  intake.integrations = [];
  if (ints.includes('buchung') || ints.includes('booking')) intake.integrations.push('booking');
  if (ints.includes('zahlung') || ints.includes('payment')) intake.integrations.push('payment');
  if (ints.includes('crm')) intake.integrations.push('crm');
  if (ints.includes('automatisierung') || ints.includes('automation')) intake.integrations.push('automation');

  const tl = (answers.timeline || '').toLowerCase();
  if (tl.includes('schnell') || tl.includes('asap')) intake.timeline = 'asap';
  else if (tl.includes('2-4') || tl.includes('2–4')) intake.timeline = '2-4-weeks';
  else if (tl.includes('1-2') || tl.includes('1–2')) intake.timeline = '1-2-months';
  else if (tl.includes('flexibel') || tl.includes('flexible')) intake.timeline = 'flexible';
  else if (tl.includes('2') && tl.includes('wochen')) intake.timeline = '2-weeks';
  else if (answers.timeline) intake.timeline = '2-weeks';

  const bud = (answers.budget || '').toLowerCase();
  if (bud.includes('bis 2') || bud.includes('up to')) intake.budget_range = 'low';
  else if (bud.includes('2.000') || bud.includes('4.000') || bud.includes('2,000')) intake.budget_range = 'mid';
  else if (bud.includes('über') || bud.includes('over')) intake.budget_range = 'high';

  if (answers.references && typeof answers.references === 'string') {
    const urls = answers.references.match(URL_REGEX);
    intake.references = urls ? [...new Set(urls)] : [];
    if (!urls && answers.references.trim()) intake.notes = reformulate('notes', answers.references);
  }

  const missing_required = REQUIRED.filter((k) => {
    const v = intake[k];
    return v == null || v === '' || (Array.isArray(v) && v.length === 0);
  });
  const missing_optional = OPTIONAL.filter((k) => {
    const v = intake[k];
    return v == null || (Array.isArray(v) && v.length === 0);
  });

  return { intake, missing_required, missing_optional };
}
