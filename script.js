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
document.querySelectorAll('.project-card').forEach(card => {
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
  'เข้าใจทั้งธุรกิจและเทคโนโลยี',
  'แปลงความต้องการเป็นภาษาคอมพิวเตอร์ได้',
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
