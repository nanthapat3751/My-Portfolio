/* ═══════════════════════════════════════════════
   BA Portfolio · script.js
═══════════════════════════════════════════════ */

'use strict';

/* ── ผู้ใช้ตั้งค่า "ลดการเคลื่อนไหว" ไว้ไหม (ใช้ร่วมกับ @media prefers-reduced-motion ใน CSS) ── */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const scrollBehavior = reduceMotion ? 'auto' : 'smooth';

/* ── Click Animation for Images ── */
const clickableImages = document.querySelectorAll('.clickable-image');
clickableImages.forEach(image => {
  image.addEventListener('click', function(e) {
    // Create ripple effect
    const ripple = document.createElement('span');
    ripple.classList.add('ripple-effect');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
    
    // Bounce animation is handled by CSS :active
  });
});

/* ── Back to top button ── */
const backToTopBtn = document.getElementById('backToTop');

if (backToTopBtn) {
  window.addEventListener('scroll', () => {
    backToTopBtn.classList.toggle('show', window.scrollY > 300);
  }, { passive: true });

  backToTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: scrollBehavior });
  });
}

/* ── Navbar scroll effect ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

/* ── Mobile Menu ── */
const hamburger   = document.getElementById('hamburger');
const mobileMenu  = document.getElementById('mobileMenu');
let menuOpen = false;

hamburger.addEventListener('click', () => {
  menuOpen = !menuOpen;
  mobileMenu.classList.toggle('open', menuOpen);
  hamburger.setAttribute('aria-expanded', String(menuOpen));
  // Animate hamburger → X
  const spans = hamburger.querySelectorAll('span');
  if (menuOpen) {
    spans[0].style.transform = 'translateY(6.5px) rotate(45deg)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

// Close menu on link click
mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    menuOpen = false;
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

/* ── Active nav link on scroll ── */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

function setActiveLink() {
  const scrollY = window.scrollY + 100;
  sections.forEach(sec => {
    const top    = sec.offsetTop;
    const height = sec.offsetHeight;
    const id     = sec.getAttribute('id');
    if (scrollY >= top && scrollY < top + height) {
      // บาง section ไม่มีลิงก์ในเมนู (เช่น Workshop) ถ้าล้างไฮไลต์ทิ้งก่อน
      // เมนูจะว่างเปล่าตอนเลื่อนผ่าน จึงเช็กว่ามีลิงก์จริงก่อนค่อยสลับ
      const link = document.querySelector(`.nav-links a[href="#${id}"]`);
      if (link) {
        navLinks.forEach(a => a.classList.remove('active-link'));
        link.classList.add('active-link');
      }
    }
  });
}
window.addEventListener('scroll', setActiveLink, { passive: true });
// ต้องเรียกครั้งแรกเองด้วย ไม่งั้นเปิดหน้ามาเฉย ๆ จะไม่มีเมนูไหนถูกไฮไลต์
// จนกว่าผู้ใช้จะเลื่อนจอ (และถ้าเปิดมาพร้อม #contact ท้าย URL ก็ไฮไลต์ผิดด้วย)
setActiveLink();

/* ── Intersection Observer: reveal animations ── */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

/* ── Education: เส้นเวลาวาดตามการเลื่อน ──
   เส้นทองยืดลงมาถึง "เส้นกระตุ้น" ที่ 62% ของความสูงจอ · จุดไหนอยู่เหนือเส้นนี้
   รายการนั้นได้ .is-on (จุดสว่าง ปีเข้ม การ์ดเลื่อนเข้า) เลื่อนกลับขึ้นก็ดับตาม
   .tl-live เติมจากตรงนี้เท่านั้น — ถ้าสคริปต์ไม่ทำงานหรือผู้ใช้ตั้งลดการเคลื่อนไหว
   CSS จะแสดงทุกอย่างแบบสว่างครบไว้ให้เลย */
const eduTimeline = document.querySelector('.timeline');

if (eduTimeline && !reduceMotion) {
  const TL_TRIGGER = 0.62;
  const tlItems = eduTimeline.querySelectorAll('.tl-item');
  let tlQueued = false;

  const updateTimeline = () => {
    tlQueued = false;
    const rect = eduTimeline.getBoundingClientRect();
    const trigger = window.innerHeight * TL_TRIGGER;
    const progress = Math.min(1, Math.max(0, (trigger - rect.top) / rect.height));

    eduTimeline.style.setProperty('--tl-progress', progress.toFixed(4));
    tlItems.forEach(item => {
      const dot = item.querySelector('.tl-dot');
      item.classList.toggle('is-on', dot.getBoundingClientRect().top < trigger);
    });
  };

  // เลื่อนหนึ่งครั้งยิง event หลายสิบรอบ รวบให้คำนวณเฟรมละครั้งพอ
  const queueTimelineUpdate = () => {
    if (tlQueued) return;
    tlQueued = true;
    requestAnimationFrame(updateTimeline);
  };

  eduTimeline.classList.add('tl-live');
  window.addEventListener('scroll', queueTimelineUpdate, { passive: true });
  window.addEventListener('resize', queueTimelineUpdate);
  updateTimeline();
}

/* ── Smooth scroll for all anchor links ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const offset = 70; // navbar height
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: scrollBehavior });
  });
});

/* ── Project card tilt on hover (subtle) ── */
document.querySelectorAll('.proj-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 4;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 4;
    card.style.transform = `translateY(-4px) rotateY(${x}deg) rotateX(${-y}deg)`;
    card.style.transition = 'transform 100ms ease';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 280ms cubic-bezier(0.4,0,0.2,1), box-shadow 280ms cubic-bezier(0.4,0,0.2,1)';
  });
});

