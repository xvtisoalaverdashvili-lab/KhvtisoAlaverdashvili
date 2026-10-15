'use strict';
// ფორმის მარტივი ვალიდატორი (JavaScript)
document.querySelectorAll('form.js-form').forEach(function (form) {
  form.setAttribute('novalidate', '');
  const status = form.querySelector('.status');

  function setError(input, msg) {
    const field = input.closest('.field');
    field.classList.toggle('bad', Boolean(msg));
    let box = field.querySelector('.err');
    if (!box) { box = document.createElement('span'); box.className = 'err'; field.appendChild(box); }
    box.textContent = msg;
    return !msg;
  }

  function check(input) {
    const v = input.value.trim();
    if (input.required && !v) return setError(input, 'This field is required.');
    if (v && input.minLength > 0 && v.length < input.minLength) return setError(input, 'Minimum ' + input.minLength + ' characters.');
    if (input.type === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return setError(input, 'Enter a valid email.');
    if (input.name === 'password' && v.length < 8) return setError(input, 'Minimum 8 characters.');
    if (input.name === 'confirm') {
      const pass = form.querySelector('[name="password"]');
      if (v !== pass.value) return setError(input, 'Passwords do not match.');
    }
    return setError(input, '');
  }

  const fields = 'input:not([type=checkbox]):not([type=radio]), textarea, select';
  form.querySelectorAll(fields).forEach(function (el) {
    el.addEventListener('blur', function () { check(el); });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    let ok = true;
    form.querySelectorAll(fields).forEach(function (el) { if (!check(el)) ok = false; });
    const terms = form.querySelector('[name="terms"]');
    if (terms && !terms.checked) { status.textContent = 'Please accept the terms.'; status.style.color = 'var(--red)'; return; }
    if (ok) { status.style.color = 'var(--muted)'; status.textContent = 'Your details are valid. This demo does not send or save form data.'; }
    else { status.style.color = 'var(--red)'; status.textContent = 'Please fix the highlighted fields.'; }
  });
});
