/**
 * דף הבית – סבב 7 ("אותו שולחן. בוקר אחר.")
 *
 * נבנה אחד־לאחד מהעיצוב שאושר בקנבס. את הפרטים שרק אתה יכול למלא
 * (מחיר, אזור, משך התהליך, משפט אישי, כרטיס מייסדים) משנים ב־content.ts – לא כאן.
 */
import React from "react";
import { Link } from "react-router-dom";
import KrigelLogo from "../../components/KrigelLogo";
import { SITE, FORMSPREE_ID } from "./content";
import "./home.css";

/** Text the way the design runtime printed it: null/undefined become "". */
const s = (x: unknown): string => (x == null ? "" : String(x));

const styleCache = new Map<string, React.CSSProperties>();
/** State-driven styles are built as CSS strings; React wants style objects. */
function css(x: unknown): React.CSSProperties | undefined {
  if (x == null || x === "") return undefined;
  if (typeof x !== "string") return x as React.CSSProperties;
  const hit = styleCache.get(x);
  if (hit) return hit;
  const out: Record<string, string> = {};
  for (const decl of x.split(";")) {
    const i = decl.indexOf(":");
    if (i < 0) continue;
    const k = decl.slice(0, i).trim();
    if (!k) continue;
    const key = k.startsWith("--") ? k : k.replace(/^-webkit-/, "Webkit-").replace(/-([a-z])/g, (_m, c: string) => c.toUpperCase());
    out[key] = decl.slice(i + 1).trim();
  }
  if (styleCache.size > 600) styleCache.clear();
  styleCache.set(x, out as React.CSSProperties);
  return out as React.CSSProperties;
}

