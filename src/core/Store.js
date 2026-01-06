export class Store {
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

// Global store instance
export const store = new Store({
    language: 'az', // Force default to 'az' regardless of local storage for now to fix user issue, or just ensure it is valid
    theme: 'dark', // Default to dark for premium feel
    activeGroup: null,
    results: null
});

// Effects
store.subscribe((state, prop, value) => {
    if (prop === 'language') localStorage.setItem('lang', value);
    if (prop === 'theme') {
        localStorage.setItem('theme', value);
        document.body.className = value === 'light' ? 'light-mode' : '';
    }
});
