import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useInternetIdentity, InternetIdentityProvider } from '../hooks/useInternetIdentity';

const ADMIN_PRINCIPALS: string[] = [
  "jqvc4-5tjdu-a3br6-pm2i3-cgbcq-umfiv-r2kcw-z4hju-ox52z-apmjw-eqe",
  "7fcix-3k27q-qz2i2-m15xq-swzz6-6ph64-6cshf-rnmki-3np3b-svw7o-pqe"
];

interface AuthContextType {
  isAuthenticated: boolean;
  principalId: string | null;
  login: () => void;
  logout: () => void;
  isLoading: boolean;
  role: "student" | "admin";
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthProviderInner({ children }: { children: ReactNode }) {
  const { identity, login, clear, isInitializing, loginStatus } = useInternetIdentity();
  const [role, setRole] = useState<"student" | "admin">("student");

  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();
  const principalId = isAuthenticated ? identity.getPrincipal().toString() : null;
  const isLoading = isInitializing || loginStatus === 'logging-in';

  // Set role based on principal
  useEffect(() => {
    if (identity && isAuthenticated) {
      const principal = identity.getPrincipal();
      
      if (ADMIN_PRINCIPALS.includes(principal.toText())) {
        setRole("admin");
      } else {
        setRole("student");
      }
      
      console.log("Principal:", principal.toText());
      console.log("Role:", ADMIN_PRINCIPALS.includes(principal.toText()) ? "admin" : "student");
    } else {
      setRole("student");
    }
  }, [identity, isAuthenticated]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        principalId,
        login,
        logout: clear,
        isLoading,
        role,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <InternetIdentityProvider>
      <AuthProviderInner>{children}</AuthProviderInner>
    </InternetIdentityProvider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
