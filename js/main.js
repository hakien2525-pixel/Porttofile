import { initClock } from './clock.js';
import { initDrag } from './drag.js';
import { initTheme } from './theme.js';
import { initNotebook } from './notebook.js';
import { initCV } from './cv.js';
import { initStickies } from './stickies.js';
import { initFlipbook } from './flipbook.js';
import { initProjects } from './projects.js';

document.addEventListener('DOMContentLoaded', () => {
    initClock();
    initDrag();
    initTheme();
    initNotebook();
    initCV();
    initStickies();
    initFlipbook();
    initProjects();

    // Reset widgets state when clicking desktop
    document.addEventListener('click', () => {
        const widgetsPanel = document.querySelector('.widgets-panel');
        if (widgetsPanel && widgetsPanel.classList.contains('show')) {
            widgetsPanel.classList.remove('show');
        }
    });

    // Mobile Widgets Toggle
    const toggleWidgetsBtn = document.getElementById('toggle-widgets-btn');
    const widgetsPanel = document.querySelector('.widgets-panel');
    if (toggleWidgetsBtn && widgetsPanel) {
        toggleWidgetsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            widgetsPanel.classList.toggle('show');
        });
        
        widgetsPanel.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
});
