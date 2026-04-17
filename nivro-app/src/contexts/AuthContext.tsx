import React, { createContext, useState, useContext, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { api } from "../api/api";

interface AuthContextData {
  signed: boolean;
  user: any;
  signIn: (email: string, pass: string) => Promise<void>;
  signOut: () => void;
  loading: boolean;
  updateUser: (data: any) => void;
  // 👇 1. Adicionado os tipos para o TypeScript não chorar
  hideBalances: boolean;
  toggleHideBalances: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 👇 2. O estado que guarda se o olho tá aberto ou fechado
  const [hideBalances, setHideBalances] = useState(false);

  useEffect(() => {
    async function loadStorageData() {
      const storagedToken = await SecureStore.getItemAsync("userToken");

      // 👇 3. Toda vez que abre o app, ele lembra se você deixou oculto na última vez
      const storedHideBalances = await SecureStore.getItemAsync("hideBalances");
      if (storedHideBalances === "true") {
        setHideBalances(true);
      }

      if (storagedToken) {
        api.defaults.headers.Authorization = `Bearer ${storagedToken}`;
        try {
          const response = await api.get("/users/me");
          setUser(response.data);
        } catch (error) {
          await SecureStore.deleteItemAsync("userToken");
          setUser(null);
        }
      }
      setLoading(false);
    }
    loadStorageData();
  }, []);

  async function signIn(email: string, pass: string) {
    try {
      const response = await api.post("/auth/login", { email, password: pass });
      const { access_token, user } = response.data;

      await SecureStore.setItemAsync("userToken", access_token);
      api.defaults.headers.Authorization = `Bearer ${access_token}`;
      setUser(user);
    } catch (error) {
      throw error;
    }
  }

  async function signOut() {
    await SecureStore.deleteItemAsync("userToken");
    setUser(null);
  }

  function updateUser(newData: any) {
    setUser((prev: any) => ({ ...prev, ...newData }));
  }

  // 👇 4. Função que a tela de Privacidade vai chamar pra trocar a chave
  async function toggleHideBalances() {
    const newValue = !hideBalances;
    setHideBalances(newValue);
    await SecureStore.setItemAsync("hideBalances", String(newValue));
  }

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        user,
        signIn,
        signOut,
        loading,
        updateUser,
        // 👇 Não esquece de exportar eles aqui pra fora!
        hideBalances,
        toggleHideBalances,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
