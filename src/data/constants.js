export const GROUPS = [
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

export const APP_CONFIG = {
    examDate: '2026-03-01T10:00:00',
    links: {
        umami: '99064832-b906-409f-abfd-d1586d96b366',
        gtag: 'G-3S462EV9SR'
    }
};

export const SCORE_RANGES = {
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
