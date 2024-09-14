"use client";

import { useState, useEffect, createContext, ReactNode, Dispatch, SetStateAction } from "react";
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
  updated: boolean;
  uploaded: boolean;
  setUpdated: Dispatch<SetStateAction<boolean>>;
  setUploaded: Dispatch<SetStateAction<boolean>>;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  register: (credentials: UserCredentials) => Promise<void>;
  updateProfile: (credentials: UserCredentials, access_token: string) => Promise<void>;
  uploadResume: (fromData: FormData, access_token: string) => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

interface LoginCredentials {
  username: string;
  password: string;
}

interface UserCredentials {
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
  updated: false,
  uploaded: false,
  setUpdated: () => {},
  setUploaded: () => {},
  login: async (credentials: LoginCredentials) => {},
  logout: async () => {},
  register: async (credentials: UserCredentials) => {},
  updateProfile: async (credentials: UserCredentials, access_token: string) => {},
  uploadResume: async (formData: FormData, access_token: string) => {},
};

const AuthContext = createContext<AuthContextType>(defaultContextValue);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [updated, setUpdated] = useState<boolean>(false);
  const [uploaded, setUploaded] = useState<boolean>(false);

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
  const register = async ({ firstName, lastName, email, password }: UserCredentials) => {
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

  // Update user
  const updateProfile = async ({ firstName, lastName, email, password }: UserCredentials,
    access_token: string
  ) => {
    try {
      setLoading(true);

      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/me/update/`, {
          first_name: firstName,
          last_name: lastName,
          email,
          password,
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      console.log("Update Profile: ", res.data);
      
      if (res.data) {
        setLoading(false);
        setUpdated(true);
        setUser(res.data);
      }
    } catch (error: any) {
      console.log(error.response);
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

  // Upload Resume
  const uploadResume = async (formData: FormData, access_token: string) => {
    try {
      setLoading(true);

      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/upload/resume/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      console.log("🟢 ", res.data);

      if (res.data) {
        await loadUser();
        setLoading(false);
        setUploaded(true);
      }
    } catch (error: any) {
      console.log(error.response);
      setLoading(false);
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
        updated,
        uploaded,
        setUpdated,
        setUploaded,
        login,
        logout,
        register,
        updateProfile,
        uploadResume
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

