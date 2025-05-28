const examDate = new Date('2025-06-01T10:00:00').getTime();

const groups = [
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
        maxScores: [100, 150, 100]
    },
    { 
        name: 'Buraxılış İmtahanı', 
        subjects: ['Riyaziyyat', 'Azərbaycan dili', 'İngilis dili'],
        maxScores: [100, 100, 100]
    },
];

class AppState {
    constructor() {
        this.activeGroup = null;
        this.results = null;
        this.language = 'az';
    }

    setActiveGroup(group) {
        this.activeGroup = group;
        this.notifyListeners('activeGroup');
    }

    setResults(results) {
        this.results = results;
        this.notifyListeners('results');
    }

    setLanguage(language) {
        this.language = language;
        this.notifyListeners('language');
    }

    // Add observer pattern
    addListener(callback) {
        this.listeners.push(callback);
    }

    notifyListeners(property) {
        this.listeners.forEach(listener => listener(property));
    }
}

const appState = new AppState();

let activeGroup = null;
let results = null;
let language = 'az';

const translations = {
    az: {
        title: 'İmtahan Ballarını Hesablama',
        description: 'Doğru, yanlış, açıq və qapalı suallar haqqında məlumat daxil edərək ballarınızı hesablaya bilrsiniz.',
        calculate: 'Hesabla!',
        results: 'Nəticələr:',
        subject: 'Fənn',
        score: 'Bal',
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
        }
    },
    ru: {
        title: 'Калькулятор баллов экзамена',
        description: 'Вы можете рассчитать свои баллы, введя информацию о правильных, неправильных, открытых и закрытых вопросах.',
        calculate: 'Рассчитать',
        results: 'Результаты',
        subject: 'Предмет',
        score: 'Балл',
        saveResults: 'Сохранить результаты',
        recalculate: 'Пересчитать',
        correct: 'Правильно (Закрытые)',
        incorrect: 'Неправильно (Закрытые)',
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
            'Azərbaycan dili': 'Азербайджанский язык',
            'Ədəbiyyat': 'Литература',
            'İngilis dili': 'Английский язык',
            'Ümumi bal': 'Общий балл'
        }
    }
};

