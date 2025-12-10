export class Calculator {
    static calculateScore(groupName, answers) {
        // Parse inputs to ensure they are numbers
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

            results['Biologiya'] = 100 / 33 * ((biologiya.correct - biologiya.incorrect / 4) + (2 * biologiya.open + biologiya.coding));
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
