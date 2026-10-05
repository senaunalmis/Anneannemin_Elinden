import React, { useState, useEffect } from 'react';
import { Mic, MicOff, RotateCcw, Trash2, Flag, Edit3, ArrowRight } from 'lucide-react';
import type { RecipeItem } from '../../types/recipe';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { BigButton } from '../common/BigButton';
import { audioFeedback } from '../../services/audioFeedback';
import { toTurkishUpper } from '../../utils/turkishUpper';

interface StepIngredientsAndStepsProps {
  dishTitle: string;
  items: RecipeItem[];
  onAddItem: (text: string) => void;
  onDeleteItem: (id: string) => void;
  onFinishRecipe: () => void;
  onBackToTitle: () => void;
}

export const StepIngredientsAndSteps: React.FC<StepIngredientsAndStepsProps> = ({
  dishTitle,
  items,
  onAddItem,
  onDeleteItem,
  onFinishRecipe,
  onBackToTitle,
}) => {
  const [currentText, setCurrentText] = useState('');
  const [isManualEditing, setIsManualEditing] = useState(false);

  const {
    isListening,
    transcript,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      setCurrentText(transcript);
    }
  }, [transcript]);

  const handleMicToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      startListening();
    }
  };

  const [justAddedCooldown, setJustAddedCooldown] = useState(false);

  const handleConfirmWritten = () => {
    if (!currentText.trim()) return;
    audioFeedback.playSuccess();
    onAddItem(toTurkishUpper(currentText));
    setCurrentText('');
    resetTranscript();
    setIsManualEditing(false);
    // 600ms safety cooldown to prevent ghost tap-through onto the next button
    setJustAddedCooldown(true);
    setTimeout(() => {
      setJustAddedCooldown(false);
    }, 600);
  };

  const handleSafeFinish = () => {
    if (justAddedCooldown) return;
    onFinishRecipe();
  };

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* Current Recipe Header Banner */}
      <div className="bg-amber-600 text-white rounded-3xl p-5 shadow-sm border-2 border-amber-700 flex items-center justify-between gap-3">
        <div>
          <span className="text-amber-100 font-black text-xs sm:text-sm tracking-widest block uppercase">
            YAZILAN TARİF:
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-wide uppercase break-words">
            {dishTitle}
          </h2>
        </div>
        <button
          type="button"
          onClick={onBackToTitle}
          className="text-amber-950 bg-amber-100 hover:bg-white font-black px-3.5 py-2 rounded-2xl text-sm shrink-0 shadow-xs transition-colors"
        >
          Başlığı Değiştir
        </button>
      </div>

      {/* Spoken Text Display Card */}
      {currentText ? (
        <div className="bg-white border-4 border-emerald-600 rounded-3xl p-6 shadow-xl flex flex-col gap-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b-2 border-stone-200 pb-3 flex-wrap gap-2">
            <span className="text-stone-900 font-black text-base sm:text-lg bg-emerald-100 text-emerald-950 px-3 py-1.5 rounded-xl border border-emerald-300">
              DEFTERİNE ŞUNU YAZ:
            </span>
            <button
              type="button"
              onClick={() => setIsManualEditing(!isManualEditing)}
              className="flex items-center gap-1.5 text-stone-900 bg-stone-200 hover:bg-stone-300 border-2 border-stone-300 px-3.5 py-2 rounded-xl font-black text-base transition-colors"
            >
              <Edit3 className="w-5 h-5 text-stone-700" />
              <span>DÜZENLE</span>
            </button>
          </div>

          {/* Huge uppercase display */}
          {isManualEditing ? (
            <input
              type="text"
              value={currentText}
              onChange={(e) => setCurrentText(toTurkishUpper(e.target.value))}
              className="w-full text-2xl sm:text-3xl font-black text-stone-950 border-3 border-emerald-600 rounded-2xl p-4 bg-emerald-50/50 focus:outline-hidden"
              autoFocus
            />
          ) : (
            <div className="text-2xl sm:text-4xl font-black text-stone-950 text-center py-4 tracking-wide break-words select-text bg-amber-50/70 rounded-2xl border-2 border-amber-200 leading-tight">
              {currentText}
            </div>
          )}

          <div className="text-center text-stone-950 font-black text-lg sm:text-xl bg-stone-100 p-4 rounded-2xl border-2 border-stone-200 leading-snug">
            ✍️ Anneanne bunu defterine yaz, bitince yeşil butona bas.
          </div>

          <div className="flex flex-col gap-2 mt-1">
            <BigButton
              variant="primary"
              size="huge"
              onClick={handleConfirmWritten}
              icon={<ArrowRight className="w-9 h-9" />}
            >
              DEFTERİME YAZDIM ✍️
            </BigButton>

            <button
              type="button"
              onClick={() => {
                setCurrentText('');
                resetTranscript();
              }}
              className="flex items-center justify-center gap-2 bg-stone-200 hover:bg-stone-300 border-2 border-stone-300 text-stone-900 font-black py-3 px-4 rounded-2xl text-base transition-colors mt-1"
            >
              <RotateCcw className="w-5 h-5 text-stone-700" />
              <span>Yanlış anlaşıldıysa sil ve yeniden söyle</span>
            </button>
          </div>
        </div>
      ) : (
        /* Giant Microphone Prompt Card */
        <div className="bg-stone-100 border-3 border-stone-300 rounded-3xl p-6 text-center shadow-xs flex flex-col items-center">
          <p className="text-stone-950 font-black text-2xl sm:text-3xl mb-5 leading-snug">
            {items.length === 0
              ? 'İLK MALZEMEYİ VEYA ADIMI SÖYLE ANNEANNE'
              : 'SIRADAKİ MALZEMEYİ VEYA ADIMI SÖYLE'}
          </p>

          <button
            type="button"
            onClick={handleMicToggle}
            className={`w-40 h-40 sm:w-48 sm:h-48 rounded-full flex flex-col items-center justify-center transition-transform active:scale-95 shadow-xl select-none ${
              isListening
                ? 'bg-rose-600 text-white animate-mic-pulse ring-8 ring-rose-300'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white ring-8 ring-emerald-200'
            }`}
            aria-label={isListening ? 'Dinlemeyi Durdur' : 'Malzeme Söyle'}
          >
            {isListening ? (
              <>
                <MicOff className="w-16 h-16 mb-2" />
                <span className="text-base sm:text-lg font-black tracking-wider">
                  DURDUR
                </span>
              </>
            ) : (
              <>
                <Mic className="w-16 h-16 mb-2" />
                <span className="text-base sm:text-lg font-black tracking-wider">
                  DOKUN VE SÖYLE
                </span>
              </>
            )}
          </button>

          {isListening && (
            <div className="mt-4 bg-rose-100 border-2 border-rose-300 px-5 py-2.5 rounded-2xl animate-pulse">
              <p className="text-rose-950 font-black text-xl sm:text-2xl text-center">
                🔴 Seni dinliyorum anneanne, söyleyebilirsin...
              </p>
            </div>
          )}

          {!isSupported && (
            <div className="mt-4 w-full">
              <input
                type="text"
                placeholder="ÖRN: 1 SU BARDAĞI SÜT"
                className="w-full text-2xl font-black p-4 border-3 border-stone-400 rounded-2xl text-center uppercase bg-white"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    setCurrentText(toTurkishUpper(e.currentTarget.value));
                    e.currentTarget.value = '';
                  }
                }}
              />
            </div>
          )}

          {error && (
            <p className="mt-3 text-rose-950 bg-rose-100 border-2 border-rose-300 px-5 py-3 rounded-2xl text-center text-lg font-black">
              {error}
            </p>
          )}

          <div className="mt-5 bg-amber-100/90 border-2 border-amber-300 text-stone-950 font-extrabold text-base sm:text-lg px-4 py-2.5 rounded-2xl">
            💡 Örnek: "1 YEMEK KAŞIĞI TUZ" veya "20 DAKİKA PİŞİR"
          </div>
        </div>
      )}

      {/* "Tarif Bitti" Button - Always prominent when items are added */}
      {items.length > 0 && !currentText && (
        <div className="pt-2 flex flex-col gap-2">
          <BigButton
            variant="secondary"
            size="huge"
            onClick={handleSafeFinish}
            icon={<Flag className="w-9 h-9" />}
          >
            TARİF BİTTİ (İSMET'E GÖSTER) 🏁
          </BigButton>
          <div className="text-center text-stone-900 font-extrabold text-base bg-amber-50 p-2.5 rounded-xl border border-amber-200">
            Tüm malzemeler bittiyse dedeme kontrol ettirmek için yukarıdaki butona bas.
          </div>
        </div>
      )}

      {/* Previously recorded items list - High Contrast */}
      <div className="mt-4 flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-stone-950 font-black text-xl sm:text-2xl">
            DEFTERE YAZILANLAR ({items.length} MADDE)
          </h3>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-8 bg-stone-100 border-3 border-dashed border-stone-300 rounded-3xl text-stone-700 font-extrabold text-lg">
            Henüz bir malzeme veya adım yazılmadı.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="bg-white border-3 border-stone-300 rounded-2xl p-4 shadow-sm flex items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3.5">
                  <span className="w-10 h-10 rounded-2xl bg-emerald-700 text-white font-black flex items-center justify-center shrink-0 text-lg shadow-xs">
                    {index + 1}
                  </span>
                  <span className="font-black text-stone-950 text-xl sm:text-2xl tracking-wide uppercase leading-snug select-text">
                    {item.text}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => onDeleteItem(item.id)}
                    className="p-3 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-xl border border-rose-200"
                    title="Bu maddeyi sil"
                  >
                    <Trash2 className="w-6 h-6 text-rose-700" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
