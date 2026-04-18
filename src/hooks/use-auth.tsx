import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

const PROFILE_TIMEOUT_MS = 4000;

function withTimeout<T>(promise: Promise<T>, timeoutMs: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error(label)), timeoutMs);
    }),
  ]);
}

interface UserProfile {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  is_premium: boolean;
  subscription_type: string | null;
  subscription_expires_at: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);
  const initialSessionResolvedRef = useRef(false);

  const fetchProfile = useCallback(async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data } = await withTimeout(
        supabase
          .from("profiles")
          .select("*")
          .eq("user_id", userId)
          .single(),
        PROFILE_TIMEOUT_MS,
        "profile-fetch-timeout"
      );
      if (!data) return null;

      const isExpired = data.is_premium && data.subscription_expires_at && new Date(data.subscription_expires_at) < new Date();
      if (isExpired) {
        supabase.auth.getSession().then(async ({ data: { session } }) => {
          if (!session) return;
          try {
            await withTimeout(
              supabase.functions.invoke("expire-subscription", {
                headers: { Authorization: `Bearer ${session.access_token}` },
              }),
              PROFILE_TIMEOUT_MS,
              "expire-subscription-timeout"
            );
          } catch (e) {
            console.error("Error calling expire-subscription:", e);
          }
        }).catch((e) => {
          console.error("Error loading session for expire-subscription:", e);
        });

        setTimeout(() => {
          window.dispatchEvent(new CustomEvent("subscription-expired"));
        }, 500);

        return {
          ...data,
          is_premium: false,
          subscription_type: null,
          subscription_expires_at: null,
        };
      }

      return {
        ...data,
        is_premium: data.is_premium ?? false,
      };
    } catch (error) {
      console.error("[useAuth] profile fetch fallback", error);
      return null;
    }
  }, []);

  const syncSessionState = useCallback(async (nextSession: Session | null) => {
    if (!mountedRef.current) return;

    setSession(nextSession);
    setUser(nextSession?.user ?? null);

    if (!nextSession?.user) {
      setProfile(null);
      if (mountedRef.current) setLoading(false);
      return;
    }

    const nextProfile = await fetchProfile(nextSession.user.id);
    if (!mountedRef.current) return;
    setProfile(nextProfile);
    setLoading(false);
  }, [fetchProfile]);

  useEffect(() => {
    mountedRef.current = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (event === "INITIAL_SESSION" && initialSessionResolvedRef.current) {
          return;
        }

        if (event === "INITIAL_SESSION") {
          initialSessionResolvedRef.current = true;
        }

        await syncSessionState(newSession);
      }
    );

    supabase.auth.getSession().then(async ({ data: { session: existingSession } }) => {
      if (initialSessionResolvedRef.current) return;
      initialSessionResolvedRef.current = true;
      await syncSessionState(existingSession);
    }).catch(() => {
      if (mountedRef.current) {
        setProfile(null);
        setUser(null);
        setSession(null);
        setLoading(false);
      }
    });

    return () => {
      mountedRef.current = false;
      subscription.unsubscribe();
    };
  }, [syncSessionState]);

  const signUp = async (email: string, password: string, fullName?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: fullName },
      },
    });
    if (error) return { error: translateAuthError(error.message) };
    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: translateAuthError(error.message) };
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (!user) return;
    const nextProfile = await fetchProfile(user.id);
    if (mountedRef.current) setProfile(nextProfile);
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, signUp, signIn, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}

function translateAuthError(msg: string): string {
  if (msg.includes("Invalid login credentials")) return "E-mail ou senha incorretos.";
  if (msg.includes("Email not confirmed")) return "Confirme seu e-mail antes de entrar. Verifique sua caixa de entrada.";
  if (msg.includes("User already registered")) return "Este e-mail já está cadastrado.";
  if (msg.includes("Password should be at least")) return "A senha deve ter no mínimo 6 caracteres.";
  if (msg.includes("Email rate limit exceeded")) return "Muitas tentativas. Aguarde alguns minutos.";
  return msg;
}