/* ── Projects carousel ──
   ราง .pc-track เลื่อนเองได้อยู่แล้วด้วย overflow-x (นิ้วปัด / trackpad / Shift+ล้อเมาส์)
   ส่วนนี้เพิ่มปุ่มลูกศรลอยริมขอบสำหรับเมาส์ (สั่ง disabled เมื่อสุดทาง แล้ว CSS เอาไปซ่อนต่อ)
   กับจุดบอกตำแหน่งสำหรับมือถือ ซึ่ง CSS สลับให้โผล่ทีละอย่างตามอุปกรณ์ */
(() => {
  const track = document.getElementById('projTrack');
  if (!track) return;

  const arrows = document.querySelectorAll('.pc-arrow[aria-controls="projTrack"]');
  const dotBox = document.getElementById('projDots');
  const items  = track.querySelectorAll('.pc-item');

  // จุดสร้างจากจำนวนการ์ดจริง · การ์ดใบเดียวไม่ต้องมีจุด ไม่มีอะไรให้เลื่อน
  const dots = [];
  if (dotBox && items.length > 1) {
    items.forEach((item, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-controls', 'projTrack');
      const name = item.querySelector('h3');
      b.setAttribute('aria-label', name ? name.textContent.trim() : 'โปรเจกต์ที่ ' + (i + 1));
      b.addEventListener('click', () => {
        track.scrollTo({ left: i * step(), behavior: scrollBehavior });
      });
      dotBox.appendChild(b);
      dots.push(b);
    });
  }

  // เลื่อนทีละ "หนึ่งใบ + ช่องไฟ" ไม่ใช่ทีละความกว้างจอ ไม่งั้นจะกระโดดข้ามการ์ด
  const step = () => {
    const item = track.querySelector('.pc-item');
    if (!item) return track.clientWidth;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return item.getBoundingClientRect().width + gap;
  };

  const sync = () => {
    const max = track.scrollWidth - track.clientWidth;
    const x   = track.scrollLeft;
    arrows.forEach(btn => {
      btn.disabled = Number(btn.dataset.dir) < 0 ? x <= 1 : x >= max - 1;
    });
    if (dots.length) {
      // ปัดสุดทางแล้วการ์ดใบท้าย ๆ มักค้างไม่ตรงช่อง ต้องบังคับให้จุดสุดท้ายติดเอง
      const at = x >= max - 1 ? dots.length - 1 : Math.round(x / step());
      dots.forEach((b, i) => b.setAttribute('aria-current', String(i === at)));
    }
  };

  arrows.forEach(btn => {
    btn.addEventListener('click', () => {
      track.scrollBy({ left: Number(btn.dataset.dir) * step(), behavior: scrollBehavior });
    });
  });

  track.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  // รูปในการ์ดเป็น lazy ความกว้างรวมเลยเปลี่ยนหลังโหลด ต้องคำนวณใหม่อีกรอบ
  window.addEventListener('load', sync);
  sync();
})();

