import type { Recipe } from '../types/recipe';

export interface FamilyContact {
  name: string;
  phone?: string; // E.g. "905xxxxxxxxx" or empty for general contact selector
}

const DEFAULT_CONTACTS: FamilyContact[] = [
  { name: 'Sena (Torun)', phone: '' },
  { name: 'Aile Grubu / Rehberden Seç', phone: '' },
];

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
    lines.push(`👓 _(Dedem Kontrol Etti ve Onayladı)_\n`);
    lines.push(`📝 *MALZEMELER VE TARİF:*`);

    recipe.items.forEach((item, idx) => {
      lines.push(`${idx + 1}. ${item.text}`);
    });
    lines.push(`\nKUSURA BAKMAYIN`);
    lines.push(`\n❤️ _Anneannemin el emeği, İsmet dedemin göz nuruyla yazılmıştır._`);

    return lines.join('\n');
  },

  sendToWhatsApp(recipe: Recipe, phone?: string): void {
    const message = this.formatRecipeMessage(recipe);
    const encoded = encodeURIComponent(message);

    let url = `https://api.whatsapp.com/send?text=${encoded}`;
    if (phone && phone.trim()) {
      const cleanPhone = phone.replace(/[^0-9]/g, '');
      url = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encoded}`;
    }

    window.open(url, '_blank');
  },
};
