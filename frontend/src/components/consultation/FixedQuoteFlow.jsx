/**
 * FixedQuoteFlow компонент для 2-question fixed quote flow
 * Адаптирован для corex-website с Tailwind CSS
 */

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LeadCapture } from './LeadCapture';
import { fetchJson } from '@/lib/api';
import { trackEvent } from '@/lib/analytics';

const API_BASE_URL = process.env.REACT_APP_BOT_API_URL || process.env.REACT_APP_API_URL || 'http://localhost:3000';

// localStorage keys
const STORAGE_KEY_SESSION_ID = 'consultation_bot_session_id';
const STORAGE_KEY_LANGUAGE = 'consultation_bot_language';

export function FixedQuoteFlow({ 
  apiBaseUrl = API_BASE_URL,
  defaultLanguage = 'de',
  onComplete, 
  onError 
}) {
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
      return localStorage.getItem(STORAGE_KEY_LANGUAGE) || defaultLanguage;
    } catch {
      return defaultLanguage;
    }
  });
  
  const [currentStep, setCurrentStep] = useState(0);
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [languageManuallySet, setLanguageManuallySet] = useState(false);
  const [showLeadCapture, setShowLeadCapture] = useState(false);

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

  const labels = {
    ru: {
      title: 'Получить фиксированное предложение',
      subtitle: 'Ответьте на 2 вопроса и получите точную цену',
      start: 'Начать',
      question: 'Вопрос',
      of: 'из',
      next: 'Далее',
      processing: 'Обработка...',
      yourProposal: 'Ваше предложение',
      from: 'От',
      typicalRange: 'Типичный диапазон:',
      timeline: 'Срок:',
      bookCall: 'Запланировать звонок',
      selectLanguage: 'Язык:'
    },
    de: {
      title: 'Festpreis-Angebot erhalten',
      subtitle: 'Beantworten Sie 2 Fragen und erhalten Sie einen genauen Preis',
      start: 'Starten',
      question: 'Frage',
      of: 'von',
      next: 'Weiter',
      processing: 'Verarbeitung...',
      yourProposal: 'Ihr Angebot',
      from: 'Ab',
      typicalRange: 'Typischer Bereich:',
      timeline: 'Zeitrahmen:',
      bookCall: 'Anruf planen',
      selectLanguage: 'Sprache:'
    },
    en: {
      title: 'Get fixed quote',
      subtitle: 'Answer 2 questions and get an exact price',
      start: 'Start',
      question: 'Question',
      of: 'of',
      next: 'Continue',
      processing: 'Processing...',
      yourProposal: 'Your proposal',
      from: 'From',
      typicalRange: 'Typical range:',
      timeline: 'Timeline:',
      bookCall: 'Book a call',
      selectLanguage: 'Language:'
    }
  };

  const l = labels[language] || labels.de;

  // Запуск flow
  const startFlow = async () => {
    setLoading(true);
    try {
      const data = await fetchJson(`${apiBaseUrl}/api/fixed-quote/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sessionId || undefined, // Send existing sessionId if available
          language: language
        })
      });

      if (data.success) {
        const newSessionId = data.sessionId;
        setSessionId(newSessionId);
        setCurrentStep(data.step);
        setQuestion(data.question);
        // Update language only if server returned a different one and user hasn't manually set it
        if (data.language && !languageManuallySet) {
          setLanguage(data.language);
        }
      } else {
        throw new Error(data.error || 'Ошибка при запуске flow');
      }
      trackEvent('fixed_quote_start_success', { language });
    } catch (err) {
      if (onError) onError(err);
      trackEvent('fixed_quote_start_fail', {
        language,
        reason: err.message || 'start_failed',
      });
    } finally {
      setLoading(false);
    }
  };

  // Отправка ответа
  const handleAnswer = async (answer) => {
    if (!sessionId) return;

    setLoading(true);
    
    const newAnswers = {
      ...answers,
      [question.id]: question.multiple 
        ? (Array.isArray(answer) ? answer : [answer])
        : answer
    };
    setAnswers(newAnswers);

    try {
      const data = await fetchJson(`${apiBaseUrl}/api/fixed-quote/answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          step: currentStep,
          answer,
          language: language
        })
      });

        if (data.success) {
        const newSessionId = data.sessionId;
        setSessionId(newSessionId);
        
        // Update language only if server returned a different one and user hasn't manually set it
        if (data.language && !languageManuallySet) {
          setLanguage(data.language);
        }
        
        if (data.isComplete) {
          // Flow завершен - trigger proposal_generated event
          setResult(data.recommendation);
          
          // Track fixed_quote_completed event
          try {
            await fetchJson(`${apiBaseUrl}/api/track/cta`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                sessionId: newSessionId,
                action: 'fixed_quote_completed'
              })
            });
          } catch (err) {
            console.warn('Failed to track fixed_quote_completed:', err);
          }
          
          // Show lead capture after fixed quote completion
          setShowLeadCapture(true);
          
          if (onComplete) {
            onComplete({
              sessionId: newSessionId,
              language: data.language || language,
              recommendation: data.recommendation
            });
          }
          trackEvent('fixed_quote_completed', { language: data.language || language });
        } else {
          // Переходим к следующему вопросу
          setCurrentStep(data.step);
          setQuestion(data.question);
        }
      } else {
        throw new Error(data.error || 'Ошибка при обработке ответа');
      }
    } catch (err) {
      if (onError) onError(err);
      trackEvent('fixed_quote_answer_fail', {
        language,
        reason: err.message || 'answer_failed',
      });
    } finally {
      setLoading(false);
    }
  };

  // Если flow не начат
  if (!question && !loading && !result) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{l.title}</CardTitle>
          <CardDescription>{l.subtitle}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
          <Button onClick={startFlow} className="w-full">
            {l.start}
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Show lead capture after fixed quote completion
  if (showLeadCapture && result && sessionId) {
    return (
      <div className="w-full max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{l.yourProposal}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-xl font-semibold mb-2">{result.package.name}</h4>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">
                  {l.from} {result.price.from}{result.price.currency}
                </div>
                <div className="text-sm text-muted-foreground">
                  {l.typicalRange} {result.price.typicalRange}{result.price.currency}
                </div>
              </div>
              <div className="mt-4 text-sm">
                <strong>{l.timeline}</strong> {result.package.timeline}
              </div>
            </div>
            <Button 
              onClick={() => window.open(process.env.REACT_APP_BOOK_CALL_URL || 'mailto:aionex.info@gmail.com', '_blank')}
              className="w-full"
            >
              {l.bookCall}
            </Button>
          </CardContent>
        </Card>
        
        <LeadCapture
          apiBaseUrl={apiBaseUrl}
          sessionId={sessionId}
          language={language}
          onSubmitted={() => {}}
        />
      </div>
    );
  }

  // Если flow завершен
  if (result) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{l.yourProposal}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-xl font-semibold mb-2">{result.package.name}</h4>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">
                {l.from} {result.price.from}{result.price.currency}
              </div>
              <div className="text-sm text-muted-foreground">
                {l.typicalRange} {result.price.typicalRange}{result.price.currency}
              </div>
            </div>
            <div className="mt-4 text-sm">
              <strong>{l.timeline}</strong> {result.package.timeline}
            </div>
          </div>
          <Button 
            onClick={() => window.open(process.env.REACT_APP_BOOK_CALL_URL || 'mailto:aionex.info@gmail.com', '_blank')}
            className="w-full"
          >
            {l.bookCall}
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Показываем текущий вопрос
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {l.question} {currentStep} {l.of} 2
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {question && (
          <div className="space-y-4">
            <p className="text-lg font-medium">{question.question}</p>
            
            {question.multiple ? (
              <div className="space-y-3">
                {question.options.map((option, idx) => {
                  const isSelected = answers[question.id]?.includes(option);
                  return (
                    <div key={idx} className="flex items-center space-x-2">
                      <Checkbox
                        id={`option-${idx}`}
                        checked={isSelected || false}
                        onCheckedChange={(checked) => {
                          const current = answers[question.id] || [];
                          const updated = checked
                            ? [...current, option]
                            : current.filter(o => o !== option);
                          setAnswers({ ...answers, [question.id]: updated });
                        }}
                      />
                      <Label
                        htmlFor={`option-${idx}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {option}
                      </Label>
                    </div>
                  );
                })}
                <Button
                  onClick={() => handleAnswer(answers[question.id] || [])}
                  disabled={!answers[question.id] || answers[question.id].length === 0}
                  className="w-full mt-4"
                >
                  {l.next}
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {question.options.map((option, idx) => (
                  <Button
                    key={idx}
                    onClick={() => handleAnswer(option)}
                    variant="outline"
                    className="w-full"
                  >
                    {option}
                  </Button>
                ))}
              </div>
            )}
          </div>
        )}
        
        {loading && (
          <div className="text-center text-muted-foreground">
            {l.processing}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default FixedQuoteFlow;
