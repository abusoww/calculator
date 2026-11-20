(function () {
    'use strict';

    // =====================================================================
    // DATA — exam model (verified against DİM rules, 2025/2026 cycle)
    // =====================================================================
    //
    // Block exam (II stage, max 400): every subject has 30 tasks
    //   22 closed  (every 4 wrong answers cancel 1 correct)
    //    5 open, coded answer   (1 point)
    //    3 open, written answer (2 points)
    //   raw max = 22 + 5 + 3*2 = 33  ->  score = coef * 100/33 * raw
    //
    // Graduation exam, 11th grade (I stage, max 300): wrong answers don't subtract
    //   Riyaziyyat:      13 closed + 5 coded + 7 written*2  -> /32
    //   Azərbaycan dili: 20 closed + 10 written*2           -> /40
    //   Xarici dil:      23 closed + 7 written*2            -> /37

    const BLOCK_FIELDS = [
        { key: 'correct', max: 22, weight: 1, pool: 'closed', poolMax: 22 },
        { key: 'incorrect', max: 22, weight: -0.25, pool: 'closed', poolMax: 22 },
        { key: 'coding', max: 5, weight: 1 },
        { key: 'open', max: 3, weight: 2 }
    ];

    const block = (key, coef) => ({ key, coef, type: 'block', max: 100 * coef, fields: BLOCK_FIELDS });

    const FINAL_11_SUBJECTS = [
        {
            key: 'Riyaziyyat', type: 'final', max: 100, divisor: 32,
            fields: [
                { key: 'closed', max: 13, weight: 1 },
                { key: 'coding', max: 5, weight: 1 },
                { key: 'open', max: 7, weight: 2 }
            ]
        },
        {
            key: 'Azərbaycan dili', type: 'final', max: 100, divisor: 40,
            fields: [
                { key: 'closed', max: 20, weight: 1 },
                { key: 'open', max: 10, weight: 2 }
            ]
        },
        {
            key: 'İngilis dili', type: 'final', max: 100, divisor: 37,
            fields: [
                { key: 'closed', max: 23, weight: 1 },
                { key: 'open', max: 7, weight: 2 }
            ]
        }
    ];

    const FINAL_9_SUBJECTS = [
        {
            key: 'Riyaziyyat', type: 'final', max: 100, divisor: 29,
            fields: [
                { key: 'closed', max: 15, weight: 1 },
                { key: 'coding', max: 6, weight: 1 },
                { key: 'open', max: 4, weight: 2 }
            ]
        },
        {
            key: 'Azərbaycan dili', type: 'final', max: 100, divisor: 34,
            fields: [
                { key: 'closed', max: 26, weight: 1 },
                { key: 'open', max: 4, weight: 2 }
            ]
        },
        {
            key: 'İngilis dili', type: 'final', max: 100, divisor: 30,
            fields: [
                { key: 'closed', max: 23, weight: 1 },
                { key: 'coding', max: 2, weight: 1 },
                { key: 'essay', max: 5, weight: 1 }
            ]
        }
    ];

    const GROUPS = [
        {
            id: 'I Qrup', route: '/1qrup', badge: 'I', max: 400,
            variants: [
                { id: 'RK', label: 'Kimya', subjects: [block('Riyaziyyat', 1.5), block('Fizika', 1.5), block('Kimya', 1)] },
                { id: 'Rİ', label: 'İnformatika', subjects: [block('Riyaziyyat', 1.5), block('Fizika', 1.5), block('İnformatika', 1)] }
            ]
        },
        {
            id: 'II Qrup', route: '/2qrup', badge: 'II', max: 400,
            variants: [
                { id: 'main', subjects: [block('Riyaziyyat', 1.5), block('Coğrafiya', 1.5), block('Tarix', 1)] }
            ]
        },
        {
            id: 'III Qrup', route: '/3qrup', badge: 'III', max: 400,
            variants: [
                { id: 'DT', label: 'Ədəbiyyat', subjects: [block('Azərbaycan dili', 1.5), block('Tarix', 1.5), block('Ədəbiyyat', 1)] },
                { id: 'TC', label: 'Coğrafiya', subjects: [block('Azərbaycan dili', 1.5), block('Tarix', 1.5), block('Coğrafiya', 1)] }
            ]
        },
        {
            id: 'IV Qrup', route: '/4qrup', badge: 'IV', max: 400,
            variants: [
                { id: 'main', subjects: [block('Biologiya', 1.5), block('Kimya', 1.5), block('Fizika', 1)] }
            ]
        },
        {
            id: 'Buraxılış İmtahanı', route: '/buraxilis', badge: '<i class="fas fa-graduation-cap"></i>', max: 300,
            variants: [
                { id: '11', label: 'grade11', subjects: FINAL_11_SUBJECTS },
                { id: '9', label: 'grade9', subjects: FINAL_9_SUBJECTS }
            ]
        }
    ];

    const DOCS_BASE_URL = '/src/assets/';
    const SURVEY_FORM_URL = 'https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=0SUxpIkPpE-Zq1R0yJ_dQl5nIapgYjhFnWkiMPAuvWxUNUlIUDJHN1JZVUkzNUZUTEZGMEFSWlJYNC4u';

    const getGroup = (id) => GROUPS.find((g) => g.id === id) || null;
    const getGroupIndex = (id) => GROUPS.findIndex((g) => g.id === id) + 1;

    const normalizePath = (path) => {
        if (!path) return '/';
        const clean = path.split('?')[0].split('#')[0];
        return clean.length > 1 && clean.endsWith('/') ? clean.slice(0, -1) : clean;
    };
    const getGroupFromPath = (path) => {
        const p = normalizePath(path);
        const g = GROUPS.find((x) => x.route === p);
        return g ? g.id : null;
    };

    // =====================================================================
    // DATA — translations
    // =====================================================================
    const TRANSLATIONS = {
        az: {
            title: 'İmtahan Ballarını Hesabla',
            description: 'Qrupunu seç, cavablarını daxil et — bal dərhal hesablanır.',
            back: 'Qruplar',
            points: 'bal',
            total: 'Ümumi bal',
            details: 'Ətraflı',
            breakdown: 'Nəticə',
            saveResults: 'Nəticəni yüklə',
            reset: 'Sıfırla',
            fields: {
                correct: 'Doğru qapalı',
                incorrect: 'Yanlış qapalı',
                closed: 'Qapalı',
                coding: 'Kodlaşdırılan açıq',
                open: 'Yazılı açıq',
                essay: 'Yazı işi (hekayə, bal)'
            },
            hintMax: 'maks. {n}',
            hintDouble: '2 bal',
            hintPenalty: '−0.25 bal',
            errorMax: 'Maksimum {max}',
            groups: {
                'I Qrup': 'I Qrup',
                'II Qrup': 'II Qrup',
                'III Qrup': 'III Qrup',
                'IV Qrup': 'IV Qrup',
                'Buraxılış İmtahanı': 'Buraxılış İmtahanı'
            },
            subjects: {
                'Riyaziyyat': 'Riyaziyyat',
                'Fizika': 'Fizika',
                'Kimya': 'Kimya',
                'İnformatika': 'İnformatika',
                'Biologiya': 'Biologiya',
                'Coğrafiya': 'Coğrafiya',
                'Tarix': 'Tarix',
                'Azərbaycan dili': 'Azərbaycan dili',
                'Ədəbiyyat': 'Ədəbiyyat',
                'İngilis dili': 'Xarici dil',
                'grade11': 'Sinif',
                'grade9': 'Sinif'
            },
            howCalculated: 'Ballar necə hesablanır?',
            docsTitle: 'Rəsmi qaydalar',
            read: 'Oxu',
            docs9: '9-cu sinif buraxılış',
            docs11: '11-ci sinif buraxılış',
            addToHomeIOS_Step1: '1. Safari menyusunda "Paylaş" ikonuna toxunun',
            addToHomeIOS_Step2: '2. Aşağı sürüşdürüb "Ana Ekrana Əlavə Et" seçin',
            addToHomeAndroid_Step1: '1. Brauzer menyusunu açın (⋮)',
            addToHomeAndroid_Step2: '2. "Ana Ekrana Əlavə Et" seçin',
            addToHomeModalTitle: 'Tətbiqi Yüklə',
            addToHomeModalDesc: 'Daha sürətli hesablamaq üçün tətbiqi yükləyin:',
            addToHomeBtnTitle: 'Ana Ekrana Əlavə Et',
            surveyTitle: 'Abituriyent Sorğusu',
            surveyText: 'Bu sorğu abituriyentlərin hazırlıq prosesində qarşılaşdıqları çətinlikləri və repetitor sisteminin səmərəliliyini öyrənmək üçün hazırlanmışdır. Cəmi 30 saniyə vaxtınızı alacaq.',
            surveyButton: 'Sorğuya Keç',
            sponsorship: 'Reklam və əməkdaşlıq',
            sponsorDesc: 'Kurslar, repetitorlar və təhsil layihələri üçün saytda reklam və sponsorluq yerləşdirmək mümkündür. Əlaqə üçün Telegram-da yazın:',
            sponsorButton: 'Telegram-da yaz (@abusoww)',
            copied: 'Kopyalandı',
            copy: 'Kopyala',
            fileHeader: 'İMTAHAN NƏTİCƏSİ',
            fileDate: 'Tarix',
            fileGroup: 'Qrup'
        },
        ru: {
            title: 'Калькулятор баллов',
            description: 'Выбери группу, введи ответы — балл считается мгновенно.',
            back: 'Группы',
            points: 'балл',
            total: 'Общий балл',
            details: 'Подробно',
            breakdown: 'Результат',
            saveResults: 'Скачать результат',
            reset: 'Сбросить',
            fields: {
                correct: 'Верные закрытые',
                incorrect: 'Неверные закрытые',
                closed: 'Закрытые',
                coding: 'Открытые (код)',
                open: 'Открытые (письм.)',
                essay: 'Эссе (рассказ, балл)'
            },
            hintMax: 'макс. {n}',
            hintDouble: '2 балла',
            hintPenalty: '−0,25 балла',
            errorMax: 'Максимум {max}',
            groups: {
                'I Qrup': 'I Группа',
                'II Qrup': 'II Группа',
                'III Qrup': 'III Группа',
                'IV Qrup': 'IV Группа',
                'Buraxılış İmtahanı': 'Выпускной экзамен'
            },
            subjects: {
                'Riyaziyyat': 'Математика',
                'Fizika': 'Физика',
                'Kimya': 'Химия',
                'İnformatika': 'Информатика',
                'Biologiya': 'Биология',
                'Coğrafiya': 'География',
                'Tarix': 'История',
                'Azərbaycan dili': 'Русский язык',
                'Ədəbiyyat': 'Литература',
                'İngilis dili': 'Иностранный язык',
                'grade11': 'Класс',
                'grade9': 'Класс'
            },
            howCalculated: 'Как считаются баллы?',
            docsTitle: 'Официальные правила',
            read: 'Открыть',
            docs9: 'Выпускной 9 класс',
            docs11: 'Выпускной 11 класс',
            addToHomeIOS_Step1: '1. Нажмите «Поделиться» в нижнем меню Safari',
            addToHomeIOS_Step2: '2. Прокрутите вниз и выберите «На Экран «Домой»»',
            addToHomeAndroid_Step1: '1. Нажмите (⋮) в верхнем меню',
            addToHomeAndroid_Step2: '2. Выберите «Добавить на гл. экран»',
            addToHomeModalTitle: 'Установить приложение',
            addToHomeModalDesc: 'Установите приложение для быстрого доступа:',
            addToHomeBtnTitle: 'Добавить на главный экран',
            surveyTitle: 'Опрос абитуриентов',
            surveyText: 'Этот опрос создан, чтобы изучить трудности, с которыми абитуриенты сталкиваются в процессе подготовки, и эффективность системы репетиторов. Это займет всего 30 секунд.',
            surveyButton: 'Перейти к опросу',
            sponsorship: 'Реклама и сотрудничество',
            sponsorDesc: 'Для курсов, репетиторов и образовательных проектов доступно размещение рекламы и спонсорства на сайте. Свяжитесь через Telegram:',
            sponsorButton: 'Написать в Telegram (@abusoww)',
            copied: 'Скопировано',
            copy: 'Копировать',
            fileHeader: 'РЕЗУЛЬТАТ ЭКЗАМЕНА',
            fileDate: 'Дата',
            fileGroup: 'Группа'
        }
    };

    // =====================================================================
    // CORE — store, persistence, utils
    // =====================================================================
    class Store {
        constructor(initialState = {}) {
            this.listeners = new Set();
            this.state = new Proxy(initialState, {
                set: (target, property, value) => {
                    target[property] = value;
                    this.listeners.forEach((fn) => fn(this.state, property, value));
                    return true;
                }
            });
        }
        subscribe(callback) {
            this.listeners.add(callback);
            return () => this.listeners.delete(callback);
        }
    }

    const readJSON = (key, fallback) => {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch (e) {
            return fallback;
        }
    };
    const writeJSON = (key, value) => {
        try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage full / private mode */ }
    };

    const savedLanguage = localStorage.getItem('language') || localStorage.getItem('lang');

    const store = new Store({
        language: savedLanguage === 'ru' ? 'ru' : 'az',
        theme: localStorage.getItem('theme') || 'light',
        activeGroup: null,
        activePage: 'home'
    });

    // answers[groupId][subjectKey][fieldKey] = number
    const answers = readJSON('answers_v2', {});
    // variants[groupId] = variantId
    const variants = readJSON('variants_v1', {});

    const getAnswer = (groupId, subject, field) => Number(answers[groupId]?.[subject]?.[field]) || 0;
    const setAnswer = (groupId, subject, field, value) => {
        answers[groupId] = answers[groupId] || {};
        answers[groupId][subject] = answers[groupId][subject] || {};
        answers[groupId][subject][field] = value;
        writeJSON('answers_v2', answers);
    };
    const clearAnswers = (groupId) => {
        delete answers[groupId];
        writeJSON('answers_v2', answers);
    };

    const getVariant = (group) => group.variants.find((v) => v.id === variants[group.id]) || group.variants[0];

    const t = () => TRANSLATIONS[store.state.language];
    const fmt = (n) => (Math.round(n * 10) / 10).toFixed(1);

    const setScrollLock = (isLocked) => {
        document.body.classList.toggle('scroll-locked', isLocked);
        document.documentElement.classList.toggle('scroll-locked', isLocked);
    };

    const trackUmamiEvent = (event, data = {}) => {
        if (typeof umami !== 'undefined' && typeof umami.track === 'function') {
            umami.track(event, data);
        }
    };

    const vibrate = (duration = 10) => {
        if ('vibrate' in navigator) navigator.vibrate(duration);
    };

    const applyTheme = () => {
        const isLight = store.state.theme === 'light';
        document.body.classList.toggle('light-mode', isLight);
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute('content', isLight ? '#FAFAF9' : '#0F0F11');
    };

    const applyLanguage = () => {
        const tr = t();
        document.documentElement.lang = store.state.language;
        const titleEl = document.querySelector('.title');
        const descEl = document.querySelector('.description');
        if (titleEl) titleEl.textContent = tr.title;
        if (descEl) descEl.textContent = tr.description;
    };

    store.subscribe((state, prop, value) => {
        if (prop === 'language') {
            localStorage.setItem('language', value);
            localStorage.removeItem('lang');
            applyLanguage();
        }
        if (prop === 'theme') {
            localStorage.setItem('theme', value);
            applyTheme();
        }
    });

    // =====================================================================
    // SERVICE — scoring
    // =====================================================================
    const Calculator = {
        subjectScore(subject, groupId) {
            const v = (k, max) => Math.min(max, Math.max(0, getAnswer(groupId, subject.key, k)));
            if (subject.type === 'block') {
                // Closed part can't go below zero.
                const closed = Math.max(0, v('correct', 22) - v('incorrect', 22) / 4);
                const raw = closed + v('coding', 5) + 2 * v('open', 3);
                const score = subject.coef * (100 / 33) * raw;
                return Math.round(score * 10) / 10;
            }
            const raw = subject.fields.reduce((sum, f) => sum + f.weight * v(f.key, f.max), 0);
            const score = (100 / subject.divisor) * raw;
            return Math.round(score * 10) / 10;
        },

        groupScores(group) {
            const variant = getVariant(group);
            const rows = variant.subjects.map((s) => ({ subject: s, score: this.subjectScore(s, group.id) }));
            const total = rows.reduce((sum, r) => sum + r.score, 0);
            return { variant, rows, total };
        },

        // Linked limits: correct + incorrect closed answers can't exceed 22.
        effectiveMax(field, subject, groupId) {
            if (!field.pool) return field.max;
            const used = subject.fields
                .filter((f) => f.pool === field.pool && f.key !== field.key)
                .reduce((sum, f) => sum + getAnswer(groupId, subject.key, f.key), 0);
            return Math.max(0, Math.min(field.max, field.poolMax - used));
        }
    };

    // =====================================================================
    // UTILITY — sounds (soft, synthesized)
    // =====================================================================
    class SoundManager {
        constructor() {
            this.ctx = null;
        }
        _ctx() {
            if (!this.ctx) {
                const AC = window.AudioContext || window.webkitAudioContext;
                if (!AC) return null;
                this.ctx = new AC();
            }
            if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => { });
            return this.ctx;
        }
        _tone({ type = 'sine', from, to, gain, duration, attack = 0, lowpass }) {
            const ctx = this._ctx();
            if (!ctx) return;
            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const g = ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(from, now);
            if (to) osc.frequency.exponentialRampToValueAtTime(to, now + duration);
            if (attack) {
                g.gain.setValueAtTime(0, now);
                g.gain.linearRampToValueAtTime(gain, now + attack);
            } else {
                g.gain.setValueAtTime(gain, now);
            }
            g.gain.exponentialRampToValueAtTime(0.001, now + duration);
            let node = osc;
            if (lowpass) {
                const f = ctx.createBiquadFilter();
                f.type = 'lowpass';
                f.frequency.setValueAtTime(lowpass, now);
                osc.connect(f);
                node = f;
            }
            node.connect(g);
            g.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + duration);
        }
        tap() { this._tone({ from: 300, to: 150, gain: 0.08, duration: 0.1, lowpass: 800 }); }
        pop() { this._tone({ from: 400, to: 800, gain: 0.06, duration: 0.1 }); }
        blip() { this._tone({ from: 600, gain: 0.03, duration: 0.15, attack: 0.02 }); }
        tick() { this._tone({ from: 800, gain: 0.015, duration: 0.03 }); }
    }

    const sound = new SoundManager();

    document.addEventListener('click', (e) => {
        const target = e.target;
        if (target.closest('#footerContainer')) return;
        if (target.closest('.stepper-btn') || target.tagName === 'INPUT') return sound.tick();
        if (target.closest('.navbar-btn')) return sound.pop();
        if (target.closest('#groupButtons [data-group], .segment')) return sound.blip();
        if (target.closest('button, a[href]')) sound.tap();
    });

    // =====================================================================
    // COMPONENT base
    // =====================================================================
    class Component {
        constructor(host, props = {}) {
            this.host = host;
            this.props = props;
            this.render();
        }
        render() {
            if (!this.host) return;
            this.host.innerHTML = this.template();
            this.afterRender();
        }
        template() { return ''; }
        afterRender() { }
    }

    // =====================================================================
    // COMPONENT — Home header (theme + language)
    // =====================================================================
    class HomeHeader extends Component {
        constructor(host) {
            super(host);
            store.subscribe((state, prop) => {
                if (prop === 'language' || prop === 'theme') this.render();
            });
        }
        template() {
            const isLight = store.state.theme === 'light';
            return `
                <div class="header-side"></div>
                <div class="header-side header-side-right">
                    <button id="themeToggle" class="navbar-btn" type="button" aria-label="Theme">
                        <i class="fas ${isLight ? 'fa-sun' : 'fa-moon'}"></i>
                    </button>
                    <button id="languageToggle" class="navbar-btn header-badge-btn" type="button" aria-label="Language">
                        ${store.state.language.toUpperCase()}
                    </button>
                </div>
            `;
        }
        afterRender() {
            this.host.querySelector('#themeToggle').addEventListener('click', () => {
                vibrate(10);
                store.state.theme = store.state.theme === 'light' ? 'dark' : 'light';
                trackUmamiEvent('Theme Changed', { theme: store.state.theme });
            });
            this.host.querySelector('#languageToggle').addEventListener('click', () => {
                vibrate(10);
                store.state.language = store.state.language === 'az' ? 'ru' : 'az';
                trackUmamiEvent('Language Changed', { language: store.state.language });
            });
        }
    }

    // =====================================================================
    // COMPONENT — Group list (home)
    // =====================================================================
    const subjectsLine = (group, tr) => {
        // Merge variants per position: "Riyaziyyat · Fizika · Kimya/İnformatika"
        const len = group.variants[0].subjects.length;
        const parts = [];
        for (let i = 0; i < len; i++) {
            const keys = [...new Set(group.variants.map((v) => v.subjects[i].key))];
            parts.push(keys.map((k) => tr.subjects[k]).join('/'));
        }
        return parts.join(' · ');
    };

    const openGroup = (groupId) => {
        const targetPage = document.getElementById(`group${getGroupIndex(groupId)}Page`);
        if (!targetPage) return;
        vibrate(10);

        store.state.activeGroup = groupId;
        store.state.activePage = `group${getGroupIndex(groupId)}`;

        document.getElementById('homePage').classList.add('slid-out');
        document.querySelectorAll('.group-page').forEach((p) => p.classList.remove('active', 'sliding-out'));
        targetPage.classList.add('active');
        targetPage.scrollTop = 0;

        const nextPath = getGroup(groupId).route;
        if (normalizePath(window.location.pathname) !== nextPath) {
            window.history.pushState({ group: groupId }, '', nextPath);
        }
    };

    class GroupSelector extends Component {
        constructor(host) {
            super(host);
            store.subscribe((state, prop) => {
                if (prop === 'language') this.render();
            });
        }
        template() {
            const tr = t();
            return `
                <div class="list-container group-list">
                    ${GROUPS.map((g, i) => `
                        <button data-group="${g.id}" class="list-item-btn group-item" type="button" style="--group-color: var(--g${i + 1}); --group-rgb: var(--g${i + 1}-rgb);">
                            <span class="group-badge">${g.badge}</span>
                            <span class="group-text">
                                <span class="group-name">${tr.groups[g.id]}</span>
                                <span class="group-subjects">${subjectsLine(g, tr)}</span>
                            </span>
                            <span class="group-max">${g.max}</span>
                            <i class="fas fa-chevron-right list-chevron"></i>
                        </button>
                    `).join('')}
                </div>

                <div class="list-container secondary-list">
                    <button type="button" id="docsBtn" class="list-item-btn">
                        <span class="list-item-label"><i class="fas fa-book-open"></i>${tr.howCalculated}</span>
                        <i class="fas fa-chevron-right list-chevron"></i>
                    </button>
                    <button type="button" id="addToHomeBtn" class="list-item-btn">
                        <span class="list-item-label"><i class="fas fa-mobile-screen-button"></i>${tr.addToHomeBtnTitle}</span>
                        <i class="fas fa-chevron-right list-chevron"></i>
                    </button>
                    <button type="button" id="surveyListBtn" class="list-item-btn">
                        <span class="list-item-label"><i class="fas fa-clipboard-list"></i>${tr.surveyTitle}</span>
                        <i class="fas fa-chevron-right list-chevron"></i>
                    </button>
                    <button type="button" id="sponsorListBtn" class="list-item-btn">
                        <span class="list-item-label"><i class="fa-brands fa-telegram"></i>${tr.sponsorship}</span>
                        <i class="fas fa-chevron-right list-chevron"></i>
                    </button>
                </div>
            `;
        }
        afterRender() {
            const groupButtons = Array.from(this.host.querySelectorAll('[data-group]'));
            let suppressClick = false;

            groupButtons.forEach((btn) => {
                btn.addEventListener('click', () => {
                    if (suppressClick) return;
                    trackUmamiEvent('Group Selected', { group: btn.dataset.group });
                    openGroup(btn.dataset.group);
                });
            });

            // Mobile: long-press, slide across items, release to choose.
            const groupList = this.host.querySelector('.group-list');
            if (groupList && window.matchMedia('(hover: none)').matches) {
                let holdTimer = null;
                let longPressActive = false;
                let tracking = false;
                let startX = 0;
                let startY = 0;
                let activeBtn = null;

                const setActive = (btn) => {
                    groupButtons.forEach((b) => b.classList.remove('touch-hover'));
                    activeBtn = btn;
                    if (btn) btn.classList.add('touch-hover');
                };
                const reset = () => {
                    clearTimeout(holdTimer);
                    holdTimer = null;
                    longPressActive = false;
                    tracking = false;
                    setActive(null);
                    groupList.classList.remove('touch-picker-active');
                };
                const cancelHold = () => {
                    clearTimeout(holdTimer);
                    holdTimer = null;
                    tracking = false;
                    setActive(null);
                };

                groupList.addEventListener('touchstart', (e) => {
                    const btn = e.target.closest('[data-group]');
                    if (!btn) return;
                    tracking = true;
                    startX = e.touches[0].clientX;
                    startY = e.touches[0].clientY;
                    setActive(btn);
                    holdTimer = setTimeout(() => {
                        if (!tracking) return;
                        longPressActive = true;
                        groupList.classList.add('touch-picker-active');
                        vibrate(6);
                    }, 220);
                }, { passive: true });

                groupList.addEventListener('touchmove', (e) => {
                    if (!tracking) return;
                    const touch = e.touches[0];
                    const dx = Math.abs(touch.clientX - startX);
                    const dy = Math.abs(touch.clientY - startY);

                    if (!longPressActive) {
                        // Let native scrolling win before the long-press engages.
                        if (dx > 10 || dy > 10) cancelHold();
                        return;
                    }

                    e.preventDefault();
                    const hovered = document.elementFromPoint(touch.clientX, touch.clientY)?.closest('[data-group]');
                    if (hovered && groupList.contains(hovered) && hovered !== activeBtn) {
                        setActive(hovered);
                        vibrate(3);
                    }
                }, { passive: false });

                groupList.addEventListener('touchend', () => {
                    if (!longPressActive || !activeBtn) return reset();
                    const chosen = activeBtn.dataset.group;
                    reset();
                    suppressClick = true;
                    setTimeout(() => { suppressClick = false; }, 350);
                    trackUmamiEvent('Group Selected', { group: chosen, via: 'long-press' });
                    openGroup(chosen);
                }, { passive: true });

                groupList.addEventListener('touchcancel', reset, { passive: true });
            }

            const openModal = (id) => {
                vibrate(10);
                const modal = document.getElementById(id);
                if (!modal) return;
                modal.classList.add('active');
                setScrollLock(true);
            };

            this.host.querySelector('#docsBtn').addEventListener('click', () => {
                openModal('docsModal');
                trackUmamiEvent('Docs Opened');
            });
            this.host.querySelector('#addToHomeBtn').addEventListener('click', () => {
                openModal('addToHomeModal');
                trackUmamiEvent('Add to Home Screen Opened');
            });
            this.host.querySelector('#surveyListBtn').addEventListener('click', () => {
                vibrate(10);
                showSurveyPopup();
                trackUmamiEvent('Survey Opened', { source: 'home-list' });
            });
            this.host.querySelector('#sponsorListBtn').addEventListener('click', () => {
                openModal('sponsorModal');
                trackUmamiEvent('Sponsorship Opened', { source: 'home-list' });
            });
        }
    }

    // =====================================================================
    // COMPONENT — Group page (header + live form + dock + results)
    // =====================================================================
    class GroupPage {
        constructor(pageEl, group) {
            this.page = pageEl;
            this.group = group;
            this.headerHost = pageEl.querySelector('.page-header');
            this.formHost = pageEl.querySelector('.group-form');
            this.resultsHost = pageEl.querySelector('.group-results');
            this.dockHost = pageEl.querySelector('.score-dock');
            this.displayedTotal = 0;
            this.trackTimer = null;

            this.page.addEventListener('click', (e) => this.onAction(e));
            store.subscribe((state, prop) => {
                if (prop === 'language') this.render();
            });
            this.render();
        }

        // ---------- rendering ----------
        render() {
            const tr = t();
            this.headerHost.innerHTML = `
                <div class="header-side">
                    <button type="button" class="nav-back-btn" data-action="back">
                        <i class="fas fa-chevron-left"></i>${tr.back}
                    </button>
                </div>
                <div class="header-title">${tr.groups[this.group.id]}</div>
                <div class="header-side"></div>
            `;
            this.renderForm();
            this.dockHost.innerHTML = `
                <div class="score-dock-inner">
                    <div class="dock-total">
                        <span class="dock-label">${tr.total}</span>
                        <span class="dock-value"><b data-total>${fmt(this.displayedTotal)}</b><span class="dock-max">/${this.group.max}</span></span>
                    </div>
                    <button type="button" class="dock-btn" data-action="details">
                        ${tr.details}<i class="fas fa-arrow-down"></i>
                    </button>
                    <div class="dock-progress"><span data-total-bar></span></div>
                </div>
            `;
            this.update({ animate: false });
        }

        renderForm() {
            const tr = t();
            const variant = getVariant(this.group);
            const variantsHtml = this.group.variants.length > 1 ? `
                <div class="segmented" role="tablist">
                    ${this.group.variants.map((v) => `
                        <button type="button" role="tab" class="segment ${v.id === variant.id ? 'active' : ''}" data-action="variant" data-variant="${v.id}" aria-selected="${v.id === variant.id}">
                            <span class="segment-code">${v.id}</span>${tr.subjects[v.label]}
                        </button>
                    `).join('')}
                </div>
            ` : '';

            this.formHost.innerHTML = `
                ${variantsHtml}
                <form class="subjects-grid" autocomplete="off" novalidate>
                    ${variant.subjects.map((s) => this.subjectTemplate(s, tr)).join('')}
                </form>
            `;
            this.bindForm();
        }

        subjectTemplate(subject, tr) {
            const gid = this.group.id;
            return `
                <section class="subject" data-subject="${subject.key}">
                    <header class="subject-head">
                        <h3>${tr.subjects[subject.key]}</h3>
                        <span class="subject-score"><b data-score>0.0</b><span>/${subject.max}</span></span>
                    </header>
                    <div class="subject-progress"><span data-bar></span></div>
                    <div class="input-group">
                        ${subject.fields.map((f) => {
                            const val = getAnswer(gid, subject.key, f.key);
                            return `
                                <div class="field-row">
                                    <span class="field-text">
                                        <span class="field-label">${tr.fields[f.key]}</span>
                                        <span class="field-hint" data-hint="${f.key}"></span>
                                    </span>
                                    <span class="stepper-wrapper">
                                        <button type="button" class="stepper-btn minus" tabindex="-1" aria-label="−1"><i class="fas fa-minus"></i></button>
                                        <input type="text" inputmode="numeric" pattern="[0-9]*" enterkeyhint="next" autocomplete="off"
                                            class="input-field" data-field="${f.key}" placeholder="0" value="${val || ''}"
                                            aria-label="${tr.subjects[subject.key]} — ${tr.fields[f.key]}">
                                        <button type="button" class="stepper-btn plus" tabindex="-1" aria-label="+1"><i class="fas fa-plus"></i></button>
                                    </span>
                                    <span class="validation-message" role="alert"></span>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </section>
            `;
        }

        resultsTemplate(scores) {
            const tr = t();
            if (scores.total <= 0) return '';
            const rows = scores.rows.map(({ subject, score }) => `
                <div class="results-list-item">
                    <span class="results-subject-name">${tr.subjects[subject.key]}</span>
                    <span class="results-bar"><span style="width:${Math.min(100, (score / subject.max) * 100)}%"></span></span>
                    <span class="results-subject-score">${fmt(score)}<small>/${subject.max}</small></span>
                </div>
            `).join('');

            return `
                <div class="results-container">
                    <h2 class="section-title">${tr.breakdown}</h2>
                    <div class="results-breakdown-list">
                        ${rows}
                        <div class="results-list-item results-total-row">
                            <span class="results-subject-name">${tr.total}</span>
                            <span class="results-total-value">${fmt(scores.total)}<small>/${this.group.max}</small></span>
                        </div>
                    </div>

                    <div class="results-actions">
                        <button type="button" class="action-btn secondary" data-action="download">
                            <i class="fas fa-download"></i>${tr.saveResults}
                        </button>
                        <button type="button" class="action-btn ghost" data-action="reset">
                            <i class="fas fa-rotate-left"></i>${tr.reset}
                        </button>
                    </div>

                    <div class="survey-inline-card">
                        <h4 class="survey-inline-title">${tr.surveyTitle}</h4>
                        <p class="survey-inline-text">${tr.surveyText}</p>
                        <a href="${SURVEY_FORM_URL}" target="_blank" rel="noopener noreferrer" class="action-btn survey-link-btn" data-survey-source="after-calculate-inline">${tr.surveyButton}</a>
                    </div>
                </div>
            `;
        }

        // ---------- live update ----------
        update({ animate = true } = {}) {
            const tr = t();
            const gid = this.group.id;
            const scores = Calculator.groupScores(this.group);

            scores.rows.forEach(({ subject, score }) => {
                const section = this.formHost.querySelector(`.subject[data-subject="${subject.key}"]`);
                if (!section) return;
                section.querySelector('[data-score]').textContent = fmt(score);
                section.querySelector('[data-bar]').style.width = `${Math.min(100, (score / subject.max) * 100)}%`;
                section.classList.toggle('has-score', score > 0);

                subject.fields.forEach((f) => {
                    const max = Calculator.effectiveMax(f, subject, gid);
                    const value = getAnswer(gid, subject.key, f.key);
                    const input = section.querySelector(`.input-field[data-field="${f.key}"]`);
                    const row = input.closest('.field-row');

                    let hint = tr.hintMax.replace('{n}', max);
                    if (f.weight === 2) hint += ` · ${tr.hintDouble}`;
                    if (f.weight < 0) hint += ` · ${tr.hintPenalty}`;
                    row.querySelector('[data-hint]').textContent = hint;

                    input.dataset.max = max;
                    row.querySelector('.minus').classList.toggle('is-disabled', value <= 0);
                    row.querySelector('.plus').classList.toggle('is-disabled', value >= max);
                });
            });

            // Dock
            const totalEl = this.dockHost.querySelector('[data-total]');
            this.dockHost.querySelector('[data-total-bar]').style.width = `${Math.min(100, (scores.total / this.group.max) * 100)}%`;
            this.dockHost.classList.toggle('is-empty', scores.total <= 0);
            this.animateTotal(totalEl, scores.total, animate);

            // Results
            this.resultsHost.innerHTML = this.resultsTemplate(scores);

            if (animate) this.scheduleTracking(scores);
        }

        animateTotal(el, to, animate) {
            cancelAnimationFrame(this.raf);
            const from = this.displayedTotal;
            if (!animate || Math.abs(to - from) < 0.05) {
                this.displayedTotal = to;
                el.textContent = fmt(to);
                return;
            }
            const start = performance.now();
            const duration = 260;
            const step = (now) => {
                const p = Math.min(1, (now - start) / duration);
                const eased = 1 - Math.pow(1 - p, 3);
                this.displayedTotal = from + (to - from) * eased;
                el.textContent = fmt(this.displayedTotal);
                if (p < 1) this.raf = requestAnimationFrame(step);
            };
            this.raf = requestAnimationFrame(step);
        }

        scheduleTracking(scores) {
            clearTimeout(this.trackTimer);
            if (scores.total <= 0) return;
            this.trackTimer = setTimeout(() => {
                const score = Math.round(scores.total);
                const lower = Math.floor(score / 50) * 50;
                trackUmamiEvent('Score Calculated', {
                    group: this.group.id,
                    variant: scores.variant.id,
                    score,
                    range: `${lower}-${Math.min(lower + 50, this.group.max)}`
                });
            }, 2500);
        }

        // ---------- form interactions ----------
        bindForm() {
            const gid = this.group.id;
            const form = this.formHost.querySelector('form');
            form.addEventListener('submit', (e) => e.preventDefault());

            const inputs = Array.from(form.querySelectorAll('.input-field'));

            const commit = (input, rawValue) => {
                const subjectKey = input.closest('.subject').dataset.subject;
                const max = Number(input.dataset.max);
                let value = parseInt(String(rawValue).replace(/\D/g, ''), 10);
                if (isNaN(value)) value = 0;

                const msg = input.closest('.field-row').querySelector('.validation-message');
                if (value > max) {
                    value = max;
                    msg.textContent = t().errorMax.replace('{max}', max);
                    msg.classList.add('show');
                    input.classList.add('has-error');
                    vibrate(20);
                    clearTimeout(input._errTimer);
                    input._errTimer = setTimeout(() => {
                        msg.classList.remove('show');
                        input.classList.remove('has-error');
                    }, 1800);
                }

                // Zero is shown as the placeholder, keeping the field clean.
                const display = value ? String(value) : '';
                if (input.value !== display) input.value = display;

                setAnswer(gid, subjectKey, input.dataset.field, value);
                this.update();
                return value;
            };

            inputs.forEach((input, index) => {
                input.addEventListener('input', () => commit(input, input.value));
                input.addEventListener('focus', () => {
                    // Select so typing replaces the current value — no backspacing on mobile.
                    requestAnimationFrame(() => input.select());
                });
                input.addEventListener('keydown', (e) => {
                    if (e.key !== 'Enter') return;
                    e.preventDefault();
                    const next = inputs[index + 1];
                    if (next) next.focus();
                    else input.blur();
                });
            });

            // Steppers with hold-to-repeat (accelerating)
            form.querySelectorAll('.stepper-btn').forEach((btn) => {
                let holdTimeout = null;
                let holdInterval = null;

                const step = () => {
                    const input = btn.parentElement.querySelector('input');
                    const current = parseInt(input.value, 10) || 0;
                    const max = Number(input.dataset.max);
                    const next = btn.classList.contains('plus') ? current + 1 : current - 1;
                    if (next < 0 || next > max) {
                        stop();
                        return;
                    }
                    vibrate(5);
                    commit(input, next);
                };

                const stop = () => {
                    clearTimeout(holdTimeout);
                    clearTimeout(holdInterval);
                    holdTimeout = null;
                    holdInterval = null;
                };

                const start = () => {
                    step();
                    let speed = 150;
                    const loop = () => {
                        step();
                        speed = Math.max(50, speed - 10);
                        if (holdTimeout || holdInterval) holdInterval = setTimeout(loop, speed);
                    };
                    holdTimeout = setTimeout(loop, 320);
                };

                btn.addEventListener('pointerdown', (e) => {
                    e.preventDefault();
                    start();
                });
                ['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => btn.addEventListener(ev, stop));
            });
        }

        // ---------- delegated actions ----------
        onAction(e) {
            const surveyLink = e.target.closest('[data-survey-source]');
            if (surveyLink) {
                trackUmamiEvent('Survey Opened', { group: this.group.id, source: surveyLink.dataset.surveySource });
                return;
            }

            const el = e.target.closest('[data-action]');
            if (!el) return;
            const action = el.dataset.action;

            if (action === 'back') return this.goBack();

            if (action === 'variant') {
                if (variants[this.group.id] === el.dataset.variant) return;
                vibrate(8);
                variants[this.group.id] = el.dataset.variant;
                writeJSON('variants_v1', variants);
                this.renderForm();
                this.update();
                trackUmamiEvent('Variant Selected', { group: this.group.id, variant: el.dataset.variant });
                return;
            }

            if (action === 'details') {
                vibrate(8);
                const target = this.resultsHost.firstElementChild || this.formHost;
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                return;
            }

            if (action === 'download') {
                vibrate(15);
                this.download();
                trackUmamiEvent('Results Downloaded', { group: this.group.id });
                return;
            }

            if (action === 'reset') {
                vibrate(15);
                clearAnswers(this.group.id);
                this.renderForm();
                this.update();
                this.page.scrollTo({ top: 0, behavior: 'smooth' });
                trackUmamiEvent('Form Reset', { group: this.group.id });
            }
        }

        goBack() {
            vibrate(10);
            const homePage = document.getElementById('homePage');
            const hadScore = Calculator.groupScores(this.group).total > 0;

            if (document.activeElement) document.activeElement.blur();
            this.page.classList.remove('active');
            this.page.classList.add('sliding-out');
            homePage.classList.remove('slid-out');

            setTimeout(() => {
                this.page.classList.remove('sliding-out');
                store.state.activePage = 'home';
                store.state.activeGroup = null;
                if (normalizePath(window.location.pathname) !== '/') {
                    window.history.pushState({ page: 'home' }, '', '/');
                }
                // Ask for the survey once per device, after the user has finished a calculation.
                if (hadScore && !localStorage.getItem('surveySeen')) {
                    localStorage.setItem('surveySeen', '1');
                    setTimeout(showSurveyPopup, 350);
                }
            }, 280);
        }

        download() {
            const tr = t();
            const lang = store.state.language;
            const scores = Calculator.groupScores(this.group);
            const date = new Date().toLocaleString(lang === 'az' ? 'az-AZ' : 'ru-RU');

            let text = `=== ${tr.fileHeader} ===\n`;
            text += `${tr.fileDate}: ${date}\n`;
            text += `${tr.fileGroup}: ${tr.groups[this.group.id]}${this.group.variants.length > 1 ? ` (${scores.variant.id})` : ''}\n`;
            text += `${tr.total}: ${fmt(scores.total)} / ${this.group.max}\n`;
            text += `--------------------------------\n`;

            scores.rows.forEach(({ subject, score }) => {
                text += `\n[${tr.subjects[subject.key].toUpperCase()}] ${fmt(score)} / ${subject.max}\n`;
                subject.fields.forEach((f) => {
                    const v = getAnswer(this.group.id, subject.key, f.key);
                    if (v) text += `- ${tr.fields[f.key]}: ${v}\n`;
                });
            });

            text += `\n--------------------------------\ncalculator.abusov.com`;

            const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
            const a = document.createElement('a');
            a.href = url;
            a.download = `netice-${new Date().toISOString().slice(0, 10)}.txt`;
            a.click();
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        }
    }

    // =====================================================================
    // COMPONENT — Footer
    // =====================================================================
    class Footer extends Component {
        template() {
            return `
                <div class="footer-content">
                    <span class="footer-text">made by <a href="https://abusov.com" target="_blank" rel="noopener">abusoww</a> with <i class="fa-solid fa-heart theme-heart"></i></span>
                </div>
            `;
        }
    }

    // =====================================================================
    // COMPONENT — Modals
    // =====================================================================
    class Modal extends Component {
        constructor(host) {
            super(host);
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.host.classList.contains('active')) this.close();
            });
            store.subscribe((state, prop) => {
                if (prop === 'language') this.render();
            });
        }
        close() {
            vibrate(10);
            this.host.classList.remove('active');
            setScrollLock(false);
        }
        shell(title, body) {
            return `
                <div class="modal-overlay">
                    <div class="modal-scale-content" role="dialog" aria-modal="true">
                        <div class="modal-grabber"></div>
                        <div class="modal-header">
                            <h3>${title}</h3>
                            <button type="button" class="modal-close" aria-label="Close">&times;</button>
                        </div>
                        <div class="modal-body">${body}</div>
                    </div>
                </div>
            `;
        }
        afterRender() {
            const overlay = this.host.querySelector('.modal-overlay');
            this.host.querySelector('.modal-close').addEventListener('click', () => this.close());
            overlay.addEventListener('click', (e) => { if (e.target === overlay) this.close(); });
        }
    }

    class DocumentationModal extends Modal {
        template() {
            const tr = t();
            const docs = [
                { name: tr.groups['I Qrup'], file: 'dim-1-qrup-ballari-hesablama.pdf' },
                { name: tr.groups['II Qrup'], file: 'dim-2-qrup-ballari-hesablama.pdf' },
                { name: tr.groups['III Qrup'], file: 'dim-3-qrup-ballari-hesablama.pdf' },
                { name: tr.groups['IV Qrup'], file: 'dim-4-qrup-ballari-hesablama.pdf' },
                { name: tr.docs9, file: 'dim-9-buraxilis-imtahani-ballari-hesablama.pdf' },
                { name: tr.docs11, file: 'dim-11-buraxilis-imtahani-ballari-hesablama.pdf' }
            ];
            return this.shell(tr.docsTitle, docs.map((doc) => `
                <a class="doc-item" href="${DOCS_BASE_URL}${doc.file}" target="_blank" rel="noopener">
                    <span class="doc-info"><i class="fas fa-file-pdf"></i><span>${doc.name}</span></span>
                    <span class="doc-link">${tr.read}</span>
                </a>
            `).join(''));
        }
    }

    class AddToHomeModal extends Modal {
        template() {
            const tr = t();
            const ua = navigator.userAgent;
            const isIOS = /iPad|iPhone|iPod/.test(ua) || (ua.includes('Mac') && 'ontouchend' in document);

            const steps = isIOS
                ? `
                    <div class="install-step"><span>${tr.addToHomeIOS_Step1}</span><img src="src/assets/ios-share-1.png" alt="" loading="lazy"></div>
                    <div class="install-step"><span>${tr.addToHomeIOS_Step2}</span><img src="src/assets/ios-share-2.png" alt="" loading="lazy"></div>
                `
                : `
                    <div class="install-step"><span>${tr.addToHomeAndroid_Step1}</span></div>
                    <div class="install-step"><span>${tr.addToHomeAndroid_Step2}</span><img src="src/assets/android-install.png" alt="" loading="lazy"></div>
                `;

            return this.shell(tr.addToHomeModalTitle, `
                <div class="install-intro">
                    <div class="install-icon"><i class="fas fa-calculator"></i></div>
                    <p>${tr.addToHomeModalDesc}</p>
                </div>
                <div class="install-steps">${steps}</div>
            `);
        }
    }

    class SponsorModal extends Modal {
        template() {
            const tr = t();
            return this.shell(tr.sponsorship, `
                <div class="install-intro">
                    <div class="install-icon"><i class="fa-brands fa-telegram"></i></div>
                    <p>${tr.sponsorDesc}</p>
                </div>
                <div class="sponsor-contact-row">
                    <span class="sponsor-handle"><i class="fa-brands fa-telegram"></i>@abusoww</span>
                    <button type="button" class="sponsor-copy-btn" data-copy="@abusoww">${tr.copy}</button>
                </div>
                <a href="https://t.me/abusoww" target="_blank" rel="noopener noreferrer" class="action-btn sponsor-cta-btn">
                    <i class="fa-brands fa-telegram"></i>${tr.sponsorButton}
                </a>
            `);
        }
        afterRender() {
            super.afterRender();
            const copyBtn = this.host.querySelector('.sponsor-copy-btn');
            if (copyBtn) {
                copyBtn.addEventListener('click', () => {
                    vibrate(10);
                    navigator.clipboard?.writeText('@abusoww').catch(() => { });
                    copyBtn.textContent = t().copied;
                    copyBtn.classList.add('copied');
                    setTimeout(() => {
                        copyBtn.textContent = t().copy;
                        copyBtn.classList.remove('copied');
                    }, 1800);
                });
            }
            const cta = this.host.querySelector('.sponsor-cta-btn');
            if (cta) {
                cta.addEventListener('click', () => {
                    trackUmamiEvent('Sponsorship Telegram Clicked', { handle: '@abusoww' });
                });
            }
        }
    }

    // =====================================================================
    // COMPONENT — Survey popup (shown on demand, or once after a finished calculation)
    // =====================================================================
    class SurveyPopup extends Component {
        constructor(host) {
            super(host);
            store.subscribe((state, prop) => {
                if (prop === 'language') this.render();
            });
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') hideSurveyPopup();
            });
        }
        template() {
            const tr = t();
            return `
                <div class="survey-floating-popup" role="dialog" aria-modal="true">
                    <button type="button" class="survey-floating-close" aria-label="Close">&times;</button>
                    <h4 class="survey-floating-title">${tr.surveyTitle}</h4>
                    <p class="survey-floating-text">${tr.surveyText}</p>
                    <a href="${SURVEY_FORM_URL}" target="_blank" rel="noopener noreferrer" class="action-btn survey-link-btn">${tr.surveyButton}</a>
                </div>
            `;
        }
        afterRender() {
            this.host.querySelector('.survey-floating-close').addEventListener('click', hideSurveyPopup);
            this.host.querySelector('.survey-link-btn').addEventListener('click', () => {
                trackUmamiEvent('Survey Opened', { source: 'floating-popup', page: store.state.activePage });
                hideSurveyPopup();
            });
        }
    }

    const showSurveyPopup = () => document.getElementById('surveyFloatingPopup')?.classList.add('active');
    const hideSurveyPopup = () => document.getElementById('surveyFloatingPopup')?.classList.remove('active');

    // =====================================================================
    // INIT
    // =====================================================================
    document.addEventListener('DOMContentLoaded', () => {
        applyTheme();
        applyLanguage();

        const applyRouteState = (pathname) => {
            const routeGroup = getGroupFromPath(pathname);
            const homePage = document.getElementById('homePage');
            document.querySelectorAll('.group-page').forEach((p) => p.classList.remove('active', 'sliding-out'));

            if (!routeGroup) {
                homePage.classList.remove('slid-out');
                store.state.activePage = 'home';
                store.state.activeGroup = null;
                return;
            }

            homePage.classList.add('slid-out');
            document.getElementById(`group${getGroupIndex(routeGroup)}Page`)?.classList.add('active');
            store.state.activeGroup = routeGroup;
            store.state.activePage = `group${getGroupIndex(routeGroup)}`;
        };

        applyRouteState(window.location.pathname);

        new HomeHeader(document.getElementById('homeHeader'));
        new GroupSelector(document.getElementById('groupButtons'));
        new Footer(document.getElementById('footerContainer'));
        new DocumentationModal(document.getElementById('docsModal'));
        new AddToHomeModal(document.getElementById('addToHomeModal'));
        new SponsorModal(document.getElementById('sponsorModal'));

        const surveyHost = document.getElementById('surveyFloatingPopup');
        new SurveyPopup(surveyHost);
        surveyHost.addEventListener('click', (e) => { if (e.target === surveyHost) hideSurveyPopup(); });

        GROUPS.forEach((group, i) => {
            const page = document.getElementById(`group${i + 1}Page`);
            if (page) new GroupPage(page, group);
        });

        window.addEventListener('popstate', () => applyRouteState(window.location.pathname));

        // Extra scroll room while the on-screen keyboard is open
        const updateKeyboardState = () => {
            const activePage = document.querySelector('.group-page.active');
            if (!activePage) return;
            const focused = document.activeElement;
            activePage.classList.toggle('keyboard-open', !!(focused && focused.matches('input')));
        };
        document.addEventListener('focusin', updateKeyboardState);
        document.addEventListener('focusout', () => setTimeout(updateKeyboardState, 0));

        // Entry animations
        [
            document.getElementById('homeHeader'),
            document.querySelector('.title'),
            document.querySelector('.description'),
            document.getElementById('groupButtons'),
            document.getElementById('footerContainer')
        ].forEach((el, index) => {
            if (!el) return;
            el.classList.add('animate-appear');
            el.style.animationDelay = `${index * 70}ms`;
        });

        // Analytics
        window.addEventListener('beforeunload', () => {
            const group = getGroup(store.state.activeGroup);
            if (group && Calculator.groupScores(group).total <= 0) {
                trackUmamiEvent('User Abandoned Form', { group: group.id });
            }
        });

        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href]');
            if (!link) return;
            const href = link.href;
            if (href.includes('.pdf')) trackUmamiEvent('Document Clicked', { file: href.split('/').pop() });
            else if (href.includes('://abusov.com')) trackUmamiEvent('Author Link Clicked');
            else trackUmamiEvent('Link Clicked', { url: href });
        });
    });
})();
