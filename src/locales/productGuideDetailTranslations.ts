import type { Language } from "@/locales/translations";

type TranslationNode = string | { readonly [key: string]: TranslationNode };

export const productGuideDetailTranslations = {
  en: {
    productGuide: {
      detailLabels: {
        technicalSpecs: "Technical specs",
        features: "Key features",
        applications: "Best-fit applications",
      },
      items: {
        segment: {
          details: {
            technicalSpecs: {
              0: "TN, HTN, STN, FSTN, and VA monochrome glass options.",
              1: "Positive or negative display modes with static, 1/2, 1/3, and 1/4 duty drive.",
              2: "Custom icons, legends, battery indicators, seven-segment digits, and viewing windows.",
              3: "Low-voltage driving options suitable for battery-powered embedded devices.",
            },
            features: {
              0: "Lowest unit cost for fixed information displays.",
              1: "Excellent readability in sunlight or simple backlit environments.",
              2: "Long lifecycle availability with stable tooling and repeatable optical quality.",
              3: "Custom pin layouts, zebra connectors, FPC tails, and edge-seal options.",
            },
            applications: {
              0: "Utility meters, thermostats, electronic scales, calculators, timers, and handheld instruments.",
              1: "Products that show fixed numbers, symbols, status icons, or simple operating modes.",
              2: "High-volume devices where power consumption and cost control are the primary constraints.",
            },
          },
        },
        characterGraphic: {
          details: {
            technicalSpecs: {
              0: "Standard character formats such as 8x2, 16x2, 20x4, and custom character maps.",
              1: "Graphic formats such as 128x64, 192x64, 240x128, and custom matrix resolutions.",
              2: "COB, COG, and custom module assemblies with integrated controllers.",
              3: "SPI, I2C, 6800, 8080, and parallel interface options depending on controller selection.",
            },
            features: {
              0: "Clear monochrome UI without the cost and power draw of full-color TFT.",
              1: "Supports menus, alarm states, simple charts, icons, and multilingual text layouts.",
              2: "Reliable for industrial products that require long-term supply consistency.",
              3: "Backlight color, polarizer, viewing angle, and connector position can be tailored.",
            },
            applications: {
              0: "Factory automation panels, test equipment, printers, UPS systems, and basic medical monitors.",
              1: "Products that need dynamic text or simple graphics but not rich color interfaces.",
              2: "Control devices where rugged readability matters more than visual complexity.",
            },
          },
        },
        tftColor: {
          details: {
            technicalSpecs: {
              0: "Common TFT sizes from compact 2.4-inch modules through larger HMI-class displays.",
              1: "TN and IPS panel options with RGB, SPI, MCU, LVDS, or MIPI interface support.",
              2: "Optional capacitive or resistive touch integration with cover lens customization.",
              3: "High-brightness backlights, wide-temperature components, and optical bonding options.",
            },
            features: {
              0: "Full-color interface for image-rich dashboards, guided workflows, and modern product UX.",
              1: "Supports branded visual systems, advanced icons, status screens, and touch interaction.",
              2: "Can be integrated with custom PCBA to simplify wiring and accelerate system assembly.",
              3: "Brightness, touch stack, cover glass, and FPC routing can be engineered around the enclosure.",
            },
            applications: {
              0: "Smart home hubs, EV chargers, medical ventilators, handheld terminals, and premium appliances.",
              1: "Products that require a modern interactive interface with color, touch, and rich graphics.",
              2: "Systems where visual differentiation and user experience are core product requirements.",
            },
          },
        },
        pcbaIntegration: {
          details: {
            technicalSpecs: {
              0: "Custom display driver boards with MCU, power management, connectors, and touch controllers.",
              1: "Interface conversion across SPI, I2C, RGB, MIPI, UART, USB, and application-specific buses.",
              2: "EMI-aware routing, shielding strategy, cable simplification, and enclosure-fit board geometry.",
              3: "Firmware support for initialization, backlight control, touch tuning, and display diagnostics.",
            },
            features: {
              0: "Turns a raw display into a complete plug-and-play hardware subsystem.",
              1: "Reduces client-side sourcing, validation, wiring, and mechanical integration effort.",
              2: "Improves certification readiness through controlled layout, grounding, and signal integrity.",
              3: "Best for customers who want one accountable engineering partner for the full display stack.",
            },
            applications: {
              0: "Medical devices, industrial controllers, smart appliances, vehicle accessories, and IoT terminals.",
              1: "Projects with complex wiring, strict certification needs, or limited internal electronics resources.",
              2: "Programs that require fast samples, low NRE, and a direct path from prototype to volume production.",
            },
          },
        },
      },
    },
  },
  zh: {
    productGuide: {
      detailLabels: {
        technicalSpecs: "技术规格",
        features: "核心特性",
        applications: "适用场景",
      },
      items: {
        segment: {
          details: {
            technicalSpecs: {
              0: "支持 TN、HTN、STN、FSTN 与 VA 单色玻璃方案。",
              1: "支持正显、负显以及 static、1/2、1/3、1/4 duty 驱动方式。",
              2: "可定制图标、文字标识、电池符号、七段数字和显示窗口。",
              3: "支持低电压驱动，适合电池供电的嵌入式设备。",
            },
            features: {
              0: "固定信息显示场景下具备最低综合单价。",
              1: "在阳光或简单背光环境下仍具备良好可读性。",
              2: "模具稳定、光学一致性高，适合长生命周期供应。",
              3: "可定制引脚、斑马条连接、FPC 引出和边封方案。",
            },
            applications: {
              0: "适用于水电气表、温控器、电子秤、计算器、计时器和手持仪表。",
              1: "适合显示固定数字、符号、状态图标或简单工作模式的产品。",
              2: "适合功耗与成本控制是关键约束的大批量设备。",
            },
          },
        },
        characterGraphic: {
          details: {
            technicalSpecs: {
              0: "支持 8x2、16x2、20x4 等标准字符规格及自定义字库。",
              1: "支持 128x64、192x64、240x128 等图形点阵和定制分辨率。",
              2: "可采用 COB、COG 或带控制器的定制模块装配。",
              3: "可根据控制器选择 SPI、I2C、6800、8080 或并口接口。",
            },
            features: {
              0: "以低于 TFT 的成本与功耗实现清晰单色 UI。",
              1: "支持菜单、报警状态、简单图表、图标和多语言文本排版。",
              2: "适合需要长期稳定供货的工业类产品。",
              3: "背光颜色、偏光片、视角和连接器位置均可定制。",
            },
            applications: {
              0: "适用于工厂自动化面板、测试设备、打印机、UPS 和基础医疗监视器。",
              1: "适合需要动态文本或简单图形但不需要全彩界面的产品。",
              2: "适合更重视耐用性与可读性而非复杂视觉效果的控制设备。",
            },
          },
        },
        tftColor: {
          details: {
            technicalSpecs: {
              0: "覆盖紧凑型 2.4 英寸到 HMI 级大尺寸 TFT 模块。",
              1: "支持 TN、IPS 面板以及 RGB、SPI、MCU、LVDS、MIPI 接口。",
              2: "可集成电容或电阻触摸，并支持盖板玻璃定制。",
              3: "可提供高亮背光、宽温器件和光学贴合方案。",
            },
            features: {
              0: "适合图像丰富的仪表盘、流程引导和现代产品交互。",
              1: "支持品牌视觉系统、高级图标、状态页面和触摸操作。",
              2: "可与定制 PCBA 集成，简化线束并加快整机装配。",
              3: "亮度、触摸结构、盖板和 FPC 走向可围绕外壳工程化设计。",
            },
            applications: {
              0: "适用于智能家居中控、EV 充电桩、医疗呼吸机、手持终端和高端家电。",
              1: "适合需要彩色、触摸和丰富图形的现代交互产品。",
              2: "适合视觉差异化与用户体验是核心要求的系统。",
            },
          },
        },
        pcbaIntegration: {
          details: {
            technicalSpecs: {
              0: "可定制带 MCU、电源管理、连接器和触摸控制器的显示驱动板。",
              1: "支持 SPI、I2C、RGB、MIPI、UART、USB 及专用总线转换。",
              2: "考虑 EMI 布线、屏蔽策略、线束简化和适配外壳的板型。",
              3: "支持初始化、背光控制、触摸调试和显示诊断固件。",
            },
            features: {
              0: "将裸屏转化为完整即插即用的硬件子系统。",
              1: "减少客户侧采购、验证、布线和机械集成工作量。",
              2: "通过受控布局、接地和信号完整性提升认证准备度。",
              3: "适合需要单一工程伙伴负责完整显示栈的客户。",
            },
            applications: {
              0: "适用于医疗设备、工业控制器、智能家电、车载配件和 IoT 终端。",
              1: "适合布线复杂、认证严格或内部电子资源有限的项目。",
              2: "适合需要快速样品、低 NRE 并直接过渡到量产的项目。",
            },
          },
        },
      },
    },
  },
  de: {
    productGuide: {
      detailLabels: {
        technicalSpecs: "Technische Daten",
        features: "Kernmerkmale",
        applications: "Geeignete Anwendungen",
      },
      items: {
        segment: {
          details: {
            technicalSpecs: {
              0: "TN-, HTN-, STN-, FSTN- und VA-Optionen für monochromes Glas.",
              1: "Positive oder negative Anzeige mit Static-, 1/2-, 1/3- und 1/4-Duty-Ansteuerung.",
              2: "Kundenspezifische Icons, Legenden, Batteriesymbole, Siebensegmente und Sichtfenster.",
              3: "Niederspannungsansteuerung für batteriebetriebene Embedded-Geräte.",
            },
            features: {
              0: "Niedrigste Stückkosten für feste Informationsanzeigen.",
              1: "Sehr gute Lesbarkeit bei Sonnenlicht oder einfacher Hinterleuchtung.",
              2: "Lange Verfügbarkeit mit stabilen Werkzeugen und reproduzierbarer Optik.",
              3: "Anpassbare Pinbelegung, Zebra-Kontakte, FPC-Ausgänge und Randversiegelung.",
            },
            applications: {
              0: "Zähler, Thermostate, Waagen, Rechner, Timer und tragbare Messgeräte.",
              1: "Produkte mit festen Zahlen, Symbolen, Statusicons oder einfachen Betriebsmodi.",
              2: "Großseriengeräte, bei denen Stromverbrauch und Kosten entscheidend sind.",
            },
          },
        },
        characterGraphic: {
          details: {
            technicalSpecs: {
              0: "Standard-Zeichenformate wie 8x2, 16x2, 20x4 und kundenspezifische Zeichensätze.",
              1: "Grafikformate wie 128x64, 192x64, 240x128 und kundenspezifische Matrixauflösungen.",
              2: "COB-, COG- und kundenspezifische Modulaufbauten mit integrierten Controllern.",
              3: "SPI-, I2C-, 6800-, 8080- und Parallelinterface je nach Controllerauswahl.",
            },
            features: {
              0: "Klare monochrome UI ohne Kosten und Leistungsaufnahme eines Vollfarb-TFT.",
              1: "Unterstützt Menüs, Alarme, einfache Diagramme, Icons und mehrsprachige Texte.",
              2: "Zuverlässig für Industrieprodukte mit langfristiger Lieferanforderung.",
              3: "Backlight-Farbe, Polarisator, Blickwinkel und Steckverbinderposition sind anpassbar.",
            },
            applications: {
              0: "Automatisierungspanels, Prüfgeräte, Drucker, USV-Systeme und einfache Medizinmonitore.",
              1: "Produkte mit dynamischem Text oder einfachen Grafiken ohne vollfarbige Oberfläche.",
              2: "Steuergeräte, bei denen robuste Lesbarkeit wichtiger ist als visuelle Komplexität.",
            },
          },
        },
        tftColor: {
          details: {
            technicalSpecs: {
              0: "TFT-Größen von kompakten 2,4-Zoll-Modulen bis zu größeren HMI-Displays.",
              1: "TN- und IPS-Optionen mit RGB-, SPI-, MCU-, LVDS- oder MIPI-Schnittstelle.",
              2: "Optionale kapazitive oder resistive Touch-Integration mit Cover-Glass-Anpassung.",
              3: "Hochhelle Backlights, Weittemperatur-Komponenten und optisches Bonding.",
            },
            features: {
              0: "Vollfarbige Oberfläche für bildreiche Dashboards, Workflows und moderne UX.",
              1: "Unterstützt Markenvisualisierung, Icons, Statusseiten und Touch-Bedienung.",
              2: "Integration mit kundenspezifischer PCBA vereinfacht Verkabelung und Montage.",
              3: "Helligkeit, Touch-Aufbau, Coverglas und FPC-Routing werden gehäusegerecht entwickelt.",
            },
            applications: {
              0: "Smart-Home-Hubs, EV-Lader, Beatmungsgeräte, Handhelds und Premium-Hausgeräte.",
              1: "Produkte mit moderner Interaktion, Farbe, Touch und reichhaltiger Grafik.",
              2: "Systeme, bei denen visuelle Differenzierung und Nutzererlebnis zentral sind.",
            },
          },
        },
        pcbaIntegration: {
          details: {
            technicalSpecs: {
              0: "Kundenspezifische Displaytreiberboards mit MCU, Power-Management, Steckern und Touch-Controllern.",
              1: "Schnittstellenkonvertierung über SPI, I2C, RGB, MIPI, UART, USB und projektspezifische Busse.",
              2: "EMI-bewusstes Routing, Abschirmung, Kabelvereinfachung und gehäusegerechte Leiterplattenform.",
              3: "Firmware für Initialisierung, Backlight-Steuerung, Touch-Abstimmung und Displaydiagnose.",
            },
            features: {
              0: "Macht aus einem Rohdisplay ein vollständiges Plug-and-play-Hardware-Subsystem.",
              1: "Reduziert Beschaffung, Validierung, Verkabelung und mechanische Integration beim Kunden.",
              2: "Verbessert Zertifizierungsreife durch kontrolliertes Layout, Erdung und Signalintegrität.",
              3: "Ideal für Kunden, die einen verantwortlichen Partner für den gesamten Display-Stack suchen.",
            },
            applications: {
              0: "Medizingeräte, Industriesteuerungen, Smart Appliances, Fahrzeugzubehör und IoT-Terminals.",
              1: "Projekte mit komplexer Verkabelung, strengen Zertifizierungen oder knappen Elektronikressourcen.",
              2: "Programme mit schnellen Mustern, niedriger NRE und direktem Weg zur Serienproduktion.",
            },
          },
        },
      },
    },
  },
  es: {
    productGuide: {
      detailLabels: {
        technicalSpecs: "Especificaciones técnicas",
        features: "Funciones clave",
        applications: "Aplicaciones ideales",
      },
      items: {
        segment: {
          details: {
            technicalSpecs: {
              0: "Opciones de vidrio monocromo TN, HTN, STN, FSTN y VA.",
              1: "Modo positivo o negativo con conducción static, 1/2, 1/3 y 1/4 duty.",
              2: "Iconos, leyendas, indicadores de batería, dígitos de siete segmentos y ventanas a medida.",
              3: "Opciones de bajo voltaje para dispositivos embebidos alimentados por batería.",
            },
            features: {
              0: "El menor coste unitario para información fija.",
              1: "Excelente legibilidad con luz solar o retroiluminación simple.",
              2: "Disponibilidad de largo ciclo con utillaje estable y calidad óptica repetible.",
              3: "Pines, conectores zebra, colas FPC y sellado perimetral personalizables.",
            },
            applications: {
              0: "Medidores, termostatos, básculas, calculadoras, temporizadores e instrumentos portátiles.",
              1: "Productos con números, símbolos, iconos de estado o modos simples fijos.",
              2: "Equipos de alto volumen donde consumo y coste son las restricciones principales.",
            },
          },
        },
        characterGraphic: {
          details: {
            technicalSpecs: {
              0: "Formatos de caracteres 8x2, 16x2, 20x4 y mapas de caracteres personalizados.",
              1: "Formatos gráficos 128x64, 192x64, 240x128 y resoluciones matriciales a medida.",
              2: "Ensambles COB, COG y módulos personalizados con controladores integrados.",
              3: "Interfaces SPI, I2C, 6800, 8080 y paralelas según el controlador.",
            },
            features: {
              0: "UI monocroma clara sin el coste ni el consumo de un TFT a color.",
              1: "Admite menús, alarmas, gráficos simples, iconos y textos multilingües.",
              2: "Fiable para productos industriales que requieren suministro a largo plazo.",
              3: "Color de backlight, polarizador, ángulo de visión y conector adaptables.",
            },
            applications: {
              0: "Paneles de automatización, equipos de prueba, impresoras, UPS y monitores médicos básicos.",
              1: "Productos con texto dinámico o gráficos simples sin interfaz a color compleja.",
              2: "Dispositivos de control donde la legibilidad robusta pesa más que la complejidad visual.",
            },
          },
        },
        tftColor: {
          details: {
            technicalSpecs: {
              0: "Tamaños TFT desde módulos compactos de 2,4 pulgadas hasta pantallas HMI mayores.",
              1: "Paneles TN e IPS con interfaces RGB, SPI, MCU, LVDS o MIPI.",
              2: "Integración táctil capacitiva o resistiva con cubierta de vidrio personalizada.",
              3: "Backlights de alto brillo, componentes wide-temp y bonding óptico.",
            },
            features: {
              0: "Interfaz a color para dashboards visuales, flujos guiados y UX moderna.",
              1: "Admite sistemas visuales de marca, iconos avanzados, estados e interacción táctil.",
              2: "Integración con PCBA personalizada para simplificar cableado y montaje.",
              3: "Brillo, touch stack, cover glass y FPC se diseñan según la carcasa.",
            },
            applications: {
              0: "Hubs smart home, cargadores EV, ventiladores médicos, terminales portátiles y electrodomésticos premium.",
              1: "Productos que requieren color, tacto, gráficos ricos e interfaz moderna.",
              2: "Sistemas donde diferenciación visual y experiencia de usuario son requisitos clave.",
            },
          },
        },
        pcbaIntegration: {
          details: {
            technicalSpecs: {
              0: "Placas driver a medida con MCU, gestión de energía, conectores y controladores táctiles.",
              1: "Conversión de interfaces SPI, I2C, RGB, MIPI, UART, USB y buses específicos.",
              2: "Ruteo con enfoque EMI, estrategia de blindaje, cableado simplificado y geometría para carcasa.",
              3: "Firmware para inicialización, control de backlight, ajuste táctil y diagnóstico.",
            },
            features: {
              0: "Convierte un display raw en un subsistema hardware plug-and-play.",
              1: "Reduce sourcing, validación, cableado e integración mecánica del cliente.",
              2: "Mejora la preparación para certificación con layout, tierra e integridad de señal controlados.",
              3: "Ideal para clientes que desean un único socio responsable del display completo.",
            },
            applications: {
              0: "Dispositivos médicos, controladores industriales, appliances inteligentes, accesorios automotrices e IoT.",
              1: "Proyectos con cableado complejo, certificaciones estrictas o recursos electrónicos limitados.",
              2: "Programas con muestras rápidas, bajo NRE y transición directa a volumen.",
            },
          },
        },
      },
    },
  },
  fr: {
    productGuide: {
      detailLabels: {
        technicalSpecs: "Spécifications techniques",
        features: "Fonctions clés",
        applications: "Applications adaptées",
      },
      items: {
        segment: {
          details: {
            technicalSpecs: {
              0: "Options de verre monochrome TN, HTN, STN, FSTN et VA.",
              1: "Affichage positif ou négatif avec pilotage static, 1/2, 1/3 et 1/4 duty.",
              2: "Icônes, libellés, indicateurs batterie, chiffres sept segments et fenêtres personnalisés.",
              3: "Pilotage basse tension adapté aux appareils embarqués sur batterie.",
            },
            features: {
              0: "Coût unitaire minimal pour les informations fixes.",
              1: "Très bonne lisibilité au soleil ou avec rétroéclairage simple.",
              2: "Disponibilité longue durée avec outillage stable et qualité optique répétable.",
              3: "Brochage, connecteurs zebra, queues FPC et scellement personnalisables.",
            },
            applications: {
              0: "Compteurs, thermostats, balances, calculatrices, minuteries et instruments portables.",
              1: "Produits affichant chiffres, symboles, icônes d'état ou modes simples fixes.",
              2: "Appareils de grande série où consommation et coût sont prioritaires.",
            },
          },
        },
        characterGraphic: {
          details: {
            technicalSpecs: {
              0: "Formats caractères 8x2, 16x2, 20x4 et tables de caractères personnalisées.",
              1: "Formats graphiques 128x64, 192x64, 240x128 et résolutions matricielles sur mesure.",
              2: "Assemblages COB, COG et modules personnalisés avec contrôleurs intégrés.",
              3: "Interfaces SPI, I2C, 6800, 8080 et parallèles selon le contrôleur.",
            },
            features: {
              0: "Interface monochrome claire sans le coût ni la consommation d'un TFT couleur.",
              1: "Menus, alarmes, graphiques simples, icônes et textes multilingues.",
              2: "Fiable pour les produits industriels nécessitant un approvisionnement long terme.",
              3: "Couleur de rétroéclairage, polariseur, angle de vue et connecteur ajustables.",
            },
            applications: {
              0: "Panneaux d'automatisation, équipements de test, imprimantes, UPS et moniteurs médicaux simples.",
              1: "Produits nécessitant texte dynamique ou graphiques simples sans interface couleur riche.",
              2: "Dispositifs de contrôle où la lisibilité robuste prime sur la complexité visuelle.",
            },
          },
        },
        tftColor: {
          details: {
            technicalSpecs: {
              0: "Tailles TFT des modules compacts 2,4 pouces aux écrans HMI plus grands.",
              1: "Options TN et IPS avec interfaces RGB, SPI, MCU, LVDS ou MIPI.",
              2: "Intégration tactile capacitive ou résistive avec cover lens personnalisé.",
              3: "Rétroéclairages haute luminosité, composants wide-temp et collage optique.",
            },
            features: {
              0: "Interface couleur pour dashboards riches, workflows guidés et UX moderne.",
              1: "Prend en charge identité visuelle, icônes avancées, états et interaction tactile.",
              2: "Intégrable à une PCBA sur mesure pour simplifier câblage et assemblage.",
              3: "Luminosité, stack tactile, verre de protection et FPC adaptés au boîtier.",
            },
            applications: {
              0: "Hubs smart home, bornes EV, ventilateurs médicaux, terminaux portables et appareils premium.",
              1: "Produits exigeant couleur, tactile, graphiques riches et interface moderne.",
              2: "Systèmes où différenciation visuelle et expérience utilisateur sont essentielles.",
            },
          },
        },
        pcbaIntegration: {
          details: {
            technicalSpecs: {
              0: "Cartes driver sur mesure avec MCU, gestion d'alimentation, connecteurs et contrôleurs tactiles.",
              1: "Conversion d'interfaces SPI, I2C, RGB, MIPI, UART, USB et bus spécifiques.",
              2: "Routage orienté EMI, blindage, câblage simplifié et géométrie adaptée au boîtier.",
              3: "Firmware pour initialisation, backlight, réglage tactile et diagnostic d'affichage.",
            },
            features: {
              0: "Transforme un écran brut en sous-système matériel plug-and-play.",
              1: "Réduit sourcing, validation, câblage et intégration mécanique côté client.",
              2: "Améliore la préparation certification par layout, masse et intégrité de signal maîtrisés.",
              3: "Idéal pour un partenaire unique responsable de toute la pile display.",
            },
            applications: {
              0: "Dispositifs médicaux, contrôleurs industriels, appareils connectés, accessoires véhicule et terminaux IoT.",
              1: "Projets à câblage complexe, certifications strictes ou ressources électroniques limitées.",
              2: "Programmes nécessitant échantillons rapides, faible NRE et passage direct au volume.",
            },
          },
        },
      },
    },
  },
  it: {
    productGuide: {
      detailLabels: {
        technicalSpecs: "Specifiche tecniche",
        features: "Funzioni chiave",
        applications: "Applicazioni ideali",
      },
      items: {
        segment: {
          details: {
            technicalSpecs: {
              0: "Opzioni vetro monocromatico TN, HTN, STN, FSTN e VA.",
              1: "Modalità positiva o negativa con pilotaggio static, 1/2, 1/3 e 1/4 duty.",
              2: "Icone, legende, indicatori batteria, cifre a sette segmenti e finestre custom.",
              3: "Pilotaggio a bassa tensione per dispositivi embedded alimentati a batteria.",
            },
            features: {
              0: "Costo unitario più basso per visualizzazioni a informazioni fisse.",
              1: "Ottima leggibilità al sole o con retroilluminazione semplice.",
              2: "Disponibilità a lungo ciclo con tooling stabile e qualità ottica ripetibile.",
              3: "Pinout, connettori zebra, code FPC e sigillature bordo personalizzabili.",
            },
            applications: {
              0: "Contatori, termostati, bilance, calcolatrici, timer e strumenti portatili.",
              1: "Prodotti con numeri, simboli, icone di stato o modalità operative fisse.",
              2: "Dispositivi ad alto volume dove consumo e costo sono vincoli principali.",
            },
          },
        },
        characterGraphic: {
          details: {
            technicalSpecs: {
              0: "Formati carattere 8x2, 16x2, 20x4 e mappe caratteri personalizzate.",
              1: "Formati grafici 128x64, 192x64, 240x128 e risoluzioni matrice custom.",
              2: "Assemblaggi COB, COG e moduli custom con controller integrati.",
              3: "Interfacce SPI, I2C, 6800, 8080 e parallele in base al controller.",
            },
            features: {
              0: "UI monocromatica chiara senza costo e consumo di un TFT full-color.",
              1: "Supporta menu, allarmi, grafici semplici, icone e testi multilingua.",
              2: "Affidabile per prodotti industriali con necessità di fornitura stabile.",
              3: "Colore backlight, polarizzatore, angolo di visione e connettore personalizzabili.",
            },
            applications: {
              0: "Pannelli automazione, strumenti test, stampanti, UPS e monitor medicali base.",
              1: "Prodotti con testo dinamico o grafica semplice senza interfaccia full-color.",
              2: "Dispositivi di controllo dove conta più la leggibilità robusta della complessità visiva.",
            },
          },
        },
        tftColor: {
          details: {
            technicalSpecs: {
              0: "Taglie TFT da moduli compatti 2,4 pollici a display HMI più grandi.",
              1: "Opzioni TN e IPS con interfacce RGB, SPI, MCU, LVDS o MIPI.",
              2: "Touch capacitivo o resistivo opzionale con cover lens custom.",
              3: "Backlight ad alta luminosità, componenti wide-temp e bonding ottico.",
            },
            features: {
              0: "Interfaccia full-color per dashboard visuali, workflow guidati e UX moderna.",
              1: "Supporta sistemi visual brand, icone avanzate, stati e interazione touch.",
              2: "Integrabile con PCBA custom per semplificare cablaggio e assemblaggio.",
              3: "Luminosità, stack touch, cover glass e routing FPC progettati sul contenitore.",
            },
            applications: {
              0: "Hub smart home, charger EV, ventilatori medicali, terminali portatili ed elettrodomestici premium.",
              1: "Prodotti che richiedono colore, touch, grafica ricca e interfaccia moderna.",
              2: "Sistemi dove differenziazione visiva ed esperienza utente sono requisiti centrali.",
            },
          },
        },
        pcbaIntegration: {
          details: {
            technicalSpecs: {
              0: "Schede driver custom con MCU, power management, connettori e controller touch.",
              1: "Conversione interfacce SPI, I2C, RGB, MIPI, UART, USB e bus specifici.",
              2: "Routing EMI-aware, schermatura, cablaggio semplificato e geometria per housing.",
              3: "Firmware per inizializzazione, backlight, tuning touch e diagnostica display.",
            },
            features: {
              0: "Trasforma un display raw in un sottosistema hardware plug-and-play.",
              1: "Riduce sourcing, validazione, cablaggio e integrazione meccanica del cliente.",
              2: "Migliora la readiness di certificazione con layout, grounding e integrità segnale controllati.",
              3: "Ideale per chi vuole un unico partner responsabile dell'intero stack display.",
            },
            applications: {
              0: "Dispositivi medicali, controller industriali, smart appliance, accessori veicolo e terminali IoT.",
              1: "Progetti con cablaggio complesso, certificazioni severe o risorse elettroniche limitate.",
              2: "Programmi con campioni rapidi, basso NRE e percorso diretto alla produzione.",
            },
          },
        },
      },
    },
  },
  ja: {
    productGuide: {
      detailLabels: {
        technicalSpecs: "技術仕様",
        features: "主な特長",
        applications: "適した用途",
      },
      items: {
        segment: {
          details: {
            technicalSpecs: {
              0: "TN、HTN、STN、FSTN、VA のモノクロガラスに対応。",
              1: "ポジ表示・ネガ表示、static、1/2、1/3、1/4 duty 駆動に対応。",
              2: "アイコン、凡例、電池表示、7セグ数字、表示窓をカスタム可能。",
              3: "電池駆動組込み機器向けの低電圧駆動に対応。",
            },
            features: {
              0: "固定情報表示における最小クラスのユニットコスト。",
              1: "日光下や簡易バックライト環境でも高い視認性。",
              2: "安定した金型と再現性の高い光学品質で長期供給に適合。",
              3: "ピン配置、ゼブラ接続、FPC 引き出し、エッジシールを調整可能。",
            },
            applications: {
              0: "メーター、サーモスタット、電子はかり、電卓、タイマー、携帯計測器。",
              1: "固定数字、記号、ステータスアイコン、単純な動作モードを表示する製品。",
              2: "消費電力とコスト管理が最重要となる大量生産機器。",
            },
          },
        },
        characterGraphic: {
          details: {
            technicalSpecs: {
              0: "8x2、16x2、20x4 などの文字形式とカスタム文字マップに対応。",
              1: "128x64、192x64、240x128 などのグラフィック形式とカスタム解像度。",
              2: "COB、COG、コントローラ内蔵のカスタムモジュール構成。",
              3: "コントローラに応じて SPI、I2C、6800、8080、パラレルを選択可能。",
            },
            features: {
              0: "フルカラー TFT より低コスト・低消費電力で明瞭なモノクロ UI。",
              1: "メニュー、警報、簡易チャート、アイコン、多言語テキストに対応。",
              2: "長期供給が求められる産業機器に適した信頼性。",
              3: "バックライト色、偏光板、視野角、コネクタ位置を調整可能。",
            },
            applications: {
              0: "工場自動化パネル、試験機器、プリンタ、UPS、基本医療モニター。",
              1: "動的テキストや単純なグラフィックが必要で、リッチカラー UI は不要な製品。",
              2: "視覚的複雑さよりも堅牢な読みやすさが重要な制御機器。",
            },
          },
        },
        tftColor: {
          details: {
            technicalSpecs: {
              0: "小型 2.4 インチから大型 HMI クラスまでの TFT サイズに対応。",
              1: "TN / IPS パネル、RGB、SPI、MCU、LVDS、MIPI インターフェース。",
              2: "静電容量式または抵抗膜式タッチとカバーガラスのカスタム統合。",
              3: "高輝度バックライト、広温度部品、光学ボンディングに対応。",
            },
            features: {
              0: "画像中心のダッシュボード、ガイド式操作、現代的 UX 向けのフルカラー UI。",
              1: "ブランド表示、高度なアイコン、ステータス画面、タッチ操作をサポート。",
              2: "カスタム PCBA と統合し、配線とシステム組立を簡素化可能。",
              3: "輝度、タッチ構成、カバーガラス、FPC 経路を筐体に合わせて設計。",
            },
            applications: {
              0: "スマートホームハブ、EV 充電器、医療用人工呼吸器、携帯端末、高級家電。",
              1: "カラー、タッチ、豊かなグラフィックを備えた現代的 UI が必要な製品。",
              2: "視覚差別化とユーザー体験が主要要件となるシステム。",
            },
          },
        },
        pcbaIntegration: {
          details: {
            technicalSpecs: {
              0: "MCU、電源管理、コネクタ、タッチコントローラを備えた表示ドライバ基板。",
              1: "SPI、I2C、RGB、MIPI、UART、USB、専用バスのインターフェース変換。",
              2: "EMI を考慮した配線、シールド、ケーブル簡素化、筐体適合基板形状。",
              3: "初期化、バックライト制御、タッチ調整、表示診断用ファームウェア。",
            },
            features: {
              0: "裸のディスプレイを完全なプラグアンドプレイ型ハードウェアに変換。",
              1: "調達、検証、配線、機構統合の負荷を顧客側で削減。",
              2: "制御されたレイアウト、接地、信号品質により認証準備を改善。",
              3: "表示スタック全体を一社に任せたい顧客に最適。",
            },
            applications: {
              0: "医療機器、産業制御、スマート家電、車載アクセサリ、IoT 端末。",
              1: "複雑な配線、厳しい認証、限られた電子設計リソースを持つ案件。",
              2: "迅速なサンプル、低 NRE、量産への直接移行が必要なプログラム。",
            },
          },
        },
      },
    },
  },
  ko: {
    productGuide: {
      detailLabels: {
        technicalSpecs: "기술 사양",
        features: "핵심 기능",
        applications: "적합한 적용 분야",
      },
      items: {
        segment: {
          details: {
            technicalSpecs: {
              0: "TN, HTN, STN, FSTN, VA 단색 글라스 옵션 지원.",
              1: "포지티브/네거티브 표시와 static, 1/2, 1/3, 1/4 duty 구동 지원.",
              2: "아이콘, 문구, 배터리 표시, 7세그먼트 숫자, 표시창 맞춤 설계.",
              3: "배터리 구동 임베디드 기기에 적합한 저전압 구동 옵션.",
            },
            features: {
              0: "고정 정보 표시에서 가장 낮은 단가 구조.",
              1: "태양광 또는 단순 백라이트 환경에서도 우수한 가독성.",
              2: "안정적인 금형과 반복 가능한 광학 품질로 장기 공급 가능.",
              3: "핀 배열, 제브라 커넥터, FPC 테일, 엣지 실링 맞춤 가능.",
            },
            applications: {
              0: "계량기, 온도조절기, 전자저울, 계산기, 타이머, 휴대용 계측기.",
              1: "고정 숫자, 기호, 상태 아이콘 또는 단순 작동 모드를 표시하는 제품.",
              2: "전력 소비와 원가 관리가 핵심인 대량 생산 기기.",
            },
          },
        },
        characterGraphic: {
          details: {
            technicalSpecs: {
              0: "8x2, 16x2, 20x4 등 표준 문자 형식과 맞춤 문자 맵 지원.",
              1: "128x64, 192x64, 240x128 및 맞춤 매트릭스 해상도 지원.",
              2: "컨트롤러 통합 COB, COG 및 맞춤 모듈 어셈블리.",
              3: "컨트롤러에 따라 SPI, I2C, 6800, 8080, 병렬 인터페이스 선택.",
            },
            features: {
              0: "풀컬러 TFT의 비용과 전력 없이 선명한 단색 UI 제공.",
              1: "메뉴, 알람, 단순 차트, 아이콘, 다국어 텍스트 레이아웃 지원.",
              2: "장기 공급 안정성이 필요한 산업용 제품에 적합.",
              3: "백라이트 색상, 편광판, 시야각, 커넥터 위치 조정 가능.",
            },
            applications: {
              0: "공장 자동화 패널, 시험 장비, 프린터, UPS, 기본 의료 모니터.",
              1: "동적 텍스트 또는 단순 그래픽이 필요하지만 리치 컬러 UI는 불필요한 제품.",
              2: "시각적 복잡성보다 견고한 가독성이 중요한 제어 장치.",
            },
          },
        },
        tftColor: {
          details: {
            technicalSpecs: {
              0: "소형 2.4인치 모듈부터 대형 HMI급 디스플레이까지 지원.",
              1: "TN 및 IPS 패널, RGB, SPI, MCU, LVDS, MIPI 인터페이스 지원.",
              2: "정전식 또는 저항식 터치와 커버 렌즈 맞춤 통합 가능.",
              3: "고휘도 백라이트, 광온도 부품, 옵티컬 본딩 옵션.",
            },
            features: {
              0: "이미지 중심 대시보드, 안내형 워크플로, 현대적 UX를 위한 풀컬러 UI.",
              1: "브랜드 비주얼, 고급 아이콘, 상태 화면, 터치 인터랙션 지원.",
              2: "맞춤형 PCBA와 통합하여 배선과 시스템 조립을 단순화.",
              3: "밝기, 터치 구조, 커버 글라스, FPC 라우팅을 하우징에 맞게 설계.",
            },
            applications: {
              0: "스마트홈 허브, EV 충전기, 의료용 인공호흡기, 휴대 단말, 프리미엄 가전.",
              1: "컬러, 터치, 풍부한 그래픽이 필요한 현대적 인터페이스 제품.",
              2: "시각적 차별화와 사용자 경험이 핵심 요구사항인 시스템.",
            },
          },
        },
        pcbaIntegration: {
          details: {
            technicalSpecs: {
              0: "MCU, 전원 관리, 커넥터, 터치 컨트롤러가 포함된 맞춤형 표시 구동 보드.",
              1: "SPI, I2C, RGB, MIPI, UART, USB 및 전용 버스 인터페이스 변환.",
              2: "EMI 고려 라우팅, 차폐 전략, 케이블 단순화, 하우징 맞춤 보드 형상.",
              3: "초기화, 백라이트 제어, 터치 튜닝, 표시 진단용 펌웨어 지원.",
            },
            features: {
              0: "원시 디스플레이를 완전한 플러그앤플레이 하드웨어 서브시스템으로 전환.",
              1: "고객 측 소싱, 검증, 배선, 기구 통합 부담을 줄입니다.",
              2: "제어된 레이아웃, 접지, 신호 무결성으로 인증 준비성을 향상.",
              3: "전체 디스플레이 스택을 책임질 단일 엔지니어링 파트너가 필요한 고객에게 적합.",
            },
            applications: {
              0: "의료기기, 산업 컨트롤러, 스마트 가전, 차량 액세서리, IoT 터미널.",
              1: "복잡한 배선, 엄격한 인증, 제한된 전자 설계 리소스를 가진 프로젝트.",
              2: "빠른 샘플, 낮은 NRE, 프로토타입에서 양산으로의 직접 전환이 필요한 프로그램.",
            },
          },
        },
      },
    },
  },
} as const satisfies Partial<Record<Language, TranslationNode>>;
