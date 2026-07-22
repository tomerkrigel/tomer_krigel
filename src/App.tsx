import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout, { KrigelLogo } from "./components/Layout";
import TomerImage from "./components/TomerImage";
import { PrivacyPolicy, TermsOfUse, AccessibilityStatement } from "./pages/LegalPages";
import { motion, AnimatePresence } from "motion/react";
import { 
  TrendingUp, 
  ShieldCheck, 
  Target, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  MessageSquare,
  BarChart3,
  PieChart,
  Wallet,
  Compass,
  ArrowUpRight,
  Heart,
  ChevronDown,
  Award,
  FileText,
  Check,
  HelpCircle,
  AlertCircle,
  Calendar,
  Zap
} from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6, ease: "easeOut" }
};

const staggerContainer = {
  initial: {},
  whileInView: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

function Home() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [flippedMyths, setFlippedMyths] = useState<Record<number, boolean>>({});
  const [activeStep, setActiveStep] = useState(0);

  // Form Fields
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    challenge: "הכסף נעלם ולא ברור לאן",
    customChallenge: ""
  });

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  // חיבור לידים לחשבון ה-Formspree של תומר
  const FORMSPREE_ID = "mpqvjzzg";

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          challenge: formData.challenge,
          details: formData.customChallenge,
        }),
      });
    } catch {
      // גם אם השליחה נכשלה - לא חוסמים את המשתמש; הפרטים מוצגים בקונסול לגיבוי
      console.log("lead:", formData);
    }
    setFormSubmitted(true);
  };


  // Myth-or-Fact interactive cards
  const mythCards = [
    { myth: "תכנון פיננסי אומר לוותר על בילויים", fact: "תקציב נכון שם את המסעדות, החופשות והקפה בפנים – מראש ובלב שקט." },
    { myth: "צריך להרוויח יותר כדי להתחיל לחסוך", fact: "ברוב המשפחות הפער לא נסגר בשכר – הוא נסגר בשיטה. הסדר קודם להכנסה." },
    { myth: "בשביל סדר פיננסי צריך אקסלים מסובכים", fact: "שיטה פשוטה אחת, שמבינים בפגישה אחת, עושה יותר מעשרה גיליונות." },
    { myth: "ליווי פיננסי זה רק לעשירים", fact: "ההפך – דווקא משפחות עם הכנסה רגילה מרוויחות ממנו הכי הרבה." },
  ];

  // 4-Step Interactive Methodology Data
  const roadmapSteps = [
    {
      step: "01",
      title: "מורידים את הלחץ, מדליקים את האור",
      subtitle: "מפסיקים לנחש ומתחילים לישון בשקט בלילה",
      desc: "הצעד הראשון הוא פשוט להוריד את הלחץ. נאסוף יחד, בדיסקרטיות מלאה, את כל התמונה הפיננסית שלכם: עובר ושב, הלוואות, ביטוחים, פנסיות וחסכונות. בלי שיפוטיות ובלי מבחנים – רק אור, בהירות ורוגע. פתאום הכל נהיה ברור.",
      icon: Compass,
      deliverables: [
        "דוח בהירות תזרימי מלא, מאיר עיניים ומפשט את כל הבלגן הכלכלי",
        "איתור וסגירה מיידית של כל 'החורים השקופים' שמייקרים לכם את החיים",
        "מיפוי מדויק של כל נכסי הפנסיה, החסכונות והביטוחים שיעשה לכם סדר בראש"
      ]
    },
    {
      step: "02",
      title: "בניית תקציב חופש וספונטנות",
      subtitle: "אתם מחליטים מה חשוב לכם – אני נותן את המצפן",
      desc: "את התקציב אנחנו בונים ביחד, סביב שולחן אחד. אני מציג את התמונה המלאה – ואתם אלה שמחליטים מאיפה להוריד, כמה, ומה בשום אופן לא מוותרים עליו. בילויים, מסעדות, חופשות – מקבלים מקום מכובד בתקציב מראש, בלי ייסורי מצפון. זה התקציב שלכם, בקצב שלכם, לפי הערכים שלכם.",
      icon: Wallet,
      deliverables: [
        "מבנה תקציב אישי גמיש, פשוט וקל ליישום שכיף להתמיד בו מהיום הראשון",
        "הפרדה מוחלטת והגנה על כספי פנאי ובילויים כדי ליהנות מהחיים בראש שקט",
        "תוכנית פעולה ברורה להגשמת היעדים הגדולים שלכם (רכב, חופשות משפחתיות, הון עצמי)"
      ]
    },
    {
      step: "03",
      title: "החזרת הכסף האבוד הביתה",
      subtitle: "מנקים כפילויות, מורידים עלויות ומחזירים את הכסף שלכם אליכם לחשבון",
      desc: "אני מנתח לעומק את כל העלויות השקופות שנשרפות לכם מתחת לאף, ומכווין אתכם צעד-צעד בדיוק מה לבטל, מה להוזיל ומה לדרוש מהבנקים וחברות הביטוח: כפילויות ביטוח מיותרות, ריביות ודמי ניהול מנופחים, ופנסיות שלא מותאמות לכם. אתם מבצעים – אני המצפן.",
      icon: TrendingUp,
      deliverables: [
        "ביטול כפילויות ביטוח ועמלות מנופחות (חיסכון מיידי של מאות שקלים בחודש)",
        "אופטימיזציה יסודית של דמי ניהול פנסיוניים שתתורגם למאות אלפי שקלים בעתיד",
        "הכוונה לניצול מלא של הטבות מס, החזרים וזכויות פיננסיות ייחודיות שמגיעות לכם"
      ]
    },
    {
      step: "04",
      title: "אוטומציה לשקט נפשי קבוע",
      subtitle: "מקימים מנגנונים אוטומטיים שמבטיחים יציבות ועושר לאורך שנים",
      desc: "הפיכת ההתנהלות הפיננסית החדשה לטבע שני ופשוט שלא דורש מכם שום מאמץ יומיומי. אני עוזר לכם להקים מנגנוני חיסכון והשקעה אוטומטיים לחלוטין בשיטת 'שגר ושכח', ומלווה אתכם באופן אישי ובקרה תקופתית כדי לוודא שאתם דוהרים קדימה בביטחון, שלווה ושליטה מלאה.",
      icon: ShieldCheck,
      deliverables: [
        "מערך הוראות קבע ומנגנוני השקעה אוטומטיים שמייצרים הון באופן פסיבי",
        "בנייה וביסוס של קרן חירום יציבה שמבטלת לחלוטין את החרדה מהוצאות מפתיעות",
        "פגישות בקרה אישיות איתי ששומרות עליכם ממוקדים, בטוחים ובמסלול המהיר לעושר"
      ]
    }
  ];

  // Objection-Busting FAQs with warm, empathetic and reassuring answers
  const faqData = [
    {
      q: "האם תכנון פיננסי אומר שנצטרך להצטמצם ולוותר על איכות החיים והנאות ההווה?",
      a: "ממש לא! אני מתנגד לחלוטין לסגפנות, קיצוצים דרקוניים או ויתור על ההנאות שלכם. המטרה שלי היא להוביל אתכם לרווחה, איזון ושקט נפשי אמיתי. אני אעזור לכם לבנות תקציב חכם שמגדיר מראש תקציב לבילויים, מסעדות, חופשות וכוס הקפה של הבוקר – כדי שתוכלו ליהנות מהם בלב שלם ובלי רגשות אשם, ובמקביל אדאג שהכסף שלכם ינותב נכון לעתיד."
    },
    {
      q: "מה אם מספרים, בירוקרטיה ואקסלים עושים לי כאב ראש וחרדה?",
      a: "זה בדיוק הסיבה שאני כאן! אתם ממש לא צריכים לאהוב מספרים או להבין בכלכלה. הליווי שלי מבוסס על פישוט של עולם הכספים המסובך והפיכתו לנגיש, בהיר ובגובה העיניים. אני מפשט עבורכם את החישובים והניתוחים, מכווין אתכם בדיוק מה לבדוק ומה לבקש מכל גוף פיננסי, ומציג לכם רק את השורה התחתונה ואת הצעדים המעשיים והקלים ביותר לביצוע."
    },
    {
      q: "האם חובה ששני בני הזוג ישתתפו בתהליך הליווי?",
      a: "מומלץ מאוד להגיע יחד, כיוון שתכנון פיננסי ושינוי הרגלים משפחתיים עובדים הכי טוב כשיש שיתוף פעולה, שפה משותפת והסכמה הדדית. עם זאת, אם אחד מבני הזוג עסוק מאוד או נמנע מכך בהתחלה, אפשר בהחלט להתחיל את הדרך עם בן הזוג היוזם. לעיתים קרובות, כשרואים את השקט והסדר שהתהליך מייצר בבית, בן הזוג השני מצטרף בשמחה רבה בהמשך."
    },
    {
      q: "מה ההבדל בינך לבין יועצי השקעות או סוכני ביטוח בבנק ובחברות הביטוח?",
      a: "ההבדל הוא דרמטי והוא טמון באובייקטיביות מוחלטת של 100%. יועצים בבנקים או סוכנים בחברות הביטוח הם אנשי מכירות המייצגים את הגופים הפיננסיים ומקבלים עמלות שונות על המוצרים שהם מוכרים לכם. אני, לעומת זאת, עובד אך ורק בשבילכם. אין לי מוצרים פיננסיים למכור לכם ואין לי שום אינטרס נסתר – שכר הטרחה שלי משולם ישירות על ידכם, מה שמבטיח המלצות נקיות ואובייקטיביות שחוסכות לכם מאות אלפי שקלים במצטבר."
    },
    {
      q: "האם השירות שלך מתאים לנו גם אם אנחנו לא מרוויחים משכורות עתק?",
      a: "בהחלט כן. הליווי שלי מותאם בדיוק למשפחות צעירות, זוגות ובעלי מקצועות חופשיים (בני 25-38). המטרה שלי היא לא לנהל הון קיים של מיליונים, אלא לעזור לכם לעשות סדר בתזרים החודשי השוטף, לסגור את 'החורים השקופים', ולבנות את יסודות הביטחון הכלכלי שלכם קדימה. ככל שמתחילים מוקדם יותר, כך כוחו של התכנון והחיסכון החכם גדול בהרבה."
    }
  ];

  const handleNextStep = () => {
    setActiveStep((prev) => (prev + 1) % roadmapSteps.length);
  };

  const handlePrevStep = () => {
    setActiveStep((prev) => (prev - 1 + roadmapSteps.length) % roadmapSteps.length);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 90;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const offsetPosition = (elementRect - bodyRect) - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col overflow-hidden">
      
      {/* 1. HERO SECTION (The Magnetic Hook) */}
      <section className="relative sm:min-h-[92vh] flex items-center justify-center overflow-hidden bg-[#2E4A43] pt-32 sm:pt-48 pb-14 sm:pb-32">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-[#C9AA67]/15 rounded-full blur-[140px] translate-x-1/4 -translate-y-1/4 animate-pulse duration-5000" />
          <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-[#6C8A7A]/25 rounded-full blur-[140px] -translate-x-1/4 translate-y-1/4" />
          
          {/* subtle logo watermark */}
          <div className="absolute top-1/2 left-10 -translate-y-1/2 opacity-5 pointer-events-none hidden lg:block">
            <KrigelLogo className="w-[450px] h-[450px]" light={true} />
          </div>

          <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#C9AA67_1.5px,transparent_1.5px)] [background-size:24px_24px]" />
          <img 
            src="https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=1800" 
            alt="תכנון פיננסי למשפחות" 
            className="w-full h-full object-cover opacity-20 mix-blend-overlay"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#2E4A43]/95 via-[#2E4A43]/90 to-[#2E4A43]" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Left Content */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-right lg:col-span-8 flex flex-col justify-center"
            >
              {/* Welcoming, modern visual introduction element combined with a warm, personal layout */}
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-8 bg-white/5 border border-white/10 rounded-[2rem] p-4 sm:p-5 backdrop-blur-sm self-start w-full sm:w-auto">
                <TomerImage size="md" className="shrink-0" />
                <div className="space-y-1.5 text-center sm:text-right">
                  <span className="text-[#C9AA67] font-heading font-extrabold text-xs tracking-wider uppercase bg-[#C9AA67]/10 px-3 py-1 rounded-full border border-[#C9AA67]/20 inline-block">
                    היי, אני תומר 👋
                  </span>
                  <p className="text-[#F3E9DD]/90 text-sm sm:text-base font-light leading-relaxed">
                    בלי הרצאות ובלי אקסלים מפחידים. רק סדר, בהירות ותוכנית שעובדת.
                  </p>
                </div>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-semibold text-white leading-[1.15] tracking-tight py-4 sm:py-6 mt-2">
                אתם מרוויחים יפה. <br />
                <span className="text-[#C9AA67]">אז למה בסוף החודש זה לא מרגיש ככה?</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-[#F3E9DD]/85 max-w-2xl font-light leading-relaxed mb-10 sm:mb-12">
                ליווי פיננסי אישי 1:1 שעושה סדר, מחזיר הביתה כסף אבוד ובונה עתיד – בלי לוותר על הקפה, המסעדות והחופשות. בלי שיפוטיות. בלי סגפנות. בגובה העיניים.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <button 
                  onClick={() => scrollToSection("contact")}
                  className="bg-[#C9AA67] hover:bg-[#B39352] text-white px-8 py-4 rounded-xl font-heading font-bold text-base sm:text-lg shadow-lg shadow-[#C9AA67]/20 hover:shadow-xl hover:shadow-[#C9AA67]/30 transition-all duration-300 transform hover:-translate-y-0.5 text-center cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>לשיחת אבחון חינם</span>
                  <Zap size={16} className="text-white animate-pulse" />
                </button>
                <button 
                  onClick={() => scrollToSection("myths")}
                  className="bg-white/5 hover:bg-white/10 backdrop-blur-md text-[#F3E9DD] border border-[#F3E9DD]/20 px-8 py-4 rounded-xl font-heading font-bold text-base sm:text-lg transition-all cursor-pointer text-center"
                >
                  מיתוס או עובדה? ←
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-8 border-t border-white/5 hidden sm:flex flex-wrap gap-x-8 gap-y-4 items-center text-xs text-[#F3E9DD]/70">
                 <span className="font-heading font-bold text-[#C9AA67] uppercase tracking-wider">למה איתי?</span>
                 <div className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-[#C9AA67]" /> 100% אובייקטיביות (ללא מכירת מוצרים)</div>
                 <div className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-[#C9AA67]" /> שיטה ממוקדת ללא חנק פיננסי</div>
                 <div className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-[#C9AA67]" /> ליווי אישי וקבוע בגובה העיניים</div>
              </div>
            </motion.div>

            {/* Hero Right Trust Card (Personalized Headshot & Branding) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-4 hidden lg:flex flex-col items-center justify-center bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-md relative overflow-hidden text-center space-y-5"
            >
              <div className="absolute top-4 left-4 text-[10px] font-heading font-bold text-[#C9AA67]/40 tracking-widest">
                EST. 2018
              </div>
              <div className="absolute top-4 right-4 opacity-30">
                <KrigelLogo className="w-8 h-8" light={true} />
              </div>
              
              <TomerImage size="lg" className="mt-4" />
              
              <div className="space-y-1.5 z-10">
                <h3 className="text-xl font-heading font-extrabold text-white tracking-tight">תומר קריגל</h3>
                <p className="text-xs font-heading font-bold text-[#C9AA67] tracking-wider uppercase">מתכנן פיננסי אישי לכלכלת המשפחה</p>
                <p className="text-xs text-[#F3E9DD]/65 font-light leading-relaxed max-w-[240px] mx-auto">
                  "אני עוזר לכם להחזיר את השליטה על התזרים החודשי, בלי לוותר על מה שעושה לכם טוב בהווה."
                </p>
              </div>

              {/* Trust Metric pill */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#C9AA67]/10 border border-[#C9AA67]/20 text-xs text-[#C9AA67] font-bold">
                <Award size={12} />
                <span>ליווי מקצועי 100% אובייקטיבי</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. THE "RELATABLE PAIN" SECTION (Agitation & Empathy) */}
      <section id="pain" className="py-14 sm:py-24 bg-white relative overflow-hidden border-b border-[#A89C8A]/20">
        <div className="absolute top-1/4 right-0 w-80 h-80 bg-[#F3E9DD]/30 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-[#C9AA67]/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div 
            {...fadeInUp}
            className="text-center mb-16 space-y-4"
          >
            <span className="text-[#C9AA67] font-heading font-bold tracking-[0.2em] uppercase text-xs sm:text-sm block">נשמע מוכר?</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-[#2E4A43] leading-tight tracking-tight">
              זו לא בעיה של הכנסה. זו בעיה של שיטה.
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-base sm:text-lg font-light leading-relaxed">
              אם אחד מהמשפטים האלה גורם לכם להנהן – אתם בדיוק במקום הנכון. וזו לא אשמתכם: פשוט אף אחד לא לימד אתכם את זה.
            </p>
          </motion.div>

          {/* Bento Grid layout for Pain Points */}
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            
            {/* Pain Point 1: The Leaking Bucket */}
            <motion.div 
              {...fadeInUp}
              className="bg-[#F3E9DD]/30 border border-[#A89C8A]/20 p-8 rounded-[2rem] hover:shadow-xl hover:border-[#C9AA67]/40 transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-600 flex items-center justify-center">
                  <AlertCircle size={24} />
                </div>
                <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-[#2E4A43]">החשבון מתאפס. בלי הסבר.</h3>
                <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-light">
                  הכנסה יפה נכנסת בתחילת החודש – ובסופו פשוט לא נשאר כלום. אין דרמה גדולה, אין קנייה חריגה. הכסף פשוט... נעלם.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#A89C8A]/10 text-xs sm:text-sm text-[#C9AA67] font-bold font-heading">
                "אנחנו עובדים קשה מדי בשביל שלא יישאר כלום."
              </div>
            </motion.div>

            {/* Pain Point 2: Relationship Stress */}
            <motion.div 
              {...fadeInUp}
              className="bg-[#F3E9DD]/30 border border-[#A89C8A]/20 p-8 rounded-[2rem] hover:shadow-xl hover:border-[#C9AA67]/40 transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-600 flex items-center justify-center">
                  <Users size={24} />
                </div>
                <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-[#2E4A43]">הכסף הפך לנושא רגיש בבית</h3>
                <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-light">
                  כל שיחה על הוצאות נגמרת במתח. במקום שהכסף ישרת את הזוגיות – הוא הפך לנושא שעוקפים אותו בזהירות.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#A89C8A]/10 text-xs sm:text-sm text-[#C9AA67] font-bold font-heading">
                "נמאס לנו להרגיש כמו שוטרים אחד של השני."
              </div>
            </motion.div>

            {/* Pain Point 3: Future Anxiety */}
            <motion.div 
              {...fadeInUp}
              className="bg-[#F3E9DD]/30 border border-[#A89C8A]/20 p-8 rounded-[2rem] hover:shadow-xl hover:border-[#C9AA67]/40 transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-600 flex items-center justify-center">
                  <Target size={24} />
                </div>
                <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-[#2E4A43]">הילדים גדלים. החיסכון לא.</h3>
                <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-light">
                  דירה, חוגים, לימודים, פנסיה – הכל מרגיש רחוק, למרות שההכנסה דווקא טובה. השנים עוברות ואתם דורכים במקום.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#A89C8A]/10 text-xs sm:text-sm text-[#C9AA67] font-bold font-heading">
                "איך נעזור לילדים אם אנחנו לא מצליחים לחסוך?"
              </div>
            </motion.div>

            {/* Pain Point 4: Leaks & Ignorance */}
            <motion.div 
              {...fadeInUp}
              className="bg-[#F3E9DD]/30 border border-[#A89C8A]/20 p-8 rounded-[2rem] hover:shadow-xl hover:border-[#C9AA67]/40 transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-600 flex items-center justify-center">
                  <PieChart size={24} />
                </div>
                <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-[#2E4A43]">ה'חורים השקופים' עולים לכם אלפים</h3>
                <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-light">
                  כפל ביטוחים, דמי ניהול מנופחים, מנויים ששכחתם. שקל ועוד שקל – ובסוף השנה זה סכום שהיה יכול להיות חופשה משפחתית.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#A89C8A]/10 text-xs sm:text-sm text-[#C9AA67] font-bold font-heading">
                "חבל על כל שקל שהולך לבנקים במקום למשפחה."
              </div>
            </motion.div>

          </div>

          {/* Empathy Statement Callout block */}
          <motion.div 
            {...fadeInUp}
            className="mt-16 bg-[#2E4A43] text-white rounded-[2.5rem] p-8 md:p-12 shadow-xl relative overflow-hidden text-center border border-[#C9AA67]/30"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#C9AA67_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-10" />
            <span className="text-[#C9AA67] font-heading font-bold text-xs uppercase tracking-wider block mb-2">שחררו את רגשות האשם</span>
            <h3 className="text-2xl sm:text-3xl font-heading font-extrabold max-w-2xl mx-auto leading-snug">
              לגופים הפיננסיים משתלם שזה ירגיש מסובך. <br className="hidden sm:inline" /> התפקיד שלי הוא להפוך את זה לפשוט.
            </h3>
            <p className="text-[#F3E9DD]/80 text-sm sm:text-base font-light max-w-2xl mx-auto mt-4 leading-relaxed">
              שיטה אחת פשוטה, שפה ברורה, וההגה עובר אליכם.
            </p>
          </motion.div>
        </div>
      </section>


      {/* 2.5 MYTH OR FACT (light interactive section) */}
      <section id="myths" className="py-14 sm:py-24 relative overflow-hidden bg-[#1B322C]">
        <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(#C9AA67_1.5px,transparent_1.5px)] [background-size:24px_24px]" />
        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
          <span className="text-[#C9AA67] font-heading font-bold uppercase text-xs sm:text-sm block tracking-[0.2em] mb-3">בואו נעשה רגע סדר</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold leading-tight tracking-tight text-white mb-4">
            מיתוס או עובדה?
          </h2>
          <p className="max-w-2xl mx-auto text-base sm:text-lg font-light leading-relaxed mb-8 sm:mb-12 text-[#F3E9DD]/70">
            כמה אמונות על כסף שכדאי לבדוק מחדש. לחצו על קלף כדי להפוך אותו.
          </p>

          <div className="grid sm:grid-cols-2 gap-3 sm:gap-5">
            {mythCards.map((card, i) => {
              const isFlipped = !!flippedMyths[i];
              return (
                <button
                  key={i}
                  onClick={() => setFlippedMyths((f) => ({ ...f, [i]: !f[i] }))}
                  className={`text-right rounded-[2rem] p-5 sm:p-8 transition-all duration-300 cursor-pointer group relative overflow-hidden min-h-[120px] backdrop-blur-sm border ${
                    isFlipped ? "bg-[#C9AA67]/10 border-[#C9AA67]" : "bg-white/[0.04] border-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`font-heading font-black text-xs tracking-widest uppercase px-3 py-1 rounded-full transition-colors duration-300 ${
                      isFlipped ? "text-[#1B322C] bg-[#C9AA67]" : "text-[#F3E9DD]/60 bg-white/10"
                    }`}>
                      {isFlipped ? "✓ העובדה" : "✗ המיתוס"}
                    </span>
                    <span className="text-xs font-light text-[#F3E9DD]/40">
                      {isFlipped ? "לחצו לחזרה" : "לחצו לגילוי"}
                    </span>
                  </div>
                  <p className={`font-heading text-lg sm:text-xl leading-snug transition-all duration-300 ${
                    isFlipped ? "text-[#F3E9DD] font-bold" : "text-white/85 font-semibold"
                  }`}>
                    {isFlipped ? card.fact : `"${card.myth}"`}
                  </p>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => scrollToSection("contact")}
            className="mt-8 sm:mt-12 bg-[#C9AA67] hover:bg-[#B59655] text-white px-10 py-4 rounded-xl font-heading font-bold text-base sm:text-lg shadow-lg transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
          >
            יש לכם עוד שאלות? בואו נדבר ←
          </button>
        </div>
      </section>

      {/* 3. THE SOLUTION & PHILOSOPHY (The Epiphany) */}
      <section id="philosophy" className="py-14 sm:py-24 bg-[#F3E9DD]/15 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-[#C9AA67]/5 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Epiphany Left Side (Tomer's Story & Headshot) */}
            <motion.div 
              {...fadeInUp}
              className="lg:col-span-5 relative flex flex-col items-center"
            >
              <div className="w-full bg-[#2E4A43] rounded-[2.5rem] p-8 text-white flex flex-col items-center justify-between shadow-2xl relative overflow-hidden border border-[#A89C8A]/20 text-center">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#C9AA67_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-10" />
                <div className="absolute -bottom-10 -right-10 w-52 h-52 bg-[#C9AA67]/20 rounded-full blur-2xl" />
                
                <div className="relative z-10 flex flex-col items-center space-y-4 w-full">
                  <span className="text-[#C9AA67] font-heading font-black text-xs tracking-widest uppercase">נעים להכיר 👋</span>
                  
                  <TomerImage size="xl" showBadge={false} />
                  
                  <div className="space-y-1">
                    <h3 className="text-2xl font-heading font-extrabold text-white">תומר קריגל</h3>
                    <p className="text-xs text-[#C9AA67] font-heading font-bold tracking-wider">מתכנן פיננסי בגובה העיניים</p>
                  </div>
                </div>

                <div className="space-y-4 relative z-10 pt-6 mt-6 border-t border-white/10 w-full text-right">
                  <p className="text-[#F3E9DD]/85 text-sm sm:text-base font-light leading-relaxed">
                    "היי, אני תומר. אני לא מאמין בטבלאות אקסל מסובכות, קיצוצים דרקוניים או בנזיפות על כוס הקפה שקניתם בבוקר. באתי לעזור לכם לעשות סדר אמיתי בכסף שלכם, בפשטות ובגובה העיניים. המטרה שלי היא להראות לכם שאפשר ליהנות מהחיים כאן ועכשיו – ובו זמנית לבנות ביטחון כלכלי חזק קדימה, בשבילכם ובשביל המשפחה שלכם. הכל קורה בשיחה פתוחה, בלי שיפוטיות ובאובייקטיביות מוחלטת."
                  </p>
                  <div className="flex justify-center items-center gap-3 text-[#C9AA67] text-xs font-heading font-bold tracking-wider pt-2">
                    <span>שירות בגובה העיניים</span>
                    <span>•</span>
                    <span>100% אובייקטיביות</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Epiphany Right Side (Benefits Copy) */}
            <motion.div 
              {...fadeInUp}
              className="lg:col-span-7 space-y-6 text-right"
            >
              <span className="text-[#C9AA67] font-heading font-bold tracking-widest uppercase text-xs sm:text-sm block">איך אני משנה לכם את המציאות הכלכלית?</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-[#2E4A43] leading-tight tracking-tight">
                הגישה של קריגל: תכנון פיננסי בגובה העיניים
              </h2>
              <p className="text-base sm:text-lg text-slate-600 font-light leading-relaxed">
                שכחו מ'כלכלת המשפחה' הישנה של קיצוצים ונזיפות. תכנון נכון הוא לא ויתור על ההווה – הוא הדרך ליהנות ממנו בלב שקט, כשאתם יודעים שהעתיד מטופל.
              </p>

              {/* Unique Differentiators Grid */}
              <div className="grid sm:grid-cols-3 gap-4 pt-6">
                
                {/* Value 1 */}
                <div className="p-5 rounded-2xl bg-white border border-[#A89C8A]/15 shadow-sm space-y-2">
                  <Heart className="text-[#C9AA67]" size={22} />
                  <h4 className="font-heading font-extrabold text-[#2E4A43] text-sm sm:text-base">ליווי אישי 1:1 מולי</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-light">אתם עובדים ישירות מולי לאורך כל הדרך. ללא עובדים זוטרים או פלסטרים זמניים.</p>
                </div>

                {/* Value 2 */}
                <div className="p-5 rounded-2xl bg-white border border-[#A89C8A]/15 shadow-sm space-y-2">
                  <ShieldCheck className="text-[#C9AA67]" size={22} />
                  <h4 className="font-heading font-extrabold text-[#2E4A43] text-sm sm:text-base">אובייקטיביות מוחלטת שלי</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-light">אני לא מוכר מוצרים של בנקים או ביטוחים, אלא מייצג אך ורק את האינטרס הטהור שלכם.</p>
                </div>

                {/* Value 3 */}
                <div className="p-5 rounded-2xl bg-white border border-[#A89C8A]/15 shadow-sm space-y-2">
                  <Users className="text-[#C9AA67]" size={22} />
                  <h4 className="font-heading font-extrabold text-[#2E4A43] text-sm sm:text-base">זמינות ישירה אלי בטלפון</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-light">אין מרכזיות או מזכירות – יש לכם קו פתוח ישירות אלי לכל שאלה, התלבטות או החלטה פיננסית.</p>
                </div>

              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. THE INTERACTIVE ROADMAP (The 4-Step Methodology) */}
      <section id="process" className="py-14 sm:py-24 bg-white relative overflow-hidden border-t border-b border-[#A89C8A]/20">
        <div className="absolute top-0 right-10 w-96 h-96 bg-[#F3E9DD]/30 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-[#C9AA67]/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div 
            {...fadeInUp}
            className="text-center mb-16 space-y-4"
          >
            <span className="text-[#C9AA67] font-heading font-bold tracking-[0.2em] uppercase text-xs sm:text-sm block">איך זה עובד בפועל?</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-[#2E4A43] leading-tight tracking-tight">
              המסלול שלכם לשקט פיננסי יציב ומהיר
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-base sm:text-lg font-light leading-relaxed">
              אני הופך את הבלבול והבירוקרטיה הפיננסית למסע מרתק וברור ב-4 צעדים פשוטים. לחצו על השלבים כדי לראות מה תקבלו בכל אחד מהם.
            </p>
          </motion.div>

          {/* Interactive Steps Progression Navigation Track */}
          <div className="relative max-w-4xl mx-auto mb-12">
            
            {/* Line connecting the steps */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 -translate-y-1/2 z-0 rounded-full hidden md:block" />
            <div 
              className="absolute top-1/2 right-0 h-1 bg-[#C9AA67] -translate-y-1/2 z-0 rounded-full transition-all duration-500 hidden md:block"
              style={{ 
                left: `${100 - (activeStep / (roadmapSteps.length - 1)) * 100}%`
              }}
            />

            <div className="relative z-10 grid grid-cols-4 gap-2 md:gap-4 text-center">
              {roadmapSteps.map((item, idx) => {
                const isActive = activeStep === idx;
                const IconComponent = item.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveStep(idx)}
                    className="flex flex-col items-center focus:outline-none group cursor-pointer"
                  >
                    <div 
                      className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                        isActive 
                          ? "bg-[#2E4A43] border-[#C9AA67] text-[#C9AA67] scale-110 shadow-lg shadow-[#C9AA67]/20" 
                          : "bg-white border-slate-200 text-slate-400 group-hover:border-[#C9AA67] group-hover:text-[#C9AA67]"
                      }`}
                    >
                      <IconComponent size={isActive ? 24 : 18} className="transition-transform duration-300 group-hover:rotate-12" />
                    </div>
                    <span 
                      className={`mt-3 font-heading font-extrabold text-[11px] sm:text-sm tracking-tight transition-colors duration-300 hidden sm:block ${
                        isActive ? "text-[#2E4A43]" : "text-slate-400 group-hover:text-[#2E4A43]"
                      }`}
                    >
                      {item.title.split(" (")[0]}
                    </span>
                    <span className={`mt-1 text-[10px] font-heading font-black text-[#C9AA67] sm:hidden ${isActive ? "opacity-100" : "opacity-50"}`}>
                      צעד {item.step}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Step Content Display Card with AnimatePresence */}
          <div className="max-w-4xl mx-auto bg-[#F3E9DD]/20 border border-[#A89C8A]/25 rounded-[2.5rem] p-6 sm:p-10 shadow-lg relative min-h-[420px] flex flex-col justify-between">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Header of Card */}
                <div className="flex justify-between items-start border-b border-[#A89C8A]/15 pb-6">
                  <div>
                    <span className="text-[#C9AA67] font-heading font-black text-xs sm:text-sm uppercase tracking-widest block mb-1">
                      שלב {roadmapSteps[activeStep].step} מתוך 4
                    </span>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-heading font-extrabold text-[#2E4A43]">
                      {roadmapSteps[activeStep].title}
                    </h3>
                    <p className="text-[#C9AA67] text-sm sm:text-base font-semibold mt-1">
                      {roadmapSteps[activeStep].subtitle}
                    </p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-[#2E4A43] border border-[#C9AA67] text-[#C9AA67] flex items-center justify-center shrink-0 shadow-md">
                    {React.createElement(roadmapSteps[activeStep].icon, { size: 24 })}
                  </div>
                </div>

                {/* Description Text */}
                <p className="text-slate-600 text-sm sm:text-base font-light leading-relaxed">
                  {roadmapSteps[activeStep].desc}
                </p>

                {/* High-Value Deliverables Checklist */}
                <div className="space-y-3 bg-white/60 p-5 rounded-2xl border border-[#A89C8A]/10">
                  <h4 className="text-[#2E4A43] font-heading font-bold text-xs sm:text-sm tracking-wider uppercase mb-1">
                    ✦ מה תקבלו ותרוויחו בשלב הזה בפועל:
                  </h4>
                  <ul className="grid sm:grid-cols-1 gap-3">
                    {roadmapSteps[activeStep].deliverables.map((del, dIdx) => (
                      <li key={dIdx} className="flex items-start gap-2 text-slate-700 text-xs sm:text-sm leading-snug">
                        <CheckCircle2 size={16} className="text-[#C9AA67] shrink-0 mt-0.5" />
                        <span>{del}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Stepper Navigation Buttons */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-[#A89C8A]/15">
              <button
                onClick={handlePrevStep}
                className="flex items-center gap-2 text-xs sm:text-sm font-heading font-extrabold text-slate-500 hover:text-[#C9AA67] transition-colors cursor-pointer"
              >
                <span>« שלב קודם</span>
              </button>
              <div className="flex gap-1.5">
                {roadmapSteps.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveStep(idx)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      activeStep === idx ? "w-6 bg-[#C9AA67]" : "bg-slate-300"
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={handleNextStep}
                className="flex items-center gap-2 text-xs sm:text-sm font-heading font-extrabold text-[#C9AA67] hover:text-[#2E4A43] transition-colors cursor-pointer"
              >
                <span>שלב הבא »</span>
              </button>
            </div>
          </div>

          {/* Interactive CTA to tie step to contact */}
          <div className="text-center mt-12">
            <button
              onClick={() => scrollToSection("contact")}
              className="bg-[#2E4A43] hover:bg-[#203631] text-[#F3E9DD] border border-[#C9AA67] px-8 py-4 rounded-xl font-heading font-bold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              בואו נתחיל לעשות סדר ←
            </button>
          </div>
        </div>
      </section>

      {/* 5. OBJECTION-BUSTING FAQ (Reassurance) */}
      <section id="faq" className="py-14 sm:py-24 bg-[#F3E9DD]/10 relative overflow-hidden border-b border-[#A89C8A]/20">
        <div className="absolute top-1/3 left-0 w-72 h-72 bg-[#F3E9DD]/30 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-10 right-0 w-80 h-80 bg-[#C9AA67]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <motion.div 
            {...fadeInUp}
            className="text-center mb-16 space-y-4"
          >
            <span className="text-[#C9AA67] font-heading font-bold tracking-widest uppercase text-xs sm:text-sm block">עונים על כל החששות והשאלות שלכם</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-[#2E4A43] leading-tight tracking-tight">
              שאלות נפוצות ותשובות שיעשו לכם שקט
            </h2>
            <p className="text-slate-600 font-light max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
              אני מאמין בשקיפות, פשטות ואפס שיפוטיות. הנה כל מה שחשוב לדעת רגע לפני שלוקחים אחריות על העתיד הכלכלי שלכם.
            </p>
          </motion.div>
          
          <div className="space-y-4">
            {faqData.map((item, i) => {
              const isOpen = activeFaq === i;
              return (
                <motion.div 
                  key={i}
                  {...fadeInUp}
                  transition={{ delay: i * 0.05 }}
                  className={`rounded-[2rem] border transition-all duration-300 hover:-translate-y-[2px] ${
                    isOpen 
                      ? 'border-[#C9AA67] bg-white shadow-xl shadow-[#C9AA67]/5' 
                      : 'border-[#A89C8A]/20 bg-white/60 hover:bg-white hover:shadow-md'
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(i)}
                    className="w-full px-6 py-5 flex items-center justify-between text-right font-heading font-extrabold text-base sm:text-lg text-[#2E4A43] focus:outline-none cursor-pointer"
                  >
                    <span className="pl-4 leading-snug">{item.q}</span>
                    <div className={`w-8 h-8 rounded-xl bg-[#2E4A43]/5 flex items-center justify-center shrink-0 border border-[#A89C8A]/10 shadow-sm transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-[#C9AA67] bg-[#2E4A43]' : 'text-[#2E4A43]'
                    }`}>
                      <ChevronDown size={18} />
                    </div>
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-in-out overflow-hidden ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-6 pb-6 pt-2 text-slate-600 text-sm sm:text-base leading-relaxed font-light border-t border-[#A89C8A]/10">
                        {item.a}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. HIGH-CONVERTING LEAD GENERATION AREA (The Closing CTA) */}
      <section id="contact" className="py-14 sm:py-24 bg-[#F3E9DD]/35 border-t border-[#A89C8A]/20 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C9AA67]/5 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="bg-[#2E4A43] rounded-[3rem] overflow-hidden relative shadow-2xl border border-white/10">
            <div className="absolute inset-0 bg-gradient-to-r from-[#2E4A43] via-[#2E4A43]/95 to-[#C9AA67]/10" />
            
            <div className="relative z-10 grid lg:grid-cols-12 gap-12 p-8 sm:p-12 md:p-16 items-center">
              
              {/* Lead Gen Info Left Column */}
              <div className="lg:col-span-6 space-y-6 text-right">
                <span className="text-[#C9AA67] font-heading font-bold text-xs sm:text-sm tracking-widest uppercase block">הצעד הראשון שלכם מתחיל כאן</span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-white leading-tight">
                  הצעד הראשון לוקח 20 דקות ✦
                </h2>
                <p className="text-[#F3E9DD]/80 text-base sm:text-lg font-light leading-relaxed">
                  שיחת אבחון קצרה, חינם ובלי לחץ. נכיר, נזהה יחד את שלושת 'החורים השקופים' הגדולים שלכם – ותצאו ממנה עם תובנה אחת שווה, גם אם לא נמשיך יחד.
                </p>
                
                <div className="space-y-4 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-3 text-[#F3E9DD]/90">
                    <div className="w-6 h-6 rounded-full bg-[#C9AA67] text-[#2E4A43] flex items-center justify-center text-xs font-bold shrink-0">✓</div>
                    <span className="text-sm sm:text-base font-medium">שיחה ידידותית ואמפתית (ללא שום דחיפה או מניפולציות)</span>
                  </div>
                  <div className="flex items-center gap-3 text-[#F3E9DD]/90">
                    <div className="w-6 h-6 rounded-full bg-[#C9AA67] text-[#2E4A43] flex items-center justify-center text-xs font-bold shrink-0">✓</div>
                    <span className="text-sm sm:text-base font-medium">מיפוי מיידי של המקומות שבהם הכסף שלכם הולך לאיבוד</span>
                  </div>
                  <div className="flex items-center gap-3 text-[#F3E9DD]/90">
                    <div className="w-6 h-6 rounded-full bg-[#C9AA67] text-[#2E4A43] flex items-center justify-center text-xs font-bold shrink-0">✓</div>
                    <span className="text-sm sm:text-base font-medium">הבנה בסיסית של הפוטנציאל לחסכון פיננסי חודשי</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 hidden sm:flex flex-col sm:flex-row items-center gap-4 text-right">
                  <TomerImage size="md" className="shrink-0" showBadge={false} />
                  <div>
                    <p className="text-xs text-[#F3E9DD]/80 italic font-light leading-relaxed">
                      "אני מבטיח לכם שיחה חברית, בגובה העיניים, שתשנה לכם את אופן החשיבה על כסף – ב-100% אובייקטיביות ובאחריות אישית שלי."
                    </p>
                    <strong className="text-[#C9AA67] font-heading font-extrabold text-xs block mt-1.5">
                      תומר קריגל, מתכנן פיננסי אישי
                    </strong>
                  </div>
                </div>
              </div>
              
              {/* Lead Gen Form Right Column */}
              <div className="lg:col-span-6">
                <div className="bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-2xl border border-slate-100 text-right">
                  {formSubmitted ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-12 space-y-4"
                    >
                      <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                        <Check size={36} className="text-[#C9AA67] stroke-[3]" />
                      </div>
                      <h3 className="text-2xl font-heading font-extrabold text-[#2E4A43]">הפרטים התקבלו בהצלחה!</h3>
                      <p className="text-slate-500 font-light max-w-sm mx-auto leading-relaxed">
                        תודה רבה, {formData.name || "שלכם"}. אחזור אליכם לתיאום שיחת האבחון במתנה בהקדם האפשרי. אני כבר מצפה לדבר איתכם!
                      </p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                      <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-[#2E4A43] text-center mb-6">שיחה אחת. בלי התחייבות. הרבה בהירות.</h3>
                      
                      {/* Name input */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-heading font-extrabold text-slate-400 uppercase tracking-wider mr-1">שם מלא שלכם</label>
                        <input 
                          type="text" 
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="ישראל וישראלה ישראלי" 
                          className="w-full px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[#2E4A43] placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#C9AA67] focus:border-[#C9AA67] transition-all text-sm font-light text-right" 
                        />
                      </div>
                      
                      {/* Phone input */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-heading font-extrabold text-slate-400 uppercase tracking-wider mr-1">מספר טלפון ליצירת קשר</label>
                        <input 
                          type="tel" 
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="050-0000000" 
                          className="w-full px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[#2E4A43] placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#C9AA67] focus:border-[#C9AA67] transition-all text-sm font-light text-right" 
                          dir="ltr"
                        />
                      </div>

                      {/* Dropdown challenge selector */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-heading font-extrabold text-slate-400 uppercase tracking-wider mr-1">מה האתגר הפיננסי המרכזי שלכם?</label>
                        <select 
                          value={formData.challenge}
                          onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                          className="w-full px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[#2E4A43] focus:outline-none focus:ring-2 focus:ring-[#C9AA67] focus:border-[#C9AA67] transition-all text-sm font-light appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%232E4A43%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:16px_16px] bg-[left_16px_center] bg-no-repeat text-right pr-5"
                        >
                          <option>הכסף נעלם ולא ברור לאן</option>
                          <option>רוצים לייצר סדר ותקציב חכם בלי סגפנות</option>
                          <option>רוצים לחסוך נכון ובטוח לעתיד הילדים</option>
                          <option>מיפוי, הוזלת ביטוחים ואופטימיזציית פנסיה</option>
                          <option>אחר / שילוב של מספר דברים</option>
                        </select>
                      </div>

                      {/* Custom input if they chose "אחר" */}
                      {formData.challenge.includes("אחר") && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="space-y-1.5"
                        >
                          <label className="text-[11px] font-heading font-extrabold text-slate-400 uppercase tracking-wider mr-1">ספרו לי קצת יותר (אופציונלי)</label>
                          <input 
                            type="text" 
                            value={formData.customChallenge}
                            onChange={(e) => setFormData({ ...formData, customChallenge: e.target.value })}
                            placeholder="למשל: תכנון רכישת דירה בקרוב..." 
                            className="w-full px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[#2E4A43] placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#C9AA67] focus:border-[#C9AA67] transition-all text-sm font-light text-right" 
                          />
                        </motion.div>
                      )}

                      <button 
                        type="submit" 
                        className="w-full bg-[#C9AA67] hover:bg-[#B59655] text-white py-4 rounded-xl font-heading font-bold text-base transition-all shadow-lg hover:shadow-[#C9AA67]/20 flex items-center justify-center gap-2 mt-4 cursor-pointer"
                      >
                        <MessageSquare size={18} className="text-white" />
                        שריינו לי שיחת אבחון חינם
                      </button>

                      {/* Privacy reassurance */}
                      <p className="text-[10px] text-slate-400 text-center mt-2">
                        🔒 הפרטים שלכם בטוחים אצלי ב-100%. דיסקרטיות מוחלטת מובטחת על פי חוק.
                      </p>
                    </form>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfUse />} />
          <Route path="/accessibility" element={<AccessibilityStatement />} />
        </Routes>
      </Layout>
    </Router>
  );
}
