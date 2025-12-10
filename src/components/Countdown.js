import { Component } from '../core/Component.js';
import { store } from '../core/Store.js';
import { APP_CONFIG } from '../data/constants.js';
import { TRANSLATIONS } from '../data/locales.js';

export class Countdown extends Component {
    constructor(host) {
        super(host);
        this.targetDate = new Date(APP_CONFIG.examDate).getTime();
        this.timer = null;

        store.subscribe((state, prop) => {
            if (prop === 'language') {
                // Update labels without full re-render if possible, or just re-render
                this.render();
            }
        });
    }

    init() {
        this.render();
        this.startTimer();
    }

    startTimer() {
        if (this.timer) clearInterval(this.timer);
        this.timer = setInterval(() => this.updateTime(), 1000);
        this.updateTime(); // Initial call
    }

    updateTime() {
        const now = new Date().getTime();
        const distance = this.targetDate - now;

        if (distance < 0) {
            clearInterval(this.timer);
            const t = TRANSLATIONS[store.state.language];
            this.host.innerHTML = `<div class="exam-started">${t.examStarted}</div>`;
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        this.host.querySelector('#days').innerText = String(days).padStart(2, '0');
        this.host.querySelector('#hours').innerText = String(hours).padStart(2, '0');
        this.host.querySelector('#minutes').innerText = String(minutes).padStart(2, '0');
        this.host.querySelector('#seconds').innerText = String(seconds).padStart(2, '0');
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
