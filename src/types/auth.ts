import { type Session, type AuthError, type User } from "@supabase/supabase-js";

export interface AuthContextType {
  session: Session | null;
  loading: boolean;
  verifying: boolean;
  authSuccess: boolean;
  authError: string | null;

  logout: () => Promise<{
    result: string;
    error: AuthError | null;
  }>;

  login: () => void;

  signUpNewUser: (
    email: string,
    password: string
  ) => Promise<{
    data: { user: User | null; session: Session | null };
    error: AuthError | null;
  }>;

  signInWithEmail: (
    email: string,
    password: string
  ) => Promise<{
    data: { user: User | null; session: Session | null };
    error: AuthError | null;
  }>;
}
