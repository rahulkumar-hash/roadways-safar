import React, { useState } from 'react';
import { BusCorporation, BusTicket } from '../types';
import { playTicketPunchSound, playConductorWhistle } from '../utils/audioSynthesizer';
import confetti from 'canvas-confetti';
import { X, Stamp, CheckCircle2, Share2, Printer, Sparkles } from 'lucide-react';

interface TicketPunchModalProps {
  corp: BusCorporation;
  isOpen: boolean;
  onClose: () => void;
}

export const TicketPunchModal: React.FC<TicketPunchModalProps> = ({
  corp,
  isOpen,
  onClose,
}) => {
  const [passengerName, setPassengerName] = useState('यात्री (Traveler)');
  const [fromCity, setFromCity] = useState(corp.defaultRoute.from);
  const [toCity, setToCity] = useState(corp.defaultRoute.to);
  const [seatNumber, setSeatNumber] = useState('23-खिड़की (Window)');
  const [fare, setFare] = useState(65);
  const [isPunched, setIsPunched] = useState(false);
  const [punchedHoles, setPunchedHoles] = useState<number[]>([1, 4]);

  if (!isOpen) return null;

  const handlePunch = () => {
    playTicketPunchSound();
    setIsPunched(true);
    setPunchedHoles((prev) => [...prev, Math.floor(Math.random() * 8) + 1]);

    // Confetti paper chits
    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.65 },
      colors: ['#f59e0b', '#ef4444', '#10b981', '#ffffff'],
    });
  };

  const handlePrintOrCopy = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-neutral-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
            <Stamp className="w-3.5 h-3.5" />
            कंडक्टर टिकट मशीन • Bus Ticket Counter
          </div>
          <h3 className="font-yatra text-xl sm:text-2xl text-amber-400">
            {corp.hindiName} टिकट
          </h3>
          <p className="text-xs text-neutral-400 font-hindi">
            अपनी यात्रा का यादगार टिकट बनाएं और पंच करें
          </p>
        </div>

        {/* Customizer Inputs */}
        <div className="grid grid-cols-2 gap-3 mb-6 bg-neutral-950/60 p-3.5 rounded-2xl border border-neutral-800 text-xs">
          <div>
            <label className="block text-[11px] text-neutral-400 mb-1">यात्री का नाम (Name):</label>
            <input
              type="text"
              value={passengerName}
              onChange={(e) => setPassengerName(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-neutral-200 focus:outline-none focus:border-amber-400"
              placeholder="Enter name"
            />
          </div>
          <div>
            <label className="block text-[11px] text-neutral-400 mb-1">सीट संख्या (Seat):</label>
            <input
              type="text"
              value={seatNumber}
              onChange={(e) => setSeatNumber(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-neutral-200 focus:outline-none focus:border-amber-400"
            />
          </div>
          <div>
            <label className="block text-[11px] text-neutral-400 mb-1">कहाँ से (From):</label>
            <input
              type="text"
              value={fromCity}
              onChange={(e) => setFromCity(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-neutral-200 focus:outline-none focus:border-amber-400"
            />
          </div>
          <div>
            <label className="block text-[11px] text-neutral-400 mb-1">कहाँ तक (To):</label>
            <input
              type="text"
              value={toCity}
              onChange={(e) => setToCity(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-neutral-200 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Authentic Vintage Roadways Printed Bus Ticket */}
        <div
          id="authentic-bus-ticket"
          className={`relative w-full rounded-2xl p-5 border-2 shadow-2xl transition-all duration-300 font-mono select-none overflow-hidden ${
            isPunched ? 'animate-punch' : ''
          }`}
          style={{
            backgroundColor: '#fef3c7', // aged yellow paper
            borderColor: '#b45309',
            color: '#1c1917',
          }}
        >
          {/* Jagged Edge / Perforated Top & Bottom */}
          <div className="absolute top-0 left-0 right-0 h-2 flex justify-between overflow-hidden -mt-1">
            {[...Array(24)].map((_, i) => (
              <div key={i} className="w-3 h-3 bg-neutral-900 rounded-full transform -translate-y-1/2" />
            ))}
          </div>

          {/* Ticket Watermark Stamp */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-15 pointer-events-none transform rotate-12">
            <div className="w-32 h-32 rounded-full border-4 border-red-900 flex items-center justify-center text-center font-bold text-red-900 text-xs">
              {corp.name}
              <br />
              VALID JOURNEY
            </div>
          </div>

          {/* Ticket Header */}
          <div className="text-center border-b-2 border-dashed border-amber-900/40 pb-3">
            <div className="font-bold text-xs uppercase tracking-widest text-amber-900">
              ★ {corp.name.toUpperCase()} ★
            </div>
            <div className="font-hindi text-base font-extrabold text-neutral-900">
              {corp.hindiName}
            </div>
            <div className="text-[10px] text-neutral-700">
              साधारण सेवा • BUS NO: {corp.busNumber} • TICKET NO: #{Math.floor(Math.random() * 80000 + 10000)}
            </div>
          </div>

          {/* Punch Holes on the ticket */}
          <div className="absolute left-2 top-1/3 bottom-1/3 flex flex-col justify-around">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div
                key={idx}
                className={`w-3.5 h-3.5 rounded-full border border-amber-900/60 transition-all ${
                  punchedHoles.includes(idx)
                    ? 'bg-neutral-900 shadow-inner'
                    : 'bg-amber-100/50'
                }`}
              />
            ))}
          </div>

          {/* Route & Passenger Details */}
          <div className="my-3 pl-5 space-y-1 text-xs text-neutral-900">
            <div className="flex justify-between">
              <span className="text-neutral-600 font-sans">यात्री / Name:</span>
              <span className="font-bold font-sans">{passengerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600 font-sans">मार्ग / Route:</span>
              <span className="font-bold">{fromCity} ➔ {toCity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600 font-sans">सीट नं. / Seat:</span>
              <span className="font-bold text-amber-900">{seatNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600 font-sans">तारीख / Date:</span>
              <span>{new Date().toLocaleDateString('hi-IN')} {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="flex justify-between items-baseline pt-2 border-t border-dashed border-amber-900/40">
              <span className="text-xs font-bold text-neutral-700">कुल किराया (TOTAL FARE):</span>
              <span className="text-lg font-extrabold text-red-900">₹{fare}.00</span>
            </div>
          </div>

          {/* Slogan & Verification Footer */}
          <div className="text-center pt-2 border-t border-amber-900/40 text-[9px] text-neutral-700 font-hindi flex items-center justify-between">
            <span>बिना टिकट यात्रा दंडनीय है</span>
            {isPunched ? (
              <span className="text-emerald-800 font-bold flex items-center gap-1 font-sans">
                <CheckCircle2 className="w-3 h-3 text-emerald-700 inline" /> PUNCHED / वैध
              </span>
            ) : (
              <span className="text-amber-800 font-bold">पंच की प्रतीक्षा...</span>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <button
            id="punch-ticket-action-btn"
            onClick={handlePunch}
            className="flex-1 py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <Stamp className="w-4 h-4" />
            {isPunched ? 'और पंच करें (Punch Again)' : 'टिकट पंच करें (Punch Ticket)'}
          </button>

          <button
            onClick={handlePrintOrCopy}
            className="py-3 px-4 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-sm font-semibold flex items-center gap-2 border border-neutral-700 transition-colors"
            title="Print / Save Ticket as Souvenir"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>सेव करें</span>
          </button>
        </div>
      </div>
    </div>
  );
};
