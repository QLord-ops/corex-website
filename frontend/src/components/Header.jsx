import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export const Header = () => {
  const { t, language, setLanguage } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Track scroll for subtle header background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close mobile menu on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobileMenuOpen]);
  
  const scrollToSection = (sectionId) => {
    setIsMobileMenuOpen(false);
    
    const targetMap = {
      'explore': 1,
      'how': 3.5,
      'proof': 6.5,
      'contact': 9.5
    };
    
    const multiplier = targetMap[sectionId] || 0;
    const targetY = window.innerHeight * multiplier;
    
    window.scrollTo({
      top: targetY,
      behavior: 'smooth'
    });
  };
  
  return (
    <>
      {/* Fixed Header */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
          isScrolled ? 'bg-background/80 backdrop-blur-sm' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Company Name - System Label Style */}
            <div className="flex-shrink-0">
              <span className="text-sm sm:text-base font-medium tracking-[0.25em] text-foreground/90">
                AIONEX
              </span>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <button
                onClick={() => scrollToSection('how')}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                {t('header.howItWorks')}
              </button>
              <span className="text-muted-foreground/30">·</span>
              <button
                onClick={() => scrollToSection('proof')}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                {t('header.proof')}
              </button>
              <span className="text-muted-foreground/30">·</span>
              <button
                onClick={() => scrollToSection('contact')}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                {t('header.contact')}
              </button>
              <span className="text-muted-foreground/30">·</span>
              <Link
                to="/builder"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                Конструктор
              </Link>
              <span className="text-muted-foreground/30">·</span>
              {/* Language Switcher */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 uppercase">
                    {language}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[100px]">
                  <DropdownMenuItem onClick={() => setLanguage('en')}>
                    English
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLanguage('de')}>
                    Deutsch
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Toggle menu"
            >
              <div className="w-5 h-4 flex flex-col justify-between">
                <span 
                  className={`block h-px bg-current transition-transform duration-300 ${
                    isMobileMenuOpen ? 'translate-y-1.5 rotate-45' : ''
                  }`}
                />
                <span 
                  className={`block h-px bg-current transition-opacity duration-300 ${
                    isMobileMenuOpen ? 'opacity-0' : ''
                  }`}
                />
                <span 
                  className={`block h-px bg-current transition-transform duration-300 ${
                    isMobileMenuOpen ? '-translate-y-1.5 -rotate-45' : ''
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
        
        {/* Mobile Menu - Minimal dropdown, not full screen */}
        <div 
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            isMobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="bg-background/95 backdrop-blur-sm border-t border-border/50">
            <nav className="px-4 py-4 space-y-1">
              <button
                onClick={() => scrollToSection('explore')}
                className="block w-full text-left py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {t('header.explore')}
              </button>
              <button
                onClick={() => scrollToSection('how')}
                className="block w-full text-left py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {t('header.howItWorks')}
              </button>
              <button
                onClick={() => scrollToSection('proof')}
                className="block w-full text-left py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {t('header.proof')}
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="block w-full text-left py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {t('header.contact')}
              </button>
              <Link
                to="/builder"
                className="block w-full text-left py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Конструктор
              </Link>
              {/* Mobile Language Switcher */}
              <div className="border-t border-border/50 pt-3 mt-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => setLanguage('en')}
                    className={`flex-1 py-2 text-xs uppercase transition-colors ${
                      language === 'en' 
                        ? 'text-foreground font-medium' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    English
                  </button>
                  <span className="text-muted-foreground/30">|</span>
                  <button
                    onClick={() => setLanguage('de')}
                    className={`flex-1 py-2 text-xs uppercase transition-colors ${
                      language === 'de' 
                        ? 'text-foreground font-medium' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Deutsch
                  </button>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
};
