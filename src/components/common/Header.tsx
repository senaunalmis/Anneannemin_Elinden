import React from 'react';
import { BookOpen, Home, ArrowLeft } from 'lucide-react';
import type { AppScreen } from '../../types/recipe';

interface HeaderProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  recipesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  recipesCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-stone-100/95 backdrop-blur border-b-3 border-stone-300 px-4 py-3 shadow-xs">
      <div className="max-w-xl mx-auto flex items-center justify-between gap-2">
        {/* Left: Home or Back */}
        {currentScreen !== 'home' ? (
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 bg-stone-200 hover:bg-stone-300 border-2 border-stone-300 text-stone-950 font-black px-3.5 py-2 rounded-2xl text-base transition-colors"
            title="Ana Sayfaya Dön"
          >
            <ArrowLeft className="w-5 h-5 text-stone-800" />
            <span className="hidden sm:inline">ANA SAYFA</span>
          </button>
        ) : (
          <div className="flex items-center gap-2 text-stone-950 font-black text-xl tracking-wide">
            <span className="text-3xl">👵</span>
            <span>ANNEANNE ELİNDEN</span>
          </div>
        )}

        {/* Center: Title if not on home */}
        {currentScreen !== 'home' && (
          <div className="text-stone-950 font-black text-lg sm:text-xl tracking-tight text-center">
            {currentScreen === 'create-title' && '1. YEMEK ADI'}
            {currentScreen === 'create-items' && '2. TARİF YAZIMI'}
            {currentScreen === 'ismet-review' && '3. İSMET KONTROLÜ'}
            {currentScreen === 'recipe-book' && 'TARİF DEFTERİM'}
          </div>
        )}

        {/* Right: Recipe Book button */}
        {currentScreen !== 'recipe-book' ? (
          <button
            onClick={() => onNavigate('recipe-book')}
            className="flex items-center gap-2 bg-amber-200 hover:bg-amber-300 text-stone-950 border-2 border-amber-400 font-black px-3.5 py-2 rounded-2xl text-base transition-colors shadow-xs"
            title="Kayıtlı Tarifleri Gör"
          >
            <BookOpen className="w-5 h-5 text-amber-900" />
            <span className="font-black text-lg">{recipesCount}</span>
          </button>
        ) : (
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 bg-stone-200 hover:bg-stone-300 border-2 border-stone-300 text-stone-950 font-black px-3.5 py-2 rounded-2xl text-base"
          >
            <Home className="w-5 h-5 text-stone-800" />
          </button>
        )}
      </div>
    </header>
  );
};
