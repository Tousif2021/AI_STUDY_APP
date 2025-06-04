import { create } from 'zustand';
import { User } from '../types';
import { supabase } from '../lib/supabase';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isGoogleLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<{ requiresVerification?: boolean } | void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isGoogleLoading: false,
  error: null,

  initialize: async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;

      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        if (!profile) {
          // Create profile if it doesn't exist
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert([
              {
                id: session.user.id,
                email: session.user.email,
                full_name: session.user.user_metadata?.full_name || 'User',
                role: 'user',
              }
            ])
            .select()
            .maybeSingle();

          if (createError) throw createError;

          if (newProfile) {
            set({ 
              user: {
                id: newProfile.id,
                name: newProfile.full_name,
                email: newProfile.email,
                role: newProfile.role,
                avatar: newProfile.avatar_url
              },
              isAuthenticated: true,
              isLoading: false 
            });
            return;
          }
        }

        if (profile) {
          set({ 
            user: {
              id: profile.id,
              name: profile.full_name,
              email: profile.email,
              role: profile.role,
              avatar: profile.avatar_url
            },
            isAuthenticated: true,
            isLoading: false 
          });
          return;
        }
      }
      set({ isLoading: false });
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({ isLoading: false, error: 'Failed to initialize authentication' });
    }
  },

  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const { data: { session }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        if (!profile) {
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert([
              {
                id: session.user.id,
                email: session.user.email,
                full_name: session.user.user_metadata?.full_name || 'User',
                role: 'user',
              }
            ])
            .select()
            .maybeSingle();

          if (createError) throw createError;

          if (newProfile) {
            set({ 
              user: {
                id: newProfile.id,
                name: newProfile.full_name,
                email: newProfile.email,
                role: newProfile.role,
                avatar: newProfile.avatar_url
              },
              isAuthenticated: true,
              isLoading: false 
            });
            return;
          }
        }

        if (profile) {
          set({ 
            user: {
              id: profile.id,
              name: profile.full_name,
              email: profile.email,
              role: profile.role,
              avatar: profile.avatar_url
            },
            isAuthenticated: true,
            isLoading: false 
          });
          return;
        }
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to login' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (name: string, email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name
          }
        }
      });

      if (error) throw error;

      if (!data.session) {
        set({
          isAuthenticated: false,
          user: null,
          error: null
        });
        return { requiresVerification: true };
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .upsert([
          {
            id: data.session.user.id,
            email: email,
            full_name: name,
            role: 'user',
          }
        ], { onConflict: 'id' })
        .select()
        .maybeSingle();

      if (profileError) throw profileError;

      if (profile) {
        set({
          user: {
            id: profile.id,
            name: profile.full_name,
            email: profile.email,
            role: profile.role,
            avatar: profile.avatar_url
          },
          isAuthenticated: true,
          error: null,
        });
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to register' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true, error: null });
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      set({
        user: null,
        isAuthenticated: false,
      });
    } catch (error: any) {
      set({ error: error.message || 'Failed to logout' });
    } finally {
      set({ isLoading: false });
    }
  },

  loginWithGoogle: async () => {
    try {
      set({ isGoogleLoading: true, error: null });
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) throw error;
    } catch (error: any) {
      set({ error: error.message || 'Failed to login with Google' });
    } finally {
      set({ isGoogleLoading: false });
    }
  },
}));

useAuthStore.getState().initialize();