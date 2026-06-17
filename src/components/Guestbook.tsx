/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Wish } from '../types';
import { motion } from 'motion/react';

const COLOR_TINTS = [
  { key: 'dustyBlue', name: 'Синее кружево', bgClass: 'bg-[#E1EDF6] text-slate-800 border-[#C5D9EB]' },
  { key: 'mintSage', name: 'Зеленый шалфей', bgClass: 'bg-[#E8EFE9] text-emerald-900 border-[#CDDDCE]' },
  { key: 'lavenderDust', name: 'Лаванда', bgClass: 'bg-[#ECE7F2] text-indigo-950 border-[#D8CEE6]' },
  { key: 'sandCream', name: 'Ванильный крем', bgClass: 'bg-[#FAF5EF] text-amber-950 border-[#EFE2D2]' }
];

export default function Guestbook() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const collectionPath = 'wishes';

  // Listen to wishes real-time as per guidelines
  useEffect(() => {
    const q = query(collection(db, collectionPath), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: Wish[] = [];
        snapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() } as Wish);
        });
        setWishes(list);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, collectionPath);
      }
    );

    return () => unsubscribe();
  }, []);

  const getBgClass = (key?: string) => {
    const tint = COLOR_TINTS.find((t) => t.key === key);
    return tint ? tint.bgClass : COLOR_TINTS[0].bgClass;
  };

  return (
    <div className="max-w-4xl mx-auto w-full px-4" id="guestbook-section-container">
      <div className="text-center mb-8">
        <span className="text-[10px] tracking-[0.4em] uppercase text-editorial-accent font-bold block mb-2 font-sans">Книга Пожеланий</span>
        <h3 className="font-serif text-3xl font-light italic tracking-tight text-editorial-dark">Пожелания гостей</h3>
        <p className="text-xs text-editorial-slate mt-2.5 font-sans max-w-md mx-auto leading-relaxed">
          Теплые слова и напутствия от наших дорогих гостей, отправленные вместе с подтверждением участия.
        </p>
      </div>

      {/* Masonry/Grid of Wishes */}
      {wishes.length === 0 ? (
        <div className="text-center py-10 bg-slate-50/40 rounded-2xl border border-slate-100 max-w-md mx-auto">
          <p className="text-xs text-slate-400 italic font-sans">
            Список пожеланий пока пуст. Заполните форму подтверждения участия выше, чтобы оставить первое пожелание!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6" id="wishes-grid">
          {wishes.map((wish, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: Math.min(idx * 0.05, 0.5) }}
              key={wish.id || idx}
              className={`p-5 rounded-2xl border shadow-2xs relative flex flex-col justify-between transition-transform duration-300 hover:scale-[1.02] ${getBgClass(
                wish.colorKey
              )}`}
              id={`wish-card-${wish.id}`}
            >
              {/* Retro decorative sticky tape on top */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-16 h-5.5 bg-white/40 border border-white/20 backdrop-blur-3xs rounded-xs rotate-[-2deg] flex items-center justify-center pointer-events-none shadow-3xs"></div>
              
              <div className="pt-2">
                <p className="font-serif text-[13.5px] leading-relaxed whitespace-pre-wrap italic">
                  &ldquo;{wish.message}&rdquo;
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-black/5 flex flex-col items-end">
                <span className="font-serif text-sm font-semibold tracking-wide">
                  — {wish.author}
                </span>
                <span className="text-[10px] opacity-50 mt-0.5 font-mono">
                  {wish.createdAt ? new Date(wish.createdAt.toDate ? wish.createdAt.toDate() : wish.createdAt).toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  }) : 'Июнь 2027'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
