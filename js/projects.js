export async function initProjects() {
    const projectIcon = document.getElementById('icon-project');
    
    if (!projectIcon) return;

    let isInitialized = false;

    // Toggle window visibility
    projectIcon.addEventListener('click', async () => {
        if (!isInitialized) {
            try {
                const response = await fetch('components/projects.html');
                const html = await response.text();
                document.getElementById('modals-container').insertAdjacentHTML('beforeend', html);
                setupProjectsLogic();
                isInitialized = true;
            } catch (err) {
                console.error("Failed to load Projects UI", err);
                return;
            }
        }
        const projectsWindow = document.getElementById('projects-window');
        projectsWindow.style.display = 'flex';
        // Bring to front
        projectsWindow.style.zIndex = "100";
    });
}

function setupProjectsLogic() {
    const projectsWindow = document.getElementById('projects-window');
    const closeBtn = document.getElementById('close-projects');
    const closeBtnMac = document.getElementById('close-projects-mac');
    const header = document.getElementById('projects-header');
    const grid = document.getElementById('projects-grid');

    // Default Projects Data
    const defaultProjects = [
        {
            id: 'p1',
            img: 'images/ảnh dự án Alphamini.png',
            year: '2026',
            title: 'Dự án Alphamini',
            desc: 'Mô tả dự án Alphamini, các tính năng và vai trò của tôi trong dự án.',
            category: 'UI/UX Design',
            filter: 'uiux',
            link: '#'
        },
        {
            id: 'p2',
            img: 'images/ảnh dự án gia sư ảo.png',
            year: '2025',
            title: 'Dự án Gia Sư Ảo',
            desc: 'Ứng dụng hỗ trợ học tập với trí tuệ nhân tạo, thiết kế giao diện thân thiện.',
            category: 'Web Dev',
            filter: 'dev',
            link: '#'
        },
        {
            id: 'p3',
            img: 'images/ảnh dự án sắc việt.png',
            year: '2024',
            title: 'Dự án Sắc Việt',
            desc: 'Nền tảng tôn vinh vẻ đẹp văn hóa và con người Việt Nam.',
            category: 'Awards',
            filter: 'awards',
            link: '#'
        }
    ];

    let projects = JSON.parse(localStorage.getItem('hakien_projects')) || defaultProjects;

    function saveProjects() {
        localStorage.setItem('hakien_projects', JSON.stringify(projects));
    }

    function renderGrid(filter = 'all') {
        grid.innerHTML = '';
        projects.forEach(p => {
            if (filter !== 'all' && p.filter !== filter) return;

            const card = document.createElement('div');
            card.className = 'project-card';
            card.innerHTML = `
                <div class="project-img-wrapper">
                    <img src="${p.img}" alt="${p.title}" class="project-img" title="Double click to change image">
                </div>
                <div class="project-info">
                    <div class="project-year" contenteditable="true">${p.year}</div>
                    <div class="project-title" contenteditable="true">${p.title}</div>
                    <div class="project-desc" contenteditable="true">${p.desc}</div>
                    <div class="project-bottom">
                        <div class="project-category" contenteditable="true">${p.category}</div>
                        <a href="${p.link}" target="_blank" class="project-link-btn" title="Double click to edit Link">↗ Link / Tài liệu</a>
                    </div>
                </div>
            `;

            // Live edit text
            const textFields = card.querySelectorAll('[contenteditable]');
            textFields.forEach(field => {
                // Prevent drag/click from opening anything while editing
                field.addEventListener('mousedown', e => e.stopPropagation());
                field.addEventListener('input', (e) => {
                    const className = field.className;
                    if (className.includes('year')) p.year = field.innerText;
                    if (className.includes('title')) p.title = field.innerText;
                    if (className.includes('desc')) p.desc = field.innerText;
                    if (className.includes('category')) p.category = field.innerText;
                    saveProjects();
                });
            });

            // Live edit image
            const img = card.querySelector('.project-img');
            img.addEventListener('dblclick', (e) => {
                e.stopPropagation();
                const newUrl = prompt('Enter new image URL:', p.img);
                if (newUrl && newUrl.trim() !== '') {
                    p.img = newUrl.trim();
                    img.src = p.img;
                    saveProjects();
                }
            });

            // Live edit link
            const linkBtn = card.querySelector('.project-link-btn');
            linkBtn.addEventListener('dblclick', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const newUrl = prompt('Nhập đường link tài liệu / website dự án:', p.link);
                if (newUrl !== null) {
                    p.link = newUrl.trim() || '#';
                    linkBtn.href = p.link;
                    saveProjects();
                }
            });
            // Prevent dragging from link
            linkBtn.addEventListener('mousedown', e => e.stopPropagation());

            grid.appendChild(card);
        });
    }

    renderGrid();

    // Filters Logic
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderGrid(btn.dataset.filter);
        });
    });

    // Hero Live Edit
    const heroFields = projectsWindow.querySelectorAll('[data-prj-edit]');
    heroFields.forEach(field => {
        const key = 'hakien_proj_' + field.getAttribute('data-prj-edit');
        const saved = localStorage.getItem(key);
        if (saved) field.innerHTML = saved;

        field.addEventListener('mousedown', e => e.stopPropagation());
        field.addEventListener('input', (e) => {
            localStorage.setItem(key, e.target.innerHTML);
        });
    });

    // Close window
    const closeWindow = () => {
        projectsWindow.style.display = 'none';
    };
    closeBtn.addEventListener('click', closeWindow);
    if (closeBtnMac) closeBtnMac.addEventListener('click', closeWindow);

    // Draggable window logic
    let isDragging = false;
    let offsetX = 0, offsetY = 0;

    header.addEventListener('mousedown', (e) => {
        if(e.target.tagName === 'BUTTON' || e.target.classList.contains('window-btn')) return;
        isDragging = true;
        const rect = projectsWindow.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        projectsWindow.style.zIndex = "101";
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        let newX = e.clientX - offsetX;
        let newY = e.clientY - offsetY;
        
        newX = Math.max(0, Math.min(newX, window.innerWidth - 100));
        newY = Math.max(0, Math.min(newY, window.innerHeight - 40));

        projectsWindow.style.left = `${newX}px`;
        projectsWindow.style.top = `${newY}px`;
        projectsWindow.style.transform = 'none';
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
}
