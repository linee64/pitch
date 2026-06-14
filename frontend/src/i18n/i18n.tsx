import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Lang = "en" | "ru";

type Dict = Record<string, { en: string; ru: string }>;

const dict: Dict = {
  // sidebar
  "nav.scenarios": { en: "Scenarios", ru: "Сценарии" },
  "nav.personas": { en: "Personas", ru: "Персоны" },
  "nav.history": { en: "History", ru: "История" },
  "nav.settings": { en: "Settings", ru: "Настройки" },
  "side.tagline": { en: "Pressure Sim", ru: "Симулятор давления" },
  "side.proHint": { en: "Unlimited sessions & custom personas", ru: "Безлимит сессий и свои персоны" },
  "side.upgrade": { en: "Upgrade", ru: "Улучшить" },
  "side.role": { en: "Founder", ru: "Основатель" },

  // header
  "hdr.engine": { en: "Neural Engine v3.1 Online", ru: "Нейроядро v3.1 в работе" },
  "hdr.search": { en: "Search scenarios, personas…", ru: "Поиск сценариев, персон…" },

  // index
  "idx.title": { en: "Choose your battlefield.", ru: "Выбери своё поле боя." },
  "idx.subtitle": {
    en: "Every audience has its own logic, style, and pressure. Pick a scenario, then face the room.",
    ru: "У каждой аудитории своя логика, стиль и давление. Выбери сценарий и выйди в зал.",
  },
  "idx.newSession": { en: "New Session", ru: "Новая сессия" },
  "idx.stat.completed": { en: "Sessions completed", ru: "Сессий пройдено" },
  "idx.stat.completedHint": { en: "+6 this week", ru: "+6 на этой неделе" },
  "idx.stat.composure": { en: "Confidence Score", ru: "Средний балл" },
  "idx.stat.composureHint": { en: "Top 5% this week", ru: "Топ-5% за неделю" },
  "idx.stat.time": { en: "Time under pressure", ru: "Времени под давлением" },
  "idx.stat.timeHint": { en: "Across 8 scenarios", ru: "По 8 сценариям" },
  "idx.featured.badge": { en: "Most intense", ru: "Максимум давления" },
  "idx.featured.headline": { en: "10 minutes that decide everything.", ru: "10 минут, которые решают всё." },
  "idx.cta.init": { en: "Initialize Pitch →", ru: "Запустить питч →" },
  "idx.cta.sample": { en: "Watch sample", ru: "Смотреть пример" },
  "idx.intensity": { en: "Intensity", ru: "Интенсивность" },
  "idx.allScenarios": { en: "All scenarios", ru: "Все сценарии" },
  "idx.createPitch": { en: "Create Pitch", ru: "Создать питч" },
  "idx.available": { en: "available", ru: "доступно" },
  "idx.recent": { en: "Recent sessions", ru: "Последние сессии" },
  "idx.col.date": { en: "Date", ru: "Дата" },
  "idx.col.scenario": { en: "Scenario", ru: "Сценарий" },
  "idx.col.adversary": { en: "Advisor", ru: "Наставник" },
  "idx.col.duration": { en: "Duration", ru: "Длительность" },
  "idx.col.score": { en: "Score", ru: "Балл" },
  "idx.custom": { en: "Custom", ru: "Свой" },

  // personas page
  "per.title": { en: "Persona library.", ru: "Библиотека персон." },
  "per.subtitle": {
    en: "Pre-built archetypes calibrated to real audiences. Or upload a photo of anyone you'll actually face.",
    ru: "Готовые архетипы под реальные аудитории. Или загрузи фото того, с кем встретишься на самом деле.",
  },
  "per.custom": { en: "Custom Persona", ru: "Своя персона" },
  "per.uploadTitle": { en: "Upload someone real", ru: "Загрузи реального человека" },
  "per.uploadHint": {
    en: "Your professor, your boss, the YC partner you're meeting Tuesday.",
    ru: "Твой научник, твой руководитель, партнёр YC, которого встречаешь во вторник.",
  },

  // history
  "his.title": { en: "Session history.", ru: "История сессий." },
  "his.subtitle": { en: "Every pitch, every scorecard, every weakness — logged.", ru: "Каждый питч, каждый скоркард, каждая слабость — записаны." },
  "his.composure": { en: "Composure", ru: "Собранность" },
  "his.openReport": { en: "Open report", ru: "Открыть отчёт" },
  "his.vs": { en: "vs.", ru: "против" },

  // settings
  "set.title": { en: "Settings.", ru: "Настройки." },
  "set.subtitle": { en: "Calibrate Confly to how you actually want to be challenged.", ru: "Настрой Confly под то, как именно тебя должны прессовать." },
  "set.diff": { en: "Default difficulty", ru: "Сложность по умолчанию" },
  "set.diffHint": { en: "How aggressively the AI interrupts and pushes back.", ru: "Насколько агрессивно AI перебивает и давит." },
  "set.diff.mentor": { en: "Mentor", ru: "Ментор" },
  "set.diff.real": { en: "Realistic", ru: "Реалистично" },
  "set.diff.brutal": { en: "Brutal", ru: "Жёстко" },
  "set.lang": { en: "Voice & language", ru: "Голос и язык" },
  "set.langHint": { en: "Avatars will speak and listen in your selected language.", ru: "Аватары говорят и слушают на выбранном языке." },
  "set.rec": { en: "Recording", ru: "Запись" },
  "set.recHint": { en: "Save audio + video for post-session review. Stored encrypted.", ru: "Сохранять аудио и видео для разбора. Хранится зашифровано." },
  "set.enabled": { en: "Enabled", ru: "Включено" },
  "set.off": { en: "Off", ru: "Выкл" },
  "set.coach": { en: "Live coaching overlay", ru: "Подсказки в реальном времени" },
  "set.coachHint": { en: "Real-time hints during the session (pace, filler words, eye contact).", ru: "Подсказки во время сессии: темп, слова-паразиты, зрительный контакт." },

  // setup
  "setup.back": { en: "Back", ru: "Назад" },
  "setup.step1": { en: "Pick your advisor", ru: "Выбери наставника" },
  "setup.step2": { en: "Upload your presentation", ru: "Загрузи презентацию" },
  "setup.step3": { en: "Adjust assistance level", ru: "Настрой уровень помощи" },
  "setup.drop": { en: "Drop your slides here", ru: "Перетащи слайды сюда" },
  "setup.dropHint": { en: "PDF, PPTX, KEY · up to 50MB · or skip for now", ru: "PDF, PPTX, KEY · до 50MB · можно пропустить" },
  "setup.slidesLoaded": { en: "12 slides · The AI will analyze them", ru: "12 слайдов · AI проанализирует их" },
  "setup.mentor": { en: "Assistant", ru: "Помощник" },
  "setup.brutal": { en: "Expert", ru: "Эксперт" },
  "setup.support": { en: "Support level", ru: "Уровень поддержки" },
  "setup.detail": { en: "Feedback detail", ru: "Детальность разбора" },
  "setup.followups": { en: "Advice frequency", ru: "Частота советов" },
  "setup.frequent": { en: "Frequent", ru: "Часто" },
  "setup.moderate": { en: "Moderate", ru: "Умеренно" },
  "setup.rare": { en: "Rare", ru: "Редко" },
  "setup.friendly": { en: "Friendly", ru: "Дружелюбный" },
  "setup.encouraging": { en: "Encouraging", ru: "Подбадривающий" },
  "setup.critical": { en: "Critical", ru: "Критичный" },
  "setup.comprehensive": { en: "Comprehensive", ru: "Исчерпывающий" },
  "setup.concise": { en: "Concise", ru: "Краткий" },
  "setup.deep": { en: "Deep", ru: "Глубокий" },
  "setup.locked": { en: "Advisor locked", ru: "Наставник зафиксирован" },
  "setup.scenario": { en: "Scenario", ru: "Сценарий" },
  "setup.duration": { en: "Duration", ru: "Длительность" },
  "setup.slides": { en: "Slides", ru: "Слайды" },
  "setup.enter": { en: "Start session", ru: "Начать сессию" },
  "setup.addAdvisor": { en: "Add advisor", ru: "Добавить наставника" },
  "setup.conflyAdvisor": { en: "Confly's Advisor", ru: "Наставник Confly" },
  "setup.advisorName": { en: "Advisor Name", ru: "Имя наставника" },
  "setup.advisorRole": { en: "Specialty / Role", ru: "Специальность / Роль" },
  "setup.advisorPhoto": { en: "Upload Photo", ru: "Загрузить фото" },
  "setup.saveAdvisor": { en: "Save Advisor", ru: "Сохранить наставника" },
  "setup.cancel": { en: "Cancel", ru: "Отмена" },

  // session
  "ses.recording": { en: "Recording", ru: "Запись" },
  "ses.feedActive": { en: "Feed Active", ru: "Поток активен" },
  "ses.hostility": { en: "Hostility", ru: "Враждебность" },
  "ses.nowSpeaking": { en: "Now speaking", ru: "Сейчас говорит" },
  "ses.currentSlide": { en: "Current slide", ru: "Текущий слайд" },
  "ses.prev": { en: "← Prev", ru: "← Назад" },
  "ses.next": { en: "Next →", ru: "Вперёд →" },
  "ses.coaching": { en: "Live coaching", ru: "Подсказки в реальном времени" },
  "ses.pace": { en: "Pace", ru: "Темп" },
  "ses.paceHint": { en: "Slow down before the metric", ru: "Замедли перед цифрой" },
  "ses.fillers": { en: "Filler words", ru: "Слова-паразиты" },
  "ses.fillersHint": { en: "Within target", ru: "В пределах нормы" },
  "ses.eye": { en: "Eye contact", ru: "Зрительный контакт" },
  "ses.eyeHint": { en: "Strong", ru: "Уверенный" },
  "ses.tone": { en: "Confidence tone", ru: "Тон уверенности" },
  "ses.toneHint": { en: "Avoid uptalk", ru: "Избегай вопросительной интонации" },
  "ses.end": { en: "End & get scorecard", ru: "Завершить и получить разбор" },
  "ses.quote": {
    en: '"Your CAC-to-LTV ratio assumes zero churn in year one. In this market, that\'s naive. Defend that number — without slides — in 30 seconds."',
    ru: '«Твой CAC к LTV считается с нулевым оттоком в первый год. На таком рынке это наивно. Защити цифру — без слайдов — за 30 секунд.»',
  },

  // categories
  "cat.Startup": { en: "Startup", ru: "Стартап" },
  "cat.Academia": { en: "Academia", ru: "Академия" },
  "cat.Competition": { en: "Competition", ru: "Конкурс" },
  "cat.Work": { en: "Work", ru: "Работа" },
  "cat.Custom": { en: "Custom", ru: "Свой" },

  // scenario titles & descriptions (id-based)
  "sc.yc-interview.t": { en: "YC Interview", ru: "Интервью YC" },
  "sc.yc-interview.d": { en: "10-minute rapid-fire interview. One founder, two partners, no slides allowed.", ru: "10-минутное интервью без передышки. Один основатель, два партнёра, без слайдов." },
  "sc.demo-day.t": { en: "Demo Day Pitch", ru: "Питч на Demo Day" },
  "sc.demo-day.d": { en: "3-minute pitch + 5 minutes of investor Q&A under spotlight.", ru: "3-минутный питч + 5 минут вопросов от инвесторов под софитами." },
  "sc.thesis-defense.t": { en: "Thesis Defense", ru: "Защита диплома" },
  "sc.thesis-defense.d": { en: "Present your dissertation to a hostile committee. Defend every claim.", ru: "Защита диссертации перед недружелюбной комиссией. Защити каждый тезис." },
  "sc.conference-talk.t": { en: "Academic Conference", ru: "Научная конференция" },
  "sc.conference-talk.d": { en: "20-min talk, 10-min Q&A. Peers will probe novelty and rigor.", ru: "20 минут доклада, 10 минут вопросов. Коллеги проверят новизну и строгость." },
  "sc.case-champ.t": { en: "Case Championship", ru: "Кейс-чемпионат" },
  "sc.case-champ.d": { en: "Solve a business case live. Jury cross-examines your assumptions.", ru: "Решаешь бизнес-кейс вживую. Жюри допрашивает каждое допущение." },
  "sc.board-review.t": { en: "Board Review", ru: "Совет директоров" },
  "sc.board-review.d": { en: "Quarterly performance to the board. Strategic, formal, high stakes.", ru: "Квартальный отчёт совету. Стратегично, формально, высокие ставки." },
  "sc.hackathon-jury.t": { en: "Hackathon Jury", ru: "Жюри хакатона" },
  "sc.hackathon-jury.d": { en: "5-min demo to a panel of engineers. Show, don't tell.", ru: "5-минутное демо перед инженерами. Показывай, а не рассказывай." },
  "sc.custom-upload.t": { en: "Custom Audience", ru: "Своя аудитория" },
  "sc.custom-upload.d": { en: "Upload a photo of anyone in your life. We'll bring them to life.", ru: "Загрузи фото любого человека из жизни. Мы оживим его." },

  // personas
  "p.vance.arc": { en: "Skeptical Investor", ru: "Скептичный инвестор" },
  "p.vance.role": { en: "Tier-1 VC Partner", ru: "Партнёр VC топ-уровня" },
  "p.vance.style": { en: "Interrupts. Hunts for unit economics. Hates hand-waving.", ru: "Перебивает. Копает в юнит-экономику. Ненавидит общие слова." },
  "p.karlsen.arc": { en: "Strict Professor", ru: "Строгий профессор" },
  "p.karlsen.role": { en: "Thesis Committee Chair", ru: "Председатель комиссии" },
  "p.karlsen.style": { en: "Methodology first. Will dismantle weak citations and assumptions.", ru: "Сначала методология. Разнесёт слабые ссылки и допущения." },
  "p.ren.arc": { en: "Tech Pragmatist", ru: "Тех-прагматик" },
  "p.ren.role": { en: "Hackathon Lead Judge", ru: "Главный судья хакатона" },
  "p.ren.style": { en: "Wants to see the demo. Asks about stack, scale, what's real vs mock.", ru: "Хочет видеть демо. Спрашивает про стек, масштаб, где реал, а где макет." },
  "p.moreau.arc": { en: "Corporate Executive", ru: "Корпоративный руководитель" },
  "p.moreau.role": { en: "Board Director", ru: "Член совета директоров" },
  "p.moreau.style": { en: "Strategic. Risk-focused. Polite but uncompromising on numbers.", ru: "Стратег. Фокус на рисках. Вежлива, но беспощадна к цифрам." },
};

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (key: string) => string };
const I18nContext = createContext<Ctx | null>(null);

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(() => (localStorage.getItem("confly.lang") as Lang) || "en");
  useEffect(() => {
    localStorage.setItem("confly.lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);
  const t = (key: string) => dict[key]?.[lang] ?? key;
  return <I18nContext.Provider value={{ lang, setLang: setLangState, t }}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be inside I18nProvider");
  return ctx;
};
