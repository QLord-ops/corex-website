import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

export const SceneAction = () => {
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
    // Simulated form submission
    setSubmitted(true);
    setTimeout(() => {
      setFormState({ name: '', email: '', message: '' });
    }, 500);
  };
  
  return (
    <section 
      ref={sectionRef}
      className="min-h-[100dvh] flex items-center justify-center relative px-4 sm:px-6 py-12 sm:pb-24"
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
            Let's bring order to your system.
          </h2>
          <p className="text-scene-small text-muted-foreground">
            No forms, no funnels. Just a conversation.
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
                    Name
                  </label>
                  <Input
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    placeholder="Your name"
                    className="bg-secondary/50 border-border focus:border-primary/50 transition-colors"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-muted-foreground">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    placeholder="your@email.com"
                    className="bg-secondary/50 border-border focus:border-primary/50 transition-colors"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-muted-foreground">
                  What do you need?
                </label>
                <Textarea
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  placeholder="Brief description of your challenge..."
                  rows={4}
                  className="bg-secondary/50 border-border focus:border-primary/50 transition-colors resize-none"
                />
              </div>
              
              <Button 
                type="submit"
                className="w-full bg-primary/90 hover:bg-primary text-primary-foreground transition-all duration-300"
                size="lg"
              >
                Start the conversation
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
                >
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.div>
              <h3 className="text-scene-body mb-2">Message received</h3>
              <p className="text-scene-small text-muted-foreground">
                We'll be in touch within 24 hours.
              </p>
              <Button 
                variant="ghost" 
                className="mt-6 text-muted-foreground hover:text-foreground"
                onClick={() => setSubmitted(false)}
              >
                Send another message
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
            Quiet confidence. No hype. Just systems that work.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
