(function () {
    'use strict';

    // --- DATA: Constants ---
    const GROUPS = [
        {
            name: 'I Qrup',
            subjects: ['Riyaziyyat', 'Fizika', 'Kimya'],
            maxScores: [150, 150, 100]
        },
        {
            name: 'II Qrup',
            subjects: ['Riyaziyyat', 'Coğrafiya', 'Tarix'],
            maxScores: [150, 100, 150]
        },
        {
            name: 'III Qrup',
            subjects: ['Azərbaycan dili', 'Ədəbiyyat', 'Tarix'],
            maxScores: [150, 100, 150]
        },
        {
            name: 'IV Qrup',
            subjects: ['Biologiya', 'Kimya', 'Fizika'],
            maxScores: [150, 150, 100]
        },
        {
            name: 'Buraxılış İmtahanı',
            subjects: ['Riyaziyyat', 'Azərbaycan dili', 'İngilis dili'],
            maxScores: [100, 100, 100]
        },
    ];

    const APP_CONFIG = {
        examDate: '2026-03-01T10:00:00',
        docsBaseUrl: 'https://raw.githubusercontent.com/abusoww/calculator/main/legacy/'
    };

    const SCORE_RANGES = {
        'I Qrup': {
            max: 400,
            ranges: [
                { min: 350, max: 400, level: 'excellent' },
                { min: 250, max: 349, level: 'good' },
                { min: 150, max: 249, level: 'average' },
                { min: 0, max: 149, level: 'low' }
            ]
        },
        'II Qrup': {
            max: 400,
            ranges: [
                { min: 350, max: 400, level: 'excellent' },
                { min: 250, max: 349, level: 'good' },
                { min: 150, max: 249, level: 'average' },
                { min: 0, max: 149, level: 'low' }
            ]
        },
        'III Qrup': {
            max: 400,
            ranges: [
                { min: 350, max: 400, level: 'excellent' },
                { min: 250, max: 349, level: 'good' },
                { min: 150, max: 249, level: 'average' },
                { min: 0, max: 149, level: 'low' }
            ]
        },
        'IV Qrup': {
            max: 400,
            ranges: [
                { min: 350, max: 400, level: 'excellent' },
                { min: 250, max: 349, level: 'good' },
                { min: 150, max: 249, level: 'average' },
                { min: 0, max: 149, level: 'low' }
            ]
        },
        'Buraxılış İmtahanı': {
            max: 300,
            ranges: [
                { min: 250, max: 300, level: 'excellent' },
                { min: 200, max: 249, level: 'good' },
                { min: 150, max: 199, level: 'average' },
                { min: 0, max: 149, level: 'low' }
            ]
        }
    };

    const RESULT_GIFS = {
        excellent: 'https://i.ibb.co/MGtjf0b/4giphy.gif',
        good: 'https://i.ibb.co/PZ6L2ZV/3giphy.gif',
        average: 'https://i.ibb.co/SdJMfcj/2giphy.gif',
        low: '/legacy/media/low.gif'
    };

    // --- DATA: Locales ---
    const TRANSLATIONS = {
        az: {
            title: 'İmtahan Ballarını Hesablama',
            description: 'Doğru, yanlış, açıq və qapalı suallar haqqında məlumat daxil edərək ballarınızı hesablaya bilərsiniz.',
            calculate: 'Hesabla!',
            results: 'Nəticəm:',
            subject: 'Fənn',
            score: 'Ümumi Bal',
            saveResults: 'Nəticələri Saxla',
            recalculate: 'Yenidən hesabla',
            correct: 'Doğru Qapalı',
            incorrect: 'Yanlış Qapalı',
            open: 'Açıq',
            closed: 'Qapalı',
            coding: 'Kodlaşdırma',
            days: 'Gün',
            hours: 'Saat',
            minutes: 'Dəqiqə',
            seconds: 'Saniyə',
            examStarted: 'İmtahan başladı!',
            daysLeft: 'Gün qaldı',
            hoursLeft: 'Saat qaldı',
            minutesLeft: 'Dəqiqə qaldı',
            secondsLeft: 'Saniyə qaldı',
            downloadText: 'Nəticələri yüklə',
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
                'Biologiya': 'Biologiya',
                'Coğrafiya': 'Coğrafiya',
                'Tarix': 'Tarix',
                'Azərbaycan dili': 'Azərbaycan dili',
                'Ədəbiyyat': 'Ədəbiyyat',
                'İngilis dili': 'İngilis dili',
                'Ümumi bal': 'Ümumi bal'
            },
            messages: {
                excellent: 'Halal olsun! partlayışsan! Səninlə fəxr edirəm! 😎🔥',
                good: 'Pis deyil! Amma bir az da sıxsan, nəticən bomba kimi olacaq! �',
                average: 'Normaldır, amma mən bilirəm ki, sən bundan daha artığını bacararsan. Qaz ver! �',
                low: 'Həvəsdən düşmək yoxdur! Bu sadəcə rəqəmlərdir. Əsas odur ki, təslim olmayasan! �'
            },
            errors: {
                range: 'Dəyər {min} və {max} arasında olmalıdır.'
            },
            howCalculated: 'Ballar necə hesablanır?',
            docsTitle: 'Sənədlər'
        },
        ru: {
            title: 'Калькулятор подсчета баллов',
            description: 'Вы можете рассчитать свои баллы, введя информацию о правильных, неправильных, открытых и закрытых вопросах.',
            calculate: 'Рассчитать',
            results: 'Результаты',
            subject: 'Предмет',
            score: 'Балл',
            saveResults: 'Сохранить результаты',
            recalculate: 'Пересчитать',
            correct: 'Правильно',
            incorrect: 'Неправильно',
            open: 'Открытые',
            closed: 'Закрытые',
            coding: 'Кодирование',
            days: 'Дней',
            hours: 'Часов',
            minutes: 'Минут',
            seconds: 'Секунд',
            examStarted: 'Экзамен начался!',
            daysLeft: 'Дней осталось',
            hoursLeft: 'Часов осталось',
            minutesLeft: 'Минут осталось',
            secondsLeft: 'Секунд осталось',
            downloadText: 'Скачать результаты',
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
                'Biologiya': 'Биология',
                'Coğrafiya': 'География',
                'Tarix': 'История',
                'Azərbaycan dili': 'Русский язык',
                'Ədəbiyyat': 'Литература',
                'İngilis dili': 'Английский язык',
                'Ümumi bal': 'Общий балл'
            },
            messages: {
                excellent: 'Красава! Просто уничтожил систему! Горжусь тобой! 😎🔥',
                good: 'Очень даже неплохо! Чуть-чуть подтянуть — и будет вообще пушка! 🚀',
                average: 'Нормально, но я-то знаю, что это не твой предел. Давай, поднажми! 🔥',
                low: 'Не вешать нос! Это всего лишь цифры. Главное — сделать выводы и топить дальше! 🖤'
            },
            errors: {
                range: 'Значение должно быть между {min} и {max}.'
            },
            howCalculated: 'Как рассчитываются баллы?',
            docsTitle: 'Документация'
        }
    };

    // --- CORE: Store ---
    class Store {
        constructor(initialState = {}) {
            this.listeners = new Set();
            this.state = new Proxy(initialState, {
                set: (target, property, value) => {
                    target[property] = value;
                    this.notify(property, value);
                    return true;
                }
            });
        }

        subscribe(callback) {
            this.listeners.add(callback);
            return () => this.listeners.delete(callback);
        }

        notify(property, value) {
            this.listeners.forEach(listener => listener(this.state, property, value));
        }
    }

    const getInitialLanguage = () => {
        const saved = localStorage.getItem('lang');
        return saved || 'az';
    };

    const store = new Store({
        language: getInitialLanguage(),
        theme: localStorage.getItem('theme') || 'dark',
        activeGroup: null,
        results: null
    });

    store.subscribe((state, prop, value) => {
        if (prop === 'language') {
            localStorage.setItem('lang', value);
            // Update static content
            const t = TRANSLATIONS[value];
            const titleEl = document.querySelector('.title');
            const descEl = document.querySelector('.description');
            if (titleEl) titleEl.textContent = t.title;
            if (descEl) descEl.textContent = t.description;
        }
        if (prop === 'theme') {
            localStorage.setItem('theme', value);
            document.body.className = value === 'light' ? 'light-mode' : '';
        }
    });

    // Initialize static content on load
    document.addEventListener('DOMContentLoaded', () => {
        const t = TRANSLATIONS[store.state.language];
        const titleEl = document.querySelector('.title');
        const descEl = document.querySelector('.description');
        if (titleEl) titleEl.textContent = t.title;
        if (descEl) descEl.textContent = t.description;

        // Apply theme
        if (store.state.theme === 'light') document.body.className = 'light-mode';
    });

    // --- CORE: Component ---
    class Component {
        constructor(hostElement, props = {}) {
            this.host = hostElement;
            this.props = props;
            this.init();
        }
        init() { this.render(); }
        update(newProps = {}) {
            this.props = { ...this.props, ...newProps };
            this.render();
        }
        render() {
            if (this.host) {
                this.host.innerHTML = this.template();
                this.afterRender();
            }
        }
        template() { return ''; }
        afterRender() { }
    }

    // --- UTILITY: Haptic Feedback ---
    const vibrate = (duration = 10) => {
        if ('vibrate' in navigator) {
            navigator.vibrate(duration);
        }
    };

    // --- UTILITY: Sound Manager ---
    class SoundManager {
        constructor() {
            this.audioCtx = null;
            this.initialized = false;
        }

        init() {
            if (this.initialized) return;
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.audioCtx = new AudioContext();
                this.initialized = true;
            }
        }

        _ensureContext() {
            if (!this.initialized || !this.audioCtx) {
                this.init();
            }
            if (this.audioCtx && this.audioCtx.state === 'suspended') {
                this.audioCtx.resume().catch(() => { });
            }
            return this.audioCtx;
        }

        // 1. General Tap (Buttons, Tabs) - Soft, muted, "premium" feel
        playTap() {
            const ctx = this._ensureContext();
            if (!ctx) return;

            const t = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(300, t);
            osc.frequency.exponentialRampToValueAtTime(150, t + 0.1);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(800, t); // Cut off high frequencies for softness

            gain.gain.setValueAtTime(0.3, t);
            gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);

            osc.start(t);
            osc.stop(t + 0.1);
        }

        // 2. Switch/Toggle (Theme) - Crisp, snappy
        playSwitch() {
            const ctx = this._ensureContext();
            if (!ctx) return;

            const t = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'triangle'; // Brighter than sine
            osc.frequency.setValueAtTime(600, t);
            osc.frequency.linearRampToValueAtTime(800, t + 0.05); // Slight pitch up

            gain.gain.setValueAtTime(0.2, t);
            gain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(t);
            osc.stop(t + 0.05);
        }

        // 2.5 Pop (Language Toggle) - Cheerful, bubble-like
        playPop() {
            const ctx = this._ensureContext();
            if (!ctx) return;

            const t = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(400, t);
            osc.frequency.exponentialRampToValueAtTime(800, t + 0.1);

            gain.gain.setValueAtTime(0.3, t);
            gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(t);
            osc.stop(t + 0.1);
        }

        // 2.6 Blip (Group Selection) - Clean, techy selection
        playBlip() {
            const ctx = this._ensureContext();
            if (!ctx) return;

            const t = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, t);

            gain.gain.setValueAtTime(0, t);
            gain.gain.linearRampToValueAtTime(0.2, t + 0.02); // Quick fade in
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15); // Longer tail than tap

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(t);
            osc.stop(t + 0.15);
        }

        // 3. Tick (Steppers, Inputs) - Very subtle, barely audible
        playTick() {
            const ctx = this._ensureContext();
            if (!ctx) return;

            const t = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, t);

            gain.gain.setValueAtTime(0.1, t); // Very quiet
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(t);
            osc.stop(t + 0.03);
        }

        // 4. Success (Calculate) - Major chord chime
        playSuccess() {
            const ctx = this._ensureContext();
            if (!ctx) return;

            const t = ctx.currentTime;
            // C Major Triad: C5 (523.25), E5 (659.25), G5 (783.99)
            const freqs = [523.25, 659.25, 783.99];

            freqs.forEach((f, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.type = 'sine';
                osc.frequency.value = f;

                // Stagger start slightly for "strum" effect
                const start = t + (i * 0.05);

                gain.gain.setValueAtTime(0, start);
                gain.gain.linearRampToValueAtTime(0.2, start + 0.05);
                gain.gain.exponentialRampToValueAtTime(0.01, start + 0.8);

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start(start);
                osc.stop(start + 0.8);
            });
        }
    }

    const soundManager = new SoundManager();

    // Global Click Listener for Sounds
    document.addEventListener('click', (e) => {
        // Resume context on first interaction if needed
        soundManager.init();

        const target = e.target;

        // 0. Silence Footer
        if (target.closest('#footerContainer') || target.closest('footer')) {
            return;
        }

        // 1. Success / Calculate Button
        if (target.closest('#calculateButton')) {
            soundManager.playBlip();
            return;
        }

        // 2. Steppers / Inputs (Tick)
        if (target.closest('.stepper-btn') || target.tagName === 'INPUT') {
            soundManager.playTick();
            return;
        }

        // 3. Language Toggle (Pop)
        if (target.closest('#languageToggle, .lang-button')) {
            soundManager.playPop();
            return;
        }

        // 3.5 Group Selection (Blip)
        if (target.closest('.group-selector button, .button-group button')) { // Assuming class structure
            soundManager.playBlip();
            return;
        }

        // Fallback for Group Selector if classes above don't match exactly (checking previous code)
        // GroupSelector uses: <button data-group="..." class="btn ..." ...> inside #groupButtons
        if (target.closest('#groupButtons button')) {
            soundManager.playBlip();
            return;
        }

        // 4. Theme Switch (Switch)
        if (target.closest('.theme-switch')) {
            soundManager.playSwitch();
            return;
        }

        // 5. General Buttons (Tap)
        if (target.closest('button, .btn, .clickable') || (target.tagName === 'A' && target.href)) {
            soundManager.playTap();
        }
    });

    // --- SERVICE: Calculator ---
    class Calculator {
        static calculateScore(groupName, answers) {
            const safeAnswers = {};
            for (const [subject, data] of Object.entries(answers)) {
                safeAnswers[subject] = {
                    correct: Number(data.correct) || 0,
                    incorrect: Number(data.incorrect) || 0,
                    open: Number(data.open) || 0,
                    closed: Number(data.closed) || 0,
                    coding: Number(data.coding) || 0
                };
            }

            const results = {};

            if (groupName === 'I Qrup') {
                const riyaziyyat = safeAnswers['Riyaziyyat'];
                const fizika = safeAnswers['Fizika'];
                const kimya = safeAnswers['Kimya'];

                results['Riyaziyyat'] = 1.5 * 100 / 33 * ((riyaziyyat.correct - riyaziyyat.incorrect / 4) + (2 * riyaziyyat.open + riyaziyyat.coding));
                results['Fizika'] = 1.5 * 100 / 33 * ((fizika.correct - fizika.incorrect / 4) + (2 * fizika.open + fizika.coding));
                results['Kimya'] = 100 / 33 * ((kimya.correct - kimya.incorrect / 4) + (2 * kimya.open + kimya.coding));
            } else if (groupName === 'II Qrup') {
                const riyaziyyat = safeAnswers['Riyaziyyat'];
                const cografiya = safeAnswers['Coğrafiya'];
                const tarix = safeAnswers['Tarix'];

                results['Riyaziyyat'] = 1.5 * 100 / 33 * ((riyaziyyat.correct - riyaziyyat.incorrect / 4) + (2 * riyaziyyat.open + riyaziyyat.coding));
                results['Coğrafiya'] = 100 / 33 * ((cografiya.correct - cografiya.incorrect / 4) + (2 * cografiya.open + cografiya.coding));
                results['Tarix'] = 1.5 * 100 / 33 * ((tarix.correct - tarix.incorrect / 4) + (2 * tarix.open + tarix.coding));
            } else if (groupName === 'III Qrup') {
                const azDili = safeAnswers['Azərbaycan dili'];
                const edebiyyat = safeAnswers['Ədəbiyyat'];
                const tarix = safeAnswers['Tarix'];

                results['Azərbaycan dili'] = 1.5 * 100 / 33 * ((azDili.correct - azDili.incorrect / 4) + (2 * azDili.open + azDili.coding));
                results['Ədəbiyyat'] = 100 / 33 * ((edebiyyat.correct - edebiyyat.incorrect / 4) + (2 * edebiyyat.open + edebiyyat.coding));
                results['Tarix'] = 1.5 * 100 / 33 * ((tarix.correct - tarix.incorrect / 4) + (2 * tarix.open + tarix.coding));
            } else if (groupName === 'IV Qrup') {
                const biologiya = safeAnswers['Biologiya'];
                const kimya = safeAnswers['Kimya'];
                const fizika = safeAnswers['Fizika'];

                results['Biologiya'] = 1.5 * 100 / 33 * ((biologiya.correct - biologiya.incorrect / 4) + (2 * biologiya.open + biologiya.coding));
                results['Kimya'] = 1.5 * 100 / 33 * ((kimya.correct - kimya.incorrect / 4) + (2 * kimya.open + kimya.coding));
                results['Fizika'] = 100 / 33 * ((fizika.correct - fizika.incorrect / 4) + (2 * fizika.open + fizika.coding));
            } else if (groupName === 'Buraxılış İmtahanı') {
                const riyaziyyat = safeAnswers['Riyaziyyat'];
                const azDili = safeAnswers['Azərbaycan dili'];
                const ingilisDili = safeAnswers['İngilis dili'];

                results['Riyaziyyat'] = 25 / 8 * (2 * riyaziyyat.open + riyaziyyat.closed + riyaziyyat.coding);
                results['Azərbaycan dili'] = 2.5 * (2 * azDili.open + azDili.closed);
                results['İngilis dili'] = 100 / 37 * (2 * ingilisDili.open + ingilisDili.closed);
            }

            let total = 0;
            for (const score of Object.values(results)) {
                total += score;
            }
            results['Ümumi bal'] = total;
            return results;
        }
    }

    // --- COMPONENT: StarBackground (Cinematic Parallax) ---
    class StarBackground {
        constructor(containerId) {
            this.container = document.getElementById(containerId);
            this.canvas = document.createElement('canvas');
            this.ctx = this.canvas.getContext('2d');
            this.stars = [];
            this.mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
            this.targetMouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
            this.animationFrame = null;
            this.init();
        }

        init() {
            if (!this.container) return;

            // Setup Canvas
            this.container.innerHTML = '';
            this.container.appendChild(this.canvas);
            this.resize();

            // Create Stars
            this.createStars();

            // Event Listeners
            window.addEventListener('resize', () => this.resize());
            if (window.innerWidth > 800) {
                document.addEventListener('mousemove', (e) => {
                    this.targetMouse.x = e.clientX;
                    this.targetMouse.y = e.clientY;
                });
            }

            // Start Loop
            this.animate();
        }

        resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.createStars();
        }

        createStars() {
            this.stars = [];
            const starCount = (this.canvas.width * this.canvas.height) / 4000; // Minimal density
            for (let i = 0; i < starCount; i++) {
                this.stars.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    size: Math.random() * 1.5 + 0.5, // Small, sharp dots
                    depth: Math.random() * 2 + 0.5, // Depth factor for parallax
                    twinkleSpeed: Math.random() * 0.05 + 0.01,
                    twinklePhase: Math.random() * Math.PI * 2,
                    baseAlpha: Math.random() * 0.5 + 0.3
                });
            }
        }

        animate() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            // Theme Colors
            const isLight = document.body.classList.contains('light-mode');
            const starColor = isLight ? '30, 41, 59' : '255, 255, 255'; // Dark Slate vs White

            // Smooth Mouse Ease
            this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.05;
            this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.05;

            // Parallax Center
            const centerX = this.canvas.width / 2;
            const centerY = this.canvas.height / 2;

            this.stars.forEach((star) => {
                // Twinkle
                star.twinklePhase += star.twinkleSpeed;
                const twinkle = Math.sin(star.twinklePhase) * 0.3; // +/- opacity
                const alpha = Math.max(0.1, Math.min(1, star.baseAlpha + twinkle));

                // Parallax Offset
                // Stars with higher depth move LESS (further away), wait no, typical parallax:
                // Closer objects (higher depth value in this logic maybe?) move MORE.
                // Let's say depth 1 is baseline. Depth 2 is closer. Depth 0.5 is far.
                // Move opposite to mouse to simulate camera movement.
                const offsetX = (this.mouse.x - centerX) * (star.depth * 0.05);
                const offsetY = (this.mouse.y - centerY) * (star.depth * 0.05);

                const renderX = star.x - offsetX;
                const renderY = star.y - offsetY;

                // Draw
                this.ctx.fillStyle = `rgba(${starColor}, ${alpha})`;
                this.ctx.beginPath();
                this.ctx.arc(renderX, renderY, star.size, 0, Math.PI * 2);
                this.ctx.fill();
            });

            this.animationFrame = requestAnimationFrame(() => this.animate());
        }
    }

    // --- COMPONENT: Header ---
    class Header extends Component {
        constructor(host) {
            super(host);
            store.subscribe((state, prop) => {
                if (prop === 'language' || prop === 'theme') this.render();
            });
        }
        template() {
            const lang = store.state.language;
            const isLight = store.state.theme === 'light';
            const t = TRANSLATIONS[lang];
            return `
                <div class="header-controls-left">
                    <div class="theme-switch-wrapper">
                        <label class="theme-switch" for="checkbox">
                            <input type="checkbox" id="checkbox" ${isLight ? 'checked' : ''} />
                            <div class="slider round">
                                <i class="fas fa-sun"></i>
                                <i class="fas fa-moon"></i>
                            </div>
                        </label>
                        <span>Tema</span>
                    </div>
                </div>
                <div class="header-controls-right">
                    <button id="languageToggle" class="lang-button">
                        <i class="fas fa-globe"></i>
                        <span>${lang === 'az' ? 'AZ' : 'RU'}</span>
                    </button>
                </div>
            `;
        }
        afterRender() {
            this.host.querySelector('.theme-switch input').addEventListener('change', (e) => {
                vibrate(10);
                store.state.theme = e.target.checked ? 'light' : 'dark';
            });
            this.host.querySelector('#languageToggle').addEventListener('click', () => {
                vibrate(10);
                store.state.language = store.state.language === 'az' ? 'ru' : 'az';
            });
        }
    }

    // --- COMPONENT: Countdown ---
    class Countdown extends Component {
        constructor(host) {
            super(host);
            this.targetDate = new Date(APP_CONFIG.examDate).getTime();
            this.timer = null;
            store.subscribe((state, prop) => {
                if (prop === 'language') this.render();
            });
        }
        init() {
            this.render();
            this.startTimer();
        }
        startTimer() {
            if (this.timer) clearInterval(this.timer);
            this.timer = setInterval(() => this.updateTime(), 1000);
            this.updateTime();
        }
        updateTime() {
            const now = new Date().getTime();
            const distance = this.targetDate - now;
            if (distance < 0) {
                clearInterval(this.timer);
                const t = TRANSLATIONS[store.state.language];
                if (this.host) this.host.innerHTML = `<div class="exam-started">${t.examStarted}</div>`;
                return;
            }
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            const elDays = this.host.querySelector('#days');
            if (elDays) {
                elDays.innerText = String(days).padStart(2, '0');
                this.host.querySelector('#hours').innerText = String(hours).padStart(2, '0');
                this.host.querySelector('#minutes').innerText = String(minutes).padStart(2, '0');
                this.host.querySelector('#seconds').innerText = String(seconds).padStart(2, '0');
            }
        }
        template() {
            const t = TRANSLATIONS[store.state.language];
            return `
                <div class="countdown-numbers">
                    <span id="days">00</span>
                    <span id="hours">00</span>
                    <span id="minutes">00</span>
                    <span id="seconds">00</span>
                </div>
                <div class="countdown-labels">
                    <span>${t.days.toUpperCase()}</span>
                    <span>${t.hours.toUpperCase()}</span>
                    <span>${t.minutes.toUpperCase()}</span>
                    <span>${t.seconds.toUpperCase()}</span>
                </div>
            `;
        }
    }

    // --- COMPONENT: GroupSelector ---
    class GroupSelector extends Component {
        constructor(host) {
            super(host);
            store.subscribe((state, prop) => {
                if (prop === 'activeGroup' || prop === 'language') this.render();
            });
        }
        template() {
            const lang = store.state.language;
            const currentGroup = store.state.activeGroup;
            const t = TRANSLATIONS[lang];
            return GROUPS.map(group => `
                <button 
                    data-group="${group.name}"
                    class="btn ${currentGroup === group.name ? 'active' : ''}"
                    type="button"
                >
                    ${t.groups[group.name]}
                </button>
            `).join('');
        }
        afterRender() {
            this.host.querySelectorAll('button').forEach(btn => {
                btn.addEventListener('click', () => {
                    vibrate(10);
                    const newGroup = btn.dataset.group;
                    const currentGroup = store.state.activeGroup;

                    if (currentGroup === newGroup) {
                        store.state.activeGroup = null; // Toggle off
                        store.state.results = null;
                        // No scroll needed when closing
                    } else {
                        store.state.activeGroup = newGroup;
                        store.state.results = null;
                        setTimeout(() => {
                            const form = document.getElementById('examFormContainer');
                            if (form) form.scrollIntoView({ behavior: 'smooth' });
                        }, 300); // Increased delay slightly for animation start
                    }
                });
            });
        }
    }

    // --- COMPONENT: ExamForm ---
    class ExamForm extends Component {
        constructor(host) {
            super(host);
            store.subscribe((state, prop) => {
                if (prop === 'activeGroup' || prop === 'language') this.render();
            });
        }
        render() {
            // Override default render to handle animation state
            const groupName = store.state.activeGroup;
            const container = this.host;

            if (!groupName) {
                // Collapse
                if (container) container.classList.remove('visible');
                // Do NOT clear innerHTML immediately to allow animation
                return;
            }

            // Expand
            // Only update innerHTML if logic requires it (re-render)
            // But here we re-render always on update to ensure form is fresh
            if (container) {
                container.innerHTML = this.template();
                container.classList.add('visible');
                this.afterRender();
            }
        }

        template() {
            const lang = store.state.language;
            const t = TRANSLATIONS[lang];
            const groupName = store.state.activeGroup;

            // If we are strictly calling template(), we need a group (or default to something if we want persistence, 
            // but normally render() protects us. 
            // However, render() calls template() only when groupName exists now.

            if (!groupName) return '';

            const group = GROUPS.find(g => g.name === groupName);
            return `
                <div class="exam-form-wrapper">
                    <div class="form-container">
                        <h2 class="group-title">${t.groups[groupName]}</h2>
                        <form id="scoreForm">
                            ${group.subjects.map((subject, index) => this.renderSubject(subject, index, group, t)).join('')}
                        </form>
                        <button id="calculateButton" class="btn">${t.calculate}</button>
                    </div>
                </div>
            `;
        }
        renderSubject(subject, index, group, t) {
            const isBuraxilish = group.name === 'Buraxılış İmtahanı';
            let inputs = '';

            const createInput = (label, name, max) => `
                <label>
                    ${label}:
                    <div class="stepper-wrapper">
                        <button type="button" class="stepper-btn minus" tabindex="-1">−</button>
                        <input type="number" name="${name}" min="0" max="${max}" class="input-field" placeholder="0">
                        <button type="button" class="stepper-btn plus" tabindex="-1">+</button>
                    </div>
                    <span class="error-message"></span>
                </label>
            `;

            if (isBuraxilish) {
                const maxClosed = subject === 'İngilis dili' ? 23 : (subject === 'Azərbaycan dili' ? 20 : 13);
                const maxOpen = subject === 'İngilis dili' ? 7 : (subject === 'Azərbaycan dili' ? 10 : 7);

                inputs = `<div class="input-group">
                    ${createInput(t.closed, `${subject}-closed`, maxClosed)}
                    ${createInput(t.open, `${subject}-open`, maxOpen)}
                `;

                if (subject === 'Riyaziyyat') {
                    inputs += createInput(t.coding, `${subject}-coding`, 5);
                }
                inputs += '</div>';
            } else {
                inputs = `<div class="input-group">
                    ${createInput(t.correct, `${subject}-correct`, 22)}
                    ${createInput(t.incorrect, `${subject}-incorrect`, 22)}
                    ${createInput(t.coding, `${subject}-coding`, 5)}
                    ${createInput(t.open, `${subject}-open`, 3)}
                </div>`;
            }
            return `
                <div class="subject">
                    <h3>${t.subjects[subject]} (${group.maxScores[index]} ${t.score})</h3>
                    ${inputs}
                </div>
            `;
        }
        afterRender() {
            if (!store.state.activeGroup) return;

            // Validation
            this.host.querySelectorAll('.input-field').forEach(input => {
                input.addEventListener('input', (e) => this.validate(e.target));
            });

            // Stepper Logic with Hold-to-Increment
            this.host.querySelectorAll('.stepper-btn').forEach(btn => {
                let holdInterval = null;
                let holdTimeout = null;
                let incrementSpeed = 150; // Initial speed in ms

                const updateValue = () => {
                    const input = btn.parentElement.querySelector('input');
                    const isPlus = btn.classList.contains('plus');
                    const min = parseInt(input.min) || 0;
                    const max = parseInt(input.max) || 100;
                    let val = parseInt(input.value) || 0;

                    if (isPlus) {
                        if (val < max) {
                            val++;
                            vibrate(5);
                        }
                    } else {
                        if (val > min) {
                            val--;
                            vibrate(5);
                        }
                    }

                    input.value = val;
                    this.validate(input);
                };

                const startHold = () => {
                    updateValue(); // Immediate first increment
                    incrementSpeed = 150;

                    holdTimeout = setTimeout(() => {
                        holdInterval = setInterval(() => {
                            updateValue();
                            // Accelerate over time
                            if (incrementSpeed > 50) {
                                incrementSpeed -= 10;
                                clearInterval(holdInterval);
                                holdInterval = setInterval(updateValue, incrementSpeed);
                            }
                        }, incrementSpeed);
                    }, 300); // Delay before continuous increment starts
                };

                const stopHold = () => {
                    if (holdTimeout) clearTimeout(holdTimeout);
                    if (holdInterval) clearInterval(holdInterval);
                    holdTimeout = null;
                    holdInterval = null;
                    incrementSpeed = 150;
                };

                // Mouse/Touch events
                btn.addEventListener('pointerdown', (e) => {
                    e.preventDefault();
                    startHold();
                });

                btn.addEventListener('pointerup', stopHold);
                btn.addEventListener('pointerleave', stopHold);
                btn.addEventListener('pointercancel', stopHold);
            });

            const form = this.host.querySelector('form');
            if (form) form.addEventListener('submit', e => e.preventDefault());

            const btn = this.host.querySelector('#calculateButton');
            if (btn) {
                // Ensure type is button to prevent accidental submits if moved inside form
                btn.type = 'button';
                btn.addEventListener('click', () => {
                    vibrate(15); // Haptic feedback
                    const formData = new FormData(this.host.querySelector('form'));
                    const answers = {};
                    for (const [key, value] of formData.entries()) {
                        const [subject, type] = key.split('-');
                        if (!answers[subject]) answers[subject] = {};
                        answers[subject][type] = value;
                    }
                    const results = Calculator.calculateScore(store.state.activeGroup, answers);
                    store.state.results = results;
                    setTimeout(() => {
                        const resDiv = document.getElementById('resultsContainer');
                        if (resDiv) resDiv.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                });
            }
        }
        validate(input) {
            const min = parseInt(input.min);
            const max = parseInt(input.max);
            const value = parseInt(input.value);
            // Fix: Error message is now outside the stepper-wrapper, inside the label
            const errorSpan = input.closest('label').querySelector('.error-message');
            const t = TRANSLATIONS[store.state.language];

            if (errorSpan) {
                if (!isNaN(value) && (value < min || value > max)) {
                    errorSpan.textContent = t.errors.range.replace('{min}', min).replace('{max}', max);
                } else {
                    errorSpan.textContent = '';
                }
            }
        }
    }

    // --- COMPONENT: Results ---
    class Results extends Component {
        constructor(host) {
            super(host);
            store.subscribe((state, prop) => {
                if (prop === 'results' || prop === 'activeGroup' || prop === 'language') this.render();
            });
        }
        template() {
            if (!store.state.results) return '';
            const t = TRANSLATIONS[store.state.language];
            const results = store.state.results;

            let rows = '';
            for (const [subject, score] of Object.entries(results)) {
                if (subject === 'Ümumi bal') continue;
                rows += `
                    <tr>
                        <td>${t.subjects[subject] || subject}</td>
                        <td>${score.toFixed(1)}</td>
                    </tr>
                `;
            }
            // Total Row
            rows += `
                <tr class="total">
                    <td>${t.score}</td>
                    <td>${results['Ümumi bal'].toFixed(1)}</td>
                </tr>
            `;

            return `
                <div class="results-container">
                    <h2 class="results-title">${t.results}</h2>
                    <div class="result-message show">
                        ${this.getMessage(results['Ümumi bal'])}
                    </div>
                    <table id="resultsTable">
                        <thead>
                            <tr>
                                <th>${t.subject}</th>
                                <th>${t.score}</th>
                            </tr>
                        </thead>
                        <tbody>${rows}</tbody>
                    </table>
                    <div class="button-group">
                        <button id="downloadButton" class="btn btn-secondary"><i class="fas fa-download"></i> ${t.saveResults}</button>
                        <button id="recalculateButton" class="btn"><i class="fas fa-redo"></i> ${t.recalculate}</button>
                    </div>
                </div>
            `;
        }
        getMessage(totalScore) {
            const lang = store.state.language;
            const groupKey = store.state.activeGroup;
            const ranges = SCORE_RANGES[groupKey]?.ranges || [];
            let level = 'low';
            for (const range of ranges) {
                if (totalScore >= range.min && totalScore <= range.max) {
                    level = range.level;
                    break;
                }
            }
            const msg = TRANSLATIONS[lang].messages[level];
            const gif = RESULT_GIFS[level];
            return `<img src="${gif}" class="result-gif" alt="${level}" /><p>${msg}</p>`;
        }
        afterRender() {
            if (!store.state.results) return;
            this.host.querySelector('#recalculateButton').addEventListener('click', () => {
                vibrate(10);
                store.state.results = null;
                store.state.answers = null;
                document.getElementById('examFormContainer').scrollIntoView({ behavior: 'smooth' });
            });
            this.host.querySelector('#downloadButton').addEventListener('click', () => {
                vibrate(15);
                this.download();
            });
        }
        download() {
            const results = store.state.results;
            const answers = store.state.answers;
            const group = store.state.activeGroup;
            const lang = store.state.language;
            const t = TRANSLATIONS[lang];
            const date = new Date().toLocaleString(lang === 'az' ? 'az-AZ' : 'ru-RU');

            const groupName = t.groups[group];
            const totalScore = results['Ümumi bal'].toFixed(1);

            let text = `=== İMTAHAN NƏTİCƏLƏRİ ===\n`;
            text += `Tarix: ${date}\n`;
            text += `Qrup: ${groupName}\n`;
            text += `Ümumi Bal: ${totalScore}\n`;
            text += `--------------------------------\n`;

            for (const [subject, score] of Object.entries(results)) {
                if (subject === 'Ümumi bal') continue;
                const subjName = t.subjects[subject] || subject;
                text += `\n[${subjName.toUpperCase()}]\n`;
                text += `Bal: ${score.toFixed(1)}\n`;

                if (answers && answers[subject]) {
                    const ans = answers[subject];
                    if (ans.correct) text += `- Doğru: ${ans.correct}\n`;
                    if (ans.incorrect) text += `- Yanlış: ${ans.incorrect}\n`;
                    if (ans.closed) text += `- Qapalı: ${ans.closed}\n`;
                    if (ans.open) text += `- Açıq: ${ans.open}\n`;
                    if (ans.coding) text += `- Kodlaşdırma: ${ans.coding}\n`;
                }
            }

            text += `\n--------------------------------\n`;
            text += `calculator.abusov.com`;

            const blob = new Blob([text], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            // Format date for filename: YYYY-MM-DD
            const now = new Date();
            const dateStr = now.toLocaleDateString('az-AZ').split('/').reverse().join('-');
            a.download = `nəticəm-${dateStr}.txt`;
            a.click();
            URL.revokeObjectURL(url);
        }
    }

    // --- COMPONENT: Footer ---
    class Footer extends Component {
        template() {
            const lang = store.state.language;
            const t = TRANSLATIONS[lang];
            return `
                <div class="footer-content">
                    <span class="footer-text">made by <a href="https://abusov.com" target="_blank" rel="noopener">abusoww</a> with 🤍</span>
                    <span class="footer-separator">|</span>
                    <button type="button" id="changelogBtn" class="footer-link-btn">changelog</button>
                    <span class="footer-separator">|</span>
                    <button type="button" id="docsBtn" class="footer-link-btn">${t.howCalculated}</button>
                </div>
            `;
        }
        afterRender() {
            // Event handled globally for robustness
            // Re-render on language change to update button text
            const btn = this.host.querySelector('#docsBtn');
            if (btn) {
                const lang = store.state.language;
                btn.textContent = TRANSLATIONS[lang].howCalculated;
            }
        }
    }

    // --- COMPONENT: ChangelogModal ---
    class ChangelogModal extends Component {
        get changelog() {
            return [
                {
                    version: 'v2.0.0',
                    date: '2025-12-10',
                    changes: [
                        'Made some major UI tweaks',
                        'Language auto-detection from browser',
                        'Haptic feedback for mobile interactions',
                        'Implemented stepper buttons',
                        'Implemented changelog timeline'
                    ]
                },
                {
                    version: 'v1.0.0',
                    date: '2025-01-06',
                    changes: [
                        'Initial modern calculator release',
                        'Support for all exam groups',
                        'Dark/Light theme toggle',
                        'Azerbaijani and Russian languages',
                        'Countdown timer to exam date'
                    ]
                }
            ];
        }

        template() {
            // Helper to add icons based on content
            const getIcon = (text) => {
                if (text.toLowerCase().includes('fix')) return '🔧';
                if (text.toLowerCase().includes('add') || text.toLowerCase().includes('new')) return '✨';
                if (text.toLowerCase().includes('improv') || text.toLowerCase().includes('optimiz')) return '🚀';
                if (text.toLowerCase().includes('remov')) return '🗑️';
                return '🔹';
            };

            const changelogItems = this.changelog.map((entry, index) => `
                <div class="timeline-item" style="animation-delay: ${index * 0.1}s">
                    <div class="timeline-content">
                        <div class="version-tag">${entry.version}</div>
                        <div class="version-date">${entry.date}</div>
                        <ul class="changelog-list">
                            ${entry.changes.map(change => `
                                <li>
                                    <span class="change-icon">${getIcon(change)}</span>
                                    <span class="change-text">${change}</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
            `).join('');

            return `
                <div class="modal-overlay">
                    <div class="modal-content premium-modal">
                        <div class="modal-hero">
                            <div class="hero-blobs">
                                <div class="blob blob-1"></div>
                                <div class="blob blob-2"></div>
                            </div>
                            <div class="hero-text">
                                <h2>What's New</h2>
                                <p>Latest features & improvements</p>
                            </div>
                            <button type="button" class="modal-close" aria-label="Close">&times;</button>
                        </div>
                        <div class="modal-body">
                            <div class="timeline-feed">
                                ${changelogItems}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        afterRender() {
            const overlay = this.host.querySelector('.modal-overlay');
            const closeBtn = this.host.querySelector('.modal-close');

            const closeModal = () => {
                vibrate(10);
                this.host.classList.remove('active');
            };

            if (closeBtn) {
                closeBtn.addEventListener('click', closeModal);
            }


            if (overlay) {
                overlay.addEventListener('click', (e) => {
                    if (e.target === overlay) closeModal();
                });
            }

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.host.classList.contains('active')) {
                    closeModal();
                }
            });
        }
    }

    // --- COMPONENT: DocumentationModal ---
    class DocumentationModal extends Component {
        get documents() {
            return [
                { name: 'I Qrup', file: 'dim-1-qrup-ballari-hesablama.pdf' },
                { name: 'II Qrup', file: 'dim-2-qrup-ballari-hesablama.pdf' },
                { name: 'III Qrup', file: 'dim-3-qrup-ballari-hesablama.pdf' },
                { name: 'IV Qrup', file: 'dim-4-qrup-ballari-hesablama.pdf' },
                { name: '9-cu Sinif Buraxılış', file: 'dim-9-buraxilis-imtahani-ballari-hesablama.pdf' },
                { name: '11-ci Sinif Buraxılış', file: 'dim-11-buraxilis-imtahani-ballari-hesablama.pdf' }
            ];
        }

        template() {
            const lang = store.state.language;
            const t = TRANSLATIONS[lang];

            const docItems = this.documents.map((doc, index) => `
                <div class="timeline-item" style="animation-delay: ${index * 0.1}s">
                     <div class="timeline-content">
                        <div class="doc-item">
                            <i class="fas fa-file-pdf doc-icon"></i>
                            <a href="${APP_CONFIG.docsBaseUrl}${doc.file}" target="_blank" class="doc-link">${doc.name}</a>
                        </div>
                    </div>
                </div>
            `).join('');

            return `
                <div class="modal-overlay">
                    <div class="modal-content premium-modal">
                        <div class="modal-hero">
                             <div class="hero-blobs">
                                <div class="blob blob-1"></div>
                                <div class="blob blob-3"></div>
                            </div>
                            <div class="hero-text">
                                <h2>${t.docsTitle}</h2>
                                <p>${t.howCalculated}</p>
                            </div>
                            <button type="button" class="modal-close" aria-label="Close">&times;</button>
                        </div>
                        <div class="modal-body">
                             <div class="timeline-feed">
                                ${docItems}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        afterRender() {
            const overlay = this.host.querySelector('.modal-overlay');
            const closeBtn = this.host.querySelector('.modal-close');

            const closeModal = () => {
                vibrate(10);
                this.host.classList.remove('active');
            };

            if (closeBtn) closeBtn.addEventListener('click', closeModal);
            if (overlay) overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.host.classList.contains('active')) closeModal();
            });
        }
    }

    // --- INITIALIZATION ---
    document.addEventListener('DOMContentLoaded', () => {
        const theme = store.state.theme;
        if (theme === 'light') document.body.classList.add('light-mode');

        new StarBackground('stars');
        new Header(document.querySelector('.header-controls'));
        new Countdown(document.querySelector('.countdown-container'));
        new GroupSelector(document.getElementById('groupButtons'));
        new ExamForm(document.getElementById('examFormContainer'));
        new Results(document.getElementById('resultsContainer'));
        new Footer(document.getElementById('footerContainer'));
        new ChangelogModal(document.getElementById('changelogModal'));
        new DocumentationModal(document.getElementById('docsModal'));

        // Entry Animations
        const elementsToAnimate = [
            document.querySelector('.header-controls'),
            document.querySelector('.title'),
            document.querySelector('.description'),
            document.querySelector('.countdown-container'),
            document.getElementById('groupButtons'),
            document.getElementById('footerContainer') // Also animate footer
        ];

        elementsToAnimate.forEach((el, index) => {
            if (el) {
                el.classList.add('animate-appear');
                el.style.animationDelay = `${index * 100}ms`;
            }
        });

        // Global Handler for Changelog (Robust Fix)
        // Global Handler for Changelog (Robust Fix)
        // Global Handler for Changelog (Robust Fix)
        document.addEventListener('click', (e) => {
            // Changelog
            const changeBtn = e.target.closest('#changelogBtn');
            if (changeBtn) {
                e.preventDefault(); e.stopPropagation();
                try { if (typeof vibrate === 'function') vibrate(10); } catch (err) { }
                const modal = document.getElementById('changelogModal');
                if (modal) modal.classList.add('active');
            }

            // Docs
            const docsBtn = e.target.closest('#docsBtn');
            if (docsBtn) {
                e.preventDefault(); e.stopPropagation();
                try { if (typeof vibrate === 'function') vibrate(10); } catch (err) { }
                const modal = document.getElementById('docsModal');
                if (modal) modal.classList.add('active');
            }
        });

        // --- ANALYTICS: Umami ---
        const trackEvent = (event, data = {}) => {
            if (typeof umami !== 'undefined' && typeof umami.track === 'function') {
                umami.track(event, data);
            }
        };

        trackEvent('Page Load');

        // Track Theme Change
        const themeSwitch = document.querySelector('.theme-switch input');
        if (themeSwitch) {
            themeSwitch.addEventListener('change', (e) => {
                trackEvent('Theme Changed', { theme: e.target.checked ? 'light' : 'dark' });
            });
        }

        // Track Language Change
        const langBtn = document.getElementById('languageToggle');
        if (langBtn) {
            langBtn.addEventListener('click', () => {
                // Determine new language (it toggles, so if current is az, new is ru)
                const newLang = store.state.language === 'az' ? 'ru' : 'az';
                document.documentElement.lang = newLang; // Update DOM for CSS targeting
                // Note: state updates after click, but we want to track the *action* of changing
                trackEvent('Language Changed', { language: newLang });
            });
        }

        // Track Form Abandonment
        window.addEventListener('beforeunload', () => {
            if (store.state.activeGroup && !store.state.results) {
                trackEvent('User Abandoned Form', { group: store.state.activeGroup });
            }
        });

        document.addEventListener('click', (e) => {
            // Group Selected
            const groupBtn = e.target.closest('#groupButtons .btn');
            if (groupBtn) {
                const groupName = groupBtn.dataset.group || groupBtn.textContent.trim();
                trackEvent('Group Selected', { group: groupName });
            }

            // Calculate
            if (e.target.closest('#calculateButton')) {
                trackEvent('Calculate Button Clicked');
            }

            // Results Downloaded
            if (e.target.closest('#downloadButton')) {
                trackEvent('Results Downloaded');
            }

            // Form Reset (renamed from Recalculate)
            if (e.target.closest('#recalculateButton')) {
                trackEvent('Form Reset');
            }

            // Changelog Opened
            if (e.target.closest('#changelogBtn')) {
                trackEvent('Changelog Opened');
            }

            // Docs Opened
            if (e.target.closest('#docsBtn')) {
                trackEvent('Docs Opened');
            }

            // Link Tracking
            const link = e.target.closest('a');
            if (link) {
                const href = link.href;

                // Author Website
                if (href.includes('abusov.com')) {
                    trackEvent('Author Link Clicked');
                }
                // Documentation PDFs
                else if (href.includes('/legacy/')) {
                    const fileName = href.split('/').pop();
                    trackEvent('Document Clicked', { file: fileName });
                }
                // Other Links
                else {
                    trackEvent('Link Clicked', { url: href });
                }
            }
        });

    });

})();
