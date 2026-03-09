/**
 * ConsultationBot компонент для интеграции с API бота-консультанта
 * Адаптирован для corex-website с Tailwind CSS и существующей i18n системой
 */

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LeadCapture } from './LeadCapture';
import { fetchJson } from '@/lib/api';
import { trackEvent } from '@/lib/analytics';
// import { useTranslation } from '@/hooks/useTranslation'; // Раскомментируйте если нужно использовать существующую i18n систему

// API URL из переменных окружения
const API_BASE_URL = process.env.REACT_APP_BOT_API_URL || process.env.REACT_APP_API_URL || 'http://localhost:3000';

// localStorage keys
const STORAGE_KEY_SESSION_ID = 'consultation_bot_session_id';
const STORAGE_KEY_LANGUAGE = 'consultation_bot_language';

/**
 * Детектирует язык из текста
 */
function detectLanguage(text) {
  if (!text || typeof text !== 'string') return 'en';
  
  const normalized = text.toLowerCase().trim();
  
  // Кириллица -> русский
  if (/[а-яё]/.test(normalized)) return 'ru';
  
  // Немецкие символы и слова
  if (/[äöüß]|der|die|das|und|ist|sind|für|mit|auf/i.test(normalized)) return 'de';
  
  return 'en';
}

export function ConsultationBot({ 
  apiBaseUrl = API_BASE_URL,
  defaultLanguage = 'de', // По умолчанию немецкий для Aionex
  onPackageSelected, 
  onError 
}) {
  // const { t, language: currentLanguage } = useTranslation(); // Раскомментируйте если нужно использовать существующую i18n систему
  const currentLanguage = defaultLanguage || 'de';
  
  // Load sessionId and language from localStorage on mount
  const [sessionId, setSessionId] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_SESSION_ID) || null;
    } catch {
      return null;
    }
  });
  
  const [language, setLanguage] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_LANGUAGE) || defaultLanguage || currentLanguage || 'de';
    } catch {
      return defaultLanguage || currentLanguage || 'de';
    }
  });
  
  const [request, setRequest] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [languageManuallySet, setLanguageManuallySet] = useState(false); // Track if user explicitly selected language
  const [proposalGenerated, setProposalGenerated] = useState(false); // Track if proposal was generated

  // Persist sessionId to localStorage whenever it changes
  useEffect(() => {
    if (sessionId) {
      try {
        localStorage.setItem(STORAGE_KEY_SESSION_ID, sessionId);
      } catch (err) {
        console.warn('Failed to save sessionId to localStorage:', err);
      }
    }
  }, [sessionId]);

  // Persist language to localStorage whenever it changes (only if manually set)
  useEffect(() => {
    if (languageManuallySet) {
      try {
        localStorage.setItem(STORAGE_KEY_LANGUAGE, language);
      } catch (err) {
        console.warn('Failed to save language to localStorage:', err);
      }
    }
  }, [language, languageManuallySet]);

  // Auto-detect language from text only if language hasn't been manually set
  useEffect(() => {
    if (!languageManuallySet && request.trim().length > 0) {
      const detected = detectLanguage(request);
      setLanguage(detected);
    }
  }, [request, languageManuallySet]);

  // Handle explicit language selection
  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    setLanguageManuallySet(true);
    try {
      localStorage.setItem(STORAGE_KEY_LANGUAGE, newLanguage);
    } catch (err) {
      console.warn('Failed to save language to localStorage:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!request.trim() || request.trim().length < 10) {
      const errorMessages = {
        ru: 'Пожалуйста, опишите ваш проект более подробно (минимум 10 символов)',
        de: 'Bitte beschreiben Sie Ihr Projekt ausführlicher (mindestens 10 Zeichen)',
        en: 'Please describe your project in more detail (minimum 10 characters)'
      };
      setError(errorMessages[language] || errorMessages.de);
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Always send sessionId if available (from localStorage or previous request)
      const finalLanguage = language || defaultLanguage;
      trackEvent('consultation_submit_attempt', { language: finalLanguage });
      const data = await fetchJson(`${apiBaseUrl}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          request: request.trim(),
          sessionId: sessionId || undefined, // Send sessionId if available
          language: finalLanguage
        })
      });
      
      if (!data.success) {
        throw new Error(data.message || 'Ошибка при анализе запроса');
      }

      // Сохраняем sessionId и язык
      const newSessionId = data.sessionId;
      setSessionId(newSessionId);
      
      // Update language only if server returned a different one and user hasn't manually set it
      if (data.language && !languageManuallySet) {
        setLanguage(data.language);
      }
      
      // Сохраняем sessionId в result
      setResult({
        ...data.data,
        sessionId: newSessionId,
        language: data.language || language
      });
      
      // Вызываем callback если передан
      if (onPackageSelected) {
        onPackageSelected(data.data);
      }
      trackEvent('consultation_submit_success', { language: finalLanguage });
    } catch (err) {
      const errorMessages = {
        ru: 'Произошла ошибка при анализе вашего запроса',
        de: 'Ein Fehler ist beim Analysieren Ihrer Anfrage aufgetreten',
        en: 'An error occurred while analyzing your request'
      };
      const errorMessage = err.message || errorMessages[language] || errorMessages.de;
      setError(errorMessage);
      
      if (onError) {
        onError(err);
      }
      trackEvent('consultation_submit_fail', {
        language,
        reason: err.message || 'analysis_failed',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBookCall = async () => {
    if (!result || !result.sessionId) return;

    try {
      // Отслеживаем клик на CTA
      await fetchJson(`${apiBaseUrl}/api/track/cta`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: result.sessionId,
          action: 'book_call'
        })
      });

      // Generate proposal before opening booking link
      try {
        const proposalResponse = await fetchJson(`${apiBaseUrl}/api/proposal`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionId: result.sessionId,
            packageKey: result.recommendation.package.key,
            confirmedAddons: result.recommendation.price.breakdown.confirmedAddons.map(a => a.name)
          })
        });
        
        if (proposalResponse) setProposalGenerated(true);
      } catch (err) {
        console.warn('Failed to generate proposal:', err);
      }

      window.open(result.explanation.ctaActions.bookCallUrl, '_blank');
    } catch (err) {
      console.error('Failed to track CTA:', err);
      // Все равно открываем ссылку даже если tracking не удался
      window.open(result.explanation.ctaActions.bookCallUrl, '_blank');
    }
  };

  const labels = {
    ru: {
      title: 'Опишите ваш проект:',
      placeholder: 'Например: Хочу интернет-магазин для продажи одежды с оплатой онлайн и мобильным приложением',
      submit: 'Получить рекомендацию',
      loading: 'Анализирую...',
      recommendedPackage: 'Рекомендуемый пакет:',
      estimate: 'Предварительная оценка',
      from: 'От',
      typicalRange: 'Типичный диапазон:',
      timeline: 'Срок:',
      guarantee: 'Гарантия:',
      includedAddons: 'Включенные дополнения:',
      optionalAddons: 'Опциональные дополнения:',
      whyThisPackage: 'Почему этот пакет?',
      solvesProblems: 'Решает задачи:',
      keyBenefits: 'Ключевые преимущества:',
      needsClarification: 'Требуется уточнение:',
      assumptions: 'Предположения:',
      bookCall: 'Запланировать звонок',
      fixedQuote: 'Быстрое предложение',
      selectLanguage: 'Язык:'
    },
    de: {
      title: 'Beschreiben Sie Ihr Projekt:',
      placeholder: 'Zum Beispiel: Ich möchte einen Online-Shop für Kleidung mit Online-Zahlung und mobiler App',
      submit: 'Empfehlung erhalten',
      loading: 'Analysiere...',
      recommendedPackage: 'Empfohlenes Paket:',
      estimate: 'Vorläufige Schätzung',
      from: 'Ab',
      typicalRange: 'Typischer Bereich:',
      timeline: 'Zeitrahmen:',
      guarantee: 'Garantie:',
      includedAddons: 'Enthaltene Ergänzungen:',
      optionalAddons: 'Optionale Ergänzungen:',
      whyThisPackage: 'Warum dieses Paket?',
      solvesProblems: 'Löst Probleme:',
      keyBenefits: 'Hauptvorteile:',
      needsClarification: 'Klärung erforderlich:',
      assumptions: 'Annahmen:',
      bookCall: 'Anruf planen',
      fixedQuote: 'Festpreis-Angebot',
      selectLanguage: 'Sprache:'
    },
    en: {
      title: 'Describe your project:',
      placeholder: 'For example: I want an e-commerce store for selling clothes with online payment and mobile app',
      submit: 'Get recommendation',
      loading: 'Analyzing...',
      recommendedPackage: 'Recommended package:',
      estimate: 'Estimate',
      from: 'From',
      typicalRange: 'Typical range:',
      timeline: 'Timeline:',
      guarantee: 'Guarantee:',
      includedAddons: 'Included add-ons:',
      optionalAddons: 'Optional add-ons:',
      whyThisPackage: 'Why this package?',
      solvesProblems: 'Solves problems:',
      keyBenefits: 'Key benefits:',
      needsClarification: 'Clarification needed:',
      assumptions: 'Assumptions:',
      bookCall: 'Book a call',
      fixedQuote: 'Fixed quote',
      selectLanguage: 'Language:'
    }
  };

  const l = labels[language] || labels.de;

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{l.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="language-select" className="text-sm font-medium">
                  {l.selectLanguage}
                </label>
                <Select value={language} onValueChange={handleLanguageChange}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ru">Русский</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Textarea
                id="project-request"
                value={request}
                onChange={(e) => setRequest(e.target.value)}
                placeholder={l.placeholder}
                rows={4}
                maxLength={2000}
                disabled={loading}
                className="w-full"
              />
              <p className="text-sm text-muted-foreground">
                {request.length}/2000 {language === 'ru' ? 'символов' : language === 'de' ? 'Zeichen' : 'characters'}
              </p>
            </div>

            <Button 
              type="submit" 
              disabled={loading || !request.trim()}
              className="w-full"
            >
              {loading ? l.loading : l.submit}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{l.recommendedPackage} {result.recommendation.package.name}</CardTitle>
              {result.recommendation.isEstimate && (
                <Badge variant="secondary" className="bg-yellow-500 text-yellow-900">{l.estimate}</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">
                {l.from} {result.recommendation.price.from}{result.recommendation.price.currency}
              </div>
              <div className="text-sm text-muted-foreground">
                {l.typicalRange} {result.recommendation.price.typicalRange}{result.recommendation.price.currency}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>{l.timeline}</strong> {result.recommendation.package.timeline}
              </div>
              <div>
                <strong>{l.guarantee}</strong> {result.recommendation.package.guarantee}
              </div>
            </div>

            {result.recommendation.price.breakdown.confirmedAddons.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold">{l.includedAddons}</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {result.recommendation.price.breakdown.confirmedAddons.map((addon, idx) => (
                    <li key={idx}>
                      {addon.name}: +{addon.price}€
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.recommendation.price.breakdown.optionalAddons.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold">{l.optionalAddons}</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {result.recommendation.price.breakdown.optionalAddons.map((addon, idx) => (
                    <li key={idx}>
                      {addon.name}: +{addon.price}€ ({addon.reason})
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-4 pt-4 border-t">
              <div>
                <h4 className="font-semibold mb-2">{l.whyThisPackage}</h4>
                <p className="text-sm">{result.explanation.whyThisPackage}</p>
              </div>

              <div>
                <h5 className="font-medium mb-2">{l.solvesProblems}</h5>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {result.explanation.solvesProblems.map((problem, idx) => (
                    <li key={idx}>{problem}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="font-medium mb-2">{l.keyBenefits}</h5>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {result.explanation.keyBenefits.map((benefit, idx) => (
                    <li key={idx}>{benefit}</li>
                  ))}
                </ul>
              </div>
            </div>

            {result.clarification.needsClarification && (
              <Alert>
                <AlertDescription>
                  <h4 className="font-semibold mb-2">{l.needsClarification}</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {result.clarification.questions.map((question, idx) => (
                      <li key={idx}>{question}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {result.explanation.assumptions && result.explanation.assumptions.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold">{l.assumptions}</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {result.explanation.assumptions.map((assumption, idx) => (
                    <li key={idx}>{assumption}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <Button 
                onClick={handleBookCall}
                className="flex-1"
                variant="default"
              >
                {l.bookCall}
              </Button>
              <Button 
                onClick={() => {
                  // Navigate to fixed quote flow - parent component should handle this
                  if (window.location.pathname.includes('/consultation')) {
                    // If on consultation page, trigger tab switch
                    const event = new CustomEvent('switchToFixedQuote');
                    window.dispatchEvent(event);
                  } else {
                    // Otherwise, open fixed quote in new context
                    window.open(`${window.location.origin}/${language}/consultation?flow=fixed`, '_blank');
                  }
                }}
                className="flex-1"
                variant="outline"
              >
                {l.fixedQuote}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lead capture form - only shown after proposal is generated */}
      {proposalGenerated && result && result.sessionId && (
        <LeadCapture
          apiBaseUrl={apiBaseUrl}
          sessionId={result.sessionId}
          language={language}
          onSubmitted={() => {}}
        />
      )}
    </div>
  );
}

export default ConsultationBot;
