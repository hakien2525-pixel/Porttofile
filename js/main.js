import { initClock } from './clock.js';
import { initDrag } from './drag.js';
import { initTheme } from './theme.js';
import { initNotebook } from './notebook.js';
import { initCV } from './cv.js';
import { initStickies } from './stickies.js';
import { initFlipbook } from './flipbook.js';

document.addEventListener('DOMContentLoaded', () => {
    initClock();
    initDrag();
    initTheme();
    initNotebook();
    initCV();
    initStickies();
    initFlipbook();
});
