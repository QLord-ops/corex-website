import { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/hooks/useTranslation';
import { Send, Loader2, Calendar, FileText, AlertCircle } from 'lucide-react';
import { consultationCopy } from '@/data/consultationCopy';
import { extractIntake } from '@/data/intakeExtractor';
import { getConsultantResponse, getConsultantResponseAIFormat } from '@/data/salesConsultant';
import { getTimelineText } from '@/data/salesConsultant';

// Get API base URL from environment variable
// Production: uses REACT_APP_BOT_API_URL or REACT_APP_API_URL
// Development: falls back to localhost:8000
const getBotApiUrl = () => {
  // Check for bot-specific API URL first (REACT_APP_BOT_API_URL)
  if (typeof process !== 'undefined' && process.env?.REACT_APP_BOT_API_URL) {
    const url = process.env.REACT_APP_BOT_API_URL.replace(/\/$/, '');
    return url || null;
  }
  // Fallback to general API URL (REACT_APP_API_URL)
  if (typeof process !== 'undefined' && process.env?.REACT_APP_API_URL) {
    const url = process.env.REACT_APP_API_URL.replace(/\/$/, '');
    return url || null;
  }
  // Development fallback: use localhost if running locally
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return 'http://localhost:8000';
  }
  return null;
};

// Check if API URL is configured
const isApiUrlConfigured = () => {
  return getBotApiUrl() !== null;
};

// Generate or retrieve sessionId from localStorage
const getSessionId = () => {
  const STORAGE_KEY = 'consultation_bot_session_id';
  let sessionId = localStorage.getItem(STORAGE_KEY);
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(STORAGE_KEY, sessionId);
  }
  return sessionId;
};

// Empty intake structure
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

// API call function for extract
const extractProject = async (userMessage, currentIntake, language = 'en') => {
  const apiBaseUrl = getBotApiUrl();
  if (!apiBaseUrl) {
    throw new Error('API_URL_NOT_CONFIGURED');
  }
  
  const url = `${apiBaseUrl}/api/extract`;
  const payload = {
    currentIntake: currentIntake || emptyIntake(),
    userMessage: userMessage,
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`API_ERROR_${response.status}`);
  }

  const data = await response.json();
  return data;
};

// API call function for chat
const chatWithBot = async (messages, newMessage, intake, language = 'en') => {
  const apiBaseUrl = getBotApiUrl();
  if (!apiBaseUrl) {
    throw new Error('API_URL_NOT_CONFIGURED');
  }
  
  const url = `${apiBaseUrl}/api/project-check/chat`;
  const payload = {
    intake: intake || emptyIntake(),
    messages: messages.map(m => ({ role: m.role, content: m.content })),
    newMessage: newMessage,
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));
  return { status: response.status, ok: response.ok, data };
};

