/**
 * Shri Thakur Ji Mandir Kalyan Niwas
 * Main JavaScript File
 * Handles language toggle, navigation, smooth scrolling, and donation modal
 */

document.addEventListener('DOMContentLoaded', function() {
    // ===== DOM Elements =====
    const header = document.getElementById('header');
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');
    const navLinks = document.querySelectorAll('.nav-link');
    const langToggle = document.getElementById('lang-toggle');
    const donationModal = document.getElementById('donation-modal');
    const donateBtnHeader = document.getElementById('donate-btn-header');
    const donateBtnFooter = document.getElementById('donate-btn-footer');
    const modalClose = document.getElementById('modal-close');

    // ===== Language State =====
    let currentLang = 'hi'; // Default language is Hindi

    // ===== Language Toggle Functionality =====
    function updateLanguage(lang) {
        currentLang = lang;
        
        // Update all elements with data-hi and data-en attributes
        const translatableElements = document.querySelectorAll('[data-hi][data-en]');
        
        translatableElements.forEach(element => {
            const text = lang === 'hi' ? element.dataset.hi : element.dataset.en;
            
            // Check if element has child elements that need to be preserved
            if (element.querySelector('span') && element.tagName !== 'A' && element.tagName !== 'BUTTON') {
                // Handle elements with nested spans (like titles)
                const spans = element.querySelectorAll('span[data-hi][data-en]');
                spans.forEach(span => {
                    span.textContent = lang === 'hi' ? span.dataset.hi : span.dataset.en;
                });
            } else if (element.querySelector('span') && (element.tagName === 'A' || element.tagName === 'BUTTON')) {
                // Handle buttons and links with icon + text
                const textSpan = element.querySelector('span');
                if (textSpan) {
                    textSpan.textContent = text;
                }
            } else {
                // Handle simple text elements
                element.innerHTML = text;
            }
        });

        // Update language toggle button text
        langToggle.querySelector('.lang-text').textContent = lang === 'hi' ? 'EN' : 'हि';
        
        // Update body class for font family
        document.body.classList.toggle('lang-en', lang === 'en');
        
        // Update html lang attribute
        document.documentElement.lang = lang;
        
        // Store preference
        localStorage.setItem('preferredLanguage', lang);
    }

    // Language toggle click handler
    langToggle.addEventListener('click', function() {
        const newLang = currentLang === 'hi' ? 'en' : 'hi';
        updateLanguage(newLang);
    });

    // Check for stored language preference
    const storedLang = localStorage.getItem('preferredLanguage');
    if (storedLang) {
        updateLanguage(storedLang);
    }

    // ===== Mobile Navigation =====
    // Open menu
    navToggle.addEventListener('click', function() {
        navMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    // Close menu
    navClose.addEventListener('click', function() {
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    });

    // Close menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target) && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // ===== Header Scroll Effect =====
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        // Add scrolled class for styling
        if (currentScrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScrollY = currentScrollY;
    });

    // ===== Smooth Scrolling =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== Active Navigation Link =====
    const sections = document.querySelectorAll('section[id]');
    
    function updateActiveLink() {
        const scrollY = window.scrollY;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - header.offsetHeight - 100;
            const sectionId = section.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            
            if (correspondingLink) {
                if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    correspondingLink.classList.add('active');
                }
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink();

    // ===== Donation Modal =====
    function openModal() {
        donationModal.classList.add('active');
        document.body.classList.add('modal-open');
    }

    function closeModal() {
        donationModal.classList.remove('active');
        document.body.classList.remove('modal-open');
    }

    // Open modal buttons
    donateBtnHeader.addEventListener('click', openModal);
    donateBtnFooter.addEventListener('click', openModal);

    // Close modal
    modalClose.addEventListener('click', closeModal);

    // Close modal when clicking overlay
    donationModal.addEventListener('click', function(e) {
        if (e.target === donationModal) {
            closeModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && donationModal.classList.contains('active')) {
            closeModal();
        }
    });

    // ===== UPI Button Handlers =====
    const upiButtons = document.querySelectorAll('.upi-btn');
    
    upiButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // In a real implementation, these would open the respective UPI apps
            // For now, we'll show a message
            const appName = this.querySelector('span').textContent;
            alert(`${currentLang === 'hi' ? 'कृपया अपना' : 'Please open your'} ${appName} ${currentLang === 'hi' ? 'ऐप खोलें और QR कोड स्कैन करें या UPI ID का उपयोग करें।' : 'app and scan the QR code or use UPI ID.'}`);
        });
    });

    // ===== Scroll Reveal Animation =====
    const revealElements = document.querySelectorAll('.highlight-card, .review-card, .timing-card, .contact-card, .about-text p');
    
    const revealObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in', 'visible');
                observer.unobserve(entry.target);
            }
        });
    }, revealObserverOptions);

    revealElements.forEach(element => {
        element.classList.add('fade-in');
        revealObserver.observe(element);
    });

    // ===== Diya Animation Enhancement =====
    function createDiyaGlow() {
        const diyas = document.querySelectorAll('.diya-icon, .floating-diya');
        diyas.forEach(diya => {
            // Random slight opacity variation for natural flame effect
            setInterval(() => {
                const opacity = 0.8 + Math.random() * 0.2;
                diya.style.opacity = opacity;
            }, 200);
        });
    }
    
    createDiyaGlow();

    // ===== Bell Sound Effect (Optional - Commented Out) =====
    // Uncomment this section if you want to add bell sound on scroll
    /*
    const bellIcon = document.querySelector('.scroll-indicator .bell-icon');
    let bellPlayed = false;
    
    window.addEventListener('scroll', function() {
        if (!bellPlayed && window.scrollY > 100) {
            // Play bell sound here
            bellPlayed = true;
        }
    });
    */

    // ===== Preloader (Optional Enhancement) =====
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });

    // ===== Console Message =====
    console.log('%c🙏 जय श्री ठाकुर जी 🙏', 'font-size: 20px; color: #FF9933; font-weight: bold;');
    console.log('%cShri Thakur Ji Mandir Kalyan Niwas', 'font-size: 14px; color: #800000;');
    console.log('%cA sacred place of devotion, peace, and divine experience', 'font-size: 12px; color: #5D4037;');
});

// ===== Service Worker Registration (For Future PWA Support) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Service worker can be registered here for PWA support
        // navigator.serviceWorker.register('/sw.js');
    });
}
