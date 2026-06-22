export const SUPPORTED_LANGUAGES = ["en", "de"];

export const LANGUAGE_LABELS = {
  en: "English",
  de: "Deutsch",
};

export const translations = {
  en: {
    header: {
      logoTitle: "AIONEX",
      nav: {
        how: "How it works",
        services: "Services",
        about: "About",
        cases: "Cases",
        proof: "Proof",
        faq: "FAQ",
        contact: "Contact",
      },
      language: "Language",
    },

    progress: {
      entry: "Start",
      services: "Services",
      pain: "Problem",
      how: "Approach",
      about: "About",
      cases: "Cases",
      proof: "Proof",
      founder: "Founder",
      faq: "FAQ",
      pricing: "Pricing",
      decision: "Decision",
      action: "Contact",
    },

    sceneEntry: {
      headline: "AIONEX — AI Automation & Custom Software for Growing Businesses",
      subline:
        "We help companies reduce manual work, automate operations, and build custom business systems that scale.",
      badges: [
        "AI Automation",
        "Custom Web Applications",
        "CRM Systems",
        "Customer Portals",
        "Business Integrations",
        "Process Automation",
      ],
      primaryCta: "Book a free project assessment",
      cta: "See what we build",
    },

    sceneWhatWeBuild: {
      title: "What We Build",
      items: [
        {
          title: "AI Chatbots",
          description: "Automate support, lead qualification, and repetitive communication.",
        },
        {
          title: "Business Automation",
          description: "Reduce manual work and connect disconnected processes.",
        },
        {
          title: "CRM & Lead Systems",
          description: "Centralize sales operations and improve lead management.",
        },
        {
          title: "Customer Portals",
          description: "Provide clients with secure self-service access.",
        },
        {
          title: "Custom Web Applications",
          description: "Tailored software built around your business.",
        },
        {
          title: "System Integrations",
          description: "Connect existing tools into one efficient workflow.",
        },
      ],
    },

    scenePain: {
      intro: "The reality",
      points: [
        "Projects stall.",
        "No clear ownership.",
        "Manual work kills growth.",
        "Systems don't talk to each other.",
      ],
    },

    sceneHow: {
      intro: "The approach",
      title: "How we bring order",
      steps: [
        {
          text: "We define the system.",
          description: "Clear architecture, documented processes",
        },
        {
          text: "We build what matters.",
          description: "Focused development, measured progress",
        },
        {
          text: "We automate the flow.",
          description: "Systematic efficiency, reduced friction",
        },
        {
          text: "We run and support it.",
          description: "Ongoing operation, continuous improvement",
        },
      ],
    },

    sceneTrust: {
      title: "Why companies trust AIONEX",
      description:
        "We build systems, not just websites. Every project is planned, built, and supported with clear responsibility.",
      kpis: [
        { value: "50+", label: "Projects delivered" },
        { value: "2–6", label: "Weeks delivery" },
        { value: "24h", label: "Support response" },
      ],
    },

    sceneWhy: {
      title: "Why AIONEX",
      items: [
        { title: "Proven systems", desc: "Battle-tested architecture and workflows — no experiments with your business." },
        { title: "Clear deadlines", desc: "Transparent process with milestones, weekly updates, and zero surprises." },
        { title: "Real support", desc: "Dedicated contact person during and long after launch — not a ticket queue." },
        { title: "One team", desc: "Design, development, DevOps, and support — all under one roof." },
      ],
    },

    sceneProjectTransparency: {
      title: "Project transparency",
      items: [
        { label: "Project size", value: "Small to enterprise" },
        { label: "Duration", value: "2–6 weeks" },
        { label: "Team", value: "Dedicated specialists" },
      ],
    },

    sceneIndustries: {
      title: "Industries",
      items: ["Manufacturing", "Logistics", "E-Commerce", "Financial Services", "Technology"],
    },

    sceneTech: {
      title: "Technologies",
      items: ["React / Next.js", "Node.js / Python", "PostgreSQL / MongoDB", "Docker / Kubernetes", "AWS / GCP", "REST / GraphQL"],
    },

    sceneProcess: {
      title: "Our process",
      steps: ["Discovery", "Architecture", "Development", "Launch", "Support"],
    },

    sceneSupport: {
      title: "Support & SLA",
      features: [
        "24h response time",
        "Dedicated contact person",
        "Proactive monitoring",
        "Continuous improvement",
      ],
      modelsTitle: "Support models",
      models: ["On-demand support", "Monthly retainer", "Full managed service"],
    },

    sceneCases: {
      title: "Case Studies",
      labels: {
        problem: "Challenge",
        solution: "Solution",
        result: "Result",
        techStack: "Tech Stack",
        duration: "Duration",
        teamSize: "Team",
      },
      items: [
        {
          industry: "Manufacturing",
          client: "M. K., Operations Director",
          title: "Process automation for production",
          challenge: "Manual data entry across multiple systems, high error rates and slow reporting cycles.",
          solution: "Automated data flow between ERP, production planning, and quality systems with real-time dashboards.",
          result: "40% reduction in manual operations within the first quarter.",
          metrics: ["+40% efficiency", "-40% manual work", "2-week implementation"],
          techStack: ["Python", "PostgreSQL", "REST API", "Docker"],
          duration: "3 weeks",
          teamSize: "2 engineers",
        },
        {
          industry: "Logistics",
          client: "S. B., CTO",
          title: "Lead management system",
          challenge: "No structured lead pipeline, missed opportunities, and no visibility into sales performance.",
          solution: "Centralized CRM with automated lead scoring, follow-up sequences, and analytics dashboard.",
          result: "38% increase in qualified leads within 3 months.",
          metrics: ["+38% qualified leads", "-30% manual work", "4-week delivery"],
          techStack: ["React", "Node.js", "MongoDB", "AI scoring"],
          duration: "4 weeks",
          teamSize: "2 engineers",
        },
        {
          industry: "E‑Commerce",
          client: "T. W., Head of IT",
          title: "System integration & support",
          challenge: "Disconnected systems, no real-time data, slow response to operational issues.",
          solution: "Unified dashboard with monitoring, automated alerts, and 24h support SLA.",
          result: "Professional, transparent support with continuous improvement.",
          metrics: ["24h response time", "-50% downtime", "6-week rollout"],
          techStack: ["React", "Python", "AWS", "Kubernetes"],
          duration: "6 weeks",
          teamSize: "3 engineers",
        },
      ],
    },

    sceneProof: {
      intro: "The results",
      title: "Proven in real projects",
      subtitle: "Numbers that speak for themselves",
      stats: [
        "+38% qualified leads",
        "-42% manual operations",
        "2–6 weeks to launch",
        "24h support response",
      ],
      quote: "Built for businesses that need stability, not experiments.",
    },

    sceneFounder: {
      title: "Meet the Founder",
      bio: [
        "Full-stack engineer",
        "Business systems specialist",
        "Focus on automation and operational efficiency",
      ],
      directLine: "Your project communication goes directly through the founder.",
    },

    scenePricing: {
      title: "Typical Projects",
      note: "Every project is scoped individually.",
      items: [
        { title: "AI Automation", description: "Automate repetitive business processes", range: "from €990" },
        { title: "CRM & Lead Management", description: "Centralize leads and sales operations", range: "from €1,990" },
        { title: "Customer Portal", description: "Secure access for customers and partners", range: "from €2,990" },
        { title: "Custom Web Application", description: "Tailored software built around your workflow", range: "from €3,990" },
      ],
    },

    sceneDecision: {
      lines: ["No sales.", "No experiments.", "Just systems that work."],
      badges: ["Proven", "Secure", "Fast"],
    },

    sceneAction: {
      title: "Book a Free Project Assessment",
      subtitle: "Tell us about your challenge and receive practical recommendations for your next steps.",
      labels: {
        name: "Name",
        email: "Email",
        company: "Company",
        phone: "Phone",
        need: "What do you need?",
      },
      placeholders: {
        name: "Your name",
        email: "your@email.com",
        company: "Company name",
        phone: "+49...",
        message: "Brief description of your challenge...",
      },
      consentText: "I agree to the processing of my data according to the privacy policy.",
      consentError: "Please agree to the data processing.",
      errorText: "Something went wrong. Please try again.",
      loading: "Sending...",
      cta: "Request assessment",
      secondaryCall: "Or call us",
      secondaryEmail: "Or email us",
      successTitle: "Message received",
      successText: "We'll be in touch within 24 hours.",
      sendAnother: "Send another message",
      footnote: "Quiet confidence. No hype. Just systems that work.",
      responseOwner: "Your message goes directly to the founder.",
    },

    faq: {
      title: "Frequently Asked Questions",
      subtitle: "Answers to the most important questions about our services",
      items: [
        {
          question: "What industries does AIONEX serve?",
          answer: "We work with B2B companies across various industries, including manufacturing, logistics, e-commerce, financial services, and technology.",
        },
        {
          question: "How long does system implementation take?",
          answer: "Typically 2–6 weeks, depending on complexity. We work in clear phases and keep you updated on progress.",
        },
        {
          question: "What sets AIONEX apart?",
          answer: "Proven systems, not experiments. Clear deadlines, transparent processes, and real support — not just during development, but after launch.",
        },
        {
          question: "How does collaboration work?",
          answer: "We define the system together, build what matters, automate the flow, and support it continuously. One team, no external dependencies.",
        },
        {
          question: "What technologies does AIONEX use?",
          answer: "We select technologies based on your requirements. Our focus is on proven, stable solutions that work long-term.",
        },
        {
          question: "Is there support after implementation?",
          answer: "Yes. Continuous support with 24h average response time. We operate and support systems long-term.",
        },
      ],
    },

    seo: {
      title: "AIONEX – AI Automation & Custom Software for Growing Businesses | Germany",
      description: "AIONEX builds AI automation, custom software, CRM systems, and business integrations for growing companies. Book a free project assessment.",
    },
  },

  de: {
    header: {
      logoTitle: "AIONEX",
      nav: {
        how: "Wie es funktioniert",
        services: "Leistungen",
        about: "Über uns",
        cases: "Referenzen",
        proof: "Ergebnisse",
        faq: "FAQ",
        contact: "Kontakt",
      },
      language: "Sprache",
    },

    progress: {
      entry: "Start",
      services: "Leistungen",
      pain: "Problem",
      how: "Ansatz",
      about: "Über uns",
      cases: "Referenzen",
      proof: "Ergebnisse",
      founder: "Gründer",
      faq: "FAQ",
      pricing: "Preise",
      decision: "Entscheidung",
      action: "Kontakt",
    },

    sceneEntry: {
      headline: "AIONEX — KI-Automatisierung & individuelle Software für wachsende Unternehmen",
      subline:
        "Wir helfen Unternehmen, manuelle Arbeit zu reduzieren, Abläufe zu automatisieren und skalierbare Geschäftssysteme zu bauen.",
      badges: [
        "KI-Automatisierung",
        "Individuelle Webanwendungen",
        "CRM-Systeme",
        "Kundenportale",
        "Business-Integrationen",
        "Prozessautomatisierung",
      ],
      primaryCta: "Kostenloses Projektgespräch buchen",
      cta: "Was wir bauen",
    },

    sceneWhatWeBuild: {
      title: "Was wir bauen",
      items: [
        {
          title: "KI-Chatbots",
          description: "Automatisieren Sie Support, Lead-Qualifizierung und wiederkehrende Kommunikation.",
        },
        {
          title: "Business-Automatisierung",
          description: "Reduzieren Sie manuelle Arbeit und verbinden Sie isolierte Prozesse.",
        },
        {
          title: "CRM & Lead-Systeme",
          description: "Zentralisieren Sie den Vertrieb und verbessern Sie das Lead-Management.",
        },
        {
          title: "Kundenportale",
          description: "Bieten Sie Kunden sicheren Self-Service-Zugang.",
        },
        {
          title: "Individuelle Webanwendungen",
          description: "Maßgeschneiderte Software für Ihr Unternehmen.",
        },
        {
          title: "System-Integrationen",
          description: "Verbinden Sie bestehende Tools zu einem effizienten Workflow.",
        },
      ],
    },

    scenePain: {
      intro: "Die Realität",
      points: [
        "Projekte stocken.",
        "Keine klare Verantwortlichkeit.",
        "Manuelle Arbeit bremst Wachstum.",
        "Systeme sprechen nicht miteinander.",
      ],
    },

    sceneHow: {
      intro: "Der Ansatz",
      title: "Wie wir Ordnung schaffen",
      steps: [
        { text: "Wir definieren das System.", description: "Klare Architektur, dokumentierte Prozesse" },
        { text: "Wir bauen, was wichtig ist.", description: "Fokussierte Entwicklung, messbarer Fortschritt" },
        { text: "Wir automatisieren den Ablauf.", description: "Systematische Effizienz, reduzierte Reibung" },
        { text: "Wir betreiben und unterstützen es.", description: "Laufender Betrieb, kontinuierliche Verbesserung" },
      ],
    },

    sceneTrust: {
      title: "Warum Unternehmen AIONEX vertrauen",
      description: "Wir bauen Systeme, nicht nur Websites. Jedes Projekt wird geplant, gebaut und mit klarer Verantwortung unterstützt.",
      kpis: [
        { value: "50+", label: "Projekte geliefert" },
        { value: "2–6", label: "Wochen Lieferzeit" },
        { value: "24h", label: "Support-Antwort" },
      ],
    },

    sceneWhy: {
      title: "Warum AIONEX",
      items: [
        { title: "Bewährte Systeme", desc: "Kampferprobte Architektur und Workflows — keine Experimente mit Ihrem Geschäft." },
        { title: "Klare Deadlines", desc: "Transparenter Prozess mit Meilensteinen, wöchentlichen Updates und null Überraschungen." },
        { title: "Echte Unterstützung", desc: "Fester Ansprechpartner während und nach dem Launch — nicht nur ein Ticket-System." },
        { title: "Ein Team", desc: "Design, Entwicklung, DevOps und Support — alles unter einem Dach." },
      ],
    },

    sceneProjectTransparency: {
      title: "Projekttransparenz",
      items: [
        { label: "Projektgröße", value: "Klein bis Enterprise" },
        { label: "Dauer", value: "2–6 Wochen" },
        { label: "Team", value: "Dedizierte Spezialisten" },
      ],
    },

    sceneIndustries: {
      title: "Branchen",
      items: ["Fertigung", "Logistik", "E-Commerce", "Finanzdienstleistungen", "Technologie"],
    },

    sceneTech: {
      title: "Technologien",
      items: ["React / Next.js", "Node.js / Python", "PostgreSQL / MongoDB", "Docker / Kubernetes", "AWS / GCP", "REST / GraphQL"],
    },

    sceneProcess: {
      title: "Unser Prozess",
      steps: ["Discovery", "Architektur", "Entwicklung", "Launch", "Support"],
    },

    sceneSupport: {
      title: "Support & SLA",
      features: ["24h Antwortzeit", "Fester Ansprechpartner", "Proaktives Monitoring", "Kontinuierliche Verbesserung"],
      modelsTitle: "Support-Modelle",
      models: ["On-Demand-Support", "Monatlicher Retainer", "Full Managed Service"],
    },

    sceneCases: {
      title: "Fallstudien",
      labels: {
        problem: "Herausforderung",
        solution: "Lösung",
        result: "Ergebnis",
        techStack: "Technologien",
        duration: "Dauer",
        teamSize: "Team",
      },
      items: [
        {
          industry: "Fertigung",
          client: "M. K., Operations Director",
          title: "Prozessautomatisierung für Produktion",
          challenge: "Manuelle Dateneingabe über mehrere Systeme, hohe Fehlerquoten und langsame Berichtszyklen.",
          solution: "Automatisierter Datenfluss zwischen ERP, Produktionsplanung und Qualitätssystemen mit Echtzeit-Dashboards.",
          result: "40% Reduzierung manueller Operationen im ersten Quartal.",
          metrics: ["+40% Effizienz", "-40% manuelle Arbeit", "2 Wochen Umsetzung"],
          techStack: ["Python", "PostgreSQL", "REST API", "Docker"],
          duration: "3 Wochen",
          teamSize: "2 Entwickler",
        },
        {
          industry: "Logistik",
          client: "S. B., CTO",
          title: "Lead-Management-System",
          challenge: "Keine strukturierte Lead-Pipeline, verpasste Chancen und keine Einblicke in die Vertriebsleistung.",
          solution: "Zentralisiertes CRM mit automatisiertem Lead-Scoring, Follow-up-Sequenzen und Analytics-Dashboard.",
          result: "38% Steigerung qualifizierter Leads innerhalb von 3 Monaten.",
          metrics: ["+38% qualifizierte Leads", "-30% manuelle Arbeit", "4 Wochen Lieferzeit"],
          techStack: ["React", "Node.js", "MongoDB", "KI-Scoring"],
          duration: "4 Wochen",
          teamSize: "2 Entwickler",
        },
        {
          industry: "E-Commerce",
          client: "T. W., IT-Leitung",
          title: "Systemintegration & Support",
          challenge: "Getrennte Systeme, keine Echtzeitdaten, langsame Reaktion auf operative Probleme.",
          solution: "Einheitliches Dashboard mit Monitoring, automatisierten Alerts und 24h-Support-SLA.",
          result: "Professioneller, transparenter Support mit kontinuierlicher Verbesserung.",
          metrics: ["24h Antwortzeit", "-50% Ausfallzeit", "6 Wochen Rollout"],
          techStack: ["React", "Python", "AWS", "Kubernetes"],
          duration: "6 Wochen",
          teamSize: "3 Entwickler",
        },
      ],
    },

    sceneProof: {
      intro: "Die Ergebnisse",
      title: "Bewährt in echten Projekten",
      subtitle: "Zahlen, die für sich sprechen",
      stats: ["+38% qualifizierte Leads", "-42% manuelle Operationen", "2–6 Wochen bis zum Start", "24h Support-Antwortzeit"],
      quote: "Gebaut für Unternehmen, die Stabilität brauchen, keine Experimente.",
    },

    sceneFounder: {
      title: "Der Gründer",
      bio: [
        "Full-Stack-Entwickler",
        "Spezialist für Geschäftssysteme",
        "Fokus auf Automatisierung und operative Effizienz",
      ],
      directLine: "Ihre Projektkommunikation läuft direkt über den Gründer.",
    },

    scenePricing: {
      title: "Typische Projekte",
      note: "Jedes Projekt wird individuell geplant.",
      items: [
        { title: "KI-Automatisierung", description: "Automatisierung wiederkehrender Geschäftsprozesse", range: "ab €990" },
        { title: "CRM & Lead-Management", description: "Leads und Vertrieb zentralisieren", range: "ab €1.990" },
        { title: "Kundenportal", description: "Sicherer Zugang für Kunden und Partner", range: "ab €2.990" },
        { title: "Individuelle Webanwendung", description: "Maßgeschneiderte Software für Ihren Workflow", range: "ab €3.990" },
      ],
    },

    sceneDecision: {
      lines: ["Kein Verkauf.", "Keine Experimente.", "Nur Systeme, die funktionieren."],
      badges: ["Bewährt", "Sicher", "Schnell"],
    },

    sceneAction: {
      title: "Kostenloses Projektgespräch buchen",
      subtitle: "Erzählen Sie uns von Ihrer Herausforderung und erhalten Sie konkrete Empfehlungen für Ihre nächsten Schritte.",
      labels: {
        name: "Name",
        email: "E-Mail",
        company: "Unternehmen",
        phone: "Telefon",
        need: "Was benötigen Sie?",
      },
      placeholders: {
        name: "Ihr Name",
        email: "ihre@email.de",
        company: "Firmenname",
        phone: "+49...",
        message: "Kurze Beschreibung Ihrer Herausforderung...",
      },
      consentText: "Ich stimme der Verarbeitung meiner Daten gemäß der Datenschutzerklärung zu.",
      consentError: "Bitte stimmen Sie der Datenverarbeitung zu.",
      errorText: "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.",
      loading: "Wird gesendet...",
      cta: "Bewertung anfordern",
      secondaryCall: "Oder rufen Sie uns an",
      secondaryEmail: "Oder schreiben Sie uns",
      successTitle: "Nachricht erhalten",
      successText: "Wir melden uns innerhalb von 24 Stunden.",
      sendAnother: "Weitere Nachricht senden",
      footnote: "Ruhiges Vertrauen. Kein Hype. Nur Systeme, die funktionieren.",
      responseOwner: "Ihre Nachricht geht direkt an den Gründer.",
    },

    faq: {
      title: "Häufig gestellte Fragen",
      subtitle: "Antworten auf die wichtigsten Fragen zu unseren Dienstleistungen",
      items: [
        { question: "Für welche Branchen bietet AIONEX Lösungen?", answer: "Wir arbeiten mit B2B-Unternehmen aus verschiedenen Branchen, darunter Fertigung, Logistik, E-Commerce, Finanzdienstleistungen und Technologie." },
        { question: "Wie lange dauert die Implementierung?", answer: "Typischerweise 2–6 Wochen, abhängig von der Komplexität. Wir arbeiten in klaren Phasen und halten Sie über den Fortschritt auf dem Laufenden." },
        { question: "Was unterscheidet AIONEX von anderen Anbietern?", answer: "Bewährte Systeme statt Experimente. Klare Deadlines, transparente Prozesse und echte Unterstützung — nicht nur während der Entwicklung, sondern auch nach dem Launch." },
        { question: "Wie funktioniert die Zusammenarbeit?", answer: "Wir definieren gemeinsam das System, bauen was wichtig ist, automatisieren den Ablauf und unterstützen es kontinuierlich. Ein Team, keine externen Abhängigkeiten." },
        { question: "Welche Technologien verwendet AIONEX?", answer: "Wir wählen Technologien basierend auf Ihren Anforderungen. Unser Fokus liegt auf bewährten, stabilen Lösungen, die langfristig funktionieren." },
        { question: "Gibt es Support nach der Implementierung?", answer: "Ja. Kontinuierlicher Support mit durchschnittlich 24h Antwortzeit. Wir betreiben und unterstützen Systeme langfristig." },
      ],
    },

    seo: {
      title: "AIONEX – KI-Automatisierung & individuelle Software für Unternehmen | Deutschland",
      description: "AIONEX entwickelt KI-Automatisierung, individuelle Software, CRM-Systeme und Business-Integrationen für wachsende Unternehmen. Kostenloses Projektgespräch buchen.",
    },
  },
};
