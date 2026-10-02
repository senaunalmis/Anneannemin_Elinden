import React, { useState, useEffect } from 'react';
import { Mic, MicOff, RotateCcw, Check, Edit3 } from 'lucide-react';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { BigButton } from '../common/BigButton';
import { audioFeedback } from '../../services/audioFeedback';
import { toTurkishUpper } from '../../utils/turkishUpper';

interface StepDishTitleProps {
  initialTitle?: string;
  onNext: (dishTitle: string) => void;
  onCancel: () => void;
}

export const StepDishTitle: React.FC<StepDishTitleProps> = ({
  initialTitle = '',
  onNext,
  onCancel,
}) => {
  const [title, setTitle] = useState(initialTitle);
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

  // Sync recognized speech to title
  useEffect(() => {
    if (transcript) {
      setTitle(transcript);
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

  const handleConfirm = () => {
    if (!title.trim()) return;
    audioFeedback.playSuccess();
    onNext(toTurkishUpper(title));
  };

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* Question prompt card */}
      <div className="bg-amber-100/80 border-3 border-amber-300 rounded-3xl p-6 text-center shadow-sm">
        <span className="text-4xl mb-2 block">🍲</span>
        <h2 className="text-2xl sm:text-3xl font-black text-stone-950 leading-tight">
          HANGİ YEMEĞİN TARİFİNİ YAZIYORUZ ANNEANNE?
        </h2>
        <p className="text-stone-900 text-xl font-extrabold mt-3 bg-white/70 py-2 px-4 rounded-2xl border border-amber-200 inline-block">
          Mikrofona bas ve yemeğin adını söyle.
        </p>
      </div>

      {/* Giant Microphone Button */}
      <div className="flex flex-col items-center">
        <button
          type="button"
          onClick={handleMicToggle}
          className={`w-40 h-40 sm:w-48 sm:h-48 rounded-full flex flex-col items-center justify-center transition-transform active:scale-95 shadow-xl select-none ${
            isListening
              ? 'bg-rose-600 text-white animate-mic-pulse ring-8 ring-rose-300'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white ring-8 ring-emerald-200'
          }`}
          aria-label={isListening ? 'Dinlemeyi Durdur' : 'Yemek Adını Söyle'}
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
          <p className="mt-3 text-stone-900 bg-amber-100 border border-amber-300 px-5 py-3 rounded-2xl text-center text-lg font-extrabold">
            Bu cihazda ses tanıma desteklenmiyor. Aşağıdaki kutuya elle yazabilirsiniz.
          </p>
        )}

        {error && (
          <p className="mt-3 text-rose-950 bg-rose-100 border-2 border-rose-300 px-5 py-3 rounded-2xl text-center text-lg font-black">
            {error}
          </p>
        )}
      </div>

      {/* Spoken Text Display Card */}
      {title && (
        <div className="bg-white border-4 border-emerald-600 rounded-3xl p-6 shadow-xl flex flex-col gap-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b-2 border-stone-200 pb-3 flex-wrap gap-2">
            <span className="text-stone-900 font-black text-base sm:text-lg tracking-wider bg-stone-100 px-3 py-1.5 rounded-xl border border-stone-300">
              YAZILACAK YEMEK BAŞLIĞI:
            </span>
            <button
              type="button"
              onClick={() => setIsManualEditing(!isManualEditing)}
              className="flex items-center gap-1.5 text-stone-900 bg-stone-200 hover:bg-stone-300 border-2 border-stone-300 px-3.5 py-2 rounded-xl font-black text-base transition-colors"
              title="Elle Düzenle"
            >
              <Edit3 className="w-5 h-5 text-stone-700" />
              <span>DÜZENLE</span>
            </button>
          </div>

          {/* Huge uppercase display */}
          {isManualEditing ? (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(toTurkishUpper(e.target.value))}
              className="w-full text-3xl sm:text-4xl font-black text-stone-950 border-3 border-emerald-600 rounded-2xl p-4 bg-emerald-50/50 focus:outline-hidden"
              autoFocus
            />
          ) : (
            <div className="text-3xl sm:text-5xl font-black text-stone-950 text-center py-4 tracking-wide break-words select-text leading-tight bg-amber-50/60 rounded-2xl border-2 border-amber-200">
              {title}
            </div>
          )}

          <div className="text-center text-stone-950 font-black text-lg sm:text-xl bg-stone-100 p-4 rounded-2xl border-2 border-stone-200 leading-snug">
            ✍️ Anneanne bu başlığı defterine büyük harflerle yaz, sonra aşağıdaki yeşil butona bas.
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-3 mt-2">
        {title ? (
          <BigButton
            variant="primary"
            size="huge"
            onClick={handleConfirm}
            icon={<Check className="w-9 h-9" />}
          >
            DEFTERİME YAZDIM ✍️
          </BigButton>
        ) : (
          <div className="text-center text-stone-900 font-extrabold text-xl py-3 bg-stone-100 rounded-2xl border border-stone-200">
            Önce mikrofon düğmesine basıp yemek adını söyle anneanneciğim.
          </div>
        )}

        {title && (
          <button
            type="button"
            onClick={() => {
              setTitle('');
              resetTranscript();
            }}
            className="flex items-center justify-center gap-2 bg-stone-200 hover:bg-stone-300 border-2 border-stone-300 text-stone-900 font-black py-3.5 px-4 rounded-2xl text-lg transition-colors"
          >
            <RotateCcw className="w-5 h-5 text-stone-700" />
            <span>Yanlış olduysa yeniden söyle</span>
          </button>
        )}

        <button
          type="button"
          onClick={onCancel}
          className="text-stone-700 font-black py-2.5 text-base hover:text-stone-950 text-center underline decoration-2 underline-offset-4"
        >
          ← Vazgeç ve Ana Sayfaya Dön
        </button>
      </div>
    </div>
  );
};
