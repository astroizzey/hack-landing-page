// ===========================================================
// Breakthrough Author Live — interactions
// ===========================================================

(function () {
  'use strict';

  /* ---------- Theme toggle (light/dark, saved in localStorage) ---------- */
  var root = document.documentElement;
  var toggle = document.getElementById('theme-toggle');

  function currentTheme() {
    return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('bal-theme', theme);
    if (toggle) {
      var isDark = theme === 'dark';
      toggle.setAttribute('aria-pressed', String(isDark));
      toggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    }
  }

  // Sync button state with whatever the inline head script already set.
  applyTheme(currentTheme());

  if (toggle) {
    toggle.addEventListener('click', function () {
      applyTheme(currentTheme() === 'dark' ? 'light' : 'dark');
    });
  }

  /* ---------- FAQ accordion ---------- */
  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    var trigger = item.querySelector('.faq-trigger');
    if (!trigger) return;
    trigger.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      // close others for a cleaner single-open accordion
      faqItems.forEach(function (other) {
        other.classList.remove('open');
        var t = other.querySelector('.faq-trigger');
        if (t) t.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---------- Reveal-on-scroll ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* ---------- Hero video play button ---------- */
  var videoFrame = document.querySelector('.video-frame');
  var video = document.querySelector('.vsl-video');
  var playBtn = document.querySelector('.play-btn');
  if (videoFrame && playBtn) {
    playBtn.addEventListener('click', function () {
      videoFrame.querySelector('.video-overlay').style.display = 'none';
      if (video && video.querySelector('source')) {
        video.play().catch(function () { /* no source provided yet — placeholder only */ });
      }
    });
  }

  /* ---------- Sticky mobile CTA: hide while an inline buy button is already visible ---------- */
  var stickyCta = document.querySelector('.sticky-cta');
  var inlineButtons = document.querySelectorAll('main .btn-accent, .site-header .btn-accent');
  if (stickyCta && 'IntersectionObserver' in window && inlineButtons.length) {
    var visibleInline = new Set();
    var ctaIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { visibleInline.add(entry.target); }
        else { visibleInline.delete(entry.target); }
      });
      stickyCta.classList.toggle('is-hidden', visibleInline.size > 0);
    }, { threshold: 0.3 });
    inlineButtons.forEach(function (btn) { ctaIo.observe(btn); });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
