document.addEventListener('DOMContentLoaded', function() {
    try {
        const animateSkills = () => {
    const skillItems = document.querySelectorAll('.skill-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progress = entry.target.querySelector('.progress');
                const percent = entry.target.querySelector('.percent');
                const width = percent.textContent;
                
                // Set custom property for animation
                progress.style.setProperty('--progress', width);
                
                // Add animation classes
                progress.classList.add('animate');
                percent.classList.add('show');
                
                // Remove observer after animation
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    skillItems.forEach(skill => observer.observe(skill));
};

// Call the function after DOM is loaded
animateSkills();
        // Dark mode toggle
        const toggleBtn = document.getElementById('themeToggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                document.body.classList.toggle('dark-mode');
                toggleBtn.textContent = 
                    document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
            });
        }

        // Scroll to top button
        const scrollBtn = document.getElementById('scrollTop');
        if (scrollBtn) {
            window.addEventListener('scroll', () => {
                scrollBtn.classList.toggle('show', window.scrollY > 300);
            });

            scrollBtn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        // Mobile menu functionality
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navLinks = document.querySelector('.nav-links');

        if (mobileMenuBtn && navLinks) {
            mobileMenuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                navLinks.classList.toggle('active');
                mobileMenuBtn.innerHTML = navLinks.classList.contains('active') 
                    ? '<i class="fas fa-times"></i>' 
                    : '<i class="fas fa-bars"></i>';
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (navLinks.classList.contains('active') && !e.target.closest('.nav-container')) {
                    navLinks.classList.remove('active');
                    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                }
            });

            // Close mobile menu when clicking a link
            navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    if (window.innerWidth < 768) {
                        navLinks.classList.remove('active');
                        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                    }
                });
            });
        }

        // Initialize AOS
        if (typeof AOS !== 'undefined') {
            AOS.init({
                disable: window.innerWidth < 768,
                once: true,
                duration: 800,
                offset: 100
            });
        }
    } catch (error) {
        console.error('Error initializing scripts:', error);
    }
});