/* ==========================================================================
   Greenfin · site behaviour
   Menu drawer, FAQ helpers, rate calculator, store filter, size picker,
   cookie notice, footer year and form validation. No dependencies.
   ========================================================================== */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  root.classList.add('js');

  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); }
  function store(key, value) { try { localStorage.setItem(key, value); } catch (e) { /* storage unavailable */ } }
  function read(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }

  /* ---- Footer year ------------------------------------------------------ */
  $all('[data-year]').forEach(function (el) { el.textContent = String(new Date().getFullYear()); });

  /* ---- Mobile navigation drawer ---------------------------------------- */
  var toggle = doc.querySelector('.nav-toggle');
  var nav = doc.getElementById('site-nav');
  if (toggle && nav) {
    var desktop = window.matchMedia('(min-width: 1280px)');
    var isOpen = function () { return toggle.getAttribute('aria-expanded') === 'true'; };
    var focusables = function () { return $all('a[href], button:not([disabled])', nav).concat([toggle]); }; // DOM order: links, then the toggle
    var setOpen = function (open, returnFocus) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      nav.classList.toggle('is-open', open);
      root.classList.toggle('nav-open', open);
      if (open) {
        var first = nav.querySelector('a[href]');
        if (first) window.setTimeout(function () { first.focus(); }, 60);
      } else if (returnFocus) {
        toggle.focus();
      }
    };
    toggle.addEventListener('click', function () { setOpen(!isOpen(), false); });
    doc.addEventListener('keydown', function (e) {
      if (!isOpen()) return;
      if (e.key === 'Escape') { e.preventDefault(); setOpen(false, true); return; }
      if (e.key !== 'Tab') return;
      var items = focusables();
      var first = items[0];
      var last = items[items.length - 1];
      if (items.indexOf(doc.activeElement) === -1) { e.preventDefault(); first.focus(); }
      else if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    nav.addEventListener('click', function (e) { if (e.target.closest('a[href]') && isOpen()) setOpen(false, false); });
    var onBreakpoint = function (e) { if (e.matches && isOpen()) setOpen(false, false); };
    if (desktop.addEventListener) desktop.addEventListener('change', onBreakpoint);
    else if (desktop.addListener) desktop.addListener(onBreakpoint);
  }

  /* ---- Light / dark theme toggle ------------------------------------- */
  // Follows the device setting until the visitor chooses; the choice is remembered.
  var themeBtn = doc.querySelector('[data-theme-toggle]');
  if (themeBtn) {
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    var current = function () { return root.getAttribute('data-theme') || (prefersDark.matches ? 'dark' : 'light'); };
    var label = function () { themeBtn.setAttribute('aria-label', current() === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'); };
    themeBtn.addEventListener('click', function () {
      var next = current() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      store('greenfin-theme', next);
      label();
    });
    if (prefersDark.addEventListener) prefersDark.addEventListener('change', label);
    label();
  }

  /* ---- FAQ: open the question named in the URL, expand/collapse all ---- */
  function openFromHash() {
    var id = window.location.hash.slice(1);
    var target = id && doc.getElementById(id);
    if (target && target.tagName === 'DETAILS') target.open = true;
  }
  openFromHash();
  window.addEventListener('hashchange', openFromHash);

  var faqToggle = doc.querySelector('[data-faq-toggle]');
  if (faqToggle) {
    faqToggle.addEventListener('click', function () {
      var expand = faqToggle.getAttribute('data-state') !== 'open';
      $all('details.faq').forEach(function (d) { d.open = expand; });
      faqToggle.setAttribute('data-state', expand ? 'open' : 'closed');
      faqToggle.textContent = expand ? 'Collapse all answers' : 'Expand all answers';
    });
  }

  /* ---- Application rate calculator ------------------------------------- */
  var calc = doc.querySelector('[data-calc]');
  if (calc) {
    var ML_PER_FL_OZ = 29.5735;
    var stage = calc.querySelector('#calc-stage');
    var amount = calc.querySelector('#calc-amount');
    var unitLabel = calc.querySelector('[data-unit-label]');
    var result = calc.querySelector('#calc-result');
    var fmt = function (n) {
      var rounded = n >= 100 ? Math.round(n) : Math.round(n * 10) / 10;
      return rounded.toLocaleString('en-US');
    };
    var range = function (a, b, unit) { return fmt(a) === fmt(b) ? fmt(a) + unit : fmt(a) + '–' + fmt(b) + unit; };
    var update = function () {
      var opt = stage.options[stage.selectedIndex];
      var perAcre = opt.getAttribute('data-unit') === 'acre';
      unitLabel.textContent = perAcre ? 'Acres to treat' : 'Gallons of water';
      var qty = parseFloat(amount.value);
      if (!(qty > 0)) {
        result.textContent = 'Enter how many ' + (perAcre ? 'acres' : 'gallons') + ' you are treating to see your amount.';
        return;
      }
      var min = parseFloat(opt.getAttribute('data-min'));
      var max = parseFloat(opt.getAttribute('data-max'));
      var mlMin = perAcre ? qty * min * ML_PER_FL_OZ : qty * min;
      var mlMax = perAcre ? qty * max * ML_PER_FL_OZ : qty * max;
      result.innerHTML = '<strong>' + range(mlMin, mlMax, ' ml') + '</strong>' +
        'That is ' + range(mlMin / ML_PER_FL_OZ, mlMax / ML_PER_FL_OZ, ' fl oz') + ' of Greenfin for ' +
        fmt(qty) + (perAcre ? (qty === 1 ? ' acre.' : ' acres.') : (qty === 1 ? ' gallon of water.' : ' gallons of water.'));
    };
    stage.addEventListener('change', update);
    amount.addEventListener('input', update);
    update();
  }

  /* ---- Print the rates chart only -------------------------------------- */
  $all('[data-print]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      root.classList.add('print-' + btn.getAttribute('data-print'));
      window.print();
    });
  });
  window.addEventListener('afterprint', function () {
    root.className = root.className.replace(/\bprint-\S+/g, '').replace(/\s+/g, ' ').trim();
  });

  /* ---- Where to buy: filter by state ----------------------------------- */
  var filter = doc.querySelector('[data-store-filter]');
  if (filter) {
    var groups = $all('[data-state-group]');
    var count = doc.getElementById('store-count');
    filter.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-state]');
      if (!btn) return;
      var state = btn.getAttribute('data-state');
      $all('button[data-state]', filter).forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
      var shown = 0;
      groups.forEach(function (g) {
        var match = state === 'all' || g.getAttribute('data-state-group') === state;
        g.hidden = !match;
        if (match) shown += g.querySelectorAll('.store-card').length;
      });
      if (count) count.textContent = 'Showing ' + shown + (shown === 1 ? ' store' : ' stores') + (state === 'all' ? '.' : ' in ' + btn.textContent.trim() + '.');
    });
  }

  /* ---- Product size picker --------------------------------------------- */
  $all('[data-size-picker]').forEach(function (picker) {
    var price = picker.querySelector('[data-price]');
    var sizeName = picker.querySelector('[data-size-name]');
    var buy = picker.querySelector('[data-buy]');
    var scope = picker.closest('.product') || doc;
    var arts = scope.querySelectorAll('[data-size-art]');
    var sync = function () {
      var chosen = picker.querySelector('input[name="size"]:checked');
      if (!chosen) return;
      if (price) price.textContent = chosen.getAttribute('data-price');
      if (sizeName) sizeName.textContent = chosen.value;
      if (buy) buy.setAttribute('href', chosen.getAttribute('data-checkout'));
      for (var i = 0; i < arts.length; i++) arts[i].hidden = arts[i].getAttribute('data-size-art') !== chosen.value;
    };
    picker.addEventListener('change', sync);
    sync();
  });

  /* ---- Cookie notice ---------------------------------------------------- */
  // The stored choice is exposed as window.greenfinConsent ("accepted" / "declined").
  // Only load analytics scripts when it is "accepted".
  var COOKIE_KEY = 'greenfin-cookie-choice';
  window.greenfinConsent = read(COOKIE_KEY);
  var bar = doc.querySelector('.cookie-bar');
  if (bar) {
    if (!window.greenfinConsent) bar.hidden = false;
    bar.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-cookie]');
      if (!btn) return;
      window.greenfinConsent = btn.getAttribute('data-cookie');
      store(COOKIE_KEY, window.greenfinConsent);
      bar.hidden = true;
    });
  }

  /* ---- Form validation -------------------------------------------------- */
  function messageFor(field) {
    var v = field.validity;
    if (v.valueMissing) {
      if (field.tagName === 'SELECT') return 'Please choose an option.';
      if (field.type === 'email') return 'Please enter your email address.';
      return 'Please fill in this field.';
    }
    if (v.typeMismatch && field.type === 'email') return 'Please enter an email address like name@example.com.';
    if (v.patternMismatch) return field.getAttribute('data-pattern-message') || 'Please check the format of this field.';
    if (v.tooShort) return 'Please add a little more detail (at least ' + field.getAttribute('minlength') + ' characters).';
    return field.validationMessage || '';
  }

  function check(field) {
    var msg = field.checkValidity() ? '' : messageFor(field);
    var error = doc.getElementById(field.id + '-error');
    field.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (error) error.textContent = msg;
    return !msg;
  }

  $all('form[data-validate]').forEach(function (form) {
    form.setAttribute('novalidate', '');
    var fields = $all('input:not([type="hidden"]), select, textarea', form).filter(function (f) { return f.id; });
    var status = form.querySelector('.form-status');
    fields.forEach(function (f) {
      f.addEventListener('blur', function () { if (f.value || f.getAttribute('aria-invalid') === 'true') check(f); });
      f.addEventListener('input', function () { if (f.getAttribute('aria-invalid') === 'true') check(f); });
    });
    form.addEventListener('submit', function (e) {
      var firstBad = null;
      fields.forEach(function (f) { if (!check(f) && !firstBad) firstBad = f; });
      if (firstBad) {
        e.preventDefault();
        if (status) status.textContent = 'Please check the highlighted field' + (fields.filter(function (f) { return f.getAttribute('aria-invalid') === 'true'; }).length > 1 ? 's.' : '.');
        firstBad.focus();
        return;
      }
      // Until a real endpoint replaces [[FORM ENDPOINT]] / [[EMAIL LIST ENDPOINT]], don't post to a broken URL.
      if ((form.getAttribute('action') || '').indexOf('[[') !== -1) {
        e.preventDefault();
        if (status) status.textContent = 'Thank you. This form is not connected yet, so please email sales@greenfinamendments.com and we will reply there.';
      }
    });
  });
})();
