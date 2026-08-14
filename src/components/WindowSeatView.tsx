import React, { useState, useEffect } from 'react';
import { BusCorporation, TimeOfDay } from '../types';
import { HIGHWAY_MILESTONES } from '../data/busData';
import { ambientBusAudio, playPressureHorn } from '../utils/audioSynthesizer';
import { CloudRain, Wind, Disc, Sparkles, X, ChevronUp, ChevronDown } from 'lucide-react';

interface WindowSeatViewProps {
  corp: BusCorporation;
  timeOfDay: TimeOfDay;
  onClose: () => void;
  speed: 'idle' | 'cruise' | 'sprint';
}

export const WindowSeatView: React.FC<WindowSeatViewProps> = ({
  corp,
  timeOfDay,
  onClose,
  speed,
}) => {
  const [windowPosition, setWindowPosition] = useState<'open' | 'half' | 'closed'>('half');
  const [isRaining, setIsRaining] = useState(false);
  const [isFanOn, setIsFanOn] = useState(true);
  const [currentMilestoneIdx, setCurrentMilestoneIdx] = useState(0);
  const [wiperActive, setWiperActive] = useState(false);

  const milestone = HIGHWAY_MILESTONES[currentMilestoneIdx];

  // Rotate milestone stones as journey continues
  useEffect(() => {
    if (speed === 'idle') return;
    const interval = setInterval(() => {
      setCurrentMilestoneIdx((prev) => (prev + 1) % HIGHWAY_MILESTONES.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [speed]);

  // Adjust wind sound when window is opened / closed
  useEffect(() => {
    if (windowPosition === 'open') {
      ambientBusAudio.setWindVolume(0.12);
    } else if (windowPosition === 'half') {
      ambientBusAudio.setWindVolume(0.06);
    } else {
      ambientBusAudio.setWindVolume(0.01);
    }
  }, [windowPosition]);

  const handleWiper = () => {
    setWiperActive(true);
    setTimeout(() => setWiperActive(false), 2000);
  };

  // Time of day background gradients
  const skyBackgrounds = {
    bhor: 'linear-gradient(180deg, #1e1b4b 0%, #7c2d12 40%, #ea580c 70%, #fed7aa 100%)', // Dawn mist
    dopahar: 'linear-gradient(180deg, #0284c7 0%, #38bdf8 50%, #bae6fd 90%, #fef08a 100%)', // Sunny afternoon
    shaam: 'linear-gradient(180deg, #312e81 0%, #9f1239 35%, #ea580c 70%, #fde047 100%)', // Golden sunset twilight
    raat: 'linear-gradient(180deg, #030712 0%, #0f172a 60%, #1e1b4b 100%)', // Midnight stars
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto backdrop-blur-xl bg-neutral-950/90 border border-amber-500/30 rounded-3xl overflow-hidden shadow-2xl p-4 sm:p-8 transition-all duration-500">
      {/* Top Banner with Close & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3 sm:mb-4 pb-2.5 sm:pb-3 border-b border-neutral-800">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-lg sm:text-xl shrink-0">🪟</span>
          <div className="min-w-0">
            <h2 className="font-yatra text-sm sm:text-lg text-amber-300 truncate">
              खिड़की वाली सीट — Window Seat
            </h2>
            <p className="text-[10px] sm:text-[11px] text-neutral-400 font-hindi truncate">
              {corp.hindiName} • सीट नं. 24 (खिड़की)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Rain / Wiper Toggle */}
          <button
            id="window-rain-toggle"
            onClick={() => setIsRaining(!isRaining)}
            className={`p-1.5 sm:p-2 rounded-xl text-xs flex items-center gap-1 border transition-colors ${
              isRaining
                ? 'bg-sky-500/20 border-sky-400 text-sky-300'
                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
            }`}
            title="Toggle Highway Rain Drops"
          >
            <CloudRain className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="text-[11px] sm:text-xs">बारिश</span>
          </button>

          {isRaining && (
            <button
              id="window-wiper-btn"
              onClick={handleWiper}
              className={`p-1.5 sm:p-2 rounded-xl text-[11px] sm:text-xs bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 transition-all ${
                wiperActive ? 'animate-spin' : ''
              }`}
              title="Wipe Raindrops"
            >
              वाइपर
            </button>
          )}

          {/* Close Window View */}
          <button
            id="close-window-view-btn"
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
            title="Back to Bus View"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* The Iconic Bus Window Frame Structure */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-[16/9] rounded-2xl overflow-hidden border-4 sm:border-8 border-neutral-800 shadow-inner bg-neutral-950 flex flex-col justify-between">
        {/* OUTSIDE SCENERY (Visible through glass) */}
        <div
          className="absolute inset-0 z-0 overflow-hidden"
          style={{ background: skyBackgrounds[timeOfDay] }}
        >
          {/* Sun / Moon Celestial Body */}
          {timeOfDay === 'raat' ? (
            <div className="absolute top-8 right-24 w-12 h-12 rounded-full bg-amber-100 shadow-[0_0_25px_rgba(254,243,199,0.7)] flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-slate-900 absolute -top-1 -right-1" />
            </div>
          ) : timeOfDay === 'shaam' ? (
            <div className="absolute top-12 right-20 w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 blur-sm shadow-[0_0_40px_rgba(249,115,22,0.8)]" />
          ) : timeOfDay === 'bhor' ? (
            <div className="absolute top-16 right-20 w-14 h-14 rounded-full bg-amber-200/90 blur-sm shadow-[0_0_30px_rgba(253,224,71,0.6)]" />
          ) : (
            <div className="absolute top-8 right-16 w-16 h-16 rounded-full bg-amber-300 shadow-[0_0_50px_rgba(253,224,71,0.9)]" />
          )}

          {/* Passing Telegraph Poles & Electric Wires */}
          <div className="absolute inset-x-0 top-1/4 h-24 pointer-events-none opacity-60">
            {/* Wires */}
            <svg className="w-full h-full" viewBox="0 0 1000 100" preserveAspectRatio="none">
              <path d="M 0 30 Q 250 65 500 30 Q 750 65 1000 30" stroke="#334155" strokeWidth="2" fill="none" />
              <path d="M 0 45 Q 250 80 500 45 Q 750 80 1000 45" stroke="#334155" strokeWidth="1.5" fill="none" />
            </svg>
          </div>

          {/* Distant Trees & Green Mustard Fields / Mountains */}
          <div
            className={`absolute inset-x-0 bottom-16 h-36 ${
              speed !== 'idle' ? 'animate-parallax-slow' : ''
            }`}
            style={{ width: '200%' }}
          >
            <svg viewBox="0 0 1600 120" className="w-full h-full preserve-3d" xmlns="http://www.w3.org/2000/svg">
              {/* Field hills */}
              <path
                d="M 0 80 Q 200 40 400 75 Q 600 30 800 80 Q 1000 40 1200 75 Q 1400 30 1600 80 L 1600 120 L 0 120 Z"
                fill={timeOfDay === 'raat' ? '#064e3b' : timeOfDay === 'shaam' ? '#78350f' : '#15803d'}
                opacity="0.7"
              />
              {/* Passing Eucalyptus / Neem Trees */}
              {[60, 220, 380, 560, 740, 920, 1100, 1280, 1460].map((tx, idx) => (
                <g key={idx} transform={`translate(${tx}, 20)`}>
                  <rect x="18" y="30" width="6" height="50" fill="#451a03" />
                  <ellipse cx="21" cy="25" rx="20" ry="30" fill={timeOfDay === 'raat' ? '#022c22' : '#166534'} />
                </g>
              ))}
            </svg>
          </div>

          {/* Roadside Dhaba Board Glowing in Distance */}
          <div
            className={`absolute bottom-20 z-10 ${
              speed !== 'idle' ? 'animate-parallax-mid' : 'left-1/4'
            }`}
            style={{ width: '200%' }}
          >
            <div className="flex gap-96 items-end">
              <div className="bg-neutral-950/90 border-2 border-amber-500 px-4 py-2 rounded-lg shadow-[0_0_20px_rgba(245,158,11,0.5)] transform -rotate-2">
                <div className="text-[10px] text-red-500 font-bold tracking-widest uppercase">★ 24 HOURS OPEN ★</div>
                <div className="font-hindi text-amber-300 font-bold text-sm sm:text-base">
                  सुखदेव ढाबा & कुल्हड़ चाय
                </div>
                <div className="text-[10px] text-amber-200">गरम परांठे • लस्सी • चाय ₹15</div>
              </div>

              <div className="bg-neutral-950/90 border-2 border-emerald-500 px-4 py-2 rounded-lg shadow-[0_0_20px_rgba(16,185,129,0.5)] transform rotate-1">
                <div className="text-[10px] text-emerald-400 font-bold tracking-widest uppercase">★ REST STOP ★</div>
                <div className="font-hindi text-emerald-300 font-bold text-sm sm:text-base">
                  पहलवान ढाबा (करनाल)
                </div>
                <div className="text-[10px] text-neutral-300">20 मिनट ठहराव</div>
              </div>
            </div>
          </div>

          {/* Yellow/White Highway Milestone (NH-44 / NH-58 KM Stone) */}
          <div
            className={`absolute bottom-10 left-16 z-10 ${
              speed !== 'idle' ? 'animate-bounce' : ''
            }`}
          >
            <div className="w-16 sm:w-20 bg-white border-2 border-neutral-700 rounded-t-full rounded-b-md shadow-xl overflow-hidden flex flex-col items-center">
              {/* Yellow NH Top Head */}
              <div className="w-full bg-amber-400 py-1 text-center font-bold text-[10px] text-neutral-950 font-mono border-b border-neutral-800">
                {milestone.nh}
              </div>
              {/* White Destination Body */}
              <div className="p-1.5 text-center">
                <div className="font-hindi text-xs font-bold text-neutral-950 leading-tight">
                  {milestone.place.split(' ')[0]}
                </div>
                <div className="font-mono text-xs font-extrabold text-neutral-900">
                  {milestone.km}
                </div>
              </div>
            </div>
          </div>

          {/* Road Surface & White Line Markings */}
          <div className="absolute inset-x-0 bottom-0 h-12 bg-neutral-900 border-t-2 border-neutral-800">
            <div className="w-full h-full relative overflow-hidden">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-dashed flex gap-8">
                {[...Array(20)].map((_, i) => (
                  <span key={i} className="inline-block w-12 h-1 bg-amber-400/80" />
                ))}
              </div>
            </div>
          </div>

          {/* Rain Overlay Droplets */}
          {isRaining && (
            <div className="absolute inset-0 bg-blue-950/20 backdrop-blur-[0.5px] pointer-events-none z-10">
              <div className="w-full h-full opacity-70 flex flex-wrap gap-6 p-4">
                {[...Array(40)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 h-3 rounded-full bg-sky-200/80 transform rotate-12 animate-pulse"
                    style={{ animationDelay: `${(i % 5) * 0.2}s` }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Wiper Blade Motion */}
          {wiperActive && (
            <div className="absolute inset-y-0 left-1/3 w-2 bg-neutral-800 border-l border-amber-400 transform origin-bottom animate-[spin_1.5s_ease-in-out_infinite] z-20" />
          )}
        </div>

        {/* INSIDE BUS CABIN OVERLAY (Window Frame, Iron Bars, Glass Shutter) */}
        <div className="relative z-20 w-full h-full pointer-events-none flex flex-col justify-between p-2 sm:p-4">
          {/* Top Luggage Rack & Cabin Fan */}
          <div className="flex items-start justify-between gap-2">
            {/* Overhead Luggage Rack with Bag & Newspaper */}
            <div className="bg-neutral-900/90 border border-neutral-700 px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-hindi text-neutral-300 flex items-center gap-1.5 sm:gap-3 pointer-events-auto">
              <span>🧳 सामान रैक</span>
              <span className="hidden sm:inline text-neutral-500">|</span>
              <span className="text-amber-400 font-mono text-[9px] sm:text-[11px]">अखबार 📰</span>
            </div>

            {/* Rotating Retro Metal Cabin Fan */}
            <div
              onClick={() => setIsFanOn(!isFanOn)}
              className="bg-neutral-900/90 border border-neutral-700 p-1.5 sm:p-2 rounded-xl flex items-center gap-1.5 sm:gap-2 cursor-pointer pointer-events-auto hover:border-amber-400 transition-colors shadow-lg"
              title="Click to turn oscillating mini cabin fan on/off"
            >
              <Disc
                className={`w-4 h-4 sm:w-6 sm:h-6 text-cyan-400 ${
                  isFanOn ? 'animate-spin' : 'opacity-40'
                }`}
                style={{ animationDuration: '0.4s' }}
              />
              <div className="text-[8px] sm:text-[10px] font-mono text-left">
                <div className="text-neutral-400">CABIN FAN</div>
                <div className={isFanOn ? 'text-emerald-400 font-bold' : 'text-neutral-500'}>
                  {isFanOn ? 'ON' : 'OFF'}
                </div>
              </div>
            </div>
          </div>

          {/* The Sliding Green Glass Window Shutter */}
          <div
            className="absolute inset-x-4 sm:inset-x-8 transition-all duration-500 pointer-events-auto border-t-4 border-b-4 border-slate-600 rounded-sm"
            style={{
              top: windowPosition === 'closed' ? '10%' : windowPosition === 'half' ? '38%' : '76%',
              bottom: '10%',
              background: 'linear-gradient(180deg, rgba(6, 78, 59, 0.45) 0%, rgba(4, 120, 87, 0.6) 100%)',
              backdropFilter: 'blur(1px)',
            }}
          >
            {/* Window Handle / Latch */}
            <div className="absolute top-1 sm:top-2 left-1/2 -translate-x-1/2 flex items-center gap-1 sm:gap-2 bg-neutral-900/90 border border-neutral-600 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-lg">
              <button
                onClick={() => setWindowPosition('open')}
                className={`p-0.5 sm:p-1 rounded hover:bg-neutral-800 ${windowPosition === 'open' ? 'text-amber-400' : 'text-neutral-400'}`}
                title="Slide Window Up / Open"
              >
                <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              <span className="text-[9px] sm:text-[11px] font-hindi text-neutral-200 whitespace-nowrap">
                {windowPosition === 'open' ? 'खिड़की खुली' : windowPosition === 'half' ? 'आधी खुली' : 'खिड़की बंद'}
              </span>
              <button
                onClick={() => setWindowPosition('closed')}
                className={`p-0.5 sm:p-1 rounded hover:bg-neutral-800 ${windowPosition === 'closed' ? 'text-amber-400' : 'text-neutral-400'}`}
                title="Slide Window Down / Close"
              >
                <ChevronUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>

            {/* Vintage Scratch & Dust Marks on Glass */}
            <div className="absolute bottom-2 right-4 sm:bottom-4 sm:right-8 font-handwriting text-[10px] sm:text-xs text-white/40 rotate-6 select-none">
              "पूजा + राहुल" 💕
            </div>
          </div>

          {/* Safety Iron Bars ("हाथ बाहर न निकालें") */}
          <div className="space-y-3 sm:space-y-4 my-auto pointer-events-none">
            <div className="h-1 sm:h-1.5 w-full bg-gradient-to-r from-neutral-600 via-slate-400 to-neutral-600 shadow-md" />
            <div className="h-1 sm:h-1.5 w-full bg-gradient-to-r from-neutral-600 via-slate-400 to-neutral-600 shadow-md" />
            <div className="h-1 sm:h-1.5 w-full bg-gradient-to-r from-neutral-600 via-slate-400 to-neutral-600 shadow-md" />
          </div>

          {/* Bottom Window Sill & Kulhad Chai */}
          <div className="flex items-end justify-between bg-neutral-900/95 border-t-2 sm:border-t-4 border-neutral-700 -mx-2 -mb-2 sm:-mx-4 sm:-mb-4 p-2 sm:p-3 pointer-events-auto gap-2">
            {/* Caution Warning Painted Label */}
            <div className="bg-amber-400/90 text-neutral-950 px-2 sm:px-3 py-0.5 sm:py-1 rounded text-[9px] sm:text-[11px] font-bold font-hindi flex items-center gap-1 shadow truncate">
              <span>⚠️</span>
              <span className="truncate">हाथ या सिर बाहर न निकालें</span>
            </div>

            {/* Steaming Kulhad Chai on Sill */}
            <div
              className="flex items-center gap-1.5 sm:gap-2 cursor-pointer group shrink-0"
              onClick={() => playPressureHorn('classic')}
              title="Window Sill Cutting Chai (Click to blow horn)"
            >
              <div className="relative">
                {/* Steam */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-3 h-4 animate-steam pointer-events-none opacity-80">
                  <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-200" />
                </div>
                {/* Clay Kulhad Cup */}
                <div className="w-6 h-8 sm:w-8 sm:h-10 bg-amber-700 border border-amber-900 rounded-b-md rounded-t-sm shadow-md flex items-center justify-center font-hindi text-[8px] sm:text-[9px] text-amber-200">
                  चाय
                </div>
              </div>
              <div className="text-left font-hindi hidden xs:block">
                <div className="text-[10px] sm:text-xs text-amber-300 font-bold group-hover:text-amber-200">
                  कुल्हड़ चाय
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Window Tips */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-400">
        <div className="flex items-center gap-2">
          <span className="text-amber-400 font-bold">💡 टिप:</span>
          <span>खिड़की को ऊपर-नीचे खिसका कर ताज़ी हवा और हाईवे की आवाज़ महसूस करें!</span>
        </div>
        <div className="flex items-center gap-2">
          <Wind className="w-4 h-4 text-sky-400" />
          <span>Wind breeze synced to window openness</span>
        </div>
      </div>
    </div>
  );
};
