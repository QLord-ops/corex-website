import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { useTranslation } from '@/hooks/useTranslation';

export const SceneAction = () => {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { 
    once: true, 
    margin: "-10% 0px -10% 0px" 
  });
  
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setFormState({ name: '', email: '', message: '' });
    }, 500);
  };
  
  return (
    <footer 
      ref={sectionRef}
      className="min-h-[100dvh] flex items-center justify-center relative px-4 sm:px-6 py-12 sm:pb-24"
    >
      <div className="max-w-xl w-full">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="text-scene-statement mb-4">
            {t('action.title')}
          </h2>
          <p className="text-scene-small text-muted-foreground">
            {t('action.subtitle')}
          </p>
        </motion.div>
        
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6" aria-label="Contact form">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="contact-name" className="text-xs uppercase tracking-wider text-muted-foreground">
                    {t('action.form.name')}
                  </label>
                  <Input
                    id="contact-name"
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    placeholder={t('action.form.name')}
                    className="bg-secondary/50 border-border focus:border-primary/50 transition-colors"
                    required
                    aria-label={t('action.form.name')}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="contact-email" className="text-xs uppercase tracking-wider text-muted-foreground">
                    {t('action.form.email')}
                  </label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    placeholder={t('action.form.email')}
                    className="bg-secondary/50 border-border focus:border-primary/50 transition-colors"
                    required
                    aria-label={t('action.form.email')}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="contact-message" className="text-xs uppercase tracking-wider text-muted-foreground">
                  {t('action.form.message')}
                </label>
                <Textarea
                  id="contact-message"
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  placeholder={t('action.form.messagePlaceholder')}
                  rows={4}
                  className="bg-secondary/50 border-border focus:border-primary/50 transition-colors resize-none"
                  aria-label={t('action.form.message')}
                />
              </div>
              
              <Button 
                type="submit"
                className="w-full bg-primary/90 hover:bg-primary text-primary-foreground transition-all duration-300"
                size="lg"
              >
                {t('action.form.submit')}
              </Button>
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
                  aria-hidden="true"
                >
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.div>
              <h3 className="text-scene-body mb-2">{t('action.form.successTitle')}</h3>
              <p className="text-scene-small text-muted-foreground">
                {t('action.form.successMessage')}
              </p>
              <Button 
                variant="ghost" 
                className="mt-6 text-muted-foreground hover:text-foreground"
                onClick={() => setSubmitted(false)}
              >
                {t('action.form.sendAnother')}
              </Button>
            </motion.div>
          )}
        </motion.div>
        
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
        >
          <p className="text-xs text-muted-foreground/60">
            {t('action.footer')}
          </p>
        </motion.div>
      </div>
    </footer>
  );
};
