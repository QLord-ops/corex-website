import { useRef, useEffect, useState } from 'react';
import { motion, useInView, useScroll, useTransform, useSpring } from 'framer-motion';
import { AnimatedText } from '../effects/AnimatedText';
import { useLanguage } from '@/i18n/LanguageContext';

const ease = [0.22, 1, 0.36, 1];

const stats = [
  { value: "+38%", num: 38, prefix: "+", suffix: "%", labelKey: "sceneProof.stats.0" },
  { value: "-29%", num: 29, prefix: "-", suffix: "%", labelKey: "sceneProof.stats.1" },
  { value: "2-6", num: null, prefix: "", suffix: "", labelKey: "sceneProof.stats.2" },
  { value: "24h", num: 24, prefix: "", suffix: "h", labelKey: "sceneProof.stats.3" }
];

const AnimatedNumber = ({ num, prefix, suffix, fallback, className }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const spring = useSpring(0, { duration: 1800, bounce: 0 });
  const rounded = useTransform(spring, (v) => Math.round(v));
  const [cur, setCur] = useState(0);

  useEffect(() => { if (inView && num !== null) spring.set(num); }, [inView, num, spring]);
  useEffect(() => { if (num === null) return; return rounded.on('change', setCur); }, [rounded, num]);

  if (num === null) return <span ref={ref} className={className}>{inView ? fallback : '\u00A0'}</span>;
  return <span ref={ref} className={className}>{inView ? `${prefix}${cur}${suffix}` : '\u00A0'}</span>;
};

const StatItem = ({ stat, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const { t } = useLanguage();
  
  return (
    <motion.div
      ref={ref}
      className="text-center px-2 sm:px-4 xl:px-6 group"
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ 
        duration: 0.9, 
        delay: index * 0.18,
        ease
      }}
    >
      {/* Glow dot above */}
      <motion.div
        className="w-1 h-1 rounded-full bg-primary/50 mx-auto mb-4 sm:mb-6"
        initial={{ scale: 0, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : {}}
        transition={{ delay: index * 0.18 + 0.3, duration: 0.4 }}
      />

      <motion.div
        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold text-foreground tracking-tight mb-2 sm:mb-3 xl:mb-4"
        initial={{ scale: 0.7, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : {}}
        transition={{ 
          duration: 0.7, 
          delay: index * 0.18 + 0.1,
          type: "spring",
          stiffness: 120,
          damping: 14
        }}
      >
        <AnimatedNumber num={stat.num} prefix={stat.prefix} suffix={stat.suffix} fallback={stat.value} />
      </motion.div>

      {/* Animated underline */}
      <motion.div
        className="w-8 sm:w-10 xl:w-12 h-px bg-primary/30 mx-auto mb-3 sm:mb-4"
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ delay: index * 0.18 + 0.5, duration: 0.5, ease }}
      />

      <motion.div
        className="text-xs sm:text-sm xl:text-base text-muted-foreground leading-snug"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: index * 0.18 + 0.6, duration: 0.5 }}
      >
        {t(stat.labelKey)}
      </motion.div>
    </motion.div>
  );
};

export const SceneProof = () => {
  const { t } = useLanguage();
  const sectionRef = useRef(null);
  const transitionRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: transitionRef,
    offset: ["start end", "end start"]
  });
  
  const transitionOpacity = useTransform(scrollYProgress, [0.3, 0.5, 0.7], [0, 1, 0.8]);
  const transitionY = useTransform(scrollYProgress, [0.3, 0.5], [50, 0]);
  
  return (
    <section ref={sectionRef} className="relative">
      {/* Section intro */}
      <div className="min-h-[30vh] sm:min-h-[40vh] flex items-end justify-center pb-8 sm:pb-12 xl:pb-16 px-5 sm:px-6 xl:px-12">
        <AnimatedText className="text-center">
          <span className="text-[10px] sm:text-xs xl:text-sm uppercase tracking-[0.3em] text-muted-foreground block mb-3 sm:mb-4">
            {t('sceneProof.intro')}
          </span>
          <h2 className="text-scene-body text-foreground/80">
            {t('sceneProof.title')}
          </h2>
          <p className="text-xs sm:text-sm xl:text-base text-muted-foreground mt-3 sm:mt-4 max-w-md sm:max-w-xl xl:max-w-2xl mx-auto">
            {t('sceneProof.subtitle')}
          </p>
        </AnimatedText>
      </div>
      
      {/* Stats grid */}
      <div className="min-h-[50vh] sm:min-h-[60vh] flex items-center justify-center px-5 sm:px-6 xl:px-12">
        <div className="max-w-sm sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl w-full">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-12 xl:gap-16">
            {stats.map((stat, index) => (
              <StatItem key={index} stat={stat} index={index} />
            ))}
          </div>
          
          {/* Animated decorative divider */}
          <motion.div
            className="mt-12 sm:mt-16 xl:mt-20 flex items-center justify-center gap-3"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1 }}
          >
            <motion.div
              className="h-px bg-gradient-to-r from-transparent to-primary/30 w-16 sm:w-24"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1.1, duration: 0.6, ease }}
              style={{ transformOrigin: 'right' }}
            />
            <div className="flex gap-2">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-primary/50"
                  animate={{ 
                    scale: [1, 1.4, 1],
                    opacity: [0.4, 1, 0.4]
                  }}
                  transition={{ 
                    duration: 2.5,
                    delay: i * 0.3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
            <motion.div
              className="h-px bg-gradient-to-l from-transparent to-primary/30 w-16 sm:w-24"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1.1, duration: 0.6, ease }}
              style={{ transformOrigin: 'left' }}
            />
          </motion.div>
        </div>
      </div>
      
      {/* Transition statement */}
      <div 
        ref={transitionRef}
        className="min-h-[40vh] sm:min-h-[50vh] flex items-center justify-center px-5 sm:px-6 xl:px-12"
      >
        <motion.div 
          className="max-w-md sm:max-w-2xl xl:max-w-3xl text-center"
          style={{ opacity: transitionOpacity, y: transitionY }}
        >
          <div className="w-12 sm:w-16 xl:w-20 h-px bg-border mx-auto mb-6 sm:mb-8 xl:mb-10" />
          <p className="text-scene-body text-foreground/70 italic">
            {t('sceneProof.quote')}
          </p>
          <div className="w-12 sm:w-16 xl:w-20 h-px bg-border mx-auto mt-6 sm:mt-8 xl:mt-10" />
        </motion.div>
      </div>
    </section>
  );
};
