import type { Recipe } from '../types/recipe';

const rawUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const rawKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

// Remove any trailing slash
const supabaseUrl = rawUrl.replace(/\/+$/, '');
const supabaseAnonKey = rawKey;

let lastError: string | null = null;

export const supabaseService = {
  isConfigured(): boolean {
    return Boolean(supabaseUrl && supabaseAnonKey);
  },

  getLastError(): string | null {
    return lastError;
  },

  getConfigDebug(): { urlSet: boolean; keySet: boolean; domain: string } {
    let domain = 'yok';
    if (supabaseUrl) {
      try {
        domain = new URL(supabaseUrl).hostname;
      } catch {
        domain = 'gecersiz-url';
      }
    }
    return {
      urlSet: Boolean(supabaseUrl),
      keySet: Boolean(supabaseAnonKey),
      domain,
    };
  },

  async fetchRecipes(): Promise<Recipe[] | null> {
    if (!this.isConfigured()) {
      lastError = 'Supabase URL veya Anon Key ayarlı değil (.env / Vercel)';
      return null;
    }

    try {
      const endpoint = `${supabaseUrl}/rest/v1/recipes?select=*&order=createdAt.desc`;
      const res = await fetch(endpoint, {
        method: 'GET',
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        lastError = `Sunucu Hatası (${res.status}): ${errorText || res.statusText}`;
        console.error('Supabase fetch hatası:', lastError);
        return null;
      }

      const data = await res.json();
      lastError = null;
      return data as Recipe[];
    } catch (e: any) {
      lastError = e?.message || 'İnternet bağlantı hatası';
      console.error('Supabase bağlantı hatası:', e);
      return null;
    }
  },

  async saveRecipe(recipe: Recipe): Promise<{ success: boolean; error?: string }> {
    if (!this.isConfigured()) {
      const err = 'Supabase ayarları eksik (VITE_SUPABASE_URL veya ANON_KEY yok)';
      lastError = err;
      return { success: false, error: err };
    }

    try {
      const endpoint = `${supabaseUrl}/rest/v1/recipes`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
          Prefer: 'resolution=merge-duplicates',
        },
        body: JSON.stringify(recipe),
      });

      if (!res.ok) {
        const errText = await res.text();
        const err = `Sunucu Hatası (${res.status}): ${errText || res.statusText}`;
        lastError = err;
        console.error('Supabase save hatası:', err);
        return { success: false, error: err };
      }

      lastError = null;
      return { success: true };
    } catch (e: any) {
      const err = e?.message || 'İnternet bağlantı hatası';
      lastError = err;
      console.error('Supabase save hatası:', e);
      return { success: false, error: err };
    }
  },

  async deleteRecipe(id: string): Promise<boolean> {
    if (!this.isConfigured()) return false;

    try {
      const endpoint = `${supabaseUrl}/rest/v1/recipes?id=eq.${encodeURIComponent(id)}`;
      const res = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
        },
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error('Supabase silme hatası:', res.status, errText);
        return false;
      }

      return true;
    } catch (e) {
      console.error('Supabase silme hatası:', e);
      return false;
    }
  },
};
