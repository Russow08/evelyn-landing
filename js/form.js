/* ==========================================================================
   FORM.JS - Validation, Sanitization, Rate Limiting, Web3Forms
   ========================================================================== */

(function () {
    'use strict';

    var form = document.getElementById('contact-form');
    var submitBtn = document.getElementById('submit-btn');
    var formStatus = document.getElementById('form-status');

    if (!form) return;

    // --- Sanitization ---
    function sanitize(str) {
        var div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // --- Validation Rules ---
    var validators = {
        nombre: function (value) {
            var clean = value.trim();
            return clean.length >= 2 && clean.length <= 100;
        },
        email: function (value) {
            // Basic email regex - not exhaustive but sufficient for client-side
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
        },
        telefono: function (value) {
            // Allow digits, spaces, +, -, ()
            var clean = value.replace(/[\s\-\(\)]/g, '');
            return /^\+?\d{7,15}$/.test(clean);
        },
        mensaje: function (value) {
            var clean = value.trim();
            return clean.length >= 10 && clean.length <= 1000;
        }
    };

    // --- Real-time validation on blur ---
    var fields = ['nombre', 'email', 'telefono', 'mensaje'];

    fields.forEach(function (fieldName) {
        var input = document.getElementById(fieldName);
        if (!input) return;

        input.addEventListener('blur', function () {
            validateField(fieldName);
        });

        input.addEventListener('input', function () {
            // Remove error state while typing
            if (input.classList.contains('error')) {
                input.classList.remove('error');
            }
        });
    });

    function validateField(fieldName) {
        var input = document.getElementById(fieldName);
        if (!input) return false;

        var value = input.value;
        var isValid = validators[fieldName](value);

        if (isValid) {
            input.classList.remove('error');
            input.classList.add('valid');
        } else if (value.trim().length > 0) {
            input.classList.remove('valid');
            input.classList.add('error');
        }

        return isValid;
    }

    function validateAll() {
        var allValid = true;
        fields.forEach(function (fieldName) {
            var input = document.getElementById(fieldName);
            if (!input) return;

            if (!validators[fieldName](input.value)) {
                input.classList.add('error');
                allValid = false;
            }
        });
        return allValid;
    }

    // --- Rate Limiting ---
    var RATE_LIMIT_KEY = 'ev_form_submissions';
    var RATE_LIMIT_MAX = 3;
    var RATE_LIMIT_WINDOW = 600000; // 10 minutes

    function canSubmit() {
        try {
            var submissions = JSON.parse(localStorage.getItem(RATE_LIMIT_KEY) || '[]');
            var now = Date.now();
            var recent = submissions.filter(function (t) {
                return now - t < RATE_LIMIT_WINDOW;
            });
            return recent.length < RATE_LIMIT_MAX;
        } catch (e) {
            return true; // Allow submission if localStorage fails
        }
    }

    function recordSubmission() {
        try {
            var submissions = JSON.parse(localStorage.getItem(RATE_LIMIT_KEY) || '[]');
            submissions.push(Date.now());
            // Keep only recent entries
            var now = Date.now();
            submissions = submissions.filter(function (t) {
                return now - t < RATE_LIMIT_WINDOW;
            });
            localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(submissions));
        } catch (e) {
            // Silently fail
        }
    }

    // --- Honeypot Check ---
    function isBot() {
        var honeypot = document.getElementById('website');
        return honeypot && honeypot.value.length > 0;
    }

    // --- Show Status Message ---
    function showStatus(message, type) {
        if (!formStatus) return;
        formStatus.textContent = message;
        formStatus.className = 'form-status ' + type;
    }

    function hideStatus() {
        if (!formStatus) return;
        formStatus.className = 'form-status';
        formStatus.textContent = '';
    }

    // --- Form Submit ---
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        hideStatus();

        // Honeypot check
        if (isBot()) {
            showStatus('Consulta enviada correctamente. Gracias.', 'success');
            return; // Silently reject bot submissions
        }

        // Validation
        if (!validateAll()) {
            showStatus('Por favor completa todos los campos correctamente.', 'error-msg');
            // Focus first invalid field
            for (var i = 0; i < fields.length; i++) {
                var input = document.getElementById(fields[i]);
                if (input && input.classList.contains('error')) {
                    input.focus();
                    break;
                }
            }
            return;
        }

        // Rate limiting
        if (!canSubmit()) {
            showStatus('Has enviado varias consultas recientemente. Por favor espera unos minutos.', 'error-msg');
            return;
        }

        // Sanitize values before sending
        fields.forEach(function (fieldName) {
            var input = document.getElementById(fieldName);
            if (input) {
                input.value = sanitize(input.value.trim());
            }
        });

        // Submit to Web3Forms
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';

        var formData = new FormData(form);

        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (data.success) {
                showStatus('Consulta enviada correctamente. Te respondere lo antes posible.', 'success');
                form.reset();
                fields.forEach(function (fieldName) {
                    var input = document.getElementById(fieldName);
                    if (input) {
                        input.classList.remove('valid', 'error');
                    }
                });
                recordSubmission();
            } else {
                showStatus('Hubo un error al enviar. Por favor intenta de nuevo o contactame por WhatsApp.', 'error-msg');
            }
        })
        .catch(function () {
            showStatus('Error de conexion. Por favor intenta de nuevo o contactame por WhatsApp.', 'error-msg');
        })
        .finally(function () {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Enviar Consulta';
        });
    });

})();
