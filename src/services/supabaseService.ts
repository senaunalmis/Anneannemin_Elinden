import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Recipe } from '../types/recipe';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let supabaseClient: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey) {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  } catch (err) {
    console.warn('Supabase başlatılamadı:', err);
  }
}

export const supabaseService = {
  isConfigured(): boolean {
    return Boolean(supabaseClient && supabaseUrl && supabaseAnonKey);
  },

  async fetchRecipes(): Promise<Recipe[] | null> {
    if (!supabaseClient) return null;
    try {
      const { data, error } = await supabaseClient
        .from('recipes')
        .select('*')
        .order('createdAt', { ascending: false });

      if (error) {
        console.warn('Supabase veri çekme hatası:', error.message);
        return null;
      }

      return data as Recipe[];
    } catch (e) {
      console.warn('Supabase bağlantı hatası:', e);
      return null;
    }
  },

  async saveRecipe(recipe: Recipe): Promise<boolean> {
    if (!supabaseClient) return false;
    try {
      const { error } = await supabaseClient
        .from('recipes')
        .upsert(recipe);

      if (error) {
        console.warn('Supabase kaydetme hatası:', error.message);
        return false;
      }
      return true;
    } catch (e) {
      console.warn('Supabase kaydetme hatası:', e);
      return false;
    }
  },

  async deleteRecipe(id: string): Promise<boolean> {
    if (!supabaseClient) return false;
    try {
      const { error } = await supabaseClient
        .from('recipes')
        .delete()
        .eq('id', id);

      if (error) {
        console.warn('Supabase silme hatası:', error.message);
        return false;
      }
      return true;
    } catch (e) {
      console.warn('Supabase silme hatası:', e);
      return false;
    }
  },
};
