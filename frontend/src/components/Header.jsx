import { useState, useEffect } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useLocation, useNavigate } from 'react-router-dom';

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { t, language, setLanguage, supportedLanguages, languageLabels } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Track scroll for subtle header background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const scrollToSection = (sectionId) => {
    setIsMobileMenuOpen(false);

    const targetBasePath = `/${language}`;
    const targetPathWithHash = `${targetBasePath}#${sectionId}`;

    if (location.pathname !== targetBasePath) {
      navigate(targetPathWithHash);
      return;
    }

    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleLanguageSelect = (newLanguage) => {
    setLanguage(newLanguage);

    const parts = location.pathname.split('/').filter(Boolean);
    const firstPartIsLocale = supportedLanguages.includes(parts[0]);
    const restPath = firstPartIsLocale ? parts.slice(1).join('/') : '';
    const normalizedRestPath = restPath ? `/${restPath}` : '';
    const hash = window.location.hash || '';
    navigate(`/${newLanguage}${normalizedRestPath}${hash}`);
  };

  const goToLegalPage = (slug) => {
    setIsMobileMenuOpen(false);
    navigate(`/${language}/${slug}`);
  };

  const handleLogoClick = () => {
    setIsMobileMenuOpen(false);
    const homePath = `/${language}`;

    if (location.pathname !== homePath || window.location.hash) {
      navigate(homePath);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
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
            {/* Company Logo */}
            <div className="flex-shrink-0">
              <button
                onClick={handleLogoClick}
                className="inline-flex items-center hover:opacity-90 transition-opacity"
                aria-label="Go to homepage"
              >
                <img
                  src="/aionex-logo.png"
                  alt="AIONEX"
                  title={t('header.logoTitle')}
                  className="h-8 sm:h-10 w-auto"
                />
              </button>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden xl:flex items-center gap-5 2xl:gap-8">
              <a
                href={`/${language}#how`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('how');
                }}
                className="text-xs 2xl:text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 whitespace-nowrap"
              >
                {t('header.nav.how')}
              </a>
              <span className="text-muted-foreground/30">·</span>
              <a
                href={`/${language}#about`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('about');
                }}
                className="text-xs 2xl:text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 whitespace-nowrap"
              >
                {t('header.nav.about')}
              </a>
              <span className="text-muted-foreground/30">·</span>
              <a
                href={`/${language}#cases`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('cases');
                }}
                className="text-xs 2xl:text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 whitespace-nowrap"
              >
                {t('header.nav.cases')}
              </a>
              <span className="text-muted-foreground/30">·</span>
              <a
                href={`/${language}#proof`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('proof');
                }}
                className="text-xs 2xl:text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 whitespace-nowrap"
              >
                {t('header.nav.proof')}
              </a>
              <span className="text-muted-foreground/30">·</span>
              <a
                href={`/${language}#faq`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('faq');
                }}
                className="text-xs 2xl:text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 whitespace-nowrap"
              >
                {t('header.nav.faq')}
              </a>
              <span className="text-muted-foreground/30">·</span>
              <a
                href={`/${language}#contact`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('contact');
                }}
                className="text-xs 2xl:text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 whitespace-nowrap"
              >
                {t('header.nav.contact')}
              </a>
              <span className="text-muted-foreground/30">·</span>
              <button
                onClick={() => goToLegalPage('impressum')}
                className="text-xs 2xl:text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 whitespace-nowrap"
              >
                Impressum
              </button>
              <span className="text-muted-foreground/30">·</span>
              <button
                onClick={() => goToLegalPage('datenschutz')}
                className="text-xs 2xl:text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 whitespace-nowrap"
              >
                Datenschutz
              </button>
              <span className="text-muted-foreground/30">·</span>
              <select
                value={language}
                onChange={(e) => handleLanguageSelect(e.target.value)}
                className="bg-transparent text-xs text-muted-foreground hover:text-foreground border border-border/60 px-2 py-1 rounded-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                aria-label="Language selector"
              >
                {supportedLanguages.map((langCode) => (
                  <option key={langCode} value={langCode} className="bg-background text-foreground">
                    {languageLabels[langCode]}
                  </option>
                ))}
              </select>
            </nav>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
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
          className={`xl:hidden overflow-hidden transition-all duration-300 ${
            isMobileMenuOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="bg-background/95 backdrop-blur-sm border-t border-border/50 max-h-[80vh] overflow-y-auto">
            <nav className="px-4 py-4 space-y-1">
              <a
                href={`/${language}#how`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('how');
                }}
                className="block w-full text-left py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {t('header.nav.how')}
              </a>
              <a
                href={`/${language}#proof`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('proof');
                }}
                className="block w-full text-left py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {t('header.nav.proof')}
              </a>
              <a
                href={`/${language}#about`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('about');
                }}
                className="block w-full text-left py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {t('header.nav.about')}
              </a>
              <a
                href={`/${language}#cases`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('cases');
                }}
                className="block w-full text-left py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {t('header.nav.cases')}
              </a>
              <a
                href={`/${language}#faq`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('faq');
                }}
                className="block w-full text-left py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {t('header.nav.faq')}
              </a>
              <a
                href={`/${language}#contact`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('contact');
                }}
                className="block w-full text-left py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {t('header.nav.contact')}
              </a>
              <button
                onClick={() => goToLegalPage('impressum')}
                className="block w-full text-left py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Impressum
              </button>
              <button
                onClick={() => goToLegalPage('datenschutz')}
                className="block w-full text-left py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Datenschutz
              </button>
              <div className="pt-2">
                <label className="text-xs uppercase tracking-wider text-muted-foreground/70">
                  {t('header.language')}
                </label>
                <select
                  value={language}
                  onChange={(e) => handleLanguageSelect(e.target.value)}
                  className="mt-2 w-full bg-transparent text-sm text-muted-foreground hover:text-foreground border border-border/60 px-2 py-2 rounded-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                  aria-label="Language selector"
                >
                  {supportedLanguages.map((langCode) => (
                    <option key={langCode} value={langCode} className="bg-background text-foreground">
                      {languageLabels[langCode]}
                    </option>
                  ))}
                </select>
              </div>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
};
