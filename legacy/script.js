const examDate = new Date('2026-03-01T10:00:00').getTime();

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

function handleGroupClick(groupName) {
    activeGroup = groups.find(g => g.name === groupName);
    document.querySelectorAll('#groupButtons .btn').forEach(btn => {
        btn.classList.toggle('active', btn.textContent === translations[language].groups[groupName]);
    });
    
    document.getElementById('examForm').style.display = 'block';
    document.getElementById('results').style.display = 'none';
    document.getElementById('examForm').scrollIntoView({ behavior: 'smooth' });
    
    generateForm();
}

function generateForm() {
    const form = document.getElementById('scoreForm');
    form.innerHTML = '';
    document.getElementById('activeGroupTitle').textContent = translations[language].groups[activeGroup.name];

    activeGroup.subjects.forEach((subject, index) => {
        const subjectDiv = document.createElement('div');
        subjectDiv.className = 'subject';
        let inputFields = '';
        if (activeGroup.name === 'Buraxılış İmtahanı') {
            const maxClosed = subject === 'İngilis dili' ? 23 : (subject === 'Azərbaycan dili' ? 20 : 13);
            const maxOpen = subject === 'İngilis dili' ? 7 : (subject === 'Azərbaycan dili' ? 10 : 7);
            inputFields = `
                <div class="input-group">
                    <label>
                        ${translations[language].closed}:
                        <input type="number" name="${subject}-closed" min="0" max="${maxClosed}" class="input-field">
                        <span class="error-message"></span>
                    </label>
                    <label>
                        ${translations[language].open}:
                        <input type="number" name="${subject}-open" min="0" max="${maxOpen}" class="input-field">
                        <span class="error-message"></span>
                    </label>
            `;
            if (subject === 'Riyaziyyat') {
                inputFields += `
                    <label>
                        ${translations[language].coding}:
                        <input type="number" name="${subject}-coding" min="0" max="5" class="input-field">
                        <span class="error-message"></span>
                    </label>
                `;
            }
        } else {
            inputFields = `
                <div class="input-group">
                    <label>
                        ${translations[language].correct}:
                        <input type="number" name="${subject}-correct" min="0" max="22" class="input-field">
                        <span class="error-message"></span>
                    </label>
                    <label>
                        ${translations[language].incorrect}:
                        <input type="number" name="${subject}-incorrect" min="0" max="22" class="input-field">
                        <span class="error-message"></span>
                    </label>
                    <label>
                        ${translations[language].coding}:
                        <input type="number" name="${subject}-coding" min="0" max="5" class="input-field">
                        <span class="error-message"></span>
                    </label>
                    <label>
                        ${translations[language].open}:
                        <input type="number" name="${subject}-open" min="0" max="3" class="input-field">
                        <span class="error-message"></span>
                    </label>
                </div>
            `;
        }
        subjectDiv.innerHTML = `
            <h3>${translations[language].subjects[subject]} (${activeGroup.maxScores[index]} ${translations[language].score})</h3>
            ${inputFields}
        `;
        form.appendChild(subjectDiv);
    });

    document.querySelectorAll('.input-field').forEach(input => {
        input.addEventListener('input', validateInput);
    });
}

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
    } else {
        errorMessage.textContent = '';
    }
}

