export async function initNotebook() {
    const notebookIcon = document.getElementById('icon-notebook');
    
    if (!notebookIcon) return;

    let isInitialized = false;

    // Toggle window visibility
    notebookIcon.addEventListener('click', async () => {
        if (!isInitialized) {
            try {
                const response = await fetch('components/notebook.html');
                const html = await response.text();
                document.getElementById('modals-container').insertAdjacentHTML('beforeend', html);
                setupNotebookLogic();
                isInitialized = true;
            } catch (err) {
                console.error("Failed to load notebook UI", err);
                return;
            }
        }
        const notebookWindow = document.getElementById('notebook-window');
        notebookWindow.style.display = 'flex';
        // Bring to front
        notebookWindow.style.zIndex = "100";
    });
}

function setupNotebookLogic() {
    const notebookWindow = document.getElementById('notebook-window');
    const closeBtn = document.getElementById('close-notebook');
    const header = document.getElementById('notebook-header');
    const noteListEl = document.querySelector('.note-list');
    const notebookContentEl = document.querySelector('.notebook-content');

    // Close window
    closeBtn.addEventListener('click', () => {
        notebookWindow.style.display = 'none';
    });

    // Default Notes
    const defaultNotes = [
        { id: 'ai', title: 'artificial_intelligence.md', date: '29/07', content: '— thoughts on ai\n\nDesign is one of the few functions that ends up touching almost every other function.\n\nThe job changes because of that.\n\nVisual craft is the baseline. The rest is communication, alignment, judgment, and making decisions under ambiguity.\n\nA lot of the work is translation.\n\nBusiness goals into product decisions.\nEngineering constraints into tradeoffs.\nResearch into something a team can act on.\nDifferent opinions into a direction.\n\nThis is why the role keeps expanding.' },
        { id: 'philosophy', title: 'philosophy.md', date: '29/07', content: '— thoughts on design philosophy\n\nSimplicity is the ultimate sophistication.\n\nFocus on what matters most and remove the rest.' },
        { id: 'values', title: 'values.md', date: '29/07', content: '— core values\n\n1. Empathy for the user.\n2. Craftsmanship in the details.\n3. Continuous learning.' }
    ];

    let notes = JSON.parse(localStorage.getItem('hakien_notes')) || defaultNotes;
    let activeNoteId = notes[0].id;

    function saveNotes() {
        localStorage.setItem('hakien_notes', JSON.stringify(notes));
    }

    function renderSidebar() {
        noteListEl.innerHTML = '';
        notes.forEach(note => {
            const li = document.createElement('li');
            li.className = note.id === activeNoteId ? 'active' : '';
            li.textContent = note.title;
            
            // Switch tab or Rename if already active
            li.addEventListener('click', (e) => {
                if (note.id === activeNoteId) {
                    // Enter rename mode
                    e.stopPropagation();
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.value = note.title;
                    input.className = 'rename-input';
                    
                    li.innerHTML = '';
                    li.appendChild(input);
                    input.focus();

                    const saveRename = () => {
                        note.title = input.value.trim() || 'untitled.md';
                        saveNotes();
                        renderSidebar();
                        renderContent();
                    };

                    input.addEventListener('blur', saveRename);
                    input.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter') saveRename();
                        // Also prevent space from triggering dino jump just in case
                        if (e.key === ' ') e.stopPropagation();
                    });
                } else {
                    // Just switch tab
                    activeNoteId = note.id;
                    renderSidebar();
                    renderContent();
                }
            });

            noteListEl.appendChild(li);
        });
    }

    function renderContent() {
        const activeNote = notes.find(n => n.id === activeNoteId);
        if (!activeNote) return;

        notebookContentEl.innerHTML = `
            <div class="note-pane active">
                <p class="note-meta">Note · ${activeNote.date}</p>
                <p class="note-title">${activeNote.title}</p>
                <textarea class="note-textarea">${activeNote.content}</textarea>
            </div>
        `;

        const textarea = notebookContentEl.querySelector('.note-textarea');
        textarea.addEventListener('input', (e) => {
            activeNote.content = e.target.value;
            saveNotes();
        });
    }

    // Initialize UI
    renderSidebar();
    renderContent();

    closeBtn.addEventListener('click', () => {
        notebookWindow.style.display = 'none';
    });

    // Draggable window logic
    let isDragging = false;
    let offsetX = 0, offsetY = 0;

    header.addEventListener('mousedown', (e) => {
        isDragging = true;
        const rect = notebookWindow.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        notebookWindow.style.zIndex = "101";
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        let newX = e.clientX - offsetX;
        let newY = e.clientY - offsetY;
        newX = Math.max(0, Math.min(newX, window.innerWidth - 100));
        newY = Math.max(0, Math.min(newY, window.innerHeight - 40));
        notebookWindow.style.left = `${newX}px`;
        notebookWindow.style.top = `${newY}px`;
        notebookWindow.style.transform = 'none';
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
}
