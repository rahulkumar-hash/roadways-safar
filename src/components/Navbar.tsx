import React, { useState } from 'react';
import { BusCorporation, TimeOfDay } from '../types';
import { BUS_CORPORATIONS } from '../data/busData';
import {
  Sun,
  Moon,
  Sunset,
  Sunrise,
  Volume2,
  VolumeX,
  Ticket,
  Coffee,
  HelpCircle,
  Bus,
  Layers,
  ChevronDown,
} from 'lucide-react';

interface NavbarProps {
  timeOfDay: TimeOfDay;
  setTimeOfDay: (t: TimeOfDay) => void;
  selectedCorp: BusCorporation;
  setSelectedCorp: (c: BusCorporation) => void;
  isWindowView: boolean;
  setIsWindowView: (v: boolean) => void;
  onOpenTicket: () => void;
  onOpenDhaba: () => void;
  onOpenHelp: () => void;
  onTriggerHorn: () => void;
  isMuted: boolean;
  setIsMuted: (m: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  timeOfDay,
  setTimeOfDay,
  selectedCorp,
  setSelectedCorp,
  isWindowView,
  setIsWindowView,
  onOpenTicket,
  onOpenDhaba,
  onOpenHelp,
  onTriggerHorn,
  isMuted,
  setIsMuted,
}) => {
  const [showCorpDropdownMobile, setShowCorpDropdownMobile] = useState(false);

  const timeIcons = [
    { id: 'bhor', label: 'भोर (Dawn)', icon: Sunrise, time: '5:30 AM' },
    { id: 'dopahar', label: 'दोपहर (Day)', icon: Sun, time: '1:00 PM' },
    { id: 'shaam', label: 'शाम (Sunset)', icon: Sunset, time: '6:45 PM' },
    { id: 'raat', label: 'रात (Midnight)', icon: Moon, time: '11:30 PM' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-neutral-950/85 border-b border-amber-500/20 px-2.5 sm:px-6 py-2 transition-colors duration-500">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2.5">
        {/* Top row on mobile / Left side on desktop */}
        <div className="flex items-center justify-between w-full md:w-auto gap-2">
          {/* Brand & State Route Emblem */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div
              id="brand-logo-badge"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-lg ring-1 ring-amber-400/40 relative overflow-hidden shrink-0 transition-transform duration-300 hover:scale-105"
              style={{ backgroundColor: selectedCorp.primaryColor }}
            >
              <Bus className="w-4 h-4 sm:w-5 sm:h-5 text-amber-200" />
              <div className="absolute inset-0 bg-linear-to-tr from-black/40 via-transparent to-white/20 pointer-events-none" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className="font-yatra text-base sm:text-xl font-bold tracking-wide text-amber-400 drop-shadow-sm flex items-center gap-1.5">
                  रोडवेज सफ़र
                </h1>
                <span className="text-[10px] sm:text-xs font-sans font-medium px-1.5 sm:px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                  ROADWAYS
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-neutral-400 font-hindi truncate max-w-37.5 sm:max-w-xs">
                {selectedCorp.hindiName} • {selectedCorp.tagline}
              </p>
            </div>
          </div>

          {/* Mobile Corporation Picker Dropdown Trigger */}
          <div className="relative md:hidden shrink-0">
            <button
              onClick={() => setShowCorpDropdownMobile(!showCorpDropdownMobile)}
              className="px-2.5 py-1.5 rounded-xl text-xs font-medium bg-neutral-900 border border-amber-500/30 text-amber-300 flex items-center gap-1.5"
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: selectedCorp.primaryColor }}
              />
              <span className="truncate max-w-20">{selectedCorp.name.split(' ')[0]}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {showCorpDropdownMobile && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-neutral-900 border border-neutral-700 rounded-2xl p-1.5 shadow-2xl z-50 animate-fadeIn">
                <div className="text-[10px] text-neutral-400 px-2 py-1 font-hindi border-b border-neutral-800">
                  राज्य रोडवेज चुनें:
                </div>
                {BUS_CORPORATIONS.map((corp) => (
                  <button
                    key={corp.id}
                    onClick={() => {
                      setSelectedCorp(corp);
                      setShowCorpDropdownMobile(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs flex items-center gap-2 transition-colors ${
                      corp.id === selectedCorp.id
                        ? 'bg-amber-500 text-neutral-950 font-bold'
                        : 'text-neutral-300 hover:bg-neutral-800'
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: corp.id === selectedCorp.id ? '#000' : corp.primaryColor }}
                    />
                    <div className="truncate">
                      <div>{corp.name}</div>
                      <div className="text-[9px] opacity-75 font-hindi">{corp.hindiName}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* State Transport Corporation Selector (Desktop & Tablet) */}
        <div className="hidden md:flex items-center gap-1 bg-neutral-900/90 p-1 rounded-xl border border-neutral-800 overflow-x-auto max-w-full">
          {BUS_CORPORATIONS.map((corp) => {
            const isSelected = corp.id === selectedCorp.id;
            return (
              <button
                key={corp.id}
                id={`corp-btn-${corp.id}`}
                onClick={() => setSelectedCorp(corp)}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-amber-500 text-neutral-950 font-bold shadow-md shadow-amber-500/20'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: isSelected ? '#000' : corp.primaryColor }}
                />
                <span>{corp.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Action Controls & Atmosphere Switcher */}
        <div className="flex items-center justify-between md:justify-end gap-1 sm:gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {/* Time of Day Switcher */}
          <div className="flex items-center bg-neutral-900/90 rounded-xl p-0.5 sm:p-1 border border-neutral-800 shadow-inner shrink-0">
            {timeIcons.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                id={`time-btn-${id}`}
                onClick={() => setTimeOfDay(id as TimeOfDay)}
                title={label}
                className={`p-1.5 sm:px-2 sm:py-1 rounded-lg text-xs flex items-center gap-1 transition-all ${
                  timeOfDay === id
                    ? 'bg-amber-500 text-neutral-950 font-semibold shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/40'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden lg:inline text-[11px] capitalize">{id}</span>
              </button>
            ))}
          </div>

          {/* Window Seat View Switcher */}
          <button
            id="window-seat-toggle-btn"
            onClick={() => setIsWindowView(!isWindowView)}
            className={`px-2 sm:px-2.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1 sm:gap-1.5 border shrink-0 transition-all duration-200 ${
              isWindowView
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 ring-1 ring-emerald-500/30'
                : 'bg-neutral-900/80 border-neutral-800 text-neutral-300 hover:bg-neutral-800'
            }`}
            title="खिड़की वाली सीट (Window Seat View)"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="font-hindi text-[11px] sm:text-xs">
              {isWindowView ? 'खिड़की' : 'खिड़की'}
            </span>
          </button>

          {/* Ticket Punch Modal Trigger */}
          <button
            id="ticket-modal-btn"
            onClick={onOpenTicket}
            className="px-2 sm:px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 shrink-0 transition-colors"
            title="टिकट पंचर (Conductor Ticket Machine)"
          >
            <Ticket className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-hindi text-[11px] sm:text-xs">टिकट</span>
          </button>

          {/* Dhaba Break Trigger */}
          <button
            id="dhaba-modal-btn"
            onClick={onOpenDhaba}
            className="px-2 sm:px-2.5 py-1.5 rounded-xl text-xs font-medium bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 flex items-center gap-1 shrink-0 transition-colors"
            title="20 मिनट चाय-नाश्ता ढाबा स्टॉप"
          >
            <Coffee className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-hindi text-[11px] sm:text-xs">ढाबा</span>
          </button>

          {/* Horn Quick Button */}
          <button
            id="nav-horn-btn"
            onClick={onTriggerHorn}
            className="px-2 sm:px-2.5 py-1.5 rounded-xl text-xs font-bold bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 flex items-center gap-1 shrink-0 transition-all active:scale-95 cursor-pointer"
            title="प्रेशर हॉर्न (Press 'H' or Click)"
          >
            <span className="text-sm leading-none">📢</span>
            <span className="hidden sm:inline">हॉर्न</span>
          </button>

          {/* Mute Toggle */}
          <button
            id="mute-toggle-btn"
            onClick={() => setIsMuted(!isMuted)}
            className="p-1.5 sm:p-2 rounded-xl text-neutral-400 hover:text-neutral-100 bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 shrink-0 transition-colors"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Help / Shortcuts */}
          <button
            id="help-shortcuts-btn"
            onClick={onOpenHelp}
            className="p-1.5 sm:p-2 rounded-xl text-neutral-400 hover:text-neutral-100 bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 shrink-0 transition-colors"
            title="Guide & Shortcuts"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
