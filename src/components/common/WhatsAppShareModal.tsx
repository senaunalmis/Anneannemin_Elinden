import React from 'react';
import { Send, UserCheck, Users, X } from 'lucide-react';
import type { Recipe } from '../../types/recipe';
import { whatsappService } from '../../services/whatsappService';

interface WhatsAppShareModalProps {
  recipe: Recipe;
  onClose: () => void;
}

export const WhatsAppShareModal: React.FC<WhatsAppShareModalProps> = ({
  recipe,
  onClose,
}) => {
  const contacts = whatsappService.getContacts();

  const handleShare = (phone?: string) => {
    whatsappService.sendToWhatsApp(recipe, phone);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-[#fdfaf3] w-full max-w-lg rounded-3xl shadow-2xl border-3 border-emerald-600 p-6 flex flex-col gap-5 text-center">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-stone-200 pb-3">
          <div className="flex items-center gap-2 text-emerald-900 font-black text-xl sm:text-2xl">
            <span className="text-3xl">📲</span>
            <span>WHATSAPP'TA PAYLAŞ</span>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-stone-200 hover:bg-stone-300 flex items-center justify-center text-stone-800"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div>
          <h3 className="text-xl sm:text-2xl font-black text-stone-950 uppercase leading-snug">
            "{recipe.title}"
          </h3>
          <p className="text-stone-800 font-bold text-base sm:text-lg mt-1">
            Bu tarifi WhatsApp üzerinden kime göndermek istersiniz?
          </p>
        </div>

        {/* Contacts Buttons */}
        <div className="flex flex-col gap-3">
          {contacts.map((contact, index) => (
            <button
              key={index}
              onClick={() => handleShare(contact.phone)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg sm:text-xl py-4 px-6 rounded-2xl flex items-center justify-between shadow-md active:scale-98 transition-all border-b-4 border-emerald-800"
            >
              <div className="flex items-center gap-3">
                {contact.phone ? (
                  <UserCheck className="w-6 h-6 text-emerald-200" />
                ) : (
                  <Users className="w-6 h-6 text-emerald-200" />
                )}
                <span>{contact.name}</span>
              </div>
              <Send className="w-6 h-6" />
            </button>
          ))}
        </div>

        {/* Dismiss Button */}
        <button
          onClick={onClose}
          className="text-stone-800 font-black text-base py-3 px-4 rounded-xl hover:bg-stone-200/80 transition-colors"
        >
          Şimdilik Gönderme, Kapat
        </button>
      </div>
    </div>
  );
};
