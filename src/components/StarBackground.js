export class StarBackground {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.stars = [];
        this.init();
    }

    init() {
        this.createStars();
        if (window.innerWidth > 800) {
            document.addEventListener('mousemove', (e) => this.moveStars(e));
        }

        // Listen for theme changes to update star colors
        const observer = new MutationObserver(() => this.updateStarColors());
        observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

        // Initial color set
        setTimeout(() => this.updateStarColors(), 0);
    }

    createStars() {
        this.container.innerHTML = '';
        const numStars = 150;
        const starSize = 1.5;

        for (let i = 0; i < numStars; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.width = starSize + 'px';
            star.style.height = starSize + 'px';
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            this.container.appendChild(star);
            this.stars.push(star);
        }
    }

    moveStars(e) {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const moveX = (e.clientX - centerX) * 0.002;
        const moveY = (e.clientY - centerY) * 0.002;

        this.stars.forEach(star => {
            const rect = star.getBoundingClientRect();
            const dist = Math.sqrt(
                Math.pow((rect.left - centerX) / centerX, 2) +
                Math.pow((rect.top - centerY) / centerY, 2)
            );

            star.style.transform = `translate(${moveX * dist * 20}px, ${moveY * dist * 20}px)`;
        });
    }

    updateStarColors() {
        const starColor = getComputedStyle(document.body).getPropertyValue('--star-color').trim();
        this.stars.forEach(star => star.style.backgroundColor = starColor || '#fff');
    }
}
