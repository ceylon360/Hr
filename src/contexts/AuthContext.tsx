import { createContext, useContext, useState } from "react";

type User = {
  id: string;
  username: string;
  isAdmin: boolean;
};

type AuthContextType = {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  loading: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin] = useState(false);
  const [loading] = useState(false);

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
