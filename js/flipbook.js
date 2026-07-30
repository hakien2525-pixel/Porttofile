export async function initFlipbook() {
    const bookIcon = document.getElementById('icon-book');
    let pageFlip = null;
    let isInitialized = false;

    if (!bookIcon) return;

    bookIcon.addEventListener('click', async () => {
        if (!isInitialized) {
            try {
                const response = await fetch('components/flipbook.html');
                const html = await response.text();
                document.getElementById('modals-container').insertAdjacentHTML('beforeend', html);
                pageFlip = setupFlipbookLogic();
                isInitialized = true;
            } catch (err) {
                console.error("Failed to load flipbook UI", err);
                return;
            }
        }
        const flipbookWindow = document.getElementById('flipbook-window');
        flipbookWindow.style.display = 'flex';
        flipbookWindow.style.zIndex = "100";

        if (pageFlip) {
            pageFlip.update();
        }
    });
}

function setupFlipbookLogic() {
    const flipbookWindow = document.getElementById('flipbook-window');
    const closeBtn = document.getElementById('close-flipbook');
    const header = document.getElementById('flipbook-header');
    
    let pageFlip = null;
    
    // Initialize StPageFlip
    setTimeout(() => {
        const flipbookEl = document.getElementById('flipbook');
        if (flipbookEl) {
            
            // --- LIVE EDIT LOGIC ---
            
            // 1. Restore Text
            const textNodes = flipbookEl.querySelectorAll('[data-book-edit]');
            textNodes.forEach(node => {
                const key = 'flipbook_text_' + node.getAttribute('data-book-edit');
                const saved = localStorage.getItem(key);
                if (saved) node.innerHTML = saved;
                
                // Prevent StPageFlip from dragging when clicking text
                node.addEventListener('mousedown', e => e.stopPropagation());
                node.addEventListener('touchstart', e => e.stopPropagation());
                
                // Save on input
                node.addEventListener('input', (e) => {
                    localStorage.setItem(key, e.target.innerHTML);
                });
            });

            // 2. Restore and Edit Images
            const imgNodes = flipbookEl.querySelectorAll('[data-book-img]');
            imgNodes.forEach(img => {
                const key = 'flipbook_img_' + img.getAttribute('data-book-img');
                const saved = localStorage.getItem(key);
                if (saved) img.src = saved;

                img.style.cursor = 'pointer';
                img.title = 'Double click to change image';

                // Prevent dragging when clicking image
                img.addEventListener('mousedown', e => e.stopPropagation());
                img.addEventListener('touchstart', e => e.stopPropagation());

                img.addEventListener('dblclick', () => {
                    const newUrl = prompt('Enter new image URL:', img.src);
                    if (newUrl && newUrl.trim() !== '') {
                        img.src = newUrl.trim();
                        localStorage.setItem(key, newUrl.trim());
                    }
                });
            });

            // -----------------------

            pageFlip = new St.PageFlip(flipbookEl, {
                width: 400,
                height: 500,
                size: "fixed",
                minWidth: 400,
                maxWidth: 400,
                minHeight: 500,
                maxHeight: 500,
                maxShadowOpacity: 0.5,
                showCover: true,
                mobileScrollSupport: false
            });

            pageFlip.loadFromHTML(document.querySelectorAll('.page'));

            document.getElementById('flip-prev').addEventListener('click', () => {
                pageFlip.flipPrev();
            });
            document.getElementById('flip-next').addEventListener('click', () => {
                pageFlip.flipNext();
            });

            // Center the book when closed
            const wrapper = document.getElementById('book-wrapper');
            wrapper.style.transition = 'transform 0.4s ease';
            wrapper.style.transform = 'translateX(-200px)'; // Starts at cover

            pageFlip.on('flip', (e) => {
                const pageCount = pageFlip.getPageCount();
                if (e.data === 0) {
                    wrapper.style.transform = 'translateX(-200px)'; // Cover
                } else if (e.data === pageCount - 1) {
                    wrapper.style.transform = 'translateX(200px)'; // Back cover
                } else {
                    wrapper.style.transform = 'translateX(0)'; // Opened
                }
            });
        }
    }, 100);

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

    return pageFlip;
}