// The page logic (hero canvas engine, swipe deck, table scene, forms) lives on the instance.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default class Home extends React.Component<Record<string, never>, any> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;

  constructor(props) {
    super(props);
    var self = this;
    this.state = {
      phase: 'chaos', heroH: 820, mine: [], myth: {}, faq: 0, sent: false, seen: {}, scr: null,
      deck: { idx: 0, sorted: {}, fft: null, snap: null, round: 0 },
      tbDay: false, tbNotes: false,
      sending: false, formErr: '', errField: '',
      guideSent: false, guideSending: false, guideErr: ''
    };
    this._refs = {};
    this._ioEls = {};
    this._timers = [];
    this.headerRef = function (el) { if (el) self._header = el; };
    this.heroRef = function (el) { if (el) self._canvas = el; };
    this.heroTextRef = function (el) { if (el) self._heroText = el; };
    this.mineInRef = function (el) { if (el) self._mineIn = el; };
    this.heroMove = function (e) { self.heroPointer(e, false); };
    this.heroDown = function (e) { self.heroPointer(e, true); };
    this.heroLeave = function () { if (self.hero) self.hero.ptr.on = false; };
    this.doOrder = function () { self.heroOrder(); };
    this.doMess = function () { self.heroMess(); };
    this.mineKey = function (e) { if (e.key === 'Enter') { e.preventDefault(); self.addFromInput(); } };
    this.mineSubmit = function () { self.addFromInput(); };
    // swipe deck
    this.cardRef = function (el) { self._card = el || null; };
    this.stageRef = function (el) { if (el) self._stage = el; };
    this.cardDown = function (e) {
      if (!self._card || self._flying) return;
      self._drag = { x: e.clientX, y: e.clientY, dx: 0, dy: 0 };
      try { self._card.setPointerCapture(e.pointerId); } catch (er) { /* older browsers */ }
      self._card.style.transition = 'none';
    };
    this.cardMove = function (e) {
      var d = self._drag;
      if (!d || !self._card) return;
      d.dx = e.clientX - d.x;
      d.dy = e.clientY - d.y;
      self._card.style.transform = 'translate(' + d.dx + 'px,' + d.dy + 'px) rotate(' + (d.dx * 0.06) + 'deg)';
      var z = self.zoneFor(d.dx, d.dy, 60);
      if (self._stage) self._stage.setAttribute('data-zone', z == null ? '' : String(z));
    };
    this.cardUp = function () {
      var d = self._drag;
      self._drag = null;
      if (!d || !self._card) return;
      var z = self.zoneFor(d.dx, d.dy, 110);
      if (z == null) {
        self._card.style.transition = 'transform .45s cubic-bezier(.2,.9,.3,1.25)';
        self._card.style.transform = '';
        if (self._stage) self._stage.setAttribute('data-zone', '');
      } else {
        self.flyCard(z);
      }
    };
    this.pick0 = function () { self.flyCard(0); };
    this.pick1 = function () { self.flyCard(1); };
    this.pick2 = function () { self.flyCard(2); };
    this.deckRestart = function () {
      self.setState(function (prev) { return { deck: { idx: 0, sorted: {}, fft: null, snap: null, round: prev.deck.round + 1 } }; });
    };
    // same table: 22:47 -> 07:30
    this.tbRef = function (el) {
      if (!el) return;
      self._tbEl = el;
      if (self._tbIO) self._tbIO.observe(el);
    };
    this.tbNight = function () { self._tbManual = true; self._tbPlayed = true; self.setState({ tbDay: false, tbNotes: true }); };
    // forms (Formspree)
    this.nameRef = function (el) { self._nameEl = el || null; };
    this.phoneRef = function (el) { self._phoneEl = el || null; };
    this.guideRef = function (el) { self._guideEl = el || null; };
    this.send = function (e) { if (e && e.preventDefault) e.preventDefault(); self.submitLead(); };
    this.sendGuide = function (e) { if (e && e.preventDefault) e.preventDefault(); self.submitGuide(); };
    this.tbMorning = function () { self._tbManual = true; self._tbPlayed = true; self.setState({ tbDay: true, tbNotes: true }); };
  }

  componentDidMount() {
    var self = this;
    this._mounted = true;
    this._lastW = window.innerWidth;
    var started = false;
    var start = function () {
      if (started || !self._mounted) return;
      started = true;
      if (self._canvas) self.heroInit(self._canvas);
    };
    this.setState({ heroH: this.measureHero() }, start);
    this.later(start, 150);
    this.setupIO();
    this.setupTable();
    if (window.location.hash && window.location.hash.length > 1) {
      var target = decodeURIComponent(window.location.hash.slice(1));
      var landed = -1;
      var jump = function () {
        var el = document.getElementById(target);
        if (!el) return;
        el.scrollIntoView({ block: 'start', behavior: 'instant' });
        landed = window.scrollY;
      };
      this.later(jump, 260);
      // fonts and the measured hero can still move things a little; settle once more unless the visitor already scrolled
      this.later(function () { if (landed >= 0 && Math.abs(window.scrollY - landed) < 4) jump(); }, 1100);
    }
    this._onResize = function () {
      if (self._rz) return;
      self._rz = requestAnimationFrame(function () {
        self._rz = 0;
        var w = window.innerWidth;
        if (w < 760 && Math.abs(w - self._lastW) < 2) return;
        self._lastW = w;
        var nh = self.measureHero();
        if (nh !== self.state.heroH) self.setState({ heroH: nh }, function () { self.heroResize(true); });
        else self.heroResize(true);
      });
    };
    window.addEventListener('resize', this._onResize);
  }

  componentWillUnmount() {
    this._mounted = false;
    if (this.hero) { this.hero.dead = true; cancelAnimationFrame(this.hero.raf); }
    clearTimeout(this._auto);
    clearInterval(this._scrT);
    cancelAnimationFrame(this._rz);
    this._timers.forEach(function (t) { clearTimeout(t); });
    window.removeEventListener('resize', this._onResize);
    if (this._io) this._io.disconnect();
    if (this._heroIO) this._heroIO.disconnect();
    if (this._tbIO) this._tbIO.disconnect();
  }

  later(fn, ms) {
    var self = this;
    var t = setTimeout(function () { if (self._mounted) fn(); }, ms);
    this._timers.push(t);
    return t;
  }

  measureHero() {
    var vh = window.innerHeight || 820, vw = window.innerWidth || 1280;
    var head = this._header ? this._header.getBoundingClientRect().height : 70;
    var small = vw < 760;
    var textH = this._heroText ? this._heroText.getBoundingClientRect().height : 480;
    var h = vh - head - (small ? 74 : 0);
    if (vw >= 1100) return Math.round(Math.min(960, Math.max(h, 620, textH + 90)));
    var pt = small ? 18 : 32;
    return Math.round(Math.min(1160, Math.max(h, textH + pt + (small ? 280 : 380))));
  }

  /* ---------------- the visitor's own expenses ---------------- */
  guessCat(label) {
    var dict: any[] = [
      [3, ['חיסכון', 'השקעה', 'פנסיה', 'חופשה', 'קרן']],
      [0, ['משכנתא', 'שכירות', 'שכר דירה', 'גן', 'מעון', 'צהרון', 'מטפלת', 'ארנונה', 'חשמל', 'מים', 'גז', 'ועד', 'ביטוח', 'הלוואה', 'אינטרנט', 'סלולר', 'טלפון', 'ליסינג', 'שכר לימוד']],
      [2, ['מנוי', 'אפליקציה', 'עמלה', 'עמלות', 'כפול', 'ריבית', 'מינוס', 'ספונטני', 'רכב']],
      [1, ['סופר', 'קניות', 'מסעד', 'ארוחות', 'קפה', 'דלק', 'בגדים', 'משלוח', 'בילוי', 'חוג', 'מתנ', 'פארם', 'תספורת', 'טיפוח', 'כושר', 'צעצוע', 'ספרים', 'חניה', 'תחבורה']]
    ];
    for (var i = 0; i < dict.length; i++) {
      for (var j = 0; j < dict[i][1].length; j++) if (label.indexOf(dict[i][1][j]) >= 0) return dict[i][0];
    }
    return 2;
  }

  addFromInput() {
    var el = this._mineIn;
    if (!el) return;
    var v = String(el.value || '').replace(/\s+/g, ' ').trim().slice(0, 18);
    if (!v) return;
    el.value = '';
    this.addMine(v, null);
  }

  addMine(label, cat) {
    var mine = this.state.mine;
    if (mine.length >= 10) return;
    for (var i = 0; i < mine.length; i++) if (mine[i].label === label) return;
    if (cat == null) cat = this.guessCat(label);
    this.setState(function (prev) { return { mine: prev.mine.concat([{ label: label, cat: cat }]) }; });
    this.heroAdd(label, cat);
  }

  /* ---------------- reveal-on-view ---------------- */
  ioRef(key) {
    var self = this;
    if (!this._refs[key]) {
      this._refs[key] = function (el) {
        if (!el) return;
        self._ioEls[key] = el;
        if (self._io) self._io.observe(el);
      };
    }
    return this._refs[key];
  }

  markSeen(key) {
    if (this.state.seen[key]) return;
    this.setState(function (prev) {
      var s = Object.assign({}, prev.seen);
      s[key] = true;
      return { seen: s };
    });
    if (key === 'stmt') this.startScramble();
  }

  setupIO() {
    var self = this;
    if (!('IntersectionObserver' in window)) {
      ['stmt', 'me', 'nots', 'chat'].forEach(function (k) { self.markSeen(k); });
      return;
    }
    this._io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var k = en.target.getAttribute('data-io');
        if (k) self.markSeen(k);
        self._io.unobserve(en.target);
      });
    }, { threshold: 0.35 });
    Object.keys(this._ioEls).forEach(function (k) { self._io.observe(self._ioEls[k]); });
  }

  /* ---------------- forms: Formspree ---------------- */
  postForm(payload) {
    return fetch('https://formspree.io/f/' + FORMSPREE_ID, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload)
    }).then(function (r) {
      if (!r.ok) throw new Error('formspree ' + r.status);
      return r;
    });
  }

  submitLead() {
    var self = this;
    if (this.state.sending) return;
    var name = String((this._nameEl && this._nameEl.value) || '').trim();
    var phone = String((this._phoneEl && this._phoneEl.value) || '').trim();
    var digits = phone.replace(/[^0-9]/g, '');
    if (!name) {
      this.setState({ formErr: 'איך לקרוא לכם? חסר שם.', errField: 'name' });
      if (this._nameEl) this._nameEl.focus();
      return;
    }
    if (digits.length < 9 || digits.length > 13) {
      this.setState({ formErr: 'נראה שחסרה ספרה במספר הטלפון.', errField: 'phone' });
      if (this._phoneEl) this._phoneEl.focus();
      return;
    }
    var mine = (this.state.mine || []).map(function (m) { return m.label; });
    this.setState({ sending: true, formErr: '', errField: '' });
    this.postForm({
      name: name,
      phone: phone,
      challenge: mine.length ? 'הבלגן שסימנו באתר: ' + mine.join(', ') : 'לא צוין',
      source: 'אתר – טופס שיחת היכרות',
      _subject: 'ליד חדש מהאתר: ' + name
    }).then(function () {
      if (self._mounted) self.setState({ sent: true, sending: false });
    }).catch(function () {
      if (self._mounted) self.setState({ sending: false, formErr: 'משהו השתבש בשליחה. אפשר לנסות שוב, או לכתוב לי ישר בוואטסאפ – הכפתור כאן למטה.' });
    });
  }

  submitGuide() {
    var self = this;
    if (this.state.guideSending) return;
    var email = String((this._guideEl && this._guideEl.value) || '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      this.setState({ guideErr: 'נראה שכתובת המייל לא שלמה.' });
      if (this._guideEl) this._guideEl.focus();
      return;
    }
    this.setState({ guideSending: true, guideErr: '' });
    this.postForm({
      email: email,
      _replyto: email,
      source: 'אתר – בקשה למדריך "קניית רכב בדרך החכמה"',
      _subject: 'בקשה למדריך הרכב: ' + email
    }).then(function () {
      if (self._mounted) self.setState({ guideSent: true, guideSending: false });
    }).catch(function () {
      if (self._mounted) self.setState({ guideSending: false, guideErr: 'משהו השתבש בשליחה. אפשר לנסות שוב בעוד רגע.' });
    });
  }

  /* ---------------- same table: 22:47 -> 07:30 ---------------- */
  setupTable() {
    var self = this;
    var go = function () {
      if (self._tbPlayed) return;
      self._tbPlayed = true;
      self.setState({ tbNotes: true });
      self.later(function () { if (!self._tbManual) self.setState({ tbDay: true }); }, 3600);
    };
    if (!('IntersectionObserver' in window)) { go(); return; }
    this._tbIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && en.intersectionRatio >= 0.55) {
          go();
          if (self._tbIO) self._tbIO.disconnect();
        }
      });
    }, { threshold: [0.55, 0.8] });
    if (this._tbEl) this._tbIO.observe(this._tbEl);
  }

  /* ---------------- scramble statement ---------------- */
  startScramble() {
    var self = this;
    var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    if (reduce || this._scrT) return;
    var segs = ['לא חסר לכם כסף.', 'חסרה לכם ', 'שיטה', '.'];
    var total = 0;
    segs.forEach(function (s) { total += s.length; });
    var pool = 'אבגדהוזחטיכלמנסעפצקרשת₪%0123456789';
    var start = Date.now(), dur = 1500;
    this._scrT = setInterval(function () {
      if (!self._mounted) { clearInterval(self._scrT); return; }
      var t = (Date.now() - start) / dur;
      if (t >= 1) { clearInterval(self._scrT); self.setState({ scr: null }); return; }
      var idx = 0;
      var out = segs.map(function (s) {
        var r = '';
        for (var k = 0; k < s.length; k++, idx++) {
          var ch = s.charAt(k);
          if (ch === ' ' || ch === '.' || t > (idx / total) * 0.8 + 0.2) r += ch;
          else r += pool.charAt(Math.floor(Math.random() * pool.length));
        }
        return r;
      });
      self.setState({ scr: out });
    }, 45);
  }

  /* ================= SWIPE DECK ================= */
  deckBase() {
    return [
      { label: 'שכר דירה', cat: 0, t: 'קבועה – אבל לא קדושה. כדאי לבחון אותה פעם בשנה, כשמגיע מועד החידוש.' },
      { label: 'גן ילדים', cat: 0, t: 'קבועה לכל השנה. כדאי לתכנן מראש גם את הקייטנות של הקיץ, כדי שלא יפתיעו.' },
      { label: 'סופרמרקט', cat: 1, t: 'גמישה, ומרגישים אותה כל שבוע. סכום שבועי קבוע עושה פלאים לשקט הנפשי.' },
      { label: 'מסעדות', cat: 1, t: 'גמישה – ושמורה. בתקציב טוב יש לה מקום מראש, בלי רגשות אשם.' },
      { label: 'סטרימינג', cat: 2, t: 'כמה מנויים באמת פעילים אצלכם? בדיקה קצרה פעם ברבעון חוסכת הפתעות.' },
      { label: 'ביטוח רכב', cat: 0, t: 'קבועה שמתחדשת פעם בשנה. שווה לסמן ביומן את מועד החידוש, כדי שלא יחלוף בלי שתשימו לב.' },
      { label: 'חוגים', cat: 1, t: 'גמישה שמרגישה קבועה. שווה להחליט יחד מה הכי חשוב לכם השנה.' },
      { label: 'דלק', cat: 1, t: 'גמישה ומשתנה מחודש לחודש. קל יותר לעקוב כשהיא מרוכזת בכרטיס אחד.' },
      { label: 'מתנות', cat: 1, t: 'גמישה, ומפתיעה כל פעם מחדש. סכום שנתי שמחולק לחודשים מוריד הרבה לחץ.' },
      { label: 'חדר כושר', cat: 2, t: 'בלי שיפוטיות: האם המנוי עדיין משרת אתכם? אם כן – הוא בפנים.' }
    ];
  }

  deckItems() {
    var d = this.state.deck, mine = d.snap || this.state.mine || [];
    var base = this.deckBase();
    var baseLabels = base.map(function (b) { return b.label; });
    var mineLabels = mine.map(function (m) { return m.label; });
    var own = mine.filter(function (m) { return baseLabels.indexOf(m.label) < 0; }).slice(0, 4).map(function (m) {
      return { label: m.label, cat: m.cat, t: '', mine: true };
    });
    return own.concat(base.map(function (b) { return Object.assign({}, b, { mine: mineLabels.indexOf(b.label) >= 0 }); }));
  }

  zoneFor(dx, dy, th) {
    if (-dy > th && Math.abs(dy) > Math.abs(dx)) return 2;
    if (dx > th) return 0;
    if (dx < -th) return 1;
    return null;
  }

  flyCard(z) {
    var el = this._card, self = this;
    if (!el || this._flying) return;
    this._flying = true;
    if (this._stage) this._stage.setAttribute('data-zone', String(z));
    var tr = z === 0 ? 'translate(780px, 60px) rotate(28deg)' : (z === 1 ? 'translate(-780px, 60px) rotate(-28deg)' : 'translate(0px, -640px) rotate(-6deg)');
    el.style.transition = 'transform .34s cubic-bezier(.5,0,.75,0), opacity .34s';
    el.style.transform = tr;
    el.style.opacity = '0';
    this.later(function () { self.sortCard(z); }, 330);
  }

  sortCard(z) {
    var self = this;
    var items = this.deckItems(), idx = this.state.deck.idx, item = items[idx];
    if (!item) { this._flying = false; return; }
    var names = ['קבועה', 'גמישה', 'לבחינה'];
    var fft;
    if (item.mine && !item.t) fft = { label: item.label, head: 'בחרתם: ' + names[z] + '.', text: 'את זה נבדוק יחד בפגישה – לכל משפחה התשובה קצת אחרת.' };
    else if (z === item.cat) fft = { label: item.label, head: 'גם אצלי: ' + names[z] + '.', text: item.t };
    else fft = { label: item.label, head: 'בחרתם ' + names[z] + ' – לגיטימי. אצלי זה ' + names[item.cat] + ':', text: item.t };
    var reset = function () {
      var el2 = self._card;
      if (el2) {
        el2.style.transition = 'none';
        el2.style.opacity = '1';
        el2.style.transform = 'translateY(14px) scale(.95)';
        void el2.offsetWidth;
        el2.style.transition = 'transform .38s cubic-bezier(.2,.8,.2,1)';
        el2.style.transform = '';
      }
      if (self._stage) self._stage.setAttribute('data-zone', '');
      self._flying = false;
    };
    var called = false;
    this.setState(function (prev) {
      var s = Object.assign({}, prev.deck.sorted);
      s[idx] = z;
      return { deck: { idx: prev.deck.idx + 1, sorted: s, fft: fft, snap: prev.deck.snap || prev.mine.slice(), round: prev.deck.round } };
    }, function () { if (!called) { called = true; reset(); } });
    this.later(function () { if (!called) { called = true; reset(); } }, 90);
  }

  /* ================= HERO ENGINE: ORBIT → ORDER ================= */
  heroData() {
    // [label, category, kind, on-phones, on-desktop]  category: 0 fixed, 1 flexible, 2 review, 3 future · kind: r receipt, n notification
    return [
      ['שכר דירה', 0, 'r', 1, 1], ['גן ילדים', 0, 'r', 1, 1], ['חשמל', 0, 'n', 1, 1], ['ארנונה', 0, 'r', 0, 1], ['ביטוח רכב', 0, 'n', 1, 1],
      ['הלוואה', 0, 'n', 0, 1], ['אינטרנט', 0, 'n', 0, 1],
      ['סופר', 1, 'r', 1, 1], ['מסעדה', 1, 'r', 1, 1], ['קפה', 1, 'r', 1, 1], ['דלק', 1, 'r', 0, 1], ['בגדים', 1, 'r', 0, 1],
      ['משלוח אוכל', 1, 'n', 1, 1], ['מתנה ליום הולדת', 1, 'r', 0, 1], ['חוג', 1, 'n', 1, 1],
      ['מנוי שנשכח', 2, 'n', 1, 1], ['עמלות בנק', 2, 'n', 1, 1], ['מנוי כפול', 2, 'n', 0, 1], ['הוראת קבע ישנה', 2, 'n', 1, 1],
      ['חיסכון לילדים', 3, 'n', 1, 1], ['קרן חירום', 3, 'n', 0, 1], ['חופשה בקיץ', 3, 'r', 0, 1]
    ];
  }

  heroRain() {
    return [
      ['חיוב: מנוי מוזיקה', 2, 'n'], ['חיוב: חניה', 1, 'n'], ['חיוב: קניות אונליין', 1, 'n'], ['חיוב: אפליקציית כושר', 2, 'n']
    ];
  }

  heroCats() {
    return [
      { name: 'קבועות', color: '#6E9A82' },
      { name: 'גמישות', color: '#C9A467' },
      { name: 'לבחינה', color: '#D08A68' },
      { name: 'לעתיד', color: '#F3E9DD' }
    ];
  }

  heroInit(canvas) {
    var self = this;
    if (this.hero && this.hero.canvas === canvas) return;
    var ctx = canvas.getContext ? canvas.getContext('2d') : null;
    if (!ctx) return;
    var H = this.hero = {
      canvas: canvas, ctx: ctx, W: 0, H: 0, dpr: 1, items: [], draw: [], blocks: [], counts: [0, 0, 0, 0],
      tray: { x0: 0, x1: 0, y0: 0, y1: 0 }, mode: 'split', traySig: '',
      phase: 'chaos', ptr: { x: -1e4, y: -1e4, vx: 0, vy: 0, on: false, t: 0 },
      raf: 0, running: false, visible: true, scale: 1, hdr: 0, strip: 0, coreA: 1, boost: 0,
      ringW: [0.0046, -0.0034, 0.0026], rainT: 0, rainN: 0, wave: null,
      dead: false, small: false, t0: performance.now(),
      reduce: !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    };
    this.heroResize(false);
    this.heroBuild();
    if (H.reduce) {
      H.ringW = [0, 0, 0];
      this.heroLayout();
      this.heroSnap();
      this.setState({ phase: 'order' });
    } else {
      this.heroKick();
      this._auto = this.later(function () { self.heroAuto(); }, 6400);
    }
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        if (H.dead) return;
        H.items.forEach(function (it) { self.heroMeasureItem(it); });
        self.heroTray();
        if (H.phase !== 'chaos') { self.heroLayout(); self.heroSnap(); }
        self.heroKick();
      });
    }
    if ('IntersectionObserver' in window) {
      this._heroIO = new IntersectionObserver(function (en) {
        H.visible = en[0].isIntersecting;
        if (H.visible) self.heroKick();
      }, { threshold: 0 });
      this._heroIO.observe(canvas);
    }
  }

  heroTray() {
    var H = this.hero, W = H.W, Hh = H.H, small = W < 760;
    var cr = H.canvas.getBoundingClientRect();
    var tr = this._heroText ? this._heroText.getBoundingClientRect() : null;
    var pad = small ? 20 : 48;
    var left = Math.max(pad, (W - 1280) / 2 + pad), right = W - left;
    if (W >= 1100 && tr && tr.width > 0) {
      H.mode = 'split';
      H.tray = { x0: left, x1: Math.max(left + 320, tr.left - cr.left - 56), y0: 36, y1: Hh - 36 };
    } else {
      H.mode = 'stack';
      var top = (tr && tr.height > 0) ? tr.bottom - cr.top + (small ? 10 : 24) : Hh * 0.5;
      top = Math.min(top, Hh - 230);
      H.tray = { x0: left, x1: right, y0: top, y1: Hh - (small ? 12 : 28) };
    }
    var T = H.tray, sig = [T.x0, T.x1, T.y0, T.y1].map(Math.round).join(',');
    var changed = sig !== H.traySig;
    H.traySig = sig;
    return changed;
  }

  heroResize(relayout) {
    var H = this.hero;
    if (!H) return;
    var r = H.canvas.getBoundingClientRect();
    var W = Math.max(300, Math.round(r.width)), Hh = Math.max(420, Math.round(r.height));
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var sizeChanged = !(W === H.W && Hh === H.H && dpr === H.dpr);
    var wasSmall = H.small;
    if (sizeChanged) {
      H.W = W; H.H = Hh; H.dpr = dpr;
      H.canvas.width = Math.round(W * dpr);
      H.canvas.height = Math.round(Hh * dpr);
      H.small = W < 760;
    }
    var trayChanged = this.heroTray();
    if (!relayout || (!sizeChanged && !trayChanged)) return;
    if (H.small !== wasSmall) {
      this.heroBuild();
      if (H.phase !== 'chaos') { this.heroLayout(); this.heroSnap(); }
    } else if (H.phase !== 'chaos') {
      this.heroLayout();
      this.heroSnap();
    }
    this.heroKick();
  }

  heroMakeItem(label, cat, kind, mine) {
    var small = this.hero.small;
    return {
      kind: kind, label: label, cat: cat, mine: !!mine, fs: small ? 12 : 15, h: kind === 'n' ? (small ? 28 : 34) : (small ? 31 : 40),
      x: 0, y: 0, a: 0, k: 1, sy: 1, alpha: 1, z: 0, ox: 0, oy: 0, ovx: 0, ovy: 0, started: false, flat: false, enter: null
    };
  }

  heroMeasureItem(it) {
    var ctx = this.hero.ctx;
    if (it.kind === 'c') { it.w = it.h = it.r * 2; return; }
    ctx.font = (it.kind === 'n' ? '500 ' : '600 ') + it.fs + 'px Heebo, Assistant, sans-serif';
    var tw = ctx.measureText(it.label).width;
    it.w = Math.round(tw + (it.kind === 'n' ? (this.hero.small ? 34 : 42) : (this.hero.small ? 24 : 30)) + (it.mine ? 8 : 0));
    it.r = Math.sqrt(it.w * it.h) * 0.47;
  }

  heroOrbit() {
    var H = this.hero, T = H.tray, small = H.small;
    var top = T.y0 + (small ? 26 : 42);
    var cx = (T.x0 + T.x1) / 2, cy = top + (T.y1 - top) * 0.5;
    var maxRx = Math.max(60, (T.x1 - T.x0) / 2 - (small ? 46 : 74));
    var maxRy = Math.max(40, (T.y1 - top) / 2 - (small ? 22 : 34));
    var ryO = Math.min(maxRy, maxRx * (small ? 0.9 : 0.86));
    var f = [0.42, 0.71, 1];
    return { cx: cx, cy: cy, rx: [maxRx * f[0], maxRx * f[1], maxRx], ry: [ryO * f[0], ryO * f[1], ryO], core: small ? 22 : 30 };
  }

  heroAssignRings() {
    var H = this.hero, G = this.heroOrbit();
    var C = [0, 1, 2].map(function (r) { return Math.sqrt((G.rx[r] * G.rx[r] + G.ry[r] * G.ry[r]) / 2); });
    var lists = [[], [], []];
    H.items.forEach(function (it) {
      var best = 0, bestV = 1e9;
      for (var r = 0; r < 3; r++) {
        var v = (lists[r].length + 1) / C[r];
        if (v < bestV) { bestV = v; best = r; }
      }
      lists[best].push(it);
    });
    lists.forEach(function (list, r) {
      var off = Math.random() * Math.PI * 2;
      list.forEach(function (it, j) { it.ring = r; it.th = off + Math.PI * 2 * j / list.length; it.ph = Math.random() * Math.PI * 2; });
    });
  }

  heroInsertOrbit(it) {
    var H = this.hero, TAU = Math.PI * 2, r = 2;
    var angs = H.items.filter(function (q) { return q !== it && q.ring === r; })
      .map(function (q) { return ((q.th % TAU) + TAU) % TAU; })
      .sort(function (a, b) { return a - b; });
    var th = Math.random() * TAU;
    if (angs.length) {
      var bestGap = -1;
      for (var i = 0; i < angs.length; i++) {
        var a = angs[i], b = i + 1 < angs.length ? angs[i + 1] : angs[0] + TAU, gap = b - a;
        if (gap > bestGap) { bestGap = gap; th = a + gap / 2; }
      }
    }
    it.ring = r; it.th = th; it.ph = Math.random() * TAU;
  }

  heroEnterFromTop(it, delay, dur) {
    var H = this.hero, T = H.tray;
    it.enter = {
      t0: performance.now() + (delay || 0), dur: dur || 1000,
      x: T.x0 + (T.x1 - T.x0) * (0.15 + 0.7 * Math.random()), y: T.y0 - 50 - Math.random() * 60,
      a: (Math.random() - 0.5) * 1.1, k: 1.15
    };
    it.x = it.enter.x; it.y = it.enter.y; it.a = it.enter.a;
  }

  heroBuild() {
    var H = this.hero, small = H.small, self = this;
    var items = [];
    this.heroData().forEach(function (d) {
      if (small ? d[3] : d[4]) items.push(self.heroMakeItem(d[0], d[1], d[2], false));
    });
    var nCoins = small ? 6 : 10;
    for (var c = 0; c < nCoins; c++) {
      var coin: any = self.heroMakeItem('₪', 3, 'c', false);
      coin.r = small ? 12 : 15;
      items.push(coin);
    }
    for (var s = items.length - 1; s > 0; s--) {
      var j = Math.floor(Math.random() * (s + 1));
      var tmp = items[s]; items[s] = items[j]; items[j] = tmp;
    }
    H.items = items;
    H.rainN = 0;
    items.forEach(function (it) { self.heroMeasureItem(it); });
    this.heroAssignRings();
    (this.state.mine || []).forEach(function (m) {
      var it = self.heroMakeItem(m.label, m.cat, 'r', true);
      self.heroMeasureItem(it);
      self.heroInsertOrbit(it);
      items.push(it);
    });
    this.heroCount();
    items.forEach(function (it, i) { self.heroEnterFromTop(it, 120 + i * 30, 1150); });
    H.draw = items.slice();
  }

  heroCount() {
    var H = this.hero, counts = [0, 0, 0, 0];
    H.items.forEach(function (it) { if (it.kind !== 'c') counts[it.cat]++; });
    H.counts = counts;
  }

  heroAdd(label, cat) {
    var H = this.hero, self = this;
    if (!H) return;
    var it = this.heroMakeItem(label, cat, 'r', true);
    this.heroMeasureItem(it);
    this.heroInsertOrbit(it);
    H.items.push(it);
    this.heroCount();
    if (H.phase === 'chaos' || H.phase === 'pending') {
      this.heroEnterFromTop(it, 0, 1000);
      clearTimeout(this._auto);
      this._auto = this.later(function () { self.heroAuto(); }, 3800);
      this.heroKick();
      return;
    }
    // already sorted: everyone shifts to make room, the new receipt flies into its column
    var T = H.tray;
    it.x = T.x0 + (T.x1 - T.x0) * 0.5; it.y = T.y0 - 40; it.a = -0.4; it.k = 1.15;
    this.heroLayout();
    var now = performance.now();
    H.items.forEach(function (q) {
      q.started = false;
      q.t0 = now;
      q.dur = q === it ? 950 : 560;
      q.spin = q === it ? Math.PI * 2 : 0;
      q.liftR = 0.5;
      q.flat = q !== it;
    });
    H.transEnd = now + 950;
    H.phase = 'ordering';
    this.heroKick();
  }

  heroLayout() {
    var H = this.hero, small = H.small, T = H.tray;
    var inPad = small ? 12 : 26, labelH = small ? 28 : 44;
    var left = T.x0 + inPad, right = T.x1 - inPad;
    var top = T.y0 + labelH, bottom = T.y1 - inPad;
    var cols = (H.mode === 'stack' && right - left >= 700) ? 4 : 2;
    var gap = small ? 14 : 28;
    var colW = (right - left - gap * (cols - 1)) / cols;
    var groups = [[], [], [], []], coins = [];
    H.items.forEach(function (it) { if (it.kind === 'c') coins.push(it); else groups[it.cat].push(it); });
    groups.forEach(function (g) { g.sort(function (a, b) { return (b.mine ? 1 : 0) - (a.mine ? 1 : 0); }); });
    var stacks = small ? 1 : 2;
    var plan = function (s) {
      var headH = (small ? 30 : 42) * Math.max(s, 0.85), rowGap = 8 * s, gapIn = 8 * s;
      return groups.map(function (g, ci) {
        var rows = [], cur = [], curW = 0;
        g.forEach(function (it) {
          var w = it.w * s;
          if (cur.length && curW + gapIn + w > colW) { rows.push(cur); cur = []; curW = 0; }
          curW += (cur.length ? gapIn : 0) + w;
          cur.push(it);
        });
        if (cur.length) rows.push(cur);
        var bodyH = 0;
        rows.forEach(function (row) {
          var mh = 0;
          row.forEach(function (it) { mh = Math.max(mh, it.h * s); });
          bodyH += mh + rowGap;
        });
        var extra = 0;
        if (ci === 3 && coins.length) {
          var cr2 = coins[0].r * s, per = Math.ceil(coins.length / stacks);
          extra = per * 6 * s + cr2 * 0.8 + 16 * s;
        }
        return { ci: ci, rows: rows, h: headH + bodyH + extra, headH: headH, rowGap: rowGap, gapIn: gapIn };
      });
    };
    var need = function (bl) {
      if (cols === 4) return Math.max(bl[0].h, bl[1].h, bl[2].h, bl[3].h);
      return Math.max(bl[0].h, bl[1].h) + gap + Math.max(bl[2].h, bl[3].h);
    };
    var s = 1, blocks = plan(1), n = need(blocks), avail = Math.max(120, bottom - top);
    if (n > avail) { s = Math.max(0.5, avail / n); blocks = plan(s); n = need(blocks); }
    var y0 = top + Math.max(0, (avail - n) / 2);
    var row0H = cols === 2 ? Math.max(blocks[0].h, blocks[1].h) : 0;
    H.scale = s;
    H.blocks = [];
    blocks.forEach(function (b) {
      var colIdx = cols === 2 ? (b.ci % 2) : b.ci;
      var rowIdx = cols === 2 ? Math.floor(b.ci / 2) : 0;
      var bx1 = right - colIdx * (colW + gap), bx0 = bx1 - colW;
      var by0 = y0 + (rowIdx === 1 ? row0H + gap : 0);
      H.blocks.push({ ci: b.ci, x0: bx0, x1: bx1, y0: by0, h: b.h, headH: b.headH });
      var y = by0 + b.headH;
      b.rows.forEach(function (row) {
        var x = bx1, mh = 0;
        row.forEach(function (it) {
          var w = it.w * s, h = it.h * s;
          it.tx = x - w / 2; it.ty = y + h / 2; it.tk = s; it.tsy = 1; it.ta = 0;
          x -= w + b.gapIn;
          mh = Math.max(mh, h);
        });
        y += mh + b.rowGap;
      });
      if (b.ci === 3) {
        var per = Math.ceil(coins.length / stacks);
        coins.forEach(function (c, k) {
          var st = Math.floor(k / per), idx = k % per, crr = c.r * s;
          c.tx = bx0 + crr + 4 + st * (crr * 2 + 12);
          c.ty = by0 + b.h - crr * 0.4 - 8 * s - idx * 6 * s;
          c.tk = s; c.tsy = 0.38; c.ta = 0;
        });
      }
    });
    var cards = H.items.filter(function (it) { return it.kind !== 'c'; });
    var cs = H.items.filter(function (it) { return it.kind === 'c'; }).sort(function (a, b) { return b.ty - a.ty; });
    H.draw = cards.concat(cs);
  }

  heroSnap() {
    var H = this.hero;
    H.items.forEach(function (it) {
      it.x = it.tx; it.y = it.ty; it.a = it.ta; it.k = it.tk; it.sy = it.tsy; it.alpha = 1;
      it.ox = 0; it.oy = 0; it.ovx = 0; it.ovy = 0; it.started = true; it.px = null; it.enter = null;
    });
    H.phase = 'order'; H.hdr = 1; H.strip = 1; H.coreA = 0;
    this.heroKick();
    if (H.reduce || !H.running) this.heroDraw();
  }

  heroAuto() {
    var H = this.hero, self = this;
    if (!H || H.phase !== 'chaos') return;
    this._autoTries = (this._autoTries || 0) + 1;
    if (Date.now() - H.ptr.t < 900 && this._autoTries < 4) {
      this._auto = this.later(function () { self.heroAuto(); }, 1500);
      return;
    }
    this.heroOrder();
  }

  heroOrder() {
    var H = this.hero, self = this;
    if (!H || H.phase !== 'chaos') return;
    clearTimeout(this._auto);
    H.phase = 'pending';
    var go = function () {
      if (H.dead) return;
      self.heroTray();
      var G = self.heroOrbit();
      self.heroLayout();
      if (H.reduce) { self.heroSnap(); return; }
      var now = performance.now();
      var seq = H.items.slice().sort(function (a, b) { return (a.cat - b.cat) || (a.ty - b.ty); });
      seq.forEach(function (it, i) {
        it.started = false;
        it.flat = false;
        it.enter = null;
        it.t0 = now + 160 + i * 12;
        it.dur = 760 + Math.random() * 300;
        it.spin = (i % 4 === 0) ? (Math.random() < 0.5 ? -1 : 1) * Math.PI * 2 : 0;
        it.liftR = Math.random();
      });
      var T = H.tray;
      H.wave = { t0: now, x: G.cx, y: G.cy, R: Math.max(T.x1 - T.x0, T.y1 - T.y0) * 0.9 };
      H.transEnd = now + 160 + seq.length * 12 + 1100;
      H.phase = 'ordering';
      self.heroKick();
    };
    var called = false;
    this.setState({ phase: 'order' }, function () { if (!called) { called = true; go(); } });
    this.later(function () { if (!called) { called = true; go(); } }, 60);
  }

  heroMess() {
    var H = this.hero;
    if (!H || (H.phase !== 'order' && H.phase !== 'ordering')) return;
    clearTimeout(this._auto);
    H.phase = 'chaos';
    H.wave = null;
    H.boost = 1.6;
    var now = performance.now();
    H.items.forEach(function (it, i) {
      it.enter = { t0: now + i * 10, dur: 950, x: it.x, y: it.y, a: it.a, k: it.k };
      it.ox = 0; it.oy = 0; it.ovx = 0; it.ovy = 0; it.px = null;
    });
    if (H.reduce) {
      H.items.forEach(function (it) { it.enter = null; });
      H.hdr = 0; H.strip = 0; H.coreA = 1;
    }
    this.setState({ phase: 'chaos' });
    this.heroKick();
    if (H.reduce) { this.heroStep(performance.now(), 1); this.heroDraw(); }
  }

  heroPointer(e, down) {
    var H = this.hero;
    if (!H) return;
    var r = H.canvas.getBoundingClientRect();
    var x = e.clientX - r.left, y = e.clientY - r.top, p = H.ptr;
    if (p.on) { p.vx = x - p.x; p.vy = y - p.y; } else { p.vx = 0; p.vy = 0; }
    p.x = x; p.y = y; p.on = true; p.t = Date.now();
    if (down && H.phase === 'chaos' && !H.reduce) {
      var G = this.heroOrbit();
      H.boost = 2.6;
      H.items.forEach(function (it) {
        var dx = it.x - G.cx, dy = it.y - G.cy, d = Math.sqrt(dx * dx + dy * dy) || 1;
        var near = 1 - Math.min(1, Math.sqrt((it.x - x) * (it.x - x) + (it.y - y) * (it.y - y)) / 300);
        it.ovx += (dx / d) * (5 + 11 * near);
        it.ovy += (dy / d) * (5 + 11 * near);
      });
    }
    this.heroKick();
  }

  heroKick() {
    var H = this.hero, self = this;
    if (!H || H.dead || H.running || !H.visible) return;
    H.running = true;
    H.lastT = performance.now();
    var frame = function (t) {
      if (H.dead) return;
      var dt = Math.min(2.5, Math.max(0.2, (t - H.lastT) / 16.667));
      H.lastT = t;
      var busy = self.heroStep(t, dt);
      self.heroDraw();
      if (busy && H.visible && !H.dead) H.raf = requestAnimationFrame(frame);
      else H.running = false;
    };
    H.raf = requestAnimationFrame(frame);
  }

  heroStep(t, dt) {
    var H = this.hero, items = H.items, n = items.length, T = H.tray, self = this;
    var p = H.ptr, pRecent = p.on && (Date.now() - p.t) < 1200;
    var i, it;
    if (H.phase === 'chaos' || H.phase === 'pending') {
      H.hdr = Math.max(0, H.hdr - 0.07 * dt);
      H.strip = Math.max(0, H.strip - 0.07 * dt);
      H.coreA = Math.min(1, H.coreA + 0.04 * dt);
      H.boost = Math.max(0, H.boost - 0.025 * dt);
      var G = this.heroOrbit();
      var inTray = pRecent && p.x > T.x0 && p.x < T.x1 && p.y > T.y0 && p.y < T.y1;
      var speed = (inTray ? 1.7 : 1) + H.boost;
      // the month keeps happening: new charges keep joining the outer ring
      H.rainT += dt;
      if (H.phase === 'chaos' && t - H.t0 > 3200 && H.rainT > 160 && H.rainN < (H.small ? 2 : 4)) {
        H.rainT = 0;
        var rd = this.heroRain()[H.rainN % 4];
        var ri = this.heroMakeItem(rd[0], rd[1], rd[2], false);
        this.heroMeasureItem(ri);
        this.heroInsertOrbit(ri);
        this.heroEnterFromTop(ri, 0, 1100);
        items.push(ri); n = items.length; H.rainN++;
        this.heroCount();
      }
      var RR = H.small ? 70 : 96;
      for (i = 0; i < n; i++) {
        it = items[i];
        it.th += H.ringW[it.ring] * dt * speed;
        var c = Math.cos(it.th), s = Math.sin(it.th);
        var bx = G.cx + G.rx[it.ring] * c;
        var by = G.cy + G.ry[it.ring] * s + Math.sin(t * 0.0013 + it.ph) * 4;
        var gx = 0, gy = 0;
        if (pRecent) {
          var ex = bx - p.x, ey = by - p.y, e2 = ex * ex + ey * ey;
          if (e2 < RR * RR) {
            var ed = Math.sqrt(e2) || 1, ff = (1 - ed / RR) * 28;
            gx = (ex / ed) * ff; gy = (ey / ed) * ff;
          }
        }
        it.ovx += ((gx - it.ox) * 0.07 - it.ovx * 0.16) * dt;
        it.ovy += ((gy - it.oy) * 0.07 - it.ovy * 0.16) * dt;
        it.ox += it.ovx * dt;
        it.oy += it.ovy * dt;
        var depth = (s + 1) / 2;
        var px = bx + it.ox, py = by + it.oy;
        var pa = 0.07 * Math.sin(t * 0.0011 + it.ph) + 0.05 * c * (H.ringW[it.ring] >= 0 ? 1 : -1);
        var pk = 0.82 + 0.24 * depth, pal = 0.66 + 0.34 * depth, pz = s;
        if (it.enter) {
          var u = (t - it.enter.t0) / it.enter.dur;
          if (u >= 1) it.enter = null;
          else if (u < 0) { px = it.enter.x; py = it.enter.y; pa = it.enter.a; pk = it.enter.k; pal = 1; pz = 2; }
          else {
            var e = 1 - Math.pow(1 - u, 3);
            px = it.enter.x + (px - it.enter.x) * e;
            py = it.enter.y + (py - it.enter.y) * e;
            pa = it.enter.a + (pa - it.enter.a) * e;
            pk = it.enter.k + (pk - it.enter.k) * e;
            pal = 1 + (pal - 1) * e;
            pz = 2 - (2 - s) * e;
          }
        }
        it.x = px; it.y = py; it.a = pa; it.k = pk; it.alpha = pal; it.z = pz;
        it.sy += (1 - it.sy) * Math.min(1, 0.12 * dt);
      }
      H.draw = items.slice().sort(function (a, b) { return a.z - b.z; });
      return true;
    }
    if (H.phase === 'ordering') {
      var done = true;
      H.strip = Math.min(1, H.strip + 0.05 * dt);
      H.coreA = Math.max(0, H.coreA - 0.06 * dt);
      for (i = 0; i < n; i++) {
        it = items[i];
        it.px = it.x; it.py = it.y;
        if (t < it.t0) { done = false; continue; }
        if (!it.started) {
          it.started = true;
          it.p0x = it.x; it.p0y = it.y; it.a0 = it.a; it.k0 = it.k; it.sy0 = it.sy; it.al0 = it.alpha == null ? 1 : it.alpha;
          if (it.flat) { it.cx = (it.x + it.tx) / 2; it.cy = (it.y + it.ty) / 2; }
          else {
            it.cx = (it.x + it.tx) / 2 + (it.liftR - 0.5) * 180;
            it.cy = Math.max(T.y0 + 18, Math.min(it.y, it.ty) - 110 - it.liftR * 130);
          }
        }
        var u2 = (t - it.t0) / it.dur;
        if (u2 >= 1) { it.x = it.tx; it.y = it.ty; it.a = it.ta; it.k = it.tk; it.sy = it.tsy; it.alpha = 1; continue; }
        done = false;
        var e3 = u2 < 0.5 ? 4 * u2 * u2 * u2 : 1 - Math.pow(-2 * u2 + 2, 3) / 2;
        var m1 = 1 - e3;
        it.x = m1 * m1 * it.p0x + 2 * m1 * e3 * it.cx + e3 * e3 * it.tx;
        it.y = m1 * m1 * it.p0y + 2 * m1 * e3 * it.cy + e3 * e3 * it.ty;
        it.a = it.a0 + (it.ta + it.spin - it.a0) * e3;
        it.k = it.k0 + (it.tk - it.k0) * e3;
        it.sy = it.sy0 + (it.tsy - it.sy0) * e3;
        it.alpha = it.al0 + (1 - it.al0) * e3;
      }
      if (t > H.transEnd - 900) H.hdr = Math.min(1, H.hdr + 0.035 * dt);
      if (done) {
        H.phase = 'order';
        items.forEach(function (q2) { q2.a = q2.ta; q2.ox = 0; q2.oy = 0; q2.ovx = 0; q2.ovy = 0; q2.px = null; q2.alpha = 1; });
      }
      return true;
    }
    // ordered: gentle magnetic hover
    H.hdr = Math.min(1, H.hdr + 0.05 * dt);
    H.strip = Math.min(1, H.strip + 0.05 * dt);
    H.coreA = Math.max(0, H.coreA - 0.06 * dt);
    var moving = H.hdr < 1 || H.strip < 1 || H.coreA > 0 || (H.wave && t - H.wave.t0 < 900);
    for (i = 0; i < n; i++) {
      it = items[i];
      var hx = 0, hy = 0;
      if (pRecent) {
        var fx = it.tx - p.x, fy = it.ty - p.y, f2 = fx * fx + fy * fy, R2 = 76;
        if (f2 < R2 * R2) {
          var fd = Math.sqrt(f2) || 1, f3 = (1 - fd / R2) * 13;
          hx = (fx / fd) * f3; hy = (fy / fd) * f3;
        }
      }
      it.ox += (hx - it.ox) * Math.min(1, 0.2 * dt);
      it.oy += (hy - it.oy) * Math.min(1, 0.2 * dt);
      if (Math.abs(it.ox - hx) > 0.05 || Math.abs(it.oy - hy) > 0.05) moving = true;
      it.x = it.tx + it.ox;
      it.y = it.ty + it.oy;
    }
    return moving || pRecent;
  }

  trayPath(ctx, T, rad) {
    var x = T.x0, y = T.y0, w = T.x1 - T.x0, h = T.y1 - T.y0;
    ctx.beginPath();
    ctx.moveTo(x + rad, y);
    ctx.lineTo(x + w - rad, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + rad);
    ctx.lineTo(x + w, y + h - rad);
    ctx.quadraticCurveTo(x + w, y + h, x + w - rad, y + h);
    ctx.lineTo(x + rad, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - rad);
    ctx.lineTo(x, y + rad);
    ctx.quadraticCurveTo(x, y, x + rad, y);
    ctx.closePath();
  }

  drawCore(ctx, G, t, alpha) {
    var R = G.core, sx = Math.cos(t * 0.0017), ax = Math.max(0.08, Math.abs(sx));
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(G.cx, G.cy);
    ctx.fillStyle = 'rgba(201,164,103,0.07)';
    ctx.beginPath(); ctx.arc(0, 0, R * 2.6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(201,164,103,0.09)';
    ctx.beginPath(); ctx.arc(0, 0, R * 1.7, 0, Math.PI * 2); ctx.fill();
    var th = 4 * (1 - ax);
    ctx.fillStyle = '#8C6B30';
    ctx.beginPath(); ctx.ellipse(sx >= 0 ? th : -th, 0, R * ax, R, 0, 0, Math.PI * 2); ctx.fill();
    ctx.shadowColor = 'rgba(224,192,131,0.65)';
    ctx.shadowBlur = 26;
    ctx.fillStyle = '#C9A467';
    ctx.beginPath(); ctx.ellipse(0, 0, R * ax, R, 0, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = '#E8CF94';
    ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.ellipse(0, 0, R * 0.78 * ax, R * 0.78, 0, 0, Math.PI * 2); ctx.stroke();
    if (ax > 0.35) {
      ctx.save();
      ctx.scale(ax, 1);
      ctx.fillStyle = '#6E5220';
      ctx.font = '700 ' + Math.round(R * 1.15) + 'px "Frank Ruhl Libre", "FreeSerif", serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(sx >= 0 ? '₪' : 'K', 0, R * 0.08);
      ctx.restore();
    }
    ctx.restore();
  }

  heroDraw() {
    var H = this.hero, ctx = H.ctx, W = H.W, Hh = H.H, cats = this.heroCats(), self = this, T = H.tray;
    var chaos = H.phase === 'chaos' || H.phase === 'pending';
    var now = performance.now();
    var wave = H.wave && now - H.wave.t0 < 900 ? (now - H.wave.t0) / 900 : -1;
    var G = this.heroOrbit();
    ctx.setTransform(H.dpr, 0, 0, H.dpr, 0, 0);
    ctx.clearRect(0, 0, W, Hh);
    ctx.save();
    this.trayPath(ctx, T, 10);
    ctx.fillStyle = 'rgba(243,233,221,0.025)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(201,164,103,' + (0.28 + (wave >= 0 ? 0.6 * (1 - wave) : 0)).toFixed(3) + ')';
    ctx.lineWidth = wave >= 0 ? 1.5 : 1;
    ctx.stroke();
    ctx.direction = 'rtl';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.font = '500 ' + (H.small ? 11 : 12) + 'px Heebo, sans-serif';
    ctx.fillStyle = '#C9A467';
    var mineN = 0;
    for (var m = 0; m < H.items.length; m++) if (H.items[m].mine) mineN++;
    var lab = chaos ? 'החודש שלכם · המחשה' : 'אחרי 4 פגישות · המחשה';
    if (mineN) lab += ' · ' + mineN + ' שלכם';
    ctx.fillText(lab, T.x1 - 16, T.y0 + (H.small ? 15 : 21));
    this.trayPath(ctx, T, 10);
    ctx.clip();
    if (H.coreA > 0.01) {
      ctx.save();
      ctx.globalAlpha = H.coreA;
      ctx.strokeStyle = 'rgba(201,164,103,0.16)';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 6]);
      for (var r = 0; r < 3; r++) {
        ctx.beginPath();
        ctx.ellipse(G.cx, G.cy, G.rx[r], G.ry[r], 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.setLineDash([]);
      ctx.restore();
    }
    if (wave >= 0) {
      var ew = 1 - Math.pow(1 - wave, 3);
      ctx.strokeStyle = 'rgba(224,192,131,' + (0.5 * (1 - wave)).toFixed(3) + ')';
      ctx.lineWidth = 2 + 6 * (1 - wave);
      ctx.beginPath();
      ctx.arc(H.wave.x, H.wave.y, 10 + H.wave.R * ew, 0, Math.PI * 2);
      ctx.stroke();
    }
    if (H.hdr > 0.01 && H.blocks.length) {
      H.blocks.forEach(function (b) {
        var c = cats[b.ci], s = Math.max(H.scale, 0.85);
        ctx.globalAlpha = H.hdr;
        ctx.textBaseline = 'alphabetic';
        ctx.textAlign = 'right';
        ctx.fillStyle = c.color;
        ctx.font = '500 ' + Math.round((H.small ? 17 : 22) * s) + 'px "Frank Ruhl Libre", "FreeSerif", serif';
        ctx.fillText(c.name, b.x1, b.y0 + b.headH * 0.55);
        ctx.textAlign = 'left';
        ctx.fillStyle = '#9DB0A8';
        ctx.font = '400 ' + Math.round(13 * s) + 'px Heebo, sans-serif';
        ctx.fillText(String(H.counts[b.ci]), b.x0, b.y0 + b.headH * 0.55);
        ctx.globalAlpha = H.hdr * 0.55;
        ctx.fillStyle = c.color;
        ctx.fillRect(b.x0, b.y0 + b.headH - 9 * s, b.x1 - b.x0, 1);
      });
      ctx.globalAlpha = 1;
    }
    var list = H.draw.length ? H.draw : H.items;
    var glow = H.phase === 'order' ? H.hdr : 0;
    var trails = H.phase === 'ordering';
    var coreDrawn = !(H.coreA > 0.01);
    if (!chaos && !coreDrawn) { self.drawCore(ctx, G, now, H.coreA); coreDrawn = true; }
    ctx.lineCap = 'round';
    for (var i = 0; i < list.length; i++) {
      var it = list[i];
      if (!coreDrawn && it.z >= 0) { self.drawCore(ctx, G, now, H.coreA); coreDrawn = true; }
      if (it.y < T.y0 - 80 || it.y > Hh + 80) continue;
      if (trails && it.started && it.px != null && !it.flat) {
        var ddx = it.x - it.px, ddy = it.y - it.py, sp = Math.sqrt(ddx * ddx + ddy * ddy);
        if (sp > 2.5) {
          ctx.strokeStyle = 'rgba(224,192,131,' + Math.min(0.5, sp / 36).toFixed(3) + ')';
          ctx.lineWidth = it.kind === 'c' ? 2 : 3;
          ctx.beginPath();
          ctx.moveTo(it.x - ddx * 4, it.y - ddy * 4);
          ctx.lineTo(it.x, it.y);
          ctx.stroke();
        }
      }
      ctx.save();
      ctx.globalAlpha = it.alpha == null ? 1 : it.alpha;
      ctx.translate(it.x, it.y);
      ctx.rotate(it.a);
      if (it.k !== 1) ctx.scale(it.k, it.k);
      if (it.kind === 'c') self.drawCoin(ctx, it, glow);
      else if (it.kind === 'n') self.drawPill(ctx, it, cats[it.cat].color, H.strip);
      else self.drawReceipt(ctx, it, cats[it.cat].color, H.strip);
      ctx.restore();
    }
    if (!coreDrawn) self.drawCore(ctx, G, now, H.coreA);
    ctx.restore();
  }

  receiptPath(ctx, w, h) {
    var x0 = -w / 2, y0 = -h / 2, nT = Math.max(4, Math.floor(w / 8)), tw = w / nT;
    ctx.beginPath();
    ctx.moveTo(x0, y0 + 3);
    ctx.quadraticCurveTo(x0, y0, x0 + 3, y0);
    ctx.lineTo(x0 + w - 3, y0);
    ctx.quadraticCurveTo(x0 + w, y0, x0 + w, y0 + 3);
    ctx.lineTo(x0 + w, y0 + h - 3);
    for (var k = 0; k < nT; k++) {
      var xr = x0 + w - k * tw;
      ctx.lineTo(xr - tw / 2, y0 + h);
      ctx.lineTo(xr - tw, y0 + h - 3);
    }
    ctx.closePath();
  }

  drawReceipt(ctx, it, color, strip) {
    var w = it.w, h = it.h;
    ctx.save();
    ctx.translate(2, 5);
    this.receiptPath(ctx, w, h);
    ctx.fillStyle = 'rgba(0,0,0,0.34)';
    ctx.fill();
    ctx.restore();
    this.receiptPath(ctx, w, h);
    ctx.fillStyle = it.mine ? '#FFF6E2' : '#F3E9DD';
    ctx.fill();
    if (it.mine) {
      ctx.strokeStyle = '#C9A467';
      ctx.lineWidth = 2.2;
      ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(27,50,44,0.22)';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 3]);
    ctx.beginPath();
    ctx.moveTo(-w / 2 + 7, -h / 2 + 6);
    ctx.lineTo(w / 2 - 7, -h / 2 + 6);
    ctx.stroke();
    ctx.setLineDash([]);
    if (strip > 0.01) {
      var ga = ctx.globalAlpha;
      ctx.globalAlpha = ga * strip;
      ctx.fillStyle = color === '#F3E9DD' ? '#C9A467' : color;
      ctx.fillRect(w / 2 - 5, -h / 2, 5, h - 3);
      ctx.globalAlpha = ga;
    }
    ctx.fillStyle = '#1B322C';
    ctx.font = '600 ' + it.fs + 'px Heebo, Assistant, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.direction = 'rtl';
    ctx.fillText(it.label, strip > 0.5 ? -2 : 0, 2);
    if (it.mine) {
      var tagW = 34, tx = -w / 2 - 4, ty = -h / 2 - 9;
      ctx.fillStyle = '#C9A467';
      ctx.beginPath();
      ctx.moveTo(tx + 6, ty);
      ctx.lineTo(tx + tagW - 6, ty);
      ctx.quadraticCurveTo(tx + tagW, ty, tx + tagW, ty + 6);
      ctx.quadraticCurveTo(tx + tagW, ty + 14, tx + tagW - 6, ty + 14);
      ctx.lineTo(tx + 6, ty + 14);
      ctx.quadraticCurveTo(tx, ty + 14, tx, ty + 6);
      ctx.quadraticCurveTo(tx, ty, tx + 6, ty);
      ctx.fill();
      ctx.fillStyle = '#0B1714';
      ctx.font = '700 10px Heebo, Assistant, sans-serif';
      ctx.fillText('שלכם', tx + tagW / 2, ty + 7.5);
    }
  }

  drawPill(ctx, it, color, strip) {
    var w = it.w, h = it.h, r = h / 2, x0 = -w / 2, y0 = -h / 2;
    var path = function () {
      ctx.beginPath();
      ctx.moveTo(x0 + r, y0);
      ctx.lineTo(x0 + w - r, y0);
      ctx.arc(x0 + w - r, 0, r, -Math.PI / 2, Math.PI / 2);
      ctx.lineTo(x0 + r, y0 + h);
      ctx.arc(x0 + r, 0, r, Math.PI / 2, Math.PI * 1.5);
      ctx.closePath();
    };
    ctx.save();
    ctx.translate(2, 5);
    path();
    ctx.fillStyle = 'rgba(0,0,0,0.38)';
    ctx.fill();
    ctx.restore();
    path();
    ctx.fillStyle = '#1E3832';
    ctx.fill();
    ctx.strokeStyle = 'rgba(201,164,103,0.6)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x0 + w - (this.hero.small ? 12 : 15), 0, this.hero.small ? 3.2 : 4, 0, Math.PI * 2);
    ctx.fillStyle = strip > 0.5 ? color : '#C9A467';
    ctx.fill();
    ctx.fillStyle = '#F3E9DD';
    ctx.font = '500 ' + it.fs + 'px Heebo, Assistant, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.direction = 'rtl';
    ctx.fillText(it.label, -5, 1);
  }

  drawCoin(ctx, it, glow) {
    var r = it.r, sy = Math.max(0.2, it.sy);
    var th = (1 - sy) * 7;
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(2, 4 + th, r, r * sy, 0, 0, Math.PI * 2);
    ctx.fill();
    if (th > 0.3) {
      ctx.fillStyle = '#8C6B30';
      ctx.beginPath();
      ctx.ellipse(0, th, r, r * sy, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(-r, 0, 2 * r, th);
    }
    if (glow > 0.01) { ctx.shadowColor = 'rgba(224,192,131,' + (0.55 * glow).toFixed(3) + ')'; ctx.shadowBlur = 16; }
    ctx.fillStyle = '#C9A467';
    ctx.beginPath();
    ctx.ellipse(0, 0, r, r * sy, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = '#E8CF94';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 0.78, r * 0.78 * sy, 0, 0, Math.PI * 2);
    ctx.stroke();
    if (sy > 0.55) {
      ctx.save();
      ctx.scale(1, sy);
      ctx.fillStyle = '#6E5220';
      ctx.font = '700 ' + Math.round(r * 1.1) + 'px "Frank Ruhl Libre", "FreeSerif", serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('₪', 0, r * 0.08);
      ctx.restore();
    }
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.beginPath();
    ctx.ellipse(-r * 0.3, -r * 0.38 * sy, r * 0.34, r * 0.16 * sy, -0.5, 0, Math.PI * 2);
    ctx.fill();
  }

  /* ================= RENDER VALUES ================= */
  renderVals() {
    var self = this, st = this.state;
    var chaos = st.phase === 'chaos';
    var mine = st.mine || [];
    var hasMine = mine.length > 0;

    // ---- whatsapp, prefilled with the visitor's own mess ----
    var msg = 'היי תומר, הגעתי מהאתר. ' + (hasMine ? 'אצלנו בבלגן: ' + mine.map(function (m) { return m.label; }).join(', ') + '. ' : '') + 'נשמח לשיחת היכרות.';
    var waHref = 'https://wa.me/972543291703?text=' + encodeURIComponent(msg);

    // ---- hero ----
    var presetData = [['משכנתא', 0], ['צהרון', 0], ['רכב', 2], ['מנויים', 2], ['חוגים', 1], ['קניות אונליין', 1], ['חופשה משפחתית', 3]];
    var presets = presetData.map(function (p) {
      var on = mine.some(function (m) { return m.label === p[0]; });
      return { label: p[0], sign: on ? '✓' : '+', pressed: on ? 'true' : 'false', add: function () { self.addMine(p[0], p[1]); } };
    });
    var hero = {
      headerRef: this.headerRef,
      heroRef: this.heroRef,
      heroTextRef: this.heroTextRef,
      mineInRef: this.mineInRef,
      mineKey: this.mineKey,
      mineSubmit: this.mineSubmit,
      heroMove: this.heroMove,
      heroDown: this.heroDown,
      heroLeave: this.heroLeave,
      doOrder: this.doOrder,
      doMess: this.doMess,
      presets: presets,
      heroStyle: 'position: relative; background: #0B1714; overflow: hidden; height: ' + (st.heroH || 820) + 'px',
      isChaos: chaos,
      isOrder: !chaos,
      hasMine: hasMine,
      noMine: !hasMine,
      waHref: waHref,
      waLabel: hasMine ? 'שלחו לי את הבלגן בוואטסאפ' : 'או כתבו לי בוואטסאפ',
      heroL1: chaos ? 'ככה נראה' : 'וככה הוא נראה',
      heroL2: chaos ? 'החודש שלכם.' : 'אחרי 4 פגישות.',
      heroSub: chaos
        ? 'גן, קפה, דלק, מנויים, מתנה ליום הולדת – הכל מסתובב סביבכם בבת אחת. זרקו פנימה גם את מה שיש אצלכם:'
        : (hasMine
          ? 'גם מה שהוספתם מצא מקום – מסומן בזהב. ואת הסדר הזה תדעו לשמור לבד, בלי לוותר על הקפה.'
          : 'כל הוצאה במקומה, ומה שנשאר זורם לעתיד. ואתם יודעים לשמור על הסדר הזה לבד – בלי לוותר על הקפה.'),
      heroHint: 'נסו לגעת בטבעות.',
      heroAria: chaos
        ? 'המחשה: הוצאות ומטבעות מסתובבים בשלוש טבעות סביב מטבע זהב'
        : 'המחשה: אותן הוצאות מסודרות בארבע קבוצות – קבועות, גמישות, לבחינה, ולעתיד עם ערימות מטבעות'
    };

    // ---- statement scramble ----
    var segs = st.scr || ['לא חסר לכם כסף.', 'חסרה לכם ', 'שיטה', '.'];

    // ---- meet Tomer: scattered receipts snap into a neat stack ----
    var meSeen = !!st.seen.me;
    var prin = [
      { t: 'ההווה בפנים', d: 'מסעדות, חופשות וקפה של בוקר נכנסים לתקציב מראש. לא מוותרים – מתכננים.', from: 'translate(-90px, 70px) rotate(-14deg)' },
      { t: 'צעד ראשון שמרגישים מיד', d: 'כבר מהפגישה הראשונה יוצאים עם פעולה קטנה אחת שעושה הבדל.', from: 'translate(110px, -40px) rotate(11deg)' },
      { t: 'עצמאות, לא תלות', d: 'ההצלחה שלי נמדדת ברגע שאתם כבר לא צריכים אותי.', from: 'translate(-40px, -90px) rotate(-7deg)' }
    ];
    var principles = prin.map(function (p, k) {
      return {
        t: p.t, d: p.d, n: 'עיקרון 0' + (k + 1),
        wrap: 'filter: drop-shadow(0 12px 18px rgba(11,23,20,0.16)); transition: transform 1s cubic-bezier(.2,.8,.2,1); transition-delay: ' + (k * 150) + 'ms; transform: ' + (meSeen ? 'none' : p.from)
      };
    });

    // ---- your turn: swipe deck ----
    var deck = st.deck, items = this.deckItems(), N = items.length, idx = deck.idx;
    var cur = items[idx];
    var zoneDefs = [
      { name: 'קבועה', color: '#6E9A82', hint: '→ החליקו ימינה' },
      { name: 'גמישה', color: '#C9A467', hint: 'החליקו שמאלה ←' },
      { name: 'לבחינה', color: '#D08A68', hint: '↑ החליקו למעלה' }
    ];
    var zCounts = [0, 0, 0], zLabels = [[], [], []];
    for (var si = 0; si < N; si++) {
      var zz = deck.sorted[si];
      if (zz == null || !items[si]) continue;
      zCounts[zz]++;
      zLabels[zz].push(items[si].label);
    }
    var zones = zoneDefs.map(function (zd, z) {
      var last = zLabels[z].slice(-3);
      return {
        cls: 'zone zone-' + z,
        name: zd.name,
        nameStyle: 'font-size: 26px; color: ' + zd.color,
        count: zCounts[z],
        hint: zd.hint,
        dropStyle: zCounts[z] ? 'display: none' : 'flex: 1 1 auto; min-height: 56px; margin-top: 8px; border: 1px dashed rgba(201,164,103,0.24); display: flex; align-items: center; justify-content: center; font-size: 13px; color: #6F857D',
        chips: last.map(function (lb, j) {
          return { label: lb, style: 'display: block; width: fit-content; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; background: #F3E9DD; color: #1B322C; font-size: 12px; font-weight: 600; padding: 5px 10px; border-right: 3px solid ' + zd.color + '; box-shadow: 0 6px 12px rgba(0,0,0,.35); margin-top: ' + (j ? '-6px' : '0') + '; transform: rotate(' + (j % 2 ? 2 : -2) + 'deg)' };
        })
      };
    });
    var peeks = [];
    for (var pk = 2; pk >= 1; pk--) {
      if (items[idx + pk]) {
        peeks.push({ label: items[idx + pk].label, face: 'background: ' + (pk === 1 ? '#D8CEC0' : '#B9B0A4'), style: 'transform: translateY(' + (pk * 11) + 'px) scale(' + (1 - pk * 0.045) + ') rotate(' + (pk === 1 ? -2.5 : 2.5) + 'deg)' });
      }
    }
    var fft = deck.fft || { label: 'איך זה עובד', head: 'החליקו את הכרטיס – או לחצו על הכפתורים.', text: 'ימינה: קבועה. שמאלה: גמישה. למעלה: לבחינה. אין כאן נכון ולא נכון – רק חומר למחשבה.' };
    var cats3 = ['#6E9A82', '#C9A467', '#D08A68'];
    var swipe = {
      stageRef: this.stageRef,
      cardRef: this.cardRef,
      cardDown: this.cardDown,
      cardMove: this.cardMove,
      cardUp: this.cardUp,
      pick0: this.pick0,
      pick1: this.pick1,
      pick2: this.pick2,
      deckRestart: this.deckRestart,
      zones: zones,
      peeks: peeks,
      deckActive: !!cur,
      deckDone: !cur,
      cardLabel: cur ? cur.label : '',
      cardCount: cur ? 'הוצאה ' + (idx + 1) + ' מתוך ' + N : '',
      cardAria: cur ? 'הוצאה: ' + cur.label + '. בחרו קטגוריה בעזרת הכפתורים' : '',
      cardTagStyle: cur && cur.mine ? 'font-size: 11px; font-weight: 700; letter-spacing: 0; padding: 2px 9px; border-radius: 10px; background: #C9A467; color: #0B1714' : 'display: none',
      cardFace: 'border-right: 6px solid ' + (cur && cur.mine ? '#C9A467' : '#DCCFBC'),
      btnStyle: cur ? '' : 'opacity: .35; pointer-events: none',
      fftLabel: fft.label,
      fftHead: fft.head,
      fftText: fft.text,
      fftStyle: 'grid-area: fft; display: flex; gap: 14px; align-items: flex-start; padding: 16px 18px; border: 1px solid rgba(201,164,103,.22); background: rgba(243,233,221,.03); animation: ' + (idx % 2 ? 'riseA' : 'riseB') + ' .5s ease both',
      endSegs: cats3.map(function (c, k) { return { style: 'flex: ' + zCounts[k] + ' 1 0px; background: ' + c }; }),
      endText: 'קבועות ' + zCounts[0] + ' · גמישות ' + zCounts[1] + ' · לבחינה ' + zCounts[2]
    };

    // ---- myths ----
    var P = [[0, 0], [30, 0], [62, 0], [100, 0], [100, 38], [100, 72], [100, 100], [68, 100], [34, 100], [0, 100], [0, 64], [0, 30]];
    var C = [54, 46];
    var mythData = [
      { myth: 'תכנון פיננסי אומר לוותר על בילויים', fact: 'תקציב נכון שם את המסעדות, החופשות והקפה בפנים – מראש ובלב שקט.' },
      { myth: 'צריך להרוויח יותר כדי להתחיל לחסוך', fact: 'ברוב המשפחות הפער לא נסגר בשכר – הוא נסגר בשיטה.' },
      { myth: 'סדר בכסף דורש אקסלים מסובכים', fact: 'שיטה פשוטה אחת, שמבינים בפגישה אחת, עושה יותר מעשרה גיליונות.' },
      { myth: 'ליווי פיננסי זה רק לעשירים', fact: 'דווקא משפחות עם הכנסה רגילה מרוויחות ממנו הכי הרבה.' }
    ];
    var myths = mythData.map(function (c, i) {
      var m = st.myth[i] || 0, num = '0' + (i + 1);
      var frags = P.map(function (p, k) {
        var q = P[(k + 1) % P.length];
        var gx = (C[0] + p[0] + q[0]) / 3 - C[0], gy = (C[1] + p[1] + q[1]) / 3 - C[1];
        var len = Math.sqrt(gx * gx + gy * gy) || 1;
        var dist = 150 + ((k * 37 + i * 11) % 110);
        var dx = Math.round(gx / len * dist), dy = Math.round(gy / len * dist + 60);
        var rot = ((k * 53 + i * 29) % 80) - 40;
        var basePoly = 'clip-path: polygon(' + C[0] + '% ' + C[1] + '%, ' + p[0] + '% ' + p[1] + '%, ' + q[0] + '% ' + q[1] + '%); --dx: ' + dx + 'px; --dy: ' + dy + 'px; --rot: ' + rot + 'deg; ';
        var anim = m === 1
          ? 'animation: shatter .95s cubic-bezier(.12,.7,.25,1) both; animation-delay: ' + (k * 14) + 'ms'
          : (m === 2 ? 'animation: assemble .6s cubic-bezier(.4,0,.2,1) both; animation-delay: ' + (k * 12) + 'ms' : 'opacity: 0');
        return { style: basePoly + anim, myth: c.myth, num: num };
      });
      return {
        num: num,
        myth: c.myth,
        fact: c.fact,
        frags: frags,
        pressed: m === 1 ? 'true' : 'false',
        aria: m === 1 ? 'העובדה: ' + c.fact + '. לחצו להרכבה מחדש' : 'המיתוס: ' + c.myth + '. לחצו כדי לנפץ ולגלות את העובדה',
        frontStyle: m === 0 ? 'opacity: 1' : 'opacity: 0',
        crackCls: m === 0 ? '' : 'gone',
        cardStyle: m === 1 ? 'animation: jolt .32s ease' : '',
        toggle: function () {
          var cur2 = self.state.myth[i] || 0;
          if (cur2 === 2) return;
          var next = Object.assign({}, self.state.myth);
          next[i] = cur2 === 0 ? 1 : 2;
          self.setState({ myth: next });
          if (cur2 === 1) {
            self.later(function () {
              var n2 = Object.assign({}, self.state.myth);
              n2[i] = 0;
              self.setState({ myth: n2 });
            }, 760);
          }
        }
      };
    });

    // ---- what I'm not ----
    var notsSeen = !!st.seen.nots;
    var notData = [
      { word: 'איש מכירות', text: 'אין לי מוצרים פיננסיים למכור. ההמלצה שלי לא תלויה במה שתבחרו.' },
      { word: 'עמלות', text: 'שכר הטרחה משולם ישירות על ידכם – ורק על ידכם.' },
      { word: 'סוכן ביטוח', text: 'כשצריך לבדוק ביטוחים, אני מפנה לסוכן מורשה. אני נשאר המצפן.' }
    ];
    var nots = notData.map(function (d, i) {
      var delay = i * 260;
      return {
        word: d.word,
        text: d.text,
        wordStyle: 'position: relative; display: inline-block; min-width: 0; ' + (notsSeen ? 'animation: shake .34s ease both; animation-delay: ' + (delay + 420) + 'ms' : ''),
        barStyle: 'position: absolute; right: -10px; left: -10px; top: 52%; height: 8px; background: #C9A467; transform-origin: right center; transform: scaleX(' + (notsSeen ? 1 : 0) + '); ' + (notsSeen ? 'animation: slam .6s cubic-bezier(.2,.9,.3,1.25) both; animation-delay: ' + delay + 'ms' : '')
      };
    });

    // ---- FAQ ----
    var faqData = [
      { q: 'נצטרך לוותר על דברים שאנחנו אוהבים?', a: 'ממש לא. התקציב שנבנה שם מראש מקום לבילויים, למסעדות ולחופשות – כדי שתיהנו מהם בלי רגשות אשם.' },
      { q: 'חייבים להגיע שנינו?', a: 'מומלץ מאוד, כי שינוי בבית עובד הכי טוב כשיש שפה משותפת. אבל אפשר בהחלט להתחיל עם אחד מכם.' },
      { q: 'מה ההבדל בינך לבין יועץ בבנק?', a: 'אין לי מוצרים למכור ואני לא מקבל עמלות. שכר הטרחה משולם ישירות על ידכם, ולכן ההמלצה נקייה.' },
      { q: 'מה צריך להביא?', a: 'לפני הפגישה הראשונה תקבלו רשימה מסודרת: דפי חשבון ואשראי משלושת החודשים האחרונים, דוחות קופות גמל וקרן השתלמות, ופרטי הלוואות אם יש.' }
    ];
    if (SITE.price) faqData.unshift({ q: 'כמה זה עולה?', a: SITE.price + ' – זה המחיר המלא ל־4 הפגישות, בלי הפתעות ובלי עמלות נסתרות.' });
    var faqs = faqData.map(function (f, i) {
      var open = st.faq === i;
      return {
        q: f.q, a: f.a, open: open,
        expanded: open ? 'true' : 'false',
        signStyle: 'flex: 0 0 auto; font-size: 32px; line-height: 1; color: #7A5C24; transition: transform .3s; transform: rotate(' + (open ? 45 : 0) + 'deg)',
        toggle: function () { self.setState({ faq: self.state.faq === i ? -1 : i }); }
      };
    });

    // ---- meetings ----
    var meetingData = [
      { num: 'I', title: 'מיפוי ובהירות', desc: 'עוברים יחד על התמונה המלאה ומגדירים מטרות. בלי שיפוטיות.', take: 'מיפוי מלא וכלל ראשון לשבוע', you: 0.2, r: [22, 34] },
      { num: 'II', title: 'בונים תקציב שנותן לנשום', desc: 'בונים יחד את התקציב הראשון שלכם – קבועות, גמישות ולבחינה.', take: 'התקציב האישי הראשון שלכם', you: 0.5, r: [32, 44] },
      { num: 'III', title: 'מדייקים מול המציאות', desc: 'כחודש אחרי: משווים לתקציב ומתקנים יחד.', take: 'תקציב מכויל לחיים האמיתיים', you: 0.72, r: [42, 54] },
      { num: 'IV', title: 'אתם בונים, אני מסתכל', desc: 'אתם בונים את התזרים בעצמכם. אני רק מוודא שאתם יוצאים בטוחים.', take: 'היכולת לעשות את זה לבד', you: 0.94, r: [52, 64] }
    ];
    var meetings = meetingData.map(function (m) {
      var off = (339.3 * (1 - m.you)).toFixed(1);
      return {
        num: m.num, title: m.title, desc: m.desc, take: m.take,
        ring: 'stroke-dashoffset: ' + off + '; --off: ' + off + '; animation-range: cover ' + m.r[0] + '% cover ' + m.r[1] + '%'
      };
    });

    // ---- chat ----
    var chatSeen = !!st.seen.chat;
    var msgs = [
      'היי, תודה על השיחה! הנה 3 הנקודות שסיכמנו:',
      '1. לרכז את כל המנויים במקום אחד – ולבחור מה נשאר.',
      '2. לקבוע מראש סכום חודשי למסעדות ובילויים – וליהנות ממנו בלי רגשות אשם.',
      '3. להגדיר העברה אוטומטית קטנה לחיסכון, ביום שהמשכורת נכנסת.'
    ];
    var bubbleBase = 'align-self: flex-start; max-width: 88%; background: #F3E9DD; color: #0B1714; padding: 10px 14px; font-size: 15px; line-height: 1.55; border-radius: 14px 4px 14px 14px; overflow: hidden; ';
    var bubbles = msgs.map(function (m, k) {
      return { text: m, style: bubbleBase + (chatSeen ? 'animation: pop .42s cubic-bezier(.2,.8,.3,1.2) both; animation-delay: ' + (400 + k * 950) + 'ms' : 'opacity: 0') };
    });
    var typingStyle = 'align-self: flex-start; display: flex; gap: 5px; align-items: center; background: #16302A; padding: 12px 14px; border-radius: 14px 4px 14px 14px; overflow: hidden; ' + (chatSeen ? 'animation: hideAt .01s linear both; animation-delay: ' + (400 + msgs.length * 950) + 'ms' : '');

    // ---- same table ----
    if (!this._tbDigits) {
      var dg = [];
      for (var rr = 0; rr < 3; rr++) for (var dd = 0; dd < 10; dd++) dg.push(String(dd));
      this._tbDigits = dg;
    }
    var day = !!st.tbDay;
    var table = {
      tbRef: this.tbRef,
      tbNight: this.tbNight,
      tbMorning: this.tbMorning,
      tbCls: 'tb' + (day ? ' is-day' : '') + (st.tbNotes ? ' notes' : ''),
      tbDigits: this._tbDigits,
      tbHideN: day ? 'true' : 'false',
      tbHideD: day ? 'false' : 'true',
      tbNightP: day ? 'false' : 'true',
      tbDayP: day ? 'true' : 'false',
      tbTimeText: day ? 'השעה 07:30, בוקר' : 'השעה 22:47, לילה',
      tbAria: day
        ? 'המחשה: אותו שולחן בבוקר. הקבלות מסודרות בשלוש ערימות – קבועה, גמישה, לבחינה – לצד דף תוכנית עם שלוש נקודות, הטלפון הפוך, והציור של הילדים גלוי.'
        : 'המחשה: שולחן מטבח בלילה. קבלות פזורות מעל ציור של ילד, טלפון עם התראות חיוב, ותה שהתקרר.'
    };

    return Object.assign(hero, swipe, table, {
      ioStmt: this.ioRef('stmt'),
      ioMe: this.ioRef('me'),
      ioNots: this.ioRef('nots'),
      ioChat: this.ioRef('chat'),
      s0: segs[0], s1: segs[1], s2: segs[2], s3: segs[3],
      principles: principles,
      myths: myths,
      nots: nots,
      faqs: faqs,
      meetings: meetings,
      bubbles: bubbles,
      typingStyle: typingStyle,
      mineList: mine.map(function (m) { return { label: m.label }; }),
      sent: st.sent,
      notSent: !st.sent,
      send: this.send,
      nameRef: this.nameRef,
      phoneRef: this.phoneRef,
      guideRef: this.guideRef,
      sendGuide: this.sendGuide,
      sending: !!st.sending,
      sendLabel: st.sending ? 'שולח…' : 'שריינו לי שיחת היכרות',
      formErr: st.formErr,
      hasFormErr: !!st.formErr,
      nameInvalid: st.errField === 'name' ? 'true' : 'false',
      phoneInvalid: st.errField === 'phone' ? 'true' : 'false',
      guideSent: !!st.guideSent,
      guideOpen: !st.guideSent,
      guideSending: !!st.guideSending,
      guideLabel: st.guideSending ? 'שולח…' : 'שלחו לי את המדריך',
      guideErr: st.guideErr,
      hasGuideErr: !!st.guideErr,
      guideInvalid: st.guideErr ? 'true' : 'false',
      // content that only Tomer can fill in (src/pages/home/content.ts)
      navFaq: SITE.price ? 'כמה זה עולה' : 'שאלות נפוצות',
      trustCert: 'יועץ פיננסי משפחתי מוסמך' + (SITE.certifiedBy ? ' · ' + SITE.certifiedBy : ''),
      trustArea: 'בזום, או פנים אל פנים' + (SITE.area ? ' ב' + SITE.area : ''),
      trustDuration: SITE.duration ? '4 פגישות לאורך ' + SITE.duration : '4 פגישות, צעד אחר צעד',
      personalLine: SITE.personalLine,
      hasPersonal: !!SITE.personalLine,
      hasFounding: !!(SITE.foundingSeats && SITE.foundingPerks),
      foundingSeats: SITE.foundingSeats,
      foundingText: SITE.foundingSeats + ' משפחות ראשונות בלבד, עם זמן ותשומת לב שלא יהיו כאלה בהמשך. המשפחות המייסדות מקבלות: ' + SITE.foundingPerks + '.',
      year: new Date().getFullYear()
    });
  }

  render() {
    const v = this.renderVals();
    return (
      <div className="k7" dir="rtl" style={{ width: "100%", background: "#0B1714", color: "#F3E9DD", fontFamily: "'Heebo', sans-serif", overflowX: "clip" }}>
        <a className="skip" href="#contact">
          דילוג לטופס יצירת קשר
        </a>
        {/* ================= HEADER ================= */}
        <header ref={v.headerRef} style={{ position: "sticky", top: "0", zIndex: "20", background: "rgba(11,23,20,0.96)", borderBottom: "1px solid rgba(201,164,103,0.18)" }}>
          <div className="hdr" style={{ maxWidth: "1280px", margin: "0 auto", padding: "16px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
            <a href="#top" style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none" }}>
              <KrigelLogo className="k7-logo" />
              <span className="serif brand" style={{ fontSize: "22px", fontWeight: "500", color: "#F3E9DD" }}>
                קריגל פיננסיים
              </span>
            </a>
            <nav style={{ display: "flex", alignItems: "center", gap: "30px" }}>
              <a className="nav hide-sm" href="#me">
                נעים להכיר
              </a>
              <a className="nav hide-sm" href="#method">
                נסו בעצמכם
              </a>
              <a className="nav hide-sm" href="#faq">
                {v.navFaq}
              </a>
              <a className="nav hide-sm" href="#meetings">
                4 הפגישות
              </a>
              <a href="https://app.krigelfinance.co.il" style={{ display: "inline-flex", alignItems: "center", gap: "7px", padding: "10px 16px", fontSize: "14px", color: "#F3E9DD", border: "1px solid rgba(201,164,103,0.45)", textDecoration: "none", whiteSpace: "nowrap" }}>
                <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
                כניסת לקוחות
              </a>
              <a className="gold hide-sm" href="#contact" style={{ padding: "12px 22px", fontSize: "15px", fontWeight: "700" }}>
                שיחת היכרות
              </a>
            </nav>
          </div>
        </header>
        {/* ================= HERO: YOUR MESS → ORDER ================= */}
        <section id="top" style={css(v.heroStyle)}>
          <canvas ref={v.heroRef} role="img" aria-label={v.heroAria} onPointerMove={v.heroMove} onPointerDown={v.heroDown} onPointerLeave={v.heroLeave} style={{ position: "absolute", inset: "0", width: "100%", height: "100%", display: "block", touchAction: "pan-y", cursor: "crosshair" }} />
          <svg aria-hidden="true" width="100%" height="100%" style={{ position: "absolute", inset: "0", opacity: "0.06", pointerEvents: "none" }}>
            <filter id="grainA">
              <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#grainA)" />
          </svg>
          <div className="pad pe-none hero-inner" style={{ position: "relative", maxWidth: "1280px", margin: "0 auto", padding: "0 48px" }}>
            <div ref={v.heroTextRef} className="hero-text hero-gap" style={{ display: "flex", flexDirection: "column", gap: "20px", alignItems: "flex-start", minWidth: "0", width: "100%" }}>
              <div className="eyebrow" style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "13px", letterSpacing: "0.16em", color: "#C9A467", fontWeight: "500" }}>
                <span className="pulse" style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#C9A467" }} />
                <span>
                  תכנון פיננסי למשפחות צעירות · ליווי 1:1
                </span>
              </div>
              <h1 className="h1hero serif" aria-live="polite" style={{ margin: "0", fontWeight: "300", fontSize: "82px", lineHeight: "0.98", letterSpacing: "-0.025em", color: "#F3E9DD" }}>
                {v.heroL1}
                <br />
                <span style={{ fontWeight: "700", color: "#C9A467" }}>
                  {v.heroL2}
                </span>
              </h1>
              <p className="hero-sub" style={{ margin: "0", fontSize: "18px", lineHeight: "1.65", color: "#C5D1CC", fontWeight: "300" }}>
                {v.heroSub}
              </p>
              <div className="addrow pe-auto" role="group" aria-label="הוסיפו הוצאות משלכם לערימה" style={{ width: "100%" }}>
                {(v.presets || []).map((pr, $index) => (
                  <React.Fragment key={$index}>
                    <button className="addchip" onClick={pr?.add} aria-pressed={pr?.pressed}>
                      {pr?.sign}{" "}{pr?.label}
                    </button>
                  </React.Fragment>
                ))}
                <label className="sr" htmlFor="mineIn">
                  הוסיפו הוצאה משלכם
                </label>
                <input id="mineIn" className="addin" type="text" ref={v.mineInRef} onKeyDown={v.mineKey} placeholder="משהו אחר…" />
                <button className="addchip" onClick={v.mineSubmit} aria-label="הוסיפו לערימה" style={{ width: "36px", padding: "0", fontSize: "18px" }}>
                  +
                </button>
              </div>
              <div className="pe-auto" style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center" }}>
                {v.isChaos ? (
                  <>
                    <button className="gold hero-btn" onClick={v.doOrder} style={{ padding: "18px 30px", fontSize: "17px", fontWeight: "700" }}>
                      עשו לי סדר ←
                    </button>
                    {" "}
                    <a className="ghost hero-btn" href="#contact" style={{ padding: "17px 24px", fontSize: "16px" }}>
                      שיחת היכרות
                    </a>
                  </>
                ) : null}
                {v.isOrder ? (
                  <>
                    {v.hasMine ? (
                      <>
                        <a className="gold hero-btn" href={v.waHref} target="_blank" rel="noopener" style={{ padding: "18px 28px", fontSize: "17px", fontWeight: "700" }}>
                          <span className="hide-sm">
                            שלחו לי את הבלגן בוואטסאפ
                          </span>
                          <span className="show-sm">
                            שלחו לי בוואטסאפ
                          </span>
                        </a>
                      </>
                    ) : null}
                    {" "}
                    {v.noMine ? (
                      <>
                        <a className="gold hero-btn" href="#contact" style={{ padding: "18px 30px", fontSize: "17px", fontWeight: "700" }}>
                          לשיחת היכרות
                          <span className="hide-sm">
                            – 20 דקות, חינם
                          </span>
                        </a>
                      </>
                    ) : null}
                    {" "}
                    <button className="ghost hero-btn" onClick={v.doMess} aria-label="בלגנו לי שוב" style={{ padding: "17px 22px", fontSize: "16px" }}>
                      <span className="hide-sm">
                        בלגנו לי שוב
                      </span>
                      ↻
                    </button>
                  </>
                ) : null}
              </div>
              <div style={{ minHeight: "44px", display: "flex", alignItems: "center" }}>
                {v.isChaos ? (
                  <>
                    <span style={{ fontSize: "13px", color: "#9DB0A8" }}>
                      {v.heroHint}
                    </span>
                  </>
                ) : null}
                {v.isOrder ? (
                  <>
                    <span style={{ display: "flex", alignItems: "center", gap: "12px", animation: "rise .6s ease both" }}>
                      <span style={{ width: "44px", height: "44px", borderRadius: "50%", overflow: "hidden", border: "1px solid #C9A467", flex: "0 0 auto", display: "block" }}>
                        <img loading="lazy" decoding="async" src="/tomer.jpg" alt="" style={{ display: "block", width: "100%", height: "116%", objectFit: "cover", objectPosition: "50% 0%" }} />
                      </span>
                      <span style={{ fontSize: "14px", lineHeight: "1.5", color: "#C5D1CC" }}>
                        <span className="hide-sm">
                          אני תומר. זה בדיוק מה שאני עושה איתכם – בארבע פגישות.
                        </span>
                        <span className="show-sm">
                          אני תומר. זה מה שאני עושה – ב־4 פגישות.
                        </span>
                      </span>
                    </span>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </section>
        {/* trust strip */}
        <div style={{ background: "#0B1714", borderTop: "1px solid #1E3832", borderBottom: "1px solid #1E3832" }}>
          <div className="pad" style={{ maxWidth: "1280px", margin: "0 auto", padding: "20px 48px", display: "flex", flexWrap: "wrap", gap: "12px 40px", fontSize: "14px", color: "#B9C7C1" }}>
            <span>
              <span style={{ color: "#C9A467" }}>
                ✦
              </span>
              {" "}{v.trustCert}
            </span>
            <span>
              <span style={{ color: "#C9A467" }}>
                ✦
              </span>
              {" "}{v.trustArea}
            </span>
            <span>
              <span style={{ color: "#C9A467" }}>
                ✦
              </span>
              {" "}{v.trustDuration}
            </span>
            <span>
              <span style={{ color: "#C9A467" }}>
                ✦
              </span>
              {" אפס מוצרים למכור, אפס עמלות"}
            </span>
          </div>
        </div>
        {/* ================= SAME TABLE: 22:47 → 07:30 ================= */}
        <section id="table" className={v.tbCls} aria-labelledby="tbH">
          <div className="tb-wrap">
            <div className="tb-text">
              <span className="tb-eye">
                המחשה · אותו שולחן, שני רגעים
              </span>
              {" "}
              <span className="sr">
                {v.tbTimeText}
              </span>
              <span className="tb-time serif" aria-hidden="true">
                <span className="tb-dg tb-d0">
                  <span className="tb-strip">
                    {(v.tbDigits || []).map((d, $index) => (
                      <React.Fragment key={$index}>
                        <span>
                          {d}
                        </span>
                      </React.Fragment>
                    ))}
                  </span>
                </span>
                <span className="tb-dg tb-d1">
                  <span className="tb-strip">
                    {(v.tbDigits || []).map((d, $index) => (
                      <React.Fragment key={$index}>
                        <span>
                          {d}
                        </span>
                      </React.Fragment>
                    ))}
                  </span>
                </span>
                <span className="tb-colon">
                  :
                </span>
                <span className="tb-dg tb-d2">
                  <span className="tb-strip">
                    {(v.tbDigits || []).map((d, $index) => (
                      <React.Fragment key={$index}>
                        <span>
                          {d}
                        </span>
                      </React.Fragment>
                    ))}
                  </span>
                </span>
                <span className="tb-dg tb-d3">
                  <span className="tb-strip">
                    {(v.tbDigits || []).map((d, $index) => (
                      <React.Fragment key={$index}>
                        <span>
                          {d}
                        </span>
                      </React.Fragment>
                    ))}
                  </span>
                </span>
              </span>
              <h2 id="tbH" className="tb-h2 serif">
                <span className="tb-x tb-xn" aria-hidden={v.tbHideN}>
                  הילדים ישנים.
                  <br />
                  <b>
                    האפליקציה פתוחה.
                  </b>
                </span>
                <span className="tb-x tb-xd" aria-hidden={v.tbHideD}>
                  אותו שולחן.
                  <br />
                  <b>
                    בוקר אחר.
                  </b>
                </span>
              </h2>
              <p className="tb-cap">
                <span className="tb-x tb-xn" aria-hidden={v.tbHideN}>
                  הקבלות על השולחן, התראה ועוד התראה, והתה כבר התקרר. משהו לא מסתדר – ולא ברור מה.
                </span>
                <span className="tb-x tb-xd" aria-hidden={v.tbHideD}>
                  שלוש ערימות, תוכנית אחת בכתב, והטלפון הפוך על השולחן. ומתחת לכל הקבלות – הציור שבגללו עושים את כל זה.
                </span>
              </p>
              <div className="tb-tog" role="group" aria-label="לילה או בוקר">
                <button className="tb-tb" onClick={v.tbNight} aria-pressed={v.tbNightP} aria-label="לילה, 22:47">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z" fill="currentColor" />
                  </svg>
                  <span>
                    22:47
                  </span>
                </button>
                <button className="tb-tb" onClick={v.tbMorning} aria-pressed={v.tbDayP} aria-label="בוקר, 07:30">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="12" cy="12" r="4.5" fill="currentColor" />
                    <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                  </svg>
                  <span>
                    07:30
                  </span>
                </button>
              </div>
            </div>
            <div className="tb-stage" ref={v.tbRef} role="img" aria-label={v.tbAria}>
              {/* the table */}
              <div className="tb-planks" />
              <svg className="tb-grain" viewBox="0 0 1600 900" preserveAspectRatio="none" aria-hidden="true">
                <filter id="tbWood" x="0" y="0" width="100%" height="100%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.0032 0.12" numOctaves="4" seed="7" />
                  <feColorMatrix type="matrix" values="0 0 0 0 0.40  0 0 0 0 0.27  0 0 0 0 0.14  1.5 0 0 0 -0.62" />
                </filter>
                <rect width="1600" height="900" filter="url(#tbWood)" />
              </svg>
              <div className="tb-scene">
                {/* the kid's drawing (under everything) */}
                <div className="tb-o tb-draw">
                  <svg viewBox="0 0 230 165" aria-hidden="true">
                    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <g transform="translate(1.2 0.9)" opacity=".38">
                        <circle cx="196" cy="30" r="12" fill="#F2C14E" stroke="#E0A92E" strokeWidth="2.6" />
                        <path d="M196 10 L196 4 M196 50 L197 56 M176 30 L170 31 M216 29 L222 30 M182 16 L177 11 M210 44 L215 49 M210 16 L215 11 M182 44 L178 49" stroke="#E0A92E" strokeWidth="2.6" />
                        <path d="M114 31 q5 -6 10 0 q5 -6 10 0 M144 18 q4 -5 8 0 q4 -5 8 0" stroke="#5B6B66" strokeWidth="2" />
                        <path d="M6 141 Q 36 133 66 141 T 126 140 T 186 143 T 226 138" stroke="#6FA37F" strokeWidth="3.4" />
                        <path d="M18 141 l3 -8 l3 8 M112 141 l3 -7 l3 7 M150 143 l3 -8 l3 8 M214 140 l3 -7 l3 7" stroke="#6FA37F" strokeWidth="2.2" />
                        <path d="M37 89 L36 139 L104 140 L103 88" stroke="#C9704F" strokeWidth="3" />
                        <path d="M28 92 L70 55 L112 91 Z" stroke="#B5553C" strokeWidth="3" />
                        <path d="M44 86 L58 71 M52 88 L70 65 M62 88 L82 65 M74 88 L92 71 M86 88 L100 79" stroke="#D08A68" strokeWidth="2.4" opacity=".8" />
                        <path d="M88 67 L88 50 L97 50 L97 74" stroke="#B5553C" strokeWidth="2.6" />
                        <path d="M62 139 L62 113 L79 112 L79 139" stroke="#7A5C24" strokeWidth="2.6" />
                        <path d="M44 97 h13 v12 h-13 z M50.5 97 v12 M44 103 h13 M84 97 h13 v12 h-13 z M90.5 97 v12 M84 103 h13" stroke="#4A6E9C" strokeWidth="2.2" />
                        <circle cx="133" cy="84" r="7" stroke="#4A6E9C" strokeWidth="2.6" />
                        <path d="M133 91 L133 117 M133 117 L126 138 M133 117 L140 138 M133 99 L121 109 M133 99 L146 105" stroke="#4A6E9C" strokeWidth="2.6" />
                        <circle cx="158" cy="82" r="7" stroke="#B25C80" strokeWidth="2.6" />
                        <path d="M151 79 q-4 9 -1 16 M165 79 q4 9 1 16" stroke="#7A5C24" strokeWidth="2.2" />
                        <path d="M158 89 L158 101 M150 118 L166 118 L158 100 Z M154 118 L151 138 M162 118 L165 138 M158 99 L146 105 M158 99 L171 107" stroke="#B25C80" strokeWidth="2.6" />
                        <circle cx="182" cy="100" r="5.5" stroke="#D9823F" strokeWidth="2.6" />
                        <path d="M182 105.5 L182 122 M182 122 L177 138 M182 122 L187 138 M182 111 L171 107 M182 111 L193 115" stroke="#D9823F" strokeWidth="2.6" />
                        <circle cx="203" cy="107" r="5" stroke="#4E9A72" strokeWidth="2.6" />
                        <path d="M203 112 L203 126 M203 126 L199 138 M203 126 L207 138 M203 117 L193 115 M203 117 L213 112" stroke="#4E9A72" strokeWidth="2.6" />
                        <path d="M130 86 q3 3 6 0 M155 84 q3 3 6 0 M180 101.5 q2 2 4 0 M201 108.5 q2 2 4 0" stroke="#1B322C" strokeWidth="1.6" />
                        <path d="M169 64 c-4 -6 -12 -1 -6 6 l6 6 l6 -6 c6 -7 -2 -12 -6 -6 z" fill="#E58C8C" stroke="#C95B5B" strokeWidth="1.8" />
                      </g>
                      <g className="tb-kid">
                        <circle cx="196" cy="30" r="12" fill="#F2C14E" stroke="#E0A92E" strokeWidth="2.6" />
                        <path d="M196 10 L196 4 M196 50 L197 56 M176 30 L170 31 M216 29 L222 30 M182 16 L177 11 M210 44 L215 49 M210 16 L215 11 M182 44 L178 49" stroke="#E0A92E" strokeWidth="2.6" />
                        <path d="M114 31 q5 -6 10 0 q5 -6 10 0 M144 18 q4 -5 8 0 q4 -5 8 0" stroke="#5B6B66" strokeWidth="2" />
                        <path d="M6 141 Q 36 133 66 141 T 126 140 T 186 143 T 226 138" stroke="#6FA37F" strokeWidth="3.4" />
                        <path d="M18 141 l3 -8 l3 8 M112 141 l3 -7 l3 7 M150 143 l3 -8 l3 8 M214 140 l3 -7 l3 7" stroke="#6FA37F" strokeWidth="2.2" />
                        <path d="M37 89 L36 139 L104 140 L103 88" stroke="#C9704F" strokeWidth="3" />
                        <path d="M28 92 L70 55 L112 91 Z" stroke="#B5553C" strokeWidth="3" />
                        <path d="M44 86 L58 71 M52 88 L70 65 M62 88 L82 65 M74 88 L92 71 M86 88 L100 79" stroke="#D08A68" strokeWidth="2.4" opacity=".8" />
                        <path d="M88 67 L88 50 L97 50 L97 74" stroke="#B5553C" strokeWidth="2.6" />
                        <path d="M62 139 L62 113 L79 112 L79 139" stroke="#7A5C24" strokeWidth="2.6" />
                        <path d="M44 97 h13 v12 h-13 z M50.5 97 v12 M44 103 h13 M84 97 h13 v12 h-13 z M90.5 97 v12 M84 103 h13" stroke="#4A6E9C" strokeWidth="2.2" />
                        <circle cx="133" cy="84" r="7" stroke="#4A6E9C" strokeWidth="2.6" />
                        <path d="M133 91 L133 117 M133 117 L126 138 M133 117 L140 138 M133 99 L121 109 M133 99 L146 105" stroke="#4A6E9C" strokeWidth="2.6" />
                        <circle cx="158" cy="82" r="7" stroke="#B25C80" strokeWidth="2.6" />
                        <path d="M151 79 q-4 9 -1 16 M165 79 q4 9 1 16" stroke="#7A5C24" strokeWidth="2.2" />
                        <path d="M158 89 L158 101 M150 118 L166 118 L158 100 Z M154 118 L151 138 M162 118 L165 138 M158 99 L146 105 M158 99 L171 107" stroke="#B25C80" strokeWidth="2.6" />
                        <circle cx="182" cy="100" r="5.5" stroke="#D9823F" strokeWidth="2.6" />
                        <path d="M182 105.5 L182 122 M182 122 L177 138 M182 122 L187 138 M182 111 L171 107 M182 111 L193 115" stroke="#D9823F" strokeWidth="2.6" />
                        <circle cx="203" cy="107" r="5" stroke="#4E9A72" strokeWidth="2.6" />
                        <path d="M203 112 L203 126 M203 126 L199 138 M203 126 L207 138 M203 117 L193 115 M203 117 L213 112" stroke="#4E9A72" strokeWidth="2.6" />
                        <path d="M130 86 q3 3 6 0 M155 84 q3 3 6 0 M180 101.5 q2 2 4 0 M201 108.5 q2 2 4 0" stroke="#1B322C" strokeWidth="1.6" />
                        <path d="M169 64 c-4 -6 -12 -1 -6 6 l6 6 l6 -6 c6 -7 -2 -12 -6 -6 z" fill="#E58C8C" stroke="#C95B5B" strokeWidth="1.8" />
                      </g>
                    </g>
                  </svg>
                </div>
                {/* the plan (arrives in the morning) */}
                <div className="tb-o tb-plan">
                  <div className="tb-plan-in">
                    <span className="tb-plan-h">
                      <svg viewBox="0 0 42 42" aria-hidden="true">
                        <circle cx="21" cy="21" r="19.5" fill="none" stroke="#C9A467" strokeWidth="2" />
                        <text x="21" y="28.5" textAnchor="middle" fontFamily="Frank Ruhl Libre, serif" fontSize="22" fill="#0B1714">
                          K
                        </text>
                      </svg>
                      <span>
                        התוכנית שלנו
                      </span>
                    </span>
                    <span className="tb-plan-sub">
                      3 נקודות לחודש הבא
                    </span>
                    <span className="tb-pi">
                      <span className="tb-cb">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path className="tb-ck" pathLength="1" d="M3 12.5 L9.5 19 L22 3" />
                        </svg>
                      </span>
                      <span>
                        לרכז את כל המנויים במקום אחד
                      </span>
                    </span>
                    <span className="tb-pi">
                      <span className="tb-cb">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path className="tb-ck tb-ck2" pathLength="1" d="M3 12.5 L9.5 19 L22 3" />
                        </svg>
                      </span>
                      <span>
                        סכום חודשי קבוע לבילויים
                      </span>
                    </span>
                    <span className="tb-pi">
                      <span className="tb-cb" />
                      <span>
                        העברה אוטומטית לחיסכון ביום המשכורת
                      </span>
                    </span>
                  </div>
                </div>
                {/* receipts */}
                <div className="tb-o tb-rc tb-r0">
                  <div className="tb-rcp">
                    <span className="tb-rk">
                      הוראת קבע
                    </span>
                    <span className="tb-rl">
                      משכנתא
                    </span>
                    <span className="tb-bar" style={{ width: "86%" }} />
                    <span className="tb-bar" style={{ width: "60%" }} />
                    <span className="tb-rt">
                      <span>
                        סה״כ
                      </span>
                      <i />
                    </span>
                  </div>
                </div>
                <div className="tb-o tb-rc tb-r1">
                  <div className="tb-rcp">
                    <span className="tb-rk">
                      חיוב בכרטיס
                    </span>
                    <span className="tb-rl">
                      גן ילדים
                    </span>
                    <span className="tb-bar" style={{ width: "74%" }} />
                    <span className="tb-bar" style={{ width: "88%" }} />
                    <span className="tb-bar" style={{ width: "52%" }} />
                    <span className="tb-rt">
                      <span>
                        סה״כ
                      </span>
                      <i />
                    </span>
                  </div>
                </div>
                <div className="tb-o tb-rc tb-r2">
                  <div className="tb-rcp">
                    <span className="tb-rk">
                      קבלה
                    </span>
                    <span className="tb-rl">
                      סופרמרקט
                    </span>
                    <span className="tb-bar" style={{ width: "90%" }} />
                    <span className="tb-bar" style={{ width: "66%" }} />
                    <span className="tb-bar" style={{ width: "80%" }} />
                    <span className="tb-bar" style={{ width: "44%" }} />
                    <span className="tb-rt">
                      <span>
                        סה״כ
                      </span>
                      <i />
                    </span>
                  </div>
                </div>
                <div className="tb-o tb-rc tb-r3">
                  <div className="tb-rcp">
                    <span className="tb-rk">
                      חיוב בכרטיס
                    </span>
                    <span className="tb-rl">
                      חוגים
                    </span>
                    <span className="tb-bar" style={{ width: "70%" }} />
                    <span className="tb-bar" style={{ width: "84%" }} />
                    <span className="tb-rt">
                      <span>
                        סה״כ
                      </span>
                      <i />
                    </span>
                  </div>
                </div>
                <div className="tb-o tb-rc tb-r4">
                  <div className="tb-rcp">
                    <span className="tb-rk">
                      הוראת קבע
                    </span>
                    <span className="tb-rl">
                      ביטוח רכב
                    </span>
                    <span className="tb-bar" style={{ width: "82%" }} />
                    <span className="tb-bar" style={{ width: "58%" }} />
                    <span className="tb-bar" style={{ width: "72%" }} />
                    <span className="tb-rt">
                      <span>
                        סה״כ
                      </span>
                      <i />
                    </span>
                  </div>
                </div>
                <div className="tb-o tb-rc tb-r5">
                  <div className="tb-rcp">
                    <span className="tb-rk">
                      חיוב בכרטיס
                    </span>
                    <span className="tb-rl">
                      סטרימינג
                    </span>
                    <span className="tb-bar" style={{ width: "64%" }} />
                    <span className="tb-bar" style={{ width: "86%" }} />
                    <span className="tb-rt">
                      <span>
                        סה״כ
                      </span>
                      <i />
                    </span>
                  </div>
                </div>
                <div className="tb-o tb-rc tb-r6">
                  <div className="tb-rcp">
                    <span className="tb-rk">
                      הוראת קבע
                    </span>
                    <span className="tb-rl">
                      חדר כושר
                    </span>
                    <span className="tb-bar" style={{ width: "78%" }} />
                    <span className="tb-bar" style={{ width: "56%" }} />
                    <span className="tb-bar" style={{ width: "90%" }} />
                    <span className="tb-rt">
                      <span>
                        סה״כ
                      </span>
                      <i />
                    </span>
                  </div>
                </div>
                {/* stack labels (morning) */}
                <span className="tb-tab tb-t0">
                  <i style={{ background: "#6E9A82" }} />
                  קבועה
                </span>
                {" "}
                <span className="tb-tab tb-t1">
                  <i style={{ background: "#C9A467" }} />
                  גמישה
                </span>
                {" "}
                <span className="tb-tab tb-t2">
                  <i style={{ background: "#D08A68" }} />
                  לבחינה
                </span>
                {/* pen, sticky note, mug */}
                <div className="tb-o tb-pen">
                  <svg viewBox="0 0 160 12" preserveAspectRatio="none" aria-hidden="true">
                    <path d="M0 6 L15 2.2 L15 9.8 Z" fill="#C9A467" />
                    <rect x="14" y="1" width="146" height="10" rx="5" fill="#1B322C" />
                    <rect x="14" y="1" width="146" height="3.4" rx="1.7" fill="#2F5248" />
                    <rect x="40" y="1" width="3" height="10" fill="#C9A467" />
                    <rect x="118" y="-1.5" width="34" height="3" rx="1.5" fill="#C9A467" />
                  </svg>
                </div>
                <div className="tb-o tb-note">
                  <span className="tb-note-t">
                    לבדוק:
                    <br />
                    מה זה החיוב הזה?
                  </span>
                  <svg className="tb-note-ck" viewBox="0 0 100 100" aria-hidden="true">
                    <path pathLength="1" d="M16 54 L40 78 L88 20" />
                  </svg>
                </div>
                <div className="tb-o tb-mug">
                  <span className="tb-handle" />
                  {" "}
                  <span className="tb-cup">
                    <span className="tb-liq tb-liq-n" />
                    <span className="tb-liq tb-liq-d" />
                  </span>
                  {" "}
                  <svg className="tb-steam" viewBox="0 0 60 80" aria-hidden="true">
                    <path d="M14 74 C 4 60 24 52 14 38 C 6 26 20 18 14 6" />
                    <path d="M30 74 C 20 60 40 52 30 38 C 22 26 36 18 30 6" />
                    <path d="M46 74 C 36 60 56 52 46 38 C 38 26 52 18 46 6" />
                  </svg>
                </div>
              </div>
              {/* light */}
              <div className="tb-glow" />
              <div className="tb-sun" />
              <svg className="tb-leaf" viewBox="0 0 260 220" aria-hidden="true">
                <g fill="#1E2A1C">
                  <path d="M0 16 C 60 30 120 70 176 142" stroke="#1E2A1C" strokeWidth="5" fill="none" />
                  <path d="M40 30 C 52 6 86 0 104 8 C 88 26 62 36 40 30 Z" />
                  <path d="M70 52 C 70 26 96 12 118 14 C 110 38 92 52 70 52 Z" />
                  <path d="M58 40 C 40 58 30 84 36 104 C 58 90 66 66 58 40 Z" />
                  <path d="M104 86 C 110 58 138 44 160 48 C 150 72 128 86 104 86 Z" />
                  <path d="M96 78 C 76 92 66 118 72 140 C 96 126 104 102 96 78 Z" />
                  <path d="M140 118 C 150 96 176 86 196 92 C 184 114 162 124 140 118 Z" />
                  <path d="M134 112 C 118 128 114 152 122 172 C 142 156 146 134 134 112 Z" />
                </g>
              </svg>
              <div className="tb-sweep" />
              <div className="tb-warm" />
              <div className="tb-dark" />
              {/* things that glow in the dark sit above it */}
              <div className="tb-scene">
                <div className="tb-o tb-watch">
                  <span className="tb-strap tb-strap-a" />
                  {" "}
                  <span className="tb-strap tb-strap-b" />
                  {" "}
                  <span className="tb-dial">
                    <svg viewBox="0 0 100 100" aria-hidden="true">
                      <g stroke="#1B322C" strokeWidth="3" strokeLinecap="round">
                        <path d="M50 9 V17 M50 83 V91 M9 50 H17 M83 50 H91" />
                        <path d="M70.5 14.5 L68.5 18 M85.5 29.5 L82 31.5 M85.5 70.5 L82 68.5 M70.5 85.5 L68.5 82 M29.5 85.5 L31.5 82 M14.5 70.5 L18 68.5 M14.5 29.5 L18 31.5 M29.5 14.5 L31.5 18" strokeWidth="2" />
                      </g>
                    </svg>
                  </span>
                  {" "}
                  <span className="tb-hand tb-hh" />
                  {" "}
                  <span className="tb-hand tb-mh" />
                  {" "}
                  <span className="tb-wcap" />
                </div>
                <div className="tb-o tb-phone">
                  <div className="tb-flip">
                    <div className="tb-ph-front">
                      <div className="tb-screen">
                        <span className="tb-ph-time">
                          22:47
                        </span>
                        <span className="tb-nts">
                          <span className="tb-nt tb-n0">
                            <i className="tb-ic">
                              ₪
                            </i>
                            <span>
                              <b>
                                חיוב בכרטיס
                              </b>
                              גן ילדים
                            </span>
                          </span>
                          <span className="tb-nt tb-n1">
                            <i className="tb-ic">
                              ₪
                            </i>
                            <span>
                              <b>
                                הוראת קבע
                              </b>
                              ביטוח רכב
                            </span>
                          </span>
                          <span className="tb-nt tb-n2">
                            <i className="tb-ic">
                              ₪
                            </i>
                            <span>
                              <b>
                                חיוב בכרטיס
                              </b>
                              סטרימינג
                            </span>
                          </span>
                          <span className="tb-nt tb-n3">
                            <i className="tb-ic tb-ic-chat">
                              <svg viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M4 5h16v11H9l-5 4z" fill="#0B1714" />
                              </svg>
                            </i>
                            <span>
                              <b>
                                הורי הגן
                              </b>
                              מחר יום פיג׳מות!
                            </span>
                          </span>
                        </span>
                      </div>
                    </div>
                    <div className="tb-ph-back">
                      <span className="tb-cam">
                        <i />
                        <i />
                        <i />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="tb-fade" />
            </div>
          </div>
        </section>
        {/* ================= STATEMENT: SCRAMBLE + 3D COIN ================= */}
        <section style={{ background: "#F6EFE6", color: "#0B1714", position: "relative", overflow: "hidden" }}>
          <div className="pad sec" style={{ maxWidth: "1280px", margin: "0 auto", padding: "160px 48px", display: "flex", flexWrap: "wrap", gap: "64px 80px", alignItems: "center" }}>
            <div ref={v.ioStmt} data-io="stmt" style={{ flex: "999 1 620px", minWidth: "0", display: "flex", flexDirection: "column", gap: "32px" }}>
              <p className="giant serif" style={{ margin: "0", fontWeight: "300", fontSize: "92px", lineHeight: "1.04", letterSpacing: "-0.02em" }}>
                <span className="sr">
                  לא חסר לכם כסף. חסרה לכם שיטה.
                </span>
                {" "}
                <span aria-hidden="true">
                  {v.s0}
                </span>
                <br />
                {" "}
                <span aria-hidden="true">
                  {v.s1}
                </span>
                <span aria-hidden="true" style={{ fontWeight: "700", color: "#7A5C24" }}>
                  {v.s2}
                </span>
                <span aria-hidden="true">
                  {v.s3}
                </span>
              </p>
              <p className="mid serif" style={{ margin: "0", fontWeight: "300", fontSize: "34px", lineHeight: "1.35", color: "#66736E", maxWidth: "760px" }}>
                ומישהו שיחזיק אותה איתכם – עד שתחזיקו אותה לבד.
              </p>
            </div>
            <div className="coin-stage" aria-hidden="true" style={{ flex: "1 1 240px", display: "flex", justifyContent: "center" }}>
              <div className="coin3d">
                <div className="ce" style={{ transform: "translateZ(-6px)" }} />
                <div className="ce" style={{ transform: "translateZ(-4px)" }} />
                <div className="ce" style={{ transform: "translateZ(-2px)" }} />
                <div className="ce" style={{ transform: "translateZ(0px)" }} />
                <div className="ce" style={{ transform: "translateZ(2px)" }} />
                <div className="ce" style={{ transform: "translateZ(4px)" }} />
                <div className="ce" style={{ transform: "translateZ(6px)" }} />
                <div className="cf serif" style={{ transform: "translateZ(7px)", fontSize: "104px", color: "#6E5220" }}>
                  ₪
                </div>
                <div className="cf serif" style={{ transform: "rotateY(180deg) translateZ(7px)", fontSize: "100px", color: "#6E5220" }}>
                  K
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* ================= MEET TOMER ================= */}
        <section id="me" style={{ background: "#EFE5D7", color: "#0B1714", overflow: "hidden" }}>
          <div className="pad sec" style={{ maxWidth: "1280px", margin: "0 auto", padding: "160px 48px", display: "flex", flexWrap: "wrap", gap: "64px 88px", alignItems: "center" }}>
            <figure style={{ flex: "1 1 340px", maxWidth: "440px", margin: "0 auto", position: "relative" }}>
              <div aria-hidden="true" style={{ position: "absolute", top: "24px", right: "-18px", bottom: "-18px", left: "24px", border: "1px solid #C9A467" }} />
              <div className="me-photo" style={{ position: "relative", height: "540px", overflow: "hidden" }}>
                <img loading="lazy" decoding="async" src="/tomer.jpg" alt="תומר קריגל" style={{ display: "block", width: "100%", height: "108%", objectFit: "cover", objectPosition: "50% 0%" }} />
              </div>
              <figcaption style={{ position: "absolute", bottom: "24px", left: "-24px", background: "#0B1714", color: "#F3E9DD", padding: "14px 20px", display: "flex", flexDirection: "column", gap: "2px" }}>
                <span className="serif" style={{ fontSize: "20px" }}>
                  תומר קריגל
                </span>
                <span style={{ fontSize: "12px", color: "#B9C7C1", letterSpacing: "0.06em" }}>
                  יועץ פיננסי משפחתי מוסמך
                </span>
              </figcaption>
            </figure>
            <div ref={v.ioMe} data-io="me" style={{ flex: "999 1 480px", minWidth: "0", display: "flex", flexDirection: "column", gap: "22px" }}>
              <span style={{ fontSize: "13px", letterSpacing: "0.16em", color: "#7A5C24", fontWeight: "500" }}>
                נעים להכיר
              </span>
              <h2 className="h2 serif" style={{ margin: "0", fontWeight: "300", fontSize: "72px", lineHeight: "1", letterSpacing: "-0.02em" }}>
                אני תומר.
                <br />
                <span style={{ fontWeight: "700", color: "#7A5C24" }}>
                  ואני כאן בשביל הסדר.
                </span>
              </h2>
              <p style={{ margin: "0", fontSize: "18px", lineHeight: "1.75", color: "#3F4F4A", fontWeight: "300", maxWidth: "560px" }}>
                אני מלווה משפחות צעירות 1:1, בארבע פגישות – בלי מוצרים למכור ובלי עמלות. המטרה שלי היא שתצאו עם שיטה שעובדת גם בלעדיי.
              </p>
              {v.hasPersonal ? (
                <>
                  <p className="serif" style={{ margin: "0", fontSize: "22px", lineHeight: "1.5", color: "#66736E" }}>
                    {v.personalLine}
                  </p>
                </>
              ) : null}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "10px", maxWidth: "520px" }}>
                {(v.principles || []).map((p, $index) => (
                  <React.Fragment key={$index}>
                    <div style={css(p?.wrap)}>
                      <div className="rcpt">
                        <span style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "12px" }}>
                          <span className="serif" style={{ fontSize: "22px", fontWeight: "500" }}>
                            {p?.t}
                          </span>
                          <span style={{ fontSize: "12px", letterSpacing: "0.12em", color: "#7A5C24" }}>
                            {p?.n}
                          </span>
                        </span>
                        <span style={{ fontSize: "15px", lineHeight: "1.6", color: "#3F4F4A" }}>
                          {p?.d}
                        </span>
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </section>
        {/* ================= YOUR TURN: SWIPE TO SORT ================= */}
        <section id="method" style={{ background: "#0B1714", position: "relative", overflow: "hidden" }}>
          <svg aria-hidden="true" width="100%" height="100%" style={{ position: "absolute", inset: "0", opacity: "0.05", pointerEvents: "none" }}>
            <filter id="grainB">
              <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#grainB)" />
          </svg>
          <div className="pad sec" style={{ position: "relative", maxWidth: "1280px", margin: "0 auto", padding: "160px 48px" }}>
            <div className="rv" style={{ display: "flex", flexWrap: "wrap", gap: "24px 72px", alignItems: "end", marginBottom: "64px" }}>
              <div style={{ flex: "1 1 460px", display: "flex", flexDirection: "column", gap: "14px" }}>
                <span style={{ fontSize: "13px", letterSpacing: "0.16em", color: "#C9A467", fontWeight: "500" }}>
                  עכשיו תורכם
                </span>
                <h2 className="h2 serif" style={{ margin: "0", fontWeight: "300", fontSize: "80px", lineHeight: "0.98", letterSpacing: "-0.02em" }}>
                  {"מיינו את "}
                  <span style={{ fontWeight: "700", color: "#C9A467" }}>
                    החודש.
                  </span>
                </h2>
              </div>
              <p style={{ flex: "1 1 380px", margin: "0", fontSize: "18px", lineHeight: "1.75", color: "#B9C7C1", fontWeight: "300" }}>
                שלוש קטגוריות – קבועה, גמישה, לבחינה. החליקו כל כרטיס לכיוון שנראה לכם נכון, או לחצו על הכפתורים. על כל הוצאה תקבלו ממני חומר למחשבה.
              </p>
            </div>
            <div className="sw-stage" ref={v.stageRef} data-zone="">
              {(v.zones || []).map((z, $index) => (
                <React.Fragment key={$index}>
                  <div className={z?.cls}>
                    <span style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "8px" }}>
                      <span className="serif" style={css(z?.nameStyle)}>
                        {z?.name}
                      </span>
                      <span style={{ fontSize: "15px", color: "#9DB0A8" }}>
                        {z?.count}
                      </span>
                    </span>
                    <span className="zhint" style={{ fontSize: "12px", color: "#8DA29A", letterSpacing: "0.04em" }}>
                      {z?.hint}
                    </span>
                    <div style={{ display: "flex", flexDirection: "column", marginTop: "6px" }}>
                      {(z?.chips || []).map((zc, $index) => (
                        <React.Fragment key={$index}>
                          <span style={css(zc?.style)}>
                            {zc?.label}
                          </span>
                        </React.Fragment>
                      ))}
                    </div>
                    <span className="zdrop" style={css(z?.dropStyle)}>
                      גררו לכאן
                    </span>
                    {" "}
                  </div>
                </React.Fragment>
              ))}
              <div className="deck">
                {v.deckActive ? (
                  <>
                    {(v.peeks || []).map((pk, $index) => (
                      <React.Fragment key={$index}>
                        <div className="peek" style={css(pk?.style)}>
                          {" "}
                          <div className="rcpt-lg" style={css(pk?.face)}>
                            <span />
                            <span className="serif deck-label" style={{ fontSize: "44px", lineHeight: "1.05", color: "#3F4F4A" }}>
                              {pk?.label}
                            </span>
                            <span />
                          </div>
                          {" "}
                        </div>
                      </React.Fragment>
                    ))}
                    <div className="swcard" ref={v.cardRef} onPointerDown={v.cardDown} onPointerMove={v.cardMove} onPointerUp={v.cardUp} onPointerCancel={v.cardUp} role="group" aria-label={v.cardAria}>
                      <div className="rcpt-lg" style={css(v.cardFace)}>
                        <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", letterSpacing: "0.12em", color: "#7A5C24" }}>
                          <span>
                            {v.cardCount}
                          </span>
                          <span style={css(v.cardTagStyle)}>
                            שלכם
                          </span>
                        </span>
                        <span className="serif deck-label" style={{ fontSize: "46px", lineHeight: "1.05", color: "#0B1714" }}>
                          {v.cardLabel}
                        </span>
                        {" "}
                        <span style={{ fontSize: "13px", color: "#5B6B66" }}>
                          → קבועה · ↑ לבחינה · גמישה ←
                        </span>
                        {" "}
                      </div>
                    </div>
                  </>
                ) : null}
                {" "}
                {v.deckDone ? (
                  <>
                    <div style={{ position: "absolute", inset: "0", background: "#12261F", border: "1px solid rgba(201,164,103,0.35)", padding: "26px", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "12px" }}>
                      <span style={{ fontSize: "12px", letterSpacing: "0.14em", color: "#C9A467" }}>
                        סיימתם לסווג
                      </span>
                      <span className="serif" style={{ fontSize: "28px", lineHeight: "1.2", color: "#F3E9DD" }}>
                        זו התמונה הראשונה של החודש שלכם.
                      </span>
                      <span style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <span style={{ display: "flex", height: "10px", gap: "2px", background: "#16302A" }}>
                          {(v.endSegs || []).map((es, $index) => (
                            <React.Fragment key={$index}>
                              <span style={css(es?.style)} />
                            </React.Fragment>
                          ))}
                        </span>
                        <span style={{ fontSize: "13px", color: "#9DB0A8" }}>
                          {v.endText}
                        </span>
                      </span>
                      <span style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                        <button className="ghost" onClick={v.deckRestart} style={{ padding: "11px 16px", fontSize: "14px" }}>
                          סיבוב נוסף ↻
                        </button>
                        <a className="gold" href="#contact" style={{ padding: "11px 16px", fontSize: "14px", fontWeight: "700" }}>
                          לעשות את זה עם המספרים שלכם
                        </a>
                      </span>
                    </div>
                  </>
                ) : null}
              </div>
              <div className="sw-btns" style={css(v.btnStyle)}>
                {" "}
                <button className="swbtn" onClick={v.pick0} style={{ borderColor: "#6E9A82" }}>
                  → קבועה
                </button>
                {" "}
                <button className="swbtn" onClick={v.pick2} style={{ borderColor: "#D08A68" }}>
                  ↑ לבחינה
                </button>
                {" "}
                <button className="swbtn" onClick={v.pick1} style={{ borderColor: "#C9A467" }}>
                  גמישה ←
                </button>
                {" "}
              </div>
              <div aria-live="polite" style={css(v.fftStyle)}>
                <span style={{ width: "42px", height: "42px", borderRadius: "50%", overflow: "hidden", border: "1px solid #C9A467", flex: "0 0 auto", display: "block" }}>
                  <img loading="lazy" decoding="async" src="/tomer.jpg" alt="" style={{ display: "block", width: "100%", height: "116%", objectFit: "cover", objectPosition: "50% 0%" }} />
                </span>
                <span style={{ display: "flex", flexDirection: "column", gap: "4px", minWidth: "0" }}>
                  <span style={{ fontSize: "12px", letterSpacing: "0.12em", color: "#C9A467" }}>
                    {"חומר למחשבה · "}{v.fftLabel}
                  </span>
                  <span style={{ fontSize: "15px", color: "#F3E9DD", fontWeight: "600" }}>
                    {v.fftHead}
                  </span>
                  <span style={{ fontSize: "15px", lineHeight: "1.6", color: "#B9C7C1" }}>
                    {v.fftText}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </section>
        {/* ================= MYTHS: SHATTER ================= */}
        <section style={{ background: "#F6EFE6", color: "#0B1714" }}>
          <div className="pad sec" style={{ maxWidth: "1280px", margin: "0 auto", padding: "160px 48px" }}>
            <div className="rv" style={{ display: "flex", flexWrap: "wrap", gap: "24px 72px", alignItems: "end", marginBottom: "56px" }}>
              <h2 className="h2 serif" style={{ flex: "1 1 460px", margin: "0", fontWeight: "300", fontSize: "80px", lineHeight: "0.98", letterSpacing: "-0.02em" }}>
                {"מיתוס "}
                <span style={{ fontWeight: "700", color: "#7A5C24" }}>
                  או עובדה?
                </span>
              </h2>
              <p style={{ flex: "1 1 380px", margin: "0", fontSize: "18px", lineHeight: "1.75", color: "#3F4F4A", fontWeight: "300" }}>
                ארבע אמונות על כסף שכדאי לבדוק מחדש. לחצו על קלף – ונפצו את המיתוס.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "18px" }}>
              {(v.myths || []).map((c, $index) => (
                <React.Fragment key={$index}>
                  <button className="mcard" onClick={c?.toggle} aria-pressed={c?.pressed} aria-label={c?.aria} style={css(c?.cardStyle)}>
                    <div className="mback">
                      <span style={{ fontSize: "13px", letterSpacing: "0.14em", color: "#C9A467" }}>
                        העובדה
                      </span>
                      <span className="serif" style={{ fontSize: "25px", lineHeight: "1.4", color: "#F3E9DD" }}>
                        {c?.fact}
                      </span>
                      <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px", color: "#9DB0A8" }}>
                        <span>
                          לחצו להרכבה מחדש
                        </span>
                        <span style={{ width: "40px", height: "1px", background: "#C9A467" }} />
                      </span>
                    </div>
                    <div className="mface" style={css(c?.frontStyle)}>
                      <span style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", letterSpacing: "0.14em", color: "#7A5C24" }}>
                        <span>
                          המיתוס
                        </span>
                        <span>
                          {c?.num}
                        </span>
                      </span>
                      <span className="serif" style={{ fontSize: "28px", lineHeight: "1.3", color: "#0B1714" }}>
                        {"״"}{c?.myth}{"״"}
                      </span>
                      {" "}
                      <span style={{ fontSize: "14px", color: "#3F4F4A" }}>
                        נפצו אותו ←
                      </span>
                      {" "}
                    </div>
                    {" "}
                    {(c?.frags || []).map((fr, $index) => (
                      <React.Fragment key={$index}>
                        <div className="mface" style={css(fr?.style)}>
                          <span style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", letterSpacing: "0.14em", color: "#7A5C24" }}>
                            <span>
                              המיתוס
                            </span>
                            <span>
                              {fr?.num}
                            </span>
                          </span>
                          <span className="serif" style={{ fontSize: "28px", lineHeight: "1.3", color: "#0B1714" }}>
                            {"״"}{fr?.myth}{"״"}
                          </span>
                          {" "}
                          <span style={{ fontSize: "14px", color: "#3F4F4A" }}>
                            נפצו אותו ←
                          </span>
                          {" "}
                        </div>
                      </React.Fragment>
                    ))}
                    {" "}
                    <svg className={`cracks ${s(c?.crackCls)}`} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                      <path d="M54 46 L0 0 M54 46 L30 0 M54 46 L62 0 M54 46 L100 0 M54 46 L100 38 M54 46 L100 72 M54 46 L100 100 M54 46 L68 100 M54 46 L34 100 M54 46 L0 100 M54 46 L0 64 M54 46 L0 30" stroke="#7A5C24" strokeWidth="1" fill="none" vectorEffect="non-scaling-stroke" />
                    </svg>
                    {" "}
                  </button>
                </React.Fragment>
              ))}
            </div>
          </div>
        </section>
        {/* ================= WHAT I'M NOT: STAMPS ================= */}
        <section style={{ background: "#EFE5D7", color: "#0B1714" }}>
          <div className="pad sec" style={{ maxWidth: "1280px", margin: "0 auto", padding: "160px 48px" }}>
            <span style={{ fontSize: "13px", letterSpacing: "0.16em", color: "#7A5C24", fontWeight: "500" }}>
              שקיפות מלאה
            </span>
            <div ref={v.ioNots} data-io="nots" style={{ marginTop: "28px", display: "flex", flexDirection: "column" }}>
              {(v.nots || []).map((n, $index) => (
                <React.Fragment key={$index}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "12px 48px", alignItems: "center", padding: "34px 0", borderTop: "1px solid #C9B79B" }}>
                    <span style={{ flex: "999 1 520px", display: "flex", alignItems: "baseline", gap: "24px", minWidth: "0" }}>
                      <span className="serif" style={{ fontSize: "30px", color: "#7A5C24" }}>
                        לא
                      </span>
                      <span style={css(n?.wordStyle)}>
                        {" "}
                        <span className="notword serif" style={{ fontWeight: "400", fontSize: "104px", lineHeight: "1", letterSpacing: "-0.02em" }}>
                          {n?.word}
                        </span>
                        {" "}
                        <span style={css(n?.barStyle)} />
                        {" "}
                      </span>
                    </span>
                    <span style={{ flex: "1 1 300px", fontSize: "17px", lineHeight: "1.7", color: "#3F4F4A", fontWeight: "300" }}>
                      {n?.text}
                    </span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </section>
        {/* ================= FOUNDING TICKET + BOOK ================= */}
        <section style={{ background: "#0B1714" }}>
          <div className="pad sec" style={{ maxWidth: "1280px", margin: "0 auto", padding: "160px 48px", display: "flex", flexWrap: "wrap", gap: "32px", alignItems: "stretch" }}>
            {v.hasFounding ? (
              <>
                <div className="ticket" style={{ flex: "1 1 500px", background: "#C9A467", color: "#0B1714", display: "flex", minHeight: "360px" }}>
                  <div className="tick-body" style={{ flex: "1 1 auto", padding: "52px 60px", display: "flex", flexDirection: "column", gap: "18px", justifyContent: "center" }}>
                    <span style={{ fontSize: "13px", letterSpacing: "0.2em", fontWeight: "600" }}>
                      כרטיס מייסדים
                    </span>
                    <h3 className="tick-h serif" style={{ margin: "0", fontWeight: "300", fontSize: "44px", lineHeight: "1.08" }}>
                      אני בתחילת הדרך.
                      <br />
                      <span style={{ fontWeight: "700" }}>
                        וזה היתרון שלכם.
                      </span>
                    </h3>
                    <p style={{ margin: "0", fontSize: "17px", lineHeight: "1.75", color: "#2B2716", maxWidth: "440px" }}>
                      {v.foundingText}
                    </p>
                  </div>
                  <div className="stub" style={{ flex: "0 0 160px", borderRight: "2px dashed rgba(11,23,20,0.45)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "14px", padding: "24px 14px" }}>
                    <span style={{ fontSize: "13px", letterSpacing: "0.12em" }}>
                      מקומות
                    </span>
                    <span className="serif" style={{ fontSize: "40px", lineHeight: "1" }}>
                      {v.foundingSeats}
                    </span>
                    <a className="ink" href="#contact" style={{ padding: "12px 16px", fontSize: "14px", fontWeight: "700", textAlign: "center" }}>
                      שמרו לי מקום
                    </a>
                  </div>
                  <div className="shine" aria-hidden="true" />
                </div>
              </>
            ) : null}
            <div className="guide-card" style={{ flex: "1 1 500px", background: "#F6EFE6", color: "#0B1714", padding: "52px", display: "flex", flexWrap: "wrap", gap: "48px", alignItems: "center" }}>
              <div className="book-stage" aria-hidden="true" style={{ flex: "0 0 180px", height: "250px", perspective: "1000px", margin: "0 auto" }}>
                <div className="book">
                  <div style={{ position: "absolute", top: "4px", bottom: "4px", left: "0", width: "16px", transformOrigin: "left center", transform: "rotateY(-90deg)", background: "#E9DFCE", borderTop: "1px solid #DCCFBC", borderBottom: "1px solid #DCCFBC" }} />
                  <div style={{ position: "absolute", inset: "0", background: "#2E4A43", padding: "24px 20px", display: "flex", flexDirection: "column", justifyContent: "space-between", color: "#F3E9DD", boxShadow: "-18px 24px 36px rgba(11,23,20,0.38)", borderRight: "10px solid #1F3631" }}>
                    <span style={{ fontSize: "9px", letterSpacing: "0.2em", color: "#C9A467" }}>
                      קריגל פיננסיים
                    </span>
                    <span className="serif" style={{ fontSize: "27px", lineHeight: "1.12" }}>
                      קניית רכב
                      <br />
                      בדרך
                      <br />
                      החכמה
                    </span>
                    <span style={{ display: "flex", gap: "4px" }}>
                      <span style={{ flex: "1", height: "4px", background: "#6E9A82" }} />
                      <span style={{ flex: "1", height: "4px", background: "#C9A467" }} />
                      <span style={{ flex: "1", height: "4px", background: "#C47A5A" }} />
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ flex: "1 1 240px", display: "flex", flexDirection: "column", gap: "14px" }}>
                <span style={{ fontSize: "13px", letterSpacing: "0.14em", color: "#7A5C24", fontWeight: "500" }}>
                  מדריך חינמי · 7 עמודים
                </span>
                <h3 className="serif" style={{ margin: "0", fontWeight: "400", fontSize: "36px", lineHeight: "1.12" }}>
                  מזומן, הלוואה
                  <br />
                  או ליסינג?
                </h3>
                <p style={{ margin: "0", fontSize: "15px", lineHeight: "1.75", color: "#3F4F4A", fontWeight: "300" }}>
                  השוואה מלאה בין שלושת המסלולים, על בסיס זהה של 36 חודשים.
                </p>
                {v.guideSent ? (
                  <>
                    <p role="status" style={{ margin: "0", padding: "14px 16px", background: "#0B1714", color: "#F3E9DD", fontSize: "15px", lineHeight: "1.6" }}>
                      תודה! הבקשה התקבלה, והמדריך יישלח אליכם למייל.
                    </p>
                  </>
                ) : null}
                {v.guideOpen ? (
                  <>
                    <form className="guide-form" onSubmit={v.sendGuide} noValidate style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                      <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#3F4F4A" }}>
                        אימייל
                        <input ref={v.guideRef} name="email" type="email" autoComplete="email" required placeholder="name@example.com" dir="ltr" aria-invalid={v.guideInvalid} style={{ height: "50px", padding: "0 16px", border: "1px solid #B8A88F", background: "#FFFFFF", fontSize: "15px", fontFamily: "inherit", color: "#0B1714" }} />
                      </label>
                      {v.hasGuideErr ? (
                        <>
                          <p role="alert" style={{ margin: "0", fontSize: "14px", color: "#8A3B22" }}>
                            {v.guideErr}
                          </p>
                        </>
                      ) : null}
                      <button className="ink" type="submit" disabled={v.guideSending} style={{ height: "50px", fontSize: "15px", fontWeight: "500" }}>
                        {v.guideLabel}
                      </button>
                    </form>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </section>
        {/* ================= FAQ ================= */}
        <section id="faq" style={{ background: "#F6EFE6", color: "#0B1714" }}>
          <div className="pad sec" style={{ maxWidth: "1280px", margin: "0 auto", padding: "160px 48px", display: "flex", flexWrap: "wrap", gap: "32px 72px" }}>
            <h2 className="h2 serif rv" style={{ flex: "1 1 340px", margin: "0", fontWeight: "300", fontSize: "80px", lineHeight: "0.98", letterSpacing: "-0.02em" }}>
              {"מה "}
              <span style={{ fontWeight: "700", color: "#7A5C24" }}>
                שואלים.
              </span>
            </h2>
            <div style={{ flex: "999 1 560px", borderTop: "1px solid #0B1714" }}>
              {(v.faqs || []).map((f, $index) => (
                <React.Fragment key={$index}>
                  <div style={{ borderBottom: "1px solid #DCCFBC" }}>
                    <button onClick={f?.toggle} aria-expanded={f?.expanded} style={{ width: "100%", minHeight: "76px", padding: "22px 0", background: "transparent", border: "none", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", textAlign: "right", fontFamily: "'Frank Ruhl Libre', serif", fontSize: "25px", color: "#0B1714" }}>
                      <span>
                        {f?.q}
                      </span>
                      <span style={css(f?.signStyle)}>
                        +
                      </span>
                    </button>
                    {f?.open ? (
                      <>
                        <p style={{ margin: "0", padding: "0 0 28px", fontSize: "17px", lineHeight: "1.8", color: "#3F4F4A", fontWeight: "300", maxWidth: "640px" }}>
                          {f?.a}
                        </p>
                      </>
                    ) : null}
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </section>
        {/* ================= 4 MEETINGS: THE PEN ================= */}
        <section id="meetings" className="meet" style={{ background: "#0B1714", position: "relative" }}>
          <div className="pad sec" style={{ maxWidth: "1280px", margin: "0 auto", padding: "160px 48px" }}>
            <div className="rv" style={{ display: "flex", flexWrap: "wrap", gap: "24px 72px", alignItems: "end", marginBottom: "80px" }}>
              <h2 className="h2 serif" style={{ flex: "1 1 460px", margin: "0", fontWeight: "300", fontSize: "80px", lineHeight: "0.98", letterSpacing: "-0.02em" }}>
                4 פגישות.
                <br />
                <span style={{ fontWeight: "700", color: "#C9A467" }}>
                  ואז – אתם.
                </span>
              </h2>
              <p style={{ flex: "1 1 380px", margin: "0", fontSize: "18px", lineHeight: "1.75", color: "#B9C7C1", fontWeight: "300" }}>
                קו הזהב הוא העט. בכל פגישה הוא עובר אליכם קצת יותר – והטבעת שלכם מתמלאת, עד שאתם מחזיקים כמעט את הכל לבד.
              </p>
            </div>
            <div style={{ position: "relative" }}>
              <svg className="penwrap" aria-hidden="true" viewBox="0 0 1000 200" preserveAspectRatio="none" style={{ position: "absolute", left: "0", top: "0", width: "100%", height: "132px", overflow: "visible" }}>
                <path className="penpath" pathLength="1" d="M1000 100 C960 30 920 170 875 100 C830 30 720 12 625 100 C530 188 462 182 375 100 C290 18 205 40 125 100 C82 132 40 122 0 100" fill="none" stroke="#C9A467" strokeWidth="2.4" strokeLinecap="round" />
              </svg>
              <div className="meet-grid" style={{ position: "relative", display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "40px 0" }}>
                {(v.meetings || []).map((m, $index) => (
                  <React.Fragment key={$index}>
                    <article style={{ padding: "0 22px", display: "flex", flexDirection: "column", alignItems: "center", gap: "18px", textAlign: "center" }}>
                      <div style={{ position: "relative", width: "132px", height: "132px", borderRadius: "50%", background: "#0B1714" }}>
                        <svg width="132" height="132" viewBox="0 0 132 132" aria-hidden="true" style={{ transform: "rotate(-90deg)" }}>
                          <circle cx="66" cy="66" r="54" fill="none" stroke="#1E3832" strokeWidth="8" />
                          <circle className="ring" cx="66" cy="66" r="54" fill="none" stroke="#C9A467" strokeWidth="8" strokeDasharray="339.3" style={css(m?.ring)} />
                        </svg>
                        <span className="serif" style={{ position: "absolute", inset: "0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px", color: "#F3E9DD" }}>
                          {m?.num}
                        </span>
                      </div>
                      <span style={{ fontSize: "12px", letterSpacing: "0.12em", color: "#9DB0A8" }}>
                        החלק שלכם בעבודה · המחשה
                      </span>
                      <h3 className="serif" style={{ margin: "0", fontWeight: "500", fontSize: "26px", lineHeight: "1.2", color: "#F3E9DD" }}>
                        {m?.title}
                      </h3>
                      <p style={{ margin: "0", fontSize: "15px", lineHeight: "1.75", color: "#B9C7C1", fontWeight: "300" }}>
                        {m?.desc}
                      </p>
                      <span style={{ fontSize: "14px", color: "#C9A467", fontWeight: "500" }}>
                        {"ביד: "}{m?.take}
                      </span>
                    </article>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </section>
        {/* ================= CONTACT ================= */}
        <section id="contact" style={{ background: "#C9A467", color: "#0B1714" }}>
          <div className="pad sec" style={{ maxWidth: "1280px", margin: "0 auto", padding: "160px 48px", display: "flex", flexWrap: "wrap", gap: "56px 80px", alignItems: "center" }}>
            <div style={{ flex: "1 1 460px", minWidth: "0", display: "flex", flexDirection: "column", gap: "24px" }}>
              <h2 className="giant serif" style={{ margin: "0", fontWeight: "300", fontSize: "96px", lineHeight: "0.96", letterSpacing: "-0.025em" }}>
                20 דקות.
                <br />
                3 נקודות.
                <br />
                <span style={{ fontWeight: "700" }}>
                  בכתב.
                </span>
              </h2>
              <p style={{ margin: "0", fontSize: "19px", lineHeight: "1.7", color: "#2B2716", maxWidth: "470px" }}>
                בסוף שיחת ההיכרות תקבלו ממני בוואטסאפ את 3 הנקודות שכדאי לכם לעבוד עליהן. גם אם לא נמשיך יחד.
              </p>
              <div ref={v.ioChat} data-io="chat" style={{ background: "#0B1714", padding: "18px", maxWidth: "460px", display: "flex", flexDirection: "column", gap: "10px", boxShadow: "0 30px 60px rgba(11,23,20,0.28)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", paddingBottom: "12px", borderBottom: "1px solid #23413A" }}>
                  <span style={{ width: "40px", height: "40px", borderRadius: "50%", overflow: "hidden", flex: "0 0 auto", display: "block" }}>
                    <img loading="lazy" decoding="async" src="/tomer.jpg" alt="" style={{ display: "block", width: "100%", height: "116%", objectFit: "cover", objectPosition: "50% 0%" }} />
                  </span>
                  <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                    <span style={{ color: "#F3E9DD", fontWeight: "600", fontSize: "15px" }}>
                      תומר קריגל
                    </span>
                    <span style={{ color: "#9DB0A8", fontSize: "12px" }}>
                      דוגמה להודעה שתקבלו
                    </span>
                  </span>
                </div>
                {(v.bubbles || []).map((b, $index) => (
                  <React.Fragment key={$index}>
                    <div style={css(b?.style)}>
                      {b?.text}
                    </div>
                  </React.Fragment>
                ))}
                <div style={css(v.typingStyle)}>
                  <span className="dot" />
                  <span className="dot" style={{ animationDelay: ".2s" }} />
                  <span className="dot" style={{ animationDelay: ".4s" }} />
                </div>
              </div>
            </div>
            <div style={{ flex: "1 1 420px", background: "#0B1714", color: "#F3E9DD", padding: "52px" }}>
              {v.sent ? (
                <>
                  <div style={{ display: "flex", flexDirection: "column", gap: "14px", padding: "40px 0" }}>
                    <h3 className="serif" style={{ margin: "0", fontWeight: "400", fontSize: "42px" }}>
                      תודה, קיבלתי.
                    </h3>
                    <p style={{ margin: "0", fontSize: "16px", lineHeight: "1.7", color: "#B9C7C1" }}>
                      אחזור אליכם לתיאום השיחה בהקדם.
                    </p>
                  </div>
                </>
              ) : null}
              {" "}
              {v.notSent ? (
                <>
                  <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                    <h3 className="serif" style={{ margin: "0 0 4px", fontWeight: "400", fontSize: "34px" }}>
                      שריינו שיחה
                    </h3>
                    {v.hasMine ? (
                      <>
                        <div style={{ border: "1px dashed #C9A467", padding: "14px 16px", display: "flex", flexDirection: "column", gap: "10px" }}>
                          <span style={{ fontSize: "13px", color: "#C9A467" }}>
                            הבלגן שהוספתם למעלה – ייכנס להודעה:
                          </span>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                            {(v.mineList || []).map((mi, $index) => (
                              <React.Fragment key={$index}>
                                <span style={{ padding: "5px 12px", background: "#16302A", border: "1px solid #C9A467", color: "#F3E9DD", fontSize: "13px", borderRadius: "14px" }}>
                                  {mi?.label}
                                </span>
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : null}
                    <form className="lead-form" onSubmit={v.send} noValidate style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                      <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#B9C7C1" }}>
                        שם
                        <input ref={v.nameRef} name="name" type="text" autoComplete="name" required placeholder="השם שלכם" aria-invalid={v.nameInvalid} style={{ height: "56px", padding: "0 16px", border: "1px solid #3C5A51", background: "#16302A", fontSize: "16px", fontFamily: "inherit", color: "#F3E9DD" }} />
                      </label>
                      <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#B9C7C1" }}>
                        טלפון
                        <input ref={v.phoneRef} name="phone" type="tel" autoComplete="tel" inputMode="tel" required placeholder="050-0000000" dir="ltr" aria-invalid={v.phoneInvalid} style={{ height: "56px", padding: "0 16px", border: "1px solid #3C5A51", background: "#16302A", fontSize: "16px", fontFamily: "inherit", color: "#F3E9DD", textAlign: "right" }} />
                      </label>
                      {v.hasFormErr ? (
                        <>
                          <p role="alert" style={{ margin: "0", fontSize: "14px", lineHeight: "1.6", color: "#F0B49A" }}>
                            {v.formErr}
                          </p>
                        </>
                      ) : null}
                      <button className="gold" type="submit" disabled={v.sending} style={{ height: "60px", fontSize: "18px", fontWeight: "700", marginTop: "6px" }}>
                        {v.sendLabel}
                      </button>
                    </form>
                    <a className="ghost" href={v.waHref} target="_blank" rel="noopener" style={{ height: "54px", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {v.waLabel}
                    </a>
                    <p style={{ margin: "0", fontSize: "12px", lineHeight: "1.6", color: "#8DA29A" }}>
                      {"הפרטים משמשים רק כדי לחזור אליכם · "}
                      <Link to="/privacy" style={{ color: "#B9C7C1" }}>
                        מדיניות פרטיות
                      </Link>
                    </p>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </section>
        {/* ================= FOOTER ================= */}
        <footer style={{ background: "#060E0C", color: "#9DB0A8" }}>
          <div className="pad" style={{ maxWidth: "1280px", margin: "0 auto", padding: "88px 48px 36px", display: "flex", flexDirection: "column", gap: "44px" }}>
            <span className="giant serif" style={{ fontWeight: "300", fontSize: "128px", lineHeight: "0.92", letterSpacing: "-0.03em", color: "#F3E9DD" }}>
              קריגל
              <br />
              <span style={{ fontWeight: "700", color: "#C9A467" }}>
                פיננסיים.
              </span>
            </span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px 40px", justifyContent: "space-between", paddingTop: "24px", borderTop: "1px solid #1E3832", fontSize: "14px" }}>
              <span>
                {"© "}{v.year}{" קריגל פיננסיים · תכנון נכון, עתיד בטוח"}
              </span>
              <span>
                <a href="tel:0543291703" style={{ color: "#9DB0A8", textDecoration: "none" }}>
                  054-3291703
                </a>
                {" · "}
                <a href="mailto:krigeltomer@gmail.com" style={{ color: "#9DB0A8", textDecoration: "none" }}>
                  krigeltomer@gmail.com
                </a>
                {" · "}
                <a href="https://app.krigelfinance.co.il" style={{ color: "#C9A467", textDecoration: "none" }}>
                  כניסת לקוחות
                </a>
              </span>
              <span style={{ display: "flex", gap: "24px" }}>
                <Link to="/privacy" style={{ color: "#9DB0A8" }}>
                  מדיניות פרטיות
                </Link>
                <Link to="/terms" style={{ color: "#9DB0A8" }}>
                  תנאי שימוש
                </Link>
                <Link to="/accessibility" style={{ color: "#9DB0A8" }}>
                  הצהרת נגישות
                </Link>
              </span>
            </div>
          </div>
        </footer>
        <div className="sticky" style={{ position: "sticky", bottom: "0", zIndex: "20", background: "#060E0C", borderTop: "1px solid #1E3832", padding: "12px 16px", gap: "10px" }}>
          <a className="gold" href="#contact" style={{ flex: "1 1 auto", height: "50px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: "700" }}>
            שיחת היכרות
          </a>
          <a className="ghost" href={v.waHref} target="_blank" rel="noopener" style={{ flex: "0 0 auto", height: "50px", padding: "0 18px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px" }}>
            וואטסאפ
          </a>
        </div>
      </div>
    );
  }
}
