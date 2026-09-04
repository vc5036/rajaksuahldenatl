/**
 * SHRI AASHIRVAD DENTAL HOSPITAL - MAIN JAVASCRIPT
 * Location: Padrauna, Uttar Pradesh
 * Controls: Sticky Header, ScrollSpy, Mobile Drawer, Scroll Reveal, Counters,
 *           Testimonial Slider, Lightbox, Review Modal, WhatsApp Form Generator.
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    /* ==========================================================================
       1. STICKY HEADER & SCROLLSPY NAVIGATION
       ========================================================================== */
    const siteHeader = document.getElementById('site-header');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const sections = document.querySelectorAll('section[id]');

    function handleScrollHeader() {
        if (window.scrollY > 40) {
            siteHeader.classList.add('scrolled');
        } else {
            siteHeader.classList.remove('scrolled');
        }
    }

    function handleScrollSpy() {
        const scrollPosition = window.scrollY + 120;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });

                mobileNavLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', () => {
        handleScrollHeader();
        handleScrollSpy();
    });
    handleScrollHeader();

    /* ==========================================================================
       2. MOBILE DRAWER NAVIGATION
       ========================================================================== */
    const mobileToggleBtn = document.getElementById('mobile-toggle-btn');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const drawerOverlay = document.getElementById('drawer-overlay');
    const drawerCloseBtn = document.getElementById('drawer-close-btn');

    function openMobileDrawer() {
        mobileDrawer.classList.add('active');
        mobileToggleBtn.classList.add('active');
        mobileToggleBtn.setAttribute('aria-expanded', 'true');
        mobileDrawer.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileDrawer() {
        mobileDrawer.classList.remove('active');
        mobileToggleBtn.classList.remove('active');
        mobileToggleBtn.setAttribute('aria-expanded', 'false');
        mobileDrawer.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    if (mobileToggleBtn) {
        mobileToggleBtn.addEventListener('click', () => {
            if (mobileDrawer.classList.contains('active')) {
                closeMobileDrawer();
            } else {
                openMobileDrawer();
            }
        });
    }

    if (drawerOverlay) drawerOverlay.addEventListener('click', closeMobileDrawer);
    if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeMobileDrawer);

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', closeMobileDrawer);
    });

    /* ==========================================================================
       3. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
       ========================================================================== */
    const revealElements = document.querySelectorAll('.reveal-fade, .reveal-up, .reveal-left, .reveal-right');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.15
    });

    revealElements.forEach(el => revealObserver.observe(el));

    /* ==========================================================================
       4. ANIMATED COUNTERS FOR STATISTICS
       ========================================================================== */
    const counters = document.querySelectorAll('.counter');
    let countersStarted = false;

    function startCounters() {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.innerText = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.innerText = target;
                }
            };
            updateCounter();
        });
    }

    const statsBanner = document.querySelector('.stats-banner');
    if (statsBanner) {
        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !countersStarted) {
                countersStarted = true;
                startCounters();
            }
        }, { threshold: 0.3 });
        statsObserver.observe(statsBanner);
    }

    /* ==========================================================================
       5. PATIENT REVIEWS TESTIMONIAL SLIDER
       ========================================================================== */
    const sliderTrack = document.getElementById('slider-track');
    const reviewCards = document.querySelectorAll('.review-card');
    const prevBtn = document.getElementById('slider-prev');
    const nextBtn = document.getElementById('slider-next');
    const dotsContainer = document.getElementById('slider-dots');

    let currentSlide = 0;
    let autoSlideInterval;

    function getVisibleCardsCount() {
        if (window.innerWidth <= 768) return 1;
        return 2;
    }

    function getMaxSlides() {
        const visible = getVisibleCardsCount();
        return Math.max(0, reviewCards.length - visible);
    }

    function createDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        const maxSlides = getMaxSlides();

        for (let i = 0; i <= maxSlides; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }

    function updateSliderPosition() {
        if (!sliderTrack || reviewCards.length === 0) return;
        const cardWidth = reviewCards[0].getBoundingClientRect().width;
        const gap = 24; // 1.5rem
        const moveAmount = (cardWidth + gap) * currentSlide;
        sliderTrack.style.transform = `translateX(-${moveAmount}px)`;

        // Update dot highlights
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    function goToSlide(index) {
        const max = getMaxSlides();
        if (index < 0) currentSlide = max;
        else if (index > max) currentSlide = 0;
        else currentSlide = index;

        updateSliderPosition();
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    function startAutoSlide() {
        stopAutoSlide();
        autoSlideInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoSlide() {
        if (autoSlideInterval) clearInterval(autoSlideInterval);
    }

    const sliderWrapper = document.querySelector('.testimonial-slider');
    if (sliderWrapper) {
        sliderWrapper.addEventListener('mouseenter', stopAutoSlide);
        sliderWrapper.addEventListener('mouseleave', startAutoSlide);

        // Touch Swipe Support
        let startX = 0;
        let endX = 0;

        sliderWrapper.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        }, { passive: true });

        sliderWrapper.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            if (startX - endX > 50) nextSlide();
            else if (endX - startX > 50) prevSlide();
        }, { passive: true });
    }

    window.addEventListener('resize', () => {
        createDots();
        goToSlide(0);
    });

    createDots();
    startAutoSlide();

    /* ==========================================================================
       6. HOSPITAL GALLERY LIGHTBOX
       ========================================================================== */
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTag = document.getElementById('lightbox-tag');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');

    let currentGalleryIndex = 0;

    const galleryData = Array.from(galleryItems).map(item => {
        const img = item.querySelector('img');
        const tag = item.querySelector('.gallery-content span')?.innerText || '';
        const title = item.querySelector('.gallery-content h3')?.innerText || '';
        return {
            src: img ? img.src : '',
            alt: img ? img.alt : '',
            tag: tag,
            title: title
        };
    });

    function openLightbox(index) {
        currentGalleryIndex = index;
        const data = galleryData[currentGalleryIndex];
        if (!data) return;

        lightboxImg.src = data.src;
        lightboxImg.alt = data.alt;
        lightboxTag.innerText = data.tag;
        lightboxTitle.innerText = data.title;

        lightboxModal.classList.add('active');
        lightboxModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightboxModal.classList.remove('active');
        lightboxModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function showPrevLightbox() {
        currentGalleryIndex = (currentGalleryIndex - 1 + galleryData.length) % galleryData.length;
        openLightbox(currentGalleryIndex);
    }

    function showNextLightbox() {
        currentGalleryIndex = (currentGalleryIndex + 1) % galleryData.length;
        openLightbox(currentGalleryIndex);
    }

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox(index);
            }
        });
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', showPrevLightbox);
    if (lightboxNext) lightboxNext.addEventListener('click', showNextLightbox);

    if (lightboxModal) {
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) closeLightbox();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (!lightboxModal.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrevLightbox();
        if (e.key === 'ArrowRight') showNextLightbox();
    });

    /* ==========================================================================
       7. WRITE A REVIEW MODAL & RATING SYSTEM
       ========================================================================== */
    const reviewModal = document.getElementById('review-modal');
    const openReviewModalBtn = document.getElementById('open-review-modal-btn');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const reviewForm = document.getElementById('review-form');
    const starBtns = document.querySelectorAll('.star-btn');
    const reviewRatingInput = document.getElementById('review-rating');

    function openReviewModal() {
        reviewModal.classList.add('active');
        reviewModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeReviewModal() {
        reviewModal.classList.remove('active');
        reviewModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (reviewForm) reviewForm.reset();
        setStarRating(5);
    }

    if (openReviewModalBtn) openReviewModalBtn.addEventListener('click', openReviewModal);
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeReviewModal);

    if (reviewModal) {
        reviewModal.addEventListener('click', (e) => {
            if (e.target === reviewModal) closeReviewModal();
        });
    }

    function setStarRating(rating) {
        reviewRatingInput.value = rating;
        starBtns.forEach(star => {
            const val = +star.getAttribute('data-value');
            if (val <= rating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }

    starBtns.forEach(star => {
        star.addEventListener('click', () => {
            const val = +star.getAttribute('data-value');
            setStarRating(val);
        });
    });

    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameInput = document.getElementById('review-name');
            const textInput = document.getElementById('review-text');

            let isValid = true;
            if (!nameInput.value.trim()) {
                document.getElementById('rev-name-error').style.display = 'block';
                isValid = false;
            } else {
                document.getElementById('rev-name-error').style.display = 'none';
            }

            if (!textInput.value.trim()) {
                document.getElementById('rev-text-error').style.display = 'block';
                isValid = false;
            } else {
                document.getElementById('rev-text-error').style.display = 'none';
            }

            if (isValid) {
                closeReviewModal();
                showToast('Thank you! Your review has been submitted for approval.', 'fa-solid fa-circle-check');
            }
        });
    }

    /* ==========================================================================
       8. WHATSAPP APPOINTMENT FORM GENERATOR
       ========================================================================== */
    const appointmentForm = document.getElementById('appointment-form');

    // Set min date to today for date picker
    const appDateInput = document.getElementById('app-date');
    if (appDateInput) {
        const today = new Date().toISOString().split('T')[0];
        appDateInput.setAttribute('min', today);
    }

    if (appointmentForm) {
        appointmentForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('app-name').value.trim();
            const phone = document.getElementById('app-phone').value.trim();
            const email = document.getElementById('app-email').value.trim();
            const age = document.getElementById('app-age').value.trim();
            const gender = document.getElementById('app-gender').value;
            const date = document.getElementById('app-date').value;
            const time = document.getElementById('app-time').value;
            const treatment = document.getElementById('app-treatment').value;
            const message = document.getElementById('app-message').value.trim();
            const consent = document.getElementById('app-consent').checked;

            let valid = true;

            // Name validation
            if (!name) {
                document.getElementById('name-error').style.display = 'block';
                valid = false;
            } else {
                document.getElementById('name-error').style.display = 'none';
            }

            // Phone validation (10 digits)
            const phoneRegex = /^[0-9]{10}$/;
            if (!phoneRegex.test(phone)) {
                document.getElementById('phone-error').style.display = 'block';
                valid = false;
            } else {
                document.getElementById('phone-error').style.display = 'none';
            }

            // Date validation
            if (!date) {
                document.getElementById('date-error').style.display = 'block';
                valid = false;
            } else {
                document.getElementById('date-error').style.display = 'none';
            }

            // Time validation
            if (!time) {
                document.getElementById('time-error').style.display = 'block';
                valid = false;
            } else {
                document.getElementById('time-error').style.display = 'none';
            }

            // Treatment validation
            if (!treatment) {
                document.getElementById('treatment-error').style.display = 'block';
                valid = false;
            } else {
                document.getElementById('treatment-error').style.display = 'none';
            }

            // Consent validation
            if (!consent) {
                document.getElementById('consent-error').style.display = 'block';
                valid = false;
            } else {
                document.getElementById('consent-error').style.display = 'none';
            }

            if (!valid) return;

            // Formatted WhatsApp Message Construction
            const waMessage = 
`*APPOINTMENT BOOKING REQUEST*
*Raj Kaushal Dental Hospital, Deoria
----------------------------------------
👤 *Full Name:* ${name}
📞 *Mobile Number:* ${phone}
📧 *Email:* ${email || 'N/A'}
🎂 *Age:* ${age ? age + ' Years' : 'N/A'}
🚻 *Gender:* ${gender || 'N/A'}
📅 *Preferred Date:* ${date}
⏰ *Preferred Time:* ${time}
🦷 *Requested Treatment:* ${treatment}
📝 *Symptoms / Message:* ${message || 'None'}
----------------------------------------
Please confirm my appointment slot. Thank you!`;

            // Destination hospital WhatsApp number
            const targetPhone = '8182084008';
            const encodedMsg = encodeURIComponent(waMessage);
            const waUrl = `https://wa.me/${targetPhone}?text=${encodedMsg}`;

            // Open WhatsApp in new tab
            window.open(waUrl, '_blank');

            showToast('Opening WhatsApp to send your appointment details...', 'fa-brands fa-whatsapp');
            appointmentForm.reset();
        });
    }

    /* ==========================================================================
       9. TOAST NOTIFICATION UTILITY
       ========================================================================== */
    function showToast(message, iconClass = 'fa-solid fa-info-circle') {
        const toastContainer = document.getElementById('toast-container');
        if (!toastContainer) return;

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i class="${iconClass}"></i> <span>${message}</span>`;

        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }
});
