import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useInternetIdentity, InternetIdentityProvider } from '../hooks/useInternetIdentity';

const ADMIN_PRINCIPAL = "jqvc4-5tjdu-a3br6-pm2i3-cgbcq-umfiv-r2kcw-z4hju-ox52z-apmjw-eqe";

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
      
      if (principal.toText() === ADMIN_PRINCIPAL) {
        setRole("admin");
      } else {
        setRole("student");
      }
      
      console.log("Principal:", principal.toText());
      console.log("Role:", principal.toText() === ADMIN_PRINCIPAL ? "admin" : "student");
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
