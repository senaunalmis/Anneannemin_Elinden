import type { Recipe } from '../types/recipe';

export interface FamilyContact {
  name: string;
  phone?: string; // E.g. "0538...", "90538...", "538..." or empty
}

const DEFAULT_CONTACTS: FamilyContact[] = [
  { name: 'Sena (Torun)', phone: '' },
  { name: 'Aile Grubu / Rehberden Seç', phone: '' },
];

/**
 * Normalizes Turkish phone numbers into international WhatsApp format (905xxxxxxxxx).
 * Handles: "0538...", "538...", "+90538...", "90538..."
 */
function normalizePhoneNumber(phone: string): string {
  let digits = phone.replace(/[^0-9]/g, '');
  if (!digits) return '';

  if (digits.startsWith('0090')) {
    digits = digits.substring(2);
  } else if (digits.startsWith('0')) {
    digits = '90' + digits.substring(1);
  } else if (digits.length === 10 && digits.startsWith('5')) {
    digits = '90' + digits;
  }
  return digits;
}

export const whatsappService = {
  getContacts(): FamilyContact[] {
    try {
      const envContacts = import.meta.env.VITE_FAMILY_CONTACTS;
      if (envContacts) {
        return JSON.parse(envContacts);
      }
    } catch (e) {
      console.warn('VITE_FAMILY_CONTACTS okunamadı:', e);
    }
    return DEFAULT_CONTACTS;
  },

  formatRecipeMessage(recipe: Recipe): string {
    const lines: string[] = [];
    lines.push(`👵 *ANNEANNE ELİNDEN: ${recipe.title}* 🍲`);
    lines.push(`👓 _(İsmet Dedem Kontrol Etti ve Onayladı ✅)_\n`);
    lines.push(`📝 *MALZEMELER VE TARİF:*`);

    recipe.items.forEach((item, idx) => {
      lines.push(`${idx + 1}. ${item.text}`);
    });

    lines.push(`\n_Kusura bakayın_`);

    lines.push(`\n❤️ _Anneannemin el emeği, İsmet dedemin göz nuruyla yazılmıştır._`);

    return lines.join('\n');
  },

  sendToWhatsApp(recipe: Recipe, phone?: string): void {
    const message = this.formatRecipeMessage(recipe);
    const encoded = encodeURIComponent(message);

    let url = `https://api.whatsapp.com/send?text=${encoded}`;

    if (phone && phone.trim()) {
      const cleanPhone = normalizePhoneNumber(phone);
      if (cleanPhone) {
        // wa.me is the official WhatsApp deep link that opens directly on mobile app
        url = `https://wa.me/${cleanPhone}?text=${encoded}`;
      }
    }

    // Trigger opening via dynamic link to bypass mobile popup blockers
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
};
