import { initClock } from './clock.js';
import { initDrag } from './drag.js';
import { initTheme } from './theme.js';

document.addEventListener('DOMContentLoaded', () => {
    initClock();
    initDrag();
    initTheme();
});
