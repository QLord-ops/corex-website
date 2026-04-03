import { useLanguage } from '@/i18n/LanguageContext';
import { AnimatedText } from '../effects/AnimatedText';
import { motion, useInView, useSpring, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

const ease = [0.22, 1, 0.36, 1];

const Counter = ({ value, className }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const num = parseInt(value, 10);
  const ok = !isNaN(num);
  const suffix = ok ? value.replace(String(num), '') : '';
  const spring = useSpring(0, { duration: 1600, bounce: 0 });
  const rounded = useTransform(spring, (v) => Math.round(v));
  const [cur, setCur] = useState(0);
  useEffect(() => { if (inView && ok) spring.set(num); }, [inView, ok, num, spring]);
  useEffect(() => { if (!ok) return; return rounded.on('change', setCur); }, [rounded, ok]);
  return <span ref={ref} className={className}>{inView ? (ok ? `${cur}${suffix}` : value) : '\u00A0'}</span>;
};

const Reveal = ({ children, className = '', delay = 0 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-8% 0px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease }} className={className}>
      {children}
    </motion.div>
  );
};

/* ═══════════════════════════════════════
   HERO
   ═══════════════════════════════════════ */
const Hero = ({ t }) => {
  const d = t('sceneTrust');
  const kpis = d.kpis || [];
  return (
    <div className="min-h-[50vh] sm:min-h-[60vh] lg:min-h-[65vh] flex flex-col items-center justify-center text-center px-5 sm:px-6 lg:px-8 xl:px-12">
      <AnimatedText>
        <span className="text-[10px] sm:text-xs xl:text-sm uppercase tracking-[0.3em] text-muted-foreground block mb-4 sm:mb-6">
          Trust & Reliability
        </span>
        <h2 className="text-scene-statement text-glow mb-4 sm:mb-5">{d.title}</h2>
        <p className="text-scene-small text-muted-foreground max-w-md sm:max-w-lg md:max-w-2xl xl:max-w-3xl mx-auto">{d.description}</p>
      </AnimatedText>

      <div className="mt-12 sm:mt-16 md:mt-20 xl:mt-24 flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-0 w-full max-w-xs sm:max-w-lg md:max-w-2xl xl:max-w-4xl">
        {kpis.map((k, i) => (
          <Reveal key={i} delay={0.15 * i} className="text-center flex-1 relative">
            {i > 0 && <div className="absolute left-1/2 -top-4 -translate-x-1/2 h-px w-12 bg-border/50 sm:hidden" />}
            {i > 0 && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-10 xl:h-14 bg-border/60 hidden sm:block" />}
            <Counter value={k.value} className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold text-foreground tracking-tight" />
            <span className="mt-1.5 sm:mt-2 xl:mt-3 block text-[10px] sm:text-xs xl:text-sm uppercase tracking-[0.15em] sm:tracking-[0.2em] text-muted-foreground">{k.label}</span>
          </Reveal>
        ))}
      </div>

      <motion.div className="mt-10 sm:mt-16 flex gap-2" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.8 }}>
        {[0, 1, 2].map((i) => (
          <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-primary/40"
            animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2.5, delay: i * 0.25, repeat: Infinity, ease: 'easeInOut' }} />
        ))}
      </motion.div>
    </div>
  );
};

/* ═══════════════════════════════════════
   WHY AIONEX — numbered value grid
   ═══════════════════════════════════════ */
