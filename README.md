# Portfolio — ณันธภัทร์ ลิ่มเจริญ

เว็บพอร์ตโฟลิโอส่วนตัวแบบหน้าเดียว (single-page) สำหรับใช้สมัครฝึกงาน/สมัครงานสาย IT · Business Analyst · Developer

---

## เปิดดูยังไง

**วิธีที่ง่ายที่สุด** — ดับเบิลคลิก `index.html` ได้เลย ไม่ต้องติดตั้งอะไร ไม่ต้อง `npm install`

**ถ้าอยากเปิดผ่าน local server** (จำเป็นถ้าจะทดสอบพวก share preview):

```bash
# ต้องมี Python อยู่แล้ว
python -m http.server 8000
# แล้วเปิด http://localhost:8000
```

หรือใช้ส่วนขยาย **Live Server** ใน VS Code

---

## โครงสร้างไฟล์

```
portfolio/
├── index.html            # ทั้งเว็บอยู่ในไฟล์เดียว — 7 section
├── style.css             # design token + สไตล์ทุก component
├── script.js             # interaction ทั้งหมด (vanilla JS ไม่มี framework)
├── README.md             # ไฟล์นี้
├── PROMPT_Portfolio.md   # สเปกโปรเจกต์ + ตารางปัญหาที่ยังค้าง
├── images/               # รูปโปรไฟล์ · รูปผลงาน · ใบรับรอง · favicon
└── pdf/                  # CV และเอกสารงานวิเคราะห์ระบบ
```

**Stack:** HTML5 + CSS3 + Vanilla JavaScript (ES6) · ไม่มี build step · ไม่มี dependency ที่ต้องติดตั้ง
พึ่งพา CDN แค่ 2 อย่าง: Font Awesome (ไอคอน) และ Google Fonts (Inter · Cormorant Garamond · Outfit)

---

## เพิ่มเนื้อหาใหม่

หลักการเดียวกันหมด: **หาบล็อกเดิมที่ใกล้เคียงที่สุด copy มาแล้วเปลี่ยนค่า** อย่าคิดโครงสร้างใหม่

### เพิ่มผลงาน (section Projects)

หาคำว่า `<div class="projects-grid">` แล้วเพิ่ม:

```html
<div class="project-card reveal">
  <h3>ชื่อผลงาน</h3>
  <div class="project-img">
    <img src="images/ชื่อไฟล์.jpg" alt="คำอธิบายรูปสั้น ๆ">
  </div>
  <p>อธิบายว่าทำอะไร ใช้อะไร ได้ผลยังไง</p>
  <div class="proj-stack">
    <span>เครื่องมือ 1</span><span>เครื่องมือ 2</span>
  </div>
</div>
```

### เพิ่มใบรับรอง (section Certificates)

```html
<div class="cert-card reveal reveal-delay">
  <div class="brings-icon">
    <i class="fa-solid fa-certificate" style="color: rgb(215, 150, 19);"></i>
  </div>
  <img src="images/ชื่อไฟล์.jpg" class="cert-img" alt="ใบรับรอง X จาก Y">
  <div class="cert-info">
    <h4>ชื่อใบรับรอง</h4>
    <span class="cert-issuer">Issued by ผู้ออก</span>
    <span class="cert-date">ปี</span>
  </div>
</div>
```

### เพิ่มเอกสาร PDF (section Workshop)

วางไฟล์ใน `pdf/` แล้วเพิ่มการ์ดใหม่ใน `<div class="doc-grid">` ของ section Workshop:

```html
<article class="doc-card reveal">
  <div class="doc-card-head">
    <span class="doc-icon"><svg width="20" height="20" aria-hidden="true" focusable="false"><use href="#icon-doc" /></svg></span>
    <span class="doc-kind">รายงานวิเคราะห์ระบบ</span>
  </div>
  <h3 class="doc-title">ชื่อเอกสาร</h3>
  <p class="doc-meta">00 หน้า · PDF · 2567</p>
  <div class="doc-actions">
    <a href="pdf/ไฟล์.pdf" target="_blank" rel="noopener noreferrer" class="btn btn-sm">ดูเอกสาร</a>
    <a href="pdf/ไฟล์.pdf" download class="btn btn-outline btn-sm">ดาวน์โหลด</a>
  </div>
</article>
```

**ไอคอนกับชนิดเอกสารต้องไปด้วยกัน**

| ชนิด | `doc-kind` | ไอคอน |
|---|---|---|
| รายงาน / เอกสารเป็นเล่ม | `รายงานวิเคราะห์ระบบ` | `#icon-doc` |
| สไลด์นำเสนอ | `สไลด์นำเสนอ` | `#icon-slides` |

> **จำนวนหน้าใส่ให้ตรงกับไฟล์จริง** — เปิด PDF ดูเลขหน้าสุดท้ายก็ได้
> ตัวเลขนี้สำคัญกว่าที่คิด รายงานวิเคราะห์ระบบ 74-91 หน้าบอกน้ำหนักงานได้ชัดกว่าคำว่า "PDF" เฉย ๆ มาก

