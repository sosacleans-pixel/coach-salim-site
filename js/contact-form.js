/* Contact form: service prefill, validation, FormSubmit subject/body */
(function () {
  'use strict';

  var form = document.querySelector('.cform');
  if (!form) return;

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var GENERAL_LABEL = 'General question';
  var GENERAL_SLUG = '__general__';

  /** @type {{slug:string,title:string}[]} */
  var services = $$('.card[data-service-slug]').map(function (card) {
    var h3 = card.querySelector('h3');
    return {
      slug: card.dataset.serviceSlug,
      title: h3 ? h3.textContent.trim() : ''
    };
  }).filter(function (s) { return s.slug && s.title; });

  var slugToTitle = {};
  services.forEach(function (s) { slugToTitle[s.slug] = s.title; });

  $$('.card[data-service-slug] .card-link').forEach(function (link) {
    var card = link.closest('.card');
    if (!card || !card.dataset.serviceSlug) return;
    link.href = '?service=' + encodeURIComponent(card.dataset.serviceSlug) + '#contact';
    link.dataset.serviceSlug = card.dataset.serviceSlug;
  });

  var subjectInput = form.querySelector('input[name="_subject"]');
  var nameInput = $('#cf-name', form);
  var emailInput = $('#cf-email', form);
  var phoneInput = $('#cf-phone', form);
  var msgInput = $('#cf-msg', form);
  var serviceReadonly = $('#cf-service-readonly', form);
  var serviceHidden = $('#cf-service-hidden', form);
  var serviceSelect = $('#cf-service-select', form);
  var serviceLabel = form.querySelector('#cf-service-wrap label');

  var EMAIL_PATTERN = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

  function populateServiceSelect() {
    if (!serviceSelect) return;
    serviceSelect.innerHTML = '';
    var placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = 'Choose a service…';
    placeholder.disabled = true;
    placeholder.selected = true;
    serviceSelect.appendChild(placeholder);
    services.forEach(function (s) {
      var opt = document.createElement('option');
      opt.value = s.slug;
      opt.textContent = s.title;
      serviceSelect.appendChild(opt);
    });
    var general = document.createElement('option');
    general.value = GENERAL_SLUG;
    general.textContent = GENERAL_LABEL;
    serviceSelect.appendChild(general);
  }

  populateServiceSelect();

  function serviceTitleFromSlug(slug) {
    if (slug === GENERAL_SLUG) return GENERAL_LABEL;
    return slugToTitle[slug] || '';
  }

  function currentServiceTitle() {
    if (serviceReadonly && !serviceReadonly.hidden) {
      return serviceReadonly.value.trim();
    }
    if (serviceSelect && !serviceSelect.hidden && serviceSelect.value) {
      return serviceTitleFromSlug(serviceSelect.value);
    }
    return '';
  }

  function inquirySubject(title) {
    return 'New inquiry: ' + (title || GENERAL_LABEL);
  }

  function updateSubjectField() {
    if (!subjectInput) return;
    subjectInput.value = inquirySubject(currentServiceTitle());
  }

  function showPrefilledService(title) {
    if (!serviceReadonly || !serviceHidden || !serviceSelect) return;
    if (serviceLabel) serviceLabel.setAttribute('for', 'cf-service-readonly');
    serviceReadonly.value = title;
    serviceReadonly.hidden = false;
    serviceHidden.value = title;
    serviceHidden.name = 'service';
    serviceHidden.disabled = false;
    serviceSelect.hidden = true;
    serviceSelect.removeAttribute('required');
    serviceSelect.disabled = true;
    serviceSelect.removeAttribute('name');
    updateSubjectField();
  }

  function showServiceDropdown() {
    if (!serviceReadonly || !serviceHidden || !serviceSelect) return;
    if (serviceLabel) serviceLabel.setAttribute('for', 'cf-service-select');
    serviceReadonly.hidden = true;
    serviceReadonly.value = '';
    serviceHidden.value = '';
    serviceHidden.disabled = true;
    serviceHidden.removeAttribute('name');
    serviceSelect.hidden = false;
    serviceSelect.disabled = false;
    serviceSelect.name = 'service';
    serviceSelect.setAttribute('required', 'required');
    updateSubjectField();
  }

  function applyServiceFromUrl() {
    var slug = new URLSearchParams(window.location.search).get('service');
    if (slug) {
      var title = serviceTitleFromSlug(slug);
      if (title) {
        showPrefilledService(title);
        return;
      }
    }
    showServiceDropdown();
  }

  function digitsOnlyPhone(raw) {
    var d = (raw || '').replace(/\D/g, '');
    if (d.length === 11 && d.charAt(0) === '1') d = d.slice(1);
    return d;
  }

  function formatUsPhone(digits) {
    if (digits.length !== 10) return digits;
    return '(' + digits.slice(0, 3) + ') ' + digits.slice(3, 6) + '-' + digits.slice(6);
  }

  function clearFieldError(fieldEl) {
    var wrap = fieldEl.closest('.cf-field');
    if (!wrap) return;
    wrap.classList.remove('is-invalid');
    var err = wrap.querySelector('.cf-error');
    if (err) err.textContent = '';
  }

  function setFieldError(fieldEl, message) {
    var wrap = fieldEl.closest('.cf-field');
    if (!wrap) return;
    wrap.classList.add('is-invalid');
    var err = wrap.querySelector('.cf-error');
    if (err) err.textContent = message;
  }

  function validateName() {
    var v = (nameInput.value || '').trim();
    if (v.length < 2) {
      setFieldError(nameInput, 'Enter your name (at least 2 characters).');
      return false;
    }
    clearFieldError(nameInput);
    return true;
  }

  function validateEmail() {
    var v = (emailInput.value || '').trim();
    if (!v) {
      setFieldError(emailInput, 'Enter your email address.');
      return false;
    }
    if (!EMAIL_PATTERN.test(v)) {
      setFieldError(emailInput, 'Enter a valid email address (e.g. you@example.com).');
      return false;
    }
    clearFieldError(emailInput);
    return true;
  }

  function validatePhone() {
    var d = digitsOnlyPhone(phoneInput.value);
    if (d.length !== 10) {
      setFieldError(phoneInput, 'Enter a 10-digit US phone number.');
      return false;
    }
    clearFieldError(phoneInput);
    return true;
  }

  function validateService() {
    if (serviceSelect && !serviceSelect.hidden) {
      if (!serviceSelect.value) {
        setFieldError(serviceSelect, 'Choose a service or General question.');
        return false;
      }
      clearFieldError(serviceSelect);
    }
    return true;
  }

  function validateMessage() {
    var v = (msgInput.value || '').trim();
    if (!v) {
      setFieldError(msgInput, 'Please include a short message.');
      return false;
    }
    clearFieldError(msgInput);
    return true;
  }

  function validateForm() {
    return validateName() && validateEmail() && validatePhone() && validateService() && validateMessage();
  }

  function prepareServiceForSubmit() {
    if (serviceSelect && !serviceSelect.hidden) {
      var title = serviceTitleFromSlug(serviceSelect.value);
      serviceHidden.value = title;
      serviceHidden.name = 'service';
      serviceHidden.disabled = false;
      serviceSelect.disabled = true;
      serviceSelect.removeAttribute('name');
      return;
    }
    if (serviceReadonly && !serviceReadonly.hidden) {
      serviceHidden.value = serviceReadonly.value.trim();
    }
  }

  [nameInput, emailInput, phoneInput, msgInput].forEach(function (el) {
    el.addEventListener('input', function () { clearFieldError(el); });
    el.addEventListener('blur', function () {
      if (el === nameInput) validateName();
      if (el === emailInput) validateEmail();
      if (el === phoneInput) validatePhone();
      if (el === msgInput) validateMessage();
    });
  });

  if (serviceSelect) {
    serviceSelect.addEventListener('change', function () {
      clearFieldError(serviceSelect);
      updateSubjectField();
    });
  }

  form.setAttribute('novalidate', 'novalidate');

  form.addEventListener('submit', function (e) {
    if (form.querySelector('.hp') && form.querySelector('.hp').value) {
      e.preventDefault();
      return;
    }
    prepareServiceForSubmit();
    updateSubjectField();
    if (!validateForm()) {
      e.preventDefault();
      if (serviceSelect && !serviceSelect.hidden) {
        serviceSelect.disabled = false;
        serviceSelect.name = 'service';
        serviceHidden.removeAttribute('name');
        serviceHidden.disabled = true;
      } else if (serviceReadonly && !serviceReadonly.hidden && serviceHidden) {
        serviceHidden.name = 'service';
        serviceHidden.disabled = false;
        serviceHidden.value = serviceReadonly.value.trim();
      }
      var firstInvalid = form.querySelector('.cf-field.is-invalid input, .cf-field.is-invalid select, .cf-field.is-invalid textarea');
      if (firstInvalid) firstInvalid.focus();
      return;
    }
    phoneInput.value = formatUsPhone(digitsOnlyPhone(phoneInput.value));
    updateSubjectField();
  });

  applyServiceFromUrl();
  updateSubjectField();
})();
