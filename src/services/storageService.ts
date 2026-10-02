import type { Recipe } from '../types/recipe';
import { supabaseService } from './supabaseService';

const STORAGE_KEY = 'anneanne_elinden_tarifler_v1';

const INITIAL_SAMPLE_RECIPES: Recipe[] = [
  {
    id: 'sample-manti',
    title: 'ANNEANNEMİN MEŞHUR MANTISI',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    verifiedByIsmet: true,
    verifiedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    items: [
      { id: '1', text: '3 SU BARDAĞI UN', timestamp: 1 },
      { id: '2', text: '1 TATLI KAŞIĞI TUZ', timestamp: 2 },
      { id: '3', text: '1 ADET YUMURTA', timestamp: 3 },
      { id: '4', text: '1 SU BARDAĞI ILIK SU', timestamp: 4 },
      { id: '5', text: '250 GRAM KIYMA', timestamp: 5 },
      { id: '6', text: '1 ADET RENDELENMİŞ SOĞAN', timestamp: 6 },
      { id: '7', text: 'HAMURU İNCE AÇ VE KÜÇÜK KARELER KES', timestamp: 7 },
      { id: '8', text: 'İÇİNE KIYMA KOYUP BOHÇA ŞEKLİNDE KAPAT', timestamp: 8 },
      { id: '9', text: 'KAYNAYAN TUZLU SUDA 10 DAKİKA HAŞLA', timestamp: 9 },
      { id: '10', text: 'ÜZERİNE SARIMSAKLI YOĞURT VE TEREYAĞI DÖK', timestamp: 10 },
    ],
  },
];

export const storageService = {
  getRecipes(): Recipe[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        this.saveRecipes(INITIAL_SAMPLE_RECIPES);
        return INITIAL_SAMPLE_RECIPES;
      }
      return JSON.parse(data) as Recipe[];
    } catch (e) {
      console.error('Tarifler yüklenirken hata:', e);
      return INITIAL_SAMPLE_RECIPES;
    }
  },

  saveRecipes(recipes: Recipe[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
    } catch (e) {
      console.error('Tarifler kaydedilirken hata:', e);
    }
  },

  addRecipe(recipe: Recipe): Recipe[] {
    const recipes = this.getRecipes();
    const updated = [recipe, ...recipes.filter(r => r.id !== recipe.id)];
    this.saveRecipes(updated);

    // Asynchronously sync to Supabase in the background
    if (supabaseService.isConfigured()) {
      supabaseService.saveRecipe(recipe).catch((err) => {
        console.warn('Buluta kaydedilemedi (çevrimdışı olabilir):', err);
      });
    }

    return updated;
  },

  deleteRecipe(id: string): Recipe[] {
    const recipes = this.getRecipes();
    const updated = recipes.filter(r => r.id !== id);
    this.saveRecipes(updated);

    // Asynchronously sync deletion to Supabase
    if (supabaseService.isConfigured()) {
      supabaseService.deleteRecipe(id).catch((err) => {
        console.warn('Buluttan silinemedi:', err);
      });
    }

    return updated;
  },

  async syncWithCloud(): Promise<Recipe[] | null> {
    if (!supabaseService.isConfigured()) return null;

    try {
      const cloudRecipes = await supabaseService.fetchRecipes();
      if (cloudRecipes && cloudRecipes.length > 0) {
        // Merge cloud with local
        const local = this.getRecipes();
        const localMap = new Map(local.map(r => [r.id, r]));
        cloudRecipes.forEach(r => localMap.set(r.id, r));
        const merged = Array.from(localMap.values()).sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.saveRecipes(merged);
        return merged;
      }
    } catch (e) {
      console.warn('Bulut senkronizasyonu başarısız:', e);
    }
    return null;
  },
};
