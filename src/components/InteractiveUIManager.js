/**
 * InteractiveUIManager - Manages tabs, accordions, and progressive disclosures
 * Designed for extreme mobile efficiency and fluid editorial visual rhythm.
 */
export class InteractiveUIManager {
    constructor() {
        this.init();
    }

    init() {
        this.initTabs();
        this.initAccordions();
        console.log('✅ InteractiveUIManager initialized');
    }

    /**
     * Initialize tabbed category switchers
     */
    initTabs() {
        const tabContainers = document.querySelectorAll('.tabs-container');

        tabContainers.forEach(container => {
            const buttons = container.querySelectorAll('.tab-btn');
            const sectionId = container.closest('section').id;

            buttons.forEach(button => {
                button.addEventListener('click', () => {
                    const targetTab = button.getAttribute('data-tab');

                    // Update active button state
                    buttons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');

                    // Filter contents based on section type
                    if (sectionId === 'cocktails') {
                        this.filterCards('.cocktail-card', targetTab);
                    } else if (sectionId === 'timeline') {
                        this.filterCards('.timeline-item', targetTab);
                    } else if (sectionId === 'applications') {
                        this.filterApplications(targetTab);
                    }
                });

                // Support keypress for accessibility
                button.addEventListener('keydown', (event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        button.click();
                    }
                });
            });
        });
    }

    /**
     * Filter card-like grid elements elegantly with fade transitions
     */
    filterCards(selector, targetTab) {
        const cards = document.querySelectorAll(selector);

        cards.forEach(card => {
            const category = card.getAttribute('data-category');

            if (targetTab === 'all' || category === targetTab) {
                card.style.display = '';
                // Trigger reflow for transition
                void card.offsetHeight;
                card.classList.remove('fade-out');
                card.classList.add('fade-in');
            } else {
                card.classList.remove('fade-in');
                card.classList.add('fade-out');
                // Hide after transition completes
                setTimeout(() => {
                    if (card.classList.contains('fade-out')) {
                        card.style.display = 'none';
                    }
                }, 200);
            }
        });
    }

    /**
     * Filter application categories (dimensión social)
     */
    filterApplications(targetTab) {
        const categories = document.querySelectorAll('.application-category');

        categories.forEach(cat => {
            const catId = cat.getAttribute('id');

            if (catId === targetTab) {
                cat.style.display = '';
                void cat.offsetHeight;
                cat.classList.remove('fade-out');
                cat.classList.add('fade-in');
            } else {
                cat.classList.remove('fade-in');
                cat.classList.add('fade-out');
                setTimeout(() => {
                    if (cat.classList.contains('fade-out')) {
                        cat.style.display = 'none';
                    }
                }, 200);
            }
        });
    }

    /**
     * Initialize collapsible accordion grids/cards
     */
    initAccordions() {
        const accordions = document.querySelectorAll('.accordion-card');

        accordions.forEach(card => {
            const trigger = card.querySelector('.accordion-trigger');
            
            if (!trigger) return;

            trigger.addEventListener('click', () => {
                const isActive = card.classList.contains('active');

                // Toggle current card
                if (isActive) {
                    card.classList.remove('active');
                    trigger.setAttribute('aria-expanded', 'false');
                } else {
                    card.classList.add('active');
                    trigger.setAttribute('aria-expanded', 'true');
                }
            });

            // Accessibility trigger keyboard support
            trigger.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    trigger.click();
                }
            });
        });
    }
}
