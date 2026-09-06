# IT Portfolio — ณันธภัทร์ ลิ่มเจริญ (Nanthapat Limcharoen)

A single-page personal portfolio, hand-built with plain HTML, CSS, and JavaScript.
No framework, no bundler, nothing to install — open `index.html` and it runs.

**Live site:** https://nanthapat3751.github.io/My-Portfolio/

> เว็บพอร์ตโฟลิโอหน้าเดียว เขียนด้วย HTML / CSS / JavaScript ล้วน ไม่มี framework ไม่ต้อง build
> ใช้แนะนำตัวสำหรับสมัครฝึกงานและสมัครงานสาย IT · Business Analyst · Developer

---

## Highlights

**No build step, no dependencies** — the entire site is three files: `index.html`, `style.css`, `script.js`.
Total payload of the code itself is about 145 KB, uncompressed.

**One inline SVG sprite instead of 38 image requests** — every icon and technology logo is a
`<symbol>` defined once at the top of the document and reused with `<use href="#id">`. Logos stay
crisp at any size, inherit color from CSS, and cost zero extra network round-trips.

**Built to be readable without a mouse or animation** — all 11 images carry `alt` text, focus rings
are drawn with `:focus-visible` so keyboard users can tab the whole page, and both the CSS and the
JavaScript respect `prefers-reduced-motion`: the marquee, the scroll reveals, and the hover
transitions all stand down for anyone who has asked their OS to reduce motion.

**Responsive from 1440px to 375px** — a design-token system (23 CSS custom properties) drives every
color, radius, and transition, so the palette is changed in one place rather than hunted through
rules.

---

## Contents

| Section | What's in it |
|---|---|
| About | Introduction and profile |
| Skills | 32 tools and languages, shown as an animated logo marquee plus a categorized tile grid |
| Projects | 4 projects — IoT alcohol-detection device, an industry visit report, Zahira Farm, and an AI/cyber-skills workshop |
| Workshop | 4 documents — three system-analysis reports (74–91 pages each) and a presentation deck |
| Education | Academic background |
| Certificates | 6 HackerRank skill certificates |
| Contact | Email, GitHub, Instagram, Facebook, and a downloadable CV |

---

## Tech

| | |
|---|---|
| **Markup / styling** | HTML5 · CSS3 (Grid, Flexbox, custom properties, `@media`) |
| **Scripting** | Vanilla JavaScript (ES6) — `IntersectionObserver`, `matchMedia` |
| **Icons** | Inline SVG sprite · Font Awesome (CDN) |
| **Fonts** | Google Fonts — Inter · Cormorant Garamond · Outfit |
| **Hosting** | GitHub Pages (static) |

---

## Running it locally

Double-click `index.html`. That's it.

To serve it over HTTP instead — needed if you want to test link previews (Open Graph):

```bash
python -m http.server 8000
# → http://localhost:8000
```

Or use the **Live Server** extension in VS Code.

---

## Project structure

```
My-Portfolio/
├── index.html    # the whole site — 7 sections + the SVG sprite
├── style.css     # design tokens and every component style
├── script.js     # nav, mobile menu, scroll reveals, logo marquee
├── images/       # profile, project photos, certificates, favicon
├── pdf/          # CV and system-analysis documents
└── docs/         # maintenance notes
```

---

## Editing the site

Adding a project, a certificate, a PDF, or a new technology logo is a copy-paste job — the templates
and the rules that keep the layout from breaking are in **[docs/MAINTENANCE.md](docs/MAINTENANCE.md)**.

---

## License

The code is free to learn from. The written content, images, certificates, and documents are personal
material — please don't reuse those.

> เนื้อหา รูปภาพ ใบรับรอง และเอกสารในเว็บนี้เป็นข้อมูลส่วนตัว ขอสงวนสิทธิ์ไม่ให้นำไปใช้ต่อครับ
