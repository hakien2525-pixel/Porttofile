export function initTheme() {
    const themeDots = document.querySelectorAll('.theme-dots .dot');
    
    themeDots.forEach(dot => {
        dot.addEventListener('click', () => {
            // Remove active from all
            themeDots.forEach(d => d.classList.remove('active'));
            // Add active to clicked
            dot.classList.add('active');
            
            // Apply theme
            const theme = dot.getAttribute('data-theme');
            const root = document.documentElement;
            
            // Map theme string to CSS variable
            const bgVar = `--theme-${theme}-bg`;
            const color = getComputedStyle(root).getPropertyValue(bgVar).trim();
            
            root.style.setProperty('--bg-color', color);
        });
    });
}