function calculateScores() {
    results = {};
    let totalScore = 0;

    if (activeGroup.name === 'I Qrup') {
        const riyaziyyat = getSubjectScores('Riyaziyyat');
        const fizika = getSubjectScores('Fizika');
        const kimya = getSubjectScores('Kimya');

        results['Riyaziyyat'] = 1.5 * 100/33 * ((riyaziyyat.correct - riyaziyyat.incorrect/4) + (2*riyaziyyat.open + riyaziyyat.coding));
        results['Fizika'] = 1.5 * 100/33 * ((fizika.correct - fizika.incorrect/4) + (2*fizika.open + fizika.coding));
        results['Kimya'] = 100/33 * ((kimya.correct - kimya.incorrect/4) + (2*kimya.open + kimya.coding));
    } else if (activeGroup.name === 'II Qrup') {
        const riyaziyyat = getSubjectScores('Riyaziyyat');
        const cografiya = getSubjectScores('Coğrafiya');
        const tarix = getSubjectScores('Tarix');

        results['Riyaziyyat'] = 1.5 * 100/33 * ((riyaziyyat.correct - riyaziyyat.incorrect/4) + (2*riyaziyyat.open + riyaziyyat.coding));
        results['Coğrafiya'] = 100/33 * ((cografiya.correct - cografiya.incorrect/4) + (2*cografiya.open + cografiya.coding));
        results['Tarix'] = 1.5 * 100/33 * ((tarix.correct - tarix.incorrect/4) + (2*tarix.open + tarix.coding));
    } else if (activeGroup.name === 'III Qrup') {
        const azDili = getSubjectScores('Azərbaycan dili');
        const edebiyyat = getSubjectScores('Ədəbiyyat');
        const tarix = getSubjectScores('Tarix');

        results['Azərbaycan dili'] = 1.5 * 100/33 * ((azDili.correct - azDili.incorrect/4) + (2*azDili.open + azDili.coding));
        results['Ədəbiyyat'] = 100/33 * ((edebiyyat.correct - edebiyyat.incorrect/4) + (2*edebiyyat.open + edebiyyat.coding));
        results['Tarix'] = 1.5 * 100/33 * ((tarix.correct - tarix.incorrect/4) + (2*tarix.open + tarix.coding));
    } else if (activeGroup.name === 'IV Qrup') {
        const biologiya = getSubjectScores('Biologiya');
        const kimya = getSubjectScores('Kimya');
        const fizika = getSubjectScores('Fizika');

        results['Biologiya'] = 100/33 * ((biologiya.correct - biologiya.incorrect/4) + (2*biologiya.open + biologiya.coding));
        results['Kimya'] = 1.5 * 100/33 * ((kimya.correct - kimya.incorrect/4) + (2*kimya.open + kimya.coding));
        results['Fizika'] = 100/33 * ((fizika.correct - fizika.incorrect/4) + (2*fizika.open + fizika.coding));
    } else if (activeGroup.name === 'Buraxılış İmtahanı') {
        const riyaziyyat = getSubjectScores('Riyaziyyat');
        const azDili = getSubjectScores('Azərbaycan dili');
        const ingilisDili = getSubjectScores('İngilis dili');

        results['Riyaziyyat'] = 25 / 8 * (2 * riyaziyyat.open + riyaziyyat.closed + riyaziyyat.coding);
        results['Azərbaycan dili'] = 2.5 * (2 * azDili.open + azDili.closed);
        results['İngilis dili'] = 100 / 37 * (2 * ingilisDili.open + ingilisDili.closed);
    }

    for (const score of Object.values(results)) {
        totalScore += score;
    }
    results['Ümumi bal'] = totalScore;

    displayResults();
}

function getSubjectScores(subject) {
    return {
        correct: parseInt(document.querySelector(`[name="${subject}-correct"]`)?.value) || 0,
        incorrect: parseInt(document.querySelector(`[name="${subject}-incorrect"]`)?.value) || 0,
        open: parseInt(document.querySelector(`[name="${subject}-open"]`)?.value) || 0,
        closed: parseInt(document.querySelector(`[name="${subject}-closed"]`)?.value) || 0,
        coding: parseInt(document.querySelector(`[name="${subject}-coding"]`)?.value) || 0
    };
}

function getResultLevel(score, groupName) {
    const groupRanges = scoreRanges[groupName].ranges;
    for (const range of groupRanges) {
        if (score >= range.min && score <= range.max) {
            return range.level;
        }
    }
    return 'low'; // По умолчанию
}

function displayResultMessage(totalScore) {
    const messageContainer = document.getElementById('resultMessage');
    const level = getResultLevel(totalScore, activeGroup.name);
    const message = resultMessages[level][language][activeGroup.name];

    if (message) {
        messageContainer.innerHTML = `
            <iframe src="${message.gif}" width="200" height="200" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>
            <p>${message.text}</p>
        `;
        messageContainer.classList.add('show');
    } else {
        messageContainer.classList.remove('show');
    }
}

function displayResults(preventScroll = false) {
    const tableBody = document.querySelector('#resultsTable tbody');
    tableBody.innerHTML = '';

    for (const [subject, score] of Object.entries(results)) {
        const row = tableBody.insertRow();
        row.insertCell(0).textContent = translations[language].subjects[subject];
        row.insertCell(1).textContent = score.toFixed(1);
        if (subject === 'Ümumi bal') {
            row.classList.add('total');
            displayResultMessage(score);
        }
    }

    document.getElementById('results').style.display = 'block';
    
    if (!preventScroll) {
        document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
    }

    const rows = tableBody.querySelectorAll('tr');
    rows.forEach((row, index) => {
        row.style.animation = `fadeIn 0.5s ease ${index * 0.1}s forwards`;
        row.style.opacity = '0';
    });
}

function resetForm() {
    document.getElementById('examForm').style.display = 'block';
    document.getElementById('results').style.display = 'none';
    document.getElementById('examForm').scrollIntoView({ behavior: 'smooth' });
}

