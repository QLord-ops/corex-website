// Device detection and performance optimization utilities

export const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const isLowEndDevice = () => {
  if (typeof window === 'undefined') return false;
  const isMobileDevice = isMobile();
  const hasLowMemory = navigator.deviceMemory && navigator.deviceMemory < 4;
  const hasSlowConnection = navigator.connection && (
    navigator.connection.effectiveType === 'slow-2g' || 
    navigator.connection.effectiveType === '2g'
  );
  return isMobileDevice || hasLowMemory || hasSlowConnection;
};

export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export const shouldReduceAnimations = () => {
  return isLowEndDevice() || prefersReducedMotion();
};
