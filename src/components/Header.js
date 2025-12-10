import { Component } from '../core/Component.js';
import { store } from '../core/Store.js';
import { TRANSLATIONS } from '../data/locales.js';

export class Header extends Component {
    constructor(host) {
        super(host);

        // Subscribe to store updates
        store.subscribe((state, prop) => {
            if (prop === 'language' || prop === 'theme') {
                this.render();
            }
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
                    <span>${lang === 'az' ? 'RU' : 'AZ'}</span> <!-- Visual toggle -->
                </button>
            </div>
        `;
    }

    afterRender() {
        this.host.querySelector('.theme-switch input').addEventListener('change', (e) => {
            store.state.theme = e.target.checked ? 'light' : 'dark';
        });

        this.host.querySelector('#languageToggle').addEventListener('click', () => {
            store.state.language = store.state.language === 'az' ? 'ru' : 'az';
        });
    }
}
