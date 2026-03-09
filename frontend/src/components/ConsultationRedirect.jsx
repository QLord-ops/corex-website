import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const ConsultationRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to homepage
    navigate('/', { replace: true });
    
    // Scroll to bot section after a short delay to ensure page is loaded
    setTimeout(() => {
      const botSection = document.getElementById('consultation-bot');
      if (botSection) {
        botSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        // Fallback: calculate approximate position of bot section (before SceneAction)
        const targetY = window.innerHeight * 8.5;
        window.scrollTo({
          top: targetY,
          behavior: 'smooth'
        });
      }
    }, 300);
  }, [navigate]);

  return null;
};
