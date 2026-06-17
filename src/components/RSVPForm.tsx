/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Loader2, GlassWater, Landmark, Users, MessageSquare, Sparkles, Feather } from 'lucide-react';

const DRINK_OPTIONS = [
  "Шампанское (Champagne)",
  "Белое вино (White Wine)",
  "Красное вино (Red Wine)",
  "Виски / Коньяк (Whiskey / Cognac)",
  "Джин / Тоник (Gin / Tonic)",
  "Безалкогольные напитки (Non-alcoholic)"
];

const COLOR_TINTS = [
  { key: 'dustyBlue', name: 'Синее кружево', color: 'bg-[#E1EDF6] border-[#AAC2D5]' },
  { key: 'mintSage', name: 'Зеленый шалфей', color: 'bg-[#E8EFE9] border-[#B7CEB9]' },
  { key: 'lavenderDust', name: 'Лаванда', color: 'bg-[#ECE7F2] border-[#CAB8DC]' },
  { key: 'sandCream', name: 'Ванильный крем', color: 'bg-[#FAF5EF] border-[#E8CEB7]' }
];

export default function RSVPForm() {
  const [name, setName] = useState('');
  const [attending, setAttending] = useState<boolean | null>(null);
  const [guestsCount, setGuestsCount] = useState<number>(0);
  const [drinks, setDrinks] = useState<string[]>([]);
  const [dietary, setDietary] = useState('');
  const [transport, setTransport] = useState<boolean>(false);
  
  // New States integrated for unified wishing + comments section
  const [wishMessage, setWishMessage] = useState('');
  const [selectedColor, setSelectedColor] = useState('dustyBlue');

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorText, setErrorText] = useState('');

  const handleDrinkToggle = (drink: string) => {
    if (drinks.includes(drink)) {
      setDrinks(drinks.filter((d) => d !== drink));
    } else {
      setDrinks([...drinks, drink]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorText('Пожалуйста, введите ваше имя');
      return;
    }
    if (attending === null) {
      setErrorText('Пожалуйста, подтвердите ваше присутствие');
      return;
    }

    setIsLoading(true);
    setErrorText('');

    const rsvpData = {
      name: name.trim(),
      attending: attending,
      guestsCount: attending ? Number(guestsCount) : 0,
      drinks: attending ? drinks : [],
      dietary: attending ? dietary.trim() : '',
      transport: attending ? transport : false,
      createdAt: serverTimestamp(),
    };

    const collectionPath = 'rsvps';
    try {
      // 1. Add doc to rsvps collection in Firestore
      await addDoc(collection(db, collectionPath), rsvpData);
      
      // 2. Synthesize RSVP comment / congratulations into the public Wishes collection
      if (wishMessage.trim()) {
        const wishData = {
          author: name.trim(),
          message: wishMessage.trim(),
          colorKey: selectedColor,
          createdAt: serverTimestamp()
        };
        await addDoc(collection(db, 'wishes'), wishData);
      }
      
      setIsSubmitted(true);
    } catch (error) {
      setErrorText('Произошла ошибка при отправке. Пожалуйста, попробуйте еще раз.');
      handleFirestoreError(error, OperationType.CREATE, collectionPath);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border border-editorial-border/80 rounded-2xl p-6 sm:p-8 shadow-sm max-w-lg mx-auto w-full" id="rsvp-section-card">
      <div className="text-center mb-6">
        <span className="text-[10px] tracking-[0.4em] uppercase text-editorial-accent font-bold block mb-1 font-sans">R S V P</span>
        <h3 className="font-serif text-2.5xl font-light italic tracking-tight text-editorial-dark">Подтверждение Участия</h3>
        <p className="text-[11px] text-editorial-slate mt-2 font-sans leading-relaxed">
          Пожалуйста, подтвердите ваше участие до 1 мая 2027 года и оставьте поздравления нашей будущей семье!
        </p>
      </div>

      <AnimatePresence mode="wait">
        {isSubmitted ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center text-center py-8"
            id="rsvp-success-message"
          >
            <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 border border-emerald-100 shadow-xs mb-4">
              <Check size={28} className="stroke-[2.5]" />
            </div>
            <h4 className="font-serif text-lg text-slate-800 font-medium">Ответ успешно отправлен!</h4>
            <p className="text-xs text-slate-500 mt-2 max-w-xs leading-relaxed font-sans">
              Спасибо, {name}! {attending ? 'Ваши предпочтения учтены. С нетерпением ждем вас на нашем празднике!' : 'Очень жаль, что вы не сможете прийти. Искренне благодарим вас за пожелания!'}
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5" id="rsvp-form">
            {/* Guest Name */}
            <div>
              <label htmlFor="guest-name" className="block text-[10px] font-bold text-editorial-slate uppercase tracking-[0.2em] mb-2 font-sans">
                Ваше Имя и Фамилия
              </label>
              <input
                type="text"
                id="guest-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Иван Иванов"
                className="w-full bg-editorial-soft-bg hover:bg-white border border-editorial-border/60 rounded-xl px-4 py-3 text-editorial-dark text-[13.5px] placeholder-editorial-muted/50 focus:outline-none focus:ring-1 focus:ring-editorial-accent focus:border-editorial-accent transition-all font-sans italic"
                required
              />
            </div>

            {/* Attendance Toggle */}
            <div>
              <label className="block text-[10px] font-bold text-editorial-slate uppercase tracking-[0.2em] mb-2 font-sans">
                Будете ли вы присутствовать?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setAttending(true);
                    setErrorText('');
                  }}
                  className={`py-3 px-4 rounded-xl border text-[11px] uppercase tracking-[0.15em] font-bold font-sans transition-all ${
                    attending === true
                      ? 'bg-editorial-dark text-white border-editorial-dark shadow-sm'
                      : 'bg-editorial-soft-bg text-editorial-slate border-editorial-border/60 hover:bg-editorial-light-border'
                  }`}
                  id="rsvp-attend-true-btn"
                >
                  Да, буду!
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAttending(false);
                    setErrorText('');
                  }}
                  className={`py-3 px-4 rounded-xl border text-[11px] uppercase tracking-[0.15em] font-bold font-sans transition-all ${
                    attending === false
                      ? 'bg-editorial-accent text-white border-editorial-accent shadow-sm'
                      : 'bg-editorial-soft-bg text-editorial-slate border-editorial-border/60 hover:bg-editorial-light-border'
                  }`}
                  id="rsvp-attend-false-btn"
                >
                  Не смогу прийти
                </button>
              </div>
            </div>

            {/* Conditional RSVP options if guest confirms presence */}
            <AnimatePresence>
              {attending === true && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5 overflow-hidden"
                  id="rsvp-conditional-options"
                >
                  {/* Plus One Selector */}
                  <div className="pt-2">
                    <label htmlFor="guests-count" className="flex items-center gap-1.5 text-[10px] font-bold text-editorial-slate uppercase tracking-[0.15em] mb-2 font-sans">
                      <Users size={14} className="text-editorial-accent" />
                      Количество человек с вами (плюс-один)
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        id="guests-count"
                        min="0"
                        max="5"
                        value={guestsCount}
                        onChange={(e) => setGuestsCount(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-20 bg-editorial-soft-bg border border-editorial-border/60 rounded-xl px-3 py-2 text-editorial-dark text-center text-[14px] font-mono focus:outline-none focus:ring-1 focus:ring-editorial-accent"
                      />
                      <span className="text-[12px] text-editorial-slate font-sans">персона(ы)</span>
                    </div>
                  </div>

                  {/* Drink Preferences Checkboxes */}
                  <div>
                    <label className="flex items-center gap-1.5 text-[10px] font-bold text-editorial-slate uppercase tracking-[0.15em] mb-2 font-sans">
                      <GlassWater size={14} className="text-editorial-accent" />
                      Ваши предпочтения по напиткам:
                    </label>
                    <div className="space-y-1.5 pl-0.5">
                      {DRINK_OPTIONS.map((drink) => (
                        <label 
                          key={drink} 
                          className="flex items-center gap-3 cursor-pointer select-none py-1.5 hover:opacity-85 text-[13px] text-editorial-dark font-sans"
                        >
                          <input
                            type="checkbox"
                            checked={drinks.includes(drink)}
                            onChange={() => handleDrinkToggle(drink)}
                            className="w-4 h-4 rounded-sm border-editorial-border text-editorial-dark accent-editorial-accent focus:ring-editorial-accent"
                          />
                          <span>{drink}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Transfer Choice */}
                  <div>
                    <label className="flex items-center gap-1.5 text-[10px] font-bold text-editorial-slate uppercase tracking-[0.15em] mb-2 font-sans">
                      <Landmark size={14} className="text-editorial-accent" />
                      Понадобится ли вам трансфер?
                    </label>
                    <p className="text-[11px] text-editorial-muted mb-2.5 leading-relaxed font-sans">
                      Мы организуем групповой автобус от ЗАГСа №2 (Фурштатская, 52) до места проведения фотосессии/торжества.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <label className="flex items-center gap-2 text-[12.5px] text-editorial-dark cursor-pointer">
                        <input
                          type="radio"
                          name="transport"
                          checked={transport === true}
                          onChange={() => setTransport(true)}
                          className="w-4 h-4 text-editorial-dark accent-editorial-accent focus:ring-editorial-accent"
                        />
                        <span>Да, мне нужен трансфер</span>
                      </label>
                      <label className="flex items-center gap-2 text-[12.5px] text-editorial-dark cursor-pointer">
                        <input
                          type="radio"
                          name="transport"
                          checked={transport === false}
                          onChange={() => setTransport(false)}
                          className="w-4 h-4 text-editorial-dark accent-editorial-accent focus:ring-editorial-accent"
                        />
                        <span>Нет, приеду самостоятельно</span>
                      </label>
                    </div>
                  </div>

                  {/* Dietary Requirements */}
                  <div>
                    <label htmlFor="dietary-notes" className="flex items-center gap-1.5 text-[10px] font-bold text-editorial-slate uppercase tracking-[0.15em] mb-2 font-sans">
                      <MessageSquare size={14} className="text-editorial-accent" />
                      Пожелания по кухне / ограничения в еде
                    </label>
                    <textarea
                      id="dietary-notes"
                      rows={2}
                      value={dietary}
                      onChange={(e) => setDietary(e.target.value)}
                      placeholder="Например: аллергия на орехи, вегетарианец, веган и т.д."
                      className="w-full bg-editorial-soft-bg border border-editorial-border/60 rounded-xl px-4 py-2 text-editorial-dark text-[13px] placeholder-editorial-muted/50 focus:outline-none focus:ring-1 focus:ring-editorial-accent font-sans italic"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Expanded section: Wedding Wish & Card tint configuration */}
            <div className="border-t border-editorial-border/50 pt-5 mt-4">
              <label htmlFor="wish-message" className="flex items-center gap-1.5 text-[10px] font-bold text-editorial-slate uppercase tracking-[0.15em] mb-2 font-sans">
                <Feather size={14} className="text-editorial-accent" />
                Ваши тёплые пожелания и напутствия молодожёнам (по желанию):
              </label>
              <textarea
                id="wish-message"
                rows={3}
                value={wishMessage}
                onChange={(e) => setWishMessage(e.target.value)}
                placeholder="Дорогие Никита и Елизавета! Поздравляем вас с этим счастливым жизненным событием..."
                className="w-full bg-editorial-soft-bg border border-editorial-border/60 rounded-xl px-4 py-3 text-editorial-dark text-[13px] placeholder-editorial-muted/50 focus:outline-none focus:ring-1 focus:ring-editorial-accent font-sans italic leading-relaxed"
              />
              
              {wishMessage.trim() && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3"
                >
                  <label className="block text-[10px] font-bold text-editorial-slate uppercase tracking-[0.15em] mb-2 font-sans">
                    Выберите цвет вашей поздравительной открытки:
                  </label>
                  <div className="flex gap-2.5">
                    {COLOR_TINTS.map((tint) => (
                      <button
                        key={tint.key}
                        type="button"
                        onClick={() => setSelectedColor(tint.key)}
                        className={`w-7 h-7 rounded-full border shadow-2xs transition-transform duration-200 flex items-center justify-center cursor-pointer ${
                          selectedColor === tint.key ? 'scale-110 ring-1 ring-offset-1 ring-slate-400' : 'hover:scale-105'
                        } ${tint.color}`}
                        title={tint.name}
                      >
                        {selectedColor === tint.key && (
                          <Check size={11} className="text-slate-600 font-bold" />
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Error Message */}
            {errorText && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-rose-500 font-medium font-sans text-center mt-1"
                id="rsvp-error-text"
              >
                {errorText}
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-editorial-dark hover:bg-black/95 disabled:bg-slate-300 text-white font-sans font-bold py-3.5 px-4 rounded-xl text-xs uppercase tracking-[0.25em] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-[0.98]"
              id="rsvp-submit-btn"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Отправка ответа...</span>
                </>
              ) : (
                <span className="flex items-center gap-1.5 justify-center">
                  <Sparkles size={13} />
                  Подтвердить регистрацию
                </span>
              )}
            </button>
          </form>
        )}
      </AnimatePresence>
    </div>
  );
}
