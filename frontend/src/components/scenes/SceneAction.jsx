import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { useLanguage } from '@/i18n/LanguageContext';
import { Link } from 'react-router-dom';
import { trackEvent } from '@/lib/analytics';

export const SceneAction = () => {
  const { t, language } = useLanguage();
  const sectionRef = useRef(null);
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
  const isInView = useInView(sectionRef, { 
    once: true, 
    margin: "-10% 0px -10% 0px" 
  });
  
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    consent: false,
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [trackedView, setTrackedView] = useState(false);

  useEffect(() => {
    if (isInView && !trackedView) {
      trackEvent('contact_form_view', { language, source: 'landing_contact_form' });
      setTrackedView(true);
    }
  }, [isInView, language, trackedView]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formState.consent) {
      setError(t('sceneAction.consentError'));
      trackEvent('contact_form_submit_fail', {
        language,
        reason: 'missing_consent',
      });
      return;
    }

    setLoading(true);
    trackEvent('contact_form_submit_attempt', { language, source: 'landing_contact_form' });
    try {
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formState.name.trim(),
          email: formState.email.trim(),
          company: formState.company.trim() || undefined,
          phone: formState.phone.trim() || undefined,
          message: formState.message.trim(),
          language,
          source: 'landing_contact_form',
          consent: formState.consent,
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || t('sceneAction.errorText'));
      }

      setSubmitted(true);
      trackEvent('contact_form_submit_success', { language, source: 'landing_contact_form' });
      setFormState({
        name: '',
        email: '',
        company: '',
        phone: '',
        consent: false,
        message: '',
      });
    } catch (err) {
      setError(err.message || t('sceneAction.errorText'));
      trackEvent('contact_form_submit_fail', {
        language,
        reason: err.message || 'request_failed',
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <section 
      ref={sectionRef}
      className="min-h-[90dvh] sm:min-h-[100dvh] flex items-center justify-center relative px-4 sm:px-6 pt-10 sm:pt-12 pb-32 sm:pb-14 lg:pb-24"
    >
      <div className="max-w-xl w-full">
        {/* Headline */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="text-scene-statement mb-4">
            {t('sceneAction.title')}
          </h2>
          <p className="text-scene-small text-muted-foreground">
            {t('sceneAction.subtitle')}
          </p>
        </motion.div>
        
        {/* Contact form placeholder */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-muted-foreground">
                    {t('sceneAction.labels.name')}
                  </label>
                  <Input
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    placeholder={t('sceneAction.placeholders.name')}
                    className="bg-secondary/50 border-border focus:border-primary/50 transition-colors"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-muted-foreground">
                    {t('sceneAction.labels.email')}
                  </label>
                  <Input
                    type="email"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    placeholder={t('sceneAction.placeholders.email')}
                    className="bg-secondary/50 border-border focus:border-primary/50 transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-muted-foreground">
                    {t('sceneAction.labels.company')}
                  </label>
                  <Input
                    value={formState.company}
                    onChange={(e) => setFormState({ ...formState, company: e.target.value })}
                    placeholder={t('sceneAction.placeholders.company')}
                    className="bg-secondary/50 border-border focus:border-primary/50 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-muted-foreground">
                    {t('sceneAction.labels.phone')}
                  </label>
                  <Input
                    value={formState.phone}
                    onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                    placeholder={t('sceneAction.placeholders.phone')}
                    className="bg-secondary/50 border-border focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-muted-foreground">
                  {t('sceneAction.labels.need')}
                </label>
                <Textarea
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  placeholder={t('sceneAction.placeholders.message')}
                  rows={4}
                  className="bg-secondary/50 border-border focus:border-primary/50 transition-colors resize-none"
                  required
                />
              </div>

              <label className="flex items-start gap-2 sm:gap-3 text-xs text-muted-foreground">
                <input
                  type="checkbox"
                  checked={formState.consent}
                  onChange={(e) => setFormState({ ...formState, consent: e.target.checked })}
                  className="mt-0.5 shrink-0"
                />
                <span>
                  {t('sceneAction.consentText')}{' '}
                  <Link to={`/${language}/datenschutz`} className="underline hover:text-foreground">
                    Datenschutz
                  </Link>{' '}
                  /{' '}
                  <Link to={`/${language}/impressum`} className="underline hover:text-foreground">
                    Impressum
                  </Link>
                </span>
              </label>

              {error ? (
                <p className="text-sm text-destructive">{error}</p>
              ) : null}
              
              <Button 
                type="submit"
                className="w-full bg-primary/90 hover:bg-primary text-primary-foreground transition-all duration-300"
                size="lg"
                disabled={loading}
              >
                {loading ? t('sceneAction.loading') : t('sceneAction.cta')}
              </Button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href={process.env.REACT_APP_BOOK_CALL_URL || 'mailto:aionex.info@gmail.com'}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center px-4 py-2 text-sm border border-border rounded-sm text-muted-foreground hover:text-foreground hover:border-border transition-colors"
                >
                  {t('sceneAction.secondaryCall')}
                </a>
                <a
                  href="mailto:aionex.info@gmail.com"
                  className="inline-flex items-center justify-center px-4 py-2 text-sm border border-border rounded-sm text-muted-foreground hover:text-foreground hover:border-border transition-colors"
                >
                  {t('sceneAction.secondaryEmail')}
                </a>
              </div>
            </form>
          ) : (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <svg 
                  width="32" 
                  height="32" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-primary"
                >
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.div>
              <h3 className="text-scene-body mb-2">{t('sceneAction.successTitle')}</h3>
              <p className="text-scene-small text-muted-foreground">
                {t('sceneAction.successText')}
              </p>
              <Button 
                variant="ghost" 
                className="mt-6 text-muted-foreground hover:text-foreground"
                onClick={() => setSubmitted(false)}
              >
                {t('sceneAction.sendAnother')}
              </Button>
            </motion.div>
          )}
        </motion.div>
        
        {/* Footer note */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
        >
          <p className="text-xs text-muted-foreground/60">
            {t('sceneAction.footnote')}
          </p>
          <p className="text-xs text-muted-foreground/60 mt-2">
            {t('sceneAction.responseOwner')}
          </p>
        </motion.div>
      </div>
    </section>
  );
};