const WhyAionex = ({ t }) => {
  const d = t('sceneWhy');
  const items = d.items || [];
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-8%' });

  return (
    <div ref={ref} className="flex items-center justify-center px-5 sm:px-6 lg:px-8 xl:px-12 py-14 sm:py-20 lg:py-28 xl:py-32">
      <div className="max-w-sm sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl w-full">
        <AnimatedText className="text-center mb-10 sm:mb-14 lg:mb-20 xl:mb-24">
          <span className="text-[10px] sm:text-xs xl:text-sm uppercase tracking-[0.3em] text-muted-foreground block mb-3 sm:mb-4">Our Advantage</span>
          <h2 className="text-scene-body text-foreground/80">{d.title}</h2>
        </AnimatedText>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 md:gap-x-14 lg:gap-x-16 xl:gap-x-24 gap-y-10 sm:gap-y-14 lg:gap-y-16 xl:gap-y-20">
          {items.map((item, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 + i * 0.12, duration: 0.6, ease }}
              className="group relative pl-12 sm:pl-14 lg:pl-16 xl:pl-20"
              whileHover={{ x: 4 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}>

              <span className="absolute left-0 top-0 text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground/20 group-hover:text-primary/30 leading-none select-none tracking-tight transition-colors duration-500">
                {String(i + 1).padStart(2, '0')}
              </span>

              <motion.div
                className="absolute left-8 sm:left-10 lg:left-12 xl:left-16 top-1 w-px bg-border/50 group-hover:bg-primary/40 transition-colors duration-500"
                initial={{ height: 0 }}
                animate={inView ? { height: '100%' } : {}}
                transition={{ delay: 0.2 + i * 0.12, duration: 0.5, ease }}
              />

              <h4 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-medium text-foreground/90 mb-1.5 sm:mb-2 xl:mb-3 tracking-tight group-hover:text-foreground transition-colors duration-300">
                {item.title}
              </h4>
              <p className="text-[13px] sm:text-sm xl:text-base text-muted-foreground leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════
   TRANSPARENCY — stat band
   ═══════════════════════════════════════ */
const Transparency = ({ t }) => {
  const d = t('sceneProjectTransparency');
  const items = d.items || [];
  return (
    <div className="flex items-center justify-center px-5 sm:px-6 lg:px-8 xl:px-12 py-12 sm:py-16 lg:py-20 xl:py-24">
      <div className="max-w-sm sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl w-full">
        <AnimatedText className="text-center mb-8 sm:mb-10 lg:mb-12 xl:mb-16">
          <span className="text-[10px] sm:text-xs xl:text-sm uppercase tracking-[0.3em] text-muted-foreground block mb-3 sm:mb-4">Scope</span>
          <h3 className="text-scene-body text-foreground/80">{d.title}</h3>
        </AnimatedText>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-0">
          {items.map((item, i) => (
            <Reveal key={i} delay={i * 0.12} className="text-center flex-1 relative">
              {i > 0 && <div className="absolute left-1/2 -top-3 -translate-x-1/2 h-px w-10 bg-border/50 sm:hidden" />}
              {i > 0 && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-10 sm:h-12 xl:h-16 bg-border/50 hidden sm:block" />}
              <p className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-semibold text-foreground tracking-tight mb-1 xl:mb-2">{item.value}</p>
              <p className="text-[10px] sm:text-xs xl:text-sm uppercase tracking-[0.15em] text-muted-foreground">{item.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════
   INDUSTRIES & TECH — badge grid
   ═══════════════════════════════════════ */
const IndustriesTech = ({ t }) => {
  const ind = t('sceneIndustries');
  const tech = t('sceneTech');
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-8%' });

  return (
    <div ref={ref} className="py-12 sm:py-20 lg:py-24 xl:py-28 px-5 sm:px-6 lg:px-8 xl:px-12">
      <div className="max-w-sm sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto">
        {/* Industries */}
        <AnimatedText className="text-center mb-5 sm:mb-8 xl:mb-10">
          <span className="text-[10px] sm:text-xs xl:text-sm uppercase tracking-[0.3em] text-muted-foreground">{ind.title}</span>
        </AnimatedText>
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 xl:gap-4 mb-10 sm:mb-14 xl:mb-16">
          {(ind.items || []).map((name, i) => (
            <motion.span key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.1 + i * 0.06, duration: 0.4, ease }}
              className="px-3.5 py-1.5 sm:px-5 sm:py-2 xl:px-6 xl:py-2.5 text-xs sm:text-sm xl:text-base text-foreground border border-foreground/20 rounded-full bg-white/[0.03]
                         hover:border-primary/60 hover:text-primary hover:bg-primary/[0.06]
                         transition-all duration-300 cursor-default">
              {name}
            </motion.span>
          ))}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 sm:gap-4 mb-10 sm:mb-14 xl:mb-16">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-foreground/15 to-transparent" />
          <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-foreground/15 to-transparent" />
        </div>

        {/* Technologies */}
        <AnimatedText className="text-center mb-5 sm:mb-8 xl:mb-10">
          <span className="text-[10px] sm:text-xs xl:text-sm uppercase tracking-[0.3em] text-muted-foreground">{tech.title}</span>
        </AnimatedText>
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 xl:gap-4">
          {(tech.items || []).map((name, i) => (
            <motion.span key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.3 + i * 0.06, duration: 0.4, ease }}
              className="px-3.5 py-1.5 sm:px-5 sm:py-2 xl:px-6 xl:py-2.5 text-xs sm:text-sm xl:text-base font-mono text-foreground/90 border border-foreground/15 rounded-full bg-white/[0.03]
                         hover:border-primary/60 hover:text-primary hover:bg-primary/[0.06]
                         transition-all duration-300 cursor-default">
              {name}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════
   PROCESS — numbered stepper
   ═══════════════════════════════════════ */
const Process = ({ t }) => {
  const d = t('sceneProcess');
  const steps = d.steps || [];
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-8%' });

  return (
    <div ref={ref} className="py-12 sm:py-20 lg:py-24 xl:py-28 px-5 sm:px-6 lg:px-8 xl:px-12">
      <div className="max-w-sm sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto">
        <AnimatedText className="text-center mb-10 sm:mb-14 lg:mb-20 xl:mb-24">
          <span className="text-[10px] sm:text-xs xl:text-sm uppercase tracking-[0.3em] text-muted-foreground block mb-3 sm:mb-4">Workflow</span>
          <h2 className="text-scene-body text-foreground/80">{d.title}</h2>
        </AnimatedText>

        {/* Desktop horizontal stepper (md+) */}
        <div className="hidden md:block">
          <div className="relative">
            <div className="absolute top-6 xl:top-7 left-[10%] right-[10%] h-px overflow-hidden">
              <motion.div initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}}
                transition={{ duration: 1.4, delay: 0.15, ease }}
                className="h-full bg-gradient-to-r from-primary/20 via-foreground/15 to-primary/20 origin-left" />
            </div>

            <div className="grid grid-cols-5 relative z-10">
              {steps.map((step, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.2 + i * 0.12, duration: 0.5, ease }}
                  className="flex flex-col items-center text-center group cursor-default">

                  <motion.div
                    className="w-10 h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 rounded-full border border-foreground/20 bg-background flex items-center justify-center mb-3 lg:mb-4 xl:mb-5
                                    group-hover:border-primary/60 group-hover:bg-primary/[0.06] transition-colors duration-300 relative"
                    initial={{ scale: 0 }}
                    animate={inView ? { scale: 1 } : {}}
                    transition={{ delay: 0.3 + i * 0.15, type: 'spring', stiffness: 200, damping: 15 }}
                  >
                    <motion.div
                      className="absolute inset-0 rounded-full border border-primary/20"
                      initial={{ scale: 1, opacity: 0 }}
                      animate={inView ? { scale: [1, 1.6, 1.6], opacity: [0, 0.4, 0] } : {}}
                      transition={{ delay: 0.5 + i * 0.15, duration: 0.8, ease: 'easeOut' }}
                    />
                    <span className="text-xs lg:text-sm xl:text-base font-medium text-foreground/60 group-hover:text-primary transition-colors duration-300">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </motion.div>

                  <p className="text-xs lg:text-sm xl:text-base font-medium text-foreground group-hover:text-primary transition-colors duration-300">
                    {step}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Tablet 2-column grid (sm only) */}
        <div className="hidden sm:grid md:hidden grid-cols-2 gap-x-8 gap-y-6">
          {steps.map((step, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 + i * 0.08, duration: 0.5, ease }}
              className="flex items-center gap-4 group">
              <div className="w-9 h-9 rounded-full border border-foreground/20 bg-background flex items-center justify-center flex-shrink-0
                              group-hover:border-primary/60 group-hover:bg-primary/[0.06] transition-all duration-300">
                <span className="text-[11px] font-medium text-foreground/60 group-hover:text-primary transition-colors duration-300">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-300">{step}</p>
            </motion.div>
          ))}
        </div>

        {/* Mobile vertical */}
        <div className="sm:hidden">
          <div className="relative pl-14">
            <motion.div initial={{ scaleY: 0 }} animate={inView ? { scaleY: 1 } : {}}
              transition={{ duration: 1, delay: 0.2, ease }}
              className="absolute left-[18px] top-0 bottom-0 w-px bg-foreground/10 origin-top" />

            {steps.map((step, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="relative py-3.5 group">

                <div className="absolute left-[-20px] w-9 h-9 rounded-full border border-foreground/20 bg-background flex items-center justify-center
                                group-hover:border-primary/60 transition-all duration-300">
                  <span className="text-[11px] font-medium text-foreground/60 group-hover:text-primary transition-colors duration-300">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>

                <p className="text-sm font-medium text-foreground">{step}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════
   SUPPORT — framed two-column
   ═══════════════════════════════════════ */
const Support = ({ t }) => {
  const d = t('sceneSupport');
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });

  return (
    <div ref={ref} className="flex items-center justify-center px-5 sm:px-6 lg:px-8 xl:px-12 py-12 sm:py-16 lg:py-20 xl:py-24">
      <div className="max-w-sm sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl 2xl:max-w-5xl w-full">
        {/* Ornament */}
        <motion.div className="mb-8 sm:mb-12 lg:mb-16 xl:mb-20 flex items-center justify-center gap-3"
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.5 }}>
          <div className="w-8 sm:w-12 xl:w-16 h-px bg-border" />
          <div className="w-2 h-2 rotate-45 border border-primary/50" />
          <div className="w-8 sm:w-12 xl:w-16 h-px bg-border" />
        </motion.div>

        <AnimatedText className="text-center mb-8 sm:mb-12 lg:mb-14 xl:mb-16">
          <span className="text-[10px] sm:text-xs xl:text-sm uppercase tracking-[0.3em] text-muted-foreground block mb-3 sm:mb-4">After Launch</span>
          <h3 className="text-scene-body text-foreground">{d.title}</h3>
        </AnimatedText>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-0">
          {/* SLA */}
          <div className="md:pr-10 lg:pr-12 xl:pr-16 md:border-r md:border-foreground/10">
            <p className="text-[10px] sm:text-xs xl:text-sm uppercase tracking-[0.2em] text-foreground/50 mb-4 sm:mb-6 xl:mb-8">SLA Guarantees</p>
            <div className="space-y-4 sm:space-y-5 xl:space-y-6">
              {(d.features || []).map((item, i) => (
                <Reveal key={i} delay={i * 0.08} className="flex items-center gap-3 sm:gap-4 group">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 xl:w-8 xl:h-8 rounded-full border border-foreground/20 flex items-center justify-center flex-shrink-0 transition-colors duration-300 group-hover:border-primary/60">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-2.5 h-2.5 sm:w-3 sm:h-3 xl:w-3.5 xl:h-3.5 text-primary/60 group-hover:text-primary transition-colors duration-300">
                      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="text-[13px] sm:text-sm xl:text-base text-foreground group-hover:text-primary transition-colors duration-200">{item}</span>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Models */}
          <div className="md:pl-10 lg:pl-12 xl:pl-16">
            <p className="text-[10px] sm:text-xs xl:text-sm uppercase tracking-[0.2em] text-muted-foreground mb-4 sm:mb-6 xl:mb-8">{d.modelsTitle}</p>
            <div className="space-y-4 sm:space-y-5 xl:space-y-6">
              {(d.models || []).map((model, i) => (
                <Reveal key={i} delay={i * 0.1 + 0.15} className="flex items-center gap-3 sm:gap-4 group">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 xl:w-8 xl:h-8 rounded-full border border-foreground/20 flex items-center justify-center flex-shrink-0 transition-colors duration-300 group-hover:border-primary/60">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-2.5 h-2.5 sm:w-3 sm:h-3 xl:w-3.5 xl:h-3.5 text-primary/60 group-hover:text-primary transition-colors duration-300">
                      <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="text-[13px] sm:text-sm xl:text-base text-foreground group-hover:text-primary transition-colors duration-200">{model}</span>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        {/* Accent line */}
        <motion.div className="mt-10 sm:mt-14 xl:mt-16 w-24 sm:w-32 xl:w-40 h-0.5 mx-auto bg-gradient-to-r from-transparent via-primary/40 to-transparent"
          initial={{ scaleX: 0, opacity: 0 }} animate={inView ? { scaleX: 1, opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }} />
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════
   MAIN
   ═══════════════════════════════════════ */
const SectionDivider = () => (
  <motion.div
    className="flex items-center justify-center gap-3 py-4"
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true, margin: '-5%' }}
    transition={{ duration: 0.6 }}
  >
    <motion.div
      className="h-px w-12 sm:w-20 xl:w-28 bg-gradient-to-r from-transparent to-foreground/10"
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease }}
      style={{ transformOrigin: 'right' }}
    />
    <motion.div
      className="w-1 h-1 rounded-full bg-primary/40"
      initial={{ scale: 0 }}
      whileInView={{ scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
    />
    <motion.div
      className="h-px w-12 sm:w-20 xl:w-28 bg-gradient-to-l from-transparent to-foreground/10"
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease }}
      style={{ transformOrigin: 'left' }}
    />
  </motion.div>
);

export const SceneAbout = () => {
  const { t } = useLanguage();

  return (
    <section className="relative">
      <Hero t={t} />
      <SectionDivider />
      <WhyAionex t={t} />
      <SectionDivider />
      <Transparency t={t} />
      <SectionDivider />
      <IndustriesTech t={t} />
      <SectionDivider />
      <Process t={t} />
      <SectionDivider />
      <Support t={t} />
    </section>
  );
};
