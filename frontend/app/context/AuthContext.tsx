"use client";

import { useState, useEffect, createContext, ReactNode } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";

interface User {
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  resume: string;
}

interface AuthContextType {
  loading: boolean;
  user: User | null;
  isAuthenticated: boolean;
  error: Error | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterCredentials {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const defaultContextValue: AuthContextType = {
  loading: false,
  user: null,
  isAuthenticated: false,
  error: null,
  login: async (credentials: LoginCredentials) => {},
  logout: async () => {},
  register: async (credentials: RegisterCredentials) => {}
};

const AuthContext = createContext<AuthContextType>(defaultContextValue);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      loadUser();
    }
  }, [user]);

   // Login user
  const login = async ({ username, password }: LoginCredentials) => {
    try {
      setLoading(true);

      const res = await axios.post("/api/login", {
        username,
        password,
      });

      if (res.data.success) {
        setIsAuthenticated(true);
        await loadUser();
        setLoading(false);
        router.push("/");
      }
    } catch (error: any) {  
      console.log("From AuthContext: ", error);
      
      toast.error(String(error.response.data.error));    
      setLoading(false);
      setError(
        error.response &&
          (error.response.data.detail || error.response.data.error)
      );
    }
  };

  // Register user
  const register = async ({ firstName, lastName, email, password }: RegisterCredentials) => {
    try {
      setLoading(true);

      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/register/`, {
        first_name: firstName,
        last_name: lastName,
        email,
        password,
      });

      console.log("👤: ", res.data);

      if (res.data.message) {
        setLoading(false);
        router.push("/login");
      }
    } catch (error: any) {
      console.log(error.response);
      toast.error(String(error.response.data.error));  
      setLoading(false);
      setError(
        error.response &&
          (error.response.data.detail || error.response.data.error)
      );
    }
  };

  // Load user
  const loadUser = async () => {
    try {
      setLoading(true);

      const res = await axios.get("/api/user");

      if (res.data) {
        setIsAuthenticated(true);
        setLoading(false);
        setUser(res.data);
      }
    } catch (error: any) {
      console.log(error);
      
      setLoading(false);
      setIsAuthenticated(false);
      setUser(null);
      setError(
        error.response &&
          (error.response.data.detail || error.response.data.error)
      );
    }
  };

  // Logout
  const logout = async () => {
    try {
      setLoading(true);

      await axios.post("/api/logout");

      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
      router.push("/");
    } catch (error: any) {
      setLoading(false);
      setError(
        error.response &&
          (error.response.data.detail || error.response.data.error)
      );
    }
  };

  return (
    <AuthContext.Provider
      value={{
        loading,
        user,
        isAuthenticated,
        error,
        login,
        logout,
        register
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

