import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { shouldReduceAnimations } from '@/utils/device';

export const AnimatedText = ({ 
  children, 
  className = '', 
  delay = 0,
  duration = 0.8,
  once = true,
  as = 'div'
}) => {
  const ref = useRef(null);
  const [reduceAnimations, setReduceAnimations] = useState(false);
  const isInView = useInView(ref, { 
    once, 
    margin: "-10% 0px -10% 0px",
    amount: 0.3
  });
  
  useEffect(() => {
    setReduceAnimations(shouldReduceAnimations());
  }, []);
  
  if (reduceAnimations) {
    const Component = as === 'div' ? 'div' : as;
    return <Component ref={ref} className={className}>{children}</Component>;
  }
  
  const MotionComponent = motion[as] || motion.div;
  
  return (
    <MotionComponent
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ 
        duration: duration * 0.7, // Faster on mobile
        delay: delay * 0.5, // Less delay
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
  const [reduceAnimations, setReduceAnimations] = useState(false);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  
  useEffect(() => {
    setReduceAnimations(shouldReduceAnimations());
  }, []);
  
  if (reduceAnimations) {
    return <div ref={ref} className={`bg-primary/30 ${className}`} />;
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
        duration: 0.8,
        delay: delay * 0.5,
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
  const [reduceAnimations, setReduceAnimations] = useState(false);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  
  useEffect(() => {
    setReduceAnimations(shouldReduceAnimations());
  }, []);
  
  const words = text.split(' ');
  
  if (reduceAnimations) {
    return (
      <div ref={ref} className={className}>
        {words.map((word, index) => (
          <span key={index} className={`inline-block mr-[0.25em] ${wordClassName}`}>
            {word}
          </span>
        ))}
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
            duration: 0.4,
            delay: initialDelay + index * staggerDelay * 0.5,
            ease: [0.22, 1, 0.36, 1]
          }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
};
