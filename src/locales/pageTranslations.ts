import type { Language } from "@/locales/translations";

type TranslationNode = string | { readonly [key: string]: TranslationNode };

export const pageTranslations = {
  zh: {
    hero: {
      eyebrow: "LCD 与 LCM 解决方案",
      title: "NELYTECH",
      intro:
        "正在寻找 LCD 与 LCM？请先坐下来，喝杯茶，让我们一起把需求梳理清楚。NELYTECH 以研发能力、价格竞争力、服务响应和交付速度著称。告诉我们您的需求、难点或初步想法，NELYTECH 将为您提供合适的 LCD 与 LCM 解决方案。",
    },
    about: {
      eyebrow: "关于 NELYTECH",
      heroTitle: "NELYTECH 是中国快速成长的 LCD 与 LCM 制造商。",
      heroIntro:
        "从 TN、HTN、STN、FSTN 面板到 COB、TAB、COG 模块，我们提供完整显示解决方案，包括定制 MCU 开发与 PCB 组装。我们以质量、速度、服务和有竞争力的价格获得全球客户认可。",
      engineeringEyebrow: "工程能力",
      engineeringTitle: "从概念到量产的定制显示工程能力。",
      engineeringText:
        "我们的资深工程团队覆盖 LCD 工艺、MCU 开发、光电技术和 PCBA。我们提供定制硬件与软件设计，帮助客户加快开发并优化最终产品。",
      qcEyebrow: "严格质量控制",
      qcTitle: "质量控制不止于检测，更面向长期可靠性。",
      qcText:
        "有效的质量控制是我们的核心优势。除 100% 外观和电性检测外，我们也高度重视极限耐久性和功耗测试。",
      leadTimesEyebrow: "敏捷交付周期",
      leadTimesTitle: "为紧急显示项目提供快速开发节奏。",
      fastTrack: "针对紧急项目，我们提供特别加急流程，帮助处于困难中的客户快速推进。",
      globalEyebrow: "全球足迹",
      globalTitle: "获得全球客户信任",
      leadTimes: {
        lcdPanelPrototype: "LCD 面板样品",
        lcdModulePrototype: "LCD 模块样品",
        mcuDesignPrototype: "MCU 设计样品",
        lcdPanelMassProduction: "LCD 面板量产",
        lcdModuleMassProduction: "LCD 模块量产",
      },
      leadTimeDurations: {
        twoWeeks: "2 周",
        threeWeeks: "3 周",
        threeToFiveWeeks: "3-5 周",
        threeToFourWeeks: "3-4 周",
      },
      markets: {
        europe: "欧洲",
        asia: "亚洲",
        northAmerica: "北美",
        southAmerica: "南美",
        australia: "澳大利亚",
        africa: "非洲",
      },
    },
    contactCta: {
      title: "准备启动您的定制显示项目？",
      subtitle:
        "24 小时内获取报价。我们的研发团队可协助您完成定制 LCD、LCM 与 PCBA 解决方案。",
      button: "立即联系工程团队",
    },
    contactPage: {
      heroTitle: "联系 NELYTECH",
      heroSubtitle:
        "无论您需要定制显示解决方案，还是想咨询产品细节，我们的工程团队都已准备好为您提供支持。",
      directEyebrow: "直接联系",
      directTitle: "与我们的显示工程团队沟通。",
      directText:
        "请发送需求、图纸、目标尺寸、接口细节或应用说明。我们会将您的咨询分配给合适的工程联系人。",
      emailLabel: "邮箱",
      officeLabel: "深圳办公室",
      phonesLabel: "电话",
      address: "中国深圳市宝安区西乡南昌新零售数字产业园 D 栋 303 室",
    },
    contactForm: {
      eyebrow: "联系",
      title: "告诉我们您正在开发什么。",
      subtitle: "分享关键需求，我们的工程团队将通过 contact@nelytech.com 跟进。",
      submit: "发送询盘",
      noMatches: "未找到匹配项",
      openOptions: "打开选项",
      lockedNote: "已从产品页面自动获取。",
      mailSubjectPrefix: "NELYTECH 询盘",
      emailBody: {
        name: "姓名",
        workEmail: "工作邮箱",
        company: "公司",
        countryRegion: "国家 / 地区",
        productInterest: "产品兴趣",
        projectDetails: "项目详情",
      },
      fields: {
        name: {
          label: "姓名",
          placeholder: "您的姓名",
        },
        workEmail: {
          label: "工作邮箱",
          placeholder: "name@company.com",
        },
        company: {
          label: "公司",
          placeholder: "公司名称",
        },
        countryRegion: {
          label: "国家 / 地区",
          placeholder: "搜索国家",
        },
        productInterest: {
          label: "产品兴趣",
          placeholder: "搜索产品方向",
        },
        message: {
          label: "留言",
          placeholder: "显示尺寸、应用场景、数量、交期或技术要求。",
        },
      },
      productOptions: {
        generalInquiry: "一般咨询",
        customTnStnDisplay: "定制 TN/STN 显示",
        tftColorModule: "TFT 彩色模块",
        bespokePcbaSolution: "定制 PCBA 解决方案",
        touchPanelIntegration: "触摸屏集成",
      },
    },
  },
  de: {
    hero: {
      eyebrow: "LCD- & LCM-Lösungen",
      title: "NELYTECH",
      intro:
        "Suchen Sie LCDs oder LCMs? Nehmen Sie Platz, wir klären Ihre Anforderungen strukturiert. NELYTECH ist bekannt für starke F&E-Kompetenz, wettbewerbsfähige Preise, schnellen Service und kurze Reaktionszeiten. Teilen Sie uns Ihre Anforderungen, Probleme oder Ideen mit, und NELYTECH entwickelt die passende LCD- und LCM-Lösung.",
    },
    about: {
      eyebrow: "Über NELYTECH",
      heroTitle: "NELYTECH ist ein schnell wachsender LCD- und LCM-Hersteller in China.",
      heroIntro:
        "Von TN-, HTN-, STN- und FSTN-Panels bis zu COB-, TAB- und COG-Modulen liefern wir komplette Displaylösungen inklusive kundenspezifischer MCU-Entwicklung und PCB-Bestückung. Weltweit geschätzt für Qualität, Geschwindigkeit, Service und wettbewerbsfähige Preise.",
      engineeringEyebrow: "Engineering",
      engineeringTitle: "Maßgeschneiderte Displayentwicklung vom Konzept bis zur Serie.",
      engineeringText:
        "Unser erfahrenes Engineering-Team deckt LCD-Prozesse, MCU-Entwicklung, Optoelektronik und PCBA ab. Wir entwickeln kundenspezifische Hardware und Software, beschleunigen Ihre Entwicklung und optimieren das Endprodukt.",
      qcEyebrow: "Konsequente Qualitätssicherung",
      qcTitle: "Qualitätskontrolle für Langzeitstabilität, nicht nur für Inspektionen.",
      qcText:
        "Wirksame Qualitätskontrolle ist ein zentraler Vorteil. Neben 100 % visueller und elektrischer Prüfung priorisieren wir Extrembelastungs-, Dauerhaltbarkeits- und Stromverbrauchstests.",
      leadTimesEyebrow: "Agile Lieferzeiten",
      leadTimesTitle: "Schnelle Entwicklungszyklen für dringende Displayprogramme.",
      fastTrack:
        "Für dringende Fälle bieten wir Fast-Track-Prozesse, die Kunden in kritischen Projektphasen entscheidend unterstützen.",
      globalEyebrow: "Globale Präsenz",
      globalTitle: "Weltweit vertraut",
      leadTimes: {
        lcdPanelPrototype: "LCD-Panel-Prototyp",
        lcdModulePrototype: "LCD-Modul-Prototyp",
        mcuDesignPrototype: "MCU-Design-Prototyp",
        lcdPanelMassProduction: "LCD-Panel-Serienproduktion",
        lcdModuleMassProduction: "LCD-Modul-Serienproduktion",
      },
      leadTimeDurations: {
        twoWeeks: "2 Wochen",
        threeWeeks: "3 Wochen",
        threeToFiveWeeks: "3-5 Wochen",
        threeToFourWeeks: "3-4 Wochen",
      },
      markets: {
        europe: "Europa",
        asia: "Asien",
        northAmerica: "Nordamerika",
        southAmerica: "Südamerika",
        australia: "Australien",
        africa: "Afrika",
      },
    },
    contactCta: {
      title: "Bereit für Ihr kundenspezifisches Displayprojekt?",
      subtitle:
        "Erhalten Sie innerhalb von 24 Stunden ein Angebot. Unser F&E-Team unterstützt Sie bei kundenspezifischen LCD-, LCM- und PCBA-Lösungen.",
      button: "Heute unsere Ingenieure kontaktieren",
    },
    contactPage: {
      heroTitle: "Kontakt zu NELYTECH",
      heroSubtitle:
        "Ob kundenspezifische Displaylösung oder Produktfrage: Unser Engineering-Team unterstützt Sie schnell und präzise.",
      directEyebrow: "Direkter Kontakt",
      directTitle: "Sprechen Sie mit unserem Display-Engineering-Team.",
      directText:
        "Senden Sie Anforderungen, Zeichnungen, Zielabmessungen, Schnittstellendetails oder Anwendungshinweise. Wir leiten Ihre Anfrage an den passenden Engineering-Kontakt weiter.",
      emailLabel: "E-Mail",
      officeLabel: "Büro Shenzhen",
      phonesLabel: "Telefon",
      address:
        "Room 303, Building D, New Retail Digital Industrial Park, Nanchang, Xixiang, Bao'an, Shenzhen, China",
    },
    contactForm: {
      eyebrow: "Kontakt",
      title: "Beschreiben Sie, was Sie entwickeln.",
      subtitle:
        "Teilen Sie die wichtigsten Eckdaten. Unser Engineering-Team meldet sich über contact@nelytech.com.",
      submit: "Anfrage senden",
      noMatches: "Keine Treffer gefunden",
      openOptions: "Optionen öffnen",
      lockedNote: "Von der Produktseite übernommen.",
      mailSubjectPrefix: "NELYTECH-Anfrage",
      emailBody: {
        name: "Name",
        workEmail: "Geschäftliche E-Mail",
        company: "Unternehmen",
        countryRegion: "Land / Region",
        productInterest: "Produktinteresse",
        projectDetails: "Projektdetails",
      },
      fields: {
        name: {
          label: "Name",
          placeholder: "Ihr Name",
        },
        workEmail: {
          label: "Geschäftliche E-Mail",
          placeholder: "name@company.com",
        },
        company: {
          label: "Unternehmen",
          placeholder: "Unternehmensname",
        },
        countryRegion: {
          label: "Land / Region",
          placeholder: "Land suchen",
        },
        productInterest: {
          label: "Produktinteresse",
          placeholder: "Produktinteresse suchen",
        },
        message: {
          label: "Nachricht",
          placeholder: "Displaygröße, Anwendung, Stückzahlen, Zeitplan oder technische Anforderungen.",
        },
      },
      productOptions: {
        generalInquiry: "Allgemeine Anfrage",
        customTnStnDisplay: "Kundenspezifisches TN/STN-Display",
        tftColorModule: "TFT-Farbmodul",
        bespokePcbaSolution: "Maßgeschneiderte PCBA-Lösung",
        touchPanelIntegration: "Touchpanel-Integration",
      },
    },
  },
  es: {
    hero: {
      eyebrow: "Soluciones LCD y LCM",
      title: "NELYTECH",
      intro:
        "¿Busca LCD o LCM? Tome asiento y aclaremos sus requisitos con calma. NELYTECH es reconocida por su capacidad de I+D, precios competitivos, servicio ágil y velocidad de entrega. Comparta sus requisitos, problemas o ideas, y NELYTECH le ofrecerá la mejor solución LCD y LCM.",
    },
    about: {
      eyebrow: "Acerca de NELYTECH",
      heroTitle: "NELYTECH es un fabricante de LCD y LCM de rápido crecimiento en China.",
      heroIntro:
        "Desde paneles TN, HTN, STN y FSTN hasta módulos COB, TAB y COG, suministramos soluciones completas de visualización, incluyendo desarrollo MCU personalizado y ensamblaje PCB. Somos reconocidos globalmente por calidad, rapidez, servicio y precios competitivos.",
      engineeringEyebrow: "Ingeniería",
      engineeringTitle: "Ingeniería de displays a medida, del concepto a la producción.",
      engineeringText:
        "Nuestro equipo senior domina procesos LCD, desarrollo MCU, optoelectrónica y PCBA. Ofrecemos diseños de hardware y software a medida para acelerar su desarrollo y optimizar el producto final.",
      qcEyebrow: "Control de calidad riguroso",
      qcTitle: "Control de calidad orientado a durabilidad, no solo a inspección.",
      qcText:
        "El control de calidad efectivo es una ventaja decisiva. Además de inspecciones visuales y eléctricas al 100 %, priorizamos pruebas de durabilidad extrema y consumo energético.",
      leadTimesEyebrow: "Plazos ágiles",
      leadTimesTitle: "Ciclos de desarrollo rápidos para programas de display urgentes.",
      fastTrack:
        "Ofrecemos procedimientos fast-track para casos urgentes, una ayuda crítica para clientes con proyectos en dificultad.",
      globalEyebrow: "Presencia global",
      globalTitle: "Confianza en todo el mundo",
      leadTimes: {
        lcdPanelPrototype: "Prototipo de panel LCD",
        lcdModulePrototype: "Prototipo de módulo LCD",
        mcuDesignPrototype: "Prototipo de diseño MCU",
        lcdPanelMassProduction: "Producción en serie de panel LCD",
        lcdModuleMassProduction: "Producción en serie de módulo LCD",
      },
      leadTimeDurations: {
        twoWeeks: "2 semanas",
        threeWeeks: "3 semanas",
        threeToFiveWeeks: "3-5 semanas",
        threeToFourWeeks: "3-4 semanas",
      },
      markets: {
        europe: "Europa",
        asia: "Asia",
        northAmerica: "Norteamérica",
        southAmerica: "Sudamérica",
        australia: "Australia",
        africa: "África",
      },
    },
    contactCta: {
      title: "¿Listo para iniciar su proyecto de display personalizado?",
      subtitle:
        "Reciba una cotización en 24 horas. Nuestro equipo de I+D está listo para ayudarle con soluciones LCD, LCM y PCBA personalizadas.",
      button: "Contacte hoy con nuestros ingenieros",
    },
    contactPage: {
      heroTitle: "Contacte con NELYTECH",
      heroSubtitle:
        "Tanto si necesita una solución de display personalizada como si tiene una pregunta sobre productos, nuestro equipo de ingeniería está listo para ayudarle.",
      directEyebrow: "Contacto directo",
      directTitle: "Hable con nuestro equipo de ingeniería de displays.",
      directText:
        "Envíe requisitos, planos, dimensiones objetivo, interfaces o notas de aplicación. Derivaremos su consulta al contacto técnico adecuado.",
      emailLabel: "Email",
      officeLabel: "Oficina de Shenzhen",
      phonesLabel: "Teléfonos",
      address:
        "Room 303, Building D, New Retail Digital Industrial Park, Nanchang, Xixiang, Bao'an, Shenzhen, China",
    },
    contactForm: {
      eyebrow: "Contacto",
      title: "Cuéntenos qué está desarrollando.",
      subtitle:
        "Comparta los datos esenciales y nuestro equipo de ingeniería responderá desde contact@nelytech.com.",
      submit: "Enviar consulta",
      noMatches: "No se encontraron resultados",
      openOptions: "Abrir opciones",
      lockedNote: "Capturado desde la página de producto.",
      mailSubjectPrefix: "Consulta NELYTECH",
      emailBody: {
        name: "Nombre",
        workEmail: "Email corporativo",
        company: "Empresa",
        countryRegion: "País / Región",
        productInterest: "Producto de interés",
        projectDetails: "Detalles del proyecto",
      },
      fields: {
        name: {
          label: "Nombre",
          placeholder: "Su nombre",
        },
        workEmail: {
          label: "Email corporativo",
          placeholder: "name@company.com",
        },
        company: {
          label: "Empresa",
          placeholder: "Nombre de la empresa",
        },
        countryRegion: {
          label: "País / Región",
          placeholder: "Buscar país",
        },
        productInterest: {
          label: "Producto de interés",
          placeholder: "Buscar producto",
        },
        message: {
          label: "Mensaje",
          placeholder: "Tamaño del display, aplicación, cantidades, calendario o requisitos técnicos.",
        },
      },
      productOptions: {
        generalInquiry: "Consulta general",
        customTnStnDisplay: "Display TN/STN personalizado",
        tftColorModule: "Módulo TFT a color",
        bespokePcbaSolution: "Solución PCBA a medida",
        touchPanelIntegration: "Integración de panel táctil",
      },
    },
  },
  fr: {
    hero: {
      eyebrow: "Solutions LCD et LCM",
      title: "NELYTECH",
      intro:
        "Vous recherchez des LCD ou des LCM ? Prenez le temps de nous expliquer votre besoin. NELYTECH est reconnue pour sa capacité R&D, ses prix compétitifs, son service réactif et sa rapidité. Présentez vos exigences, vos contraintes ou vos idées, et NELYTECH proposera la solution LCD et LCM adaptée.",
    },
    about: {
      eyebrow: "À propos de NELYTECH",
      heroTitle: "NELYTECH est un fabricant chinois de LCD et LCM en forte croissance.",
      heroIntro:
        "Des panneaux TN, HTN, STN et FSTN aux modules COB, TAB et COG, nous fournissons des solutions d'affichage complètes, incluant le développement MCU sur mesure et l'assemblage PCB. Nous sommes reconnus mondialement pour la qualité, la rapidité, le service et des prix compétitifs.",
      engineeringEyebrow: "Ingénierie",
      engineeringTitle: "Ingénierie d'affichage sur mesure, du concept à la production.",
      engineeringText:
        "Notre équipe d'ingénieurs expérimentés couvre les procédés LCD, le développement MCU, l'optoélectronique et les PCBA. Nous concevons matériel et logiciel sur mesure pour accélérer votre développement et optimiser le produit final.",
      qcEyebrow: "Contrôle qualité exigeant",
      qcTitle: "Un contrôle qualité pensé pour la durabilité, pas seulement l'inspection.",
      qcText:
        "Un contrôle qualité efficace est notre avantage décisif. Au-delà des inspections visuelles et électriques à 100 %, nous accordons une priorité élevée aux essais de durabilité extrême et de consommation.",
      leadTimesEyebrow: "Délais agiles",
      leadTimesTitle: "Cycles de développement rapides pour programmes d'affichage urgents.",
      fastTrack:
        "Nous proposons des procédures accélérées pour les cas urgents, un soutien essentiel pour les clients en situation critique.",
      globalEyebrow: "Présence mondiale",
      globalTitle: "La confiance de clients dans le monde entier",
      leadTimes: {
        lcdPanelPrototype: "Prototype de panneau LCD",
        lcdModulePrototype: "Prototype de module LCD",
        mcuDesignPrototype: "Prototype de conception MCU",
        lcdPanelMassProduction: "Production série de panneaux LCD",
        lcdModuleMassProduction: "Production série de modules LCD",
      },
      leadTimeDurations: {
        twoWeeks: "2 semaines",
        threeWeeks: "3 semaines",
        threeToFiveWeeks: "3-5 semaines",
        threeToFourWeeks: "3-4 semaines",
      },
      markets: {
        europe: "Europe",
        asia: "Asie",
        northAmerica: "Amérique du Nord",
        southAmerica: "Amérique du Sud",
        australia: "Australie",
        africa: "Afrique",
      },
    },
    contactCta: {
      title: "Prêt à lancer votre projet d'affichage sur mesure ?",
      subtitle:
        "Recevez un devis sous 24 heures. Notre équipe R&D vous accompagne sur vos solutions LCD, LCM et PCBA personnalisées.",
      button: "Contacter nos ingénieurs aujourd'hui",
    },
    contactPage: {
      heroTitle: "Contactez NELYTECH",
      heroSubtitle:
        "Que vous ayez besoin d'une solution d'affichage personnalisée ou d'une précision produit, notre équipe d'ingénierie est prête à vous aider.",
      directEyebrow: "Contact direct",
      directTitle: "Échangez avec notre équipe d'ingénierie display.",
      directText:
        "Envoyez vos exigences, plans, dimensions cibles, interfaces ou notes d'application. Nous orienterons votre demande vers le bon interlocuteur technique.",
      emailLabel: "E-mail",
      officeLabel: "Bureau de Shenzhen",
      phonesLabel: "Téléphones",
      address:
        "Room 303, Building D, New Retail Digital Industrial Park, Nanchang, Xixiang, Bao'an, Shenzhen, China",
    },
    contactForm: {
      eyebrow: "Contact",
      title: "Dites-nous ce que vous développez.",
      subtitle:
        "Partagez les informations clés et notre équipe d'ingénierie vous répondra via contact@nelytech.com.",
      submit: "Envoyer la demande",
      noMatches: "Aucun résultat trouvé",
      openOptions: "Ouvrir les options",
      lockedNote: "Récupéré depuis la page produit.",
      mailSubjectPrefix: "Demande NELYTECH",
      emailBody: {
        name: "Nom",
        workEmail: "E-mail professionnel",
        company: "Entreprise",
        countryRegion: "Pays / Région",
        productInterest: "Produit d'intérêt",
        projectDetails: "Détails du projet",
      },
      fields: {
        name: {
          label: "Nom",
          placeholder: "Votre nom",
        },
        workEmail: {
          label: "E-mail professionnel",
          placeholder: "name@company.com",
        },
        company: {
          label: "Entreprise",
          placeholder: "Nom de l'entreprise",
        },
        countryRegion: {
          label: "Pays / Région",
          placeholder: "Rechercher un pays",
        },
        productInterest: {
          label: "Produit d'intérêt",
          placeholder: "Rechercher un produit",
        },
        message: {
          label: "Message",
          placeholder: "Taille d'écran, application, quantités, calendrier ou exigences techniques.",
        },
      },
      productOptions: {
        generalInquiry: "Demande générale",
        customTnStnDisplay: "Afficheur TN/STN personnalisé",
        tftColorModule: "Module TFT couleur",
        bespokePcbaSolution: "Solution PCBA sur mesure",
        touchPanelIntegration: "Intégration de panneau tactile",
      },
    },
  },
  it: {
    hero: {
      eyebrow: "Soluzioni LCD e LCM",
      title: "NELYTECH",
      intro:
        "State cercando LCD o LCM? Sediamoci e definiamo con precisione i requisiti. NELYTECH è riconosciuta per capacità R&D, prezzi competitivi, servizio rapido e velocità di consegna. Comunicateci requisiti, criticità o idee: NELYTECH svilupperà la soluzione LCD e LCM più adatta.",
    },
    about: {
      eyebrow: "Chi siamo",
      heroTitle: "NELYTECH è un produttore cinese di LCD e LCM in rapida crescita.",
      heroIntro:
        "Dai pannelli TN, HTN, STN e FSTN ai moduli COB, TAB e COG, forniamo soluzioni display complete, incluse sviluppo MCU personalizzato e assemblaggio PCB. Siamo riconosciuti a livello globale per qualità, velocità, servizio e prezzi competitivi.",
      engineeringEyebrow: "Ingegneria",
      engineeringTitle: "Ingegneria display su misura, dal concept alla produzione.",
      engineeringText:
        "Il nostro team senior copre processi LCD, sviluppo MCU, optoelettronica e PCBA. Offriamo progettazione hardware e software su misura per accelerare lo sviluppo e ottimizzare il prodotto finale.",
      qcEyebrow: "Controllo qualità rigoroso",
      qcTitle: "Qualità progettata per la durabilità, non solo per l'ispezione.",
      qcText:
        "Un controllo qualità efficace è il nostro vantaggio distintivo. Oltre alle ispezioni visive ed elettriche al 100 %, diamo priorità a test di durata estrema e consumo energetico.",
      leadTimesEyebrow: "Tempi agili",
      leadTimesTitle: "Cicli di sviluppo rapidi per programmi display urgenti.",
      fastTrack:
        "Offriamo procedure fast-track per casi urgenti, un supporto essenziale per clienti con progetti critici.",
      globalEyebrow: "Presenza globale",
      globalTitle: "Scelti da clienti in tutto il mondo",
      leadTimes: {
        lcdPanelPrototype: "Prototipo pannello LCD",
        lcdModulePrototype: "Prototipo modulo LCD",
        mcuDesignPrototype: "Prototipo design MCU",
        lcdPanelMassProduction: "Produzione di serie pannelli LCD",
        lcdModuleMassProduction: "Produzione di serie moduli LCD",
      },
      leadTimeDurations: {
        twoWeeks: "2 settimane",
        threeWeeks: "3 settimane",
        threeToFiveWeeks: "3-5 settimane",
        threeToFourWeeks: "3-4 settimane",
      },
      markets: {
        europe: "Europa",
        asia: "Asia",
        northAmerica: "Nord America",
        southAmerica: "Sud America",
        australia: "Australia",
        africa: "Africa",
      },
    },
    contactCta: {
      title: "Pronti ad avviare il vostro progetto display personalizzato?",
      subtitle:
        "Ricevete un preventivo entro 24 ore. Il nostro team R&D è pronto a supportarvi con soluzioni LCD, LCM e PCBA custom.",
      button: "Contattate oggi i nostri ingegneri",
    },
    contactPage: {
      heroTitle: "Contatta NELYTECH",
      heroSubtitle:
        "Che serva una soluzione display personalizzata o un chiarimento sui prodotti, il nostro team di ingegneria è pronto ad assistervi.",
      directEyebrow: "Contatto diretto",
      directTitle: "Parlate con il nostro team di ingegneria display.",
      directText:
        "Inviate requisiti, disegni, dimensioni target, dettagli di interfaccia o note applicative. Indirizzeremo la richiesta al referente tecnico corretto.",
      emailLabel: "Email",
      officeLabel: "Ufficio Shenzhen",
      phonesLabel: "Telefoni",
      address:
        "Room 303, Building D, New Retail Digital Industrial Park, Nanchang, Xixiang, Bao'an, Shenzhen, China",
    },
    contactForm: {
      eyebrow: "Contatto",
      title: "Raccontateci cosa state sviluppando.",
      subtitle:
        "Condividete le informazioni essenziali e il nostro team di ingegneria risponderà tramite contact@nelytech.com.",
      submit: "Invia richiesta",
      noMatches: "Nessun risultato trovato",
      openOptions: "Apri opzioni",
      lockedNote: "Acquisito dalla pagina prodotto.",
      mailSubjectPrefix: "Richiesta NELYTECH",
      emailBody: {
        name: "Nome",
        workEmail: "Email aziendale",
        company: "Azienda",
        countryRegion: "Paese / Regione",
        productInterest: "Interesse prodotto",
        projectDetails: "Dettagli progetto",
      },
      fields: {
        name: {
          label: "Nome",
          placeholder: "Il vostro nome",
        },
        workEmail: {
          label: "Email aziendale",
          placeholder: "name@company.com",
        },
        company: {
          label: "Azienda",
          placeholder: "Nome azienda",
        },
        countryRegion: {
          label: "Paese / Regione",
          placeholder: "Cerca paese",
        },
        productInterest: {
          label: "Interesse prodotto",
          placeholder: "Cerca prodotto",
        },
        message: {
          label: "Messaggio",
          placeholder: "Dimensioni display, applicazione, quantità, tempistiche o requisiti tecnici.",
        },
      },
      productOptions: {
        generalInquiry: "Richiesta generale",
        customTnStnDisplay: "Display TN/STN personalizzato",
        tftColorModule: "Modulo TFT a colori",
        bespokePcbaSolution: "Soluzione PCBA su misura",
        touchPanelIntegration: "Integrazione touch panel",
      },
    },
  },
  ja: {
    hero: {
      eyebrow: "LCD・LCM ソリューション",
      title: "NELYTECH",
      intro:
        "LCD や LCM をお探しですか。まずは要件を整理しましょう。NELYTECH は研究開発力、価格競争力、サービス対応、スピードで高く評価されています。要件、課題、またはアイデアをお聞かせください。NELYTECH が最適な LCD・LCM ソリューションを提案します。",
    },
    about: {
      eyebrow: "NELYTECH について",
      heroTitle: "NELYTECH は中国で急成長している LCD・LCM メーカーです。",
      heroIntro:
        "TN、HTN、STN、FSTN パネルから COB、TAB、COG モジュールまで、カスタム MCU 開発と PCB 実装を含む総合的なディスプレイソリューションを提供します。品質、スピード、サービス、競争力のある価格で世界中のお客様から信頼されています。",
      engineeringEyebrow: "エンジニアリング",
      engineeringTitle: "コンセプトから量産まで支えるカスタム表示設計。",
      engineeringText:
        "LCD プロセス、MCU 開発、オプトエレクトロニクス、PCBA に精通した経験豊富なエンジニアが、ハードウェアとソフトウェアを個別設計し、開発期間を短縮して最終製品を最適化します。",
      qcEyebrow: "徹底した品質管理",
      qcTitle: "検査だけでなく、長期耐久性を重視した品質管理。",
      qcText:
        "有効な品質管理は当社の明確な強みです。100% の外観・電気検査に加え、過酷環境での耐久性試験と低消費電力試験を重視しています。",
      leadTimesEyebrow: "俊敏なリードタイム",
      leadTimesTitle: "緊急の表示プロジェクトに対応する迅速な開発サイクル。",
      fastTrack:
        "緊急案件には特別なファストトラック手順を用意し、困難な状況にあるお客様のプロジェクト推進を支援します。",
      globalEyebrow: "グローバル展開",
      globalTitle: "世界中のお客様からの信頼",
      leadTimes: {
        lcdPanelPrototype: "LCD パネル試作",
        lcdModulePrototype: "LCD モジュール試作",
        mcuDesignPrototype: "MCU 設計試作",
        lcdPanelMassProduction: "LCD パネル量産",
        lcdModuleMassProduction: "LCD モジュール量産",
      },
      leadTimeDurations: {
        twoWeeks: "2 週間",
        threeWeeks: "3 週間",
        threeToFiveWeeks: "3-5 週間",
        threeToFourWeeks: "3-4 週間",
      },
      markets: {
        europe: "欧州",
        asia: "アジア",
        northAmerica: "北米",
        southAmerica: "南米",
        australia: "オーストラリア",
        africa: "アフリカ",
      },
    },
    contactCta: {
      title: "カスタム表示プロジェクトを始めませんか？",
      subtitle:
        "24 時間以内にお見積りします。当社 R&D チームがカスタム LCD、LCM、PCBA ソリューションを支援します。",
      button: "今すぐエンジニアに相談",
    },
    contactPage: {
      heroTitle: "NELYTECH へお問い合わせ",
      heroSubtitle:
        "カスタム表示ソリューションのご相談から製品に関する質問まで、当社エンジニアリングチームが対応します。",
      directEyebrow: "直接お問い合わせ",
      directTitle: "表示技術チームにご相談ください。",
      directText:
        "要件、図面、目標寸法、インターフェース仕様、用途メモなどをお送りください。最適な技術担当者におつなぎします。",
      emailLabel: "メール",
      officeLabel: "深圳オフィス",
      phonesLabel: "電話",
      address:
        "Room 303, Building D, New Retail Digital Industrial Park, Nanchang, Xixiang, Bao'an, Shenzhen, China",
    },
    contactForm: {
      eyebrow: "お問い合わせ",
      title: "開発中の製品についてお聞かせください。",
      subtitle:
        "必要事項をご共有ください。当社エンジニアリングチームが contact@nelytech.com よりご連絡します。",
      submit: "問い合わせを送信",
      noMatches: "一致する項目がありません",
      openOptions: "オプションを開く",
      lockedNote: "製品ページから取得済みです。",
      mailSubjectPrefix: "NELYTECH 問い合わせ",
      emailBody: {
        name: "氏名",
        workEmail: "業務用メール",
        company: "会社名",
        countryRegion: "国 / 地域",
        productInterest: "関心のある製品",
        projectDetails: "プロジェクト詳細",
      },
      fields: {
        name: {
          label: "氏名",
          placeholder: "お名前",
        },
        workEmail: {
          label: "業務用メール",
          placeholder: "name@company.com",
        },
        company: {
          label: "会社名",
          placeholder: "会社名",
        },
        countryRegion: {
          label: "国 / 地域",
          placeholder: "国を検索",
        },
        productInterest: {
          label: "関心のある製品",
          placeholder: "製品分野を検索",
        },
        message: {
          label: "メッセージ",
          placeholder: "表示サイズ、用途、数量、スケジュール、技術要件など。",
        },
      },
      productOptions: {
        generalInquiry: "一般問い合わせ",
        customTnStnDisplay: "カスタム TN/STN ディスプレイ",
        tftColorModule: "TFT カラーモジュール",
        bespokePcbaSolution: "カスタム PCBA ソリューション",
        touchPanelIntegration: "タッチパネル統合",
      },
    },
  },
  ko: {
    hero: {
      eyebrow: "LCD 및 LCM 솔루션",
      title: "NELYTECH",
      intro:
        "LCD 또는 LCM을 찾고 계신가요? 먼저 요구사항을 차분히 정리해 보겠습니다. NELYTECH는 R&D 역량, 경쟁력 있는 가격, 빠른 서비스와 납기로 잘 알려져 있습니다. 요구사항, 문제점 또는 아이디어를 알려주시면 NELYTECH가 최적의 LCD 및 LCM 솔루션을 제안합니다.",
    },
    about: {
      eyebrow: "NELYTECH 소개",
      heroTitle: "NELYTECH는 중국의 빠르게 성장하는 LCD 및 LCM 제조사입니다.",
      heroIntro:
        "TN, HTN, STN, FSTN 패널부터 COB, TAB, COG 모듈까지 맞춤 MCU 개발과 PCB 조립을 포함한 완성형 디스플레이 솔루션을 제공합니다. 품질, 속도, 서비스, 경쟁력 있는 가격으로 전 세계 고객의 신뢰를 받고 있습니다.",
      engineeringEyebrow: "엔지니어링",
      engineeringTitle: "컨셉부터 양산까지 지원하는 맞춤형 디스플레이 엔지니어링.",
      engineeringText:
        "LCD 공정, MCU 개발, 광전자, PCBA에 경험이 풍부한 엔지니어 팀이 맞춤형 하드웨어와 소프트웨어를 설계하여 개발 속도를 높이고 최종 제품을 최적화합니다.",
      qcEyebrow: "엄격한 품질 관리",
      qcTitle: "검사를 넘어 장기 내구성을 위한 품질 관리.",
      qcText:
        "효과적인 품질 관리는 NELYTECH의 핵심 경쟁력입니다. 100% 외관 및 전기 검사뿐 아니라 극한 내구성 및 소비전력 테스트를 중요하게 수행합니다.",
      leadTimesEyebrow: "민첩한 리드타임",
      leadTimesTitle: "긴급 디스플레이 프로젝트를 위한 빠른 개발 사이클.",
      fastTrack:
        "긴급한 프로젝트를 위해 특별 패스트트랙 절차를 제공하여 어려운 상황의 고객이 빠르게 진행할 수 있도록 지원합니다.",
      globalEyebrow: "글로벌 공급",
      globalTitle: "전 세계 고객이 신뢰합니다",
      leadTimes: {
        lcdPanelPrototype: "LCD 패널 샘플",
        lcdModulePrototype: "LCD 모듈 샘플",
        mcuDesignPrototype: "MCU 설계 샘플",
        lcdPanelMassProduction: "LCD 패널 양산",
        lcdModuleMassProduction: "LCD 모듈 양산",
      },
      leadTimeDurations: {
        twoWeeks: "2주",
        threeWeeks: "3주",
        threeToFiveWeeks: "3-5주",
        threeToFourWeeks: "3-4주",
      },
      markets: {
        europe: "유럽",
        asia: "아시아",
        northAmerica: "북미",
        southAmerica: "남미",
        australia: "호주",
        africa: "아프리카",
      },
    },
    contactCta: {
      title: "맞춤형 디스플레이 프로젝트를 시작할 준비가 되셨나요?",
      subtitle:
        "24시간 이내에 견적을 받아보세요. NELYTECH R&D 팀이 맞춤형 LCD, LCM, PCBA 솔루션을 지원합니다.",
      button: "지금 엔지니어에게 문의",
    },
    contactPage: {
      heroTitle: "NELYTECH에 문의하기",
      heroSubtitle:
        "맞춤형 디스플레이 솔루션이 필요하거나 제품 관련 질문이 있으시면, 엔지니어링 팀이 신속하게 지원합니다.",
      directEyebrow: "직접 문의",
      directTitle: "디스플레이 엔지니어링 팀과 상담하세요.",
      directText:
        "요구사항, 도면, 목표 치수, 인터페이스 정보 또는 적용 메모를 보내주시면 적합한 기술 담당자에게 연결해 드립니다.",
      emailLabel: "이메일",
      officeLabel: "선전 사무소",
      phonesLabel: "전화",
      address:
        "Room 303, Building D, New Retail Digital Industrial Park, Nanchang, Xixiang, Bao'an, Shenzhen, China",
    },
    contactForm: {
      eyebrow: "문의",
      title: "개발 중인 제품을 알려주세요.",
      subtitle:
        "핵심 정보를 공유해 주시면 엔지니어링 팀이 contact@nelytech.com 으로 후속 연락을 드립니다.",
      submit: "문의 보내기",
      noMatches: "일치하는 항목이 없습니다",
      openOptions: "옵션 열기",
      lockedNote: "제품 페이지에서 자동 입력되었습니다.",
      mailSubjectPrefix: "NELYTECH 문의",
      emailBody: {
        name: "이름",
        workEmail: "업무용 이메일",
        company: "회사",
        countryRegion: "국가 / 지역",
        productInterest: "관심 제품",
        projectDetails: "프로젝트 세부사항",
      },
      fields: {
        name: {
          label: "이름",
          placeholder: "성함",
        },
        workEmail: {
          label: "업무용 이메일",
          placeholder: "name@company.com",
        },
        company: {
          label: "회사",
          placeholder: "회사명",
        },
        countryRegion: {
          label: "국가 / 지역",
          placeholder: "국가 검색",
        },
        productInterest: {
          label: "관심 제품",
          placeholder: "제품 관심 분야 검색",
        },
        message: {
          label: "메시지",
          placeholder: "디스플레이 크기, 적용 분야, 수량, 일정 또는 기술 요구사항.",
        },
      },
      productOptions: {
        generalInquiry: "일반 문의",
        customTnStnDisplay: "맞춤형 TN/STN 디스플레이",
        tftColorModule: "TFT 컬러 모듈",
        bespokePcbaSolution: "맞춤형 PCBA 솔루션",
        touchPanelIntegration: "터치 패널 통합",
      },
    },
  },
} as const satisfies Partial<Record<Language, TranslationNode>>;
