/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Heart, Camera, MapPin, Music, Sparkles, Clock, Calendar, Check, AlertCircle, Info, Gift, Flower2 } from 'lucide-react';
import { motion } from 'motion/react';
import Timer from './components/Timer';
import AudioPlayer from './components/AudioPlayer';
import InteractiveMap from './components/InteractiveMap';
import RSVPForm from './components/RSVPForm';

// Import our safe and gorgeous original couple photographs
import beachKissImg from './assets/images/couple_beach_kiss_1781523391977.jpg';
import groomImg from './assets/images/groom_nikita_1781523408440.jpg';
import brideImg from './assets/images/bride_elizaveta_1781523425791.jpg';

const TIMELINE_EVENTS = [
  {
    time: '11:40',
    title: 'Сбор гостей',
    description: 'Встречаемся у парадного входа во Дворец Бракосочетания №2. Радостные объятия и приготовление к торжеству.',
    icon: Clock,
  },
  {
    time: '12:20',
    title: 'Торжественная регистрация',
    description: 'Самый волнительный момент. Никита и Елизавета скажут заветное «Да» под величественными сводами Дворца.',
    icon: Heart,
  },
  {
    time: '13:10',
    title: 'Свадебный трансфер',
    description: 'Отправляемся комфортабельным автобусом от ЗАГСа №2 к исторической Академии Штиглица.',
    icon: Sparkles,
  },
  {
    time: '14:10',
    title: 'Свадебная фотосессия',
    description: 'Гости наслаждаются изысканной атмосферой неоренессанса и фотографируются вместе с нами в роскошных залах Академии.',
    icon: Camera,
  },
  {
    time: '17:00',
    title: 'Праздничный ужин & Банкет',
    description: 'Тёплая семейная атмосфера, весёлые тосты, изысканные блюда, зажигательные танцы и душевные поздравления.',
    icon: Music,
  }
];

const COL_PALETTE = [
  { hex: '#B2C5D4', name: 'Пыльно-голубой (Dusty Blue)' },
  { hex: '#7496B2', name: 'Синее небо (Serenity Slate)' },
  { hex: '#D1DDD3', name: 'Мятный Шалфей (Sage green)' },
  { hex: '#EBE2D2', name: 'Песочный крем (Sand Cream)' },
  { hex: '#FAF5EF', name: 'Бежевый кружевной (Lace Ivory)' }
];

// Configure dynamic floaters for the beautiful Pinterest-style background
const FLOATING_PETALS = Array.from({ length: 15 }, (_, i) => ({
  id: i,
  left: `${5 + (i * 7) % 90}%`,
  duration: 12 + ((i * 3) % 15),
  delay: -((i * 4) % 20),
  size: 8 + ((i * 2) % 10),
  rotate: i * 24,
  sway: 15 + ((i * 5) % 25)
}));

