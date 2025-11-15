/**
 * ScrollController - Manages scroll-based animations and section highlights
 * Lightweight version using Intersection Observer API
 */

export class ScrollController {
    constructor(sections = []) {
        this.sections = sections;
        this.activeSection = null;
        this.observers = [];
        this.navIndicators = [];

        this.init();
    }

    /**
     * Initialize scroll controller
     */
    init() {
        this.createScrollIndicators();
        this.setupIntersectionObservers();
        this.setupSmoothScroll();

        console.log('✅ ScrollController initialized');
    }

    /**
     * Create fixed navigation indicators
     */
    createScrollIndicators() {
        const nav = document.createElement('nav');
        nav.className = 'scroll-indicators';
        nav.setAttribute('aria-label', 'Navegación de secciones');

        this.sections.forEach((section, index) => {
            const indicator = document.createElement('button');
            indicator.className = 'scroll-indicator';
            indicator.setAttribute('aria-label', `Ir a ${section.name}`);
            indicator.dataset.section = section.id;

            indicator.addEventListener('click', () => {
                this.scrollToSection(section.id);
            });

            this.navIndicators.push(indicator);
            nav.appendChild(indicator);
        });

        document.body.appendChild(nav);
    }

    /**
     * Setup Intersection Observer for each section
     */
    setupIntersectionObservers() {
        const options = {
            root: null,
            rootMargin: '-20% 0px -20% 0px',
            threshold: 0.3
        };

        this.sections.forEach((section, index) => {
            const element = document.getElementById(section.id);

            if (!element) {
                console.warn(`Section not found: ${section.id}`);
                return;
            }

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.activateSection(section.id, index);

                        // Trigger section callback if defined
                        if (section.onEnter && typeof section.onEnter === 'function') {
                            section.onEnter();
                        }
                    }
                });
            }, options);

            observer.observe(element);
            this.observers.push(observer);
        });
    }

    /**
     * Setup smooth scroll behavior
     */
    setupSmoothScroll() {
        // Enable smooth scrolling via CSS
        document.documentElement.style.scrollBehavior = 'smooth';
    }

    /**
     * Activate a specific section
     * @param {string} sectionId - Section ID
     * @param {number} index - Section index
     */
    activateSection(sectionId, index) {
        this.activeSection = sectionId;

        // Update indicators
        this.navIndicators.forEach((indicator, i) => {
            if (i === index) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });

        // Add active class to section
        this.sections.forEach((section, i) => {
            const element = document.getElementById(section.id);
            if (element) {
                if (i === index) {
                    element.classList.add('section-active');
                } else {
                    element.classList.remove('section-active');
                }
            }
        });

        console.log(`✅ Section activated: ${sectionId}`);
    }

    /**
     * Scroll to specific section
     * @param {string} sectionId - Section ID to scroll to
     */
    scrollToSection(sectionId) {
        const element = document.getElementById(sectionId);

        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }

    /**
     * Cleanup observers
     */
    destroy() {
        this.observers.forEach(observer => observer.disconnect());

        const nav = document.querySelector('.scroll-indicators');
        if (nav) {
            nav.remove();
        }
    }
}
