import React, { useState, useEffect } from 'react';
import { NOSTALGIC_QUOTES } from '../data/busData';
import { ChevronLeft, ChevronRight, Sparkles, Quote } from 'lucide-react';

export const QuotesTicker: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const quote = NOSTALGIC_QUOTES[currentIndex];

  useEffect(() => {
    if (isPaused) return;

    const interval = 70; // Smooth progress updates
    const duration = 7000; // 7 seconds per quote
    const step = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentIndex((current) => (current + 1) % NOSTALGIC_QUOTES.length);
          return 0;
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isPaused, currentIndex]);

  const handleNext = () => {
    setProgress(0);
    setCurrentIndex((prev) => (prev + 1) % NOSTALGIC_QUOTES.length);
  };

  const handlePrev = () => {
    setProgress(0);
    setCurrentIndex((prev) => (prev - 1 + NOSTALGIC_QUOTES.length) % NOSTALGIC_QUOTES.length);
  };

  return (
    <div
      id="nostalgic-quotes-ticker"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full max-w-4xl mx-auto backdrop-blur-md bg-neutral-900/60 border border-amber-500/20 rounded-2xl p-4 sm:p-5 shadow-2xl overflow-hidden group transition-all duration-300 hover:border-amber-500/40"
    >
      {/* Progress Line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-neutral-800">
        <div
          className="h-full bg-gradient-to-r from-amber-500 via-amber-300 to-amber-500 transition-all duration-75 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-start justify-between gap-4">
        {/* Quote Icon & Tag */}
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Quote className="w-4 h-4" />
          </div>
          <span className="text-[11px] uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-full bg-neutral-800 text-amber-300 border border-neutral-700">
            {quote.tag}
          </span>
          <span className="text-[11px] text-neutral-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400/70" />
            स्मृतियाँ #{quote.id}
          </span>
        </div>

        {/* Carousel controls */}
        <div className="flex items-center gap-1">
          <button
            id="quote-prev-btn"
            onClick={handlePrev}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            title="Previous Memory"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs text-neutral-400 font-mono px-1">
            {currentIndex + 1}/{NOSTALGIC_QUOTES.length}
          </span>
          <button
            id="quote-next-btn"
            onClick={handleNext}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            title="Next Memory"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quote Text */}
      <div className="mt-2 min-h-[72px] sm:min-h-[64px] flex flex-col justify-center transition-all duration-300">
        <p className="font-hindi text-base sm:text-lg text-neutral-100 font-medium leading-relaxed drop-shadow-sm">
          "{quote.hindi}"
        </p>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1 italic font-sans flex items-center justify-between">
          <span>— {quote.english}</span>
          <span className="text-[11px] not-italic text-amber-400/80 font-mono ml-2 shrink-0">
            [{quote.author}]
          </span>
        </p>
      </div>
    </div>
  );
};
