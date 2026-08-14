import React, { useState } from 'react';
import { DHABA_ITEMS } from '../data/busData';
import { playPressureHorn } from '../utils/audioSynthesizer';
import { X, Coffee, Radio, Sparkles, Check, Heart } from 'lucide-react';

interface DhabaChaiExperienceProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DhabaChaiExperience: React.FC<DhabaChaiExperienceProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedItem, setSelectedItem] = useState(DHABA_ITEMS[0]);
  const [chaiCount, setChaiCount] = useState(1);
  const [radioPlaying, setRadioPlaying] = useState(true);
  const [enjoyedMessage, setEnjoyedMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleOrder = (item: typeof DHABA_ITEMS[0]) => {
    setSelectedItem(item);
    setEnjoyedMessage(`स्वाद ले लिया: ${item.hindiName}!`);
    setTimeout(() => setEnjoyedMessage(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Dhaba Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl shadow-inner">
            ☕
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-red-900/60 text-red-300 border border-red-700">
                20 मिनट ठहराव • 20 MIN HALT
              </span>
              <span className="text-xs text-neutral-400 font-mono">NH-44 MURTHAL</span>
            </div>
            <h3 className="font-yatra text-xl sm:text-2xl text-amber-300">
              हाईवे ढाबा & कुल्हड़ चाय पॉइंट
            </h3>
          </div>
        </div>

        {/* Steaming Kulhad Chai & Vintage Radio Highlight Card */}
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          {/* Left: Steaming Clay Chai Glass */}
          <div className="bg-gradient-to-br from-amber-950/40 to-neutral-950 border border-amber-500/30 rounded-2xl p-4 flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="relative my-2">
              {/* Rising Steam */}
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-6 h-8 animate-steam pointer-events-none opacity-90">
                <Sparkles className="w-4 h-4 text-amber-200" />
              </div>
              {/* Kulhad */}
              <div className="w-16 h-20 bg-gradient-to-b from-amber-700 to-amber-900 border-2 border-amber-950 rounded-b-xl rounded-t-sm shadow-xl flex items-center justify-center font-hindi text-sm text-amber-100 font-bold">
                कुल्हड़
              </div>
            </div>

            <h4 className="font-hindi text-base font-bold text-amber-200 mt-2">
              अदरक-इलायची वाली कड़क चाय
            </h4>
            <p className="text-xs text-neutral-400 font-sans">
              कुल्हड़ में चाय की सौंधी खुशबू और रात की ठंडी हवा
            </p>

            <button
              onClick={() => setChaiCount((c) => c + 1)}
              className="mt-3 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold transition-all shadow cursor-pointer"
            >
              एक और कुल्हड़ चाय! ({chaiCount})
            </button>
          </div>

          {/* Right: Vintage Murphy Transistor Radio */}
          <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-mono font-bold text-amber-300">
                  MURPHY TRANSISTOR
                </span>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">
                FM 102.6 MHZ
              </span>
            </div>

            <div className="my-3 bg-neutral-950 p-2.5 rounded-xl border border-neutral-800">
              <div className="text-[11px] text-neutral-400 font-hindi">बज रहा है:</div>
              <div className="text-xs font-bold text-amber-200 font-sans truncate">
                "जिंदगी एक सफ़र है सुहाना..." — किशोर कुमार
              </div>
              <div className="text-[10px] text-neutral-500 mt-0.5">ढाबे की छत पर टंगी लाउडस्पीकर की गूंज</div>
            </div>

            <button
              onClick={() => playPressureHorn('musical')}
              className="w-full py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-amber-300 text-xs font-semibold border border-neutral-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>📢</span>
              <span>बस चलने का हॉर्न बजाएं</span>
            </button>
          </div>
        </div>

        {/* Dhaba Menu Items Grid */}
        <div className="space-y-2">
          <div className="text-xs font-bold font-hindi text-neutral-300 flex items-center justify-between">
            <span>ढाबा स्पेशल मेनू (Menu Items):</span>
            {enjoyedMessage && (
              <span className="text-emerald-400 font-hindi text-xs flex items-center gap-1 animate-pulse">
                <Check className="w-3 h-3" /> {enjoyedMessage}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
            {DHABA_ITEMS.map((item) => (
              <div
                key={item.id}
                onClick={() => handleOrder(item)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  selectedItem.id === item.id
                    ? 'bg-amber-500/15 border-amber-500/50 shadow-md'
                    : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <div className="text-xs font-bold font-hindi text-neutral-200">
                      {item.hindiName}
                    </div>
                    <div className="text-[11px] text-neutral-400 font-sans truncate max-w-[150px]">
                      {item.name}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-extrabold text-amber-400 font-mono">{item.price}</div>
                  <span className="text-[10px] text-neutral-500">Order</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-5 pt-3 border-t border-neutral-800 text-center text-xs text-neutral-500 font-hindi">
          "चाय पीने के बाद कंडक्टर साब की सीटी बजने से पहले बस में बैठ जाएं!" 🚌
        </div>
      </div>
    </div>
  );
};
