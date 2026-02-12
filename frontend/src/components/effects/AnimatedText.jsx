import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

// Detect mobile and reduced motion
const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export const AnimatedText = ({ 
  children, 
  className = '', 
  delay = 0,
  duration = 0.8,
  once = true,
  as = 'div'
}) => {
  const ref = useRef(null);
  const mobile = isMobile();
  const reducedMotion = prefersReducedMotion();
  const isInView = useInView(ref, { 
    once, 
    margin: mobile ? "0px" : "-10% 0px -10% 0px",
    amount: mobile ? 0.1 : 0.3
  });
  
  const MotionComponent = motion[as] || motion.div;
  
  // Simplified animation for mobile
  if (mobile || reducedMotion) {
    return (
      <MotionComponent
        ref={ref}
        className={className}
        initial={false}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3, delay }}
      >
        {children}
      </MotionComponent>
    );
  }
  
  return (
    <MotionComponent
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ 
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1]
      }}
    >
      {children}
    </MotionComponent>
  );
};

export const AnimatedLine = ({ 
  className = '',
  delay = 0,
  direction = 'horizontal'
}) => {
  const ref = useRef(null);
  const mobile = isMobile();
  const reducedMotion = prefersReducedMotion();
  const isInView = useInView(ref, { once: true, margin: mobile ? "0px" : "-10%" });
  
  if (mobile || reducedMotion) {
    return (
      <div
        ref={ref}
        className={`bg-primary/30 ${className}`}
        style={{ opacity: isInView ? 1 : 0, transition: 'opacity 0.3s' }}
      />
    );
  }
  
  return (
    <motion.div
      ref={ref}
      className={`bg-primary/30 ${className}`}
      initial={{ 
        scaleX: direction === 'horizontal' ? 0 : 1,
        scaleY: direction === 'vertical' ? 0 : 1,
      }}
      animate={isInView ? { 
        scaleX: 1,
        scaleY: 1,
      } : {}}
      transition={{ 
        duration: 1.2,
        delay,
        ease: [0.22, 1, 0.36, 1]
      }}
      style={{ transformOrigin: direction === 'horizontal' ? 'left' : 'top' }}
    />
  );
};

export const StaggeredText = ({ 
  text, 
  className = '',
  wordClassName = '',
  staggerDelay = 0.05,
  initialDelay = 0
}) => {
  const ref = useRef(null);
  const mobile = isMobile();
  const reducedMotion = prefersReducedMotion();
  const isInView = useInView(ref, { once: true, margin: mobile ? "0px" : "-10%" });
  
  const words = text.split(' ');
  
  // Simplified for mobile - no stagger
  if (mobile || reducedMotion) {
    return (
      <div ref={ref} className={className} style={{ opacity: isInView ? 1 : 0, transition: 'opacity 0.3s' }}>
        {text}
      </div>
    );
  }
  
  return (
    <div ref={ref} className={className}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          className={`inline-block mr-[0.25em] ${wordClassName}`}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.6,
            delay: initialDelay + index * staggerDelay,
            ease: [0.22, 1, 0.36, 1]
          }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
};