การ์ดจะยืดความสูงให้เท่ากันเองภายในแถวเดียวกัน และแถวปุ่มถูกดันไปชิดล่างด้วย `margin-top: auto`
ชื่อเอกสารยาวกี่บรรทัดปุ่มก็ยังตรงแนวกับใบอื่น

### เพิ่มโลโก้ (แถบ Logo Loop / กริดไทล์)

โหลดไฟล์จาก [thesvg.org](https://thesvg.org) (MIT) — URL ตรงคือ

```
https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/<ชื่อ>/default.svg
```

**1)** เพิ่ม `<symbol>` เข้าไปใน sprite ที่หัว `index.html` โดยเอา **แท็ก `<svg>` ชั้นนอกออก** แล้ว

- ยก attribute ที่อยู่บนแท็กนั้นขึ้นไปไว้บน `<symbol>` ด้วย โดยเฉพาะ `fill` — บางโลโก้ (เช่น Docker) ใส่สีไว้ตรงนี้ที่เดียว ถ้าทิ้งไปโลโก้จะกลายเป็นสีดำ
- ถ้าไฟล์ประกาศ `id` ข้างใน (gradient, clipPath) **ต้องเติม prefix ให้ไม่ซ้ำกับตัวอื่น** แล้วตามไปแก้ `url(#...)` กับ `href="#..."` ทุกจุด หลายไฟล์ตั้งชื่อว่า `id="a"` เหมือนกันหมด

**2)** เรียกใช้ — จะใส่ในแถบวิ่งข้างบน หรือในกริดไทล์ก็ได้ ใช้ `<symbol>` ตัวเดียวกันซ้ำได้เลย

```html
<!-- แถบวิ่งข้างบน (อย่าลืมเพิ่มชื่อในรายการ .sr-only ด้วย) -->
<div class="logo-loop-item">
  <svg data-logo="ชื่อ" viewBox="0 0 กว้าง สูง"><use href="#logo-ชื่อ" /></svg>
</div>

<!-- ไทล์ในกริด (ใส่ในหมวดที่ต้องการ) -->
<div class="tech-tile">
  <svg data-logo="ชื่อ" viewBox="0 0 กว้าง สูง" aria-hidden="true"><use href="#logo-ชื่อ" /></svg>
  <span>ชื่อที่จะให้แสดง</span>
</div>
```

> **เช็คสีก่อนเสมอ** — `default.svg` ของบางแบรนด์เป็นภาพ**สีขาวล้วน** (ทำมาสำหรับพื้นมืด) จะหายไปเลยบนไทล์ขาว
> MySQL เป็นแบบนี้ ต้องเปลี่ยน `fill` เป็นสีแบรนด์เอง · ถ้าไม่มีตัวสีให้ใช้ `mono.svg` แล้วกำหนดสีเอง
> แต่ดูก่อนว่ามีตัวหนังสือชื่อแบรนด์ติดมาในภาพไหม จะได้ไม่ซ้ำกับ `<span>` ใต้โลโก้

> `viewBox` ของ `<svg>` ตัวนี้ต้องขึ้นต้นด้วย **`0 0`** เสมอ ใส่แค่ความกว้าง-สูงจาก viewBox ต้นฉบับ
> (ส่วน `<symbol>` เก็บ viewBox เดิมไว้ทั้งอัน) — ถ้าใส่ค่าที่ไม่ได้เริ่มที่ `0 0` ทั้งสองที่ โลโก้จะเหลือแค่เศษมุมเดียว

**3)** ถ้าโลโก้ทรงสูง (สูงกว่ากว้าง) มันจะดูเล็กกว่าโลโก้ทรงจัตุรัสที่อยู่ข้าง ๆ ทั้งที่สูงเท่ากัน ต้องชดเชยใน [`style.css`](style.css)

- **แถบวิ่ง** เพิ่ม `height` ที่กลุ่ม `.logo-loop-item svg[data-logo="..."]` ได้เลย
- **ไทล์** ต้องใช้ `transform: scale()` ที่กลุ่ม `.tech-tile svg[data-logo="..."]` **ห้ามเพิ่ม `height`** เพราะกล่องถูกล็อกเป็นจัตุรัส 44×44 ไว้ให้ป้ายชื่อทุกใบอยู่ระดับเดียวกัน

จำนวนชุดที่ต้องโคลนคำนวณเองใน [`script.js`](script.js) ไม่ต้องแก้

### กฎที่ต้องรักษาไว้เสมอ

| กฎ | เหตุผล |
|---|---|
| ทุก `<img>` ต้องมี `alt` | คนใช้ screen reader และตอนรูปโหลดไม่ขึ้น |
| ทุก `target="_blank"` ต้องมี `rel="noopener noreferrer"` | ความปลอดภัย |
| path ต้องเป็น `images/...` `pdf/...` **ห้ามมี `../`** | เคยพลาดมาแล้ว รูปแตกทั้งเว็บ |
| ใส่คลาส `reveal` ถ้าอยากให้ค่อย ๆ ปรากฏตอนเลื่อน | เพิ่ม `reveal-delay` / `reveal-delay-2` เพื่อหน่วงเป็นลำดับ |
| section ใหม่ต้องมี `id` **และ**ลิงก์ทั้งใน `.nav-links` และ `.mobile-menu` | ไม่งั้นเข้าไม่ถึงจากเมนู |
| `@media (max-width: ...)` ต้องเรียง **กว้างไปแคบ** เสมอ | ค่าที่แคบกว่าต้องอยู่ทีหลัง ไม่งั้นโดนตัวก่อนหน้าทับจนไม่ทำงาน เคยพลาดมาแล้ว |

