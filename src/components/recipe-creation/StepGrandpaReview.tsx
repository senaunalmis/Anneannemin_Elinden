import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Edit2, Trash2, Plus, ArrowLeft, Send, BookOpen, RotateCw } from 'lucide-react';
import type { RecipeItem, Recipe } from '../../types/recipe';
import { BigButton } from '../common/BigButton';
import { audioFeedback } from '../../services/audioFeedback';
import { toTurkishUpper } from '../../utils/turkishUpper';
import { WhatsAppShareModal } from '../common/WhatsAppShareModal';

interface StepGrandpaReviewProps {
  dishTitle: string;
  items: RecipeItem[];
  onSaveRecipe: (recipe: Recipe) => Promise<{ success: boolean; error?: string }>;
  onFinishAndGoToBook: () => void;
  onBackToEditing: () => void;
  onUpdateTitle: (title: string) => void;
  onUpdateItem: (id: string, newText: string) => void;
  onDeleteItem: (id: string) => void;
  onAddItem: (text: string) => void;
}

export const StepGrandpaReview: React.FC<StepGrandpaReviewProps> = ({
  dishTitle,
  items,
  onSaveRecipe,
  onFinishAndGoToBook,
  onBackToEditing,
  onUpdateTitle,
  onUpdateItem,
  onDeleteItem,
  onAddItem,
}) => {
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleText, setTitleText] = useState(dishTitle);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newItemText, setNewItemText] = useState('');
  const [isApproved, setIsApproved] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [cloudErrorMessage, setCloudErrorMessage] = useState('');

  const handleStartEditItem = (item: RecipeItem) => {
    setEditingItemId(item.id);
    setEditText(item.text);
  };

  const handleSaveEditItem = (id: string) => {
    if (editText.trim()) {
      onUpdateItem(id, toTurkishUpper(editText));
    }
    setEditingItemId(null);
  };

  const handleSaveTitle = () => {
    if (titleText.trim()) {
      onUpdateTitle(toTurkishUpper(titleText));
    }
    setIsEditingTitle(false);
  };

  const handleAddNewItem = () => {
    if (newItemText.trim()) {
      onAddItem(toTurkishUpper(newItemText));
      setNewItemText('');
      setIsAddingNew(false);
    }
  };

  const handleGrandpaApprove = async () => {
    const finalRecipe: Recipe = {
      id: 'rec-' + Date.now().toString(),
      title: dishTitle,
      items,
      createdAt: new Date().toISOString(),
      verifiedByIsmet: true,
      verifiedAt: new Date().toISOString(),
    };

    setCurrentRecipe(finalRecipe);
    setIsApproved(true);
    setSaveStatus('saving');
    audioFeedback.playCelebration();

    // Trigger lovely confetti
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 },
    });

    // IMMEDIATELY SAVE TO SUPABASE AND LOCALSTORAGE
    try {
      const res = await onSaveRecipe(finalRecipe);
      if (res.success) {
        setSaveStatus('success');
      } else {
        setSaveStatus('error');
        setCloudErrorMessage(res.error || 'Bulut bağlantısı kurulamadı');
      }
    } catch (e: any) {
      setSaveStatus('error');
      setCloudErrorMessage(e?.message || 'Kayıt sırasında hata oluştu');
    }
  };

  const handleRetryCloudSave = async () => {
    if (!currentRecipe) return;
    setSaveStatus('saving');
    try {
      const res = await onSaveRecipe(currentRecipe);
      if (res.success) {
        setSaveStatus('success');
      } else {
        setSaveStatus('error');
        setCloudErrorMessage(res.error || 'Bulut bağlantısı kurulamadı');
      }
    } catch (e: any) {
      setSaveStatus('error');
      setCloudErrorMessage(e?.message || 'Hata oluştu');
    }
  };

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* Grandpa Welcome Card */}
      <div className="bg-blue-100/90 border-3 border-blue-300 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center gap-3.5">
          <span className="text-5xl">👓</span>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-blue-950 leading-tight">
              İSMET DEDE KONTROL EKRANI
            </h2>
            <p className="text-blue-950 text-lg sm:text-xl font-extrabold mt-2 leading-snug">
              İsmet dede, anneannemin deftere yazdıkları ile ekrandaki listeyi karşılaştır.
            </p>
          </div>
        </div>
      </div>

      {/* Recipe Title Card */}
      <div className="bg-white border-3 border-stone-300 rounded-3xl p-5 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b-2 border-stone-200">
          <span className="text-stone-900 font-black text-sm tracking-wider uppercase bg-stone-100 px-3 py-1 rounded-xl">
            YEMEK ADI
          </span>
          <button
            type="button"
            onClick={() => setIsEditingTitle(!isEditingTitle)}
            className="text-stone-900 bg-stone-200 hover:bg-stone-300 font-black text-sm px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Edit2 className="w-4 h-4 text-stone-700" />
            <span>{isEditingTitle ? 'Kapat' : 'Düzenle'}</span>
          </button>
        </div>

        {isEditingTitle ? (
          <div className="flex gap-2 mt-3">
            <input
              type="text"
              value={titleText}
              onChange={(e) => setTitleText(toTurkishUpper(e.target.value))}
              className="flex-1 text-2xl font-black border-3 border-blue-500 rounded-2xl p-3"
              autoFocus
            />
            <button
              onClick={handleSaveTitle}
              className="bg-blue-700 text-white font-black px-5 rounded-2xl text-base"
            >
              Kaydet
            </button>
          </div>
        ) : (
          <div className="text-3xl sm:text-4xl font-black text-stone-950 mt-3 tracking-wide uppercase">
            {dishTitle}
          </div>
        )}
      </div>

      {/* Items List */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-stone-950 font-black text-xl sm:text-2xl">
            KONTROL EDİLECEK MADDELER ({items.length})
          </h3>
          <button
            type="button"
            onClick={() => setIsAddingNew(true)}
            className="text-emerald-950 bg-emerald-100 hover:bg-emerald-200 border-2 border-emerald-300 px-3.5 py-2 rounded-2xl text-base font-black flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-5 h-5 text-emerald-800" />
            <span>Madde Ekle</span>
          </button>
        </div>

        {isAddingNew && (
          <div className="bg-emerald-50 border-3 border-emerald-400 rounded-2xl p-4 flex flex-col gap-2 shadow-xs">
            <span className="text-sm font-black text-emerald-950 uppercase">
              EKSİK KALAN YENİ MADDEYİ YAZ:
            </span>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="ÖRN: 1 ÇAY KAŞIĞI KARABİBER"
                value={newItemText}
                onChange={(e) => setNewItemText(toTurkishUpper(e.target.value))}
                className="flex-1 text-xl font-black border-2 border-emerald-500 rounded-2xl p-3 bg-white"
                autoFocus
              />
              <button
                onClick={handleAddNewItem}
                className="bg-emerald-700 text-white font-black px-5 rounded-2xl text-base"
              >
                Ekle
              </button>
              <button
                onClick={() => setIsAddingNew(false)}
                className="text-stone-900 bg-stone-200 font-black px-4 rounded-2xl text-base"
              >
                İptal
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {items.map((item, idx) => (
            <div
              key={item.id}
              className="bg-white border-3 border-stone-300 rounded-2xl p-4 shadow-sm flex flex-col gap-2"
            >
              {editingItemId === item.id ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(toTurkishUpper(e.target.value))}
                    className="flex-1 text-xl font-black border-3 border-blue-500 rounded-2xl p-3"
                    autoFocus
                  />
                  <button
                    onClick={() => handleSaveEditItem(item.id)}
                    className="bg-blue-700 text-white font-black px-5 rounded-2xl text-base"
                  >
                    Kaydet
                  </button>
                  <button
                    onClick={() => setEditingItemId(null)}
                    className="text-stone-900 bg-stone-200 font-black px-4 rounded-2xl text-base"
                  >
                    İptal
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    <span className="w-10 h-10 rounded-2xl bg-blue-800 text-white font-black flex items-center justify-center shrink-0 text-lg shadow-xs">
                      {idx + 1}
                    </span>
                    <span className="font-black text-stone-950 text-xl sm:text-2xl uppercase select-text leading-snug">
                      {item.text}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleStartEditItem(item)}
                      className="p-3 bg-stone-100 hover:bg-stone-200 text-stone-900 rounded-xl border border-stone-300"
                      title="Düzenle"
                    >
                      <Edit2 className="w-5 h-5 text-stone-700" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteItem(item.id)}
                      className="p-3 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-xl border border-rose-200"
                      title="Sil"
                    >
                      <Trash2 className="w-5 h-5 text-rose-700" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Action - Grandpa Approval Button */}
      <div className="pt-2 flex flex-col gap-3">
        <BigButton
          variant="primary"
          size="huge"
          onClick={handleGrandpaApprove}
          icon={<CheckCircle2 className="w-10 h-10" />}
        >
          İSMET KONTROL ETTİ ✅ ONAYLA
        </BigButton>

        <button
          type="button"
          onClick={onBackToEditing}
          className="flex items-center justify-center gap-2 bg-stone-200 hover:bg-stone-300 border-2 border-stone-300 text-stone-950 font-black py-4 px-6 rounded-2xl text-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-stone-800" />
          <span>Anneannemin Yazma Ekranına Geri Dön</span>
        </button>
      </div>

      {/* Celebration & WhatsApp Prompt Modal */}
      {isApproved && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-[#fdfaf3] w-full max-w-lg rounded-3xl shadow-2xl border-4 border-emerald-600 p-6 sm:p-8 flex flex-col gap-5 text-center">
            <span className="text-6xl animate-bounce">🎉👵👓</span>

            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-emerald-950 uppercase leading-tight">
                HARİKA! TARİF ONAYLANDI
              </h2>
              <p className="text-stone-900 font-extrabold text-lg sm:text-xl mt-2">
                Anneannemin ellerine sağlık, İsmet dedemin gözlerine sağlık! Tarif deftere kaydedildi.
              </p>
              {saveStatus === 'saving' && (
                <div className="mt-3 bg-amber-100 border-2 border-amber-400 text-amber-950 px-4 py-3 rounded-2xl text-base font-black flex items-center justify-center gap-2">
                  <RotateCw className="w-5 h-5 animate-spin text-amber-700" />
                  <span>Buluta yükleniyor, lütfen bekleyin...</span>
                </div>
              )}

              {saveStatus === 'success' && (
                <div className="mt-3 bg-emerald-100 border-2 border-emerald-400 text-emerald-950 px-4 py-3 rounded-2xl text-base font-black flex items-center justify-center gap-2 animate-fadeIn">
                  <span>☁️ Buluta başarıyla yüklendi ve tüm cihazlarla eşitlendi! ✅</span>
                </div>
              )}

              {saveStatus === 'error' && (
                <div className="mt-3 bg-rose-100 border-2 border-rose-400 text-rose-950 p-4 rounded-2xl text-left flex flex-col gap-2 animate-fadeIn">
                  <div className="font-black text-base flex items-center gap-2">
                    <span>⚠️ Tarif telefona yazıldı fakat buluta aktarılamadı:</span>
                  </div>
                  <p className="text-xs sm:text-sm font-extrabold text-rose-900 bg-white/80 p-2.5 rounded-xl break-all">
                    {cloudErrorMessage}
                  </p>
                  <button
                    type="button"
                    onClick={handleRetryCloudSave}
                    className="mt-1 bg-rose-600 hover:bg-rose-700 text-white font-black py-2.5 px-4 rounded-xl text-sm flex items-center justify-center gap-2 active:scale-95 shadow-xs"
                  >
                    <RotateCw className="w-4 h-4" />
                    <span>Buluta Yüklemeyi Tekrar Dene</span>
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowShareModal(true)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xl py-4 px-6 rounded-2xl flex items-center justify-center gap-3 shadow-lg active:scale-98 transition-all border-b-4 border-emerald-800"
              >
                <Send className="w-7 h-7" />
                <span>AİLEYE WHATSAPP'TAN GÖNDER 📲</span>
              </button>

              <button
                type="button"
                onClick={onFinishAndGoToBook}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-black text-xl py-4 px-6 rounded-2xl flex items-center justify-center gap-3 shadow-md active:scale-98 transition-all border-b-4 border-amber-700"
              >
                <BookOpen className="w-7 h-7" />
                <span>TARİF DEFTERİME DÖN 📖</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {showShareModal && currentRecipe && (
        <WhatsAppShareModal
          recipe={currentRecipe}
          onClose={() => {
            setShowShareModal(false);
            onFinishAndGoToBook();
          }}
        />
      )}
    </div>
  );
};
