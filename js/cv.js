export function initCV() {
    const profileIcon = document.getElementById('icon-profile');
    const cvWindow = document.getElementById('cv-window');
    const closeBtn = document.getElementById('close-cv');
    const header = document.getElementById('cv-header');
    
    if (!profileIcon || !cvWindow) return;

    // Open CV Quick Look
    profileIcon.addEventListener('click', () => {
        cvWindow.style.display = 'flex';
        // Bring to front
        cvWindow.style.zIndex = "100";
    });

    // Close CV Quick Look
    closeBtn.addEventListener('click', () => {
        cvWindow.style.display = 'none';
    });

    // Draggable window logic
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    header.addEventListener('mousedown', (e) => {
        isDragging = true;
        const rect = cvWindow.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        cvWindow.style.zIndex = "101"; // Bring to front while dragging
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        let newX = e.clientX - offsetX;
        let newY = e.clientY - offsetY;
        
        // Prevent dragging completely off screen
        newX = Math.max(0, Math.min(newX, window.innerWidth - 100));
        newY = Math.max(0, Math.min(newY, window.innerHeight - 40));

        cvWindow.style.left = `${newX}px`;
        cvWindow.style.top = `${newY}px`;
        cvWindow.style.transform = 'none'; // Remove centering transform once dragged
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
}