/* ── Certificates: Coverflow 3D + กล่องขยายรูป ──
   ใบกลางหันตรง ใบข้างเอียงลึกเข้าไป · เลื่อนได้ด้วยลูกศร จุด กดใบข้าง ปัดนิ้ว หรือปุ่มซ้ายขวา
   กดใบกลางเพื่อขยายเต็มจอ · HTML ตั้งต้นเป็นกริดธรรมดา ตรงนี้เติม .is-live แล้วค่อยจัดเป็น 3D
   ตำแหน่งของแต่ละใบใส่ผ่าน style ตรง ๆ เพราะขึ้นกับว่าห่างจากใบกลางกี่ใบ เขียนเป็น CSS ล่วงหน้าไม่ได้ */
(() => {
  const flow = document.getElementById('certFlow');
  if (!flow) return;

  const stage = flow.querySelector('.cert-stage');
  const items = Array.from(flow.querySelectorAll('.cert-item'));
  if (!stage || items.length < 2) return;

  const CF_SHIFT = 58;    // ใบข้างเลื่อนออกไปกี่ % ของความกว้างใบ (ต่อหนึ่งลำดับ)
  const CF_DEPTH = 150;   // ถอยลึกเข้าไปกี่ px (ต่อหนึ่งลำดับ)
  const CF_ANGLE = 42;    // ใบข้างเอียงกี่องศา
  const CF_VISIBLE = 2;   // โชว์ใบข้างได้ข้างละกี่ใบ ที่ไกลกว่านี้ซ่อน
  const SWIPE_MIN = 45;   // ปัดเกินกี่ px ถึงนับว่าตั้งใจเลื่อน

  const n = items.length;
  const shots = items.map(item => item.querySelector('.cert-shot'));
  const titles = items.map(item => item.querySelector('h3').textContent.trim());
  const subs = items.map(item => {
    const issuer = item.querySelector('.cert-issuer');
    const date = item.querySelector('.cert-date');
    return [issuer, date].filter(Boolean).map(el => el.textContent.trim()).join(' · ');
  });

  const bar = flow.querySelector('.cert-bar');
  const cap = flow.querySelector('.cert-cap');
  const dotBox = flow.querySelector('.cert-dots');
  // เริ่มที่ใบกลางรายการ จะได้มีใบโผล่ทั้งสองข้างตั้งแต่แรก
  let active = Math.floor(n / 2);

  const dots = items.map((_, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', titles[i]);
    b.addEventListener('click', () => go(i));
    dotBox.appendChild(b);
    return b;
  });

  const render = () => {
    items.forEach((item, i) => {
      const d = i - active;
      const far = Math.abs(d);
      const angle = d === 0 ? 0 : (d > 0 ? -CF_ANGLE : CF_ANGLE);

      item.style.transform =
        `translateX(calc(-50% + ${d * CF_SHIFT}%)) translateZ(${-far * CF_DEPTH}px) rotateY(${angle}deg)`;
      item.style.zIndex = String(n - far);
      item.style.opacity = far > CF_VISIBLE ? '0' : '1';
      item.style.pointerEvents = far > CF_VISIBLE ? 'none' : '';
      item.style.filter = far ? 'brightness(0.93)' : '';
      item.classList.toggle('is-active', d === 0);

      // Tab เข้ามาแล้วเจอใบกลางใบเดียว ใบอื่นไปถึงด้วยปุ่มซ้ายขวา
      shots[i].tabIndex = d === 0 ? 0 : -1;
      shots[i].setAttribute('aria-label', (d === 0 ? 'ขยายดู ' : 'เลื่อนไปที่ ') + titles[i]);
      dots[i].setAttribute('aria-current', String(d === 0));
    });
    cap.innerHTML = items[active].querySelector('.cert-info').innerHTML;
  };

  // เลยใบสุดท้ายแล้ววนกลับใบแรก
  const go = (i, focus) => {
    active = (i + n) % n;
    render();
    if (focus) shots[active].focus({ preventScroll: true });
  };

  // ── กล่องขยายรูป ──
  const zoom = document.getElementById('certZoom');
  const canZoom = zoom && typeof HTMLDialogElement === 'function' && HTMLDialogElement.prototype.showModal;
  const zoomImg = document.getElementById('certZoomImg');
  const zoomTitle = document.getElementById('certZoomTitle');
  const zoomSub = document.getElementById('certZoomSub');
  let zoomAt = 0;

  const showZoom = i => {
    zoomAt = (i + n) % n;
    const img = shots[zoomAt].querySelector('img');
    zoomImg.src = img.currentSrc || img.src;
    zoomImg.alt = img.alt;
    zoomTitle.textContent = titles[zoomAt];
    zoomSub.textContent = `${subs[zoomAt]} · ${zoomAt + 1} / ${n}`;
  };

  const openZoom = i => {
    if (!canZoom) return;
    showZoom(i);
    zoom.showModal();
    document.body.style.overflow = 'hidden';
  };

  if (canZoom) {
    zoom.querySelector('[data-close]').addEventListener('click', () => zoom.close());
    zoom.querySelectorAll('[data-dir]').forEach(btn => {
      btn.addEventListener('click', () => showZoom(zoomAt + Number(btn.dataset.dir)));
    });
    // กดบนฉากหลังหรือที่ว่างรอบรูปแล้วปิด — กล่องโปร่งใสและ padding: 0 จึงไม่มีขอบให้กดพลาด
    zoom.addEventListener('click', e => { if (e.target === zoom) zoom.close(); });
    zoom.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') showZoom(zoomAt - 1);
      else if (e.key === 'ArrowRight') showZoom(zoomAt + 1);
    });
    zoom.addEventListener('close', () => {
      document.body.style.overflow = '';
      // ไล่ดูในกล่องไปถึงใบไหน ปิดแล้ว coverflow ก็อยู่ที่ใบนั้น
      go(zoomAt, true);
    });
  }

  // ── การควบคุม ──
  let downX = null;
  let swiped = false;

  shots.forEach((shot, i) => {
    shot.addEventListener('click', () => {
      if (swiped) return;
      if (i === active) openZoom(i); else go(i);
    });
  });

  bar.querySelectorAll('.cert-arrow').forEach(btn => {
    btn.addEventListener('click', () => go(active + Number(btn.dataset.dir)));
  });

  stage.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(active - 1, true); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); go(active + 1, true); }
  });

  stage.addEventListener('pointerdown', e => { downX = e.clientX; swiped = false; });
  stage.addEventListener('pointerup', e => {
    if (downX === null) return;
    const dx = e.clientX - downX;
    downX = null;
    if (Math.abs(dx) < SWIPE_MIN) return;
    // ปัดแล้วเบราว์เซอร์ยังยิง click ตามมา กันไว้ไม่ให้เลื่อนซ้ำหรือเปิดกล่องขยาย
    swiped = true;
    setTimeout(() => { swiped = false; }, 0);
    go(active + (dx < 0 ? 1 : -1));
  });
  stage.addEventListener('pointercancel', () => { downX = null; });

  flow.classList.add('is-live');
  bar.hidden = false;
  dotBox.hidden = false;
  render();
})();

