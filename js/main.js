import { initClock } from './clock.js';
import { initDrag } from './drag.js';
import { initTheme } from './theme.js';
import { initNotebook } from './notebook.js';

document.addEventListener('DOMContentLoaded', () => {
    initClock();
    initDrag();
    initTheme();
    initNotebook();
});
