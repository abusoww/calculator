import { store } from './core/Store.js';
import { Header } from './components/Header.js';
import { Countdown } from './components/Countdown.js';
import { GroupSelector } from './components/GroupSelector.js';
import { ExamForm } from './components/ExamForm.js';
import { Results } from './components/Results.js';
import { StarBackground } from './components/StarBackground.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme from store immediately to prevent flash
    const theme = store.state.theme;
    if (theme === 'light') document.body.classList.add('light-mode');

    // Mount components
    new StarBackground('stars');
    new Header(document.querySelector('.header-controls'));
    new Countdown(document.querySelector('.countdown-container'));
    new GroupSelector(document.getElementById('groupButtons'));

    // Dynamic containers
    new ExamForm(document.getElementById('examFormContainer'));
    new Results(document.getElementById('resultsContainer'));

    // Custom Cursor Logic
    const dot = document.querySelector('.cursor-dot');
    const trail = document.querySelector('.cursor-trail');

    if (window.innerWidth > 800) {
        document.addEventListener('mousemove', (e) => {
            dot.style.left = e.clientX + 'px';
            dot.style.top = e.clientY + 'px';

            // Trail delay
            requestAnimationFrame(() => {
                trail.style.left = e.clientX + 'px';
                trail.style.top = e.clientY + 'px';
            });
        });

        document.addEventListener('mousedown', () => {
            dot.style.transform = 'translate(-50%, -50%) scale(0.8)';
        });
        document.addEventListener('mouseup', () => {
            dot.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    }
});
