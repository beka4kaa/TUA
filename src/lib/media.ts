/**
 * Централизованная мапа всех медиа-ассетов сайта.
 * Это единственный источник истины для изображений - никаких хардкод путей в компонентах.
 * 
 * ВАЖНО: В проекте доступны только SVG файлы, реальных фотографий нет.
 * Все изображения назначены осознанно, с минимизацией повторов.
 */

// === ДЕКОРАТИВНЫЕ ЭЛЕМЕНТЫ ===

export const decorativeAssets = {
  // Большие декоративные овалы для фоновых элементов
  ellipsesLarge: "/main_page/Elements big.svg",
  ellipsesSmall: "/main_page/Elements big-1.svg",
  
  // Интерактивные кнопки-круги
  contactButton: "/main_page/Contact us button.svg",
  scrollIndicator: "/main_page/Scroll to explore.svg",
  
  // Социальные иконки (вертикальная группа)
  socialIcons: "/main_page/Social icons.svg",
} as const;

// === ИКОНКИ ИЗ PUBLIC ROOT ===

export const icons = {
  globe: "/globe.svg",      // Для international/global контекста
  file: "/file.svg",        // Для документов/эссе
  window: "/window.svg",    // Для онлайн/платформа
} as const;

// === HERO SECTION ===

export const heroMedia = {
  // Floating pill рядом со "STUDENTS" - используем иконку Play (инлайн в компоненте)
  storyPill: null,
  
  // Круг рядом с "GET INTO" - декоративный скролл индикатор (релевантно для hero)
  decorativeCircle: decorativeAssets.scrollIndicator,
  
  // Левый sidebar - социальные иконки
  socialIcons: decorativeAssets.socialIcons,
  
  // Scroll indicator справа внизу - тот же элемент используется в UI
  scrollIndicator: decorativeAssets.scrollIndicator,
} as const;

// === WHO WE ARE SECTION ===

export const whoWeAreMedia = {
  // Видео постер / главное изображение секции
  // Используем CTA кнопку как символ "начала работы с нами" (интерактивность)
  // НЕ используем ellipsesLarge - он будет в Success Stories
  videoPoster: decorativeAssets.contactButton,
  videoPosterAlt: "Start your journey with Ymit Academy",
} as const;

// === SUCCESS STORIES ===
// ВАЖНО: Каждая карточка должна иметь УНИКАЛЬНЫЙ визуал!
// Стратегия распределения ассетов для минимизации повторов:
// - 2 карточки с ellipsesLarge (разные bgStyle)
// - 1 карточка с ellipsesSmall
// - 3 карточки с разными иконками (window, globe, file)

export type SuccessStory = {
  id: string;
  title: string;
  subtitle: string;
  year: string;
  // Визуальное оформление карточки
  visual: {
    type: "pattern" | "icon" | "gradient";
    // Для pattern - какой SVG использовать как фон
    patternSrc?: string;
    // Для icon - какую иконку показать
    iconSrc?: string;
    // Акцентный цвет: "blue" | "orange" | "neutral"
    accent: "blue" | "orange" | "neutral";
    // Стиль фона
    bgStyle: "light" | "outline" | "gradient";
  };
};

export const successStories: SuccessStory[] = [
  {
    id: "harvard-2024",
    title: "Harvard Acceptance",
    subtitle: "Full scholarship recipient",
    year: "2024",
    visual: {
      type: "pattern",
      patternSrc: decorativeAssets.ellipsesLarge, // Первое использование ellipsesLarge
      accent: "blue",
      bgStyle: "light",
    },
  },
  {
    id: "stanford-2024",
    title: "Stanford Admit",
    subtitle: "Computer Science program",
    year: "2024",
    visual: {
      type: "icon",
      iconSrc: icons.window, // Tech/CS контекст - окно как символ софта
      accent: "orange",
      bgStyle: "outline",
    },
  },
  {
    id: "mit-2024",
    title: "MIT Early Action",
    subtitle: "Engineering major",
    year: "2024",
    visual: {
      type: "pattern",
      patternSrc: decorativeAssets.ellipsesSmall, // Единственное использование ellipsesSmall в Success Stories
      accent: "blue",
      bgStyle: "gradient",
    },
  },
  {
    id: "oxford-2023",
    title: "Oxford Scholar",
    subtitle: "Rhodes Scholarship",
    year: "2023",
    visual: {
      type: "icon",
      iconSrc: icons.globe, // International/UK - глобус
      accent: "orange",
      bgStyle: "light",
    },
  },
  {
    id: "ivy-sweep-2023",
    title: "Ivy League Sweep",
    subtitle: "8 acceptances",
    year: "2023",
    visual: {
      type: "pattern",
      patternSrc: decorativeAssets.ellipsesLarge, // Второе использование ellipsesLarge (но разный bgStyle: gradient вместо light)
      accent: "blue",
      bgStyle: "gradient",
    },
  },
  {
    id: "wharton-2023",
    title: "McKinsey Scholar",
    subtitle: "MBA at Wharton",
    year: "2023",
    visual: {
      type: "icon",
      iconSrc: icons.file, // Business/Documents/Essays - файл
      accent: "neutral",
      bgStyle: "outline",
    },
  },
];

// === REVIEWS SECTION ===

export const reviewsMedia = {
  // Постер для видео-отзыва
  // Используем социальные иконки как символ коммуникации/отзывов (уникально для этой секции)
  videoPoster: decorativeAssets.socialIcons,
  videoPosterAlt: "Student testimonial and success story",
} as const;

// === GALLERY "WE ARE YMIT ACADEMY" ===
// 4 разных визуала для галереи - НЕ повторяющиеся!
// Стратегия: используем ВСЕ доступные иконки + ellipsesSmall (который не используется в других секциях так активно)

export type GalleryItem = {
  id: string;
  alt: string;
  visual: {
    type: "pattern" | "icon";
    patternSrc?: string;
    iconSrc?: string;
    accent: "blue" | "orange" | "neutral";
  };
};

export const galleryItems: GalleryItem[] = [
  {
    id: "gallery-1",
    alt: "Team collaboration session",
    visual: {
      type: "pattern",
      patternSrc: decorativeAssets.ellipsesSmall, // Второе использование ellipsesSmall (первое - MIT в Success Stories)
      accent: "blue",
    },
  },
  {
    id: "gallery-2",
    alt: "Student consultation meeting",
    visual: {
      type: "icon",
      iconSrc: icons.globe, // Глобальный охват - второе использование globe (первое - Oxford)
      accent: "orange",
    },
  },
  {
    id: "gallery-3",
    alt: "Office workspace and documents",
    visual: {
      type: "icon",
      iconSrc: icons.file, // Работа с документами - второе использование file (первое - Wharton)
      accent: "neutral",
    },
  },
  {
    id: "gallery-4",
    alt: "Digital learning platform",
    visual: {
      type: "icon",
      iconSrc: icons.window, // Онлайн платформа - второе использование window (первое - Stanford)
      accent: "blue",
    },
  },
];

// === CONTACT SECTION ===

export const contactMedia = {
  // Декоративный элемент для секции контактов
  decorative: decorativeAssets.contactButton,
} as const;

// === FOOTER ===

export const footerMedia = {
  socialIcons: decorativeAssets.socialIcons,
} as const;
