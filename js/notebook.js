export function initNotebook() {
    const notebookIcon = document.getElementById('icon-notebook');
    const notebookWindow = document.getElementById('notebook-window');
    const closeBtn = document.getElementById('close-notebook');
    const header = document.getElementById('notebook-header');
    
    if (!notebookIcon || !notebookWindow) return;

    // Open notebook
    notebookIcon.addEventListener('click', () => {
        notebookWindow.style.display = 'flex';
        // Bring to front
        notebookWindow.style.zIndex = "100";
    });

    // Close notebook
    closeBtn.addEventListener('click', () => {
        notebookWindow.style.display = 'none';
    });

    // Tab switching logic
    const tabs = notebookWindow.querySelectorAll('.note-list li');
    const panes = notebookWindow.querySelectorAll('.note-pane');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active from all tabs and panes
            tabs.forEach(t => t.classList.remove('active'));
            panes.forEach(p => p.classList.remove('active'));

            // Add active to clicked tab
            tab.classList.add('active');

            // Show corresponding pane
            const noteId = tab.getAttribute('data-note');
            const targetPane = document.getElementById(`note-${noteId}`);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });

    // Draggable window logic
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    header.addEventListener('mousedown', (e) => {
        isDragging = true;
        const rect = notebookWindow.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        notebookWindow.style.zIndex = "101"; // Bring to front while dragging
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        let newX = e.clientX - offsetX;
        let newY = e.clientY - offsetY;
        
        // Prevent dragging completely off screen (optional)
        newX = Math.max(0, Math.min(newX, window.innerWidth - 100));
        newY = Math.max(0, Math.min(newY, window.innerHeight - 40));

        notebookWindow.style.left = `${newX}px`;
        notebookWindow.style.top = `${newY}px`;
        notebookWindow.style.transform = 'none'; // Remove centering transform once dragged
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
}
