/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isCompleted: boolean;
}

export default function Timer() {
  const targetDate = new Date('2027-06-06T12:20:00+03:00'); // Wedding Registry time (12:20 MSK)

  const calculateTimeLeft = (): TimeLeft => {
    const difference = +targetDate - +new Date();
    let timeLeft: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0, isCompleted: false };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isCompleted: false,
      };
    } else {
      timeLeft.isCompleted = true;
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeBlocks = [
    { label: 'Дней', value: timeLeft.days },
    { label: 'Часов', value: timeLeft.hours },
    { label: 'Минут', value: timeLeft.minutes },
    { label: 'Секунд', value: timeLeft.seconds },
  ];

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white border border-editorial-border/80 rounded-2xl shadow-sm max-w-lg mx-auto" id="wedding-timer-container">
      <h3 className="font-sans text-editorial-accent text-[10px] tracking-[0.4em] uppercase font-bold mb-5">До счастливого момента осталось:</h3>
      
      {timeLeft.isCompleted ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="font-serif text-xl md:text-2xl text-editorial-dark italic text-center py-2"
        >
          ✨ Этот счастливый день настал! ✨
        </motion.div>
      ) : (
        <div className="grid grid-cols-4 gap-3 sm:gap-4 w-full">
          {timeBlocks.map((block, index) => (
            <div 
              key={block.label} 
              className="flex flex-col items-center justify-center py-4 bg-editorial-bg border border-editorial-border/60 rounded-none shadow-3xs"
              id={`timer-block-${index}`}
            >
              <motion.div 
                key={block.value}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="font-serif text-2.5xl sm:text-4xl text-editorial-dark font-light leading-none"
              >
                {String(block.value).padStart(2, '0')}
              </motion.div>
              <div className="text-[9px] text-editorial-slate uppercase tracking-[0.2em] mt-2 font-sans font-bold leading-none">
                {block.label}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="h-px w-16 bg-editorial-dark/15 mt-5 mb-3.5"></div>
      <p className="text-[11px] text-editorial-muted font-sans font-semibold uppercase tracking-[0.2em]">
        Суббота, 6 июня 2027 года
      </p>
    </div>
  );
}
