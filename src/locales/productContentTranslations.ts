import type { Language } from "@/locales/translations";

type TranslationNode = string | { readonly [key: string]: TranslationNode };

export const productContentTranslations = {
  en: {
    productsPage: {
      eyebrow: "Products",
      title: "LCD, LCM, and custom display solutions for industrial applications.",
      subtitle:
        "Browse NELYTECH's core product categories, from monochrome LCD panels to controller, PCBA, and touch-panel integration.",
    },
    megaMenu: {
      products: {
        label: "Products",
        description:
          "Click any product category to learn more about the technologies and solutions we offer.",
        featuredBadge: "Featured",
        viewAll: "View All Products",
        sections: {
          lcdPanels: {
            heading: "LCD Panels (Monochrome)",
            summary: "Core monochrome LCD panel technologies.",
          },
          lcdModules: {
            heading: "LCD Modules (LCM)",
            summary: "Standard and custom LCD module formats.",
          },
          assemblyTechnologies: {
            heading: "Assembly Technologies",
            summary: "Packaging and bonding methods for LCD and LCM production.",
          },
          customSolutions: {
            heading: "Advanced & Custom Solutions",
            summary: "Engineering support for advanced display assemblies.",
          },
        },
        links: {
          tn: "TN (Twisted Nematic)",
          htn: "HTN (High Twisted Nematic)",
          stn: "STN (Super Twisted Nematic)",
          fstn: "FSTN (Film Compensated STN)",
          va: "VA (Vertical Alignment)",
          characterModules: "Character LCD Modules",
          graphicModules: "Graphic LCD Modules",
          customSegment: "Custom Segment LCDs",
          cob: "COB (Chip On Board)",
          cog: "COG (Chip On Glass)",
          tab: "TAB (Tape Automated Bonding)",
          cof: "COF (Chip On Film)",
          tftModules: "TFT LCD Modules",
          customPcbaMcu: "Custom PCBA & MCU Development",
          touchPanels: "Touch Panels (CTP/RTP)",
        },
      },
    },
  },
  zh: {
    productsPage: {
      eyebrow: "产品",
      title: "面向工业应用的 LCD、LCM 与定制显示解决方案。",
      subtitle:
        "浏览 NELYTECH 的核心产品类别，覆盖单色 LCD 面板、控制器、PCBA 以及触摸屏集成。",
    },
    megaMenu: {
      products: {
        label: "产品",
        description: "点击任一产品类别，了解我们可提供的显示技术与解决方案。",
        featuredBadge: "重点",
        viewAll: "查看全部产品",
        sections: {
          lcdPanels: {
            heading: "LCD 面板（单色）",
            summary: "核心单色 LCD 面板技术。",
          },
          lcdModules: {
            heading: "LCD 模块（LCM）",
            summary: "标准与定制 LCD 模块形态。",
          },
          assemblyTechnologies: {
            heading: "组装工艺",
            summary: "用于 LCD 与 LCM 生产的封装和贴合工艺。",
          },
          customSolutions: {
            heading: "高级与定制解决方案",
            summary: "面向高级显示组件的工程支持。",
          },
        },
        links: {
          tn: "TN（扭曲向列）",
          htn: "HTN（高扭曲向列）",
          stn: "STN（超扭曲向列）",
          fstn: "FSTN（膜补偿 STN）",
          va: "VA（垂直配向）",
          characterModules: "字符 LCD 模块",
          graphicModules: "图形 LCD 模块",
          customSegment: "定制段码 LCD",
          cob: "COB（板上芯片）",
          cog: "COG（玻璃上芯片）",
          tab: "TAB（卷带自动贴合）",
          cof: "COF（薄膜上芯片）",
          tftModules: "TFT LCD 模块",
          customPcbaMcu: "定制 PCBA 与 MCU 开发",
          touchPanels: "触摸屏（CTP/RTP）",
        },
      },
    },
  },
  de: {
    productsPage: {
      eyebrow: "Produkte",
      title: "LCD-, LCM- und kundenspezifische Displaylösungen für industrielle Anwendungen.",
      subtitle:
        "Entdecken Sie NELYTECHs Kernproduktgruppen von monochromen LCD-Panels bis zu Controller-, PCBA- und Touchpanel-Integration.",
    },
    megaMenu: {
      products: {
        label: "Produkte",
        description:
          "Wählen Sie eine Produktkategorie, um mehr über unsere Technologien und Lösungen zu erfahren.",
        featuredBadge: "Fokus",
        viewAll: "Alle Produkte ansehen",
        sections: {
          lcdPanels: {
            heading: "LCD-Panels (monochrom)",
            summary: "Kerntechnologien für monochrome LCD-Panels.",
          },
          lcdModules: {
            heading: "LCD-Module (LCM)",
            summary: "Standardisierte und kundenspezifische LCD-Modulformate.",
          },
          assemblyTechnologies: {
            heading: "Montagetechnologien",
            summary: "Packaging- und Bonding-Verfahren für LCD- und LCM-Fertigung.",
          },
          customSolutions: {
            heading: "Advanced & Custom Solutions",
            summary: "Engineering-Support für anspruchsvolle Displaybaugruppen.",
          },
        },
        links: {
          tn: "TN (Twisted Nematic)",
          htn: "HTN (High Twisted Nematic)",
          stn: "STN (Super Twisted Nematic)",
          fstn: "FSTN (Film Compensated STN)",
          va: "VA (Vertical Alignment)",
          characterModules: "Zeichen-LCD-Module",
          graphicModules: "Grafik-LCD-Module",
          customSegment: "Kundenspezifische Segment-LCDs",
          cob: "COB (Chip auf Leiterplatte)",
          cog: "COG (Chip auf Glas)",
          tab: "TAB (automatisiertes Tape-Bonding)",
          cof: "COF (Chip auf Folie)",
          tftModules: "TFT-LCD-Module",
          customPcbaMcu: "Kundenspezifische PCBA- & MCU-Entwicklung",
          touchPanels: "Touchpanels (CTP/RTP)",
        },
      },
    },
  },
  es: {
    productsPage: {
      eyebrow: "Productos",
      title: "Soluciones LCD, LCM y displays personalizados para aplicaciones industriales.",
      subtitle:
        "Explore las categorías principales de NELYTECH, desde paneles LCD monocromos hasta integración de controladores, PCBA y paneles táctiles.",
    },
    megaMenu: {
      products: {
        label: "Productos",
        description:
          "Seleccione una categoría para conocer las tecnologías y soluciones que ofrecemos.",
        featuredBadge: "Destacado",
        viewAll: "Ver todos los productos",
        sections: {
          lcdPanels: {
            heading: "Paneles LCD (monocromos)",
            summary: "Tecnologías clave de paneles LCD monocromos.",
          },
          lcdModules: {
            heading: "Módulos LCD (LCM)",
            summary: "Formatos de módulos LCD estándar y personalizados.",
          },
          assemblyTechnologies: {
            heading: "Tecnologías de ensamblaje",
            summary: "Métodos de encapsulado y bonding para producción LCD y LCM.",
          },
          customSolutions: {
            heading: "Soluciones avanzadas y a medida",
            summary: "Soporte de ingeniería para conjuntos de display avanzados.",
          },
        },
        links: {
          tn: "TN (Twisted Nematic)",
          htn: "HTN (High Twisted Nematic)",
          stn: "STN (Super Twisted Nematic)",
          fstn: "FSTN (Film Compensated STN)",
          va: "VA (Vertical Alignment)",
          characterModules: "Módulos LCD de caracteres",
          graphicModules: "Módulos LCD gráficos",
          customSegment: "LCD de segmentos personalizados",
          cob: "COB (chip sobre placa)",
          cog: "COG (chip sobre vidrio)",
          tab: "TAB (bonding automatizado en cinta)",
          cof: "COF (chip sobre película)",
          tftModules: "Módulos TFT LCD",
          customPcbaMcu: "Desarrollo PCBA y MCU a medida",
          touchPanels: "Paneles táctiles (CTP/RTP)",
        },
      },
    },
  },
  fr: {
    productsPage: {
      eyebrow: "Produits",
      title: "Solutions LCD, LCM et affichages personnalisés pour applications industrielles.",
      subtitle:
        "Parcourez les catégories NELYTECH, des panneaux LCD monochromes à l'intégration contrôleur, PCBA et écran tactile.",
    },
    megaMenu: {
      products: {
        label: "Produits",
        description:
          "Sélectionnez une catégorie pour découvrir les technologies et solutions que nous proposons.",
        featuredBadge: "Clé",
        viewAll: "Voir tous les produits",
        sections: {
          lcdPanels: {
            heading: "Panneaux LCD (monochromes)",
            summary: "Technologies principales de panneaux LCD monochromes.",
          },
          lcdModules: {
            heading: "Modules LCD (LCM)",
            summary: "Formats de modules LCD standard et personnalisés.",
          },
          assemblyTechnologies: {
            heading: "Technologies d'assemblage",
            summary: "Méthodes de packaging et de bonding pour production LCD et LCM.",
          },
          customSolutions: {
            heading: "Solutions avancées et sur mesure",
            summary: "Support d'ingénierie pour sous-ensembles d'affichage avancés.",
          },
        },
        links: {
          tn: "TN (Twisted Nematic)",
          htn: "HTN (High Twisted Nematic)",
          stn: "STN (Super Twisted Nematic)",
          fstn: "FSTN (Film Compensated STN)",
          va: "VA (Vertical Alignment)",
          characterModules: "Modules LCD caractères",
          graphicModules: "Modules LCD graphiques",
          customSegment: "LCD segmentés personnalisés",
          cob: "COB (puce sur carte)",
          cog: "COG (puce sur verre)",
          tab: "TAB (bonding automatisé sur bande)",
          cof: "COF (puce sur film)",
          tftModules: "Modules TFT LCD",
          customPcbaMcu: "Développement PCBA et MCU sur mesure",
          touchPanels: "Écrans tactiles (CTP/RTP)",
        },
      },
    },
  },
  it: {
    productsPage: {
      eyebrow: "Prodotti",
      title: "Soluzioni LCD, LCM e display personalizzati per applicazioni industriali.",
      subtitle:
        "Esplora le categorie principali NELYTECH, dai pannelli LCD monocromatici all'integrazione di controller, PCBA e touch panel.",
    },
    megaMenu: {
      products: {
        label: "Prodotti",
        description:
          "Seleziona una categoria per scoprire le tecnologie e le soluzioni che offriamo.",
        featuredBadge: "Focus",
        viewAll: "Vedi tutti i prodotti",
        sections: {
          lcdPanels: {
            heading: "Pannelli LCD (monocromatici)",
            summary: "Tecnologie principali per pannelli LCD monocromatici.",
          },
          lcdModules: {
            heading: "Moduli LCD (LCM)",
            summary: "Formati di moduli LCD standard e personalizzati.",
          },
          assemblyTechnologies: {
            heading: "Tecnologie di assemblaggio",
            summary: "Metodi di packaging e bonding per produzione LCD e LCM.",
          },
          customSolutions: {
            heading: "Soluzioni avanzate e personalizzate",
            summary: "Supporto engineering per assiemi display avanzati.",
          },
        },
        links: {
          tn: "TN (Twisted Nematic)",
          htn: "HTN (High Twisted Nematic)",
          stn: "STN (Super Twisted Nematic)",
          fstn: "FSTN (Film Compensated STN)",
          va: "VA (Vertical Alignment)",
          characterModules: "Moduli LCD caratteri",
          graphicModules: "Moduli LCD grafici",
          customSegment: "LCD segmentati personalizzati",
          cob: "COB (chip su scheda)",
          cog: "COG (chip su vetro)",
          tab: "TAB (bonding automatizzato su nastro)",
          cof: "COF (chip su film)",
          tftModules: "Moduli TFT LCD",
          customPcbaMcu: "Sviluppo PCBA e MCU custom",
          touchPanels: "Touch panel (CTP/RTP)",
        },
      },
    },
  },
  ja: {
    productsPage: {
      eyebrow: "製品",
      title: "産業用途向け LCD、LCM、カスタムディスプレイソリューション。",
      subtitle:
        "モノクロ LCD パネルからコントローラ、PCBA、タッチパネル統合まで、NELYTECH の主要製品カテゴリをご確認ください。",
    },
    megaMenu: {
      products: {
        label: "製品",
        description: "各製品カテゴリを選択して、当社の技術とソリューションをご確認ください。",
        featuredBadge: "注目",
        viewAll: "すべての製品を見る",
        sections: {
          lcdPanels: {
            heading: "LCD パネル（モノクロ）",
            summary: "モノクロ LCD パネルの主要技術。",
          },
          lcdModules: {
            heading: "LCD モジュール（LCM）",
            summary: "標準およびカスタム LCD モジュール形式。",
          },
          assemblyTechnologies: {
            heading: "実装・組立技術",
            summary: "LCD・LCM 生産向けのパッケージングおよびボンディング方式。",
          },
          customSolutions: {
            heading: "高度なカスタムソリューション",
            summary: "高度なディスプレイアセンブリ向けエンジニアリングサポート。",
          },
        },
        links: {
          tn: "TN（ツイステッドネマティック）",
          htn: "HTN（高ツイストネマティック）",
          stn: "STN（スーパーツイステッドネマティック）",
          fstn: "FSTN（フィルム補償 STN）",
          va: "VA（垂直配向）",
          characterModules: "キャラクタ LCD モジュール",
          graphicModules: "グラフィック LCD モジュール",
          customSegment: "カスタムセグメント LCD",
          cob: "COB（基板上チップ実装）",
          cog: "COG（ガラス上チップ実装）",
          tab: "TAB（テープ自動ボンディング）",
          cof: "COF（フィルム上チップ実装）",
          tftModules: "TFT LCD モジュール",
          customPcbaMcu: "カスタム PCBA・MCU 開発",
          touchPanels: "タッチパネル（CTP/RTP）",
        },
      },
    },
  },
  ko: {
    productsPage: {
      eyebrow: "제품",
      title: "산업용 LCD, LCM 및 맞춤형 디스플레이 솔루션.",
      subtitle:
        "단색 LCD 패널부터 컨트롤러, PCBA, 터치 패널 통합까지 NELYTECH의 핵심 제품군을 확인하세요.",
    },
    megaMenu: {
      products: {
        label: "제품",
        description: "제품 카테고리를 선택하여 제공 가능한 기술과 솔루션을 확인하세요.",
        featuredBadge: "핵심",
        viewAll: "전체 제품 보기",
        sections: {
          lcdPanels: {
            heading: "LCD 패널(단색)",
            summary: "핵심 단색 LCD 패널 기술.",
          },
          lcdModules: {
            heading: "LCD 모듈(LCM)",
            summary: "표준 및 맞춤형 LCD 모듈 형식.",
          },
          assemblyTechnologies: {
            heading: "조립 기술",
            summary: "LCD 및 LCM 생산을 위한 패키징 및 본딩 방식.",
          },
          customSolutions: {
            heading: "고급 맞춤형 솔루션",
            summary: "고급 디스플레이 어셈블리를 위한 엔지니어링 지원.",
          },
        },
        links: {
          tn: "TN (Twisted Nematic)",
          htn: "HTN (High Twisted Nematic)",
          stn: "STN (Super Twisted Nematic)",
          fstn: "FSTN (Film Compensated STN)",
          va: "VA (Vertical Alignment)",
          characterModules: "문자 LCD 모듈",
          graphicModules: "그래픽 LCD 모듈",
          customSegment: "맞춤형 세그먼트 LCD",
          cob: "COB (기판 위 칩 실장)",
          cog: "COG (글라스 위 칩 실장)",
          tab: "TAB (테이프 자동 본딩)",
          cof: "COF (필름 위 칩 실장)",
          tftModules: "TFT LCD 모듈",
          customPcbaMcu: "맞춤형 PCBA 및 MCU 개발",
          touchPanels: "터치 패널(CTP/RTP)",
        },
      },
    },
  },
} as const satisfies Partial<Record<Language, TranslationNode>>;
