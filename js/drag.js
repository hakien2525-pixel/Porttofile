export function initDrag() {
    const draggables = document.querySelectorAll('.draggable-icon');
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
        
        let newX = e.clientX - offsetX;
        let newY = e.clientY - offsetY;
        
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
}
