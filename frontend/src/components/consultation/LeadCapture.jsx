/**
 * LeadCapture компонент для сбора контактной информации
 * Показывается только после proposal_generated или fixed_quote_completed
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Link } from 'react-router-dom';
import { fetchJson } from '@/lib/api';
import { trackEvent } from '@/lib/analytics';

const API_BASE_URL = process.env.REACT_APP_BOT_API_URL || process.env.REACT_APP_API_URL || 'http://localhost:3000';

export function LeadCapture({ 
  apiBaseUrl = API_BASE_URL,
  sessionId,
  language = 'de',
  onSubmitted
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [consent, setConsent] = useState(false);

  const labels = {
    ru: {
      title: 'Оставьте контакты для связи',
      subtitle: 'Мы свяжемся с вами в ближайшее время',
      name: 'Имя',
      email: 'Email',
      phone: 'Телефон',
      submit: 'Отправить',
      submitting: 'Отправка...',
      success: 'Спасибо! Мы свяжемся с вами в ближайшее время.',
      error: 'Произошла ошибка. Пожалуйста, попробуйте еще раз.'
    },
    de: {
      title: 'Kontaktdaten hinterlassen',
      subtitle: 'Wir werden uns in Kürze bei Ihnen melden',
      name: 'Name',
      email: 'Email',
      phone: 'Telefon',
      submit: 'Absenden',
      submitting: 'Wird gesendet...',
      success: 'Vielen Dank! Wir werden uns in Kürze bei Ihnen melden.',
      error: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.'
    },
    en: {
      title: 'Leave your contact information',
      subtitle: 'We will contact you shortly',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      submit: 'Submit',
      submitting: 'Submitting...',
      success: 'Thank you! We will contact you shortly.',
      error: 'An error occurred. Please try again.'
    }
  };

  const l = labels[language] || labels.de;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError(l.email + ' ' + (language === 'ru' ? 'обязателен' : language === 'de' ? 'ist erforderlich' : 'is required'));
      return;
    }
    if (!consent) {
      setError(language === 'ru' ? 'Подтвердите согласие на обработку данных.' : language === 'de' ? 'Bitte stimmen Sie der Datenverarbeitung zu.' : 'Please confirm consent for data processing.');
      return;
    }

    setLoading(true);
    setError(null);
    trackEvent('lead_capture_submit_attempt', { language });

    try {
      const data = await fetchJson(`${apiBaseUrl}/api/lead/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          contactInfo: {
            name: name.trim() || undefined,
            email: email.trim(),
            phone: phone.trim() || undefined
          },
          consent
        })
      });
      
      if (data.success) {
        setSubmitted(true);
        trackEvent('lead_capture_submit_success', { language });
        if (onSubmitted) {
          onSubmitted({ name, email, phone });
        }
      } else {
        throw new Error(data.error || l.error);
      }
    } catch (err) {
      setError(err.message || l.error);
      trackEvent('lead_capture_submit_fail', {
        language,
        reason: err.message || 'lead_submit_failed',
      });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <Alert>
            <AlertDescription>{l.success}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{l.title}</CardTitle>
        <CardDescription>{l.subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="lead-name">{l.name}</Label>
            <Input
              id="lead-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={l.name}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lead-email">{l.email} *</Label>
            <Input
              id="lead-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={l.email}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lead-phone">{l.phone}</Label>
            <Input
              id="lead-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={l.phone}
              disabled={loading}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <label className="flex items-start gap-2 text-xs text-muted-foreground">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5"
            />
            <span>
              {language === 'ru'
                ? 'Согласен на обработку данных согласно '
                : language === 'de'
                  ? 'Ich stimme der Datenverarbeitung gemäß '
                  : 'I agree to data processing according to '}
              <Link to={`/${language}/datenschutz`} className="underline">Datenschutz</Link>
              {' / '}
              <Link to={`/${language}/impressum`} className="underline">Impressum</Link>
            </span>
          </label>

          <Button 
            type="submit" 
            disabled={loading || !email.trim() || !consent}
            className="w-full"
          >
            {loading ? l.submitting : l.submit}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default LeadCapture;
