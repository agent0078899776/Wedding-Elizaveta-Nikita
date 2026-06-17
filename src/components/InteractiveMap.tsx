/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { MapPin, Navigation, Compass, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LocationItem } from '../types';

// Let's import our custom real photographic venue assets we generated!
import zagsImage from '../assets/images/zags_real_1781524835530.jpg';
import stieglitzImage from '../assets/images/stieglitz_real_1781524850626.jpg';

const LOCATIONS: LocationItem[] = [
  {
    id: 'zags',
    name: 'Дворец Бракосочетания №2',
    address: 'Санкт-Петербург, Фурштатская ул., д. 52',
    yandexUrl: 'https://yandex.ru/maps/org/1125299482/',
    googleUrl: 'https://www.google.com/maps/search/?api=1&query=Дворец+Бракосочетания+2+Санкт-Петербург+Фурштатская+52',
    description: 'Один из красивейших дворцов бракосочетания Санкт-Петербурга. Величественный особняк XIX века, украшенный богатой лепниной, золотыми элементами, великолепной парадной лестницей и царскими интерьерами. Здесь состоится торжественная регистрация брака Никиты и Елизаветы.',
    accentTitle: 'Регистрация брака',
    details: [
      'Сбор гостей во дворце: 11:40',
      'Начало торжественной регистрации: 12:20',
      'Дресс-код: Elegant / Soft dusty color palette'
    ],
    image: zagsImage,
    coordinates: { lat: 80, lng: 130 } // relative coordinates for SVG
  },
  {
    id: 'stieglitz',
    name: 'Академия им. А.Л. Штиглица',
    address: 'Санкт-Петербург, Соляной пер., д. 13-15',
    yandexUrl: 'https://yandex.ru/maps/org/1020268523/',
    googleUrl: 'https://www.google.com/maps/search/?api=1&query=Академия+Штиглица+Соляной+переулок+13',
    description: 'Старейшая художественно-промышленная академия, вдохновленная лучшими произведениями итальянского Возрождения. Роскошный Большой выставочный зал со стеклянным куполом, величественные мраморные колоннады и невероятная игра света. Здесь пройдет свадебная фотосессия.',
    accentTitle: 'Свадебная фотосессия',
    details: [
      'Начало фотосессии в залах: 14:10',
      'Трансфер для гостей будет организован от ЗАГСа №2 до Академии в 13:10',
      'Невероятная атмосфера петербургского неоренессанса'
    ],
    image: stieglitzImage,
    coordinates: { lat: 140, lng: 70 } // relative coordinates for SVG
  }
];