function downloadResults() {
    if (results) {
        const resultsText = Object.entries(results)
            .map(([subject, score]) => `${subject}: ${score.toFixed(1)}`)
            .join('\n');
        const blob = new Blob([resultsText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'imtahan_neticeleri.txt';
        a.click();
        URL.revokeObjectURL(url);
    }
}

function toggleTheme() {
    document.body.classList.toggle('light-mode');
    updateStarColors();
}

function updateStarColors() {
    const stars = document.querySelectorAll('.star');
    const starColor = getComputedStyle(document.body).getPropertyValue('--star-color').trim();
    stars.forEach(star => {
        star.style.backgroundColor = starColor;
    });
}

function toggleLanguage() {
    language = language === 'az' ? 'ru' : 'az';
    const languageToggle = document.getElementById('languageToggle');
    languageToggle.innerHTML = `
        <i class="fas fa-globe"></i>
        <span>${language === 'az' ? 'RU' : 'AZ'}</span>
    `;
    updateLanguage();
}

function updateLanguage() {
    document.querySelector('.title').textContent = translations[language].title;
    document.querySelector('.description').textContent = translations[language].description;
    document.getElementById('calculateButton').textContent = translations[language].calculate;
    document.querySelector('.results-title').textContent = translations[language].results;
    document.querySelector('#resultsTable th:first-child').textContent = translations[language].subject;
    document.querySelector('#resultsTable th:last-child').textContent = translations[language].score;
    document.getElementById('downloadButton').textContent = translations[language].saveResults;
    document.getElementById('recalculateButton').textContent = translations[language].recalculate;

    if (activeGroup) {
        generateForm();
    }

    document.querySelectorAll('.countdown-label').forEach((label, index) => {
        const labels = ['days', 'hours', 'minutes', 'seconds'];
        label.textContent = translations[language][labels[index]];
    });

    // Обновляем назван групп в копках
    document.querySelectorAll('#groupButtons .btn').forEach(button => {
        const groupName = button.textContent;
        const groupKey = Object.keys(translations.az.groups).find(
            key => translations[language === 'az' ? 'ru' : 'az'].groups[key] === groupName
        );
        if (groupKey) {
            button.textContent = translations[language].groups[groupKey];
        }
    });

    // Если есть активная группа, обновляем её заголовок
    if (activeGroup) {
        document.getElementById('activeGroupTitle').textContent = 
            translations[language].groups[activeGroup.name];
    }

    // Если есть результаты, обновляем их отображение б прокрутки
    if (results) {
        displayResults(true);
    }
}

function startCountdown() {
    function updateCountdown() {
        const now = new Date().getTime();
        const timeLeft = examDate - now;
        
        if (timeLeft < 0) {
            document.querySelector('.countdown-container').innerHTML = 
                `<h2 style="text-align: center; font-size: 2rem; color: var(--primary-color);">
                    ${translations[language].examStarted}
                </h2>`;
            return;
        }

        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');

        const secondsElement = document.getElementById('seconds');
        secondsElement.style.transform = 'scale(1.1)';
        secondsElement.style.color = 'var(--secondary-color)';
        
        setTimeout(() => {
            secondsElement.style.transform = 'scale(1)';
            secondsElement.style.color = 'var(--primary-color)';
        }, 500);

        if (days <= 10) {
            document.querySelector('.countdown-container').style.animation = 'pulse 2s infinite';
        }
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

function initCursor() {
    if (window.innerWidth <= 800) return;

    const cursor = document.querySelector('.cursor-dot');
    const numTrails = 5;
    const trails = Array.from({ length: numTrails }, () => {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        document.body.appendChild(trail);
        return trail;
    });

    // Создаем эле��ент для эффекта клика
    const clickEffect = document.createElement('div');
    clickEffect.className = 'cursor-click';
    document.body.appendChild(clickEffect);

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    const trailPositions = trails.map(() => ({ x: 0, y: 0 }));

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Обработчики кликов
    document.addEventListener('mousedown', (e) => {
        if (e.button === 0) { // Левый клик
            cursor.classList.add('clicking');
            showClickEffect(mouseX, mouseY, 'var(--primary-color)');
        } else if (e.button === 2) { // Правый клик
            cursor.classList.add('right-clicking');
            showClickEffect(mouseX, mouseY, 'var(--secondary-color)');
        }
    });

    document.addEventListener('mouseup', () => {
        cursor.classList.remove('clicking', 'right-clicking');
    });

    function showClickEffect(x, y, color) {
        clickEffect.style.left = `${x}px`;
        clickEffect.style.top = `${y}px`;
        clickEffect.style.background = `radial-gradient(circle, ${color} 0%, transparent 70%)`;
        clickEffect.style.transform = 'translate(-50%, -50%) scale(1)';
        clickEffect.style.opacity = '1';

        setTimeout(() => {
            clickEffect.style.transform = 'translate(-50%, -50%) scale(0)';
            clickEffect.style.opacity = '0';
        }, 300);
    }

    function animate() {
        const ease = 0.5;
        cursorX += (mouseX - cursorX) * ease;
        cursorY += (mouseY - cursorY) * ease;

        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;

        trails.forEach((trail, index) => {
            const prevIndex = Math.max(0, index - 1);
            const speed = 0.7;

            if (index === 0) {
                trailPositions[0].x += (cursorX - trailPositions[0].x) * speed;
                trailPositions[0].y += (cursorY - trailPositions[0].y) * speed;
            } else {
                trailPositions[index].x += (trailPositions[prevIndex].x - trailPositions[index].x) * speed;
                trailPositions[index].y += (trailPositions[prevIndex].y - trailPositions[index].y) * speed;
            }

            const scale = 1 - (index * 0.15);
            trail.style.left = `${trailPositions[index].x}px`;
            trail.style.top = `${trailPositions[index].y}px`;
            trail.style.transform = `translate(-50%, -50%) scale(${scale})`;
            trail.style.opacity = 1 - (index * 0.2);
        });

        requestAnimationFrame(animate);
    }

    animate();

    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        trails.forEach(trail => trail.style.opacity = '0');
    });

    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
        trails.forEach(trail => trail.style.opacity = '1');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const isMobile = window.innerWidth <= 800;
    
    init();
    startCountdown();
    
    if (!isMobile) {
        initCursor();
        document.addEventListener('mousemove', moveStars);
    }
    
    // Устанавливаем светлую тему по умолчанию
    document.body.classList.remove('light-mode');

    
    const checkbox = document.getElementById('checkbox');
    checkbox.checked = false;                   // checkbox в неактивном состоянии = тёмная тема
    checkbox.addEventListener('change', toggleTheme);  // восстанавливаем реакцию на переключатель
    updateStarColors();                         // сразу подгоняем цвета звёзд под тёмную тему

});

document.addEventListener('contextmenu', event => event.preventDefault());
document.addEventListener('keydown', function(e) {
    if (e.key === 'F12') {
        e.preventDefault();
    }
    if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
    }
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
    }
});













  // === Add Umami Tracking After Everything Else Loads ===
  document.addEventListener('DOMContentLoaded', function () {
    // Ensure Umami is defined
    function trackEvent(event, data = {}) {
      if (typeof umami !== 'undefined' && typeof umami.track === 'function') {
        umami.track(event, data);
      }
    }

    // Track page load
    trackEvent('Page Load');

    // Group buttons
    document.querySelectorAll('#groupButtons .btn').forEach(btn => {
      btn.addEventListener('click', function () {
        const groupName = this.textContent.trim();
        trackEvent('Group Selected', { group: groupName });
      });
    });

    // Calculate Button
    const calcBtn = document.getElementById('calculateButton');
    if (calcBtn) {
      calcBtn.addEventListener('click', function () {
        trackEvent('Calculate Button Clicked');
      });
    }

    // Results Download
    const downloadBtn = document.getElementById('downloadButton');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', function () {
        trackEvent('Results Downloaded');
      });
    }

    // Form Reset / Recalculate
    const recalculateBtn = document.getElementById('recalculateButton');
    if (recalculateBtn) {
      recalculateBtn.addEventListener('click', function () {
        trackEvent('Form Reset');
      });
    }

    // Language Toggle
    const langToggle = document.getElementById('languageToggle');
    if (langToggle) {
      langToggle.addEventListener('click', function () {
        const currentLang = document.documentElement.getAttribute('lang') || 'az';
        trackEvent('Language Changed', { language: currentLang });
      });
    }

    // Theme Toggle
    const themeCheckbox = document.getElementById('checkbox');
    if (themeCheckbox) {
      themeCheckbox.addEventListener('change', function () {
        const theme = this.checked ? 'light' : 'dark';
        trackEvent('Theme Changed', { theme: theme });
      });
    }

    // Invalid Input Detection
    document.querySelectorAll('input[type="number"]').forEach(input => {
      input.addEventListener('input', function () {
        const min = parseInt(this.min);
        const max = parseInt(this.max);
        const value = parseInt(this.value);
        if (!isNaN(value) && (value < min || value > max)) {
          trackEvent('Invalid Input Entered', {
            field: this.name,
            value: value,
            min: min,
            max: max
          });
        }
      });
    });

    // User Abandonment Detection
    window.addEventListener('beforeunload', function () {
      const resultSection = document.getElementById('results');
      const isVisible = resultSection && resultSection.style.display === 'block';
      if (!isVisible) {
        trackEvent('User Abandoned Form');
      }
    });
  });
