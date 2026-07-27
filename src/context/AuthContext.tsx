import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, onAuthStateChanged, signInWithEmailAndPassword, signOut as firebaseSignOut, type Auth } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { ADMIN_EMAIL } from "@/config/admin";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  authEnabled: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const authEnabled = !!auth;

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    let unsubscribe: (() => void) | null = null;

    try {
      unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        try {
          if (currentUser && currentUser.email !== ADMIN_EMAIL) {
            // Unauthorized user - sign them out immediately
            if (auth) firebaseSignOut(auth).catch((err) => console.error("Error signing out unauthorized user:", err));
            setUser(null);
          } else {
            setUser(currentUser);
          }
        } catch (error) {
          console.error("Error in auth state change handler:", error);
        } finally {
          setLoading(false);
        }
      });
    } catch (error) {
      console.error("Error setting up auth state listener:", error);
      setLoading(false);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [auth]);

  const login = async (email: string, password: string) => {
    if (!auth) {
      throw new Error("Authentication is not configured. Please set up Firebase environment variables.");
    }
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Check if the logged-in user is the admin
      if (userCredential.user.email !== ADMIN_EMAIL) {
        await firebaseSignOut(auth);
        throw new Error("Unauthorized: Only the admin can access this dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    if (auth) {
      try {
        await firebaseSignOut(auth);
      } catch (error) {
        console.error("Logout error:", error);
      }
    }
  };

  const isAdmin = user?.email === ADMIN_EMAIL;

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin, authEnabled }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
