/* ==========================================================================
   MAIN.JS - IntersectionObserver, Nav Toggle, Scroll Behavior
   ========================================================================== */

(function () {
    'use strict';

    // --- Scroll Reveal with IntersectionObserver ---
    const revealElements = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -60px 0px'
        });

        revealElements.forEach(function (el) {
            revealObserver.observe(el);
        });
    } else {
        // Fallback: show all elements immediately
        revealElements.forEach(function (el) {
            el.classList.add('active');
        });
    }

    // --- Mobile Nav Toggle ---
    var navToggle = document.querySelector('.nav-toggle');
    var navLinks = document.querySelector('.nav-links');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function () {
            var isOpen = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', String(!isOpen));
            navLinks.classList.toggle('active');

            // Prevent body scroll when menu is open
            document.body.style.overflow = isOpen ? '' : 'hidden';
        });

        // Close menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                navToggle.setAttribute('aria-expanded', 'false');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu on Escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                navToggle.setAttribute('aria-expanded', 'false');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
                navToggle.focus();
            }
        });
    }

    // --- Navbar scroll effect ---
    var navbar = document.querySelector('.navbar');

    if (navbar) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }, { passive: true });
    }

    // --- Prefill service in contact form ---
    window.prefillService = function (serviceName) {
        var mensaje = document.getElementById('mensaje');
        if (mensaje) {
            mensaje.value = 'Hola, me interesa el servicio de: ' + serviceName;
            mensaje.focus();
        }
    };

    // --- Treatment Calculator ---
    var calcData = {
        profilaxis: {
            complexity: 25,
            complexityLabel: 'Baja',
            time: '30 &ndash; 45 min',
            sessions: '1 sesi\u00f3n',
            plan: [
                'Examen bucal inicial',
                'Eliminaci\u00f3n de sarro y placa',
                'Pulido dental profesional',
                'Aplicaci\u00f3n de fl\u00faor (opcional)'
            ],
            priceUnit: 25,
            priceMax: 45,
            hint: 'Limpieza lista \u2713'
        },
        restauracion: {
            complexity: 55,
            complexityLabel: 'Media',
            time: '45 &ndash; 90 min',
            sessions: '1 &ndash; 2 sesiones',
            plan: [
                'Diagn\u00f3stico y radiograf\u00eda',
                'Preparaci\u00f3n del diente',
                'Colocaci\u00f3n de resina est\u00e9tica',
                'Pulido y ajuste de mordida'
            ],
            priceUnit: 30,
            priceMax: 60,
            hint: 'Diente restaurado \u2713'
        },
        sellante: {
            complexity: 15,
            complexityLabel: 'Muy baja',
            time: '20 &ndash; 30 min',
            sessions: '1 sesi\u00f3n',
            plan: [
                'Limpieza de surcos dentales',
                'Aplicaci\u00f3n del sellante',
                'Fotocurado y verificaci\u00f3n',
                'Revisi\u00f3n de ocusi\u00f3n'
            ],
            priceUnit: 15,
            priceMax: 25,
            hint: 'Protegido \u2713'
        },
        extraccion: {
            complexity: 70,
            complexityLabel: 'Media-alta',
            time: '30 &ndash; 60 min',
            sessions: '1 sesi\u00f3n',
            plan: [
                'Evaluaci\u00f3n y radiograf\u00eda previa',
                'Anestesia local sin dolor',
                'Extracci\u00f3n cuidadosa',
                'Indicaciones de recuperaci\u00f3n'
            ],
            priceUnit: 25,
            priceMax: 50,
            hint: 'Sin miedo \u2713'
        }
    };

    var calcToothEl = document.getElementById('calc-tooth');
    var calcHintEl  = document.getElementById('calc-hint');
    var calcBar     = document.getElementById('calc-complexity-bar');
    var calcComplex = document.getElementById('calc-complexity-text');
    var calcTime    = document.getElementById('calc-time');
    var calcTimeSub = document.getElementById('calc-time-sub');
    var calcPlan    = document.getElementById('calc-plan');
    var calcPrice   = document.getElementById('calc-price');
    var qtyDisplay  = document.getElementById('qty-display');
    var qtyMinus    = document.getElementById('qty-minus');
    var qtyPlus     = document.getElementById('qty-plus');
    var qty         = 1;

    function getSelected() {
        var radio = document.querySelector('[name="tratamiento"]:checked');
        return radio ? radio.value : 'profilaxis';
    }

    function updateCalc() {
        var key  = getSelected();
        var data = calcData[key];
        if (!data || !calcBar) return;

        calcBar.style.width = data.complexity + '%';
        calcComplex.textContent = data.complexityLabel;
        calcTime.innerHTML = data.time;

        var planHtml = '';
        data.plan.forEach(function (item) {
            planHtml += '<li>' + item + '</li>';
        });
        calcPlan.innerHTML = planHtml;

        // Profilaxis: por sesion (no por diente), el resto escala con cantidad
        if (key === 'profilaxis') {
            calcPrice.innerHTML = '$' + data.priceUnit + ' &ndash; $' + data.priceMax;
            if (calcTimeSub) calcTimeSub.textContent = 'Por sesi\u00f3n';
        } else {
            var total1 = data.priceUnit * qty;
            var total2 = data.priceMax  * qty;
            calcPrice.innerHTML = '$' + total1 + ' &ndash; $' + total2;
            if (calcTimeSub) {
                calcTimeSub.textContent = qty === 1
                    ? 'Por diente'
                    : 'Por diente \u2014 ' + qty + ' dientes en total';
            }
        }
    }

    function animateTooth() {
        if (!calcToothEl) return;
        calcToothEl.classList.remove('clicked');
        void calcToothEl.offsetWidth; // reflow to restart animation
        calcToothEl.classList.add('clicked');

        if (calcHintEl) {
            var key  = getSelected();
            var data = calcData[key];
            calcHintEl.textContent = data ? data.hint : '';
            setTimeout(function () {
                if (calcHintEl) calcHintEl.textContent = 'Haz clic';
            }, 2000);
        }

        setTimeout(function () {
            calcToothEl.classList.remove('clicked');
        }, 500);
    }

    if (calcToothEl) {
        calcToothEl.addEventListener('click', function () {
            updateCalc();
            animateTooth();
        });

        calcToothEl.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                updateCalc();
                animateTooth();
            }
        });
    }

    // Radio change: update instantly
    document.querySelectorAll('[name="tratamiento"]').forEach(function (radio) {
        radio.addEventListener('change', function () {
            updateCalc();
            animateTooth();
        });
    });

    // Quantity controls
    if (qtyMinus && qtyPlus && qtyDisplay) {
        qtyMinus.addEventListener('click', function () {
            if (qty > 1) { qty--; qtyDisplay.textContent = qty; updateCalc(); }
        });
        qtyPlus.addEventListener('click', function () {
            if (qty < 8) { qty++; qtyDisplay.textContent = qty; updateCalc(); }
        });
    }

    // Initial render
    updateCalc();

    // --- Treatment cards: mobile tap / keyboard toggle ---
    var treatmentCards = document.querySelectorAll('.tc');

    function closeAllCards() {
        treatmentCards.forEach(function (c) { c.classList.remove('tc-active'); });
    }

    treatmentCards.forEach(function (card) {
        // Click/tap: toggle on mobile, no-op on desktop (CSS :hover handles it)
        card.addEventListener('click', function () {
            var isTouch = window.matchMedia('(hover: none)').matches;
            if (isTouch) {
                var wasActive = card.classList.contains('tc-active');
                closeAllCards();
                if (!wasActive) card.classList.add('tc-active');
            }
        });

        // Keyboard: Enter or Space
        card.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                var wasActive = card.classList.contains('tc-active');
                closeAllCards();
                if (!wasActive) card.classList.add('tc-active');
            }
        });
    });

    // Close active card when clicking outside
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.tc')) closeAllCards();
    });

    // --- Count-up animation for stats ---
    var statNumbers = document.querySelectorAll('.stat-number[data-target]');

    function easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }

    function animateCount(el) {
        var target = parseInt(el.getAttribute('data-target'), 10);
        var suffix = el.getAttribute('data-suffix') || '';
        var duration = 1800;
        var start = null;

        el.classList.add('counting');

        function step(timestamp) {
            if (!start) start = timestamp;
            var elapsed = timestamp - start;
            var progress = Math.min(elapsed / duration, 1);
            var easedProgress = easeOutQuart(progress);
            var current = Math.floor(easedProgress * target);

            el.textContent = current + suffix;

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = target + suffix;
                el.classList.remove('counting');
            }
        }

        requestAnimationFrame(step);
    }

    if ('IntersectionObserver' in window && statNumbers.length > 0) {
        var statsObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    // stagger each number slightly
                    var items = entry.target.querySelectorAll('.stat-number[data-target]');
                    items.forEach(function (el, index) {
                        setTimeout(function () {
                            animateCount(el);
                        }, index * 150);
                    });
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        var statsCard = document.querySelector('.stats-card');
        if (statsCard) {
            statsObserver.observe(statsCard);
        }
    } else {
        // Fallback: show final values immediately
        statNumbers.forEach(function (el) {
            el.textContent = el.getAttribute('data-target') + (el.getAttribute('data-suffix') || '');
        });
    }

})();