> ถ้าเพิ่มลิงก์เมนูเกิน 7 อัน ต้องขยาย `max-height` ของ `.mobile-menu.open` ใน [`style.css`](style.css) ด้วย
> (ลิงก์ละ ~58px — สูตรอยู่ในคอมเมนต์ตรงนั้น) ไม่งั้นลิงก์ท้าย ๆ จะโดน `overflow: hidden` ตัดหายและกดไม่ได้

---


## แก้สี / ฟอนต์

แก้ที่ตัวแปรบนสุดของ [`style.css`](style.css) ที่เดียว ทุกที่จะเปลี่ยนตาม **อย่า hardcode สีลงใน rule**

```css
:root {
  --cream: #F0F4FA;   /* พื้นหลังหลัก */
  --accent: #C9960C;  /* Gold — สีเน้น */
  --accent2: #1a2a5e; /* Deep Indigo */
  --text: #0F1B42;    /* Navy เข้ม */
  ...
}
```

---

## Deploy

เป็น static site ล้วน โฮสต์ที่ไหนก็ได้

**GitHub Pages:** push ขึ้น repo → Settings → Pages → เลือก branch `main` และ folder `/ (root)`

**หลัง deploy แล้วอย่าลืม** เปิด [`index.html`](index.html) แล้วใส่ URL เต็มใน `og:url` และ `og:image`
(Facebook/LINE ไม่รับ path สั้นแบบ `images/myku.png` ต้องเป็น `https://.../images/myku.png`)

---

## เช็กก่อน deploy

- [ ] เปิดหน้าเว็บแล้วรูปขึ้นครบ ไม่มีไอคอนรูปแตก
- [ ] Console ไม่มี error
- [ ] ย่อจอเหลือ 375px แล้วไม่มี horizontal scroll · hamburger ทำงาน
- [ ] ลากหน้าต่างช่วง 960–1100px ดูว่าเมนู 7 ลิงก์ไม่ล้น (จุดคับสุดอยู่ที่ 961px กับ 1041px)
- [ ] ดูแถบ Logo Loop ครบหนึ่งรอบ (~30 วิ) ว่าไม่กระตุกและไม่มีช่องว่างโผล่ตอนวนกลับ
- [ ] ไทล์ทั้ง 32 ใบต้องเห็นโลโก้ครบ (ระวังโลโก้สีขาวล้วนที่จะหายไปบนพื้นขาว) และป้ายชื่ออยู่ระดับเดียวกันหมด
- [ ] ลากหน้าต่างจากกว้างไปแคบ ดูว่าขนาดไทล์ค่อย ๆ เปลี่ยน ไม่กระโดดกลับไปใหญ่ขึ้นตอนจอแคบลง
- [ ] กด Tab ไล่ทั้งหน้า เห็นกรอบโฟกัสทุกจุด
- [ ] คลิก "ดู" ทุกไฟล์ PDF เปิดได้ครบ
- [x] ตรวจการสะกดชื่อ-นามสกุลใน `<title>` และ meta tags (ยืนยันแล้ว: ณันธภัทร์ ลิ่มเจริญ)

---

## งานที่ยังค้าง

ตาราง §14 ใน [`PROMPT_Portfolio.md`](PROMPT_Portfolio.md) — **ปิดไปแล้ว 35 จาก 37 ข้อ** (ISSUE-30 ย่อรูปที่เหลือ เจ้าของสั่งพักไว้ · ISSUE-36 เป็นข้อเสนอที่ยังไม่ได้ตัดสินใจ) เหลืองานพวกนี้:

- **Font Awesome เหลือใช้ไอคอนเดียว** — `fa-certificate` 6 จุด แต่ยังโหลด stylesheet ทั้งก้อนจาก CDN ถ้าย้ายเป็น `<symbol>` จะตัด `<link>` ออกได้เลย (ดู ISSUE-36)

- **`og:url`** — ใส่ URL เต็มหลัง deploy (ดูหัวข้อ Deploy ข้างบน)
- **breakpoint** — ยังกระจาย 5 ค่า (1040 / 960 / 768 / 600 / 560) ควรรวบให้สม่ำเสมอ
- **รูปอื่นในโฟลเดอร์ `images/` ยังหนักอยู่** — รวมกันราว 6.5 MB (ใบรับรอง 6 ใบ ~620 KB/ใบ · INET.jpg 1.1 MB · Zahira.jpg 1.0 MB) ควรย่อแบบเดียวกับที่ทำกับรูปโปรไฟล์ · **เจ้าของสั่งพักไว้ 4 ก.ย. 2026** มีคำถามค้างว่าใบรับรองต้องคลิกซูมได้ไหม (ดู ISSUE-30)
