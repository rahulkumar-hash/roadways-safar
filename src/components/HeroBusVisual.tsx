import React, { useState } from 'react';
import { BusCorporation } from '../types';
import { playPressureHorn, playConductorWhistle } from '../utils/audioSynthesizer';
import { Gauge, Zap, Wind, ArrowRight } from 'lucide-react';

interface HeroBusVisualProps {
  corp: BusCorporation;
  onOpenTicket: () => void;
  onOpenWindowView: () => void;
  speed: 'idle' | 'cruise' | 'sprint';
  setSpeed: (s: 'idle' | 'cruise' | 'sprint') => void;
}

export const HeroBusVisual: React.FC<HeroBusVisualProps> = ({
  corp,
  onOpenTicket,
  onOpenWindowView,
  speed,
  setSpeed,
}) => {
  const [headlights, setHeadlights] = useState(true);
  const [hornHonking, setHornHonking] = useState(false);
  const [activeSloganIdx, setActiveSloganIdx] = useState(0);

  const handleHorn = () => {
    setHornHonking(true);
    playPressureHorn('musical');
    setTimeout(() => setHornHonking(false), 900);
  };

  const handleWhistle = () => {
    playConductorWhistle();
  };

  const speedConfigs = {
    idle: { label: 'Idle / स्टैंड पे खड़ी', kmh: '0', rpm: '800', anim: 'animate-bus-idle', roadSpeed: 'none' },
    cruise: { label: 'Cruising / हाईवे क्रूज़', kmh: '78', rpm: '1850', anim: 'animate-bus-motion', roadSpeed: 'normal' },
    sprint: { label: 'Highway Sprint / 90 पार', kmh: '94', rpm: '2300', anim: 'animate-bus-motion', roadSpeed: 'fast' },
  };

  const currentSpeed = speedConfigs[speed];

  return (
    <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center">
      {/* Destination Board & Slogan Roller */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 mb-4 px-2">
        <div className="flex items-center gap-2 bg-neutral-900/90 border border-neutral-800 rounded-xl px-3 py-1.5 shadow-md">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-mono text-neutral-400">BUS NO:</span>
          <span className="text-xs font-bold text-amber-300 tracking-wider font-mono">
            {corp.busNumber}
          </span>
          <span className="text-xs text-neutral-500">|</span>
          <span className="text-xs font-hindi text-amber-200">
            {corp.defaultRoute.from.split(' ')[0]} <ArrowRight className="w-3 h-3 inline text-amber-400" /> {corp.defaultRoute.to.split(' ')[0]}
          </span>
        </div>

        {/* Painted Slogan Pill */}
        <button
          onClick={() => setActiveSloganIdx((prev) => (prev + 1) % corp.slogans.length)}
          className="bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl px-3 py-1.5 text-xs text-amber-300 font-hindi flex items-center gap-2 transition-all cursor-pointer group"
          title="Click to cycle iconic painted bus slogans"
        >
          <span className="text-sm group-hover:rotate-12 transition-transform">🪬</span>
          <span className="font-bold tracking-wide">
            "{corp.slogans[activeSloganIdx] || corp.slogans[0]}"
          </span>
          <span className="text-[10px] text-amber-400/60 font-sans">(Click to change)</span>
        </button>
      </div>

      {/* Main Bus Stage */}
      <div
        id="bus-hero-stage"
        className={`relative w-full rounded-3xl overflow-hidden backdrop-blur-xl border border-neutral-800 shadow-2xl p-6 sm:p-10 transition-all duration-500 ${
          hornHonking ? 'ring-4 ring-rose-500/50 shadow-rose-500/20' : ''
        }`}
        style={{
          background: 'linear-gradient(180deg, rgba(23, 23, 23, 0.85) 0%, rgba(10, 10, 10, 0.95) 100%)',
        }}
      >
        {/* Animated Road Horizon Lines in Background */}
        <div className="absolute inset-x-0 bottom-12 h-20 overflow-hidden pointer-events-none opacity-40">
          <div className="w-full h-full relative">
            <div className="absolute inset-x-0 bottom-0 h-1 bg-neutral-700" />
            {speed !== 'idle' && (
              <div
                className={`absolute bottom-0 left-0 right-0 h-1 flex gap-12 ${
                  speed === 'sprint' ? 'animate-road-stripes' : 'animate-road-stripes'
                }`}
                style={{ animationDuration: speed === 'sprint' ? '0.6s' : '1.2s' }}
              >
                {[...Array(12)].map((_, i) => (
                  <span key={i} className="inline-block w-16 h-1 bg-amber-400 shadow-sm" />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Central Illustrated Bus Graphic */}
        <div className={`relative w-full max-w-3xl mx-auto ${currentSpeed.anim}`}>
          {/* Headlight Beams */}
          {headlights && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-64 h-32 bg-gradient-to-r from-amber-200/30 via-amber-300/10 to-transparent blur-md pointer-events-none transform origin-left -rotate-6 z-10" />
          )}

          {/* SVG Illustrated Authentic Roadways Bus */}
          <div className="relative w-full drop-shadow-[0_20px_35px_rgba(0,0,0,0.8)]">
            <svg
              viewBox="0 0 800 360"
              className="w-full h-auto select-none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Metallic Gradients */}
                <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={corp.primaryColor} stopOpacity="1" />
                  <stop offset="60%" stopColor={corp.primaryColor} stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#0f172a" stopOpacity="1" />
                </linearGradient>

                <linearGradient id="chromeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#cbd5e1" />
                  <stop offset="50%" stopColor="#f8fafc" />
                  <stop offset="100%" stopColor="#64748b" />
                </linearGradient>

                <linearGradient id="glassGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.6" />
                  <stop offset="50%" stopColor="#0284c7" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#0f172a" stopOpacity="0.8" />
                </linearGradient>

                {/* Tyre Tread Pattern */}
                <pattern id="treadPattern" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 0 5 L 5 0 L 10 5 L 5 10 Z" fill="#171717" />
                </pattern>
              </defs>

              {/* Roof Luggage Carrier & Tied Baggage */}
              <g id="luggage-rack">
                {/* Rack Rails */}
                <rect x="140" y="32" width="480" height="14" rx="3" fill="#334155" />
                <rect x="145" y="24" width="470" height="4" fill="#64748b" />
                <line x1="180" y1="28" x2="180" y2="46" stroke="#94a3b8" strokeWidth="3" />
                <line x1="260" y1="28" x2="260" y2="46" stroke="#94a3b8" strokeWidth="3" />
                <line x1="360" y1="28" x2="360" y2="46" stroke="#94a3b8" strokeWidth="3" />
                <line x1="460" y1="28" x2="460" y2="46" stroke="#94a3b8" strokeWidth="3" />
                <line x1="560" y1="28" x2="560" y2="46" stroke="#94a3b8" strokeWidth="3" />

                {/* Tied Luggage: Tin Trunk, Bedroll, Spare Wheel */}
                {/* Vintage Steel Trunk */}
                <rect x="170" y="10" width="85" height="24" rx="2" fill="#0284c7" stroke="#0369a1" strokeWidth="2" />
                <rect x="175" y="18" width="75" height="2" fill="#38bdf8" />
                <circle cx="212" cy="18" r="3" fill="#f8fafc" />

                {/* Bedroll (Bistarband) */}
                <rect x="270" y="12" width="90" height="22" rx="10" fill="#b45309" stroke="#78350f" strokeWidth="2" />
                <line x1="290" y1="12" x2="290" y2="34" stroke="#fde68a" strokeWidth="2" />
                <line x1="335" y1="12" x2="335" y2="34" stroke="#fde68a" strokeWidth="2" />

                {/* Wooden Fruit/Milk Crate */}
                <rect x="375" y="8" width="60" height="26" rx="2" fill="#78350f" stroke="#451a03" strokeWidth="2" />
                <line x1="375" y1="16" x2="435" y2="16" stroke="#d97706" strokeWidth="1.5" />
                <line x1="375" y1="24" x2="435" y2="24" stroke="#d97706" strokeWidth="1.5" />

                {/* Spare Tyre on Roof */}
                <ellipse cx="490" cy="20" rx="36" ry="12" fill="#1c1917" stroke="#44403c" strokeWidth="3" />
                <ellipse cx="490" cy="20" rx="16" ry="5" fill="#78716c" />

                {/* Tarpaulin Cover & Ropes */}
                <path d="M 160 30 Q 340 18 580 30" stroke="#f59e0b" strokeWidth="2" fill="none" strokeDasharray="6 3" />
              </g>

              {/* Main Bus Chassis / Outer Body */}
              <path
                d="M 100 80 
                   Q 100 50 130 50 
                   L 660 50 
                   Q 720 50 740 110 
                   L 750 200 
                   Q 750 250 720 250 
                   L 680 250 
                   A 45 45 0 0 0 590 250 
                   L 260 250 
                   A 45 45 0 0 0 170 250 
                   L 100 250 
                   Z"
                fill="url(#bodyGrad)"
                stroke="#1e293b"
                strokeWidth="4"
              />

              {/* Cream/White Retro Center Stripe */}
              <path
                d="M 100 155 L 746 155 L 748 185 L 100 185 Z"
                fill={corp.secondaryColor}
                opacity="0.95"
              />
              <line x1="100" y1="155" x2="746" y2="155" stroke={corp.accentColor} strokeWidth="3" />
              <line x1="100" y1="185" x2="748" y2="185" stroke={corp.accentColor} strokeWidth="3" />

              {/* State Transport Name Painted on Bus Side */}
              <text
                x="410"
                y="178"
                fill="#0f172a"
                fontSize="20"
                fontWeight="900"
                fontFamily="sans-serif"
                textAnchor="middle"
                letterSpacing="3"
              >
                ★ {corp.name.toUpperCase()} ★
              </text>

              {/* Front Destination Box Board (ISBT) */}
              <g id="destination-sign">
                <rect x="630" y="58" width="95" height="32" rx="4" fill="#09090b" stroke="#f59e0b" strokeWidth="2" />
                <rect x="633" y="61" width="89" height="26" fill="#18181b" />
                <text x="677" y="74" fill="#facc15" fontSize="10" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">
                  {corp.defaultRoute.from.split(' ')[0]}
                </text>
                <text x="677" y="84" fill="#f8fafc" fontSize="8" fontFamily="sans-serif" textAnchor="middle">
                  TO {corp.defaultRoute.to.split(' ')[0]}
                </text>
              </g>

              {/* Windows Matrix */}
              {/* Driver Windshield (Front Right) */}
              <path
                d="M 640 96 L 728 98 Q 736 128 732 146 L 640 146 Z"
                fill="url(#glassGrad)"
                stroke="#334155"
                strokeWidth="3"
              />

              {/* Passenger Windows with Metal Sliding Dividers */}
              {[
                { x: 130, w: 75 },
                { x: 215, w: 75 },
                { x: 300, w: 75 },
                { x: 385, w: 75 },
                { x: 470, w: 75 },
                { x: 555, w: 75 },
              ].map((win, idx) => (
                <g key={idx} className="cursor-pointer" onClick={onOpenWindowView}>
                  {/* Outer Frame */}
                  <rect
                    x={win.x}
                    y="96"
                    width={win.w}
                    height="50"
                    rx="4"
                    fill="url(#glassGrad)"
                    stroke="#475569"
                    strokeWidth="2"
                  />
                  {/* Sliding Glass Divider */}
                  <line x1={win.x + win.w / 2} y1="96" x2={win.x + win.w / 2} y2="146" stroke="#94a3b8" strokeWidth="2" />
                  {/* Safety Rail Bars ("हाथ बाहर न निकालें") */}
                  <line x1={win.x} y1="124" x2={win.x + win.w} y2="124" stroke="#64748b" strokeWidth="1" strokeDasharray="3 3" />
                  {/* Passenger Silhouette */}
                  {idx % 2 === 0 && (
                    <circle cx={win.x + 28} cy="120" r="10" fill="#0f172a" opacity="0.6" />
                  )}
                  {idx === 2 && (
                    <text x={win.x + 38} y="112" fill="#f59e0b" fontSize="8" fontFamily="sans-serif" textAnchor="middle">
                      🪟
                    </text>
                  )}
                </g>
              ))}

              {/* Front & Rear Passenger Doors */}
              <rect x="635" y="152" width="4" height="98" fill="#1e293b" />
              <line x1="635" y1="185" x2="635" y2="245" stroke="#f59e0b" strokeWidth="2" />

              {/* Wheel Arches & Wheels */}
              {/* Rear Wheel (Double Axle feel) */}
              <g id="rear-wheel" transform="translate(215, 250)">
                <circle cx="0" cy="0" r="42" fill="#09090b" stroke="#262626" strokeWidth="6" />
                {/* Tyre Pattern */}
                <circle cx="0" cy="0" r="34" fill="#1c1917" stroke="#44403c" strokeWidth="2" />
                {/* Rim */}
                <circle cx="0" cy="0" r="22" fill="url(#chromeGrad)" />
                {/* Lug Nuts */}
                <circle cx="0" cy="0" r="8" fill="#0f172a" />
                <circle cx="0" cy="-14" r="2.5" fill="#f8fafc" />
                <circle cx="12" cy="-7" r="2.5" fill="#f8fafc" />
                <circle cx="12" cy="7" r="2.5" fill="#f8fafc" />
                <circle cx="0" cy="14" r="2.5" fill="#f8fafc" />
                <circle cx="-12" cy="7" r="2.5" fill="#f8fafc" />
                <circle cx="-12" cy="-7" r="2.5" fill="#f8fafc" />
              </g>

              {/* Front Wheel */}
              <g id="front-wheel" transform="translate(635, 250)">
                <circle cx="0" cy="0" r="42" fill="#09090b" stroke="#262626" strokeWidth="6" />
                <circle cx="0" cy="0" r="34" fill="#1c1917" stroke="#44403c" strokeWidth="2" />
                <circle cx="0" cy="0" r="22" fill="url(#chromeGrad)" />
                <circle cx="0" cy="0" r="8" fill="#0f172a" />
                <circle cx="0" cy="-14" r="2.5" fill="#f8fafc" />
                <circle cx="12" cy="-7" r="2.5" fill="#f8fafc" />
                <circle cx="12" cy="7" r="2.5" fill="#f8fafc" />
                <circle cx="0" cy="14" r="2.5" fill="#f8fafc" />
                <circle cx="-12" cy="7" r="2.5" fill="#f8fafc" />
                <circle cx="-12" cy="-7" r="2.5" fill="#f8fafc" />
              </g>

              {/* Chrome Front Grill, Headlights & Bumper */}
              <g id="front-details">
                {/* Heavy Steel Bumper */}
                <rect x="735" y="222" width="22" height="28" rx="3" fill="url(#chromeGrad)" stroke="#334155" strokeWidth="2" />
                {/* Headlights (Stacked) */}
                <circle cx="744" cy="198" r="8" fill={headlights ? '#fef08a' : '#52525b'} stroke="#e2e8f0" strokeWidth="2" />
                <circle cx="744" cy="198" r="5" fill={headlights ? '#ffffff' : '#27272a'} />
                <circle cx="744" cy="214" r="6" fill={headlights ? '#fef08a' : '#52525b'} stroke="#e2e8f0" strokeWidth="2" />

                {/* Hanging Nimbu-Mirchi Charm (नींबू-मिर्ची) */}
                <g id="nimbu-mirchi" transform="translate(744, 248)">
                  <line x1="0" y1="0" x2="0" y2="18" stroke="#000" strokeWidth="1.5" />
                  <circle cx="0" cy="6" r="3.5" fill="#facc15" stroke="#ca8a04" strokeWidth="1" /> {/* Nimbu */}
                  <path d="M 0 10 Q 4 18 1 24 Q -2 18 0 10" fill="#15803d" /> {/* Mirchi */}
                  <path d="M 0 10 Q -4 18 -1 24 Q 2 18 0 10" fill="#16a34a" />
                </g>

                {/* Air Horn Trumpet on Roof */}
                <g id="roof-air-horn" transform="translate(680, 42)">
                  <path d="M 0 4 L 30 0 L 30 10 L 0 6 Z" fill="url(#chromeGrad)" stroke="#475569" strokeWidth="1" />
                  <ellipse cx="30" cy="5" rx="3" ry="5" fill="#d97706" />
                </g>
              </g>

              {/* Rear Details: Ladder & Mudflaps */}
              <g id="rear-details">
                {/* Mudflap */}
                <rect x="92" y="228" width="12" height="34" fill="#171717" />
                <text x="98" y="250" fill="#f59e0b" fontSize="6" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle" transform="rotate(-90 98 250)">
                  OK TATA
                </text>
                {/* Back Ladder */}
                <line x1="104" y1="65" x2="104" y2="215" stroke="#94a3b8" strokeWidth="2" />
                <line x1="112" y1="65" x2="112" y2="215" stroke="#94a3b8" strokeWidth="2" />
                {[80, 105, 130, 155, 180, 205].map((ly) => (
                  <line key={ly} x1="104" y1={ly} x2="112" y2={ly} stroke="#94a3b8" strokeWidth="2" />
                ))}
              </g>

              {/* Iconic Truck Art Slogans on Bus Rear */}
              <g id="painted-art">
                <text x="135" y="210" fill="#f8fafc" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
                  STOP
                </text>
                <text x="135" y="224" fill="#facc15" fontSize="8" fontFamily="sans-serif">
                  BLOW HORN
                </text>
              </g>
            </svg>
          </div>
        </div>

        {/* Interactive Dashboard Control Bar */}
        <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-neutral-800/80 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Speed & Gauge Telemetry */}
          <div className="flex flex-wrap items-center justify-between sm:justify-start gap-2.5 sm:gap-4">
            <div className="flex items-center gap-2 bg-neutral-900/90 border border-neutral-800 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl shrink-0">
              <Gauge className="w-4 h-4 text-amber-400" />
              <div>
                <div className="text-[9px] sm:text-[10px] text-neutral-400 uppercase font-mono">SPEED</div>
                <div className="text-xs sm:text-sm font-bold text-amber-300 font-mono">
                  {currentSpeed.kmh} <span className="text-[10px] sm:text-xs text-neutral-400">KM/H</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-neutral-900/90 border border-neutral-800 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl shrink-0">
              <Zap className="w-4 h-4 text-emerald-400" />
              <div>
                <div className="text-[9px] sm:text-[10px] text-neutral-400 uppercase font-mono">ENGINE RPM</div>
                <div className="text-xs sm:text-sm font-bold text-emerald-300 font-mono">
                  {currentSpeed.rpm} <span className="text-[10px] sm:text-xs text-neutral-400">RPM</span>
                </div>
              </div>
            </div>

            {/* Speed Selector Buttons */}
            <div className="flex items-center gap-1 bg-neutral-900/90 border border-neutral-800 p-1 rounded-xl">
              {(['idle', 'cruise', 'sprint'] as const).map((s) => (
                <button
                  key={s}
                  id={`speed-btn-${s}`}
                  onClick={() => setSpeed(s)}
                  className={`px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs font-semibold rounded-lg capitalize transition-all ${
                    speed === s
                      ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons: Pressure Horn, Whistle, Window Seat, Headlights */}
          <div className="flex items-center flex-wrap gap-2 justify-stretch sm:justify-start lg:justify-end">
            {/* Big Pressure Horn Button */}
            <button
              id="hero-pressure-horn-btn"
              onClick={handleHorn}
              className={`flex-1 sm:flex-none px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer shadow-lg min-h-[42px] ${
                hornHonking
                  ? 'bg-rose-500 text-white scale-105 shadow-rose-500/40 ring-4 ring-rose-400/40'
                  : 'bg-rose-600/90 hover:bg-rose-600 text-white shadow-rose-900/30'
              }`}
            >
              <span className="text-base sm:text-lg">📢</span>
              <span>प्रेशर हॉर्न (H)</span>
            </button>

            {/* Conductor Whistle Button */}
            <button
              id="hero-whistle-btn"
              onClick={handleWhistle}
              className="flex-1 sm:flex-none px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-neutral-800/90 hover:bg-neutral-700 text-amber-300 border border-amber-500/30 flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer min-h-[42px]"
              title="कंडक्टर की सीटी (Press 'W')"
            >
              <span>🔔</span>
              <span>सीटी (W)</span>
            </button>

            {/* Window Seat View Switcher */}
            <button
              id="hero-window-seat-btn"
              onClick={onOpenWindowView}
              className="w-full sm:w-auto px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 flex items-center justify-center gap-1.5 transition-all cursor-pointer min-h-[42px]"
            >
              <span>🪟</span>
              <span>खिड़की वाली सीट (V)</span>
            </button>

            {/* Headlights toggle */}
            <button
              id="headlights-toggle-btn"
              onClick={() => setHeadlights(!headlights)}
              className={`p-2 sm:p-2.5 rounded-xl border transition-colors shrink-0 ${
                headlights
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-500'
              }`}
              title="Toggle Headlights Dipper"
            >
              <Wind className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
