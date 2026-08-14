import React, { useState, useEffect, useCallback } from 'react';
import { TimeOfDay } from './types';
import { BUS_CORPORATIONS } from './data/busData';
import { Navbar } from './components/Navbar';
import { HeroBusVisual } from './components/HeroBusVisual';
import { WindowSeatView } from './components/WindowSeatView';
import { QuotesTicker } from './components/QuotesTicker';
import { TicketPunchModal } from './components/TicketPunchModal';
import { DhabaChaiExperience } from './components/DhabaChaiExperience';
import { ShortcutsModal } from './components/ShortcutsModal';
import { MusicPlayer } from './components/MusicPlayer';
import {
  playPressureHorn,
  playConductorWhistle,
} from './utils/audioSynthesizer';
import {
  Sparkles,
  Ticket,
  Coffee,
  Compass,
  Radio,
  Volume2,
  Wind,
  Flame,
  Layers,
} from 'lucide-react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

export default function App() {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('shaam');
  const [selectedCorp, setSelectedCorp] = useState(BUS_CORPORATIONS[1]); // Haryana Roadways
  const [isWindowView, setIsWindowView] = useState(false);
  const [speed, setSpeed] = useState<'idle' | 'cruise' | 'sprint'>('cruise');
  const [isTicketOpen, setIsTicketOpen] = useState(false);
  const [isDhabaOpen, setIsDhabaOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hornFlash, setHornFlash] = useState(false);

  // Trigger Horn with visual vibration feedback
  const triggerHorn = useCallback(() => {
    setHornFlash(true);
    playPressureHorn('musical');
    setTimeout(() => setHornFlash(false), 900);
  }, []);

  // Trigger Whistle
  const triggerWhistle = useCallback(() => {
    playConductorWhistle();
  }, []);

  // Global Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid triggering when typing in inputs
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'h':
          e.preventDefault();
          triggerHorn();
          break;
        case 'w':
          e.preventDefault();
          triggerWhistle();
          break;
        case 't':
          e.preventDefault();
          setIsTicketOpen((prev) => !prev);
          break;
        case 'c':
          e.preventDefault();
          setIsDhabaOpen((prev) => !prev);
          break;
        case 'v':
          e.preventDefault();
          setIsWindowView((prev) => !prev);
          break;
        case '1':
          setTimeOfDay('bhor');
          break;
        case '2':
          setTimeOfDay('dopahar');
          break;
        case '3':
          setTimeOfDay('shaam');
          break;
        case '4':
          setTimeOfDay('raat');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [triggerHorn, triggerWhistle]);

  // Background atmosphere themes
  const timeAtmospheres = {
    bhor: 'bg-gradient-to-b from-[#111827] via-[#451a03]/60 to-[#030712]', // Dawn haze
    dopahar: 'bg-gradient-to-b from-[#0c4a6e] via-[#0369a1]/30 to-[#030712]', // Bright afternoon
    shaam: 'bg-gradient-to-b from-[#31102f] via-[#7c2d12]/50 to-[#030712]', // Golden sunset twilight
    raat: 'bg-gradient-to-b from-[#030712] via-[#0f172a] to-[#020617]', // Midnight highway stars
  };

  return (
   
    <div
      className={`min-h-screen text-neutral-100 font-sans relative pb-32 transition-colors duration-700 ${timeAtmospheres[timeOfDay]} ${
        hornFlash ? 'ring-8 ring-amber-500/40' : ''
      }`}
    >
      {/* Background Highway Star / Light Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Soft Radial Ambient Glow */}
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-175 h-125 rounded-full blur-[140px] opacity-25"
          style={{ backgroundColor: selectedCorp.primaryColor }}
        />
        {/* Amber roadside sodium lamp glow */}
        <div className="absolute top-12 right-10 w-96 h-96 rounded-full bg-amber-500/10 blur-[120px]" />
      </div>

      {/* Retro Navigation Header */}
      <Navbar
        timeOfDay={timeOfDay}
        setTimeOfDay={setTimeOfDay}
        selectedCorp={selectedCorp}
        setSelectedCorp={setSelectedCorp}
        isWindowView={isWindowView}
        setIsWindowView={setIsWindowView}
        onOpenTicket={() => setIsTicketOpen(true)}
        onOpenDhaba={() => setIsDhabaOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
        onTriggerHorn={triggerHorn}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
      />

      {/* Main Container */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-8">
        {/* HERO TITLE & CULTURAL BADGES */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          {/* Authentic Slogan & Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{selectedCorp.hindiName} • {selectedCorp.tagline}</span>
          </div>

          {/* Big Memorable Hero Title */}
          <h1 className="font-yatra text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-amber-200 via-amber-400 to-yellow-500 drop-shadow-md">
            रोडवेज सफ़र
          </h1>

          {/* Nostalgic Subtitle */}
          <p className="font-hindi text-base sm:text-xl text-neutral-300 font-normal leading-relaxed max-w-2xl mx-auto">
            "काँच की खिड़की, कुल्हड़ की कड़क चाय, 90s के सदाबहार नगमे और मीलों तक फैला शांत हाईवे..."
          </p>

          {/* Quick Cultural Trigger Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <button
              onClick={triggerHorn}
              className="px-3 py-1 rounded-xl text-xs font-semibold bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
            >
              <span>📢</span>
              <span>प्रेशर हॉर्न (Press 'H')</span>
            </button>

            <button
              onClick={triggerWhistle}
              className="px-3 py-1 rounded-xl text-xs font-semibold bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
            >
              <span>🔔</span>
              <span>कंडक्टर सीटी (Press 'W')</span>
            </button>

            <button
              onClick={() => setIsTicketOpen(true)}
              className="px-3 py-1 rounded-xl text-xs font-semibold bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>टिकट पंच मशीन (Press 'T')</span>
            </button>

            <button
              onClick={() => setIsDhabaOpen(true)}
              className="px-3 py-1 rounded-xl text-xs font-semibold bg-orange-500/15 hover:bg-orange-500/25 border border-orange-500/30 text-orange-300 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Coffee className="w-3.5 h-3.5" />
              <span>20 Min ढाबा स्टॉप (Press 'C')</span>
            </button>
          </div>
        </div>

        {/* CENTRAL HERO VISUAL (Hero Bus or First-Person Window Seat View) */}
        <div className="w-full">
          {isWindowView ? (
            <WindowSeatView
              corp={selectedCorp}
              timeOfDay={timeOfDay}
              onClose={() => setIsWindowView(false)}
              speed={speed}
            />
          ) : (
            <HeroBusVisual
              corp={selectedCorp}
              onOpenTicket={() => setIsTicketOpen(true)}
              onOpenWindowView={() => setIsWindowView(true)}
              speed={speed}
              setSpeed={setSpeed}
            />
          )}
        </div>

        {/* ROTATING NOSTALGIC QUOTES CAROUSEL */}
        <div className="w-full pt-2">
          <QuotesTicker />
        </div>

        {/* CULTURAL MEMORY ARTIFACTS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          {/* Card 1: Window Seat Emotion */}
          <div
            onClick={() => setIsWindowView(!isWindowView)}
            className="p-5 rounded-2xl bg-neutral-900/60 hover:bg-neutral-900/90 border border-neutral-800 hover:border-amber-500/40 transition-all cursor-pointer group shadow-lg"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 group-hover:scale-110 transition-transform">
                <Wind className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-yatra text-base text-neutral-100 group-hover:text-amber-300 transition-colors">
                  खिड़की वाली सीट (The Window Seat)
                </h3>
                <span className="text-[11px] text-neutral-400 font-hindi">रोडवेज़ का सबसे कीमती कोना</span>
              </div>
            </div>
            <p className="text-xs text-neutral-300 font-hindi leading-relaxed">
              काँच की वो खड़खड़ाहट, बाहर से आती ताज़ी ठंडी हवा, और कानों में बजते पुराने गाने। ऐसा सुकून किसी फ्लाइट या एसी कार में नहीं मिलता।
            </p>
          </div>

          {/* Card 2: Conductor & Brass Whistle */}
          <div
            onClick={() => setIsTicketOpen(true)}
            className="p-5 rounded-2xl bg-neutral-900/60 hover:bg-neutral-900/90 border border-neutral-800 hover:border-amber-500/40 transition-all cursor-pointer group shadow-lg"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 group-hover:scale-110 transition-transform">
                <Ticket className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-yatra text-base text-neutral-100 group-hover:text-amber-300 transition-colors">
                  कंडक्टर साब & चमड़े का बैग
                </h3>
                <span className="text-[11px] text-neutral-400 font-hindi">खट-खट टिकट पंचर की धुन</span>
              </div>
            </div>
            <p className="text-xs text-neutral-300 font-hindi leading-relaxed">
              खुले पैसे खनखनाते हुए कंडक्टर साब: "चंडीगढ़... अंबाला... जिसका टिकट नहीं है जल्दी बना लो!" और हाथ में वो पीतल की सीटी।
            </p>
          </div>

          {/* Card 3: 2 AM Dhaba Stop */}
          <div
            onClick={() => setIsDhabaOpen(true)}
            className="p-5 rounded-2xl bg-neutral-900/60 hover:bg-neutral-900/90 border border-neutral-800 hover:border-amber-500/40 transition-all cursor-pointer group shadow-lg"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400 group-hover:scale-110 transition-transform">
                <Coffee className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-yatra text-base text-neutral-100 group-hover:text-amber-300 transition-colors">
                  2 AM ढाबा स्टॉप (Murthal Stop)
                </h3>
                <span className="text-[11px] text-neutral-400 font-hindi">कड़क चाय और गरमा-गरम परांठे</span>
              </div>
            </div>
            <p className="text-xs text-neutral-300 font-hindi leading-relaxed">
              रात के सन्नाटे में हाईवे किनारे जलती पीली हैलोजन लाइट, कुल्हड़ की सौंधी चाय और दूर बजता लाउडस्पीकर पर मोहम्मद रफ़ी का नगमा।
            </p>
          </div>
        </div>
      </main>

      {/* MODALS */}
      <TicketPunchModal
        corp={selectedCorp}
        isOpen={isTicketOpen}
        onClose={() => setIsTicketOpen(false)}
      />

      <DhabaChaiExperience
        isOpen={isDhabaOpen}
        onClose={() => setIsDhabaOpen(false)}
      />

      <ShortcutsModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      {/* FIXED GLASSMORPHISM MUSIC PLAYER */}
      <MusicPlayer
        isMuted={isMuted}
        setIsMuted={setIsMuted}
      />
    </div>
  
  );
}
