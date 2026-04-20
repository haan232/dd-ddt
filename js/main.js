/* ============================================
   뜨뜻상점 — main.js
   - 모바일 네비 토글
   - 스크롤 상태 클래스 + 섹션 하이라이트
   - 인스타그램 embed.js 지연 로드 (Portfolio 뷰포트 진입 시)
   - Footer 연도 자동
   ============================================ */

(function () {
  'use strict';

  // ---------- 연도 ----------
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------- 모바일 네비 토글 ----------
  var nav = document.getElementById('nav');
  var toggle = document.getElementById('navToggle');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('is-open');
    });
    // 메뉴 항목 클릭 시 닫기
    nav.querySelectorAll('.nav__menu a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---------- 스크롤 그림자 ----------
  var onScroll = function () {
    if (!nav) return;
    nav.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------- 섹션 하이라이트 ----------
  var menuLinks = Array.prototype.slice.call(document.querySelectorAll('.nav__menu a[href^="#"]'));
  var sections = menuLinks
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = '#' + entry.target.id;
          menuLinks.forEach(function (a) {
            a.classList.toggle('is-active', a.getAttribute('href') === id);
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
    sections.forEach(function (s) { sectionObserver.observe(s); });
  }

  // ---------- Instagram embed.js 지연 로드 ----------
  // Portfolio 섹션이 뷰포트 근처에 오면 1회만 스크립트 주입.
  // <blockquote class="instagram-media"> 가 있으면 자동 렌더.
  var portfolio = document.getElementById('portfolio');
  var igLoaded = false;

  function loadInstagramEmbed() {
    if (igLoaded) return;
    igLoaded = true;
    // 이미 embed.js 가 있으면 process() 만 호출
    if (window.instgrm && window.instgrm.Embeds) {
      window.instgrm.Embeds.process();
      return;
    }
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.instagram.com/embed.js';
    s.onload = function () {
      if (window.instgrm && window.instgrm.Embeds) {
        window.instgrm.Embeds.process();
      }
    };
    document.body.appendChild(s);
  }

  if (portfolio && 'IntersectionObserver' in window) {
    var portfolioObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // blockquote.instagram-media 가 하나라도 있으면 로드
          if (portfolio.querySelector('blockquote.instagram-media')) {
            loadInstagramEmbed();
          }
          portfolioObserver.disconnect();
        }
      });
    }, { rootMargin: '200px 0px' });
    portfolioObserver.observe(portfolio);
  } else if (portfolio && portfolio.querySelector('blockquote.instagram-media')) {
    loadInstagramEmbed();
  }


  // ---------- 이미지 우클릭 / 롱프레스 저장 차단 ----------
  document.addEventListener('contextmenu', function (e) {
    if (e.target.tagName === 'IMG') e.preventDefault();
  });

  // ---------- 포트폴리오 라이트박스 ----------
  var lightbox      = document.getElementById('lightbox');
  var lightboxImg   = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');

  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
    lightboxImg.src = '';
  }

  if (lightbox) {
    document.querySelectorAll('.portfolio__card img').forEach(function (img) {
      img.addEventListener('click', function () {
        openLightbox(img.src, img.alt);
      });
    });

    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    lightboxClose.addEventListener('click', closeLightbox);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  // ---------- 모바일: 툴팁 버튼 2단 탭 (첫 탭 hover, 두 번째 탭 이동) ----------
  var canHover = window.matchMedia && window.matchMedia('(hover: hover)').matches;
  if (!canHover) {
    var tooltipBtns = document.querySelectorAll('.btn--tooltip, .btn--tooltip-below');
    var activeBtn = null;
    var resetTimer = null;
    tooltipBtns.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        if (activeBtn !== btn) {
          e.preventDefault();
          if (activeBtn) activeBtn.classList.remove('is-tapped');
          activeBtn = btn;
          btn.classList.add('is-tapped');
          if (resetTimer) clearTimeout(resetTimer);
          resetTimer = setTimeout(function () {
            if (activeBtn) activeBtn.classList.remove('is-tapped');
            activeBtn = null;
          }, 4000);
        }
      });
    });
    document.addEventListener('click', function (e) {
      if (activeBtn && !activeBtn.contains(e.target)) {
        activeBtn.classList.remove('is-tapped');
        activeBtn = null;
      }
    }, true);
  }

})();
