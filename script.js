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
        title: 'İmtihan Ballarını Hesablama',
        description: 'Doğru, yanlış, açıq və qapalı suallar haqqında məlumat daxil edərək ballarınızı hesablaya bilərsiniz.',
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
        examStarted: 'İmtihan başladı!',
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

// Score Ranges and Messages remain unchanged...

function handleGroupClick(groupName) {
    activeGroup = groups.find(g => g.name === groupName);
    document.querySelectorAll('#groupButtons .btn').forEach(btn => {
        btn.classList.toggle('active', btn.textContent === translations[language].groups[groupName]);
    });
    document.getElementById('examForm').style.display = 'block';
    document.getElementById('results').style.display = 'none';
    document.getElementById('examForm').scrollIntoView({ behavior: 'smooth' });
    generateForm();

    // Track event in Umami
    umami.track('Group Selected', { group: groupName });
}

document.getElementById('calculateButton').addEventListener('click', () => {
    umami.track('Calculate Button Clicked');
});

function toggleLanguage() {
    language = language === 'az' ? 'ru' : 'az';
    const languageToggle = document.getElementById('languageToggle');
    languageToggle.innerHTML = `
        <i class="fas fa-globe"></i>
        <span>${language === 'az' ? 'RU' : 'AZ'}</span>
    `;
    updateLanguage();

    // Track event in Umami
    umami.track('Language Changed', { language: language });
}

function toggleTheme() {
    const isLight = document.body.classList.toggle('light-mode');
    updateStarColors();

    // Track event in Umami
    umami.track('Theme Changed', { theme: isLight ? 'light' : 'dark' });
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

        // Track event in Umami
        umami.track('Results Downloaded');
    }
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

        // Track invalid input
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

function displayResults(preventScroll = false) {
    const tableBody = document.querySelector('#resultsTable tbody');
    tableBody.innerHTML = '';
    let totalScore = 0;
    for (const [subject, score] of Object.entries(results)) {
        const row = tableBody.insertRow();
        row.insertCell(0).textContent = translations[language].subjects[subject];
        row.insertCell(1).textContent = score.toFixed(1);
        if (subject === 'Ümumi bal') {
            totalScore = score;
        }
    }

    // Track Results Viewed
    umami.track('Results Viewed', { total_score: totalScore });

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

    // Track form reset
    umami.track('Form Reset');
}

window.addEventListener('beforeunload', () => {
    if (!results) {
        // Track abandonment
        umami.track('User Abandoned Form');
    }
});

// Full calculation function
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

    // Track full calculation
    umami.track('Custom Calculation Performed', {
        group: activeGroup.name,
        total_score: totalScore
    });

    displayResults();
}
