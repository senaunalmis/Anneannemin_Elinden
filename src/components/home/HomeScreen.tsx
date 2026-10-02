import React from 'react';
import { PenTool, BookOpen, ArrowDownToLine, Sparkles } from 'lucide-react';
import { BigButton } from '../common/BigButton';

interface HomeScreenProps {
  recipeCount: number;
  onStartNewRecipe: () => void;
  onOpenRecipeBook: () => void;
  canInstall?: boolean;
  onInstallApp?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  recipeCount,
  onStartNewRecipe,
  onOpenRecipeBook,
  canInstall,
  onInstallApp,
}) => {
  return (
    <div className="flex flex-col gap-6 py-2">
      {/* Welcome Banner */}
      <div className="text-center flex flex-col items-center bg-gradient-to-b from-amber-100 to-amber-50 border-3 border-amber-300 rounded-3xl p-6 sm:p-8 shadow-sm">
        <span className="text-7xl mb-3 animate-gentle-bounce">👵</span>
        <h1 className="text-3xl sm:text-4xl font-black text-stone-950 tracking-tight leading-tight">
          ANNEANNEMİN ELİNDEN
        </h1>
        <p className="text-amber-950 text-xl sm:text-2xl font-black mt-2">
          Tarif Defteri
        </p>
        <p className="text-stone-800 text-lg sm:text-xl font-extrabold mt-3 max-w-md leading-relaxed bg-white/80 py-2.5 px-4 rounded-2xl border border-amber-200">
          Sen sesli söyle anneanne, ekrandan oku ve kendi defterine yaz!
        </p>
      </div>

      {/* Primary Action Buttons */}
      <div className="flex flex-col gap-4">
        <BigButton
          variant="primary"
          size="huge"
          onClick={onStartNewRecipe}
          icon={<PenTool className="w-8 h-8" />}
        >
          YENİ TARİF YAZ ✍️
        </BigButton>

        <BigButton
          variant="secondary"
          size="huge"
          onClick={onOpenRecipeBook}
          icon={<BookOpen className="w-8 h-8" />}
        >
          TARİFLERİM ({recipeCount} TARİF)
        </BigButton>
      </div>

      {/* PWA Install to Home Screen button (if supported) */}
      {canInstall && (
        <button
          type="button"
          onClick={onInstallApp}
          className="bg-stone-900 hover:bg-black text-white font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-3 shadow-md text-lg transition-transform active:scale-98"
        >
          <ArrowDownToLine className="w-6 h-6 text-amber-300" />
          <span>UYGULAMAYI TELEFONA YÜKLE</span>
        </button>
      )}

      {/* How it works info card - High Contrast, Large Text for Elderly Eyes */}
      <div className="bg-white border-3 border-stone-300 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-stone-200">
          <Sparkles className="w-6 h-6 text-amber-600 shrink-0" />
          <h3 className="text-stone-950 font-black text-xl sm:text-2xl tracking-wide">
            NASIL KULLANILIR?
          </h3>
        </div>

        <div className="flex flex-col gap-4 text-stone-900 font-extrabold text-lg sm:text-xl">
          <div className="flex items-center gap-3.5 bg-amber-50/80 p-3 rounded-2xl border border-amber-200">
            <span className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 font-black text-xl shadow-xs">
              1
            </span>
            <span className="leading-snug">Mikrofona dokun, yemeğin adını söyle.</span>
          </div>

          <div className="flex items-center gap-3.5 bg-amber-50/80 p-3 rounded-2xl border border-amber-200">
            <span className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 font-black text-xl shadow-xs">
              2
            </span>
            <span className="leading-snug">Ekrana çıkan yazıyı defterine yaz, "Yazdım" de.</span>
          </div>

          <div className="flex items-center gap-3.5 bg-amber-50/80 p-3 rounded-2xl border border-amber-200">
            <span className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 font-black text-xl shadow-xs">
              3
            </span>
            <span className="leading-snug">Malzemeleri sırayla söyle ve defterine geçir.</span>
          </div>

          <div className="flex items-center gap-3.5 bg-emerald-50 p-3 rounded-2xl border border-emerald-300">
            <span className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 font-black text-xl shadow-xs">
              4
            </span>
            <span className="leading-snug text-emerald-950">Bitince dedeye kontrol ettirip onayla!</span>
          </div>
        </div>
      </div>
    </div>
  );
};
