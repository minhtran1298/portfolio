
document.addEventListener('DOMContentLoaded', () => {
  const translations = window.PORTFOLIO_TRANSLATIONS;
  const STORAGE_KEY = 'portfolioLanguage';
  const DEFAULT_LANG = 'en';
  const NAV_SCROLL_THRESHOLD = 50;

  let kpiChartInstance = null;

  function isHtmlContent(value) {
    return /<[^>]+>|&[a-z#0-9]+;/i.test(value);
  }

  function setElementContent(el, value) {
    if (!el) return;
    if (isHtmlContent(value)) {
      el.innerHTML = value;
    } else {
      el.textContent = value;
    }
  }

  function updateLanguageButtons(lang) {
    document.querySelectorAll('.lang-btn').forEach((btn) => {
      const isActive = btn.dataset.lang === lang;
      btn.classList.toggle('active', isActive);

      if (isActive) {
        btn.classList.add('bg-teal-500/15', 'text-teal-300', 'border-teal-500/40');
        btn.classList.remove('bg-slate-900', 'text-slate-300', 'border-slate-700');
      } else {
        btn.classList.remove('bg-teal-500/15', 'text-teal-300', 'border-teal-500/40');
        btn.classList.add('bg-slate-900', 'text-slate-300', 'border-slate-700');
      }
    });
  }

  function updateChart(lang) {
    if (!kpiChartInstance) return;

    const t = translations[lang] || translations[DEFAULT_LANG];
    kpiChartInstance.data.labels = t.chartLabels;
    kpiChartInstance.data.datasets[0].label = t.chartDataset1;
    kpiChartInstance.data.datasets[1].label = t.chartDataset2;
    kpiChartInstance.options.scales.y.max = t.chartMax;
    kpiChartInstance.update();
  }

  function applyTranslations(lang) {
    const content = translations[lang] || translations[DEFAULT_LANG];

    document.documentElement.lang = content.htmlLang;
    document.title = content.pageTitle;

    Object.entries(content.ui).forEach(([id, value]) => {
      const el = document.getElementById(id);
      setElementContent(el, value);
    });

    updateLanguageButtons(lang);
    updateChart(lang);
    localStorage.setItem(STORAGE_KEY, lang);
  }

  function detectInitialLanguage() {
    const savedLanguage = localStorage.getItem(STORAGE_KEY);
    if (savedLanguage && translations[savedLanguage]) {
      return savedLanguage;
    }

    const browserIsGerman =
      navigator.language && navigator.language.toLowerCase().startsWith('de');

    return browserIsGerman ? 'de' : DEFAULT_LANG;
  }

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;

        e.preventDefault();
        targetElement.scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  function initNavbarEffect() {
    const nav = document.querySelector('nav');
    if (!nav) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > NAV_SCROLL_THRESHOLD) {
        nav.style.background = 'rgba(2, 6, 23, 0.85)';
        nav.style.backdropFilter = 'blur(12px)';
      } else {
        nav.style.background = 'rgba(2, 6, 23, 0.7)';
      }
    });
  }

  function initRevealAnimation() {
    const revealElements = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver(
      (entries, revealObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('active');
          revealObserver.unobserve(entry.target);
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    revealElements.forEach((el) => observer.observe(el));

    setTimeout(() => {
      revealElements.forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight) {
          el.classList.add('active');
        }
      });
    }, 100);
  }

  function initChart() {
    const canvas = document.getElementById('kpiChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    Chart.defaults.color = '#64748b';
    Chart.defaults.font.family = "'Inter', sans-serif";

    kpiChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: translations.en.chartLabels,
        datasets: [
          {
            label: translations.en.chartDataset1,
            data: [280, 260, 240, 210, 190, 175],
            backgroundColor: 'rgba(51, 65, 85, 0.8)',
            hoverBackgroundColor: 'rgba(71, 85, 105, 1)',
            borderRadius: 4,
            barPercentage: 0.6
          },
          {
            label: translations.en.chartDataset2,
            data: [52, 75, 35, 45, 22, 18],
            backgroundColor: '#2dd4bf',
            hoverBackgroundColor: '#34d399',
            borderRadius: 4,
            barPercentage: 0.6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            position: 'top',
            align: 'end',
            labels: {
              usePointStyle: true,
              boxWidth: 8,
              padding: 20
            }
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            titleColor: '#f8fafc',
            bodyColor: '#cbd5e1',
            borderColor: 'rgba(51, 65, 85, 0.5)',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 8
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 300,
            grid: {
              color: 'rgba(51, 65, 85, 0.3)',
              drawBorder: false
            },
            border: {
              display: false
            }
          },
          x: {
            grid: {
              display: false
            },
            border: {
              display: false
            }
          }
        }
      }
    });
  }

  function initLanguageSwitcher() {
    document.querySelectorAll('.lang-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        applyTranslations(btn.dataset.lang);
      });
    });
  }

  initSmoothScroll();
  initNavbarEffect();
  initRevealAnimation();
  initChart();
  initLanguageSwitcher();

  const initialLanguage = detectInitialLanguage();
  applyTranslations(initialLanguage);
});