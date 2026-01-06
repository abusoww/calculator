import { Component } from '../core/Component.js';
import { store } from '../core/Store.js';
import { GROUPS } from '../data/constants.js';
import { TRANSLATIONS } from '../data/locales.js';

export class GroupSelector extends Component {
    constructor(host) {
        super(host);
        store.subscribe((state, prop) => {
            if (prop === 'activeGroup' || prop === 'language') {
                this.render();
            }
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
                const groupName = btn.dataset.group;
                store.state.activeGroup = groupName;
                store.state.results = null; // Clear results on switch

                // Scroll to form
                setTimeout(() => {
                    const form = document.getElementById('examFormContainer');
                    if (form) form.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            });
        });
    }
}
