/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Music, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Track {
  title: string;
  artist: string;
  url: string;
}

const PLAYLIST: Track[] = [
  {
    title: "Цветочки",
    artist: "Антоха MC",
    // Ссылка на локальный MP3 файл, который пользователь может загрузить в папку public
    url: `${import.meta.env.BASE_URL}antoha_mc_cvetochki.mp3`
  },
  {
    title: "Невский Вальс (Piano Cover)",
    artist: "Acoustic Wedding Piano",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    title: "Мечты на Дворцовой",
    artist: "Romantic Guitar Loops",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  }
];

export default function AudioPlayer() {
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [fallbackLoad, setFallbackLoad] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);

  const activeTrack = PLAYLIST[trackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    // Reset state on track change
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setFallbackLoad(null);
  }, [trackIndex]);

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.log("Audio play deferred due to browser user-gesture restrictions:", err);
      });
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration);
  };

  const handleAudioError = () => {
    // If the custom mp3 failed to load, fallback to a working public track so the player still plays
    if (activeTrack.url.includes("antoha_mc_cvetochki.mp3") && !fallbackLoad) {
      console.log("Custom mp3 'antoha_mc_cvetochki.mp3' not found. Falling back to default backup audio.");
      setFallbackLoad("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3");
    }
  };

  // Automatically trigger play if it was already playing and we fell back
  useEffect(() => {
    if (fallbackLoad && audioRef.current) {
      // Force reload the new audio source
      audioRef.current.load();
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.log("Auto-play fallback failed or deferred:", err);
      });
    }
  }, [fallbackLoad]);

  const handleTrackEnd = () => {
    handleNext();
  };

  const handleNext = () => {
    setTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
  };

  const handlePrev = () => {
    setTrackIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !progressRef.current || duration === 0) return;
    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newTime = (clickX / width) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="flex flex-col p-6 bg-white border border-editorial-border/80 rounded-2xl shadow-sm max-w-lg mx-auto w-full" id="audio-player-container">
      <audio
        ref={audioRef}
        src={fallbackLoad || activeTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleTrackEnd}
        onError={handleAudioError}
      />

      <div className="flex items-center gap-5">
        {/* Vinyl Disc Container */}
        <div className="relative w-20 h-20 flex-shrink-0 bg-slate-900 rounded-full flex items-center justify-center border-2 border-slate-700 shadow-md">
          {/* Groove Rings */}
          <div className="absolute inset-2 border border-slate-800 rounded-full opacity-40"></div>
          <div className="absolute inset-4 border border-slate-800 rounded-full opacity-30"></div>
          <div className="absolute inset-6 border border-slate-800 rounded-full opacity-20"></div>
          
          {/* Vinyl center sticker */}
          <motion.div 
            animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
            transition={isPlaying ? { repeat: Infinity, duration: 8, ease: "linear" } : { duration: 0.5 }}
            className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center text-slate-800 shadow-inner"
          >
            <Music size={14} className="text-slate-600 animate-pulse" />
          </motion.div>
          
          {/* Tiny turntable arm */}
          <div className="absolute -top-1 -right-1 w-4 h-8 origin-top-left transform rotate-12 transition-transform duration-500 pointer-events-none">
            <svg viewBox="0 0 10 20" className="w-full h-full text-slate-400">
              <path d="M 0 0 L 6 4 L 7 14 L 3 17" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>
        </div>

        {/* Details and Actions */}
        <div className="flex-grow min-w-0">
          <span className="text-[10px] text-editorial-accent uppercase tracking-[0.3em] font-bold block mb-0.5 font-sans">Саундтрек Свадьбы</span>
          <h4 className="font-serif text-[15px] text-editorial-dark font-medium truncate">{activeTrack.title}</h4>
          <p className="text-xs text-editorial-slate font-sans truncate mb-2">{activeTrack.artist}</p>

          {/* Simple controls */}
          <div className="flex items-center gap-3">
            <button 
              onClick={handlePrev} 
              className="p-1.5 text-editorial-slate hover:text-editorial-dark hover:bg-editorial-bg rounded-full transition-colors"
              title="Предыдущий трек"
            >
              <SkipBack size={16} />
            </button>
            
            <button 
              onClick={handlePlayPause}
              className="p-2.5 bg-editorial-dark hover:bg-black/90 text-white rounded-full transition-all shadow-sm flex items-center justify-center transform active:scale-95 cursor-pointer"
              id="audio-play-pause-btn"
              title={isPlaying ? "Пауза" : "Воспроизвести"}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>
            
            <button 
              onClick={handleNext} 
              className="p-1.5 text-editorial-slate hover:text-editorial-dark hover:bg-editorial-bg rounded-full transition-colors"
              title="Следующий трек"
            >
              <SkipForward size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-5 w-full">
        <div 
          ref={progressRef}
          onClick={handleProgressClick}
          className="h-1.5 bg-editorial-light-border hover:h-2 rounded-full cursor-pointer relative transition-all"
        >
          <div 
            style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
            className="h-full bg-editorial-accent rounded-full"
          ></div>
        </div>
        <div className="flex justify-between text-[11px] text-editorial-muted mt-1 font-mono">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Volume Controller */}
      <div className="flex items-center gap-3 mt-3 justify-end">
        <button 
          onClick={toggleMute}
          className="text-editorial-muted hover:text-editorial-dark transition-colors"
        >
          {isMuted || volume === 0 ? <VolumeX size={15} /> : <Volume2 size={15} />}
        </button>
        <input 
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={isMuted ? 0 : volume}
          onChange={(e) => {
            setVolume(parseFloat(e.target.value));
            setIsMuted(false);
          }}
          className="w-20 accent-editorial-accent h-1 rounded-lg cursor-pointer bg-editorial-light-border"
        />
      </div>

      {/* Atmospheric Notes Indicator */}
      <div className="flex justify-center items-center h-8 mt-2.5 gap-1.5" id="audio-wave-bars">
        {[1, 2, 3, 4, 5].map((i) => (
          <motion.div
            key={i}
            animate={isPlaying ? { height: [12, 28, 8, 22, 12] } : { height: 6 }}
            transition={isPlaying ? {
              repeat: Infinity,
              duration: 1 + (i * 0.15),
              ease: "easeInOut",
              repeatType: "reverse"
            } : { duration: 0.3 }}
            className="w-1 bg-editorial-accent/60 rounded-full"
          ></motion.div>
        ))}
      </div>

      {/* Helpful instruction for adding the customized track */}
      {fallbackLoad && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl text-[11px] sm:text-xs text-amber-800 leading-relaxed font-sans"
        >
          <div className="font-semibold mb-1 flex items-center gap-1.5 text-amber-900">
            <span>🎵</span> <span>Инструкция по загрузке трека</span>
          </div>
          Файл песни <code className="bg-amber-100/80 px-1 py-0.5 rounded text-amber-900 font-mono text-[10.5px]">antoha_mc_cvetochki.mp3</code> не найден в репозитории. 
          Сейчас <strong className="text-amber-900">играет фоновая мелодия</strong>. Чтобы заиграл оригинальный трек Антохи МС:
          <ol className="list-decimal list-inside mt-1.5 space-y-1 text-amber-800">
            <li>Создайте в корне вашего репозитория на GitHub папку под названием <code className="bg-amber-100/80 px-1 rounded font-mono text-[10.5px]">public</code></li>
            <li>Загрузите туда файл вашей песни и переименуйте его ровно в: <code className="bg-amber-100/80 px-1 py-0.5 rounded text-amber-900 font-semibold font-mono text-[10.5px]">antoha_mc_cvetochki.mp3</code></li>
            <li>Сделайте коммит изменений — GitHub Pages пересоберет сайт с вашей песней!</li>
          </ol>
        </motion.div>
      )}
    </div>
  );
}
