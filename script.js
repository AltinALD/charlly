/* =========================
   HAMBURGER MENU
========================= */
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
        navLinks.classList.toggle("active");
        hamburger.classList.toggle("active");

        // Lock scroll on mobile menu open
        document.body.style.overflow =
            navLinks.classList.contains("active") ? "hidden" : "";
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("active");
            hamburger.classList.remove("active");
            document.body.style.overflow = "";
        });
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
        if (
            navLinks.classList.contains("active") &&
            !hamburger.contains(e.target) &&
            !navLinks.contains(e.target)
        ) {
            navLinks.classList.remove("active");
            hamburger.classList.remove("active");
            document.body.style.overflow = "";
        }
    });
}

/* =========================
   HERO SLIDESHOW
========================= */
const heroSlideshow = document.querySelector(".hero-slideshow");
const slides = document.querySelectorAll(".hero-slideshow .slide");
const heroContent = document.querySelector(".hero-content");

const heroImages = [
    "images/hero1.jpg",
    "images/hero2.jpg",
    "images/hero3.jpg",
    "images/hero1.jpg" // Reuse first image for 4th slide, or add hero4.jpg if available
];

let heroIndex = 0;
let slideshowInterval;

function initSlideshow() {
    if (!heroSlideshow || !slides) return;

    // Initialize first slide
    slides[0].classList.add("active");

    // Set background images
    slides.forEach((slide, index) => {
        if (heroImages[index]) {
            slide.style.backgroundImage = `url('${heroImages[index]}')`;
        }
    });

    // Start slideshow
    startSlideshow();
}

function startSlideshow() {
    // Clear any existing interval
    if (slideshowInterval) {
        clearInterval(slideshowInterval);
    }
    slideshowInterval = setInterval(() => {
        changeSlide();
    }, 5000); // Change slide every 5 seconds
}

function changeSlide() {
    if (!slides || slides.length === 0) return;

    // Remove active class from current slide
    slides[heroIndex].classList.remove("active");

    // Move to next slide
    heroIndex = (heroIndex + 1) % slides.length;

    // Add active class to next slide
    slides[heroIndex].classList.add("active");

    // Animate hero content
    animateHeroContent();
}

function animateHeroContent() {
    if (!heroContent) return;

    // Remove fade-in class
    heroContent.classList.remove("fade-in");

    // Trigger reflow
    void heroContent.offsetWidth;

    // Add fade-in class for animation
    heroContent.classList.add("fade-in");
}

// Pause slideshow on hover (optional)
if (heroSlideshow) {
    heroSlideshow.addEventListener("mouseenter", () => {
        if (slideshowInterval) {
            clearInterval(slideshowInterval);
        }
    });

    heroSlideshow.addEventListener("mouseleave", () => {
        startSlideshow();
    });
}

// Initialize slideshow on load
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSlideshow);
} else {
    initSlideshow();
}

/* =========================
   FLOATING LABELS FOR FORM
========================= */
const formInputs = document.querySelectorAll("#contactForm input, #contactForm textarea");

formInputs.forEach(input => {
    const formGroup = input.closest(".form-group");
    
    if (!formGroup) return;

    // Function to update label state
    function updateLabelState() {
        if (input.value.trim()) {
            formGroup.classList.add("filled");
            input.classList.add("has-value");
        } else {
            formGroup.classList.remove("filled");
            input.classList.remove("has-value");
        }
    }

    // Handle focus - CSS will handle the styling
    input.addEventListener("focus", function() {
        updateLabelState();
    });

    // Handle blur
    input.addEventListener("blur", function() {
        updateLabelState();
    });

    // Handle input change
    input.addEventListener("input", function() {
        updateLabelState();
    });

    // Handle initial state
    updateLabelState();
});

/* =========================
   CONTACT FORM HANDLING
========================= */
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

