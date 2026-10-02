import { useState, useEffect, type ReactNode, type FC } from 'react';
import { Lock, Delete } from 'lucide-react';
import { audioFeedback } from '../../services/audioFeedback';

interface FamilyPinGateProps {
  children: ReactNode;
}

export const FamilyPinGate: FC<FamilyPinGateProps> = ({ children }) => {
  const targetPin = (import.meta.env.VITE_FAMILY_PIN || '').trim();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // If no PIN is configured, allow direct access
    if (!targetPin) {
      setIsUnlocked(true);
      return;
    }

    // Check if this device has already unlocked before
    const unlocked = localStorage.getItem('anneanne_family_pin_unlocked');
    if (unlocked === 'true') {
      setIsUnlocked(true);
    }
  }, [targetPin]);

  const handleKeyPress = (num: string) => {
    if (enteredPin.length < 4) {
      const newPin = enteredPin + num;
      setEnteredPin(newPin);
      setHasError(false);

      if (newPin.length === 4) {
        if (newPin === targetPin) {
          audioFeedback.playSuccess();
          localStorage.setItem('anneanne_family_pin_unlocked', 'true');
          setIsUnlocked(true);
        } else {
          setHasError(true);
          setTimeout(() => {
            setEnteredPin('');
            setHasError(false);
          }, 800);
        }
      }
    }
  };

  const handleDelete = () => {
    setEnteredPin((prev) => prev.slice(0, -1));
    setHasError(false);
  };

  // If unlocked or no PIN required, show app
  if (isUnlocked || !targetPin) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#fdfaf3] flex flex-col items-center justify-center p-4">
      <div className="bg-white border-3 border-stone-300 w-full max-w-sm rounded-3xl p-6 sm:p-8 shadow-xl text-center flex flex-col items-center animate-fadeIn">
        <div className="w-16 h-16 rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-amber-900 mb-3">
          <Lock className="w-8 h-8" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-stone-950">
          AİLE GİRİŞİ
        </h2>
        <p className="text-stone-800 font-extrabold text-base mt-2">
          Bu tarif defteri ailemize özeldir. Lütfen 4 haneli şifreyi giriniz:
        </p>

        {/* 4 Pin Dots */}
        <div className="flex gap-4 my-6">
          {[0, 1, 2, 3].map((idx) => (
            <div
              key={idx}
              className={`w-5 h-5 rounded-full border-2 transition-all ${
                enteredPin.length > idx
                  ? 'bg-amber-600 border-amber-800 scale-110'
                  : 'bg-stone-200 border-stone-300'
              } ${hasError ? 'border-rose-600 bg-rose-600 animate-pulse' : ''}`}
            />
          ))}
        </div>

        {hasError && (
          <p className="text-rose-700 font-black text-base mb-3">
            Hatalı şifre, tekrar deneyin!
          </p>
        )}

        {/* Numeric Keypad */}
        <div className="grid grid-cols-3 gap-3 w-full">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleKeyPress(digit)}
              className="h-16 rounded-2xl bg-stone-100 hover:bg-stone-200 border-2 border-stone-300 text-stone-950 font-black text-2xl shadow-xs active:scale-95 transition-all"
            >
              {digit}
            </button>
          ))}
          <div />
          <button
            type="button"
            onClick={() => handleKeyPress('0')}
            className="h-16 rounded-2xl bg-stone-100 hover:bg-stone-200 border-2 border-stone-300 text-stone-950 font-black text-2xl shadow-xs active:scale-95 transition-all"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="h-16 rounded-2xl bg-stone-100 hover:bg-rose-100 border-2 border-stone-300 text-stone-700 hover:text-rose-700 flex items-center justify-center active:scale-95 transition-all"
            title="Sil"
          >
            <Delete className="w-7 h-7" />
          </button>
        </div>

        <p className="text-stone-500 font-bold text-xs mt-6">
          Bu cihazda bir kez girdikten sonra bir daha sormaz.
        </p>
      </div>
    </div>
  );
};