/* ── ปุ่ม CV บนมือถือ: แผ่นเลือกจากล่างจอ ──
   จอ ≤768px แถบบนมีที่ไม่พอให้ปุ่ม View / Download มีข้อความ เลยรวมเป็นปุ่ม "CV" ปุ่มเดียว
   กดแล้ว <dialog id="cvSheet"> เลื่อนขึ้นจากล่างจอ · ใช้ showModal() จึงได้ focus trap กับปุ่ม Esc มาเอง
   คลาส has-cv-sheet บน <html> คือสวิตช์ให้ CSS ซ่อนสองปุ่มเดิมแล้วโชว์ปุ่มใหม่
   เติมเฉพาะเมื่อเปิด dialog ได้จริง เบราว์เซอร์เก่าจึงยังเห็นสองปุ่มเดิม */
(() => {
  const sheet = document.getElementById('cvSheet');
  const opener = document.getElementById('cvOpen');
  if (!sheet || !opener) return;
  if (typeof HTMLDialogElement !== 'function' || !HTMLDialogElement.prototype.showModal) return;

  document.documentElement.classList.add('has-cv-sheet');

  opener.addEventListener('click', () => {
    sheet.showModal();
    document.body.style.overflow = 'hidden';
  });

  // ปิดเมื่อ: กดฉากหลัง (เป้าคือตัว dialog เอง เพราะ padding อยู่ที่ชั้นใน) · กดปุ่มปิด · กดลิงก์ดูหรือโหลด
  // กดลิงก์แล้วปิดแผ่นเฉย ๆ ไม่ได้ยกเลิกการทำงานของลิงก์ แท็บใหม่/การดาวน์โหลดยังเกิดตามปกติ
  sheet.addEventListener('click', e => {
    if (e.target === sheet || e.target.closest('a, [data-close]')) sheet.close();
  });

  sheet.addEventListener('close', () => {
    document.body.style.overflow = '';
  });

  // หมุนจอหรือขยายหน้าต่างจนเกิน 768px ปุ่ม CV หายไปแล้ว แผ่นก็ต้องปิดตาม
  window.matchMedia('(min-width: 769px)').addEventListener('change', e => {
    if (e.matches && sheet.open) sheet.close();
  });
})();

