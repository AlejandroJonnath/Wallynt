import { create } from 'zustand';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@core/supabase';
import { api } from '@core/api';

interface UserProfile {
  id: string;
  nombre: string;
  correo: string;
  rol: 'ESTUDIANTE' | 'ADMIN' | 'SUPERADMIN';
  [key: string]: any;
}

interface AuthState {
  session: Session | null;
  user: User | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  setSession: (session: Session | null) => void;
  signOut: () => Promise<void>;
  checkSession: () => Promise<void>;
}

const fetchProfile = async () => {
  try {
    const res = await api.get('/users/profile');
    return res.data;
  } catch (e) {
    return null;
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  userProfile: null,
  isLoading: true,
  setSession: async (session) => {
    let profile = null;
    if (session) {
      profile = await fetchProfile();
    }
    set({ session, user: session?.user || null, userProfile: profile });
  },
  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null, user: null, userProfile: null });
  },
  checkSession: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    let profile = null;
    if (session) {
      profile = await fetchProfile();
    }
    set({ session, user: session?.user || null, userProfile: profile, isLoading: false });
    
    supabase.auth.onAuthStateChange(async (_event, newSession) => {
      let newProfile = null;
      if (newSession) {
        newProfile = await fetchProfile();
      }
      set({ session: newSession, user: newSession?.user || null, userProfile: newProfile });
    });
  }
}));
