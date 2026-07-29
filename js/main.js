document.addEventListener('DOMContentLoaded', () => {
    /* 
        1. Scroll Reveal Animation 
    */
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };
    
    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);
    
    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    /* 
        2. Sticky Header 
    */
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    /* 
        3. Smooth Scrolling for Navigation Links
    */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
                
                // Update active class
                document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    /*
        4. Setup for future 3D Canvas integration
        - Currently empty, but ready to host Three.js or other WebGL libraries
    */
    const init3DEnvironment = () => {
        console.log("3D Environment placeholder ready. Integrate Three.js here later.");
        // Example: Setup Scene, Camera, Renderer, then append to #canvas-container
    };
    
    init3DEnvironment();
});
