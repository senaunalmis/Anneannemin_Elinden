import React, { useState } from 'react';
import { BookOpen, Plus, Calendar, CheckCircle2, ChevronRight, Search, RotateCw } from 'lucide-react';
import type { Recipe } from '../../types/recipe';
import { BigButton } from '../common/BigButton';
import { RecipeDetailModal } from './RecipeDetailModal';

interface RecipeBookProps {
  recipes: Recipe[];
  onStartNewRecipe: () => void;
  onDeleteRecipe: (id: string) => void;
  onSyncWithCloud?: () => void;
  isSyncing?: boolean;
  cloudError?: string | null;
}

export const RecipeBook: React.FC<RecipeBookProps> = ({
  recipes,
  onStartNewRecipe,
  onDeleteRecipe,
  onSyncWithCloud,
  isSyncing = false,
  cloudError = null,
}) => {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // If a recipe is selected, render it as a full-screen native view (No popup, no gray border!)
  if (selectedRecipe) {
    return (
      <RecipeDetailModal
        recipe={selectedRecipe}
        onBack={() => setSelectedRecipe(null)}
        onDelete={(id) => {
          onDeleteRecipe(id);
          setSelectedRecipe(null);
        }}
      />
    );
  }

  const filteredRecipes = recipes.filter(r =>
    r.title.toLocaleLowerCase('tr-TR').includes(searchQuery.toLocaleLowerCase('tr-TR'))
  );

  return (
    <div className="flex flex-col gap-6 py-2 animate-fadeIn">
      {/* Title Card */}
      <div className="bg-amber-100 border-3 border-amber-300 rounded-3xl p-6 shadow-xs flex items-center justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-black text-stone-950">
              TARİF DEFTERİM
            </h2>
            {cloudError ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-100 border-2 border-rose-400 text-rose-950 rounded-full text-xs font-black">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
                Bulut Hatası
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 border-2 border-emerald-400 text-emerald-950 rounded-full text-xs font-black">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
                Bulut Bağlantısı Aktif
              </span>
            )}
          </div>
          <p className="text-stone-900 text-lg sm:text-xl font-extrabold mt-1">
            Anneannemin eliyle yazıp İsmet dedemin onayladığı tüm tarifler.
          </p>
        </div>

        {onSyncWithCloud && (
          <button
            type="button"
            onClick={onSyncWithCloud}
            disabled={isSyncing}
            className="flex items-center gap-1.5 bg-white hover:bg-stone-100 text-stone-900 border-2 border-stone-300 font-black px-3.5 py-2.5 rounded-2xl text-base shadow-xs shrink-0 active:scale-95 transition-all"
            title="Buluttan Yeni Tarifleri Çek"
          >
            <RotateCw className={`w-5 h-5 ${isSyncing ? 'animate-spin text-amber-600' : 'text-stone-700'}`} />
            <span className="hidden sm:inline">{isSyncing ? 'Eşitleniyor...' : 'Yenile'}</span>
          </button>
        )}
      </div>

      {cloudError && (
        <div className="bg-rose-50 border-3 border-rose-300 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-rose-950 animate-fadeIn">
          <div>
            <p className="font-black text-base flex items-center gap-2">
              <span>⚠️ Bulut Senkronizasyon Uyarısı:</span>
            </p>
            <p className="text-xs sm:text-sm font-extrabold text-rose-900 mt-1 break-all">
              {cloudError}
            </p>
          </div>
          {onSyncWithCloud && (
            <button
              type="button"
              onClick={onSyncWithCloud}
              disabled={isSyncing}
              className="shrink-0 bg-rose-600 hover:bg-rose-700 text-white font-black px-4 py-2 rounded-xl text-sm active:scale-95 transition-all shadow-xs"
            >
              Tekrar Dene 🔄
            </button>
          )}
        </div>
      )}

      {/* New Recipe Action */}
      <BigButton
        variant="primary"
        size="huge"
        onClick={onStartNewRecipe}
        icon={<Plus className="w-9 h-9" />}
      >
        YENİ TARİF YAZ ✍️
      </BigButton>

      {/* Search if there are recipes */}
      {recipes.length > 2 && (
        <div className="relative">
          <Search className="w-6 h-6 absolute left-4 top-1/2 -translate-y-1/2 text-stone-700" />
          <input
            type="text"
            placeholder="Tarif ara... (Örn: Mantı)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-13 pr-4 py-4 bg-white border-3 border-stone-300 rounded-2xl text-xl font-black text-stone-950 placeholder-stone-500 focus:outline-hidden focus:border-amber-500 shadow-xs"
          />
        </div>
      )}

      {/* Recipe Cards List */}
      <div className="flex flex-col gap-3.5">
        {filteredRecipes.length === 0 ? (
          <div className="text-center py-12 bg-stone-100 border-3 border-dashed border-stone-300 rounded-3xl p-6">
            <BookOpen className="w-14 h-14 text-stone-400 mx-auto mb-3" />
            <p className="text-stone-950 font-black text-2xl">
              {searchQuery ? 'Aradığınız tarif bulunamadı.' : 'Henüz kaydedilmiş bir tarif yok.'}
            </p>
            <p className="text-stone-700 text-lg font-bold mt-2">
              Yukarıdaki "Yeni Tarif Yaz" butonuna basarak ilk tarifinizi yazabilirsiniz.
            </p>
          </div>
        ) : (
          filteredRecipes.map((recipe) => {
            const formattedDate = new Date(recipe.createdAt).toLocaleDateString('tr-TR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            });

            return (
              <div
                key={recipe.id}
                onClick={() => setSelectedRecipe(recipe)}
                className="bg-white border-3 border-stone-300 hover:border-amber-500 rounded-3xl p-5 shadow-sm transition-all active:scale-98 cursor-pointer flex items-center justify-between gap-4 group"
              >
                <div className="flex flex-col gap-2 min-w-0">
                  <h3 className="text-2xl sm:text-3xl font-black text-stone-950 uppercase group-hover:text-amber-900 transition-colors truncate">
                    {recipe.title}
                  </h3>
                  <div className="flex items-center gap-2 text-stone-900 font-black flex-wrap">
                    <span className="flex items-center gap-1.5 bg-stone-100 px-3 py-1 rounded-xl border border-stone-300 text-sm sm:text-base">
                      <Calendar className="w-4 h-4 text-stone-700" />
                      {formattedDate}
                    </span>
                    <span className="bg-amber-100 text-amber-950 px-3 py-1 rounded-xl border border-amber-300 text-sm sm:text-base">
                      {recipe.items.length} Madde
                    </span>
                    {recipe.verifiedByIsmet && (
                      <span className="bg-emerald-100 text-emerald-950 px-3 py-1 rounded-xl border border-emerald-300 text-sm sm:text-base flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                        İsmet Onaylı
                      </span>
                    )}
                  </div>
                </div>

                <div className="w-12 h-12 rounded-2xl bg-stone-100 group-hover:bg-amber-100 text-stone-800 group-hover:text-amber-900 flex items-center justify-center shrink-0 border border-stone-300 transition-colors">
                  <ChevronRight className="w-7 h-7" />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
