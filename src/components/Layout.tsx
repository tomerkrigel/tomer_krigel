import React, { useState, useEffect, useId } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { Menu, X, Phone, Mail, ChevronLeft, MessageCircle } from "lucide-react";

// Beautiful custom representation of the Krigel brand monogram logo as shown in the upload reference
export function KrigelLogo({ className = "w-12 h-12", light = false }: { className?: string; light?: boolean }) {
  const uniqueId = useId().replace(/:/g, "");
  const goldId = `krigelGold-${uniqueId}`;
  const creamId = `krigelCream-${uniqueId}`;
  const leafId = `krigelLeaf-${uniqueId}`;

  return (
    <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* Shiny metallic gold gradient for the border, stem, leaves, and divider */}
        <linearGradient id={goldId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F9E7C9" />
          <stop offset="30%" stopColor="#C9AA67" />
          <stop offset="70%" stopColor="#A1824A" />
          <stop offset="100%" stopColor="#C9AA67" />
        </linearGradient>
        {/* Warm cream/soft white gradient for the serif 'K' and brand name */}
        <linearGradient id={creamId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F3E9DD" />
        </linearGradient>
        {/* Elegant reusable leaf template for pristine geometric symmetry */}
        <g id={leafId}>
          {/* Elegant organic pointed leaf shape */}
          <path d="M 0 0 C 3 -6, 14 -8, 22 0 C 14 6, 3 4, 0 0 Z" fill={`url(#${goldId})`} />
          {/* Subtle curved midrib/vein for 3D depth */}
          <path d="M 0 0 Q 11 -1 18 0" stroke="#FFFFFF" strokeWidth="0.4" opacity="0.35" fill="none" />
        </g>
      </defs>

      {/* Main forest green circular badge background */}
      <circle cx="100" cy="100" r="95" fill="#1B322C" />
      
      {/* Outer gold-rimmed double borders matching the real badge exactly */}
      <circle cx="100" cy="100" r="94" stroke={`url(#${goldId})`} strokeWidth="2.5" fill="none" />
      <circle cx="100" cy="100" r="90" stroke={`url(#${goldId})`} strokeWidth="0.75" fill="none" opacity="0.6" />

      {/* Elegant Serif 'K' - Left Vertical Stem with bracketed serifs */}
      <path 
        d="M 60 44 L 92 44 L 92 47 C 86 47, 84 49, 84 54 L 84 106 C 84 111, 86 113, 92 113 L 92 116 L 60 116 L 60 113 C 66 113, 68 111, 68 106 L 68 54 C 68 49, 66 47, 60 47 Z" 
        fill={`url(#${creamId})`} 
      />
      
      {/* Elegant Serif 'K' - Top Right Diagonal Arm */}
      <path 
        d="M 84 74 L 119 44 L 133 44 L 133 47 C 128 47, 126 49, 125 52 L 91 82 Z" 
        fill={`url(#${creamId})`} 
      />
      
      {/* Elegant Serif 'K' - Bottom Right Diagonal Leg with wide flared foot */}
      <path 
        d="M 97 76 L 113 113 C 113 113, 109 113, 107 113 L 107 116 L 140 116 L 140 113 C 133 113, 127 107, 121 98 L 103 76 Z" 
        fill={`url(#${creamId})`} 
      />

      {/* The golden olive/laurel branch cutting across the monogram */}
      <path 
        d="M 55 126 Q 101 92 147 44" 
        stroke={`url(#${goldId})`} 
        strokeWidth="2.4" 
        strokeLinecap="round" 
        fill="none" 
      />

      {/* Symmetrical & organic golden leaves sprouting sequentially along the stem */}
      {/* Terminal leaf at the tip */}
      <use href={`#${leafId}`} transform="translate(147, 44) rotate(-48) scale(1.0)" />

      {/* Pair 1: t = 0.88 */}
      <use href={`#${leafId}`} transform="translate(136, 55.3) rotate(-78) scale(0.92)" />
      <use href={`#${leafId}`} transform="translate(136, 55.3) rotate(-14) scale(0.92)" />

      {/* Pair 2: t = 0.76 */}
      <use href={`#${leafId}`} transform="translate(125, 66.2) rotate(-79) scale(0.82)" />
      <use href={`#${leafId}`} transform="translate(125, 66.2) rotate(-11) scale(0.82)" />

      {/* Pair 3: t = 0.64 */}
      <use href={`#${leafId}`} transform="translate(114, 76.7) rotate(-79) scale(0.72)" />
      <use href={`#${leafId}`} transform="translate(114, 76.7) rotate(-7) scale(0.72)" />

      {/* Pair 4: t = 0.52 */}
      <use href={`#${leafId}`} transform="translate(103, 86.9) rotate(-79) scale(0.62)" />
      <use href={`#${leafId}`} transform="translate(103, 86.9) rotate(-3) scale(0.62)" />

      {/* Brand Name "תומר קריגל" */}
      <text 
        x="100" 
        y="143" 
        fontFamily="Inter, system-ui, -apple-system, sans-serif" 
        fontWeight="800" 
        fontSize="14.5" 
        fill={`url(#${creamId})`} 
        textAnchor="middle" 
        letterSpacing="0.5"
      >
        תומר קריגל
      </text>

      {/* Dynamic Separator with Gold Diamond */}
      <path d="M 45 153 L 90 153 M 110 153 L 155 153" stroke={`url(#${goldId})`} strokeWidth="0.8" />
      <polygon points="100,150 103,153 100,156 97,153" fill={`url(#${goldId})`} />

      {/* Tagline "תכנון נכון, עתיד בטוח" */}
      <text 
        x="100" 
        y="169" 
        fontFamily="Inter, system-ui, -apple-system, sans-serif" 
        fontWeight="700" 
        fontSize="7.5" 
        fill={`url(#${goldId})`} 
        textAnchor="middle" 
        letterSpacing="1"
      >
        תכנון נכון, עתיד בטוח
      </text>
    </svg>
  );
}

interface NavItem {
  name: string;
  page: string;
  section: string | null;
}

interface LayoutProps {
  children: React.ReactNode;
  currentPageName?: string;
}

export default function Layout({ children, currentPageName = "Home" }: LayoutProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems: NavItem[] = [
    { name: "ראשי", page: "Home", section: null },
    { name: "נשמע מוכר?", page: "Home", section: "pain" },
    { name: "מיתוס או עובדה?", page: "Home", section: "myths" },
    { name: "הגישה שלי", page: "Home", section: "philosophy" },
    { name: "איך זה עובד", page: "Home", section: "process" },
    { name: "שאלות ותשובות", page: "Home", section: "faq" },
    { name: "יצירת קשר", page: "Home", section: "contact" },
  ];

  const handleNavClick = (e: React.MouseEvent, item: NavItem) => {
    if (currentPageName === "Home" && (item.section !== null || item.name === "ראשי")) {
      e.preventDefault();
      const targetId = item.section || "root-top";
      const element = item.section ? document.getElementById(item.section) : document.body;
      if (element) {
        const offset = 90;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: item.section ? offsetPosition : 0,
          behavior: "smooth"
        });
      }
      setMobileMenuOpen(false);
    }
  };

  return (
    <div id="root-top" dir="rtl" className="min-h-screen bg-[#F3E9DD]/15 font-sans selection:bg-[#C9AA67]/30 text-slate-800">
      <a href="#contact" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:right-2 focus:z-[100] focus:bg-[#2E4A43] focus:text-[#F3E9DD] focus:px-4 focus:py-2 focus:rounded-xl">דילוג לטופס יצירת קשר</a>
      {/* Header */}
      <header
        className={`fixed top-0 right-0 left-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-md border-b border-[#A89C8A]/20 py-2.5"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link 
            to={createPageUrl("Home")} 
            onClick={(e) => handleNavClick(e, { name: "ראשי", page: "Home", section: null })}
            className="group flex items-center gap-3 transition-transform hover:scale-101"
            id="logo-link"
          >
            <div className="flex items-center gap-3">
              <div className="shrink-0">
                <KrigelLogo className="w-14 h-14 sm:w-[72px] sm:h-[72px] transition-all duration-300 group-hover:scale-105" light={!isScrolled} />
              </div>
              <div className="flex flex-col text-right">
                <span className={`font-heading font-extrabold text-lg sm:text-xl tracking-wide leading-none transition-colors duration-500 ${isScrolled ? 'text-[#2E4A43]' : 'text-white'}`}>
                  תומר קריגל
                </span>
                <span className={`font-heading text-[8px] sm:text-[9px] font-bold tracking-[0.15em] uppercase mt-1 transition-colors duration-500 ${isScrolled ? 'text-[#6C8A7A]' : 'text-[#C9AA67]'}`}>
                  מתכנן פיננסי אישי
                </span>
                <span className={`font-sans text-[8px] sm:text-[9px] font-light mt-0.5 transition-colors duration-500 ${isScrolled ? 'text-slate-400' : 'text-[#F3E9DD]/60'}`}>
                  תכנון נכון, עתיד בטוח
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8" id="desktop-nav">
            <div className="flex items-center gap-7">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={createPageUrl(item.page)}
                  onClick={(e) => handleNavClick(e, item)}
                  className={`group relative py-2 font-heading font-bold text-sm tracking-wide transition-colors duration-300 ${
                    isScrolled ? "text-[#2E4A43] hover:text-[#C9AA67]" : "text-[#F3E9DD]/95 hover:text-[#C9AA67]"
                  }`}
                  id={`nav-item-${item.section || 'home'}`}
                >
                  {item.name}
                  <span className={`absolute bottom-0 right-0 h-0.5 bg-[#C9AA67] transition-all duration-300 group-hover:w-full ${currentPageName === item.page && !item.section ? 'w-full' : 'w-0'}`} />
                </Link>
              ))}
            </div>
            
            <Link
              to={createPageUrl("Home")}
              onClick={e => { 
                if (currentPageName === "Home") { 
                  e.preventDefault(); 
                  const contactEl = document.getElementById("contact");
                  if (contactEl) {
                    const offset = 90;
                    const bodyRect = document.body.getBoundingClientRect().top;
                    const elementRect = contactEl.getBoundingClientRect().top;
                    const offsetPosition = (elementRect - bodyRect) - offset;
                    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
                  }
                }
              }}
              className="relative overflow-hidden bg-[#C9AA67] hover:bg-[#B59655] text-white px-6 py-3 rounded-xl font-heading font-extrabold text-sm transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
              id="cta-nav-button"
            >
              <span className="relative z-10">לשיחת אבחון חינם</span>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2.5 rounded-xl transition-all ${
              isScrolled 
                ? "bg-[#6C8A7A]/10 text-[#2E4A43] hover:bg-[#6C8A7A]/20" 
                : "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
            }`}
            id="mobile-menu-btn"
            aria-label="תפריט"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`absolute top-full right-0 left-0 md:hidden bg-white border-t border-[#A89C8A]/20 shadow-xl overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
          }`}
          id="mobile-nav-menu"
        >
          <nav className="flex flex-col p-6 gap-1 bg-white">
            {navItems.map((item) => (
              <div key={item.name}>
                <Link
                  to={createPageUrl(item.page)}
                  onClick={(e) => handleNavClick(e, item)}
                  className="flex items-center justify-between px-4 py-3.5 rounded-xl font-heading font-extrabold transition-all text-[#2E4A43] hover:bg-[#F3E9DD]/40 hover:text-[#C9AA67] group"
                  id={`mobile-nav-item-${item.section || 'home'}`}
                >
                  {item.name}
                  <ChevronLeft size={16} className="opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0 text-[#C9AA67]" />
                </Link>
              </div>
            ))}
            <div>
              <Link
                to={createPageUrl("Home")}
                onClick={e => { 
                  if (currentPageName === "Home") { 
                    e.preventDefault(); 
                    const contactEl = document.getElementById("contact");
                    if (contactEl) {
                      const offset = 90;
                      const bodyRect = document.body.getBoundingClientRect().top;
                      const elementRect = contactEl.getBoundingClientRect().top;
                      const offsetPosition = (elementRect - bodyRect) - offset;
                      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
                    }
                  } 
                  setMobileMenuOpen(false); 
                }}
                className="flex items-center justify-center bg-[#C9AA67] text-white px-4 py-4 rounded-xl font-heading font-bold text-center mt-4 shadow-md active:scale-98 transition-all hover:bg-[#B59655]"
                id="cta-mobile-btn"
              >
                לשיחת אבחון חינם
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative">{children}</main>

      {/* Footer */}
      <footer className="bg-[#2E4A43] text-white overflow-hidden relative border-t-8 border-[#C9AA67]" id="footer-section">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9AA67]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="max-w-7xl mx-auto px-6 pt-12 sm:pt-20 pb-8 relative z-10">
          <div className="grid md:grid-cols-12 gap-12">
            <div className="md:col-span-5 space-y-6">
              <div className="flex items-center gap-4">
                <div className="shrink-0">
                  <KrigelLogo className="w-20 h-20 sm:w-24 h-24 transition-transform duration-300 hover:scale-105" light={true} />
                </div>
                <div className="flex flex-col text-right">
                  <span className="font-heading font-extrabold text-lg sm:text-xl tracking-wide leading-none text-white">
                    תומר קריגל
                  </span>
                  <span className="font-heading text-[8px] sm:text-[9px] font-bold tracking-[0.15em] uppercase mt-1 text-[#C9AA67]">
                    מתכנן פיננסי אישי
                  </span>
                </div>
              </div>
              <p className="text-[#F3E9DD]/85 leading-relaxed text-base max-w-md font-light">
                תומר קריגל הוא מתכנן פיננסי אישי המתמקד בליווי אישי 1:1, בבניית תכנון מדויק שמייצר ביטחון, שקט ורווחה כלכלית לחיים. אני כאן כדי לעזור לכם לקבל החלטות נכונות, להבין את התמונה הגדולה ולתכנן עתיד בטוח לכם וליקרים לכם.
              </p>
              
              <div className="flex gap-3">
                <a href="tel:0543291703" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-[#C9AA67] hover:text-[#2E4A43] transition-all cursor-pointer border border-white/10" aria-label="טלפון">
                   <Phone size={18} />
                </a>
                <a href="mailto:krigeltomer@gmail.com" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-[#C9AA67] hover:text-[#2E4A43] transition-all cursor-pointer border border-white/10" aria-label="אימייל">
                   <Mail size={18} />
                </a>
              </div>
            </div>

            <div className="hidden md:block md:col-span-3">
              <h4 className="text-sm font-heading font-bold uppercase tracking-wider mb-6 text-[#C9AA67]">ניווט מהיר</h4>
              <nav className="flex flex-col gap-3.5">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={createPageUrl(item.page)}
                    onClick={(e) => handleNavClick(e, item)}
                    className="text-white/70 hover:text-[#C9AA67] transition-all hover:translate-x-[-4px] flex items-center gap-2 text-sm"
                    id={`footer-nav-item-${item.section || 'home'}`}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[#C9AA67]/60" />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="md:col-span-4">
              <h4 className="text-sm font-heading font-bold uppercase tracking-wider mb-6 text-[#C9AA67]">פרטי התקשרות</h4>
              <div className="space-y-4">
                <a 
                  href="tel:0543291703" 
                  className="group flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-white/10"
                >
                  <div className="p-2.5 rounded-xl bg-[#C9AA67]/20 text-[#C9AA67] group-hover:bg-[#C9AA67] group-hover:text-primary transition-colors">
                    <Phone size={18} />
                  </div>
                  <div>
                    <span className="block text-xs text-[#F3E9DD]/60 mb-0.5 font-light">טלפון ישיר</span>
                    <span className="text-base font-bold text-white">054-3291703</span>
                  </div>
                </a>
                
                <a 
                  href="mailto:krigeltomer@gmail.com" 
                  className="group flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-white/10"
                >
                  <div className="p-2.5 rounded-xl bg-[#C9AA67]/20 text-[#C9AA67] group-hover:bg-[#C9AA67] group-hover:text-primary transition-colors">
                    <Mail size={18} />
                  </div>
                  <div>
                    <span className="block text-xs text-[#F3E9DD]/60 mb-0.5 font-light">כתובת דואר אלקטרוני</span>
                    <span className="text-base font-bold text-white">krigeltomer@gmail.com</span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Elegant Dark Green and Gold Brand Board Footer Banner */}
          <div className="mt-16 border-t border-white/10 pt-8 flex flex-col items-center justify-between gap-6" id="brand-footer-banner">
            <div className="w-full bg-[#2E4A43] border border-[#C9AA67]/30 py-4.5 px-6 rounded-2xl flex flex-wrap justify-around items-center gap-4 text-[#F3E9DD] font-heading font-extrabold text-sm sm:text-base tracking-wider shadow-md">
              <span>משפחה</span>
              <span className="text-[#C9AA67] font-light">|</span>
              <span>תכנון נכון</span>
              <span className="text-[#C9AA67] font-light">|</span>
              <span>שקט כלכלי</span>
              <span className="text-[#C9AA67] font-light">|</span>
              <span>עתיד בטוח</span>
            </div>
            
            <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4 text-[#F3E9DD]/50 text-xs">
              <p>© {new Date().getFullYear()} קריגל תכנון פיננסי • KRIGEL. כל הזכויות שמורות.</p>
              <div className="flex gap-6">
                <Link to="/privacy" className="hover:text-[#C9AA67] transition-colors">מדיניות פרטיות</Link>
                <Link to="/terms" className="hover:text-[#C9AA67] transition-colors">תנאי שימוש</Link>
                <Link to="/accessibility" className="hover:text-[#C9AA67] transition-colors">הצהרת נגישות</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Widget */}
      <div dir="ltr" className="fixed bottom-6 left-6 z-50 group flex items-center gap-3">
        {/* Floating Button */}
        <a
          href="https://wa.me/972543291703?text=%D7%94%D7%99%20%D7%AA%D7%95%D7%9E%D7%A8,%20%D7%94%D7%92%D7%A2%D7%AA%D7%99%20%D7%9E%D7%94%D7%90%D7%AA%D7%A8%20%D7%95%D7%90%D7%A9%D7%9E%D7%97%20%D7%9C%D7%94%D7%AA%D7%99%D7%99%D7%A2%D7%AA"
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 rounded-full bg-[#2E4A43] hover:bg-[#233933] border-2 border-[#C9AA67] text-[#C9AA67] flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 relative"
          aria-label="דברו איתי בוואטסאפ"
          id="whatsapp-widget"
        >
          {/* Pulsing ring */}
          <span className="absolute inset-0 rounded-full border border-[#C9AA67]/40 animate-ping opacity-75 pointer-events-none" />
          <MessageCircle size={26} className="text-[#C9AA67]" />
        </a>

        {/* Tooltip */}
        <div className="bg-[#2E4A43] text-[#F3E9DD] border border-[#C9AA67]/20 px-4 py-2 rounded-xl text-xs sm:text-sm font-heading font-bold shadow-xl opacity-0 -translate-x-2 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out whitespace-nowrap" dir="rtl">
          שאלה? דברו איתי בוואטסאפ
        </div>
      </div>
    </div>
  );
}
