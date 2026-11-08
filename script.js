/* ========================================================
   STUDIO DENTISTICO FUSARO — LANDING PAGE SCRIPTS
   Form Validation, Conversion Tracking & Smooth Scrolling
   ======================================================== */

document.addEventListener('DOMContentLoaded', function () {

    // --- SMOOTH SCROLL ---
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '') return;
            var target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                var headerHeight = document.querySelector('.header').offsetHeight || 70;
                var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 16;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });

    // --- FORM VALIDATION & SUBMISSION ---
    var form = document.getElementById('bookingForm');
    var submitBtn = document.getElementById('submitBtn');
    var formSuccess = document.getElementById('formSuccess');

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            // Clear existing errors
            form.querySelectorAll('.error').forEach(function (el) {
                el.classList.remove('error');
            });
            form.querySelectorAll('.error-msg').forEach(function (el) {
                el.remove();
            });

            var isValid = true;

            // Name
            var nome = document.getElementById('nome');
            if (!nome.value.trim()) {
                showError(nome, 'Inserisci il tuo nome e cognome');
                isValid = false;
            }

            // Phone
            var telefono = document.getElementById('telefono');
            if (!telefono.value.trim()) {
                showError(telefono, 'Inserisci il tuo numero di telefono');
                isValid = false;
            } else if (!/^[+\d\s()-]{6,20}$/.test(telefono.value.trim())) {
                showError(telefono, 'Inserisci un recapito telefonico valido');
                isValid = false;
            }

            // Email (optional, but validated if filled)
            var email = document.getElementById('email');
            if (email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
                showError(email, 'Inserisci un indirizzo email valido');
                isValid = false;
            }

            // Service
            var servizio = document.getElementById('servizio');
            if (!servizio.value) {
                showError(servizio, 'Seleziona il motivo della visita');
                isValid = false;
            }

            // Privacy
            var privacy = document.getElementById('privacy');
            if (!privacy.checked) {
                showError(privacy, 'È necessario accettare l\'informativa sulla privacy');
                isValid = false;
            }

            if (!isValid) return;

            // Loading state
            var btnText = submitBtn.querySelector('.btn-text');
            var btnLoading = submitBtn.querySelector('.btn-loading');
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline';

            // Meta Pixel Conversion Event
            if (typeof fbq === 'function') {
                fbq('track', 'Lead', {
                    content_name: servizio.value,
                    content_category: 'Studio Dentistico Fusaro Torino'
                });
            }

            // Google Ads Conversion Event
            if (typeof gtag === 'function') {
                gtag('event', 'generate_lead', {
                    'event_category': 'Prenotazione',
                    'event_label': servizio.value
                });
            }

            // Simulate submission (replace with your Formspree/EmailJS/Webhook endpoint)
            setTimeout(function () {
                form.style.display = 'none';
                formSuccess.style.display = 'block';
                formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 1000);
        });
    }

    function showError(element, message) {
        element.classList.add('error');
        var err = document.createElement('div');
        err.className = 'error-msg';
        err.textContent = message;
        if (element.type === 'checkbox') {
            element.closest('.checkbox-group').appendChild(err);
        } else {
            element.parentNode.appendChild(err);
        }
    }

    // --- HIDE STICKY CTA WHEN FORM IS VISIBLE ---
    var stickyMobile = document.querySelector('.sticky-cta-mobile');
    var formElement = document.querySelector('.form-card');
    if (stickyMobile && formElement && 'IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    stickyMobile.style.transform = 'translateY(100%)';
                    stickyMobile.style.transition = 'transform 0.3s ease';
                } else {
                    stickyMobile.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        observer.observe(formElement);
    }
});
