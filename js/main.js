document.addEventListener('DOMContentLoaded', () => {
    // 1. Clock Update
    const clockElement = document.getElementById('clock');
    
    function updateClock() {
        const now = new Date();
        const options = { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true };
        const timeString = now.toLocaleString('en-US', options).replace(',', '');
        clockElement.textContent = timeString;
    }
    
    setInterval(updateClock, 1000);
    updateClock();

    // 2. Draggable Desktop Icons
    const draggables = document.querySelectorAll('.draggable-icon');
    const desktopArea = document.getElementById('desktop-area');

    let activeDrag = null;
    let offsetX = 0, offsetY = 0;

    draggables.forEach(icon => {
        icon.addEventListener('mousedown', (e) => {
            activeDrag = icon;
            const rect = icon.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            
            // Bring to front
            draggables.forEach(d => d.style.zIndex = "10");
            icon.style.zIndex = "11";
        });
    });

    document.addEventListener('mousemove', (e) => {
        if (!activeDrag) return;
        
        // Calculate new position
        let newX = e.clientX - offsetX;
        let newY = e.clientY - offsetY;
        
        // Constrain to screen bounds
        const maxX = window.innerWidth - activeDrag.offsetWidth;
        const maxY = window.innerHeight - activeDrag.offsetHeight;
        
        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));
        
        activeDrag.style.left = `${newX}px`;
        activeDrag.style.top = `${newY}px`;
    });

    document.addEventListener('mouseup', () => {
        activeDrag = null;
    });

    // 3. Theme Switcher
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
});
