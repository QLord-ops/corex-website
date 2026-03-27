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
      pain: "Problem",
      how: "Approach",
      about: "About",
      cases: "Cases",
      proof: "Proof",
      faq: "FAQ",
      decision: "Decision",
      action: "Contact",
    },

    sceneEntry: {
      headline: "AIONEX — Digital Systems & Automation",
      subline: "Build, automate, manage, support — in one team.",
      explainer:
        "We develop and automate business systems for B2B companies. Clear deadlines, transparent process, real support.",
      bullets: ["Clear deadlines", "Transparent process", "Real support"],
      primaryCta: "Project Check",
      cta: "Explore the system",
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
      title: "Why companies trust us",
      description:
        "We don't experiment with your business. Every system is planned, built, and supported with clear accountability.",
      note: "One team. One process. Full transparency.",
    },

    sceneWhy: {
      title: "Why AIONEX",
      items: [
        "Proven systems, not experiments",
        "Clear deadlines & transparent process",
        "Real support — during and after launch",
        "One team for everything",
      ],
    },

    sceneProjectTransparency: {
      title: "Project transparency",
      sizeLabel: "Project size",
      sizeValue: "Small to enterprise",
      durationLabel: "Duration",
      durationValue: "2–6 weeks",
      teamLabel: "Team",
      teamValue: "Dedicated specialists",
    },

    sceneIndustries: {
      title: "Industries",
      items: [
        "Manufacturing",
        "Logistics",
        "E‑Commerce",
        "Financial Services",
        "Technology",
      ],
    },

    sceneTech: {
      title: "Technologies",
      items: [
        "React / Next.js",
        "Node.js / Python",
        "PostgreSQL / MongoDB",
        "Docker / Kubernetes",
        "AWS / GCP",
        "REST / GraphQL",
      ],
    },

    sceneProcess: {
      title: "Our process",
      steps: [
        "Discovery & analysis",
        "Architecture & planning",
        "Development & testing",
        "Deployment & launch",
        "Support & optimization",
      ],
    },

    sceneSupport: {
      title: "Support",
      modelsTitle: "Support models",
      items: [
        "24h response time",
        "Dedicated contact person",
        "Proactive monitoring",
        "Continuous improvement",
      ],
      models: ["On-demand support", "Monthly retainer", "Full managed service"],
    },

    sceneCases: {
      title: "Case studies",
      labels: {
        problem: "Challenge",
        solution: "Solution",
        result: "Result",
      },
      items: [
        {
          industry: "Manufacturing",
          client: "M. K., Operations Director",
          title: "Process automation for production",
          challenge:
            "Manual data entry across multiple systems, high error rates.",
          solution:
            "Automated data flow between ERP, production planning, and quality systems.",
          result:
            "40% reduction in manual operations within the first quarter.",
          metric: "-40% manual work",
        },
        {
          industry: "Logistics",
          client: "S. B., CTO",
          title: "Lead management system",
          challenge: "No structured lead pipeline, missed opportunities.",
          solution:
            "Centralized CRM with automated lead scoring and follow-up.",
          result: "38% increase in qualified leads within 3 months.",
          metric: "+38% leads",
        },
        {
          industry: "E‑Commerce",
          client: "T. W., Head of IT",
          title: "System integration & support",
          challenge:
            "Disconnected systems, no real-time data, slow response to issues.",
          solution: "Unified dashboard with monitoring and 24h support.",
          result:
            "Professional, transparent support with continuous improvement.",
          metric: "24h support",
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
      quote:
        "Built for businesses that need stability, not experiments.",
    },

    sceneDecision: {
      lines: ["No sales.", "No experiments.", "Just systems that work."],
      badges: ["Proven", "Secure", "Fast"],
    },

    sceneAction: {
      title: "Let's bring order to your system.",
      subtitle: "No forms, no funnels. Just a conversation.",
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
      consentText:
        "I agree to the processing of my data according to the privacy policy.",
      consentError: "Please agree to the data processing.",
      errorText: "Something went wrong. Please try again.",
      loading: "Sending...",
      cta: "Start the conversation",
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
          answer:
            "We work with B2B companies across various industries, including manufacturing, logistics, e-commerce, financial services, and technology.",
        },
        {
          question: "How long does system implementation take?",
          answer:
            "Typically 2–6 weeks, depending on complexity. We work in clear phases and keep you updated on progress.",
        },
        {
          question: "What sets AIONEX apart?",
          answer:
            "Proven systems, not experiments. Clear deadlines, transparent processes, and real support — not just during development, but after launch.",
        },
        {
          question: "How does collaboration work?",
          answer:
            "We define the system together, build what matters, automate the flow, and support it continuously. One team, no external dependencies.",
        },
        {
          question: "What technologies does AIONEX use?",
          answer:
            "We select technologies based on your requirements. Our focus is on proven, stable solutions that work long-term.",
        },
        {
          question: "Is there support after implementation?",
          answer:
            "Yes. Continuous support with 24h average response time. We operate and support systems long-term.",
        },
      ],
    },

    seo: {
      title: "AIONEX – Digital Systems & Automation for B2B | Germany",
      description:
        "AIONEX develops and automates business systems for B2B companies. Clear deadlines, transparent process, real support.",
    },
  },

  de: {
    header: {
      logoTitle: "AIONEX",
      nav: {
        how: "Wie es funktioniert",
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
      pain: "Problem",
      how: "Ansatz",
      about: "Über uns",
      cases: "Referenzen",
      proof: "Ergebnisse",
      faq: "FAQ",
      decision: "Entscheidung",
      action: "Kontakt",
    },

    sceneEntry: {
      headline: "AIONEX — Systementwicklung & Automatisierung",
      subline:
        "Entwickeln, automatisieren, verwalten, unterstützen — in einem Team.",
      explainer:
        "Wir entwickeln und automatisieren Geschäftssysteme für B2B-Unternehmen. Klare Deadlines, transparenter Prozess, echte Unterstützung.",
      bullets: [
        "Klare Deadlines",
        "Transparenter Prozess",
        "Echte Unterstützung",
      ],
      primaryCta: "Projekt-Check",
      cta: "System erkunden",
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
        {
          text: "Wir definieren das System.",
          description: "Klare Architektur, dokumentierte Prozesse",
        },
        {
          text: "Wir bauen, was wichtig ist.",
          description: "Fokussierte Entwicklung, messbarer Fortschritt",
        },
        {
          text: "Wir automatisieren den Ablauf.",
          description: "Systematische Effizienz, reduzierte Reibung",
        },
        {
          text: "Wir betreiben und unterstützen es.",
          description: "Laufender Betrieb, kontinuierliche Verbesserung",
        },
      ],
    },

    sceneTrust: {
      title: "Warum Unternehmen uns vertrauen",
      description:
        "Wir experimentieren nicht mit Ihrem Geschäft. Jedes System wird geplant, gebaut und mit klarer Verantwortung unterstützt.",
      note: "Ein Team. Ein Prozess. Volle Transparenz.",
    },

    sceneWhy: {
      title: "Warum AIONEX",
      items: [
        "Bewährte Systeme, keine Experimente",
        "Klare Deadlines & transparenter Prozess",
        "Echte Unterstützung — während und nach dem Launch",
        "Ein Team für alles",
      ],
    },

    sceneProjectTransparency: {
      title: "Projekttransparenz",
      sizeLabel: "Projektgröße",
      sizeValue: "Klein bis Enterprise",
      durationLabel: "Dauer",
      durationValue: "2–6 Wochen",
      teamLabel: "Team",
      teamValue: "Dedizierte Spezialisten",
    },

    sceneIndustries: {
      title: "Branchen",
      items: [
        "Fertigung",
        "Logistik",
        "E-Commerce",
        "Finanzdienstleistungen",
        "Technologie",
      ],
    },

    sceneTech: {
      title: "Technologien",
      items: [
        "React / Next.js",
        "Node.js / Python",
        "PostgreSQL / MongoDB",
        "Docker / Kubernetes",
        "AWS / GCP",
        "REST / GraphQL",
      ],
    },

    sceneProcess: {
      title: "Unser Prozess",
      steps: [
        "Analyse & Discovery",
        "Architektur & Planung",
        "Entwicklung & Testing",
        "Deployment & Launch",
        "Support & Optimierung",
      ],
    },

    sceneSupport: {
      title: "Support",
      modelsTitle: "Support-Modelle",
      items: [
        "24h Antwortzeit",
        "Fester Ansprechpartner",
        "Proaktives Monitoring",
        "Kontinuierliche Verbesserung",
      ],
      models: [
        "On-Demand-Support",
        "Monatlicher Retainer",
        "Full Managed Service",
      ],
    },

    sceneCases: {
      title: "Fallstudien",
      labels: {
        problem: "Herausforderung",
        solution: "Lösung",
        result: "Ergebnis",
      },
      items: [
        {
          industry: "Fertigung",
          client: "M. K., Operations Director",
          title: "Prozessautomatisierung für Produktion",
          challenge:
            "Manuelle Dateneingabe über mehrere Systeme, hohe Fehlerquoten.",
          solution:
            "Automatisierter Datenfluss zwischen ERP, Produktionsplanung und Qualitätssystemen.",
          result:
            "40% Reduzierung manueller Operationen im ersten Quartal.",
          metric: "-40% manuelle Arbeit",
        },
        {
          industry: "Logistik",
          client: "S. B., CTO",
          title: "Lead-Management-System",
          challenge:
            "Keine strukturierte Lead-Pipeline, verpasste Chancen.",
          solution:
            "Zentralisiertes CRM mit automatisiertem Lead-Scoring und Follow-up.",
          result:
            "38% Steigerung qualifizierter Leads innerhalb von 3 Monaten.",
          metric: "+38% Leads",
        },
        {
          industry: "E-Commerce",
          client: "T. W., IT-Leitung",
          title: "Systemintegration & Support",
          challenge:
            "Getrennte Systeme, keine Echtzeitdaten, langsame Reaktion auf Probleme.",
          solution:
            "Einheitliches Dashboard mit Monitoring und 24h-Support.",
          result:
            "Professioneller, transparenter Support mit kontinuierlicher Verbesserung.",
          metric: "24h Support",
        },
      ],
    },

    sceneProof: {
      intro: "Die Ergebnisse",
      title: "Bewährt in echten Projekten",
      subtitle: "Zahlen, die für sich sprechen",
      stats: [
        "+38% qualifizierte Leads",
        "-42% manuelle Operationen",
        "2–6 Wochen bis zum Start",
        "24h Support-Antwortzeit",
      ],
      quote:
        "Gebaut für Unternehmen, die Stabilität brauchen, keine Experimente.",
    },

    sceneDecision: {
      lines: [
        "Kein Verkauf.",
        "Keine Experimente.",
        "Nur Systeme, die funktionieren.",
      ],
      badges: ["Bewährt", "Sicher", "Schnell"],
    },

    sceneAction: {
      title: "Bringen wir Ordnung in Ihr System.",
      subtitle: "Keine Formulare, keine Funnels. Nur ein Gespräch.",
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
      consentText:
        "Ich stimme der Verarbeitung meiner Daten gemäß der Datenschutzerklärung zu.",
      consentError: "Bitte stimmen Sie der Datenverarbeitung zu.",
      errorText:
        "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.",
      loading: "Wird gesendet...",
      cta: "Gespräch beginnen",
      secondaryCall: "Oder rufen Sie uns an",
      secondaryEmail: "Oder schreiben Sie uns",
      successTitle: "Nachricht erhalten",
      successText: "Wir melden uns innerhalb von 24 Stunden.",
      sendAnother: "Weitere Nachricht senden",
      footnote:
        "Ruhiges Vertrauen. Kein Hype. Nur Systeme, die funktionieren.",
      responseOwner: "Ihre Nachricht geht direkt an den Gründer.",
    },

    faq: {
      title: "Häufig gestellte Fragen",
      subtitle:
        "Antworten auf die wichtigsten Fragen zu unseren Dienstleistungen",
      items: [
        {
          question: "Für welche Branchen bietet AIONEX Lösungen?",
          answer:
            "Wir arbeiten mit B2B-Unternehmen aus verschiedenen Branchen, darunter Fertigung, Logistik, E-Commerce, Finanzdienstleistungen und Technologie.",
        },
        {
          question: "Wie lange dauert die Implementierung?",
          answer:
            "Typischerweise 2–6 Wochen, abhängig von der Komplexität. Wir arbeiten in klaren Phasen und halten Sie über den Fortschritt auf dem Laufenden.",
        },
        {
          question: "Was unterscheidet AIONEX von anderen Anbietern?",
          answer:
            "Bewährte Systeme statt Experimente. Klare Deadlines, transparente Prozesse und echte Unterstützung — nicht nur während der Entwicklung, sondern auch nach dem Launch.",
        },
        {
          question: "Wie funktioniert die Zusammenarbeit?",
          answer:
            "Wir definieren gemeinsam das System, bauen was wichtig ist, automatisieren den Ablauf und unterstützen es kontinuierlich. Ein Team, keine externen Abhängigkeiten.",
        },
        {
          question: "Welche Technologien verwendet AIONEX?",
          answer:
            "Wir wählen Technologien basierend auf Ihren Anforderungen. Unser Fokus liegt auf bewährten, stabilen Lösungen, die langfristig funktionieren.",
        },
        {
          question: "Gibt es Support nach der Implementierung?",
          answer:
            "Ja. Kontinuierlicher Support mit durchschnittlich 24h Antwortzeit. Wir betreiben und unterstützen Systeme langfristig.",
        },
      ],
    },

    seo: {
      title:
        "AIONEX – Systementwicklung & Automatisierung für B2B | Deutschland",
      description:
        "AIONEX entwickelt und automatisiert Geschäftssysteme für B2B-Unternehmen. Klare Deadlines, transparenter Prozess, echte Unterstützung.",
    },
  },
};
