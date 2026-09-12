import React from 'react';
import { X, Keyboard, Mouse, Gamepad2, Sparkles, Terminal } from 'lucide-react';

interface ControlsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ControlsModal: React.FC<ControlsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const keySections = [
    {
      title: 'Movement & Navigation',
      items: [
        { key: 'W / A / S / D', desc: 'Walk Forward / Left / Backward / Right' },
        { key: 'Spacebar', desc: 'Jump / Swim Upwards' },
        { key: 'Left Shift', desc: 'Sneak / Crouch / Descend in Creative' },
        { key: 'Left Ctrl', desc: 'Sprint / Run fast (or double-tap W)' },
      ]
    },
    {
      title: 'Mouse & Actions',
      items: [
        { key: 'Left Click', desc: 'Break blocks / Attack entities' },
        { key: 'Right Click', desc: 'Place blocks / Open chests / Use items' },
        { key: 'Scroll Wheel / 1-9', desc: 'Select items on hotbar' },
        { key: 'Click Screen', desc: 'Lock mouse cursor for 3D view' },
      ]
    },
    {
      title: 'Inventory & Game Menus',
      items: [
        { key: 'E', desc: 'Open / Close Inventory' },
        { key: 'Q', desc: 'Drop currently held item' },
        { key: 'Escape (Esc)', desc: 'Pause menu / Release mouse pointer' },
        { key: 'T or /', desc: 'Open multiplayer chat / Enter command' },
      ]
    },
    {
      title: 'Advanced & Debug Views',
      items: [
        { key: 'F5', desc: 'Toggle Perspective (1st person / 3rd person)' },
        { key: 'F3', desc: 'Debug screen (Coordinates, Biome, FPS)' },
        { key: 'F11', desc: 'Toggle Fullscreen Mode' },
        { key: 'F1', desc: 'Hide GUI / HUD for screenshots' },
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="bg-[#171922] border border-[#373e4f] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#1e222d] px-6 py-4 border-b border-[#2f3545] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Keyboard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Eaglecraft Controls & Keybinds</h3>
              <p className="text-xs text-gray-400">Standard Minecraft 1.8.8 desktop controls</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#272d3b] hover:bg-[#343d50] text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {keySections.map((section, idx) => (
              <div key={idx} className="bg-[#11131a] border border-[#272d3a] rounded-xl p-4 space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  {section.title}
                </h4>
                <div className="space-y-2">
                  {section.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-xs gap-2">
                      <kbd className="px-2 py-1 rounded bg-[#202532] border border-[#343d52] font-mono font-semibold text-gray-200 shrink-0">
                        {item.key}
                      </kbd>
                      <span className="text-gray-300 text-right">{item.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Useful Tips */}
          <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-4 text-xs text-gray-300 space-y-1.5">
            <div className="font-bold text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Multiplayer & Singleplayer Storage</span>
            </div>
            <p className="leading-relaxed">
              Singleplayer worlds are automatically saved directly in your browser's local IndexedDB database. Multiplayer servers stream chunks dynamically via WebSockets. You can export/backup worlds anytime from the world select screen.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-[#1b1e27] px-6 py-3 border-t border-[#2d3342] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors"
          >
            Got It, Back to Game
          </button>
        </div>
      </div>
    </div>
  );
};
