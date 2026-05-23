"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "ru";

// ─── Full translation dictionary ─────────────────────────────────────────────
export const translations = {
  en: {
    // Navigation
    nav: {
      whoWeAre: "Who We Are",
      services: "Services",
      expertise: "Expertise",
      results: "Results",
      reviews: "Reviews",
      contact: "Contact",
      signIn: "Sign In",
      getStarted: "Get Started",
      dashboard: "Dashboard",
      home: "Home",
      close: "Close",
    },

    // Fullscreen menu
    menu: {
      services: {
        title: "Our Services",
        strategy: "Application Strategy",
        essays: "Essay Coaching",
        interview: "Interview Preparation",
        scholarship: "Scholarship Search",
      },
      regions: {
        title: "Regions We Cover",
        usCanada: "USA & Canada",
        uk: "United Kingdom",
        europe: "Europe",
        asia: "Asia & Australia",
      },
      getStarted: {
        title: "Get Started",
        book: "Book Free Consultation",
        studentDashboard: "Student Dashboard",
      },
    },

    // Hero section
    hero: {
      lines: ["WE HELP", "STUDENTS REACH", "TOP UNIVERSITIES"],
      tagline: "University Admissions Consulting",
      subheadline: "Expert admissions consulting for undergraduate programs at elite institutions worldwide.",
      bookConsultation: "Book Free Consultation",
      viewStories: "View Success Stories",
    },

    // Who We Are
    about: {
      sectionLabel: "We are a team of professionals",
      heading: "WHO WE ARE",
      intro: "A dedicated team helping students achieve their dreams of studying at top universities worldwide from the US, Canada, the UK, Asia, Australia and Europe.",
      usa: "Harvard, Yale, Columbia, UPenn, Cornell, Brown, NYU (New York, Abu Dhabi, Shanghai), Georgetown, U Chicago, Amherst, Pomona, Northwestern, Northeastern, Boston U, Boulder, UC Berkeley, UC Irvine, UCLA, UCSD, Stanford, Caltech…",
      canada: "U of T (Lester B Pearson); UBC (International Scholarship), McGill…",
      uk: "Oxford, Cambridge, Imperial, UCL, King's, Warwick, Bath, Manchester, St Andrews…",
      europe: "TU Delft, Amsterdam, Sciences Po, École Polytechnique, KU Leuven, Polimi, Bocconi, IE, ESADE, Sapienza",
      approachLabel: "OUR APPROACH",
      approachText: "Personalized guidance based on your unique profile, strengths, and aspirations, with packages from middle school to last minute emergency applications.",
      teamText: "An experienced team of counselors, teachers, alumni, and former admissions officers from all over the world helping students achieve their dreams of studying at Top Universities worldwide.",
      videoCaption: "Meet the team — 2 min",
      videoLabel: "Intro Video",
    },

    // Services
    services: {
      heading: "SERVICES &\nAPPROACH",
      pillars: {
        academic: {
          title: "Make the Best Academic Profile",
          desc: "We will help you improve your grades, your SAT scores, and your IELTS.",
        },
        activity: {
          title: "Make the Best Activity Profile",
          desc: "We will help you find the extracurricular activities that make your Spike work.",
        },
      },
      items: [
        {
          number: "01",
          title: "University Shortlist & Strategy",
          description:
            "We analyze your profile, goals, and preferences to create a tailored list of universities where you have the best chances of admission and fit. Reach, Target and Safety, anywhere in the world.",
        },
        {
          number: "02",
          title: "Essays & Personal Statement",
          description:
            "Our experts help you craft compelling narratives that showcase your unique story, achievements, and potential to admission committees.",
        },
        {
          number: "03",
          title: "Scholarships & Financial Aid",
          description:
            "We identify scholarship opportunities and guide you through applications to maximize your chances of receiving financial support. Assistance in filling out the forms for scholarships and Financial Aid.",
        },
        {
          number: "04",
          title: "Interview Prep & Documents",
          description:
            "Comprehensive preparation for admission interviews, plus review and polishing of all supporting documents and recommendations.",
        },
      ],
    },

    // Alumni
    alumni: {
      sectionLabel: "Our alumni",
      heading: "WHERE SOME OF OUR\nSTUDENTS ARE NOW",
    },

    // Success Stories
    results: {
      heading: "SUCCESS STORIES",
      showMore: "Show more cases",
      cards: {
        photo: {
          harvard: { title: "Harvard Acceptance", subtitle: "Full scholarship recipient" },
          stanford: { title: "Stanford Admit", subtitle: "Computer Science program" },
          mit: { title: "MIT Early Action", subtitle: "Engineering major" },
        },
        video: {
          ivy: { title: "Ivy League Sweep — Student Story", subtitle: "8 acceptances · Class of 2024" },
          oxford: { title: "From Dubai to Oxford", subtitle: "PPE · Class of 2023" },
        },
        quotes: [
          {
            id: "quote-sarah",
            quote: "Stockermans transformed my application journey. Their strategic guidance helped me secure admission to my dream school with a full scholarship.",
            author: "Sarah Chen",
            school: "Harvard University '24",
          },
          {
            id: "quote-alex",
            quote: "I was rejected from every school I applied to on my own. With Stockermans, I got into Stanford, MIT, and Cornell — and chose where I actually wanted to go.",
            author: "Alex Petrov",
            school: "Stanford University '25",
          },
          {
            id: "quote-mia",
            quote: "The essay coaching alone was worth every penny. My personal statement went from generic to genuinely compelling. Oxford said so themselves.",
            author: "Mia Lawson",
            school: "University of Oxford '24",
          },
        ],
      },
    },

    // Reviews
    reviews: {
      heading: "REVIEWS",
      quote: "Stockermans transformed my application journey. Their strategic guidance helped me secure admission to my dream school with a full scholarship. The personalized attention made all the difference.",
      author: "Sarah Chen",
      school: "Harvard University '24",
    },

    // Contacts
    contact: {
      heading: "CONTACTS",
      namePlaceholder: "Your name",
      nameLabel: "Name",
      emailLabel: "Email",
      emailPlaceholder: "your@email.com",
      phoneLabel: "Phone",
      phonePlaceholder: "+1 (___) ___-____",
      messageLabel: "Message",
      messagePlaceholder: "Tell us about your goals...",
      sendButton: "Send message",
      rightHeading: "LET'S MAKE SOMETHING\nTHAT MATTERS",
      rightSubtext: "Every student deserves expert guidance on their journey to higher education. Let's discuss how we can help you achieve your dreams.",
      emailContact: "Email",
      whatsapp: "WhatsApp",
      instagram: "Instagram",
    },

    // Footer
    footer: {
      tagline: "Guiding students toward their academic dreams.",
      nav: {
        title: "Navigation",
        home: "Home",
        whoWeAre: "Who We Are",
        reviews: "Reviews",
        contact: "Contact",
      },
      results: {
        title: "Results",
        successStories: "Success Stories",
        news: "News",
        getStarted: "Get Started",
      },
      servicesCol: {
        title: "Services",
        strategy: "Strategy",
        essays: "Essays",
        scholarships: "Scholarships",
        interviews: "Interviews",
      },
      regions: {
        title: "Regions",
        usCanada: "USA & Canada",
        ukEurope: "UK & Europe",
        asiaPacific: "Asia & Pacific",
      },
      copyright: "All rights reserved.",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
    },
  },

  ru: {
    // Navigation
    nav: {
      whoWeAre: "О нас",
      services: "Услуги",
      expertise: "Экспертиза",
      results: "Результаты",
      reviews: "Отзывы",
      contact: "Контакты",
      signIn: "Войти",
      getStarted: "Начать",
      dashboard: "Кабинет",
      home: "Главная",
      close: "Закрыть",
    },

    // Fullscreen menu
    menu: {
      services: {
        title: "Наши услуги",
        strategy: "Стратегия поступления",
        essays: "Помощь с эссе",
        interview: "Подготовка к интервью",
        scholarship: "Поиск стипендий",
      },
      regions: {
        title: "Регионы",
        usCanada: "США и Канада",
        uk: "Великобритания",
        europe: "Европа",
        asia: "Азия и Австралия",
      },
      getStarted: {
        title: "Начать",
        book: "Бесплатная консультация",
        studentDashboard: "Личный кабинет",
      },
    },

    // Hero section
    hero: {
      lines: ["МЫ ПОМОГАЕМ", "СТУДЕНТАМ ПОСТУПИТЬ", "В ЛУЧШИЕ УНИВЕРСИТЕТЫ"],
      tagline: "Консалтинг по поступлению в университеты",
      subheadline: "Экспертная поддержка при поступлении на бакалавриат в ведущие университеты мира.",
      bookConsultation: "Бесплатная консультация",
      viewStories: "Истории успеха",
    },

    // Who We Are
    about: {
      sectionLabel: "Мы — команда профессионалов",
      heading: "О НАС",
      intro: "Команда преданных своему делу специалистов, помогающих студентам осуществить мечту об учёбе в лучших университетах мира — США, Канаде, Великобритании, Азии, Австралии и Европе.",
      usa: "Harvard, Yale, Columbia, UPenn, Cornell, Brown, NYU (Нью-Йорк, Абу-Даби, Шанхай), Georgetown, U Chicago, Amherst, Pomona, Northwestern, Northeastern, Boston U, Boulder, UC Berkeley, UC Irvine, UCLA, UCSD, Stanford, Caltech…",
      canada: "U of T (стипендия Лестера Пирсона); UBC (International Scholarship), McGill…",
      uk: "Oxford, Cambridge, Imperial, UCL, King's, Warwick, Bath, Manchester, St Andrews…",
      europe: "TU Delft, Amsterdam, Sciences Po, École Polytechnique, KU Leuven, Polimi, Bocconi, IE, ESADE, Sapienza",
      approachLabel: "НАШ ПОДХОД",
      approachText: "Персонализированное сопровождение с учётом вашего профиля, сильных сторон и целей — пакеты от средней школы до срочных заявок в последний момент.",
      teamText: "Опытная команда консультантов, преподавателей, выпускников и бывших сотрудников приёмных комиссий со всего мира помогает студентам поступить в лучшие университеты.",
      videoCaption: "Познакомьтесь с командой — 2 мин",
      videoLabel: "Знакомство",
    },

    // Services
    services: {
      heading: "УСЛУГИ И\nПОДХОД",
      pillars: {
        academic: {
          title: "Лучший академический профиль",
          desc: "Мы поможем улучшить ваши оценки, результаты SAT и IELTS.",
        },
        activity: {
          title: "Лучший внеучебный профиль",
          desc: "Мы поможем найти внеклассные активности, которые сформируют ваш уникальный Spike.",
        },
      },
      items: [
        {
          number: "01",
          title: "Шортлист университетов и стратегия",
          description:
            "Анализируем ваш профиль, цели и предпочтения, чтобы составить список университетов с наилучшими шансами на поступление. Dream, Target и Safety — по всему миру.",
        },
        {
          number: "02",
          title: "Эссе и личное заявление",
          description:
            "Наши эксперты помогут создать убедительный нарратив, отражающий вашу уникальную историю, достижения и потенциал для приёмных комиссий.",
        },
        {
          number: "03",
          title: "Стипендии и финансовая помощь",
          description:
            "Выявляем стипендиальные возможности и сопровождаем в подаче заявок, чтобы максимизировать шансы на получение финансовой поддержки. Помощь с заявками на Financial Aid.",
        },
        {
          number: "04",
          title: "Подготовка к интервью и документы",
          description:
            "Комплексная подготовка к вступительным интервью, а также проверка и доработка всех сопроводительных документов и рекомендаций.",
        },
      ],
    },

    // Alumni
    alumni: {
      sectionLabel: "Наши выпускники",
      heading: "ГДЕ СЕЙЧАС\nНАШИ СТУДЕНТЫ",
    },

    // Success Stories
    results: {
      heading: "ИСТОРИИ УСПЕХА",
      showMore: "Показать больше",
      cards: {
        photo: {
          harvard: { title: "Поступление в Harvard", subtitle: "Получатель полной стипендии" },
          stanford: { title: "Принят в Stanford", subtitle: "Программа Computer Science" },
          mit: { title: "MIT Early Action", subtitle: "Специальность Engineering" },
        },
        video: {
          ivy: { title: "Поступление в Ivy League — История студента", subtitle: "8 принятий · Выпуск 2024" },
          oxford: { title: "Из Дубая в Oxford", subtitle: "PPE · Выпуск 2023" },
        },
        quotes: [
          {
            id: "quote-sarah",
            quote: "Stockermans изменила мой путь к поступлению. Их стратегическое руководство помогло мне поступить в университет мечты с полной стипендией.",
            author: "Sarah Chen",
            school: "Harvard University '24",
          },
          {
            id: "quote-alex",
            quote: "Самостоятельно меня отклонили везде. С Stockermans я поступил в Stanford, MIT и Cornell — и выбрал тот университет, который действительно хотел.",
            author: "Alex Petrov",
            school: "Stanford University '25",
          },
          {
            id: "quote-mia",
            quote: "Помощь с эссе одна окупила всё. Моё личное заявление стало по-настоящему убедительным. Об этом сказали даже в Oxford.",
            author: "Mia Lawson",
            school: "University of Oxford '24",
          },
        ],
      },
    },

    // Reviews
    reviews: {
      heading: "ОТЗЫВЫ",
      quote: "Stockermans изменила мой путь к поступлению. Их стратегическое руководство помогло мне поступить в университет мечты с полной стипендией. Индивидуальный подход решил всё.",
      author: "Sarah Chen",
      school: "Harvard University '24",
    },

    // Contacts
    contact: {
      heading: "КОНТАКТЫ",
      namePlaceholder: "Ваше имя",
      nameLabel: "Имя",
      emailLabel: "Email",
      emailPlaceholder: "ваш@email.com",
      phoneLabel: "Телефон",
      phonePlaceholder: "+7 (___) ___-____",
      messageLabel: "Сообщение",
      messagePlaceholder: "Расскажите о ваших целях...",
      sendButton: "Отправить",
      rightHeading: "ДАВАЙТЕ СДЕЛАЕМ\nЧТО-ТО ВАЖНОЕ",
      rightSubtext: "Каждый студент заслуживает экспертной поддержки на пути к высшему образованию. Давайте обсудим, как мы можем помочь вам достичь мечты.",
      emailContact: "Email",
      whatsapp: "WhatsApp",
      instagram: "Instagram",
    },

    // Footer
    footer: {
      tagline: "Помогаем студентам воплотить академические мечты.",
      nav: {
        title: "Навигация",
        home: "Главная",
        whoWeAre: "О нас",
        reviews: "Отзывы",
        contact: "Контакты",
      },
      results: {
        title: "Результаты",
        successStories: "Истории успеха",
        news: "Новости",
        getStarted: "Начать",
      },
      servicesCol: {
        title: "Услуги",
        strategy: "Стратегия",
        essays: "Эссе",
        scholarships: "Стипендии",
        interviews: "Интервью",
      },
      regions: {
        title: "Регионы",
        usCanada: "США и Канада",
        ukEurope: "Великобритания и Европа",
        asiaPacific: "Азия и Тихоокеанский регион",
      },
      copyright: "Все права защищены.",
      privacy: "Политика конфиденциальности",
      terms: "Условия использования",
    },
  },
} as const;

export type Translations = (typeof translations)["en"];

// ─── Context ─────────────────────────────────────────────────────────────────
interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

// ─── Provider ────────────────────────────────────────────────────────────────
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  // Persist language in localStorage
  useEffect(() => {
    const stored = localStorage.getItem("lang") as Language | null;
    if (stored === "en" || stored === "ru") {
      setLanguageState(stored);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("lang", lang);
  };

  const t = translations[language] as Translations;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────
export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
