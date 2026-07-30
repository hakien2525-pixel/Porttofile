export async function initCV() {
    const profileIcon = document.getElementById('icon-profile');
    
    if (!profileIcon) return;

    let isInitialized = false;

    // Open CV Quick Look
    profileIcon.addEventListener('click', async () => {
        if (!isInitialized) {
            try {
                const response = await fetch('components/cv.html');
                const html = await response.text();
                document.getElementById('modals-container').insertAdjacentHTML('beforeend', html);
                setupCVLogic();
                isInitialized = true;
            } catch (err) {
                console.error("Failed to load CV UI", err);
                return;
            }
        }
        const cvWindow = document.getElementById('cv-window');
        cvWindow.style.display = 'flex';
        // Bring to front
        cvWindow.style.zIndex = "100";
    });
}

function setupCVLogic() {
    const cvWindow = document.getElementById('cv-window');
    const closeBtn = document.getElementById('close-cv');
    const header = document.getElementById('cv-header');

    // Close CV Quick Look
    closeBtn.addEventListener('click', () => {
        cvWindow.style.display = 'none';
    });

    // Upload logic
    const uploadBtn = document.getElementById('cv-upload-btn');
    const uploadInput = document.getElementById('cv-upload-input');
    const cvIframe = document.querySelector('.cv-iframe');
    const cvOpenLink = document.getElementById('cv-open-link');

    if (uploadBtn && uploadInput && cvIframe) {
        uploadBtn.addEventListener('click', () => {
            uploadInput.click();
        });

        uploadInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const fileURL = URL.createObjectURL(file);
                cvIframe.src = fileURL;
                if (cvOpenLink) cvOpenLink.href = fileURL;
                cvIframe.style.display = 'block';
                document.getElementById('cv-placeholder').style.display = 'none';
                document.querySelector('.cv-filename').textContent = file.name;
                document.querySelector('.cv-title').textContent = file.name;
            }
        });
    }

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
