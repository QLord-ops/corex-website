import { useState, useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { consultationCopy, getRecommendedPackage, reformulateForBrief } from '@/data/consultationCopy';
import { extractIntake } from '@/data/intakeExtractor';
import { getConsultantResponse, getConsultantResponseAIFormat, getLeadPayloadForWebhook, getTimelineText } from '@/data/salesConsultant';
import { apiPost, apiPostWithResponse } from '@/lib/api';
import { ArrowLeft, FileText, Send, Calendar, Loader2 } from 'lucide-react';

// Critical first: goal → website_type (and pages) → budget_range → timeline; then language, business_type, city; then optional.
const STEP_FIELDS = [
  'goal',
  'website_type',
  'budget_range',
  'timeline',
  'language',
  'business_type',
  'city',
  'content_ready',
  'languages_needed',
  'integrations',
  'references',
];

const FIELD_TO_QUESTION_ID = {
  goal: 'goal',
  website_type: 'type',
  pages: 'type',
  budget_range: 'budget',
  timeline: 'timeline',
  business_type: 'industry',
  city: 'location',
  content_ready: 'content',
  languages_needed: 'languages',
  integrations: 'integrations',
  references: 'references',
};

// Required for consultant to decide; AI completes intake (no step count).
const REQUIRED_FOR_RESULT = ['goal', 'website_type', 'timeline', 'budget_range'];

function getMissingRequired(intake) {
  return REQUIRED_FOR_RESULT.filter((k) => {
    const v = intake[k];
    if (v == null || v === '') return true;
    if (Array.isArray(v) && v.length === 0) return true;
    return false;
  });
}

// AI format: mode drives UI. result = show result screen; wizard = show single next_question (free-text).
// No step index after Analyze — mode controlled exclusively by ai.mode.

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

function isFieldEmpty(intake, field) {
  const v = intake[field];
  if (v == null) return true;
  if (Array.isArray(v)) return v.length === 0;
  if (typeof v === 'string') return v.trim() === '';
  return false;
}

function getNextMissingStepIndex(intake) {
  for (let i = 0; i < STEP_FIELDS.length; i++) {
    const field = STEP_FIELDS[i];
    if (field === 'website_type') {
      if (isFieldEmpty(intake, 'website_type') || isFieldEmpty(intake, 'pages')) return i;
    } else if (isFieldEmpty(intake, field)) {
      return i;
    }
  }
  return null;
}

function isIntakeComplete(intake) {
  return getNextMissingStepIndex(intake) === null;
}

export function ConsultationFlow() {
  const [intake, setIntake] = useState(emptyIntake);
  const [screen, setScreen] = useState('describe');
  const [mode, setMode] = useState('wizard'); // "wizard" | "result" — default wizard; after Analyze, set from ai.mode only
  const [aiResponse, setAiResponse] = useState(null); // AI JSON: { mode, understood, complexity, recommendation_bullets, package, investment_from_eur, timeline, cta, missing_required, next_question }
  const [aiMode, setAiMode] = useState(false);
  const [missingRequired, setMissingRequired] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const [wizardAnswer, setWizardAnswer] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [extractError, setExtractError] = useState(null);
  const [stepTextValue, setStepTextValue] = useState('');
  const [lastAnalyzedMessage, setLastAnalyzedMessage] = useState('');
  const [proposalText, setProposalText] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [proposalFetched, setProposalFetched] = useState(false);
  const leadSentRef = useRef(false);

  const lang = intake.language || 'en';
  const t = consultationCopy[lang] || consultationCopy.en;

  const stepIndex = typeof screen === 'number' ? screen : null;
  const currentField = stepIndex != null ? STEP_FIELDS[stepIndex] : null;
  const questionId = currentField === 'language' ? null : FIELD_TO_QUESTION_ID[currentField];
  const currentQuestion = questionId ? t.questions?.find((q) => q.id === questionId) : null;

  const applyAIResult = (nextIntake, missing_required) => {
    const ai = getConsultantResponseAIFormat(nextIntake, missing_required);
    setAiResponse(ai);
    setMode('result');
    setIntake(nextIntake);
    setMissingRequired(ai.missing_required || []);
    setAiMode(true);
    setProposalText(null);
    setProposalFetched(false);
    setChatMessages([]);
    setChatInput('');
    setScreen('result');
  };

  const handleAnalyze = () => {
    const msg = userMessage.trim();
    if (!msg) return;
    setLastAnalyzedMessage(msg);
    setAnalyzing(true);
    setExtractError(null);
    apiPost('/extract', { currentIntake: intake, userMessage: msg })
      .then(({ intake: nextIntake, missing_required }) => applyAIResult(nextIntake, missing_required))
      .catch(() => {
        const { intake: nextIntake, missing_required } = extractIntake(msg, intake);
        applyAIResult(nextIntake, missing_required);
        setExtractError(null);
      })
      .finally(() => setAnalyzing(false));
  };

  const setIntakeField = (field, value) => {
    setIntake((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'website_type') {
        if (value === 'landing') next.pages = '1';
        else if (value === 'multi-page') next.pages = '5-8';
        else if (value === 'e-commerce') next.pages = '10';
      }
      return next;
    });
  };

  // Wizard step advance: never gated by aiMode. Use nextIntake when provided to avoid stale state.
  const goToNextOrResult = (nextIntake) => {
    const intakeForStep = nextIntake !== undefined && nextIntake !== null ? nextIntake : intake;
    const next = getNextMissingStepIndex(intakeForStep);
    setScreen(next !== null ? next : 'result');
  };

  // Map display value to intake value (shared for step and AI question).
  const applyFieldValue = (prev, field, value) => {
    const next = { ...prev };
    if (field === 'language') next.language = value;
    else if (field === 'goal') {
      const map = { 'Leads generieren': 'leads', 'Generate leads': 'leads', 'Buchungen / Reservierungen': 'booking', 'Bookings / reservations': 'booking', 'Verkauf (E-Commerce)': 'sales', 'Sales (e-commerce)': 'sales', 'Markenauftritt / Präsenz': 'branding', 'Brand presence': 'branding' };
      next.goal = map[value] || value;
    } else if (field === 'website_type' || field === 'pages') {
      const map = { 'Landing (1 Seite)': 'landing', 'Landing (1 page)': 'landing', 'Mehrseitig (5–8 Seiten)': 'multi-page', 'Multi-page (5–8 pages)': 'multi-page', 'E-Commerce / Shop': 'e-commerce', 'E-commerce / shop': 'e-commerce', 'Buchungssystem / Termine': 'multi-page', 'Booking system / appointments': 'multi-page' };
      const v = map[value] || value;
      next.website_type = v;
      next.pages = v === 'landing' ? '1' : v === 'multi-page' ? '5-8' : v === 'e-commerce' ? '10' : next.pages;
    } else if (field === 'content_ready') {
      const map = { 'Ja, alles vorhanden': true, 'Yes, all ready': true, 'Teilweise (Logo oder Texte)': false, 'Partly (logo or copy)': false, 'Nein, brauche Unterstützung': false, 'No, need support': false };
      next.content_ready = map[value] ?? value;
    } else if (field === 'languages_needed') {
      const map = { 'Nein, eine Sprache': [], 'No, one language': [], 'Ja, zwei Sprachen': ['de', 'en'], 'Yes, two languages': ['de', 'en'], 'Ja, drei oder mehr': ['de', 'en'], 'Yes, three or more': ['de', 'en'] };
      next.languages_needed = map[value] ?? ['de', 'en'];
    } else if (field === 'integrations') {
      const map = { 'Keine / nur Kontaktformular': [], 'None / contact form only': [], 'CRM (z.B. HubSpot, Pipedrive)': ['crm'], 'CRM (e.g. HubSpot, Pipedrive)': ['crm'], 'Buchungssystem': ['booking'], 'Booking system': ['booking'], 'Zahlung (Stripe, PayPal)': ['payment'], 'Payment (Stripe, PayPal)': ['payment'], 'E-Mail-Automatisierung': ['automation'], 'Email automation': ['automation'], 'Mehrere davon': ['crm', 'booking', 'payment', 'automation'], 'Several of these': ['crm', 'booking', 'payment', 'automation'] };
      next.integrations = map[value] ?? [];
    } else if (field === 'timeline') {
      const map = { 'So schnell wie möglich': 'asap', 'As soon as possible': 'asap', '2–4 Wochen': '2-4-weeks', '2–4 weeks': '2-4-weeks', '1–2 Monate': '1-2-months', '1–2 months': '1-2-months', 'Flexibel': 'flexible', 'Flexible': 'flexible' };
      next.timeline = map[value] || value;
    } else if (field === 'budget_range') {
      const map = { 'Bis 2.000 €': 'low', 'Up to €2,000': 'low', '2.000 – 4.000 €': 'mid', '€2,000 – €4,000': 'mid', '4.000 – 8.000 €': 'mid', '€4,000 – €8,000': 'mid', 'Über 8.000 €': 'high', 'Over €8,000': 'high' };
      next.budget_range = map[value] || value;
    } else if (field === 'business_type') next.business_type = value;
    else if (field === 'city') next.city = value;
    else if (field === 'references') {
      next.references = value ? [value] : [];
      next.notes = value ? 'Client preferences noted.' : null;
    }
    return next;
  };

  const handleWizardSubmit = () => {
    const text = wizardAnswer.trim();
    if (!text) return;
    const { intake: mergedIntake, missing_required: nextMissing } = extractIntake(text, intake);
    const ai = getConsultantResponseAIFormat(mergedIntake, nextMissing);
    setAiResponse(ai);
    setMode(ai.mode);
    setIntake(mergedIntake);
    setMissingRequired(ai.missing_required || []);
    setWizardAnswer('');
    if (ai.mode === 'result') {
      setScreen('result');
    } else {
      setScreen('ai-question');
    }
    console.log('AI MODE:', ai.mode, ai.missing_required, ai.timeline);
  };

  const handleStepAnswer = (value) => {
    if (!currentField) return;
    const newIntake = applyFieldValue(intake, currentField, value);
    console.log('NEXT CLICK', { step: stepIndex, currentField, value });
    console.log('NEXT STATE BEFORE', intake);
    console.log('NEXT STATE AFTER', newIntake);
    setIntake(newIntake);
    goToNextOrResult(newIntake);
  };

  const answersFromIntake = useMemo(() => ({
    industry: intake.business_type,
    location: intake.city,
    goal: intake.goal,
    type: intake.website_type,
    content: intake.content_ready === true ? (lang === 'de' ? 'Ja, alles vorhanden' : 'Yes, all ready') : intake.content_ready === false ? (lang === 'de' ? 'Nein, brauche Unterstützung' : 'No, need support') : '',
    languages: intake.languages_needed?.length >= 2 ? (lang === 'de' ? 'Ja, zwei Sprachen' : 'Yes, two languages') : lang === 'de' ? 'Nein, eine Sprache' : 'No, one language',
    integrations: Array.isArray(intake.integrations) && intake.integrations.length ? intake.integrations.join(', ') : lang === 'de' ? 'Keine / nur Kontaktformular' : 'None / contact form only',
    timeline: intake.timeline,
    budget: intake.budget_range,
    references: intake.notes || (Array.isArray(intake.references) ? intake.references.join(' ') : ''),
  }), [intake, lang]);

  const consultantRecommendation = screen === 'result' ? getConsultantResponse(intake, []) : null;
  const recommendationForLead = consultantRecommendation;
  const showingFinalRecommendation = screen === 'result' && (aiResponse?.mode === 'result' || consultantRecommendation);

  // Sync step text field when moving to a new question (so Next button has correct value and input is controlled).
  useEffect(() => {
    if (currentField === 'business_type') setStepTextValue(intake.business_type || '');
    else if (currentField === 'city') setStepTextValue(intake.city || '');
    else if (currentField === 'references') setStepTextValue(intake.notes || (intake.references?.[0]) || '');
    else setStepTextValue('');
  }, [currentField, intake.business_type, intake.city, intake.notes, intake.references]);

  useEffect(() => {
    if (!showingFinalRecommendation || !recommendationForLead || leadSentRef.current) return;
    leadSentRef.current = true;
    const payload = getLeadPayloadForWebhook(intake, recommendationForLead);
    apiPost('/lead', payload).catch(() => {});
  }, [showingFinalRecommendation, recommendationForLead, intake]);

  // Fetch AI-generated proposal when on result screen (once per result).
  useEffect(() => {
    if (screen !== 'result' || !intake || proposalFetched) return;
    setProposalFetched(true);
    const lang = intake.language || 'en';
    apiPost('/project-check/proposal', { intake, language: lang })
      .then(({ proposalText: text }) => { if (text) setProposalText(text); })
      .catch(() => setProposalFetched(true));
  }, [screen, intake, proposalFetched]);

  const packageKey = consultantRecommendation?.type === 'recommendation' ? consultantRecommendation.package : (aiResponse?.package ? aiResponse.package.toLowerCase() : null);
  const pkg = packageKey && t.packages?.[packageKey];
  const strategicBullets = aiResponse?.mode === 'result' && aiResponse?.recommendation_bullets?.length ? aiResponse.recommendation_bullets : (consultantRecommendation?.strategicBullets || []);
  const justification = consultantRecommendation?.type === 'recommendation' ? consultantRecommendation.justification : null;
  const estimatedInvestment = aiResponse?.mode === 'result' && aiResponse?.investment_from_eur != null ? `from ${aiResponse.investment_from_eur.toLocaleString('de-DE')} €` : (consultantRecommendation?.estimatedInvestment ?? pkg?.from);
  const estimatedTimeline = aiResponse?.mode === 'result' && aiResponse?.timeline != null ? aiResponse.timeline : (consultantRecommendation?.estimatedTimeline ?? t.timelineStandard);
  const ctaPrimary = consultantRecommendation?.nextStepSingleCta ?? consultantRecommendation?.ctaPrimary ?? t.cta1;
  const ctaSecondary = consultantRecommendation?.ctaSecondary ?? t.cta2;

  const labels = t.briefLabels || {};
  const overview = [reformulateForBrief('industry', intake.business_type, lang), reformulateForBrief('location', intake.city, lang)].filter((x) => x !== '–').join(' · ') || '–';
  const briefRows = [
    [labels.overview, overview],
    [labels.goal, intake.goal || '–'],
    [labels.audience, intake.business_type ? `B2B/B2C · ${reformulateForBrief('industry', intake.business_type, lang)}` : '–'],
    [labels.structure, intake.website_type || '–'],
    [labels.content, intake.content_ready != null ? (intake.content_ready ? (lang === 'de' ? 'Ja' : 'Yes') : (lang === 'de' ? 'Nein' : 'No')) : '–'],
    [labels.languages, intake.languages_needed?.length ? intake.languages_needed.join(', ') : '–'],
    [labels.integrations, Array.isArray(intake.integrations) && intake.integrations.length ? intake.integrations.join(', ') : '–'],
    [labels.timeline, (intake.timeline && getTimelineText(intake.timeline, lang)) || t.timelineStandard],
    [labels.references, reformulateForBrief('references', intake.notes, lang)],
  ];

  if (screen === 'describe') {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="border-b border-border/50">
          <div className="max-w-xl mx-auto px-4 py-4">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> AIONEX
            </Link>
          </div>
        </header>
        <main className="flex-1 max-w-xl mx-auto w-full px-4 py-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex gap-2 mb-2">
              <Button size="sm" variant="outline" onClick={() => { setIntakeField('language', 'de'); setUserMessage(''); }}>DE</Button>
              <Button size="sm" variant="outline" onClick={() => { setIntakeField('language', 'en'); setUserMessage(''); }}>EN</Button>
            </div>
            <h1 className="text-xl font-semibold text-foreground">{t.describeTitle}</h1>
            <p className="text-sm text-muted-foreground">Paste a full project description or answer step by step. We will extract what we can and ask only for what is missing.</p>
            <Textarea
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              placeholder={t.describePlaceholder}
              rows={6}
              className="resize-none"
            />
            {extractError && <p className="text-sm text-destructive">{extractError}</p>}
            <Button onClick={handleAnalyze} disabled={analyzing || !userMessage.trim()}>
              {analyzing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {t.analyzeButton}
            </Button>
            <p className="text-sm text-muted-foreground">
              <button type="button" className="underline hover:text-foreground" onClick={() => { setScreen(0); setAiMode(false); }}>
                {lang === 'de' ? 'Oder Schritt für Schritt antworten' : 'Or answer step by step'}
              </button>
            </p>
          </motion.div>
        </main>
      </div>
    );
  }

  // AI mode="wizard": single question only, free-text answer. No step components. Mode controlled exclusively by ai.mode.
  if (screen === 'ai-question' && mode === 'wizard' && aiResponse) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="border-b border-border/50">
          <div className="max-w-xl mx-auto px-4 py-4 flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => setScreen('describe')}>
              <ArrowLeft className="w-4 h-4 mr-1" />
              {t.back}
            </Button>
          </div>
        </header>
        <main className="flex-1 max-w-xl mx-auto w-full px-4 py-8 space-y-8 pb-12">
          {aiResponse.understood && (
            <div>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                {t.outputWhatUnderstood ?? 'What I understood'}
              </h2>
              <p className="text-sm text-foreground leading-relaxed">{aiResponse.understood}</p>
            </div>
          )}
          {aiResponse.complexity && (
            <div>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                {t.outputComplexity ?? 'Project complexity'}
              </h2>
              <p className="text-sm font-medium text-foreground">{aiResponse.complexity}</p>
            </div>
          )}
          <div className="border-t border-border/50 pt-6 space-y-4">
            <h2 className="text-lg font-medium text-foreground">
              {aiResponse.next_question || t.questions?.[0]?.label}
            </h2>
            <Textarea
              value={wizardAnswer}
              onChange={(e) => setWizardAnswer(e.target.value)}
              placeholder={t.describePlaceholder}
              rows={4}
              className="resize-none"
            />
            <Button onClick={handleWizardSubmit} disabled={!wizardAnswer.trim()}>
              {t.next}
            </Button>
          </div>
        </main>
      </div>
    );
  }

  if (screen === 'result') {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="border-b border-border/50">
          <div className="max-w-xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> AIONEX
            </Link>
          </div>
        </header>
        <main className="flex-1 max-w-xl mx-auto w-full px-4 py-8 space-y-8 pb-12">
          {(lastAnalyzedMessage || userMessage).trim() && (
            <div>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                {t.yourDescription ?? 'Your description'}
              </h2>
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{(lastAnalyzedMessage || userMessage).trim()}</p>
            </div>
          )}
          {(aiResponse?.understood || consultantRecommendation?.summaryUnderstood) && (
            <div>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                {t.outputWhatUnderstood ?? 'What I understood'}
              </h2>
              <p className="text-sm text-foreground leading-relaxed">{aiResponse?.mode === 'result' ? aiResponse.understood : consultantRecommendation?.summaryUnderstood}</p>
            </div>
          )}
          {consultantRecommendation?.assumptions && consultantRecommendation.assumptions.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                {consultantRecommendation.language === 'de' ? 'Annahmen' : 'Assumptions'}
              </h2>
              <ul className="list-none space-y-1">
                {consultantRecommendation.assumptions.map((a, i) => (
                  <li key={i} className="text-sm text-foreground flex gap-2">
                    <span className="text-primary shrink-0">•</span>
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {(aiResponse?.complexity || consultantRecommendation?.complexityLabel) && (
            <div>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                {t.outputComplexity ?? 'Project complexity'}
              </h2>
              <p className="text-sm font-medium text-foreground">{aiResponse?.mode === 'result' ? aiResponse.complexity : consultantRecommendation?.complexityLabel}</p>
            </div>
          )}
          <div>
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2 mb-2">
              <FileText className="w-5 h-5" />
              {t.briefTitle}
            </h2>
            <div className="rounded-lg border border-border/50 bg-muted/20 overflow-hidden">
              {briefRows.map(([label, value], i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-baseline gap-1 px-4 py-3 border-b border-border/30 last:border-0">
                  <span className="text-xs font-medium text-muted-foreground sm:w-40 shrink-0">{label}</span>
                  <span className="text-sm text-foreground">{value}</span>
                </div>
              ))}
            </div>
          </div>
          {strategicBullets.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">{t.reasoningTitle}</h2>
              <p className="text-sm text-muted-foreground mb-4">{t.reasoningIntro}</p>
              <ul className="space-y-2 list-none">
                {strategicBullets.map((bullet, i) => (
                  <li key={i} className="flex gap-2 text-sm text-foreground">
                    <span className="text-primary shrink-0">•</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-3">{t.commercialTitle}</h2>
            <div className="rounded-lg border border-border/50 bg-muted/20 p-4 space-y-2">
              {proposalText ? (
                <>
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{proposalText}</p>
                  <p className="text-sm text-muted-foreground pt-2">{t.recommendedPackage}: {aiResponse?.package ?? consultantRecommendation?.packageName ?? pkg?.name} · {t.estimatedInvestment}: {estimatedInvestment} · {t.estimatedTimeline}: {estimatedTimeline}</p>
                </>
              ) : (
                <>
                  <p className="font-medium text-foreground">{t.recommendedPackage}: {aiResponse?.package ?? consultantRecommendation?.packageName ?? pkg?.name}</p>
                  {justification && <p className="text-sm text-muted-foreground">{justification}</p>}
                  <p className="text-sm">{t.estimatedInvestment}: {estimatedInvestment}</p>
                  <p className="text-sm">{t.estimatedTimeline}: {estimatedTimeline}</p>
                </>
              )}
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-3">{t.continueChat ?? 'Continue conversation'}</h2>
            <p className="text-sm text-muted-foreground mb-3">
              {lang === 'ru' ? 'Задайте вопросы по проекту, срокам или бюджету — бот ответит в стиле чата.' : lang === 'de' ? 'Stellen Sie Fragen zum Projekt, Zeitrahmen oder Budget — der Bot antwortet im Chat.' : 'Ask questions about the project, timeline or budget — the bot replies in chat.'}
            </p>
            <div className="rounded-lg border border-border/50 bg-muted/20 overflow-hidden">
              <div className="max-h-64 overflow-y-auto p-3 space-y-3">
                {chatMessages.length === 0 && (
                  <p className="text-xs text-muted-foreground">{lang === 'ru' ? 'Напишите сообщение ниже.' : lang === 'de' ? 'Schreiben Sie unten eine Nachricht.' : 'Type a message below.'}</p>
                )}
                {chatMessages.map((m, i) => (
                  <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                    <span className={`inline-block max-w-[85%] rounded-lg px-3 py-2 text-sm ${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>
                      {m.content}
                    </span>
                  </div>
                ))}
                {chatLoading && (
                  <div className="text-left">
                    <span className="inline-block rounded-lg px-3 py-2 text-sm bg-muted text-muted-foreground">…</span>
                  </div>
                )}
              </div>
              <form
                className="flex gap-2 p-3 border-t border-border/50"
                onSubmit={(e) => {
                  e.preventDefault();
                  const msg = chatInput.trim();
                  if (!msg || chatLoading) return;
                  setChatMessages((prev) => [...prev, { role: 'user', content: msg }]);
                  setChatInput('');
                  setChatLoading(true);
                  apiPostWithResponse('/project-check/chat', { intake, messages: [...chatMessages, { role: 'user', content: msg }], newMessage: msg })
                    .then(({ status, data }) => {
                      if (status === 503) {
                        setChatMessages((prev) => [...prev, { role: 'assistant', content: lang === 'ru' ? 'AI временно недоступен.' : lang === 'de' ? 'KI ist vorübergehend nicht verfügbar.' : 'AI is temporarily unavailable.' }]);
                        return;
                      }
                      if (status === 502 || status === 500) {
                        setChatMessages((prev) => [...prev, { role: 'assistant', content: lang === 'ru' ? 'Ошибка сервера. Попробуйте ещё раз.' : lang === 'de' ? 'Serverfehler. Bitte erneut versuchen.' : 'Server error. Try again.' }]);
                        return;
                      }
                      if (data?.assistantMessage != null && data.assistantMessage !== '') {
                        setChatMessages((prev) => [...prev, { role: 'assistant', content: data.assistantMessage }]);
                      } else {
                        setChatMessages((prev) => [...prev, { role: 'assistant', content: lang === 'ru' ? 'Ответ пуст. Попробуйте ещё раз.' : 'Empty response. Try again.' }]);
                      }
                    })
                    .catch(() => {
                      setChatMessages((prev) => [...prev, { role: 'assistant', content: lang === 'ru' ? 'Ошибка сервера. Попробуйте ещё раз.' : 'Server error. Try again.' }]);
                    })
                    .finally(() => setChatLoading(false));
                }}
              >
                <Textarea
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={t.chatPlaceholder ?? 'Type a message…'}
                  rows={2}
                  className="resize-none flex-1 min-h-0"
                  disabled={chatLoading}
                />
                <Button type="submit" disabled={chatLoading || !chatInput.trim()}>
                  {t.chatSend ?? 'Send'}
                </Button>
              </form>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-3">{t.outputNextStep ?? t.ctaTitle}</h2>
            {consultantRecommendation?.urgencyReason && <p className="text-sm text-muted-foreground mb-3">{consultantRecommendation.urgencyReason}</p>}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="flex-1">
                <a href="mailto:corexdigital.info@gmail.com?subject=Detailangebot anfordern">
                  <Send className="w-4 h-4 mr-2" />
                  {ctaPrimary}
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="flex-1">
                <a href="mailto:corexdigital.info@gmail.com?subject=Strategiegespräch">
                  <Calendar className="w-4 h-4 mr-2" />
                  {ctaSecondary}
                </a>
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const handleBack = () => {
    const prev = stepIndex > 0 ? stepIndex - 1 : 'describe';
    setScreen(prev);
  };

  if (aiMode) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border/50">
        <div className="max-w-xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-1" />
            {t.back}
          </Button>
          <span className="text-xs text-muted-foreground">
            {stepIndex + 1} / {STEP_FIELDS.length}
          </span>
        </div>
      </header>

      <main className="flex-1 max-w-xl mx-auto w-full px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={stepIndex}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {currentField === 'language' && (
              <>
                <h2 className="text-lg font-medium text-foreground">{t.chooseLanguage}</h2>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant={intake.language === 'de' ? 'default' : 'outline'} className="flex-1" onClick={() => handleStepAnswer('de')}>Deutsch</Button>
                  <Button variant={intake.language === 'en' ? 'default' : 'outline'} className="flex-1" onClick={() => handleStepAnswer('en')}>English</Button>
                </div>
              </>
            )}
            {currentQuestion && currentField !== 'language' && (
              <>
                <h2 className="text-lg font-medium text-foreground">{currentQuestion.label}</h2>
                {currentQuestion.options ? (
                  <div className="flex flex-col gap-2">
                    {currentQuestion.options.map((opt) => (
                      <Button
                        key={opt}
                        variant="outline"
                        className="justify-start"
                        onClick={() => handleStepAnswer(opt)}
                      >
                        {opt}
                      </Button>
                    ))}
                  </div>
                ) : (
                  currentField === 'references' ? (
                    <Textarea
                      value={stepTextValue}
                      onChange={(e) => setStepTextValue(e.target.value)}
                      placeholder={currentQuestion.placeholder}
                      rows={4}
                      className="resize-none"
                    />
                  ) : (
                    <Input
                      value={stepTextValue}
                      onChange={(e) => setStepTextValue(e.target.value)}
                      placeholder={currentQuestion.placeholder}
                    />
                  )
                )}
                {currentQuestion.options ? null : (
                  <Button
                    onClick={() => {
                      const v = stepTextValue.trim();
                      if (currentField !== 'references' && !v) return;
                      const newIntake = applyFieldValue(intake, currentField, v);
                      setIntake(newIntake);
                      goToNextOrResult(newIntake);
                    }}
                  >
                    {t.next}
                  </Button>
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