if (contactForm) {
    contactForm.addEventListener("submit", function(e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        // Reset message
        formMessage.textContent = "";
        formMessage.className = "form-message";

        // Validate form
        if (!data.vorname || !data.nachname || !data.email || !data.nachricht) {
            showFormMessage("Bitte füllen Sie alle Pflichtfelder aus.", "error");
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showFormMessage("Bitte geben Sie eine gültige E-Mail-Adresse ein.", "error");
            return;
        }

        // Simulate form submission (replace with actual form handling)
        showFormMessage("Nachricht wird gesendet...", "success");

        // In a real application, you would send the data to a server here
        setTimeout(() => {
            showFormMessage("Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet. Wir melden uns bald bei Ihnen.", "success");
            contactForm.reset();
            
            // Reset floating labels
            formInputs.forEach(input => {
                const formGroup = input.closest(".form-group");
                if (formGroup) {
                    formGroup.classList.remove("filled");
                    input.classList.remove("has-value");
                }
            });
        }, 1500);
    });
}

function showFormMessage(message, type) {
    if (!formMessage) return;

    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    formMessage.style.display = "block";

    // Auto-hide after 5 seconds
    setTimeout(() => {
        formMessage.style.display = "none";
    }, 5000);
}

/* =========================
   STICKY WHATSAPP BUTTON
========================= */
const stickyWhatsAppBtn = document.getElementById("stickyWhatsAppBtn");

if (stickyWhatsAppBtn) {
    let lastScrollTop = 0;
    let scrollTimer = null;

    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Show button after scrolling down 300px
        if (scrollTop > 300) {
            stickyWhatsAppBtn.classList.add("visible");
        } else {
            stickyWhatsAppBtn.classList.remove("visible");
        }

        // Hide button when scrolling down quickly
        if (scrollTop > lastScrollTop && scrollTop > 500) {
            stickyWhatsAppBtn.style.transform = "scale(0.8)";
            stickyWhatsAppBtn.style.opacity = "0.7";
        } else {
            stickyWhatsAppBtn.style.transform = "scale(1)";
            stickyWhatsAppBtn.style.opacity = "1";
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;

        // Clear existing timer
        if (scrollTimer) {
            clearTimeout(scrollTimer);
        }

        // Show button after scrolling stops
        scrollTimer = setTimeout(() => {
            if (scrollTop > 300) {
                stickyWhatsAppBtn.style.transform = "scale(1)";
                stickyWhatsAppBtn.style.opacity = "1";
            }
        }, 150);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Initial check
    handleScroll();
}

/* =========================
   SMOOTH SCROLL
========================= */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        const href = this.getAttribute("href");
        
        // Skip empty hrefs
        if (href === "#" || href === "#!") {
            e.preventDefault();
            return;
        }

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();
        const offset = 90; // Account for fixed header

        const targetPosition =
            target.getBoundingClientRect().top + window.pageYOffset - offset;

        window.scrollTo({
            top: targetPosition,
            behavior: "smooth"
        });

        // Close mobile menu if open
        if (navLinks && navLinks.classList.contains("active")) {
            navLinks.classList.remove("active");
            if (hamburger) hamburger.classList.remove("active");
            document.body.style.overflow = "";
        }
    });
});

/* =========================
   HEADER SCROLL EFFECT
========================= */
const header = document.querySelector("header");
let lastScroll = 0;

window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll <= 0) {
        header.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.08)";
    } else if (currentScroll > lastScroll && currentScroll > 100) {
        // Scrolling down
        header.style.boxShadow = "0 4px 16px rgba(0, 0, 0, 0.12)";
    } else {
        // Scrolling up
        header.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.08)";
    }

    lastScroll = currentScroll;
}, { passive: true });

/* =========================
   CARD ANIMATIONS ON SCROLL
========================= */
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
        }
    });
}, observerOptions);

// Observe cards for animation
document.querySelectorAll(".card, .info-card, .about-content, .about-image").forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
});

// Accordion for service cards
const cards = document.querySelectorAll('.service-cards .card');

cards.forEach(card => {
    card.addEventListener('click', () => {
        // Toggle active class
        card.classList.toggle('active');
    });
});




/* =========================
   PERFORMANCE OPTIMIZATION
========================= */
// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimize scroll handlers
const optimizedScrollHandler = debounce(() => {
    // Add any scroll-based optimizations here
}, 100);

window.addEventListener("scroll", optimizedScrollHandler, { passive: true });
