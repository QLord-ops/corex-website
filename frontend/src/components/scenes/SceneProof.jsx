import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { AnimatedText } from '../effects/AnimatedText';

const stats = [
  { value: "+38%", label: "qualified leads", prefix: "", suffix: "" },
  { value: "-42%", label: "manual operations", prefix: "", suffix: "" },
  { value: "2-6", label: "weeks to launch", prefix: "", suffix: "" },
  { value: "24h", label: "support response", prefix: "", suffix: "" }
];

const StatItem = ({ stat, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  
  return (
    <motion.div
      ref={ref}
      className="text-center px-4"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.15,
        ease: [0.22, 1, 0.36, 1]
      }}
    >
      <motion.div
        className="stat-value mb-2"
        initial={{ scale: 0.8 }}
        animate={isInView ? { scale: 1 } : {}}
        transition={{ 
          duration: 0.6, 
          delay: index * 0.15 + 0.2,
          type: "spring",
          stiffness: 150
        }}
      >
        {stat.value}
      </motion.div>
      <div className="stat-label">{stat.label}</div>
    </motion.div>
  );
};

export const SceneProof = () => {
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
      <div className="min-h-[40vh] flex items-end justify-center pb-12 px-6">
        <AnimatedText className="text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground block mb-4">
            The results
          </span>
          <h2 className="text-scene-body text-foreground/80">
            Proven in real projects
          </h2>
        </AnimatedText>
      </div>
      
      {/* Stats grid */}
      <div className="min-h-[60vh] flex items-center justify-center px-6">
        <div className="max-w-4xl w-full">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat, index) => (
              <StatItem key={index} stat={stat} index={index} />
            ))}
          </div>
          
          {/* Subtle decorative element */}
          <motion.div 
            className="mt-16 flex justify-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex gap-2">
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-primary/40"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.4, 0.8, 0.4]
                  }}
                  transition={{ 
                    duration: 2,
                    delay: i * 0.2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Transition statement */}
      <div 
        ref={transitionRef}
        className="min-h-[50vh] flex items-center justify-center px-6"
      >
        <motion.div 
          className="max-w-3xl text-center"
          style={{ opacity: transitionOpacity, y: transitionY }}
        >
          <div className="w-16 h-px bg-border mx-auto mb-8" />
          <p className="text-scene-body text-foreground/70 italic">
            Built for businesses that need stability, not experiments.
          </p>
          <div className="w-16 h-px bg-border mx-auto mt-8" />
        </motion.div>
      </div>
    </section>
  );
};
