import React from 'react';
import { X, Keyboard, Volume2, Sparkles, Bus } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'H', action: 'प्रेशर हॉर्न बजाएं (Multi-tone Highway Horn)' },
    { key: 'W', action: 'कंडक्टर की सीटी (Brass Conductor Whistle)' },
    { key: 'T', action: 'टिकट पंच मशीन खोलें (Ticket Punch Machine)' },
    { key: 'Space', action: 'म्यूजिक प्ले / पॉज़ (Play / Pause Melodies)' },
    { key: 'V', action: 'खिड़की वाली सीट व्यू बदलें (Toggle Window Seat View)' },
    { key: 'C', action: '20 मिनट ढाबा चाय ब्रेक (Open Dhaba Stop)' },
    { key: '1, 2, 3, 4', action: 'समय बदलें (Bhor, Dopahar, Shaam, Raat)' },
  ];

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

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
            <Keyboard className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-yatra text-xl text-amber-300">
              कीबोर्ड शॉर्टकट व गाइड (Shortcuts)
            </h3>
            <p className="text-xs text-neutral-400 font-hindi">
              सफ़र को और जीवंत बनाने के लिए इन कुंजियों का उपयोग करें
            </p>
          </div>
        </div>

        {/* Shortcuts List */}
        <div className="space-y-2.5 mb-6">
          {shortcuts.map((sc, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-950/60 border border-neutral-800 text-xs"
            >
              <span className="font-hindi text-neutral-200">{sc.action}</span>
              <kbd className="px-2.5 py-1 rounded-lg bg-neutral-800 border border-neutral-700 font-mono font-bold text-amber-400 shadow-sm">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        {/* Nostalgic Memory Note */}
        <div className="bg-gradient-to-r from-amber-950/40 to-neutral-950 p-4 rounded-2xl border border-amber-500/20 text-xs text-neutral-300 font-hindi leading-relaxed">
          <div className="flex items-center gap-1.5 text-amber-300 font-bold mb-1 font-sans">
            <Sparkles className="w-3.5 h-3.5" /> रोडवेज़ सफ़र की सच्ची यादें:
          </div>
          "जब सफ़र मंज़िल से ज्यादा खूबसूरत हो, और हर मोड़ पर एक नई कहानी इंतज़ार कर रही हो। खिड़की से आती हवा और कानों में पुराने गाने ही असली ज़िन्दगी हैं।"
        </div>
      </div>
    </div>
  );
};