/* ── Workshop: กล่องรายละเอียดเอกสาร ──
   ใช้ <dialog> ของเบราว์เซอร์ จึงไม่ต้องเขียน focus trap / ปุ่ม Esc / ฉากหลังเอง
   เบราว์เซอร์เก่าที่ไม่มี showModal จะไม่ผูกปุ่มให้เลย ปุ่มจะเฉย ๆ แทนที่จะพังทั้งหน้า */
const docModals = document.querySelectorAll('.doc-modal');

if (docModals.length && typeof HTMLDialogElement === 'function' && HTMLDialogElement.prototype.showModal) {
  let lastFocused = null;

  const openDocModal = id => {
    const next = document.getElementById(id);
    if (!next) return;
    document.querySelectorAll('.doc-modal[open]').forEach(o => o.close());
    next.showModal();
    const body = next.querySelector('.dm-body');
    if (body) body.scrollTop = 0;   // เปิดเล่มถัดไปต้องเริ่มอ่านจากบนสุด
    document.body.style.overflow = 'hidden';
  };

  document.querySelectorAll('[data-open]').forEach(btn => {
    btn.addEventListener('click', () => {
      // จำปุ่มที่เปิดไว้ เพื่อคืนโฟกัสตอนปิด แต่ไม่นับปุ่มก่อนหน้า/ถัดไปที่อยู่ในกล่อง
      if (!btn.closest('.doc-modal')) lastFocused = btn;
      openDocModal(btn.dataset.open);
    });
  });

  docModals.forEach(dlg => {
    dlg.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', () => dlg.close()));

    // คลิกฉากหลังนอกกล่องแล้วปิด — กล่องตั้ง padding: 0 ไว้
    // พื้นที่ที่เหลือของ dialog จึงเป็นฉากหลังล้วน ไม่มีขอบให้กดพลาด
    dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });

    dlg.addEventListener('close', () => {
      // กด "ถัดไป" จะปิดอันเก่าแล้วเปิดอันใหม่ทันที อย่าเพิ่งคืนค่าถ้ายังมีกล่องเปิดอยู่
      if (document.querySelector('.doc-modal[open]')) return;
      document.body.style.overflow = '';
      if (lastFocused) { lastFocused.focus(); lastFocused = null; }
    });
  });
}

/* ── Keyboard shortcuts ── */
document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('keydown', (e) => {
    // Esc to close mobile menu
    if (e.key === 'Escape' && menuOpen) {
      menuOpen = false;
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.focus();
      hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });
});

/* ── Ripple Effect for Navigation ── */
function createRipple(event) {
  const button = event.currentTarget;
  const circle = document.createElement('span');
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;

  const rect = button.getBoundingClientRect();
  circle.style.width = circle.style.height = diameter + 'px';
  circle.style.left = event.clientX - rect.left - radius + 'px';
  circle.style.top = event.clientY - rect.top - radius + 'px';
  circle.classList.add('ripple-effect');

  const ripple = button.querySelector('.ripple-effect');
  if (ripple) {
    ripple.remove();
  }

  button.appendChild(circle);

  setTimeout(() => {
    circle.remove();
  }, 600);
}

// ระลอกคลื่นเหลือแค่เมนูมือถือ (แถวเต็มความกว้าง มีพื้นให้คลื่นวิ่ง)
// เมนูบนสุดใช้เส้นทองใต้คำแทน ไม่มีกล่องมากั้นคลื่นแล้วมันจะล้นไปทับลิงก์ข้าง ๆ
document.querySelectorAll('.mobile-menu a').forEach(link => {
  link.addEventListener('click', createRipple);
});

const phrases = [
  // สองประโยคแรกเป็นของเดิม อีกสองประโยคเพิ่มให้ครบสายที่ยื่น: SA/BA → Developer → Data
  // ประโยคแรกต้องตรงกับข้อความสำรองใน #typingText ของ index.html
  'เข้าใจทั้งธุรกิจและเทคโนโลยี',
  'แปลงความต้องการเป็นภาษาคอมพิวเตอร์ได้',
  'พัฒนาระบบให้ใช้งานได้จริง',
  'เปลี่ยนข้อมูลให้เป็นสิ่งที่ใช้ตัดสินใจได้',
];