// Объект с интервалами баллов для каждой группы
const scoreRanges = {
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
        max: 350,
        ranges: [
            { min: 300, max: 350, level: 'excellent' },
            { min: 200, max: 299, level: 'good' },
            { min: 150, max: 199, level: 'average' },
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

// Сообщения для каждого уровня результатов
const resultMessages = {
    excellent: {
        az: {
            'I Qrup': {
                text: 'Siz bunu bacardınız! 🎉',
                gif: 'https://i.ibb.co/MGtjf0b/4giphy.gif'
            },
            'II Qrup': {
                text: 'Siz bunu bacardınız! 🎉',
                gif: 'https://i.ibb.co/MGtjf0b/4giphy.gif'
            },
            'III Qrup': {
                text: 'Siz bunu bacardınız! 🎉',
                gif: 'https://i.ibb.co/MGtjf0b/4giphy.gif'
            },
            'IV Qrup': {
                text: 'Siz bunu bacardınız! 🎉',
                gif: 'https://i.ibb.co/MGtjf0b/4giphy.gif'
            },
            'Buraxılış İmtahanı': {
                text: 'Siz bunu bacardınız! 🎉',
                gif: 'https://i.ibb.co/MGtjf0b/4giphy.gif'
            }
        },
        ru: {
            'I Qrup': {
                text: 'Поздравляем! Отличная работа! 🎉',
                gif: 'https://i.ibb.co/MGtjf0b/4giphy.gif'
            },
            'II Qrup': {
                text: 'Поздравляем! Отличная работа! 🎉',
                gif: 'https://i.ibb.co/MGtjf0b/4giphy.gif'
            },
            'III Qrup': {
                text: 'Поздравляем! Отличная работа! 🎉',
                gif: 'https://i.ibb.co/MGtjf0b/4giphy.gif'
            },
            'IV Qrup': {
                text: 'Поздравляем! Отличная работа! 🎉',
                gif: 'https://i.ibb.co/MGtjf0b/4giphy.gif'
            },
            'Buraxılış İmtahanı': {
                text: 'Поздравляем! Отличная работа! 🎉',
                gif: 'https://i.ibb.co/MGtjf0b/4giphy.gif'
            }
        }
    },
    good: {
        az: {
            'I Qrup': {
                text: 'Potensialınız var! 📈',
                gif: 'https://i.ibb.co/PZ6L2ZV/3giphy.gif'
            },
            'II Qrup': {
                text: 'Potensialınız var! 📈',
                gif: 'https://i.ibb.co/PZ6L2ZV/3giphy.gif'
            },
            'III Qrup': {
                text: 'Potensialınız var! 📈',
                gif: 'https://i.ibb.co/PZ6L2ZV/3giphy.gif'
            },
            'IV Qrup': {
                text: 'Potensialınız var! 📈',
                gif: 'https://i.ibb.co/PZ6L2ZV/3giphy.gif'
            },
            'Buraxılış İmtahanı': {
                text: 'Potensialınız var! 📈',
                gif: 'https://i.ibb.co/PZ6L2ZV/3giphy.gif'
            }
        },
        ru: {
            'I Qrup': {
                text: 'У вас есть потенциал! 📈',
                gif: 'https://i.ibb.co/PZ6L2ZV/3giphy.gif'
            },
            'II Qrup': {
                text: 'У вас есть потенциал! 📈',
                gif: 'https://i.ibb.co/PZ6L2ZV/3giphy.gif'
            },
            'III Qrup': {
                text: 'У вас есть потенциал! 📈',
                gif: 'https://i.ibb.co/PZ6L2ZV/3giphy.gif'
            },
            'IV Qrup': {
                text: 'У вас есть потенциал! 📈',
                gif: 'https://i.ibb.co/PZ6L2ZV/3giphy.gif'
            },
            'Buraxılış İmtahanı': {
                text: 'У вас есть потенциал! 📈',
                gif: 'https://i.ibb.co/PZ6L2ZV/3giphy.gif'
            }
        }
    },
    average: {
        az: {
            'I Qrup': {
                text: 'Daha yaxşı nəticə göstərə bilərsiniz! 💪',
                gif: 'https://i.ibb.co/SdJMfcj/2giphy.gif'
            },
            'II Qrup': {
                text: 'Daha yaxşı nəticə göstərə bilərsiniz! 💪',
                gif: 'https://giphy.com/embed/l46CyJmS9KUbokzsI'
            },
            'III Qrup': {
                text: 'Daha yaxşı nəticə göstərə bilərsiniz! 💪',
                gif: 'https://i.ibb.co/SdJMfcj/2giphy.gif'
            },
            'IV Qrup': {
                text: 'Daha yaxşı nəticə göstərə bilərsiniz! 💪',
                gif: 'https://i.ibb.co/SdJMfcj/2giphy.gif'
            },
            'Buraxılış İmtahanı': {
                text: 'Daha yaxşı nəticə göstərə bilərsiniz! 💪',
                gif: 'https://i.ibb.co/SdJMfcj/2giphy.gif'
            }
        },
        ru: {
            'I Qrup': {
                text: 'Вы можете показать лучший результат! 💪',
                gif: 'https://i.ibb.co/SdJMfcj/2giphy.gif'
            },
            'II Qrup': {
                text: 'Вы можете показать лучший результат! 💪',
                gif: 'https://i.ibb.co/SdJMfcj/2giphy.gif'
            },
            'III Qrup': {
                text: 'Вы можете показать лучший результат! 💪',
                gif: 'https://i.ibb.co/SdJMfcj/2giphy.gif'
            },
            'IV Qrup': {
                text: 'Вы можете показать лучший результат! 💪',
                gif: 'https://i.ibb.co/SdJMfcj/2giphy.gif'
            },
            'Buraxılış İmtahanı': {
                text: 'Вы можете показать лучший результат! 💪',
                gif: 'https://i.ibb.co/SdJMfcj/2giphy.gif'
            }
        }
    },
    low: {
        az: {
            'I Qrup': {
                text: 'Əlavə hazırlıq lazımdır! 📈',
                gif: 'https://i.ibb.co/p0JJNY7/low.gif'
            },
            'II Qrup': {
                text: 'Əlavə hazırlıq lazımdır! 📈',
                gif: 'https://i.ibb.co/p0JJNY7/low.gif'
            },
            'III Qrup': {
                text: 'Əlavə hazırlıq lazımdır! 📈',
                gif: 'https://i.ibb.co/p0JJNY7/low.gif'
            },
            'IV Qrup': {
                text: 'Əlavə hazırlıq lazımdır! 📈',
                gif: 'https://i.ibb.co/p0JJNY7/low.gif'
            },
            'Buraxılış İmtahanı': {
                text: 'Əlavə hazırlıq lazımdır! 📈',
                gif: 'https://i.ibb.co/p0JJNY7/low.gif'
            }
        },
        ru: {
            'I Qrup': {
                text: 'Требуется дополнительная подготовка! 📈',
                gif: 'https://i.ibb.co/p0JJNY7/low.gif'
            },
            'II Qrup': {
                text: 'Требуется дополнительная подготовка! 📈',
                gif: 'https://i.ibb.co/p0JJNY7/low.gif'
            },
            'III Qrup': {
                text: 'Требуется дополнительная подготовка! 📈',
                gif: 'https://i.ibb.co/p0JJNY7/low.gif'
            },
            'IV Qrup': {
                text: 'Требуется дополнительная подготовка! 📈',
                gif: 'https://i.ibb.co/p0JJNY7/low.gif'
            },
            'Buraxılış İmtahanı': {
                text: 'Требуется дополнительная подготовка! 📈',
                gif: 'https://i.ibb.co/p0JJNY7/low.gif'
            }
        }
    }
};

class ScoreCalculator {
    static calculateGroupScores(group, answers) {
        switch(group.name) {
            case 'I Qrup':
                return this.calculateFirstGroupScores(answers);
            case 'II Qrup':
                return this.calculateSecondGroupScores(answers);
            // ... other groups
        }
    }

    static calculateFirstGroupScores(answers) {
        const scores = {};
        const subjects = ['Riyaziyyat', 'Fizika', 'Kimya'];
        
        subjects.forEach(subject => {
            const answer = answers[subject];
            scores[subject] = this.calculateSubjectScore(answer, subject);
        });

        return scores;
    }

    static calculateSubjectScore(answer, subject) {
        const { correct, incorrect, open, coding } = answer;
        return (1.5 * 100/33) * ((correct - incorrect/4) + (2*open + coding));
    }
}

class UIManager {
    static updateLanguage(translations, language) {
        const elements = {
            title: '.title',
            description: '.description',
            calculateButton: '#calculateButton',
            // ... other elements
        };

        Object.entries(elements).forEach(([key, selector]) => {
            const element = document.querySelector(selector);
            if (element && translations[language][key]) {
                element.textContent = translations[language][key];
            }
        });
    }

    static displayResults(results, translations, language) {
        const tableBody = document.querySelector('#resultsTable tbody');
        tableBody.innerHTML = '';

        Object.entries(results).forEach(([subject, score], index) => {
            const row = this.createResultRow(subject, score, translations[language]);
            row.style.animation = `fadeIn 0.5s ease ${index * 0.1}s forwards`;
            tableBody.appendChild(row);
        });
    }
}

class EventHandler {
    static initializeEventListeners() {
        document.getElementById('calculateButton')
            .addEventListener('click', this.handleCalculate);
        
        document.getElementById('languageToggle')
            .addEventListener('click', this.handleLanguageToggle);
        
        // ... other event listeners
    }

    static handleCalculate() {
        const scores = ScoreCalculator.calculateGroupScores(
            appState.activeGroup,
            this.getAnswers()
        );
        appState.setResults(scores);
        UIManager.displayResults(scores, translations, appState.language);
    }
}

function init() {
    createStars();
    
    const buttonContainer = document.getElementById('groupButtons');
    groups.forEach(group => {
        const button = document.createElement('button');
        button.className = 'btn';
        button.textContent = translations[language].groups[group.name];
        button.addEventListener('click', () => handleGroupClick(group.name));
        buttonContainer.appendChild(button);
    });

    if (window.innerWidth > 800) {
        document.addEventListener('mousemove', moveStars);
    }
    
    // Добавляем обработчики для кнопок темы и языка
    const themeSwitch = document.querySelector('.theme-switch');
    themeSwitch.addEventListener('click', toggleTheme);
    
    const languageButton = document.getElementById('languageToggle');
    languageButton.addEventListener('click', toggleLanguage);
    
    document.getElementById('calculateButton').addEventListener('click', calculateScores);
    document.getElementById('recalculateButton').addEventListener('click', resetForm);
    document.getElementById('downloadButton').addEventListener('click', downloadResults);

    updateStarColors();
}

function createStars() {
    const stars = document.getElementById('stars');
    if (!stars) return;

    stars.innerHTML = '';
    
    const numStars = 150;
    const starSize = 1.5;

    for (let i = 0; i < numStars; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.width = star.style.height = starSize + 'px';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        stars.appendChild(star);
    }
}

function moveStars(e) {
    const stars = document.querySelectorAll('.star');
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    // Уменьшаем коэффициент смещения для меньшей амплитуды
    const moveX = (e.clientX - centerX) * 0.002; // уменьшили с 0.005 до 0.002
    const moveY = (e.clientY - centerY) * 0.002;

    stars.forEach(star => {
        const rect = star.getBoundingClientRect();
        const distanceFromCenter = Math.sqrt(
            Math.pow((rect.left - centerX) / centerX, 2) + 
            Math.pow((rect.top - centerY) / centerY, 2)
        );

        // Уменьшаем множитель для более мягкого движения
        star.style.transform = `translate(${moveX * distanceFromCenter * 20}px, ${moveY * distanceFromCenter * 20}px)`; // уменьшили с 50 до 20
    });
}

// ========== handleGroupClick ==========

    updateLanguage();
}

// ========== validateInput ==========
function validateInput(event) {
    const input = event.target;
    const min = parseInt(input.min);
    const max = parseInt(input.max);
    const value = parseInt(input.value);
    const errorMessage = input.nextElementSibling;

    if (isNaN(value)) {
        errorMessage.textContent = '';
    } else if (value < min || value > max) {
        errorMessage.textContent = `Dəyər ${min} və ${max} arasında olmalıdır.`;

        // Track: Invalid Input Entered
        umami.track('Invalid Input Entered', {
            field: input.name,
            value: value,
            min: min,
            max: max
        });
    } else {
        errorMessage.textContent = '';
    }
}

// ========== Before unload tracking ==========
window.addEventListener('beforeunload', () => {
    if (!results) {
        // Track: User Abandoned Form
        umami.track('User Abandoned Form');
    }
});

// ========== DOMContentLoaded ==========
document.addEventListener('DOMContentLoaded', () => {
    const isMobile = window.innerWidth <= 800;
    init();
    startCountdown();
    if (!isMobile) {
        initCursor();
        document.addEventListener('mousemove', moveStars);
    }
    document.body.classList.remove('light-mode');
    const checkbox = document.getElementById('checkbox');
    checkbox.checked = false;
    checkbox.addEventListener('change', toggleTheme);
    updateStarColors();

    // Track: Page Load
    umami.track('Page Load');
});