export default function InteractiveMap() {
  const [selectedId, setSelectedId] = useState<'zags' | 'stieglitz'>('zags');

  const activeLoc = LOCATIONS.find((l) => l.id === selectedId) || LOCATIONS[0];

  return (
    <div className="bg-slate-50/55 border border-slate-200/50 backdrop-blur-md rounded-3xl p-5 sm:p-7 max-w-4xl mx-auto w-full shadow-sm" id="interactive-map-container">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Custom Schematic Map Vector & Tabs */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-1">
            <Compass className="text-slate-400 animate-spin-slow" size={18} />
            <span className="text-[10px] tracking-[0.25em] uppercase text-slate-400 font-semibold block">Локации торжества</span>
          </div>

          {/* Styled schematic map card */}
          <div className="relative w-full h-52 bg-[#E6EFF6]/60 rounded-2xl border border-slate-200 shadow-3xs overflow-hidden flex items-center justify-center">
            {/* Drawn River Neva */}
            <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full text-[#BDD8EE]/60" fill="none" stroke="currentColor" strokeWidth="15" strokeLinecap="round">
              {/* Neva river curved line */}
              <path d="M 0 35 Q 85 45, 120 100 T 200 135" />
              {/* Fontanka river line */}
              <path d="M 120 100 Q 110 130, 80 175" stroke="#ABCBE5/70" strokeWidth="6" />
            </svg>

            {/* Custom watercolor textures / grid markings */}
            <span className="absolute bottom-2 left-3 text-[9px] font-mono tracking-widest text-slate-400 uppercase">С.-Петербург</span>
            <span className="absolute top-2 right-3 text-[9px] font-mono tracking-widest text-slate-400 uppercase">Нева / Фонтанка</span>

            {/* Pulse Indicator Pins */}
            {LOCATIONS.map((loc) => (
              <button
                key={loc.id}
                onClick={() => setSelectedId(loc.id)}
                className="absolute transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2 focus:outline-none cursor-pointer group"
                style={{ top: `${loc.coordinates.lat}px`, left: `${loc.coordinates.lng}px` }}
              >
                {/* Ping shadow */}
                <span className={`absolute inline-flex h-6 w-6 rounded-full opacity-65 animate-ping ${
                  selectedId === loc.id ? 'bg-slate-400/80' : 'bg-slate-300/40'
                }`}></span>
                
                {/* Pin pincircle */}
                <div className={`relative flex items-center justify-center w-8 h-8 rounded-full border shadow-sm transition-all duration-300 ${
                  selectedId === loc.id 
                    ? 'bg-slate-700 text-white border-slate-700 scale-110' 
                    : 'bg-white text-slate-600 border-slate-300 hover:scale-105'
                }`}>
                  <MapPin size={15} />
                </div>

                {/* Micro Label */}
                <div className="absolute top-9 left-1/2 transform -translate-x-1/2 bg-slate-900/80 backdrop-blur-md text-white font-serif text-[9px] px-1.5 py-0.5 rounded-sm whitespace-nowrap shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {loc.id === 'zags' ? 'ЗАГС №2' : 'Акад. Штиглица'}
                </div>
              </button>
            ))}
          </div>

          {/* Quick tab switchers */}
          <div className="flex flex-col gap-2 w-full">
            {LOCATIONS.map((loc) => (
              <button
                key={loc.id}
                onClick={() => setSelectedId(loc.id)}
                className={`p-3.5 rounded-xl border text-left transition-all duration-200 flex items-center justify-between cursor-pointer ${
                  selectedId === loc.id 
                    ? 'bg-slate-700/95 border-slate-700 text-white shadow-xs' 
                    : 'bg-white/80 border-slate-200/75 text-slate-700 hover:bg-slate-50'
                }`}
                id={`map-tab-${loc.id}`}
              >
                <div>
                  <span className={`text-[9px] uppercase tracking-wider block font-semibold mb-0.5 ${
                    selectedId === loc.id ? 'text-slate-300' : 'text-slate-400'
                  }`}>
                    {loc.accentTitle}
                  </span>
                  <h4 className="font-serif text-[13.5px] font-medium leading-tight truncate max-w-[200px] sm:max-w-xs">{loc.name}</h4>
                </div>
                <MapPin size={15} className={selectedId === loc.id ? 'text-slate-200' : 'text-slate-400'} />
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Venue Card Details */}
        <div className="lg:col-span-7 bg-white/95 border border-slate-200/50 rounded-2xl p-4 sm:p-5 shadow-2xs">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeLoc.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
              id="map-detail-card"
            >
              {/* Elegant generated picture of the venue */}
              <div className="relative w-full h-44 sm:h-52 bg-slate-100 rounded-xl overflow-hidden border border-slate-100 shadow-inner">
                <img
                  src={activeLoc.image}
                  alt={activeLoc.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover grayscale-15 transition-transform duration-500 hover:scale-102"
                />
                {/* Graphic filter overlay */}
                <div className="absolute inset-0 bg-slate-900/10 mix-blend-multiply"></div>
                <div className="absolute top-2.5 right-2.5 bg-slate-950/70 backdrop-blur-md text-white font-serif text-[10px] px-2.5 py-0.5 rounded-full shadow-sm uppercase tracking-widest">
                  {activeLoc.id === 'zags' ? 'РЕГИСТРАЦИЯ' : 'ФОТОСЕССИЯ'}
                </div>
              </div>

              {/* Text descriptions */}
              <div>
                <h3 className="font-serif text-lg text-slate-800 font-semibold leading-snug">{activeLoc.name}</h3>
                <p className="text-[11px] text-slate-400 font-mono mt-1 flex items-center gap-1">
                  <MapPin size={11} className="text-slate-400" />
                  {activeLoc.address}
                </p>
                <p className="text-xs text-slate-600 mt-2.5 font-sans leading-relaxed">{activeLoc.description}</p>
              </div>

              {/* Little bullet details (timing, transfers etc) */}
              <div className="bg-slate-50/60 p-3 sm:p-3.5 rounded-xl border border-slate-100 space-y-1">
                {activeLoc.details.map((detail, index) => (
                  <div key={index} className="text-[11.5px] text-slate-600 font-sans flex items-start gap-1.5">
                    <span className="text-slate-400 select-none">•</span>
                    <span>{detail}</span>
                  </div>
                ))}
              </div>

              {/* Navigation Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <a
                  href={activeLoc.yandexUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-800 text-white font-serif text-[13px] rounded-lg cursor-pointer transition-colors shadow-2xs"
                  id={`route-btn-yandex-${activeLoc.id}`}
                >
                  <Navigation size={14} className="transform rotate-45" />
                  <span>Яндекс Навигатор</span>
                  <ExternalLink size={11} className="opacity-70" />
                </a>
                
                <a
                  href={activeLoc.googleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-serif text-[13px] rounded-lg cursor-pointer transition-colors shadow-3xs"
                  id={`route-btn-google-${activeLoc.id}`}
                >
                  <Navigation size={14} className="text-slate-400" />
                  <span>Google Карты</span>
                  <ExternalLink size={11} className="opacity-60" />
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
