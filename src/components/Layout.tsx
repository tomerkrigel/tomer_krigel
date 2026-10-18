import React from "react";
import { Link } from "react-router-dom";
import KrigelLogo from "./KrigelLogo";
import { SITE } from "../pages/home/content";

export { default as KrigelLogo } from "./KrigelLogo";

// Shell for the inner pages (privacy, terms, accessibility) – same header and footer language as the home page.
const WA_HREF = "https://wa.me/972543291703?text=" + encodeURIComponent("היי תומר, הגעתי מהאתר. נשמח לשיחת היכרות.");

export default function Layout({ children }: { children: React.ReactNode }) {
  const nav = [
    { name: "נעים להכיר", to: "/#me" },
    { name: "נסו בעצמכם", to: "/#method" },
    { name: SITE.price ? "כמה זה עולה" : "שאלות נפוצות", to: "/#faq" },
    { name: "4 הפגישות", to: "/#meetings" },
  ];

  return (
    <div dir="rtl" className="min-h-screen flex flex-col bg-[#F6EFE6] text-[#0B1714] font-sans">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:right-3 focus:z-50 focus:bg-[#C9A467] focus:text-[#0B1714] focus:px-4 focus:py-2 focus:font-bold"
      >
        דילוג לתוכן
      </a>

      <header className="sticky top-0 z-40 bg-[#0B1714]/95 border-b border-[#C9A467]/20">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-12 py-3 sm:py-4 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
            <KrigelLogo className="w-[38px] h-[38px] sm:w-[46px] sm:h-[46px]" />
            <span className="font-serif text-[19px] sm:text-[22px] font-medium text-[#F3E9DD]">קריגל פיננסיים</span>
          </Link>
          <nav className="flex items-center gap-7">
            {nav.map((item) => (
              <Link key={item.to} to={item.to} className="hidden lg:inline text-[15px] text-[#D9D2C6] hover:text-[#C9A467] transition-colors whitespace-nowrap">
                {item.name}
              </Link>
            ))}
            <Link
              to="/#contact"
              className="bg-[#C9A467] text-[#0B1714] border border-[#C9A467] px-4 sm:px-6 py-2.5 sm:py-3 text-[14px] sm:text-[15px] font-bold whitespace-nowrap hover:bg-[#E0C083] transition-colors"
            >
              שיחת היכרות
            </Link>
          </nav>
        </div>
      </header>

      <main id="main" className="flex-1">
        {children}
      </main>

      <footer className="bg-[#060E0C] text-[#9DB0A8]">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-12 pt-16 sm:pt-20 pb-9 flex flex-col gap-10">
          <span className="font-serif font-light text-[52px] sm:text-[88px] leading-[0.92] tracking-[-0.03em] text-[#F3E9DD]">
            קריגל
            <br />
            <span className="font-bold text-[#C9A467]">פיננסיים.</span>
          </span>
          <div className="flex flex-wrap gap-x-10 gap-y-4 justify-between pt-6 border-t border-[#1E3832] text-[14px]">
            <span>© {new Date().getFullYear()} קריגל פיננסיים · תכנון נכון, עתיד בטוח</span>
            <span>
              <a href="tel:0543291703" className="hover:text-[#C9A467]">054-3291703</a>
              {" · "}
              <a href="mailto:krigeltomer@gmail.com" className="hover:text-[#C9A467]">krigeltomer@gmail.com</a>
              {" · "}
              <a href={WA_HREF} target="_blank" rel="noopener noreferrer" className="hover:text-[#C9A467]">וואטסאפ</a>
              {SITE.instagram ? (
                <>
                  {" · "}
                  <a href={`https://www.instagram.com/${SITE.instagram}/`} target="_blank" rel="noopener noreferrer" className="hover:text-[#C9A467]">אינסטגרם</a>
                </>
              ) : null}
            </span>
            <span className="flex gap-6">
              <Link to="/privacy" className="underline hover:text-[#C9A467]">מדיניות פרטיות</Link>
              <Link to="/terms" className="underline hover:text-[#C9A467]">תנאי שימוש</Link>
              <Link to="/accessibility" className="underline hover:text-[#C9A467]">הצהרת נגישות</Link>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
