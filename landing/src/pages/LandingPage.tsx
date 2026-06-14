import React, { useEffect, useMemo, useRef, useState } from 'react';
import logo from '../logo-conflyy.jpeg';

import { Users, Clock, ArrowRight, CheckCircle2, Star, Sparkles, MonitorPlay, GraduationCap, Briefcase, Users2, Zap, Check, Copy } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { DarkVeil } from '../components/DarkVeil';
import { DecryptedText } from '../components/DecryptedText';
import { CardStack } from "../components/ui/card-stack";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from 'react-router-dom';
import { translations } from '../lib/translations';


gsap.registerPlugin(ScrollTrigger);

export function LandingPage() {
  const [typewriterWordIndex, setTypewriterWordIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [lang, setLang] = useState<'ru' | 'en'>(() => {
    const saved = localStorage.getItem('confly_lang');
    return (saved === 'en' || saved === 'ru') ? saved : 'ru';
  });

  const t = translations[lang];

  useEffect(() => {
    localStorage.setItem('confly_lang', lang);
  }, [lang]);

  const scenarioTitleRef = useRef<HTMLHeadingElement | null>(null);
  const typewriterWords = t.hero.words;


  // Initialize userData from localStorage synchronously to avoid flash
  const [userData, setUserData] = useState<{ email: string; position: number; total: number } | null>(() => {
    const email = localStorage.getItem('confly_email');
    if (email) {
      return {
        email,
        position: parseInt(localStorage.getItem('confly_position') || '0', 10) || 0,
        total: parseInt(localStorage.getItem('confly_total') || '0', 10) || 0,
      };
    }
    return null;
  });

  const [totalCount, setTotalCount] = useState<number>(0);

  // Fetch real data on mount and listen for auth changes
  useEffect(() => {
    const fetchTotalCount = async () => {
      try {
        const { count } = await supabase.from('waitlist').select('*', { count: 'exact', head: true });
        if (count !== null) setTotalCount(count);
      } catch (err) {
        console.error("Error fetching total waitlist count", err);
      }
    };

    const fetchUserRank = async (email: string) => {
      try {
        const { data: userRecord, error } = await supabase.from('waitlist').select('created_at').eq('email', email).single();
        
        if (error || !userRecord) {
          // User deleted from DB, clear local state
          localStorage.removeItem('confly_email');
          localStorage.removeItem('confly_position');
          localStorage.removeItem('confly_total');
          setUserData(null);
          return;
        }

        const { count: rank } = await supabase.from('waitlist')
          .select('*', { count: 'exact', head: true })
          .lte('created_at', userRecord.created_at);

        if (rank !== null) {
          localStorage.setItem('confly_position', rank.toString());
          setUserData(prev => prev ? { ...prev, position: rank } : { email, position: rank, total: 0 });
        }
      } catch (err) {
        console.error("Error fetching user rank", err);
        // Also clear if we get a specific "No rows found" error
        if ((err as any).code === 'PGRST116') {
          localStorage.removeItem('confly_email');
          localStorage.removeItem('confly_position');
          localStorage.removeItem('confly_total');
          setUserData(null);
        }
      }
    };

    fetchTotalCount();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user?.email) {
        localStorage.setItem('confly_email', session.user.email);
        setUserData(prev => ({ email: session.user!.email!, position: prev?.position || 0, total: 0 }));
        fetchUserRank(session.user.email);
      }
    });

    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        localStorage.setItem('confly_email', session.user.email);
        fetchUserRank(session.user.email);
      } else {
        const storedEmail = localStorage.getItem('confly_email');
        if (storedEmail) fetchUserRank(storedEmail);
      }
    };
    checkSession();

    return () => subscription.unsubscribe();
  }, []);

  // Hardcoded launch date to start the real countdown
  const targetDate = useMemo(() => new Date('2026-05-03T12:00:00Z').getTime(), []);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [inputEmail, setInputEmail] = useState("");

  useEffect(() => {
    const updateTimer = () => {
      const distance = targetDate - Date.now();
      if (distance <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    };
    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const [copied, setCopied] = useState(false);
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleJoinWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputEmail) return;

    try {
        // Redirect to auth page with pre-filled email via URL query, 
        // since full Supabase registration (Auth) requires a password.
        window.location.href = `/auth?email=${encodeURIComponent(inputEmail)}`;
    } catch (err) {
        console.error(err);
    }
  };

  useEffect(() => {
    const fullWord = typewriterWords[typewriterWordIndex];
    let timeoutId: ReturnType<typeof setTimeout>;

    if (typedText.length < fullWord.length) {
      timeoutId = setTimeout(() => {
        setTypedText(fullWord.slice(0, typedText.length + 1));
      }, 55);
    } else {
      timeoutId = setTimeout(() => {
        setTypedText("");
        setTypewriterWordIndex((prev) => (prev + 1) % typewriterWords.length);
      }, 1400);
    }

    return () => clearTimeout(timeoutId);
  }, [typedText, typewriterWordIndex, typewriterWords]);

  useEffect(() => {
    if (!scenarioTitleRef.current) return;
    const chars = scenarioTitleRef.current.querySelectorAll("span");
    if (!chars.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        chars,
        { opacity: 0, y: 28, filter: "blur(6px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.025,
          scrollTrigger: {
            trigger: scenarioTitleRef.current,
            start: "top 82%",
            once: true,
          },
        }
      );
    }, scenarioTitleRef);

    return () => ctx.revert();
  }, []);

  const scenarios = useMemo(() => {
    return t.scenarios.items.map((item, i) => {
      const icons = [
        <MonitorPlay className="w-6 h-6 text-primary" />,
        <Users className="w-6 h-6 text-primary" />,
        <GraduationCap className="w-6 h-6 text-primary" />,
        <Briefcase className="w-6 h-6 text-primary" />,
        <Star className="w-6 h-6 text-primary" />,
        <Users2 className="w-6 h-6 text-primary" />
      ];
      return {
        id: i + 1,
        icon: icons[i],
        ...item
      };
    });
  }, [t]);


  return (
    <div className="min-h-screen bg-darker text-gray-100 font-sans selection:bg-primary selection:text-black relative overflow-x-hidden">
      {/* Background DarkVeil Component */}
      <div className="fixed inset-[-1%] w-[102%] h-[102%] z-0 pointer-events-none" style={{ transform: 'translateZ(0)', willChange: 'transform' }}>
        <DarkVeil
          hueShift={55}
          noiseIntensity={0.04}
          scanlineIntensity={0.2}
          speed={0.8}
          warpAmount={0.5}
        />
      </div>

      {/* Navigation */}
      <nav className="border-b border-border/50 bg-dark/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center">
              <img src={logo} alt="Confly Logo" className="w-full h-full object-cover" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">Confly</span>
          </div>
          <div className="flex items-center gap-6">
            {/* Language Switcher */}
            <div className="flex items-center bg-white/5 border border-white/10 rounded-lg p-1">
              <button 
                onClick={() => setLang('ru')}
                className={`px-2 py-1 text-[10px] font-bold rounded transition-all ${lang === 'ru' ? 'bg-primary text-black' : 'text-gray-500 hover:text-gray-300'}`}
              >
                RU
              </button>
              <button 
                onClick={() => setLang('en')}
                className={`px-2 py-1 text-[10px] font-bold rounded transition-all ${lang === 'en' ? 'bg-primary text-black' : 'text-gray-500 hover:text-gray-300'}`}
              >
                EN
              </button>
            </div>

            {userData ? (
              <div className="text-sm font-medium text-primary border border-primary/30 px-5 py-2.5 rounded-xl flex items-center gap-2 cursor-default bg-primary/5">
                {t.nav.youAreIn} <CheckCircle2 className="w-4 h-4" />
              </div>
            ) : (
              <Link to="/auth" className="text-sm font-medium text-primary border border-primary/30 px-5 py-2.5 rounded-xl hover:bg-primary/10 hover:border-primary/60 transition-all duration-300 shadow-[0_0_15px_rgba(251,191,36,0.05)] hover:shadow-[0_0_20px_rgba(251,191,36,0.15)]">
                {t.nav.joinWaitlist}
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative pt-20 pb-32">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--color-primary)_0%,_transparent_20%)] opacity-10 blur-3xl"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-8 leading-tight min-h-[140px] sm:min-h-[190px] md:min-h-[210px]">
                {t.hero.title} <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-200 inline-flex items-end gap-1">
                  {typedText}
                  <span className="inline-block w-[3px] h-[0.95em] bg-primary animate-pulse rounded-full" />
                </span>
              </h1>

              <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                {t.hero.description}
              </p>

              {/* Stats Card - Now shown for everyone */}
              <div className="mt-16 bg-black/40 border border-white/5 py-8 max-w-[900px] mx-auto shadow-2xl relative overflow-hidden backdrop-blur-xl rounded-2xl animate-in fade-in duration-[400ms] fill-mode-forwards">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-0 relative z-10 px-2 sm:px-4">
                  
                  {/* Užhe ždut demo */}
                  <div className="flex flex-col items-center justify-center space-y-1 md:border-r border-white/5 py-2">
                    <div className="flex items-center gap-2 text-gray-400 mb-3">
                      <Users className="w-4 h-4" />
                      <span className="font-semibold text-[13px] tracking-wide">{t.waitlist.alreadyWaiting}</span>
                    </div>
                    <span className="text-5xl md:text-[3.5rem] leading-none font-bold text-white tracking-tight">{(userData?.total || totalCount).toLocaleString()}</span>
                    <span className="text-[11px] text-gray-500 uppercase tracking-widest text-center mt-3 pt-2">{t.waitlist.registeredSuffix}</span>
                  </div>

                  {/* Vashe mesto v spiske */}
                  <div className="flex flex-col items-center justify-center space-y-1 py-2 relative">
                    <div className="flex items-center gap-2 text-gray-400 mb-3">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="font-semibold text-[13px] tracking-wide">{t.waitlist.yourPosition}</span>
                    </div>
                    {userData ? (
                      <span className="text-5xl md:text-[3.5rem] leading-none font-bold text-primary tracking-tight">#{userData.position}</span>
                    ) : (
                      <span className="text-5xl md:text-[3.5rem] leading-none font-bold text-primary/30 tracking-tight">#?</span>
                    )}
                    <span className="text-[11px] text-gray-500 uppercase tracking-widest text-center mt-3 pt-2">{t.waitlist.amongEveryone}</span>
                  </div>
                  
                  {/* Do otkrîtiya demo */}
                  <div className="flex flex-col items-center justify-center space-y-1 md:border-l border-white/5 py-2">
                    <div className="flex items-center gap-2 text-gray-400 mb-3">
                      <Clock className="w-4 h-4" />
                      <span className="font-semibold text-[13px] tracking-wide">{t.waitlist.openingSoon}</span>
                    </div>
                    <div className="flex gap-2 text-center items-end justify-center w-full mt-1">
                      <div className="flex flex-col items-center w-12">
                        <span className="text-4xl font-bold text-primary tracking-tight leading-none">{timeLeft.days}</span>
                        <span className="text-[9px] text-gray-500 uppercase tracking-widest mt-3">{t.waitlist.days}</span>
                      </div>
                      <span className="text-2xl font-bold text-gray-600 mb-5 relative -top-[1px]">:</span>
                      <div className="flex flex-col items-center w-12">
                        <span className="text-4xl font-bold text-primary tracking-tight leading-none">{timeLeft.hours.toString().padStart(2, '0')}</span>
                        <span className="text-[9px] text-gray-500 uppercase tracking-widest mt-3">{t.waitlist.hours}</span>
                      </div>
                      <span className="text-2xl font-bold text-gray-600 mb-5 relative -top-[1px]">:</span>
                      <div className="flex flex-col items-center w-12">
                        <span className="text-4xl font-bold text-primary tracking-tight leading-none">{timeLeft.minutes.toString().padStart(2, '0')}</span>
                        <span className="text-[9px] text-gray-500 uppercase tracking-widest mt-3">{t.waitlist.mins}</span>
                      </div>
                      <span className="text-2xl font-bold text-gray-600 mb-5 relative -top-[1px]">:</span>
                      <div className="flex flex-col items-center w-12">
                        <span className="text-4xl font-bold text-primary tracking-tight leading-none">{timeLeft.seconds.toString().padStart(2, '0')}</span>
                        <span className="text-[9px] text-gray-500 uppercase tracking-widest mt-3">{t.waitlist.secs}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {!userData && (
                  <div className="mt-8 pt-8 border-t border-white/5 flex flex-col items-center w-full relative z-10 px-6">
                    <div className="max-w-[380px] w-full border border-white/5 bg-black/20 p-1.5 pl-4 sm:p-2 sm:pl-6 rounded-full shadow-2xl backdrop-blur-md hover:border-white/10 transition-colors">
                      <form onSubmit={handleJoinWaitlist} className="flex items-center gap-2 sm:gap-3">
                        <input 
                          type="email" 
                          required
                          value={inputEmail}
                          onChange={(e) => setInputEmail(e.target.value)}
                          placeholder={t.hero.emailPlaceholder}
                          className="flex-1 bg-transparent border-none text-white placeholder-gray-500 focus:outline-none focus:ring-0 outline-none text-xs sm:text-sm md:text-base w-0"
                        />
                        <button 
                          type="submit"
                          className="bg-primary hover:bg-primary/90 text-black font-bold py-2.5 px-4 sm:py-3.5 sm:px-6 rounded-full shadow-[0_0_15px_rgba(251,191,36,0.2)] hover:shadow-[0_0_20px_rgba(251,191,36,0.35)] transition-all flex justify-center items-center gap-2 whitespace-nowrap text-xs sm:text-base"
                        >
                          {t.hero.join} 
                          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-0.5 sm:ml-1" />
                        </button>
                      </form>
                    </div>
                  </div>
                )}

                {/* Share nudge row - only for waitlisted users */}
                {userData && (
                  <div className="mt-8 pt-6 border-t border-white/5 flex flex-col items-center w-full relative z-10 px-6">
                    <div className="text-gray-400 text-sm font-medium mb-4 flex items-center gap-2">
                       {t.waitlist.shareNudge}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto justify-center">
                      <a 
                        href={'https://twitter.com/intent/tweet?text=' + encodeURIComponent((lang === 'ru' ? 'Я в списке ожидания Confly — тренажера презентаций с ИИ! Присоединяйтесь: ' : "I'm on the Confly waitlist — an AI presentation trainer! Join here: ") + window.location.origin)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 text-gray-300 hover:text-white transition-all text-[13px] font-medium w-full sm:w-auto"
                      >
                        <svg className="w-4 h-4 fill-current opacity-70" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                        {t.waitlist.shareX}
                      </a>
                      <button 
                        onClick={handleCopyLink}
                        className="flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 text-gray-300 hover:text-white transition-all text-[13px] font-medium w-full sm:w-auto sm:min-w-[170px]"
                      >
                        {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 opacity-70" />}
                        {copied ? <span className="text-green-400">{t.waitlist.copied}</span> : t.waitlist.copyLink}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Killer Feature Section */}
        <section className="py-24 relative">
          <div className="absolute top-1/2 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2"></div>
          <div className="absolute top-10 right-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>

          <div className="max-w-7xl mx-auto px-8 sm:px-16 lg:px-24 relative z-10">
            <div className="grid md:grid-cols-2 gap-12 md:gap-20 lg:gap-24 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-6 leading-tight">
                  {t.killerFeature.title.split(' ').map((word, i) => (
                    <span key={i} className={word === (lang === 'ru' ? 'любого' : 'any') ? "text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-200 block md:inline" : ""}>
                      {word}{' '}
                    </span>
                  ))}
                </h2>
                <p className="text-lg text-gray-300 font-medium mb-8 leading-relaxed">
                  {t.killerFeature.description}
                </p>
                <ul className="space-y-4">
                  {t.killerFeature.features.map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-300 group cursor-default">
                      <Zap className="w-5 h-5 text-primary shrink-0 group-hover:scale-110 group-hover:text-yellow-400 transition-all duration-300" />
                      <span>
                        <DecryptedText
                          text={item}
                          animateOn="view"
                          speed={40}
                          maxIterations={10}
                          sequential={true}
                          className="text-gray-300"
                          encryptedClassName="text-gray-500 font-mono"
                        />
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative">
                <div className="min-h-[540px] md:min-h-0 md:aspect-square rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl p-3 sm:p-4 relative shadow-[0_20px_80px_rgba(0,0,0,0.35)] overflow-hidden">
                  {/* Mockup of UI */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent z-0"></div>
                  <div className="relative z-10 h-full flex flex-col">
                    <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-4">
                      <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                      </div>
                      <span className="text-xs font-mono text-gray-500">Live Session</span>
                    </div>

                    <div className="flex-1 flex flex-col md:flex-row gap-4">
                      <div className="flex-1 bg-black/20 rounded-xl border border-white/10 backdrop-blur-sm flex items-center justify-center relative overflow-hidden min-h-[140px] md:min-h-0">
                        <div className="text-gray-600 font-medium">{t.killerFeature.yourCamera}</div>
                        <div className="absolute bottom-3 left-3 flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                          <span className="text-xs text-gray-400">{t.killerFeature.recording}</span>
                        </div>
                      </div>

                      <div className="flex-1 bg-black/25 rounded-xl border border-primary/30 relative overflow-hidden shadow-[0_0_30px_rgba(251,191,36,0.12)] backdrop-blur-sm min-h-[220px] md:min-h-0">
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <div className="w-24 h-24 rounded-full bg-black/30 border-2 border-primary/50 flex items-center justify-center mb-4 relative backdrop-blur-sm">
                            <Users className="w-10 h-10 text-primary/80" />
                            <div className="absolute -bottom-2 -right-2 bg-primary text-black text-[10px] font-bold px-2 py-1 rounded-md">{t.killerFeature.aiAvatar}</div>
                          </div>
                          <div className="bg-black/40 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-lg max-w-[80%] text-center">
                            <p className="text-sm text-gray-300">"{t.killerFeature.aiMessage}"</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Scenarios Section */}
        <section className="py-32 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="text-left">
                <h2 ref={scenarioTitleRef} className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-6 leading-tight">
                  {t.scenarios.title.split("").map((char, index) => (
                    <span key={`${char}-${index}`} className="inline-block whitespace-pre opacity-0">
                      {char}
                    </span>
                  ))}
                </h2>
                <p className="text-xl text-gray-300 font-medium leading-relaxed mb-8">
                  {t.scenarios.description}
                </p>
                <p className="text-primary font-medium flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  {t.scenarios.clickHint}
                </p>
              </div>

              <div className="flex items-center justify-center h-[350px] sm:h-[400px] relative -translate-x-4 sm:-translate-x-8 md:-translate-x-12 translate-y-6 sm:translate-y-8 md:translate-y-10">
                <CardStack items={scenarios} />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-white/[0.03] backdrop-blur-xl py-6">
        <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded overflow-hidden flex items-center justify-center">
              <img src={logo} alt="Confly Logo" className="w-full h-full object-cover" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white">Confly</span>
          </div>
          <div className="text-sm text-gray-500">
            {t.footer.rights}
          </div>
        </div>
      </footer>
    </div>
  );
}
