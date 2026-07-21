import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { JSDOM } from 'jsdom';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

// Import translations dynamically
const translationsPath = path.resolve(projectRoot, 'src/i18n/translations.js');
const { translations } = await import(`file://${translationsPath}`);

let totalTests = 0;
let failedTests = 0;

function assert(condition, message) {
    totalTests++;
    if (condition) {
        console.log(`  ✅ PASS: ${message}`);
    } else {
        console.error(`  ❌ FAIL: ${message}`);
        failedTests++;
    }
}

function runAssertions(dom, sectionId, language) {
    const context = `[${language.toUpperCase()}] Section #${sectionId}`;
    console.log(`\nChecking ${context}...`);
    
    // 1. Check sections exist
    const section = dom.window.document.getElementById(sectionId) || dom.window.document.querySelector(`section`);
    assert(section !== null, `${context} should exist`);
    if (!section) return;

    // 2. Check split-layout structure
    const splitLayout = section.querySelector('.split-layout');
    assert(splitLayout !== null, `${context} should have .split-layout`);
    if (!splitLayout) return;

    const sidebar = splitLayout.querySelector('.split-sidebar');
    const content = splitLayout.querySelector('.split-content');
    assert(sidebar !== null, `${context} should have .split-sidebar`);
    assert(content !== null, `${context} should have .split-content`);

    // 3. Check sidebar elements
    if (sidebar) {
        const h2 = sidebar.querySelector('h2');
        const line = sidebar.querySelector('.sidebar-line');
        const intro = sidebar.querySelector('.intro-text');
        assert(h2 !== null, `${context} sidebar should have h2`);
        assert(line !== null, `${context} sidebar should have .sidebar-line`);
        assert(intro !== null, `${context} sidebar should have .intro-text`);

        if (sectionId === 'pedagogical-legend') {
            const finalMessage = sidebar.querySelector('.final-message');
            assert(finalMessage !== null, `${context} sidebar should have .final-message`);
            if (finalMessage) {
                const h3 = finalMessage.querySelector('h3');
                const ul = finalMessage.querySelector('ul');
                const quote = finalMessage.querySelector('.final-quote');
                assert(h3 !== null, `${context} final message should have h3`);
                assert(ul !== null, `${context} final message should have ul`);
                assert(quote !== null, `${context} final message should have .final-quote`);
                if (ul) {
                    const lis = ul.querySelectorAll('li');
                    assert(lis.length === 4, `${context} final message ul should have exactly 4 bullet points (found ${lis.length})`);
                }
            }
        }
    }

    // 4. Check content principles grid and cards
    if (content) {
        const grid = content.querySelector('.principles-grid');
        assert(grid !== null, `${context} content should have .principles-grid`);
        if (grid) {
            const cards = grid.querySelectorAll('.principle-card');
            assert(cards.length === 4, `${context} principles-grid should contain exactly 4 .principle-card elements (found ${cards.length})`);
            
            cards.forEach((card, index) => {
                const header = card.querySelector('.card-header');
                const body = card.querySelector('.card-body');
                assert(header !== null, `${context} card ${index + 1} should have .card-header`);
                assert(body !== null, `${context} card ${index + 1} should have .card-body`);

                if (header) {
                    const num = header.querySelector('.card-number');
                    const h4 = header.querySelector('h4');
                    assert(num !== null, `${context} card ${index + 1} header should have .card-number`);
                    assert(h4 !== null, `${context} card ${index + 1} header should have h4`);
                    if (num) {
                        assert(num.textContent.trim() === `0${index + 1}`, `${context} card ${index + 1} number should be "0${index + 1}"`);
                    }
                }

                if (body && sectionId === 'pedagogical-legend') {
                    const blockquote = body.querySelector('blockquote');
                    const cite = body.querySelector('blockquote cite');
                    assert(blockquote !== null, `${context} card ${index + 1} body should contain a blockquote`);
                    assert(cite !== null, `${context} card ${index + 1} body blockquote should contain a cite`);
                }
            });
        }
    }

    // 5. Ensure absolutely NO accordions left
    const oldAccordions = section.querySelectorAll('.accordion-card, .accordion-trigger, .accordion-icon, .accordion-content');
    assert(oldAccordions.length === 0, `${context} should have NO accordion-related classes (found ${oldAccordions.length})`);
}

// ----------------------------------------------------
// RUN TESTS FOR SPANISH (index.html)
// ----------------------------------------------------
console.log('\n--- TESTING SPANISH (index.html) ---');
const htmlPath = path.resolve(projectRoot, 'index.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');
const htmlDom = new JSDOM(htmlContent);

runAssertions(htmlDom, 'map-reading-guide', 'es');
runAssertions(htmlDom, 'pedagogical-legend', 'es');

// ----------------------------------------------------
// RUN TESTS FOR ENGLISH (translations.js strings)
// ----------------------------------------------------
console.log('\n--- TESTING ENGLISH (translations.js) ---');
const enReadingHtml = `<html><body><section id="map-reading-guide">${translations.en.html.mapReadingGuide}</section></body></html>`;
const enLegendHtml = `<html><body><section id="pedagogical-legend">${translations.en.html.pedagogicalLegend}</section></body></html>`;

const enReadingDom = new JSDOM(enReadingHtml);
const enLegendDom = new JSDOM(enLegendHtml);

runAssertions(enReadingDom, 'map-reading-guide', 'en');
runAssertions(enLegendDom, 'pedagogical-legend', 'en');

console.log('\n=======================================');
console.log(`TEST SUMMARY: ${totalTests - failedTests}/${totalTests} passed`);
console.log('=======================================');

if (failedTests > 0) {
    console.error(`❌ ${failedTests} tests failed!`);
    process.exit(1);
} else {
    console.log('🎉 All HTML structure tests passed successfully!');
    process.exit(0);
}
