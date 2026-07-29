export function initFlipbook() {
    const bookIcon = document.getElementById('icon-book');
    const flipbookWindow = document.getElementById('flipbook-window');
    const closeBtn = document.getElementById('close-flipbook');
    const header = document.getElementById('flipbook-header');
    
    if (!bookIcon || !flipbookWindow) return;

    let pageFlip = null;

    // Window visibility
    bookIcon.addEventListener('click', () => {
        flipbookWindow.style.display = 'flex';
        flipbookWindow.style.zIndex = "100";
        
        // Initialize StPageFlip only once when opened
        if (!pageFlip) {
            // Need a slight delay to ensure DOM is rendered and dimensions are computable
            setTimeout(() => {
                const flipbookEl = document.getElementById('flipbook');
                
                // Initialize the library
                // @ts-ignore (Assuming StPageFlip is globally available via CDN)
                pageFlip = new St.PageFlip(flipbookEl, {
                    width: 400, // base page width
                    height: 500, // base page height
                    size: "fixed",
                    minWidth: 400,
                    maxWidth: 400,
                    minHeight: 500,
                    maxHeight: 500,
                    maxShadowOpacity: 0.5,
                    showCover: false,
                    mobileScrollSupport: false
                });

                // Load pages
                pageFlip.loadFromHTML(document.querySelectorAll('.page'));

                // Bind navigation arrows
                document.getElementById('flip-prev').addEventListener('click', () => {
                    pageFlip.flipPrev();
                });
                document.getElementById('flip-next').addEventListener('click', () => {
                    pageFlip.flipNext();
                });
            }, 100);
        }
    });

    closeBtn.addEventListener('click', () => {
        flipbookWindow.style.display = 'none';
    });

    // Draggable window logic
    let isDraggingWindow = false;
    let offsetX = 0;
    let offsetY = 0;

    header.addEventListener('mousedown', (e) => {
        if(e.target.tagName === 'BUTTON') return;
        isDraggingWindow = true;
        const rect = flipbookWindow.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        flipbookWindow.style.zIndex = "101";
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDraggingWindow) return;
        let newX = e.clientX - offsetX;
        let newY = e.clientY - offsetY;
        
        newX = Math.max(0, Math.min(newX, window.innerWidth - 100));
        newY = Math.max(0, Math.min(newY, window.innerHeight - 40));

        flipbookWindow.style.left = `${newX}px`;
        flipbookWindow.style.top = `${newY}px`;
        flipbookWindow.style.transform = 'none';
    });

    document.addEventListener('mouseup', () => {
        isDraggingWindow = false;
    });
}
