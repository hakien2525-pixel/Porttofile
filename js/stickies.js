export async function initStickies() {
    const fileIcon = document.getElementById('icon-file');
    
    if (!fileIcon) return;

    let isInitialized = false;

    // Toggle window visibility
    fileIcon.addEventListener('click', async () => {
        if (!isInitialized) {
            try {
                const response = await fetch('components/stickies.html');
                const html = await response.text();
                document.getElementById('modals-container').insertAdjacentHTML('beforeend', html);
                setupStickiesLogic();
                isInitialized = true;
            } catch (err) {
                console.error("Failed to load Stickies UI", err);
                return;
            }
        }
        const stickiesWindow = document.getElementById('stickies-window');
        stickiesWindow.style.display = 'flex';
        // Bring to front
        stickiesWindow.style.zIndex = "100";
        if (typeof resizeCanvas === 'function') resizeCanvas();
    });
}

function setupStickiesLogic() {
    const stickiesWindow = document.getElementById('stickies-window');
    const closeBtn = document.getElementById('close-stickies');
    const header = document.getElementById('stickies-header');

    // Close window
    closeBtn.addEventListener('click', () => {
        stickiesWindow.style.display = 'none';
    });

    // Draggable window logic
    let isDraggingWindow = false;
    let offsetX = 0;
    let offsetY = 0;

    header.addEventListener('mousedown', (e) => {
        if(e.target.tagName === 'BUTTON') return; // Don't drag if clicking header buttons
        isDraggingWindow = true;
        const rect = stickiesWindow.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        stickiesWindow.style.zIndex = "101";
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDraggingWindow) return;
        let newX = e.clientX - offsetX;
        let newY = e.clientY - offsetY;
        
        newX = Math.max(0, Math.min(newX, window.innerWidth - 100));
        newY = Math.max(0, Math.min(newY, window.innerHeight - 40));

        stickiesWindow.style.left = `${newX}px`;
        stickiesWindow.style.top = `${newY}px`;
        stickiesWindow.style.transform = 'none';
    });

    document.addEventListener('mouseup', () => {
        isDraggingWindow = false;
    });

    // --- CANVAS DRAWING LOGIC ---
    const canvas = document.getElementById('stickies-canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    // Tools State
    let currentTool = 'pen'; // 'pen' or 'eraser'
    let currentColor = '#2D2A26';
    let currentSize = 3;
    let isDrawing = false;
    
    // Resize canvas properly to match display size
    function resizeCanvas() {
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
    }
    
    // Tool selection
    const toolBtns = document.querySelectorAll('.stickies-sidebar .tool-btn');
    toolBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            toolBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentTool = btn.dataset.tool;
        });
    });

    // Color selection
    const colorSwatches = document.querySelectorAll('.stickies-sidebar .color-swatch');
    colorSwatches.forEach(swatch => {
        swatch.addEventListener('click', () => {
            colorSwatches.forEach(s => s.classList.remove('active'));
            swatch.classList.add('active');
            currentColor = swatch.dataset.color;
            if (currentTool === 'eraser') {
                // Auto switch to pen if they pick a color while erasing
                document.querySelector('.tool-btn[data-tool="pen"]').click();
            }
        });
    });

    // Brush size
    const brushSlider = document.getElementById('brush-size');
    brushSlider.addEventListener('input', (e) => {
        currentSize = parseInt(e.target.value);
    });

    // Clear Canvas
    const clearBtn = document.getElementById('stickies-clear');
    clearBtn.addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    // Drawing Events
    function getMousePos(e) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    canvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
        const pos = getMousePos(e);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        
        ctx.lineWidth = currentTool === 'eraser' ? currentSize * 3 : currentSize;
        ctx.strokeStyle = currentTool === 'eraser' ? '#ffffff' : currentColor;
        ctx.globalCompositeOperation = currentTool === 'eraser' ? 'destination-out' : 'source-over';
    });

    canvas.addEventListener('mousemove', (e) => {
        if (!isDrawing) return;
        const pos = getMousePos(e);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
    });

    canvas.addEventListener('mouseup', () => {
        if (isDrawing) {
            ctx.closePath();
            isDrawing = false;
        }
    });

    canvas.addEventListener('mouseout', () => {
        if (isDrawing) {
            ctx.closePath();
            isDrawing = false;
        }
    });
}
