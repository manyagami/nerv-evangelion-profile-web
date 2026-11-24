/* ==========================================================================
   NERV JAPAN — SMOOTH ANIMATIONS & INTERACTIVE CONTROLLER (4GB RAM FRIENDLY)
   1. Staggered Hero + Rei Ayanami Entrance
   2. IntersectionObserver Scroll-Reveal Transitions
   3. Smooth Crossfade Switching for EVA Units (UNIT-01 First)
   4. Cascading NERV Personnel Roster & Category Filters
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  /* ------------------------------------------------------------------------
     1. HERO ENTRANCE & HEADER SCROLL TRACKING
     ------------------------------------------------------------------------ */
  const revealItems = document.querySelectorAll('.reveal-item');
  revealItems.forEach((item, index) => {
    setTimeout(() => {
      item.classList.add('is-visible');
    }, 90 + index * 110);
  });

  const heroVisual = document.querySelector('.hero-silhouette-wrap');
  if (heroVisual) {
    requestAnimationFrame(() => {
      heroVisual.classList.add('is-visible');
    });
  }

  const siteHeader = document.getElementById('site-header');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  const navItems = document.querySelectorAll('.nav-link');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navItems.forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const sections = document.querySelectorAll('main section[id]');
  const onScroll = () => {
    if (siteHeader) {
      siteHeader.classList.toggle('scrolled', window.scrollY > 30);
    }
    const scrollPos = window.scrollY + window.innerHeight * 0.35;
    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navItems.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ------------------------------------------------------------------------
     2. SMOOTH SCROLL-REVEAL OBSERVER
     ------------------------------------------------------------------------ */
  const revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-inview');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  const registerReveal = (elements, staggerMs = 70) => {
    elements.forEach((el, idx) => {
      el.classList.add('scroll-reveal');
      el.style.transitionDelay = `${Math.min(idx * staggerMs, 350)}ms`;
      revealObserver.observe(el);
    });
  };

  registerReveal(document.querySelectorAll('.section-header'), 0);
  registerReveal(document.querySelectorAll('.eva-spec-card, .eva-viewer-card'), 90);
  registerReveal(document.querySelectorAll('.about-main-card'), 0);
  registerReveal(document.querySelectorAll('.milestone-card'), 90);
  registerReveal(document.querySelectorAll('.social-card'), 90);
  registerReveal(document.querySelectorAll('.footer-inner'), 0);

  /* ------------------------------------------------------------------------
     3. EVANGELION UNITS (UNIT-01 FIRST) & SMOOTH TRANSITIONS
     ------------------------------------------------------------------------ */
  const EVA_UNITS = {
    unit01: {
      designation: 'TEST TYPE',
      name: 'EVA UNIT-01',
      pilot: 'Shinji Ikari',
      color: 'Deep Violet & Neon Green',
      armaments: 'Progressive Knife, Positron Sniper Rifle, Gatling Gun',
      lore: 'Created as the sole Evangelion cloned directly from Lilith, Unit-01 houses the soul of Yui Ikari. Known for exceeding standard synchronization parameters and entering autonomous Berserk states during critical Angel encounters.',
      sketchfabId: 'ef7aaaeecb5042eab2d5b7b0059980c5'
    },
    unit00: {
      designation: 'PROTOTYPE',
      name: 'EVA UNIT-00',
      pilot: 'Rei Ayanami',
      color: 'Cobalt Blue & White',
      armaments: 'Spear of Longinus, Pallet Rifle, ESV Shield',
      lore: 'The first functional Evangelion unit constructed as a prototype testbed. Following severe battle damage against Ramiel, Unit-00 was refitted with blue armor and served as a decisive frontline shield and spear-bearer during Angel engagements.',
      sketchfabId: '998767cd13d14eb3a319ca29fddbac28'
    },
    unit02: {
      designation: 'PRODUCTION MODEL',
      name: 'EVA UNIT-02',
      pilot: 'Asuka Langley Soryu',
      color: 'Crimson Red & Burnt Orange',
      armaments: 'Progressive Knife (Type-II), Sonic Glaive, Dual Pallet Rifles',
      lore: 'The world’s first Production Model Evangelion built in Germany specifically for real combat deployment. Optimized for agile close-quarters engagement and precision multi-weapon tactical sorties.',
      sketchfabId: 'd094f206ef514f499079b1ae9c08d8bf'
    }
  };

  const evaSection = document.getElementById('eva');
  const specCard = document.getElementById('eva-spec-card');
  const unitTabs = document.querySelectorAll('.unit-tabs .glass-pill-tab');
  const elDesignation = document.getElementById('eva-designation');
  const elName = document.getElementById('eva-name');
  const elPilot = document.getElementById('eva-pilot');
  const elColor = document.getElementById('eva-color');
  const elArmaments = document.getElementById('eva-armaments');
  const elLore = document.getElementById('eva-lore');
  const sketchfabFrame = document.getElementById('eva-sketchfab-frame');

  let activeUnit = 'unit01';

  const buildSketchfabUrl = (modelId) => {
    return `https://sketchfab.com/models/${modelId}/embed?autostart=1&autospin=0.35&preload=1&transparent=1&ui_theme=dark&ui_infos=0&ui_watermark=0&ui_help=0&ui_settings=0&ui_inspector=0&ui_annotations=0&ui_stop=0&ui_vr=0`;
  };

  const selectUnit = (unitKey) => {
    if (unitKey === activeUnit) return;
    const data = EVA_UNITS[unitKey];
    if (!data) return;
    activeUnit = unitKey;

    if (evaSection) evaSection.setAttribute('data-unit', unitKey);

    unitTabs.forEach((tab) => {
      const isMatch = tab.dataset.unit === unitKey;
      tab.classList.toggle('active', isMatch);
      tab.setAttribute('aria-selected', String(isMatch));
    });

    // Smooth Spec Card crossfade
    if (specCard) {
      specCard.classList.add('is-switching');
      setTimeout(() => {
        elDesignation.textContent = data.designation;
        elName.textContent = data.name;
        elPilot.textContent = data.pilot;
        elColor.textContent = data.color;
        elArmaments.textContent = data.armaments;
        elLore.textContent = data.lore;
        specCard.classList.remove('is-switching');
      }, 220);
    }

    // Smooth 3D Viewer crossfade
    if (sketchfabFrame) {
      sketchfabFrame.classList.add('is-switching');
      const finishFade = () => sketchfabFrame.classList.remove('is-switching');
      sketchfabFrame.onload = finishFade;
      setTimeout(finishFade, 1400);
      sketchfabFrame.src = buildSketchfabUrl(data.sketchfabId);
    }
  };

  unitTabs.forEach((tab) => {
    tab.addEventListener('click', () => selectUnit(tab.dataset.unit));
  });

  /* ------------------------------------------------------------------------
     4. NERV PERSONNEL ROSTER & CASCADING FILTER TRANSITIONS
     ------------------------------------------------------------------------ */
  const NERV_MEMBERS = [
    {
      name: 'Gendo Ikari',
      category: 'Command & Bridge Crew',
      image: 'gendo.jpg',
      fallback: 'gendo.png',
      description: 'The ruthless Supreme Commander of NERV who answers to SEELE while pursuing his own agenda.'
    },
    {
      name: 'Kozo Fuyutsuki',
      category: 'Command & Bridge Crew',
      image: 'fuyusutki.jpg',
      fallback: 'fuyusutki.png',
      description: 'The Vice-Commander and Gendo’s right-hand man, a former professor who shares a deep history with Yui Ikari.'
    },
    {
      name: 'Misato Katsuragi',
      category: 'Command & Bridge Crew',
      image: 'misato.jpg',
      fallback: 'misato.png',
      description: "The Chief Tactical Officer (later promoted to Major) who directs Evangelion combat operations and acts as the pilots' guardian."
    },
    {
      name: 'Dr. Ritsuko Akagi',
      category: 'Command & Bridge Crew',
      image: 'akagi.jpg',
      fallback: 'akagi.png',
      description: 'The Chief Scientist and head of the Technical Division who oversees Project E and maintains the MAGI supercomputers.'
    },
    {
      name: 'Maya Ibuki',
      category: 'Command & Bridge Crew',
      image: 'ibuki.jpg',
      fallback: 'ibuki.png',
      description: 'A First Lieutenant and computer technician who works closely under Ritsuko to monitor pilot synchronization.'
    },
    {
      name: 'Makoto Hyuga',
      category: 'Command & Bridge Crew',
      image: 'hyuga.jpg',
      fallback: 'hyuga.png',
      description: "A First Lieutenant on the command bridge who manages tactical communications and acts as Misato's trusted confidant."
    },
    {
      name: 'Shigeru Aoba',
      category: 'Command & Bridge Crew',
      image: 'aoba.jpg',
      fallback: 'aoba.png',
      description: 'A First Lieutenant on the command bridge responsible for communications and data analysis.'
    },
    {
      name: 'Ryoji Kaji',
      category: 'Special Operations & Intelligence',
      image: 'kaji.jpg',
      fallback: 'kaji.png',
      description: "Special Inspector for NERV's Intelligence Division operating behind the scenes while investigating NERV, SEELE, and the Human Instrumentality Project."
    },
    {
      name: 'Rei Ayanami',
      category: 'Evangelion Pilots',
      image: 'rei.jpg',
      fallback: 'rei.png',
      description: 'The quiet and enigmatic First Child who pilots Evangelion Unit-00.'
    },
    {
      name: 'Shinji Ikari',
      category: 'Evangelion Pilots',
      image: 'shinji.jpg',
      fallback: 'shinji.png',
      description: 'The reluctant Third Child and son of Gendo Ikari who pilots Evangelion Unit-01.'
    },
    {
      name: 'Asuka Langley Soryu',
      category: 'Evangelion Pilots',
      image: 'asuka.jpg',
      fallback: 'asuka.png',
      description: 'The fiery, prodigy Second Child trained in Germany who pilots Evangelion Unit-02.'
    }
  ];

  const memberListEl = document.getElementById('member-list');
  const filterButtons = document.querySelectorAll('.member-filters .glass-pill-tab');

  const renderMembers = (categoryFilter = 'All', isFilterClick = false) => {
    if (!memberListEl) return;
    const filtered = categoryFilter === 'All'
      ? NERV_MEMBERS
      : NERV_MEMBERS.filter((m) => m.category === categoryFilter);

    memberListEl.innerHTML = '';

    filtered.forEach((member, idx) => {
      const card = document.createElement('article');
      card.className = 'glass-card member-row-card scroll-reveal';
      card.style.transitionDelay = `${Math.min(idx * 55, 320)}ms`;
      card.innerHTML = `
        <div class="member-info">
          <span class="member-category-tag">${member.category}</span>
          <h3 class="member-name">${member.name}</h3>
          <p class="member-desc">${member.description}</p>
        </div>
        <div class="member-portrait-frame">
          <img
            src="${member.image}"
            onerror="this.onerror=null;this.src='${member.fallback}';"
            alt="${member.name}"
            loading="lazy"
          />
        </div>
      `;
      memberListEl.appendChild(card);

      if (isFilterClick) {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            card.classList.add('is-inview');
          });
        });
      } else {
        revealObserver.observe(card);
      }
    });
  };

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((b) => {
        const isActive = b === btn;
        b.classList.toggle('active', isActive);
        b.setAttribute('aria-selected', String(isActive));
      });
      renderMembers(btn.dataset.category, true);
    });
  });

  renderMembers('All', false);
});