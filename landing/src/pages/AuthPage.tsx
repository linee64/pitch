import React, { useState, useEffect } from 'react';
import logo from '../logo-conflyy.jpeg';

import { Mail, Lock, ArrowRight, Users, Sparkles, Clock, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { translations } from '../lib/translations';
import { supabase } from '../lib/supabase';

import { DarkVeil } from '../components/DarkVeil';




export function AuthPage() {
  const [isLogin] = useState(false); // Default to register for waitlist
  const [currentSlide, setCurrentSlide] = useState(0);

  // Authentication & Waitlist State
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialEmail = queryParams.get('email') || '';

  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isWaitlisted] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [waitlistData] = useState({ total: 1284, position: 31 });
  const [lang, setLang] = useState<'ru' | 'en'>(() => {
    const saved = localStorage.getItem('confly_lang');
    return (saved === 'en' || saved === 'ru') ? saved : 'ru';
  });

  const t = translations[lang];

  const slides = lang === 'ru' ? [
    {
      title: "Добро пожаловать \nв сообщество",
      description: "Тренируй свои питчи, побеждай страх сцены и закрывай раунды уверенно вместе с ИИ."
    },
    {
      title: "Анализ \nв реальном времени",
      description: "Наш ИИ-аватар анализирует вашу скорость речи, эмоции, уверенность и зрительный контакт."
    },
    {
      title: "Готовность \nна 100%",
      description: "Отрепетируйте ответы на самые каверзные вопросы перед живым выступлением."
    }
  ] : [
    {
      title: "Welcome to the \ncommunity",
      description: "Train your pitches, overcome stage fright, and close rounds confidently with AI."
    },
    {
      title: "Real-time \nanalysis",
      description: "Our AI avatar analyzes your speech rate, emotions, confidence, and eye contact."
    },
    {
      title: "100% \nReadiness",
      description: "Rehearse answers to the trickiest questions before your live performance."
    }
  ];


  useEffect(() => {
    localStorage.setItem('confly_lang', lang);
  }, [lang]);

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });


  const navigate = useNavigate();

  useEffect(() => {
    const checkUserStatus = async () => {
      const email = localStorage.getItem('confly_email');
      if (email) {
        const { data } = await supabase.from('waitlist').select('id').eq('email', email).single();
        if (data) {
          navigate('/');
        } else {
          // Ghost user, clear local storage
          localStorage.removeItem('confly_email');
          localStorage.removeItem('confly_position');
          localStorage.removeItem('confly_total');
        }
      }
    };
    checkUserStatus();
  }, [navigate]);

  useEffect(() => {
    const targetTime = new Date('2026-05-03T12:00:00Z').getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = targetTime - now;

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
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setIsLoading(true);

    try {
      // Attempt Sign Up first via Supabase
      let { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      // If user already exists, try Sign In
      if (authError && authError.message.toLowerCase().includes('already registered')) {
        const { error: loginError } = await supabase.auth.signInWithPassword({ 
          email, 
          password 
        });
        
        if (loginError) {
          if (loginError.message.toLowerCase().includes('email not confirmed')) {
            setIsEmailSent(true);
            setIsLoading(false);
            return;
          }
          alert('Ошибка входа: ' + loginError.message);
          setIsLoading(false);
          return;
        }
      } else if (authError) {
        alert('Ошибка регистрации: ' + authError.message);
        setIsLoading(false);
        return;
      }

      // If signup was successful but requires email verification
      // Check if user exists but session is null, or if they are explicitly unconfirmed
      if (data.user && (!data.session || !data.user.email_confirmed_at)) {
        setIsEmailSent(true);
        setIsLoading(false);
        return;
      }

      // Briefly mock to show realistic feel, then fetch real exact count and position
      await new Promise(r => setTimeout(r, 600));

      const { count } = await supabase.from('waitlist').select('*', { count: 'exact', head: true });
      const { data: userRow } = await supabase.from('waitlist').select('position').eq('email', email).single();

      localStorage.setItem('confly_email', email);
      if (userRow) {
         localStorage.setItem('confly_position', userRow.position.toString());
      }
      if (count !== null) {
         localStorage.setItem('confly_total', count.toString());
      }

      navigate('/');
    } catch (err: any) {
      alert('Ошибка: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });
      if (error) throw error;
      alert(t.confirmEmail.success);
    } catch (err: any) {
      alert('Ошибка: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) alert('Ошибка Google авторизации: ' + error.message);
    } catch (err: any) {
      alert('Ошибка: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-darker text-gray-100 font-sans selection:bg-primary selection:text-black relative flex flex-col justify-center items-center py-6 px-4 overflow-y-auto w-full">
      {/* Back Button and Language Toggle */}
      <div className="fixed top-6 left-6 right-6 md:top-8 md:left-8 md:right-8 flex items-center justify-between z-50">
        <Link to="/" className="flex items-center gap-2.5 text-gray-500 hover:text-white transition-colors group">
          <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 group-hover:border-white/20 transition-all shadow-lg backdrop-blur-sm">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="font-medium text-sm tracking-wide">{lang === 'ru' ? 'Назад' : 'Back'}</span>
        </Link>

        {/* Language Switcher */}
        <div className="flex items-center bg-white/5 border border-white/10 rounded-lg p-1 backdrop-blur-sm shadow-lg">
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
      </div>

      {/* Background DarkVeil Component, positioned fixed so scrolling works over it */}
      <div className="fixed inset-[-1%] w-[102%] h-[102%] z-0 pointer-events-none" style={{ transform: 'translateZ(0)', willChange: 'transform' }}>
        <DarkVeil
          hueShift={55}
          noiseIntensity={0.04}
          scanlineIntensity={0.2}
          speed={0.8}
          warpAmount={0.5}
        />
      </div>

      {/* Decorative Background Glows */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0"></div>
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2 pointer-events-none z-0"></div>

      {/* Main Content Card Container - REDUCED SCALE */}
      <div className="z-10 w-full max-w-[850px] sm:rounded-[2rem] rounded-2xl overflow-hidden bg-white/[0.03] backdrop-blur-2xl border border-white/10 flex flex-col md:flex-row shadow-[0_20px_80px_-20px_rgba(251,191,36,0.15)] relative min-h-[480px]">

        {/* Subtle inner top highlight */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent pointer-events-none z-20"></div>

        {/* === Left Side: Decor / Confly Branding === */}
        <div className="w-full md:w-[45%] relative bg-gradient-to-br from-primary/10 via-transparent to-transparent flex flex-col p-5 sm:p-8 border-b md:border-b-0 md:border-r border-white/10 overflow-hidden min-h-[230px] sm:min-h-[280px] md:min-h-auto flex-shrink-0">

          {/* Abstract background shapes */}
          <div className="absolute top-[-20%] left-[-20%] w-60 h-60 bg-primary/20 blur-[80px] rounded-full pointer-events-none"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-48 h-48 bg-primary/10 blur-[60px] rounded-full pointer-events-none"></div>

          {/* Waves pattern tailored for dark mode */}
          <div
            className="absolute -bottom-10 left-0 w-[150%] h-[50%] opacity-[0.03] pointer-events-none origin-bottom-left"
            style={{
              background: 'repeating-linear-gradient(0deg, #ffffff 0px, #ffffff 2px, transparent 2px, transparent 24px)',
              transform: 'skewY(-8deg) scale(1.5)'
            }}
          />

          <div className="relative z-10 flex flex-col h-full">
            <Link to="/" className="flex items-center gap-3.5 mb-8 w-max group">
              <div className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center transition-transform group-hover:scale-105 shadow-[0_0_15px_rgba(251,191,36,0.15)] shrink-0">
                <img src={logo} alt="Confly Logo" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-2xl tracking-tight text-white group-hover:text-primary transition-colors leading-none mb-1">Confly</span>
                <span className="text-[10px] sm:text-xs text-gray-400 font-medium tracking-wide uppercase opacity-80 group-hover:opacity-100 transition-opacity">{lang === 'ru' ? 'Тренируйся. Практикуйся. Побеждай.' : 'Train. Practice. Win.'}</span>

              </div>
            </Link>

            <div className="mt-auto bg-black/20 backdrop-blur-xl p-5 sm:p-6 rounded-2xl border border-white/10 shadow-xl relative overflow-hidden group hover:border-primary/30 transition-colors flex flex-col min-h-[170px] sm:min-h-[220px]">
              <div className="absolute -top-6 -right-6 w-20 h-20 bg-primary/20 blur-2xl rounded-full group-hover:bg-primary/30 transition-colors"></div>

              {/* Animated text section */}
              <div className="relative flex-grow w-full">
                {slides.map((slide, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-all duration-500 transform ${index === currentSlide ? 'opacity-100 translate-x-0 pointer-events-auto' : 'opacity-0 translate-x-4 pointer-events-none'
                      }`}
                  >
                    <h2 className="text-lg sm:text-xl font-bold text-white mb-2 tracking-tight font-sans relative z-10 whitespace-pre-line">
                      {slide.title}
                    </h2>
                    <p className="text-gray-400 text-xs sm:text-sm leading-relaxed relative z-10 max-w-sm">
                      {slide.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Pagination Dots */}
              <div className="flex justify-start gap-2 pt-4 relative z-10 items-center border-t border-white/10 mt-6">
                {slides.map((_, index) => (
                  <div
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer shadow-[0_0_8px_rgba(251,191,36,0.5)]
                      ${index === currentSlide ? 'w-6 bg-primary' : 'w-2 bg-primary/30 hover:bg-primary/50'}
                    `}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* === Right Side: Form / Waitlist Success === */}
        <div className="w-full md:w-[55%] p-6 sm:p-8 lg:p-10 relative flex flex-col justify-center bg-black/20 md:bg-transparent">
          
          {isWaitlisted ? (
            /* WAITLIST SUCCESS DASHBOARD */
            <div className="w-full max-w-[380px] mx-auto flex flex-col gap-4 animate-in fade-in zoom-in duration-500">
              
              {/* Box 1: Ваше место */}
              <div className="bg-[#18191b] border border-primary/30 rounded-[22px] pt-7 pb-8 flex flex-col items-center relative overflow-hidden shadow-[0_0_40px_rgba(251,191,36,0.06)]">
                {/* Subtle top glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
                
                <div className="flex items-center gap-2.5 mb-5 relative z-10 text-gray-300">
                  <Sparkles className="w-[18px] h-[18px] text-primary" />
                  <span className="text-[15px] font-semibold tracking-wide">{t.waitlist.yourPosition}</span>
                </div>
                <div className="text-7xl md:text-[6rem] leading-[0.85] font-black text-primary mb-3 tracking-tighter relative z-10 drop-shadow-[0_2px_15px_rgba(251,191,36,0.2)]">#{waitlistData.position}</div>
                <span className="text-[13px] text-gray-500 relative z-10 font-medium pt-2">{t.waitlist.amongEveryone}</span>

              </div>

              {/* Two bottom boxes side by side */}
              <div className="grid grid-cols-2 gap-4">
                {/* Box 2: Уже ждут демо */}
                <div className="bg-[#18191b] border border-white/5 rounded-[22px] p-4 py-5 flex flex-col items-center justify-center text-center hover:bg-[#1a1b1d] transition-colors">
                  <div className="flex items-center gap-2 mb-4 text-gray-300">
                    <Users className="w-4 h-4" />
                    <span className="text-[13px] font-semibold tracking-wide">{t.waitlist.alreadyWaiting}</span>
                  </div>
                  <div className="text-2xl md:text-[28px] font-bold text-white tracking-tight leading-none mb-3">{waitlistData.total.toLocaleString('ru-RU')}</div>
                  <span className="text-[9px] text-gray-500 uppercase tracking-widest leading-[1.5]">{t.waitlist.registeredSuffix}</span>

                </div>

                {/* Box 3: Таймер */}
                <div className="bg-[#18191b] border border-white/5 rounded-[22px] p-4 py-5 flex flex-col items-center justify-center text-center hover:bg-[#1a1b1d] transition-colors">
                  <div className="flex items-center gap-2 mb-4 text-gray-300">
                    <Clock className="w-4 h-4" />
                    <span className="text-[13px] font-semibold tracking-wide">{t.waitlist.openingSoon}</span>
                  </div>

                  
                  <div className="flex gap-1.5 text-center items-end justify-center w-full">
                    <div className="flex flex-col items-center w-8">
                      <span className="text-[22px] md:text-[26px] font-bold text-primary tracking-tight leading-none mb-1.5">{timeLeft.days.toString().padStart(2, '0')}</span>
                      <span className="text-[8px] text-gray-500 uppercase tracking-[0.1em]">{t.waitlist.days}</span>
                    </div>
                    <span className="text-xl font-bold text-gray-600 mb-[18px] opacity-70">:</span>
                    <div className="flex flex-col items-center w-8">
                      <span className="text-[22px] md:text-[26px] font-bold text-primary tracking-tight leading-none mb-1.5">{timeLeft.hours.toString().padStart(2, '0')}</span>
                      <span className="text-[8px] text-gray-500 uppercase tracking-[0.1em]">{t.waitlist.hours}</span>
                    </div>
                    <span className="text-xl font-bold text-gray-600 mb-[18px] opacity-70">:</span>
                    <div className="flex flex-col items-center w-8">
                      <span className="text-[22px] md:text-[26px] font-bold text-primary tracking-tight leading-none mb-1.5">{timeLeft.minutes.toString().padStart(2, '0')}</span>
                      <span className="text-[8px] text-gray-500 uppercase tracking-[0.1em]">{t.waitlist.mins}</span>
                    </div>
                    <span className="text-xl font-bold text-gray-600 mb-[18px] opacity-70">:</span>
                    <div className="flex flex-col items-center w-8">
                      <span className="text-[22px] md:text-[26px] font-bold text-primary tracking-tight leading-none mb-1.5">{timeLeft.seconds.toString().padStart(2, '0')}</span>
                      <span className="text-[8px] text-gray-500 uppercase tracking-[0.1em]">{t.waitlist.secs}</span>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          ) : isEmailSent ? (
            /* EMAIL CONFIRMATION SCREEN */
            <div className="w-full max-w-[380px] mx-auto flex flex-col items-center animate-in fade-in zoom-in duration-500 text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-8 relative group">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <Mail className="w-10 h-10 text-primary relative z-10" />
              </div>
              
              <h2 className="text-2xl font-extrabold text-white mb-4 tracking-tight">
                {t.confirmEmail.title}
              </h2>
              
              <p className="text-gray-400 text-sm leading-relaxed mb-8">
                {t.confirmEmail.description.replace('{email}', email)}
              </p>

              <div className="w-full space-y-4">
                <button 
                  onClick={handleResendEmail}
                  disabled={isLoading}
                  className="w-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle2 className="w-4 h-4 text-primary" /> {t.confirmEmail.resend}</>}
                </button>

                <button 
                  onClick={() => setIsEmailSent(false)}
                  className="w-full text-gray-500 hover:text-gray-300 text-xs font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-3 h-3" />
                  {t.confirmEmail.back}
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-[320px] mx-auto">
              <h1 className="text-2xl font-extrabold text-white mb-6 text-center md:text-left tracking-tight">
                {isLogin ? (lang === 'ru' ? 'С возвращением!' : 'Welcome back!') : (lang === 'ru' ? 'Создайте аккаунт' : 'Create an account')}
              </h1>

              <form className="space-y-3.5" onSubmit={handleAuth}>
                {/* Email Input */}
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-500 group-focus-within:text-primary transition-colors" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.hero.emailPlaceholder}
                    className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-500 hover:border-white/20 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none text-sm"
                  />
                </div>

                {/* Password Input */}
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-500 group-focus-within:text-primary transition-colors" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t.hero.passwordPlaceholder}
                    className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-500 hover:border-white/20 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none text-sm"
                  />
                </div>

                <div className="flex justify-end pt-0.5">
                  <a href="#" className="text-xs font-medium text-gray-400 hover:text-primary transition-colors">
                    {lang === 'ru' ? 'Забыли пароль?' : 'Forgot password?'}
                  </a>
                </div>

                <button 
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary/90 text-black font-bold py-3 rounded-xl shadow-[0_0_15px_rgba(251,191,36,0.2)] hover:shadow-[0_0_20px_rgba(251,191,36,0.35)] transition-all transform active:scale-[0.98] mt-2 flex justify-center items-center gap-2 outline-none text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      {isLogin ? (lang === 'ru' ? 'Войти' : 'Sign In') : (lang === 'ru' ? 'Продолжить' : 'Continue')}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Social Authentication */}
              <div className="mt-6 text-center">
                <div className="relative flex items-center mb-5">
                  <div className="flex-grow border-t border-white/10"></div>
                  <span className="flex-shrink-0 mx-4 text-[10px] font-semibold text-gray-500 uppercase tracking-widest whitespace-nowrap">{lang === 'ru' ? 'Или продолжить через' : 'Or continue with'}</span>
                  <div className="flex-grow border-t border-white/10"></div>
                </div>

                <button 
                  onClick={handleGoogleAuth}
                  className="w-full flex items-center justify-center gap-3 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-colors py-3 rounded-xl group text-white font-medium text-sm"
                >
                  <svg className="w-4 h-4 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12 5.04c1.74 0 3.3.6 4.53 1.76l3.39-3.39C17.85 1.53 15.15 0 12 0 7.31 0 3.25 2.69 1.25 6.6l3.96 3.07C6.15 7.15 8.85 5.04 12 5.04z" /><path fill="#FBBC05" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.89 3.02c2.27-2.1 3.53-5.2 3.53-8.84z" /><path fill="#4285F4" d="M5.21 14.73c-.25-.76-.39-1.56-.39-2.4 0-.84.14-1.64.39-2.4L1.25 6.6C.45 8.21 0 10.05 0 12s.45 3.79 1.25 5.4l3.96-3.07z" /><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.89-3.02c-1.11.75-2.53 1.19-4.04 1.19-3.15 0-5.85-2.11-6.8-5.04L1.25 17.4C3.25 21.31 7.31 24 12 24z" />
                  </svg>
                  Google
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

