export const SUPPORTED_LANGUAGES = ["en", "de", "ru", "uk"];

export const LANGUAGE_LABELS = {
  en: "EN",
  de: "DE",
  ru: "RU",
  uk: "UK",
};

export const translations = {
  en: {
    meta: {
      title: "AIONEX - Digital Systems & Automation",
      description:
        "AIONEX helps businesses build digital systems, automate operations, and run stable full-stack solutions.",
      keywords:
        "AIONEX, digital systems, automation, process optimization, full-stack development",
    },
    header: {
      language: "Language",
      logoTitle: "AIONEX — Home",
      nav: {
        explore: "Explore",
        how: "Services",
        about: "About",
        cases: "Cases",
        proof: "Results",
        faq: "FAQ",
        contact: "Contact",
      },
    },
    progress: {
      entry: "Entry",
      pain: "Pain",
      how: "How",
      about: "About",
      cases: "Cases",
      proof: "Proof",
      faq: "FAQ",
      decision: "Decision",
      action: "Action",
    },
    sceneEntry: {
      headline: "AIONEX — website development, process automation and CRM implementation.",
      subline:
        "We design and build digital systems that reduce manual work and speed up business processes.",
      explainer:
        "Analysis • development • integrations • support",
      bullets: ["Proven", "Reliable", "Fast"],
      primaryCta: "Free initial consultation",
      cta: "Book a meeting",
    },
    scenePain: {
      intro: "Typical problems in companies",
      points: [
        "Projects stall.",
        "No clear ownership.",
        "Manual work kills growth.",
        "Systems are not integrated.",
      ],
    },
    sceneHow: {
      intro: "What we do",
      title: "Core services for SMB teams",
      steps: [
        {
          text: "Business system design",
          description: "We map your workflow and define the right digital architecture.",
        },
        {
          text: "Web and product development",
          description: "We build customer portals, websites, and internal tools.",
        },
        {
          text: "Automation and integrations",
          description: "We connect CRM, forms, communication, and repetitive operations.",
        },
        {
          text: "Support and optimization",
          description: "We monitor, improve, and scale the system with your team.",
        },
      ],
    },
    sceneProof: {
      intro: "The results",
      title: "Typical business outcomes",
      subtitle: "Typical ranges from our projects.",
      stats: [
        "qualified leads",
        "less internal coordination",
        "weeks to launch",
        "support response",
      ],
      quote: "Built for businesses that need stability, not experiments.",
    },
    sceneDecision: {
      lines: ["No sales.", "No experiments.", "Just systems that work."],
      badges: ["Proven", "Secure", "Fast"],
    },
    sceneAction: {
      title: "Contact",
      subtitle: "Describe your project. We'll get back to you with a clear implementation plan.",
      labels: {
        name: "Name",
        email: "Email",
        company: "Company",
        phone: "Phone",
        need: "Project description",
      },
      placeholders: {
        name: "Your name",
        email: "your@email.com",
        company: "Your company",
        phone: "+49 ...",
        message: "Brief description of your project...",
      },
      loading: "Sending...",
      errorText: "Request failed. Please try again.",
      consentText: "I agree to data processing for contact purposes according to",
      consentError: "Please confirm data processing consent.",
      secondaryCall: "Book a meeting now",
      secondaryEmail: "Send email",
      cta: "Start the conversation",
      successTitle: "Message received",
      successText: "We'll be in touch within 24 hours.",
      sendAnother: "Send another message",
      footnote: "Quiet confidence. No hype. Just systems that work.",
      responseOwner: "Initial response by Yevhenii Stolovoi, Founder.",
    },
    sceneAbout: {
      intro: "About us",
      title: "AIONEX is a delivery-focused digital partner for SMB.",
      description:
        "We combine strategy, implementation, and support so your team can move faster with less operational chaos.",
      items: [
        { title: "B2B focus", text: "We work with SMB teams that need reliable execution." },
        { title: "One team", text: "Analysis, development, automation, and support in one workflow." },
        { title: "Practical delivery", text: "Clear scope, predictable milestones, and measurable outcomes." }
      ],
    },
    sceneCases: {
      intro: "Cases",
      title: "Project examples",
      labels: {
        problem: "Problem",
        solution: "Solution",
        result: "Result",
      },
      items: [
        {
          client: "NordWerk GmbH",
          industry: "Manufacturing",
          title: "Sales funnel and lead automation",
          challenge: "Requests were handled manually and leads were lost.",
          solution: "Automated lead process and CRM integration.",
          result: "+38% more qualified leads within 3 months.",
          metric: "+38% qualified leads in 3 months",
        },
        {
          client: "KlarConsult",
          industry: "Professional services",
          title: "Client portal and workflow standardization",
          challenge: "Projects lacked transparency for both team and clients.",
          solution: "Unified project workflow and client portal rollout.",
          result: "-29% internal coordination effort.",
          metric: "-29% internal coordination time",
        },
        {
          client: "UrbanCart",
          industry: "E-commerce",
          title: "CRM + support process integration",
          challenge: "Support and sales data were split across tools.",
          solution: "Connected CRM, support inbox, and ticket handover.",
          result: "-36% time to first response.",
          metric: "-36% first response time",
        },
      ],
    },
    sceneFaq: {
      intro: "FAQ",
      title: "Frequently asked questions",
      items: [
        {
          q: "How quickly can we start?",
          a: "Usually within a few days after scope alignment and access setup.",
        },
        {
          q: "Do you only build websites?",
          a: "No. We also build internal tools, automation flows, and CRM integrations.",
        },
        {
          q: "Can you support us after launch?",
          a: "Yes. We provide ongoing support, optimization, and iterative improvements.",
        },
        {
          q: "Do you work with small teams?",
          a: "Yes. Our main focus is small and medium B2B companies.",
        },
      ],
    },
    sceneTrust: {
      title: "Trusted by companies",
      description:
        "Companies from manufacturing, services, and e-commerce use our systems to automate processes and stabilize their digital infrastructure.",
      note: "References are shared in direct conversation on request.",
    },
    sceneWhy: {
      title: "Why companies work with us",
      items: [
        "Clear ownership",
        "Technical depth",
        "Fast execution",
        "Long-term operations",
      ],
    },
    sceneProjectTransparency: {
      title: "Typical projects",
      sizeLabel: "Project size",
      sizeValue: "2000 - 10000 EUR",
      durationLabel: "Project duration",
      durationValue: "2 - 6 weeks",
      teamLabel: "Team",
      teamValue: "2 - 4 developers",
    },
    sceneIndustries: {
      title: "Industries",
      items: ["Manufacturing", "Services", "E-commerce", "SaaS", "B2B sales"],
    },
    sceneTech: {
      title: "Technologies",
      items: ["Next.js", "Node.js", "PostgreSQL", "API integrations", "CRM systems", "Automation"],
    },
    sceneProcess: {
      title: "Project process",
      steps: ["Analysis", "System design", "Development", "Integration", "Operations"],
    },
    sceneSupport: {
      title: "Support",
      items: [
        "Technical operations",
        "Continuous improvement",
        "Automation updates",
        "Integration of new tools",
      ],
      modelsTitle: "Support models",
      models: ["Retainer", "Hourly packages", "Project-based"],
    },
  },
  de: {
    meta: {
      title: "AIONEX - Digitale Systeme und Automatisierung",
      description:
        "AIONEX unterstützt kleine und mittlere Unternehmen in Deutschland beim Aufbau digitaler Systeme, der Automatisierung von Prozessen und dem stabilen Betrieb von Softwarelösungen.",
      keywords:
        "AIONEX, digitale Systeme, Automatisierung, Prozessoptimierung, Softwareentwicklung, Mittelstand",
    },
    header: {
      language: "Sprache",
      logoTitle: "AIONEX — Startseite",
      nav: {
        explore: "Überblick",
        how: "Leistungen",
        about: "Warum wir",
        cases: "Cases",
        proof: "Ergebnisse",
        faq: "FAQ",
        contact: "Kontakt",
      },
    },
    progress: {
      entry: "Start",
      pain: "Probleme",
      how: "Leistungen",
      about: "Warum wir",
      cases: "Cases",
      proof: "Ergebnisse",
      faq: "FAQ",
      decision: "Entscheidung",
      action: "Kontakt",
    },
    sceneEntry: {
      headline: "AIONEX — Website-Entwicklung, Prozessautomatisierung und CRM-Einführung.",
      subline:
        "Wir konzipieren und bauen digitale Systeme, die manuelle Arbeit reduzieren und Geschäftsprozesse beschleunigen.",
      explainer:
        "Analyse • Entwicklung • Integrationen • Support",
      bullets: ["Bewährt", "Sicher", "Schnell"],
      primaryCta: "Kostenlose Erstberatung",
      cta: "Termin buchen",
    },
    scenePain: {
      intro: "Typische Probleme im Unternehmen",
      points: [
        "Projekte geraten ins Stocken.",
        "Keine klare Verantwortung.",
        "Manuelle Prozesse bremsen Wachstum.",
        "Systeme sind nicht integriert.",
      ],
    },
    sceneHow: {
      intro: "Unsere Leistungen",
      title: "Unsere Leistungen",
      steps: [
        {
          text: "System- und Prozessdesign",
          description: "Wir analysieren Abläufe und entwickeln eine klare digitale Architektur.",
        },
        {
          text: "Web- und Produktentwicklung",
          description: "Individuelle Software, Kundenportale und interne Tools.",
        },
        {
          text: "Automatisierung und Integrationen",
          description: "CRM, Formulare, Kommunikation und Datenflüsse verbinden.",
        },
        {
          text: "Betrieb und Weiterentwicklung",
          description: "Wir begleiten Systeme langfristig und entwickeln sie weiter.",
        },
      ],
    },
    sceneProof: {
      intro: "Ergebnisse",
      title: "Ergebnisse",
      subtitle: "Typische Spannen aus unseren Projekten.",
      stats: [
        "mehr qualifizierte Leads",
        "weniger interne Abstimmung",
        "Wochen bis zum Launch",
        "Antwortzeit im Support",
      ],
      quote: "Gebaut für Unternehmen, die Stabilität statt Experimente brauchen.",
    },
    sceneDecision: {
      lines: ["Kein Vertriebstheater.", "Keine Experimente.", "Nur Systeme, die funktionieren."],
      badges: ["Bewährt", "Sicher", "Schnell"],
    },
    sceneAction: {
      title: "Kontakt",
      subtitle: "Beschreiben Sie Ihr Projekt. Wir melden uns mit einem klaren Vorschlag.",
      labels: {
        name: "Name",
        email: "E-Mail",
        company: "Unternehmen",
        phone: "Telefon",
        need: "Projektbeschreibung",
      },
      placeholders: {
        name: "Ihr Name",
        email: "ihre@email.de",
        company: "Ihr Unternehmen",
        phone: "+49 ...",
        message: "Kurze Beschreibung Ihres Projekts...",
      },
      loading: "Wird gesendet...",
      errorText: "Anfrage konnte nicht gesendet werden. Bitte erneut versuchen.",
      consentText: "Ich stimme der Datenverarbeitung zum Zweck der Kontaktaufnahme gemäß",
      consentError: "Bitte stimmen Sie der Datenverarbeitung zu.",
      secondaryCall: "Termin direkt buchen",
      secondaryEmail: "Per E-Mail kontaktieren",
      cta: "Gespräch starten",
      successTitle: "Nachricht erhalten",
      successText: "Wir melden uns innerhalb von 24 Stunden.",
      sendAnother: "Weitere Nachricht senden",
      footnote: "Ruhige Sicherheit. Kein Hype. Nur funktionierende Systeme.",
      responseOwner: "Erstkontakt durch Yevhenii Stolovoi, Founder.",
    },
    sceneCases: {
      intro: "Cases",
      title: "Projektbeispiele",
      labels: {
        problem: "Problem",
        solution: "Lösung",
        result: "Ergebnis",
      },
      items: [
        {
          client: "NordWerk GmbH",
          industry: "Produktion",
          title: "Leadprozess und Vertriebsautomatisierung",
          challenge: "Anfragen wurden manuell verarbeitet und Leads gingen verloren.",
          solution: "Automatisierter Leadprozess und CRM-Integration.",
          result: "+38 % mehr qualifizierte Leads innerhalb von 3 Monaten.",
          metric: "+38 % qualifizierte Leads in 3 Monaten",
        },
        {
          client: "KlarConsult",
          industry: "Dienstleistung",
          title: "Kundenportal und Prozessstandardisierung",
          challenge: "Projekte waren für Team und Kunden zu intransparent.",
          solution: "Standardisierte Workflows und ein zentrales Kundenportal.",
          result: "–29 % interner Abstimmungsaufwand.",
          metric: "-29% interner Abstimmungsaufwand",
        },
        {
          client: "UrbanCart",
          industry: "E-Commerce",
          title: "CRM- und Support-Integration",
          challenge: "Daten lagen in mehreren Systemen ohne klare Verbindung.",
          solution: "Verknüpfung von CRM, Support und internen Prozessen.",
          result: "–36 % Zeit bis zur ersten Antwort.",
          metric: "-36% Zeit bis zur ersten Antwort",
        },
      ],
    },
    sceneFaq: {
      intro: "FAQ",
      title: "Häufige Fragen",
      items: [
        {
          q: "Wie schnell können wir starten?",
          a: "In der Regel innerhalb weniger Tage nach Abstimmung von Umfang und Zugängen.",
        },
        {
          q: "Arbeiten Sie auch mit kleinen Teams?",
          a: "Ja. Unser Fokus liegt auf kleinen und mittleren B2B-Unternehmen mit 10 bis 500 Mitarbeitenden.",
        },
        {
          q: "Bauen Sie nur Websites?",
          a: "Nein. Wir entwickeln auch interne Tools, Integrationen und Automatisierungen für operative Prozesse.",
        },
        {
          q: "Begleiten Sie Projekte auch langfristig?",
          a: "Ja. Wir übernehmen auf Wunsch Betrieb, Wartung und kontinuierliche Weiterentwicklung.",
        },
      ],
    },
    sceneTrust: {
      title: "Vertrauen von Unternehmen",
      description:
        "Unternehmen aus Produktion, Dienstleistung und E-Commerce nutzen unsere Systeme, um Prozesse zu automatisieren und ihre digitale Infrastruktur zu stabilisieren.",
      note: "Referenzen teilen wir auf Anfrage im persönlichen Gespräch.",
    },
    sceneWhy: {
      title: "Warum wir",
      items: [
        "Klare Verantwortung",
        "Technische Tiefe",
        "Schnelle Umsetzung",
        "Langfristiger Betrieb",
      ],
    },
    sceneProjectTransparency: {
      title: "Typische Projekte",
      sizeLabel: "Projektgröße",
      sizeValue: "2000 - 10000 €",
      durationLabel: "Projektlaufzeit",
      durationValue: "2 - 6 Wochen",
      teamLabel: "Team",
      teamValue: "2 - 4 Entwickler",
    },
    sceneIndustries: {
      title: "Branchen",
      items: ["Produktion", "Dienstleistung", "E-Commerce", "SaaS", "B2B Vertrieb"],
    },
    sceneTech: {
      title: "Technologien",
      items: ["Next.js", "Node.js", "PostgreSQL", "API Integrationen", "CRM Systeme", "Automation"],
    },
    sceneProcess: {
      title: "Der Projektablauf",
      steps: ["Analyse", "Systemdesign", "Entwicklung", "Integration", "Betrieb"],
    },
    sceneSupport: {
      title: "Support",
      items: [
        "Technischer Betrieb",
        "Weiterentwicklung",
        "Automatisierungen",
        "Integration neuer Tools",
      ],
      modelsTitle: "Supportmodelle",
      models: ["Retainer", "Stundenpakete", "Projektbasiert"],
    },
  },
  ru: {
    meta: {
      title: "AIONEX - Цифровые системы и автоматизация",
      description:
        "AIONEX помогает бизнесу строить цифровые системы, автоматизировать процессы и поддерживать стабильные full-stack решения.",
      keywords:
        "AIONEX, цифровые системы, автоматизация, оптимизация процессов, full-stack разработка",
    },
    header: {
      language: "Язык",
      logoTitle: "AIONEX — на главную",
      nav: {
        explore: "Обзор",
        how: "Услуги",
        about: "О нас",
        cases: "Кейсы",
        proof: "Результаты",
        faq: "FAQ",
        contact: "Контакт",
      },
    },
    progress: {
      entry: "Старт",
      pain: "Проблемы",
      how: "Услуги",
      about: "Почему мы",
      cases: "Кейсы",
      proof: "Результаты",
      faq: "FAQ",
      decision: "Выбор",
      action: "Контакт",
    },
    sceneEntry: {
      headline: "AIONEX — разработка сайтов, автоматизация процессов и внедрение CRM-систем.",
      subline:
        "Мы проектируем и создаём цифровые системы, которые уменьшают ручную работу и ускоряют бизнес-процессы.",
      explainer:
        "Анализ • разработка • интеграции • поддержка",
      bullets: ["Проверено", "Надежно", "Быстро"],
      primaryCta: "Бесплатная первичная консультация",
      cta: "Забронировать встречу",
    },
    scenePain: {
      intro: "Типичные проблемы в компании",
      points: [
        "Проекты буксуют.",
        "Нет понятной ответственности.",
        "Ручные процессы тормозят рост.",
        "Системы не интегрированы между собой.",
      ],
    },
    sceneHow: {
      intro: "Наши услуги",
      title: "Чем мы реально помогаем бизнесу",
      steps: [
        {
          text: "Проектирование системы",
          description: "Анализируем процессы и проектируем цифровую архитектуру под задачи бизнеса.",
        },
        {
          text: "Веб и продуктовая разработка",
          description: "Создаем сайты, клиентские кабинеты и внутренние сервисы.",
        },
        {
          text: "Автоматизация и интеграции",
          description: "Соединяем CRM, заявки, коммуникации и рутинные операции.",
        },
        {
          text: "Поддержка и развитие",
          description: "Сопровождаем систему и улучшаем ее вместе с вашей командой.",
        },
      ],
    },
    sceneProof: {
      intro: "Результаты",
      title: "Проверено на реальных проектах",
      subtitle: "Типичные диапазоны по нашим проектам.",
      stats: [
        "квалифицированные лиды",
        "меньше внутренней координации",
        "недель до запуска",
        "ответ поддержки",
      ],
      quote: "Сделано для бизнеса, которому нужна стабильность, а не эксперименты.",
    },
    sceneDecision: {
      lines: ["Без продажного шума.", "Без экспериментов.", "Только системы, которые работают."],
      badges: ["Проверено", "Надежно", "Быстро"],
    },
    sceneAction: {
      title: "Контакт",
      subtitle: "Опишите ваш проект. Мы вернемся с понятным планом реализации.",
      labels: {
        name: "Имя",
        email: "Email",
        company: "Компания",
        phone: "Телефон",
        need: "Описание проекта",
      },
      placeholders: {
        name: "Ваше имя",
        email: "your@email.com",
        company: "Ваша компания",
        phone: "+49 ...",
        message: "Кратко опишите ваш проект...",
      },
      loading: "Отправка...",
      errorText: "Не удалось отправить заявку. Попробуйте еще раз.",
      consentText: "Я согласен на обработку данных для связи в соответствии с",
      consentError: "Подтвердите согласие на обработку данных.",
      secondaryCall: "Забронировать встречу сразу",
      secondaryEmail: "Написать на email",
      cta: "Начать разговор",
      successTitle: "Сообщение получено",
      successText: "Свяжемся с вами в течение 24 часов.",
      sendAnother: "Отправить еще сообщение",
      footnote: "Спокойная уверенность. Без хайпа. Только работающие системы.",
      responseOwner: "Первичный ответ: Yevhenii Stolovoi, Founder.",
    },
    sceneCases: {
      intro: "Кейсы",
      title: "Примеры проектов",
      labels: {
        problem: "Проблема",
        solution: "Решение",
        result: "Результат",
      },
      items: [
        {
          client: "NordWerk GmbH",
          industry: "Производство",
          title: "Автоматизация входящих лидов",
          challenge: "Запросы обрабатывались вручную, и лиды терялись.",
          solution: "Автоматизированный лид-процесс и интеграция с CRM.",
          result: "+38% квалифицированных лидов за 3 месяца.",
          metric: "+38% квалифицированных лидов за 3 месяца",
        },
        {
          client: "KlarConsult",
          industry: "Сервисный бизнес",
          title: "Клиентский портал и стандартизация процессов",
          challenge: "Не хватало прозрачности по проектам для команды и клиента.",
          solution: "Единый клиентский портал и стандартизированные рабочие процессы.",
          result: "-29% внутренней координационной нагрузки.",
          metric: "-29% времени на внутреннюю координацию",
        },
        {
          client: "UrbanCart",
          industry: "E-commerce",
          title: "Интеграция CRM и поддержки",
          challenge: "Данные были разрознены в разных инструментах.",
          solution: "Связали CRM, поддержку и внутренние процессы в единую систему.",
          result: "-36% времени до первого ответа.",
          metric: "-36% время первого ответа",
        },
      ],
    },
    sceneFaq: {
      intro: "FAQ",
      title: "Частые вопросы",
      items: [
        {
          q: "Как быстро можно стартовать?",
          a: "Обычно в течение нескольких дней после согласования объема и доступов.",
        },
        {
          q: "Работаете с небольшими командами?",
          a: "Да. Наш фокус - компании малого и среднего бизнеса от 10 до 500 сотрудников.",
        },
        {
          q: "Вы делаете только сайты?",
          a: "Нет. Мы также внедряем внутренние инструменты, интеграции и автоматизацию процессов.",
        },
        {
          q: "Сопровождаете ли вы проекты долгосрочно?",
          a: "Да. Берем на себя поддержку, развитие и стабильную эксплуатацию после запуска.",
        },
      ],
    },
    sceneTrust: {
      title: "Нам доверяют компании",
      description:
        "Компании из производства, услуг и e-commerce используют наши системы, чтобы автоматизировать процессы и стабилизировать цифровую инфраструктуру.",
      note: "Референсы предоставляем по запросу в личном общении.",
    },
    sceneWhy: {
      title: "Почему выбирают нас",
      items: [
        "Четкая ответственность",
        "Глубокая техническая экспертиза",
        "Быстрый запуск",
        "Долгосрочная эксплуатация",
      ],
    },
    sceneProjectTransparency: {
      title: "Типичные проекты",
      sizeLabel: "Бюджет проекта",
      sizeValue: "2000 - 10000 €",
      durationLabel: "Срок проекта",
      durationValue: "2 - 6 недель",
      teamLabel: "Команда",
      teamValue: "2 - 4 разработчика",
    },
    sceneIndustries: {
      title: "Отрасли",
      items: ["Производство", "Услуги", "E-commerce", "SaaS", "B2B продажи"],
    },
    sceneTech: {
      title: "Технологии",
      items: ["Next.js", "Node.js", "PostgreSQL", "API интеграции", "CRM системы", "Автоматизация"],
    },
    sceneProcess: {
      title: "Процесс проекта",
      steps: ["Анализ", "Системный дизайн", "Разработка", "Интеграция", "Эксплуатация"],
    },
    sceneSupport: {
      title: "Поддержка",
      items: [
        "Техническая эксплуатация",
        "Развитие системы",
        "Автоматизации",
        "Интеграция новых инструментов",
      ],
      modelsTitle: "Модели поддержки",
      models: ["Retainer", "Пакеты часов", "Проектный формат"],
    },
  },
  uk: {
    meta: {
      title: "AIONEX - Цифрові системи та автоматизація",
      description:
        "AIONEX допомагає бізнесу будувати цифрові системи, автоматизувати процеси та підтримувати стабільні full-stack рішення.",
      keywords:
        "AIONEX, цифрові системи, автоматизація, оптимізація процесів, full-stack розробка",
    },
    header: {
      language: "Мова",
      logoTitle: "AIONEX — на головну",
      nav: {
        explore: "Огляд",
        how: "Послуги",
        about: "Про нас",
        cases: "Кейси",
        proof: "Результати",
        faq: "FAQ",
        contact: "Контакт",
      },
    },
    progress: {
      entry: "Старт",
      pain: "Проблеми",
      how: "Послуги",
      about: "Чому ми",
      cases: "Кейси",
      proof: "Результати",
      faq: "FAQ",
      decision: "Вибір",
      action: "Контакт",
    },
    sceneEntry: {
      headline: "AIONEX — розробка сайтів, автоматизація процесів та впровадження CRM-систем.",
      subline:
        "Ми проектуємо та створюємо цифрові системи, які зменшують ручну роботу та прискорюють бізнес-процеси.",
      explainer:
        "Аналіз • розробка • інтеграції • підтримка",
      bullets: ["Перевірено", "Надійно", "Швидко"],
      primaryCta: "Безкоштовна первинна консультація",
      cta: "Забронювати зустріч",
    },
    scenePain: {
      intro: "Типові проблеми в компанії",
      points: [
        "Проєкти гальмують.",
        "Немає зрозумілої відповідальності.",
        "Ручні процеси гальмують зростання.",
        "Системи не інтегровані між собою.",
      ],
    },
    sceneHow: {
      intro: "Наші послуги",
      title: "Чим ми практично допомагаємо бізнесу",
      steps: [
        {
          text: "Проєктування системи",
          description: "Аналізуємо процеси та формуємо цифрову архітектуру під ваші цілі.",
        },
        {
          text: "Веб та продуктова розробка",
          description: "Створюємо сайти, клієнтські кабінети та внутрішні інструменти.",
        },
        {
          text: "Автоматизація та інтеграції",
          description: "Поєднуємо CRM, заявки, комунікації та рутинні операції.",
        },
        {
          text: "Підтримка та розвиток",
          description: "Супроводжуємо систему та покращуємо її разом з вашою командою.",
        },
      ],
    },
    sceneProof: {
      intro: "Результати",
      title: "Перевірено на реальних проєктах",
      subtitle: "Типові діапазони за нашими проєктами.",
      stats: [
        "кваліфіковані ліди",
        "менше внутрішньої координації",
        "тижнів до запуску",
        "відповідь підтримки",
      ],
      quote: "Створено для бізнесу, якому потрібна стабільність, а не експерименти.",
    },
    sceneDecision: {
      lines: ["Без продажного шуму.", "Без експериментів.", "Лише системи, що працюють."],
      badges: ["Перевірено", "Безпечно", "Швидко"],
    },
    sceneAction: {
      title: "Контакт",
      subtitle: "Опишіть ваш проєкт. Ми повернемося з чітким планом впровадження.",
      labels: {
        name: "Ім'я",
        email: "Email",
        company: "Компанія",
        phone: "Телефон",
        need: "Опис проєкту",
      },
      placeholders: {
        name: "Ваше ім'я",
        email: "your@email.com",
        company: "Ваша компанія",
        phone: "+49 ...",
        message: "Коротко опишіть ваш проєкт...",
      },
      loading: "Надсилання...",
      errorText: "Не вдалося надіслати запит. Спробуйте ще раз.",
      consentText: "Я погоджуюся на обробку даних для зв'язку згідно з",
      consentError: "Підтвердіть згоду на обробку даних.",
      secondaryCall: "Забронювати зустріч одразу",
      secondaryEmail: "Написати на email",
      cta: "Почати розмову",
      successTitle: "Повідомлення отримано",
      successText: "Зв'яжемося з вами протягом 24 годин.",
      sendAnother: "Надіслати ще повідомлення",
      footnote: "Спокійна впевненість. Без хайпу. Лише системи, що працюють.",
      responseOwner: "Першу відповідь надає Yevhenii Stolovoi, Founder.",
    },
    sceneCases: {
      intro: "Кейси",
      title: "Приклади проєктів",
      labels: {
        problem: "Проблема",
        solution: "Рішення",
        result: "Результат",
      },
      items: [
        {
          client: "NordWerk GmbH",
          industry: "Виробництво",
          title: "Автоматизація вхідних лідів",
          challenge: "Запити оброблялися вручну, а ліди втрачалися.",
          solution: "Автоматизований лід-процес і інтеграція з CRM.",
          result: "+38% кваліфікованих лідів за 3 місяці.",
          metric: "+38% кваліфікованих лідів за 3 місяці",
        },
        {
          client: "KlarConsult",
          industry: "Сервісний бізнес",
          title: "Клієнтський портал і стандартизація процесів",
          challenge: "Бракувало прозорості проєктів для команди та клієнта.",
          solution: "Єдиний клієнтський портал і стандартизовані робочі процеси.",
          result: "-29% внутрішнього координаційного навантаження.",
          metric: "-29% часу на внутрішню координацію",
        },
        {
          client: "UrbanCart",
          industry: "E-commerce",
          title: "Інтеграція CRM і підтримки",
          challenge: "Дані були розкидані між різними інструментами.",
          solution: "Поєднали CRM, підтримку та внутрішні процеси в єдину систему.",
          result: "-36% часу до першої відповіді.",
          metric: "-36% час до першої відповіді",
        },
      ],
    },
    sceneFaq: {
      intro: "FAQ",
      title: "Поширені запитання",
      items: [
        {
          q: "Як швидко можна стартувати?",
          a: "Зазвичай протягом кількох днів після узгодження обсягу та доступів.",
        },
        {
          q: "Працюєте з невеликими командами?",
          a: "Так. Наш фокус - малий і середній бізнес із командою від 10 до 500 співробітників.",
        },
        {
          q: "Ви робите лише сайти?",
          a: "Ні. Ми також впроваджуємо внутрішні інструменти, інтеграції та автоматизацію процесів.",
        },
        {
          q: "Супроводжуєте проєкти довгостроково?",
          a: "Так. Беремо на себе підтримку, розвиток і стабільну експлуатацію після запуску.",
        },
      ],
    },
    sceneTrust: {
      title: "Нам довіряють компанії",
      description:
        "Компанії з виробництва, сервісу та e-commerce використовують наші системи, щоб автоматизувати процеси та стабілізувати цифрову інфраструктуру.",
      note: "Референси надаємо за запитом у персональному спілкуванні.",
    },
    sceneWhy: {
      title: "Чому обирають нас",
      items: [
        "Чітка відповідальність",
        "Глибока технічна експертиза",
        "Швидкий запуск",
        "Довгострокова експлуатація",
      ],
    },
    sceneProjectTransparency: {
      title: "Типові проєкти",
      sizeLabel: "Бюджет проєкту",
      sizeValue: "2000 - 10000 €",
      durationLabel: "Тривалість проєкту",
      durationValue: "2 - 6 тижнів",
      teamLabel: "Команда",
      teamValue: "2 - 4 розробники",
    },
    sceneIndustries: {
      title: "Галузі",
      items: ["Виробництво", "Послуги", "E-commerce", "SaaS", "B2B продажі"],
    },
    sceneTech: {
      title: "Технології",
      items: ["Next.js", "Node.js", "PostgreSQL", "API інтеграції", "CRM системи", "Автоматизація"],
    },
    sceneProcess: {
      title: "Процес проєкту",
      steps: ["Аналіз", "Системний дизайн", "Розробка", "Інтеграція", "Експлуатація"],
    },
    sceneSupport: {
      title: "Підтримка",
      items: [
        "Технічна експлуатація",
        "Розвиток системи",
        "Автоматизації",
        "Інтеграція нових інструментів",
      ],
      modelsTitle: "Моделі підтримки",
      models: ["Retainer", "Пакети годин", "Проєктний формат"],
    },
  },
};