export const ConsultationBot = () => {
  const { t, language, setLanguage } = useTranslation();
  const sectionRef = useRef(null);
  const messagesEndRef = useRef(null);
  const isInView = useInView(sectionRef, { 
    once: true, 
    margin: "-10% 0px -10% 0px" 
  });

  const [mode, setMode] = useState('project-check'); // 'project-check' | 'step-by-step' | 'result' | 'chat'
  const [intake, setIntake] = useState(emptyIntake);
  const [userMessage, setUserMessage] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [sessionId] = useState(() => getSessionId());
  const [stepIndex, setStepIndex] = useState(0);

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

  const lang = intake.language || language || 'en';
  const tCopy = consultationCopy[lang] || consultationCopy.en;

  // Load saved messages from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem(`consultation_bot_messages_${sessionId}`);
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setChatMessages(parsed);
        }
      } catch (e) {
        console.error('Failed to load saved messages:', e);
      }
    }
  }, [sessionId]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (chatMessages.length > 0) {
      localStorage.setItem(`consultation_bot_messages_${sessionId}`, JSON.stringify(chatMessages));
    }
  }, [chatMessages, sessionId]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, chatLoading]);

  const applyAIResult = (nextIntake, missing_required) => {
    const ai = getConsultantResponseAIFormat(nextIntake, missing_required);
    setAiResponse(ai);
    setIntake(nextIntake);
    if (ai.mode === 'result') {
      setMode('result');
    } else {
      setMode('chat');
    }
  };

  const handleAnalyze = async () => {
    const msg = userMessage.trim();
    if (!msg || analyzing) return;
    
    if (!isApiUrlConfigured()) {
      return; // Error UI will show
    }

    setAnalyzing(true);
    try {
      const { intake: nextIntake, missing_required } = await extractProject(msg, intake, lang);
      applyAIResult(nextIntake, missing_required);
    } catch (error) {
      // Fallback to local extraction
      const { intake: nextIntake, missing_required } = extractIntake(msg, intake);
      applyAIResult(nextIntake, missing_required);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    const msg = chatInput.trim();
    if (!msg || chatLoading) return;

    if (!isApiUrlConfigured()) {
      return; // Error UI will show
    }

    const userMessage = { role: 'user', content: msg };
    const updatedMessages = [...chatMessages, userMessage];
    setChatMessages(updatedMessages);
    setChatInput('');
    setChatLoading(true);

    try {
      const { status, data } = await chatWithBot(updatedMessages, msg, intake, lang);

      if (status === 503) {
        const errorMsg = lang === 'ru' 
          ? 'AI временно недоступен.' 
          : lang === 'de' 
          ? 'KI ist vorübergehend nicht verfügbar.' 
          : 'AI is temporarily unavailable.';
        setChatMessages((prev) => [...prev, { role: 'assistant', content: errorMsg }]);
        return;
      }

      if (status === 502 || status === 500) {
        const errorMsg = lang === 'ru'
          ? 'Ошибка сервера. Попробуйте ещё раз.'
          : lang === 'de'
          ? 'Serverfehler. Bitte erneut versuchen.'
          : 'Server error. Try again.';
        setChatMessages((prev) => [...prev, { role: 'assistant', content: errorMsg }]);
        return;
      }

      if (data?.assistantMessage != null && data.assistantMessage !== '') {
        setChatMessages((prev) => [...prev, { role: 'assistant', content: data.assistantMessage }]);
      } else {
        const errorMsg = lang === 'ru'
          ? 'Ответ пуст. Попробуйте ещё раз.'
          : 'Empty response. Try again.';
        setChatMessages((prev) => [...prev, { role: 'assistant', content: errorMsg }]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMsg = lang === 'ru'
        ? 'Ошибка сервера. Попробуйте ещё раз.'
        : lang === 'de'
        ? 'Serverfehler. Bitte erneut versuchen.'
        : 'Server error. Try again.';
      setChatMessages((prev) => [...prev, { role: 'assistant', content: errorMsg }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleStepAnswer = (value) => {
    const currentField = STEP_FIELDS[stepIndex];
    if (!currentField) return;

    const newIntake = { ...intake };
    if (currentField === 'language') {
      newIntake.language = value;
      setLanguage(value);
    } else if (currentField === 'goal') {
      const map = { 
        'Leads generieren': 'leads', 'Generate leads': 'leads',
        'Buchungen / Reservierungen': 'booking', 'Bookings / reservations': 'booking',
        'Verkauf (E-Commerce)': 'sales', 'Sales (e-commerce)': 'sales',
        'Markenauftritt / Präsenz': 'branding', 'Brand presence': 'branding' 
      };
      newIntake.goal = map[value] || value;
    } else if (currentField === 'website_type') {
      const map = { 
        'Landing (1 Seite)': 'landing', 'Landing (1 page)': 'landing',
        'Mehrseitig (5–8 Seiten)': 'multi-page', 'Multi-page (5–8 pages)': 'multi-page',
        'E-Commerce / Shop': 'e-commerce', 'E-commerce / shop': 'e-commerce',
        'Buchungssystem / Termine': 'multi-page', 'Booking system / appointments': 'multi-page' 
      };
      const v = map[value] || value;
      newIntake.website_type = v;
      newIntake.pages = v === 'landing' ? '1' : v === 'multi-page' ? '5-8' : v === 'e-commerce' ? '10' : newIntake.pages;
    } else if (currentField === 'budget_range') {
      const map = { 
        'Bis 2.000 €': 'low', 'Up to €2,000': 'low',
        '2.000 – 4.000 €': 'mid', '€2,000 – €4,000': 'mid',
        '4.000 – 8.000 €': 'mid', '€4,000 – €8,000': 'mid',
        'Über 8.000 €': 'high', 'Over €8,000': 'high' 
      };
      newIntake.budget_range = map[value] || value;
    } else if (currentField === 'timeline') {
      const map = { 
        'So schnell wie möglich': 'asap', 'As soon as possible': 'asap',
        '2–4 Wochen': '2-4-weeks', '2–4 weeks': '2-4-weeks',
        '1–2 Monate': '1-2-months', '1–2 months': '1-2-months',
        'Flexibel': 'flexible', 'Flexible': 'flexible' 
      };
      newIntake.timeline = map[value] || value;
    } else if (currentField === 'content_ready') {
      const map = { 
        'Ja, alles vorhanden': true, 'Yes, all ready': true,
        'Teilweise (Logo oder Texte)': false, 'Partly (logo or copy)': false,
        'Nein, brauche Unterstützung': false, 'No, need support': false 
      };
      newIntake.content_ready = map[value] ?? value;
    } else if (currentField === 'languages_needed') {
      const map = { 
        'Nein, eine Sprache': [], 'No, one language': [],
        'Ja, zwei Sprachen': ['de', 'en'], 'Yes, two languages': ['de', 'en'],
        'Ja, drei oder mehr': ['de', 'en'], 'Yes, three or more': ['de', 'en'] 
      };
      newIntake.languages_needed = map[value] ?? ['de', 'en'];
    } else if (currentField === 'integrations') {
      const map = { 
        'Keine / nur Kontaktformular': [], 'None / contact form only': [],
        'CRM (z.B. HubSpot, Pipedrive)': ['crm'], 'CRM (e.g. HubSpot, Pipedrive)': ['crm'],
        'Buchungssystem': ['booking'], 'Booking system': ['booking'],
        'Zahlung (Stripe, PayPal)': ['payment'], 'Payment (Stripe, PayPal)': ['payment'],
        'E-Mail-Automatisierung': ['automation'], 'Email automation': ['automation'],
        'Mehrere davon': ['crm', 'booking', 'payment', 'automation'], 'Several of these': ['crm', 'booking', 'payment', 'automation'] 
      };
      newIntake.integrations = map[value] ?? [];
    } else if (currentField === 'business_type') {
      newIntake.business_type = value;
    } else if (currentField === 'city') {
      newIntake.city = value;
    } else if (currentField === 'references') {
      newIntake.references = value ? [value] : [];
      newIntake.notes = value ? value : null;
    }

    setIntake(newIntake);
    setUserMessage(''); // Clear text input

    if (stepIndex < STEP_FIELDS.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      // All steps done, show result
      const missing_required = [];
      const ai = getConsultantResponseAIFormat(newIntake, missing_required);
      setAiResponse(ai);
      setMode('result');
    }
  };

  const currentField = STEP_FIELDS[stepIndex];
  const questionId = currentField === 'language' ? null : FIELD_TO_QUESTION_ID[currentField];
  const currentQuestion = questionId ? tCopy.questions?.find((q) => q.id === questionId) : null;

  const consultantRecommendation = mode === 'result' && aiResponse?.mode === 'result' 
    ? getConsultantResponse(intake, []) 
    : null;

  const packageKey = consultantRecommendation?.package || (aiResponse?.package ? aiResponse.package.toLowerCase() : null);
  const pkg = packageKey && tCopy.packages?.[packageKey];
  const estimatedInvestment = aiResponse?.mode === 'result' && aiResponse?.investment_from_eur != null 
    ? `from ${aiResponse.investment_from_eur.toLocaleString('de-DE')} €` 
    : (consultantRecommendation?.estimatedInvestment ?? pkg?.from);
  const estimatedTimeline = aiResponse?.mode === 'result' && aiResponse?.timeline != null 
    ? aiResponse.timeline 
    : (consultantRecommendation?.estimatedTimeline ?? tCopy.timelineStandard);

  // Volume-focused CTA labels (simple and direct)
  const ctaPrimary = lang === 'ru'
    ? 'Рассчитать стоимость'
    : lang === 'de'
    ? 'Kosten berechnen'
    : 'Calculate cost';
  
  const ctaSecondary = lang === 'ru'
    ? 'Обсудить проект'
    : lang === 'de'
    ? 'Projekt besprechen'
    : 'Discuss project';
  
  // Get strategic bullets for "Warum das passt" section
  const strategicBullets = consultantRecommendation?.strategicBullets || [];

  // API URL Error UI
  if (!isApiUrlConfigured()) {
    return (
      <section
        ref={sectionRef}
        className="min-h-[100dvh] flex items-center justify-center relative px-4 sm:px-6 py-12"
      >
        <div className="max-w-2xl w-full">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-6">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <h2 className="text-scene-statement mb-4">
              Bot API URL is not configured
            </h2>
            <p className="text-scene-small text-muted-foreground">
              Please set REACT_APP_BOT_API_URL or REACT_APP_API_URL environment variable.
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="consultation-bot"
      ref={sectionRef}
      className="min-h-[100dvh] flex items-center justify-center relative px-4 sm:px-6 py-12"
    >
      <div className="max-w-2xl w-full">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="text-scene-statement mb-4">
            {lang === 'ru' 
              ? 'Рассчитайте стоимость и сроки за 60 секунд' 
              : lang === 'de' 
              ? 'Kosten und Zeit in 60 Sekunden berechnen' 
              : 'Calculate cost and timeline in 60 seconds'}
          </h2>
          <p className="text-scene-small text-muted-foreground">
            {lang === 'ru' 
              ? 'Опишите проект — получите стоимость и сроки.' 
              : lang === 'de' 
              ? 'Beschreiben Sie Ihr Projekt — erhalten Sie Kosten und Zeitrahmen.' 
              : 'Describe your project — get cost and timeline.'}
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {mode === 'project-check' && (
            <motion.div
              key="project-check"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="flex gap-2 justify-center">
                <Button 
                  size="sm" 
                  variant={lang === 'de' ? 'default' : 'outline'} 
                  onClick={() => { setIntake({ ...intake, language: 'de' }); setLanguage('de'); }}
                >
                  DE
                </Button>
                <Button 
                  size="sm" 
                  variant={lang === 'en' ? 'default' : 'outline'} 
                  onClick={() => { setIntake({ ...intake, language: 'en' }); setLanguage('en'); }}
                >
                  EN
                </Button>
              </div>
              
              <Textarea
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder={
                  lang === 'ru'
                    ? 'Например: Консалтинговая фирма в Берлине. Нужен сайт на немецком и английском для лидов. Бюджет до 4.000 €, запуск через 2–4 недели.'
                    : lang === 'de'
                    ? 'Z.B.: Beratungsfirma in Berlin. Website auf Deutsch und Englisch für Leads. Budget bis 4.000 €, Start in 2–4 Wochen.'
                    : 'E.g.: Consulting firm in Berlin. Website in German and English for leads. Budget up to €4,000, start in 2–4 weeks.'
                }
                rows={6}
                className="resize-none bg-secondary/30 border-border focus:border-primary/50"
              />
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={handleAnalyze} 
                  disabled={analyzing || !userMessage.trim()}
                  className="flex-1"
                  size="lg"
                >
                  {analyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {lang === 'ru' ? 'Рассчитываю...' : lang === 'de' ? 'Berechne...' : 'Calculating...'}
                    </>
                  ) : (
                    lang === 'ru' ? 'Рассчитать стоимость' : lang === 'de' ? 'Kosten berechnen' : 'Calculate cost'
                  )}
                </Button>
              </div>

              <p className="text-sm text-muted-foreground text-center">
                <button
                  type="button"
                  className="underline hover:text-foreground transition-colors"
                  onClick={() => {
                    setMode('step-by-step');
                    setStepIndex(0);
                    setIntake({ ...intake, language: lang });
                  }}
                >
                  {lang === 'ru' 
                    ? 'Ответить по шагам' 
                    : lang === 'de' 
                    ? 'Schrittweise beantworten' 
                    : 'Answer step by step'}
                </button>
              </p>
            </motion.div>
          )}

          {mode === 'step-by-step' && (
            <motion.div
              key="step-by-step"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  {stepIndex + 1} / {STEP_FIELDS.length}
                </p>
                <h3 className="text-lg font-semibold text-foreground mb-6">
                  {currentQuestion?.label || currentField}
                </h3>
              </div>

              {currentQuestion?.options ? (
                <div className="space-y-2">
                  {currentQuestion.options.map((option, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      className="w-full justify-start text-left h-auto py-3"
                      onClick={() => handleStepAnswer(option)}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              ) : currentField === 'language' ? (
                <div className="flex gap-2">
                  <Button
                    variant={intake.language === 'de' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => handleStepAnswer('de')}
                  >
                    Deutsch
                  </Button>
                  <Button
                    variant={intake.language === 'en' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => handleStepAnswer('en')}
                  >
                    English
                  </Button>
                </div>
              ) : (
                <>
                  <Textarea
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    placeholder={currentQuestion?.placeholder || 'Type your answer...'}
                    rows={4}
                    className="resize-none bg-secondary/30 border-border focus:border-primary/50"
                  />
                  <div className="flex gap-3">
                    {stepIndex > 0 && (
                      <Button
                        variant="outline"
                        onClick={() => setStepIndex(stepIndex - 1)}
                        className="flex-1"
                      >
                        {tCopy.back || 'Back'}
                      </Button>
                    )}
                    <Button
                      onClick={() => handleStepAnswer(userMessage)}
                      disabled={!userMessage.trim()}
                      className={stepIndex > 0 ? 'flex-1' : 'w-full'}
                    >
                      {tCopy.next || 'Next'}
                    </Button>
                  </div>
                </>
              )}

              {currentQuestion?.options && (
                <div className="flex gap-3">
                  {stepIndex > 0 && (
                    <Button
                      variant="outline"
                      onClick={() => setStepIndex(stepIndex - 1)}
                      className="flex-1"
                    >
                      {tCopy.back || 'Back'}
                    </Button>
                  )}
                </div>
              )}

              <p className="text-sm text-muted-foreground text-center">
                <button
                  type="button"
                  className="underline hover:text-foreground transition-colors"
                  onClick={() => setMode('project-check')}
                >
                  {lang === 'ru' 
                    ? 'Вернуться к описанию' 
                    : lang === 'de' 
                    ? 'Zurück zur Beschreibung' 
                    : 'Back to description'}
                </button>
              </p>
            </motion.div>
          )}

          {mode === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="rounded-lg border border-border/50 bg-muted/20 p-6 space-y-4">
                <h3 className="text-lg font-semibold text-foreground">
                  {lang === 'ru' ? 'Стоимость и сроки' : lang === 'de' ? 'Kosten und Zeitrahmen' : 'Cost and timeline'}
                </h3>
                
                {pkg && (
                  <div className="space-y-2">
                    <p className="text-xl font-medium text-foreground">{pkg.name}</p>
                    <p className="text-sm text-muted-foreground">{pkg.why}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                      {lang === 'ru' ? 'Стоимость' : lang === 'de' ? 'Kosten' : 'Cost'}
                    </p>
                    <p className="text-lg font-semibold text-foreground">{estimatedInvestment}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                      {lang === 'ru' ? 'Сроки' : lang === 'de' ? 'Zeitrahmen' : 'Timeline'}
                    </p>
                    <p className="text-lg font-semibold text-foreground">{estimatedTimeline}</p>
                  </div>
                </div>
              </div>

              {/* Trust clarification line - no obligation */}
              <p className="text-xs text-muted-foreground text-center">
                {lang === 'ru' 
                  ? 'Предварительная оценка — решение о следующих шагах остаётся за вами.' 
                  : lang === 'de' 
                  ? 'Unverbindliche Einschätzung – Sie entscheiden selbst über die nächsten Schritte.' 
                  : 'No obligation estimate — you decide the next steps.'}
              </p>

              {/* Warum das passt - Simple bullets (max 4, concise, 1 line each) */}
              {strategicBullets.length > 0 && (
                <div className="rounded-lg border border-border/50 bg-muted/20 p-6 space-y-3">
                  <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                    {lang === 'ru' ? 'Почему подходит' : lang === 'de' ? 'Warum passt' : 'Why it fits'}
                  </h4>
                  <ul className="space-y-2">
                    {strategicBullets.slice(0, 4).map((bullet, idx) => {
                      // Make bullets concise: take first sentence, remove marketing fluff
                      let conciseBullet = bullet.split('.')[0].trim();
                      // Remove em-dash explanations for DE/EN to keep it shorter
                      if (lang === 'de' || lang === 'en') {
                        conciseBullet = conciseBullet.split('—')[0].trim();
                      }
                      // Ensure max length (approximately 80 chars for single line)
                      if (conciseBullet.length > 80) {
                        conciseBullet = conciseBullet.substring(0, 77) + '...';
                      }
                      return (
                        <li key={idx} className="flex items-start gap-2 text-sm text-foreground/90 leading-relaxed">
                          <span className="text-primary mt-1 shrink-0">•</span>
                          <span className="break-words">{conciseBullet}</span>
                        </li>
                      );
                    })}
                    {/* Add positive framing for Start/Light packages */}
                    {(packageKey === 'start' || packageKey === 'light') && (
                      <li className="flex items-start gap-2 text-sm text-foreground/90 leading-relaxed">
                        <span className="text-primary mt-1 shrink-0">•</span>
                        <span className="break-words">
                          {lang === 'ru' 
                            ? 'Идеально для небольших и быстрых проектов' 
                            : lang === 'de' 
                            ? 'Ideal für kleine und schnelle Projekte' 
                            : 'Ideal for smaller and fast projects'}
                        </span>
                      </li>
                    )}
                  </ul>
                </div>
              )}

              {/* Micro-trust line - simpler */}
              <p className="text-xs text-muted-foreground text-center">
                {lang === 'ru' 
                  ? 'Расчет основан на вашем проекте. Может потребоваться 1–2 уточняющих вопроса.' 
                  : lang === 'de' 
                  ? 'Berechnung basiert auf Ihrem Projekt. Eventuell 1–2 Nachfragen nötig.' 
                  : 'Calculation based on your project. May need 1–2 clarifying questions.'}
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild size="lg" className="flex-1">
                  <a href={`mailto:corexdigital.info@gmail.com?subject=${encodeURIComponent(ctaPrimary)}`}>
                    <FileText className="w-4 h-4 mr-2" />
                    {ctaPrimary}
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg" className="flex-1">
                  <a href={`mailto:corexdigital.info@gmail.com?subject=${encodeURIComponent(ctaSecondary)}`}>
                    <Calendar className="w-4 h-4 mr-2" />
                    {ctaSecondary}
                  </a>
                </Button>
              </div>

              {/* Social proof - transparent pricing trust (refined) */}
              <p className="text-xs text-muted-foreground text-center">
                {lang === 'ru' 
                  ? 'Прозрачный расчет. Без скрытых платежей.' 
                  : lang === 'de' 
                  ? 'Transparent kalkuliert. Ohne versteckte Kosten.' 
                  : 'Transparent pricing. No hidden costs.'}
              </p>

              {/* Soft urgency - subtle, low-contrast (60-70% opacity) */}
              <p className="text-xs text-muted-foreground/65 text-center">
                {lang === 'ru' 
                  ? 'Ограниченная загрузка.' 
                  : lang === 'de' 
                  ? 'Projektstarts pro Monat begrenzt.' 
                  : 'Limited monthly capacity.'}
              </p>

              <div className="pt-4 border-t border-border/50">
                <button
                  type="button"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors w-full text-center"
                  onClick={() => {
                    setMode('chat');
                    setChatMessages([]);
                  }}
                >
                  {lang === 'ru' 
                    ? 'Задать вопросы' 
                    : lang === 'de' 
                    ? 'Fragen stellen' 
                    : 'Ask questions'}
                </button>
              </div>
            </motion.div>
          )}

          {mode === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.5 }}
            >
              <div className="rounded-lg border border-border/50 bg-muted/20 overflow-hidden backdrop-blur-sm">
                <div className="max-h-96 overflow-y-auto p-4 sm:p-6 space-y-4 min-h-[200px]">
                  {chatMessages.length === 0 && (
                    <div className="flex items-center justify-center h-full min-h-[150px]">
                      <p className="text-sm text-muted-foreground">
                        {lang === 'ru' 
                          ? 'Напишите сообщение ниже.' 
                          : lang === 'de' 
                          ? 'Schreiben Sie unten eine Nachricht.' 
                          : 'Type a message below.'}
                      </p>
                    </div>
                  )}
                  {chatMessages.map((m, i) => (
                    <div
                      key={i}
                      className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] sm:max-w-[75%] rounded-lg px-4 py-2.5 text-sm ${
                          m.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary/50 text-foreground border border-border/30'
                        }`}
                      >
                        {m.content}
                      </div>
                    </div>
                  ))}
                  {chatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-secondary/50 text-foreground border border-border/30 rounded-lg px-4 py-2.5 text-sm flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>…</span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                <form
                  className="flex gap-2 p-4 border-t border-border/50 bg-background/50"
                  onSubmit={handleChatSubmit}
                >
                  <Textarea
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder={tCopy.chatPlaceholder || 'Type a message…'}
                    rows={2}
                    className="resize-none flex-1 min-h-0 bg-secondary/30 border-border focus:border-primary/50"
                    disabled={chatLoading}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleChatSubmit(e);
                      }
                    }}
                  />
                  <Button
                    type="submit"
                    disabled={chatLoading || !chatInput.trim()}
                    className="shrink-0"
                    size="lg"
                  >
                    {chatLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