let pi = 0;
let ci = 0;
let deleting = false;

const el = document.getElementById('typingText');

function type() {
  const phrase = phrases[pi];

  if (!deleting) {
    el.textContent = phrase.slice(0, ++ci);

    if (ci === phrase.length) {
      deleting = true;
      setTimeout(type, 1500);
      return;
    }
  } else {
    el.textContent = phrase.slice(0, --ci);

    if (ci === 0) {
      deleting = false;
      pi = (pi + 1) % phrases.length;
    }
  }

  setTimeout(type, deleting ? 40 : 70);
}

if (reduceMotion) {
  el.textContent = phrases[0];
} else {
  type();
}

// โคลนชุดโลโก้ต่อท้ายให้แถบวิ่งวนไม่มีรอยต่อ
// animation เลื่อน -50% ของแถบ ดังนั้น (1) จำนวนชุดต้องเป็นเลขคู่ ครึ่งแถบจะได้เท่ากับจำนวนชุดเต็ม ๆ
// และ (2) ครึ่งแถบต้องกว้างกว่าช่องที่มองเห็น ไม่งั้นตอนวนกลับจะโผล่ช่องว่างท้ายแถบ
// 1 ชุดกว้างแค่ ~630px แต่ช่องมองเห็นกว้างได้ถึง 1020px (.container 1100 - padding 80) จึงต้องโคลนมากกว่า 1 รอบ
// ตั้งเป้าไว้ 1200px เผื่อไว้ ผู้ใช้ย่อ-ขยายหน้าต่างทีหลังก็ยังไม่เห็นช่องว่าง
const MIN_HALF_WIDTH = 1200;
const track = document.getElementById('logoTrack');

if (track && !reduceMotion) {
  const oneSet = track.innerHTML;
  const setsPerHalf = Math.max(1, Math.ceil(MIN_HALF_WIDTH / track.offsetWidth));
  track.innerHTML = oneSet.repeat(setsPerHalf * 2);
}

/* ── Contact: แสงสีทองลอยตามเมาส์ ──
   ตำแหน่งตั้งต้นอยู่ใน CSS (.contact-section::before) ตรงนี้แค่ส่งพิกัดเมาส์ให้ผ่าน --glow-x / --glow-y
   เฉพาะเครื่องที่มีเมาส์และไม่ได้ตั้งลดการเคลื่อนไหว · เมาส์ออกแล้วแสงกลับไปที่เดิม */
const contactSection = document.querySelector('.contact-section');

if (contactSection && !reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  contactSection.addEventListener('pointermove', e => {
    const rect = contactSection.getBoundingClientRect();
    contactSection.style.setProperty('--glow-x', `${e.clientX - rect.left}px`);
    contactSection.style.setProperty('--glow-y', `${e.clientY - rect.top}px`);
  });
  contactSection.addEventListener('pointerleave', () => {
    contactSection.style.removeProperty('--glow-x');
    contactSection.style.removeProperty('--glow-y');
  });
}

// ปุ่มคัดลอกอีเมล — มีไว้เผื่อเครื่องที่กด mailto แล้วไม่มีโปรแกรมอีเมลเปิดขึ้นมา
// ปุ่มถูกซ่อนไว้ใน HTML แล้วเปิดตรงนี้ เพราะ clipboard ใช้ไม่ได้ถ้าเปิดไฟล์แบบ file://
// หรือเสิร์ฟผ่าน http ธรรมดา ถ้าโชว์ไว้เฉย ๆ จะกลายเป็นปุ่มกดแล้วไม่เกิดอะไร
const copyBtn = document.getElementById('copyEmail');

if (copyBtn && navigator.clipboard && window.isSecureContext) {
  const label = copyBtn.querySelector('.cc-text');
  const idle = label.textContent;
  let resetTimer = null;

  copyBtn.hidden = false;

  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(copyBtn.dataset.email)
      .then(() => { label.textContent = 'คัดลอกแล้ว'; })
      .catch(() => { label.textContent = 'คัดลอกไม่สำเร็จ'; })
      .then(() => {
        clearTimeout(resetTimer);
        resetTimer = setTimeout(() => { label.textContent = idle; }, 2000);
      });
  });
}
