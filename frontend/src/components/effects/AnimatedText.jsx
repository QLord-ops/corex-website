import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export const AnimatedText = ({ 
  children, 
  className = '', 
  delay = 0,
  duration = 0.8,
  once = true,
  as = 'div'
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once, 
    margin: "-10% 0px -10% 0px",
    amount: 0.3
  });
  
  const MotionComponent = motion[as] || motion.div;
  
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
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  
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
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  
  const words = text.split(' ');
  
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
