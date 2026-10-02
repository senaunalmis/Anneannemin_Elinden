import React, { useState } from 'react';
import { ArrowLeft, Trash2, Calendar, CheckCircle, Send } from 'lucide-react';
import type { Recipe } from '../../types/recipe';
import { WhatsAppShareModal } from '../common/WhatsAppShareModal';

interface RecipeDetailViewProps {
  recipe: Recipe;
  onBack: () => void;
  onDelete: (id: string) => void;
}

export const RecipeDetailModal: React.FC<RecipeDetailViewProps> = ({
  recipe,
  onBack,
  onDelete,
}) => {
  const [showShareModal, setShowShareModal] = useState(false);

  const formattedDate = new Date(recipe.createdAt).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handleDeleteConfirm = () => {
    if (window.confirm(`"${recipe.title}" tarifini silmek istediğinize emin misiniz?`)) {
      onDelete(recipe.id);
    }
  };

  return (
    <div className="flex flex-col gap-5 py-2 animate-fadeIn">
      {/* Top Back Navigation Button */}
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 bg-stone-200 hover:bg-stone-300 border-2 border-stone-300 text-stone-950 font-black py-3.5 px-5 rounded-2xl text-lg transition-colors w-fit shadow-xs"
      >
        <ArrowLeft className="w-6 h-6 text-stone-800" />
        <span>TÜM TARİFLERE DÖN</span>
      </button>

      {/* Recipe Header Banner (Full Screen, High Contrast) */}
      <div className="bg-emerald-800 text-white rounded-3xl p-6 shadow-md border-3 border-emerald-900">
        <span className="text-emerald-200 text-sm sm:text-base font-black tracking-widest block uppercase">
          DEFTERDEN TARİF
        </span>
        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-wide mt-2 break-words leading-tight">
          {recipe.title}
        </h1>

        <div className="flex items-center gap-2.5 mt-4 flex-wrap">
          <div className="flex items-center gap-2 text-stone-900 font-black bg-emerald-100 px-3.5 py-1.5 rounded-xl border border-emerald-300 text-sm sm:text-base">
            <Calendar className="w-4 h-4 text-emerald-800" />
            <span>{formattedDate}</span>
          </div>

          <div className="flex items-center gap-1.5 text-stone-900 font-black bg-emerald-100 px-3.5 py-1.5 rounded-xl border border-emerald-300 text-sm sm:text-base">
            <CheckCircle className="w-4 h-4 text-emerald-700" />
            <span>İsmet Onayladı</span>
          </div>
        </div>
      </div>

      {/* Main Action Button (WhatsApp Share) */}
      <div>
        <button
          type="button"
          onClick={() => setShowShareModal(true)}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xl py-4.5 px-6 rounded-2xl flex items-center justify-center gap-3 shadow-md active:scale-98 transition-all border-b-4 border-emerald-800"
        >
          <Send className="w-7 h-7" />
          <span>Mesaj GÖNDER</span>
        </button>
      </div>

      {/* Recipe Items (Numbered Cards) */}
      <div className="flex flex-col gap-3 mt-1">
        <h3 className="text-stone-950 font-black text-xl sm:text-2xl px-1">
         ADIMLAR VE MALZEMELER ({recipe.items.length})
        </h3>

        <div className="flex flex-col gap-3">
          {recipe.items.map((item, index) => (
            <div
              key={item.id}
              className="bg-white border-3 border-stone-300 rounded-2xl p-4 sm:p-5 shadow-xs flex items-center justify-between gap-3.5"
            >
              <div className="flex items-start gap-3.5">
                <span className="w-10 h-10 rounded-2xl bg-emerald-700 text-white font-black flex items-center justify-center shrink-0 text-lg shadow-xs">
                  {index + 1}
                </span>
                <span className="font-black text-stone-950 text-xl sm:text-2xl uppercase select-text leading-snug">
                  {item.text}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Recipe Button */}
      <div className="pt-4 border-t-2 border-stone-300 flex justify-end">
        <button
          type="button"
          onClick={handleDeleteConfirm}
          className="flex items-center gap-2 text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 border-2 border-rose-200 font-black text-base px-4 py-3 rounded-2xl transition-colors"
        >
          <Trash2 className="w-5 h-5 text-rose-700" />
          <span>Tarifi Sil</span>
        </button>
      </div>

      {/* WhatsApp Contact Selection Modal */}
      {showShareModal && (
        <WhatsAppShareModal
          recipe={recipe}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
};