export default function App() {
  return (
    <div className="min-h-screen pb-16 relative select-none text-editorial-dark font-serif overflow-x-hidden" id="wedding-invitation-root">
      
      {/* Dynamic Ambient Blur Background & Neoclassical Columns */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-[#fbfaf8]" id="ambient-dynamic-bg">
        {/* Soft elegant neon-like decorative glowing elements */}
        <div className="absolute top-[10%] left-[5%] w-[45vw] h-[45vw] rounded-full bg-[#E1EDF6]/35 blur-[90px]" />
        <div className="absolute bottom-[20%] right-[10%] w-[40vw] h-[40vw] rounded-full bg-[#E8EFE9]/30 blur-[90px]" />
        <div className="absolute top-[45%] left-[30%] w-[35vw] h-[35vw] rounded-full bg-[#FAF5EF]/45 blur-[80px]" />

        {/* Floating elements styling the background with Pinterest-style petals */}
        {FLOATING_PETALS.map((petal) => (
          <motion.div
            key={petal.id}
            className="absolute"
            style={{
              left: petal.left,
              width: petal.size,
              height: petal.size,
              top: '-10%',
            }}
            animate={{
              y: ['0vh', '110vh'],
              x: [0, petal.sway, -petal.sway, 0],
              rotate: [petal.rotate, petal.rotate + 360],
            }}
            transition={{
              duration: petal.duration,
              repeat: Infinity,
              delay: petal.delay,
              ease: 'linear',
            }}
          >
            {/* Elegant tiny translucent petal design */}
            <svg viewBox="0 0 40 40" className="w-full h-full text-[#B2C5D4]/20 fill-[#B2C5D4]/15">
              <path d="M 20 0 C 10 5, 0 15, 0 25 C 0 32, 8 40, 20 40 C 32 40, 40 32, 40 25 C 40 15, 30 5, 20 0 Z" />
            </svg>
          </motion.div>
        ))}

        {/* Flanking Neoclassical Columns Decor on wider viewports */}
        <div className="fixed left-4 bottom-0 top-24 w-12 lg:w-20 hidden md:block opacity-10 text-editorial-dark" id="left-column-decor">
          <svg viewBox="0 0 100 800" fill="currentColor" className="w-full h-full">
            <rect x="10" y="50" width="80" height="20" rx="3" />
            <rect x="20" y="70" width="60" height="15" />
            <circle cx="20" cy="85" r="12" fill="none" stroke="currentColor" strokeWidth="6" />
            <circle cx="80" cy="85" r="12" fill="none" stroke="currentColor" strokeWidth="6" />
            <path d="M 10 95 Q 50 110, 90 95" stroke="currentColor" strokeWidth="5" fill="none" />
            <line x1="30" y1="105" x2="30" y2="720" stroke="currentColor" strokeWidth="4" />
            <line x1="40" y1="105" x2="40" y2="720" stroke="currentColor" strokeWidth="4" />
            <line x1="50" y1="105" x2="50" y2="720" stroke="currentColor" strokeWidth="4" />
            <line x1="60" y1="105" x2="60" y2="720" stroke="currentColor" strokeWidth="4" />
            <line x1="70" y1="105" x2="70" y2="720" stroke="currentColor" strokeWidth="4" />
            <rect x="25" y="105" width="50" height="615" fill="none" stroke="currentColor" strokeWidth="4" />
            <rect x="20" y="720" width="60" height="15" />
            <rect x="10" y="735" width="80" height="20" rx="3" />
          </svg>
        </div>

        <div className="fixed right-4 bottom-0 top-24 w-12 lg:w-20 hidden md:block opacity-10 text-editorial-dark" id="right-column-decor">
          <svg viewBox="0 0 100 800" fill="currentColor" className="w-full h-full">
            <rect x="10" y="50" width="80" height="20" rx="3" />
            <rect x="20" y="70" width="60" height="15" />
            <circle cx="20" cy="85" r="12" fill="none" stroke="currentColor" strokeWidth="6" />
            <circle cx="80" cy="85" r="12" fill="none" stroke="currentColor" strokeWidth="6" />
            <path d="M 10 95 Q 50 110, 90 95" stroke="currentColor" strokeWidth="5" fill="none" />
            <line x1="30" y1="105" x2="30" y2="720" stroke="currentColor" strokeWidth="4" />
            <line x1="40" y1="105" x2="40" y2="720" stroke="currentColor" strokeWidth="4" />
            <line x1="50" y1="105" x2="50" y2="720" stroke="currentColor" strokeWidth="4" />
            <line x1="60" y1="105" x2="60" y2="720" stroke="currentColor" strokeWidth="4" />
            <line x1="70" y1="105" x2="70" y2="720" stroke="currentColor" strokeWidth="4" />
            <rect x="25" y="105" width="50" height="615" fill="none" stroke="currentColor" strokeWidth="4" />
            <rect x="20" y="720" width="60" height="15" />
            <rect x="10" y="735" width="80" height="20" rx="3" />
          </svg>
        </div>
      </div>

      {/* Content wrapper with relative pos to sit cleanly on top of the fixed layer */}
      <div className="relative z-10 w-full">
        
        {/* 1. Elegant Editorial Sticky Header */}
        <header className="h-24 border-b border-editorial-border/75 flex flex-col sm:flex-row items-center justify-between px-6 sm:px-12 bg-[#fbfaf8]/92 backdrop-blur-md z-30 sticky top-0 shadow-3xs" id="invitation-hero-header">
        <div className="text-xl sm:text-2xl tracking-[0.25em] font-light text-editorial-dark py-2 sm:py-0">06 — 06 — 27</div>
        <h1 className="text-2.5xl sm:text-3xl italic tracking-tight font-medium text-editorial-dark font-serif">Никита & Елизавета</h1>
        <div className="flex gap-4 sm:gap-6 uppercase text-[9px] sm:text-[10px] tracking-[0.3em] font-sans font-bold text-editorial-muted pb-2 sm:pb-0">
          <a href="#program-day-section" className="hover:text-editorial-dark transition-all">Церемония</a>
          <a href="#locations-map-section" className="hover:text-editorial-dark transition-all">Локации</a>
          <a href="#rsvp-submit-card-section" className="hover:text-editorial-dark transition-all">RSVP</a>
        </div>
      </header>

      {/* Hero Banner Section */}
      <section className="relative pt-12 pb-10 px-4 flex flex-col items-center justify-center text-center overflow-hidden bg-gradient-to-b from-white to-editorial-bg/25" id="invitation-hero">
        
        {/* Subtle decorative fine-line pattern overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" className="text-editorial-muted">
            <pattern id="stieglitz-pattern" patternUnits="userSpaceOnUse" width="20" height="20">
              <path d="M0 10 L10 0 L20 10 L10 20 Z" fill="none" stroke="currentColor" strokeWidth="0.25" />
            </pattern>
            <rect width="100" height="100" fill="url(#stieglitz-pattern)" />
          </svg>
        </div>

        <div className="z-10 max-w-md w-full flex flex-col items-center">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[10px] tracking-[0.4em] uppercase text-editorial-accent font-bold mb-3 block font-sans"
          >
            Приглашение на Свадьбу
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-4xl sm:text-5xl font-light italic tracking-tight text-editorial-dark mb-2"
          >
            Никита & Елизавета
          </motion.h2>

          <p className="text-[11px] text-editorial-muted font-sans tracking-[0.3em] mt-1 mb-8 uppercase font-bold">
            06.06.2027 • Санкт-Петербург
          </p>

          {/* Core Couple Polaroid Frame */}
          <motion.div 
            initial={{ opacity: 0, rotate: -3, scale: 0.98 }}
            animate={{ opacity: 1, rotate: -1.5, scale: 1 }}
            transition={{ delay: 0.35, duration: 0.8 }}
            className="bg-white p-5 pb-7 rounded-none border border-editorial-border/60 shadow-md w-72 sm:w-80 relative transform hover:rotate-1 hover:scale-[1.01] transition-transform duration-300"
            id="hero-polaroid-frame"
          >
            {/* Retro sticker/tape mock on top */}
            <div className="tape-sticker absolute -top-4 left-1/2 transform -translate-x-1/2 w-24 h-6 border-slate-100 rounded-sm -rotate-2 flex items-center justify-center pointer-events-none shadow-3xs bg-white/70 backdrop-blur-xs" />

            <div className="w-full aspect-[4/5] bg-editorial-bg rounded-none overflow-hidden border border-editorial-border/30">
              <img 
                src={beachKissImg} 
                alt="Никита и Елизавета Солнечный пляж" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover grayscale-5 hover:grayscale-0 transition-all duration-700"
              />
            </div>
            
            <div className="mt-4 text-center flex flex-col gap-1">
              <span className="font-script text-[13.5px] sm:text-[15.5px] text-editorial-accent font-semibold tracking-wide leading-none block px-1">
                {"Nikita & Elizaveta ♥ Side, Turkey 04.06.26"}
              </span>
              <span className="font-script text-[21px] sm:text-[24px] text-editorial-dark/95 leading-none block mt-1">
                Счастье быть вместе...
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Intro Warm words Card block */}
      <section className="px-4 py-8 max-w-md mx-auto" id="welcome-message-block">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          className="bg-white border border-editorial-border/70 rounded-2xl p-6 sm:p-8 text-center shadow-sm"
        >
          <span className="text-editorial-accent font-serif italic text-lg block mb-3">&ldquo;Любовь — это когда два сердца бьются в одном ритме...&rdquo;</span>
          <p className="text-[13.5px] leading-relaxed text-editorial-slate font-sans">
            Дорогие близкие, друзья и родные! Приглашаем вас разделить с нами невероятное и счастливое событие — рождение нашей новой семьи. Мы будем очень рады встретить этот день в кругу людей, оставивших след в наших сердцах. Подарите нам ваше теплое присутствие!
          </p>
        </motion.div>
      </section>

      {/* Playlist Audio Controller */}
      <section className="px-4 py-4 max-w-md mx-auto" id="music-player-section">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <AudioPlayer />
        </motion.div>
      </section>

      {/* 2. Live Countdown Timer */}
      <section className="px-4 py-6 max-w-md mx-auto" id="countdown-timer-section">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Timer />
        </motion.div>
      </section>

      {/* 3. The Couple Story (Nikita & Elizaveta) */}
      <section className="px-4 py-11 max-w-md mx-auto" id="about-couple-polaroids">
        <div className="text-center mb-8">
          <span className="text-[10px] tracking-[0.4em] uppercase text-editorial-accent font-bold block mb-2 font-sans">Познакомьтесь с нами</span>
          <h2 className="font-serif text-3xl font-light italic tracking-tight text-editorial-dark">Главные Герои</h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Groom Nikita */}
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white p-3.5 pb-5 rounded-none border border-editorial-border/50 shadow-sm flex flex-col justify-between"
            id="groom-polaroid-container"
          >
            <div className="w-full aspect-[1/1.25] bg-editorial-bg rounded-none overflow-hidden mb-3 border border-editorial-border/30">
              <img 
                src={groomImg} 
                alt="Никита жених" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover grayscale-5 hover:grayscale-0 transition-all duration-500"
              />
            </div>
            <div className="text-center pt-1">
              <h4 className="font-script text-[22px] text-editorial-dark leading-tight">Жених Никита</h4>
              <p className="text-[10px] text-editorial-slate font-sans tracking-wide mt-1 leading-relaxed italic">
                Оберегает, любит, поддерживает и ждет встречи у алтаря
              </p>
            </div>
          </motion.div>

          {/* Bride Elizaveta */}
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white p-3.5 pb-5 rounded-none border border-editorial-border/50 shadow-sm flex flex-col justify-between"
            id="bride-polaroid-container"
          >
            <div className="w-full aspect-[1/1.25] bg-editorial-bg rounded-none overflow-hidden mb-3 border border-editorial-border/30">
              <img 
                src={brideImg} 
                alt="Елизавета невеста" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover grayscale-5 hover:grayscale-0 transition-all duration-500"
              />
            </div>
            <div className="text-center pt-1">
              <h4 className="font-script text-[22px] text-editorial-dark leading-tight">Невеста Елизавета</h4>
              <p className="text-[10px] text-editorial-slate font-sans tracking-wide mt-1 leading-relaxed italic">
                Вдохновляет, светит, окутывает лаской и счастьем
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. Day Timeline Schedule */}
      <section className="px-4 py-11 bg-white border-y border-editorial-border/70" id="program-day-section">
        <div className="max-w-md mx-auto w-full">
          <div className="text-center mb-10">
            <span className="text-[10px] tracking-[0.4em] uppercase text-editorial-accent font-bold block mb-2 font-sans">Свадебная программа</span>
            <h2 className="font-serif text-3xl font-light italic tracking-tight text-editorial-dark">Тайминг Дня</h2>
            <div className="h-px w-20 bg-editorial-dark/20 mx-auto mt-3 mb-3"></div>
            <p className="text-xs text-editorial-slate font-sans leading-relaxed">
              План нашего праздничного дня, чтобы вы чувствовали себя гармонично
            </p>
          </div>

          <div className="relative border-l border-editorial-border pl-6 ml-3 space-y-10" id="timeline-list">
            {TIMELINE_EVENTS.map((ev, idx) => {
              const EventIcon = ev.icon;
              return (
                <motion.div 
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  key={ev.time} 
                  className="relative group"
                >
                  {/* Glowing timeline dot */}
                  <div className="absolute -left-10 top-0.5 flex items-center justify-center bg-editorial-bg w-8 h-8 rounded-full border border-editorial-border shadow-3xs group-hover:bg-editorial-dark group-hover:border-editorial-dark transition-all duration-200">
                    <EventIcon size={14} className="text-editorial-slate group-hover:text-white transition-colors" />
                  </div>

                  <span className="text-sm font-bold font-sans text-editorial-accent tracking-widest block mb-0.5">
                    {ev.time}
                  </span>
                  <h4 className="font-serif text-lg text-editorial-dark font-medium leading-tight mb-1.5 flex items-center gap-1.5">
                    {ev.title}
                  </h4>
                  <p className="text-xs text-editorial-slate leading-relaxed font-sans max-w-sm">
                    {ev.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Locations and route Map */}
      <section className="px-4 py-12" id="locations-map-section">
        <div className="text-center mb-8 max-w-md mx-auto">
          <span className="text-[10px] tracking-[0.4em] uppercase text-editorial-accent font-bold block mb-2 font-sans">Как добраться</span>
          <h2 className="font-serif text-3xl font-light italic tracking-tight text-editorial-dark">Карта Локаций</h2>
          <p className="text-xs text-editorial-slate mt-2.5 font-sans leading-relaxed">
            Мы подобрали знаковые исторические места. Нажмите на гео-метки ниже, чтобы узнать детали и легко составить маршрут через любимый навигатор.
          </p>
        </div>

        <InteractiveMap />
      </section>

      {/* 6. Dress Code and Palette */}
      <section className="px-4 py-11 bg-white border-y border-editorial-border/70" id="dress-code-section">
        <div className="max-w-md mx-auto text-center">
          <span className="text-[10px] tracking-[0.4em] uppercase text-editorial-accent font-bold block mb-2 font-sans">Стиль гостей</span>
          <h2 className="font-serif text-3xl font-light italic tracking-tight text-editorial-dark">Дресс-Код</h2>
          <p className="text-xs text-editorial-slate mt-3 leading-relaxed font-sans">
            Мы будем очень признательны, если при выборе праздничных нарядов вы поддержите гармоничную, элегантную палитру нашего торжества. Это вдохновит нас и украсит фотосессию в Академии Штиглица!
          </p>

          {/* Beads Palette Grid */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-7" id="color-palette-beads">
            {COL_PALETTE.map((color) => (
              <motion.div 
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                key={color.hex} 
                className="flex flex-col items-center"
              >
                <div 
                  className="w-11 h-11 rounded-full border border-editorial-border/50 shadow-xs relative mb-2 flex items-center justify-center text-white"
                  style={{ backgroundColor: color.hex }}
                >
                  {/* Subtle color highlight dot */}
                  <div className="w-2.5 h-2.5 bg-white/20 rounded-full"></div>
                </div>
                <span className="text-[9.5px] font-bold text-editorial-slate uppercase tracking-widest leading-none max-w-[80px] font-sans">
                  {color.name.split(' ')[0]}
                </span>
              </motion.div>
            ))}
          </div>

          <div className="bg-[#FAF5EF] p-5 rounded-xl border border-editorial-border text-[11px] text-editorial-slate mt-8 italic font-sans max-w-sm mx-auto leading-relaxed">
            📋 Стиль приветствуется: Коктейльный шик, легкие летящие ткани, пастельное кружево и классика. Просим воздержаться от ярких неоновых цветов и чисто черного платья.
          </div>
        </div>
      </section>

      {/* 7. Details & Checklist Rules */}
      <section className="px-4 py-11 max-w-md mx-auto" id="checklist-faq-section">
        <div className="text-center mb-8">
          <span className="text-[10px] tracking-[0.4em] uppercase text-editorial-accent font-bold block mb-2 font-sans">Важно знать</span>
          <h2 className="font-serif text-3xl font-light italic tracking-tight text-editorial-dark">Полезные Детали</h2>
        </div>

        <div className="space-y-4">
          {/* Rules Items */}
          <div className="bg-white border border-editorial-border/60 rounded-2xl p-5 flex gap-4 shadow-sm">
            <div className="w-9 h-9 rounded-full bg-editorial-bg flex items-center justify-center text-editorial-accent shrink-0 border border-editorial-border/30">
              <Flower2 size={16} />
            </div>
            <div>
              <h4 className="font-serif text-sm font-semibold text-editorial-dark">Цветы</h4>
              <p className="text-[12px] text-editorial-slate mt-1.5 leading-relaxed font-sans">
                Пожалуйста, не дарите нам пышные срезанные букеты. Сразу после торжества мы уезжаем во вдохновляющее свадебное путешествие и не успеем насладиться их ароматной красотой. Если вы хотите сделать подарок в этом ключе, мы будем рады получить комнатные цветы в аккуратных стильных горшочках или книги о искусстве для нашей библиотеки.
              </p>
            </div>
          </div>

          <div className="bg-white border border-editorial-border/60 rounded-2xl p-5 flex gap-4 shadow-sm">
            <div className="w-9 h-9 rounded-full bg-editorial-bg flex items-center justify-center text-editorial-accent shrink-0 border border-editorial-border/30">
              <Gift size={16} />
            </div>
            <div>
              <h4 className="font-serif text-sm font-semibold text-editorial-dark">Подарки</h4>
              <p className="text-[12px] text-editorial-slate mt-1.5 leading-relaxed font-sans">
                Ваше присутствие и поддержка — уже самый главный подарок для наших сердец! Однако, если вы хотите преподнести свадебный подарок материально, мы будем восторженно признательны за вклад в конвертах в наш общий семейный накопительный фонд.
              </p>
            </div>
          </div>

          <div className="bg-white border border-editorial-border/60 rounded-2xl p-5 flex gap-4 shadow-sm">
            <div className="w-9 h-9 rounded-full bg-editorial-bg flex items-center justify-center text-editorial-accent shrink-0 border border-editorial-border/30">
              <Info size={16} />
            </div>
            <div>
              <h4 className="font-serif text-sm font-semibold text-editorial-dark">Групповой трансфер</h4>
              <p className="text-[12px] text-editorial-slate mt-1.5 leading-relaxed font-sans">
                Для вашего максимального удобства, мы организуем комфортный трансфер прямо от ворот ЗАГСа №2 после завершения церемонии до дверей фотосессии. Пожалуйста, отметьте в RSVP форме ниже, если вам потребуется это место!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Confirm Formrsvp Section */}
      <section className="px-4 py-11 bg-white border-y border-editorial-border/70" id="rsvp-submit-card-section">
        <RSVPForm />
      </section>



      {/* 10. Elegant Footer */}
      <footer className="mt-16 text-center px-4 pb-8" id="invitation-footer">
        <p className="font-script text-3xl text-editorial-dark leading-normal">
          До встречи на лучшем празднике!
        </p>
        <p className="text-[10px] text-editorial-muted font-sans font-bold uppercase tracking-[0.3em] mt-3.5">
          С любовью, Никита и Елизавета
        </p>
        <div className="flex justify-center items-center gap-1.5 mt-5 text-editorial-muted">
          <Heart size={12} className="text-[#a7bcd0] fill-[#d1e5f8]" />
          <span className="text-[10px] font-sans">06.06.2027</span>
        </div>
      </footer>
      </div> {/* Closing content wrapper */}
    </div>
  );
}
