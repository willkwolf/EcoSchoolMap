/**
 * ScrollController - Manages scroll-based animations and section highlights
 * Lightweight version using a viewport anchor to avoid race conditions
 * between long sections during smooth scrolling.
 */

export class ScrollController {
    constructor(sections = [], options = {}) {
        this.sections = sections;
        this.options = {
            activationViewportRatio: 0.35,
            navAriaLabel: 'Section navigation',
            ...options
        };
        this.activeSection = null;
        this.navIndicators = [];
        this.sectionElements = [];
        this.animationFrameId = null;

        this.handleViewportChange = this.handleViewportChange.bind(this);

        this.init();
    }

    /**
     * Initialize scroll controller
     */
    init() {
        this.createScrollIndicators();
        this.cacheSections();
        this.setupActiveSectionTracking();
        this.setupSmoothScroll();
        this.updateActiveSection(true);

        console.log('✅ ScrollController initialized');
    }

    /**
     * Create fixed navigation indicators
     */
    createScrollIndicators() {
        const nav = document.createElement('nav');
        nav.className = 'scroll-indicators';
        nav.setAttribute('aria-label', this.options.navAriaLabel);

        this.sections.forEach((section, index) => {
            const indicator = document.createElement('button');
            indicator.className = 'scroll-indicator';
            indicator.setAttribute('aria-label', section.ariaLabel || section.name);
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
     * Cache section DOM nodes once so scroll tracking stays deterministic
     */
    cacheSections() {
        this.sectionElements = this.sections.reduce((elements, section, index) => {
            const element = document.getElementById(section.id);

            if (!element) {
                console.warn(`Section not found: ${section.id}`);
                return elements;
            }

            elements.push({ section, index, element });
            return elements;
        }, []);
    }

    /**
     * Track viewport changes with a throttled scroll/resize handler.
     * Using one deterministic anchor avoids multiple observers fighting
     * for control when adjacent sections are both intersecting.
     */
    setupActiveSectionTracking() {
        window.addEventListener('scroll', this.handleViewportChange, { passive: true });
        window.addEventListener('resize', this.handleViewportChange);
    }

    /**
     * Setup smooth scroll behavior
     */
    setupSmoothScroll() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        document.documentElement.style.scrollBehavior = prefersReducedMotion ? 'auto' : 'smooth';
    }

    /**
     * Schedule one active-section update per animation frame.
     */
    handleViewportChange() {
        if (this.animationFrameId !== null) {
            return;
        }

        this.animationFrameId = window.requestAnimationFrame(() => {
            this.animationFrameId = null;
            this.updateActiveSection();
        });
    }

    /**
     * Resolve the section that currently owns the viewport anchor.
     * @returns {number} Section index or -1 when nothing is available
     */
    getActiveSectionIndex() {
        if (!this.sectionElements.length) {
            return -1;
        }

        const viewportRatio = Math.min(Math.max(this.options.activationViewportRatio, 0.15), 0.7);
        const anchorY = window.innerHeight * viewportRatio;
        const sectionAtAnchor = this.sectionElements.find(({ element }) => {
            const rect = element.getBoundingClientRect();
            return rect.top <= anchorY && rect.bottom >= anchorY;
        });

        if (sectionAtAnchor) {
            return sectionAtAnchor.index;
        }

        const isAtPageBottom =
            window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;

        if (isAtPageBottom) {
            return this.sectionElements[this.sectionElements.length - 1].index;
        }

        return this.sectionElements.reduce(
            (closest, current) => {
                const distance = Math.abs(current.element.getBoundingClientRect().top - anchorY);

                if (distance < closest.distance) {
                    return {
                        distance,
                        index: current.index
                    };
                }

                return closest;
            },
            {
                distance: Number.POSITIVE_INFINITY,
                index: this.sectionElements[0].index
            }
        ).index;
    }

    /**
     * Update the active section based on the viewport anchor.
     * @param {boolean} force - Force a refresh even if the section did not change
     */
    updateActiveSection(force = false) {
        const index = this.getActiveSectionIndex();

        if (index === -1) {
            return;
        }

        const section = this.sections[index];
        if (!section) {
            return;
        }

        if (!force && this.activeSection === section.id) {
            return;
        }

        this.activateSection(section.id, index);
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

                    if (section.onEnter && typeof section.onEnter === 'function') {
                        section.onEnter();
                    }
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
            const offsetTop = window.scrollY + element.getBoundingClientRect().top - 24;
            window.scrollTo({
                top: Math.max(offsetTop, 0),
                behavior: 'smooth'
            });
        }
    }

    /**
     * Cleanup event listeners
     */
    destroy() {
        window.removeEventListener('scroll', this.handleViewportChange);
        window.removeEventListener('resize', this.handleViewportChange);

        if (this.animationFrameId !== null) {
            window.cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }

        const nav = document.querySelector('.scroll-indicators');
        if (nav) {
            nav.remove();
        }
    }
}
