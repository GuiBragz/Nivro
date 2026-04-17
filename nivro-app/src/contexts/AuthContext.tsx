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
  hideBalances: boolean;
  toggleHideBalances: () => void;
  // 👇 1. Tipagem das notificações
  notifications: any[];
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  markAllAsRead: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hideBalances, setHideBalances] = useState(false);

  // 👇 2. Estado Global de Notificações (Mock para o Front-end)
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      title: "Bem-vindo ao Nivro!",
      message:
        "Comece a registrar seus gastos para ter controle total da sua grana.",
      time: "Agora",
      read: false,
      type: "system",
    },
    {
      id: "2",
      title: "Alerta de Gasto",
      message: "Você gastou R$ 150,00 em Alimentação nas últimas 24h.",
      time: "Ontem",
      read: false,
      type: "alert",
    },
  ]);

  useEffect(() => {
    async function loadStorageData() {
      const storagedToken = await SecureStore.getItemAsync("userToken");
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

  async function toggleHideBalances() {
    const newValue = !hideBalances;
    setHideBalances(newValue);
    await SecureStore.setItemAsync("hideBalances", String(newValue));
  }

  // 👇 3. Funções de Ação das Notificações
  function removeNotification(id: string) {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }

  function clearAllNotifications() {
    setNotifications([]);
  }

  function markAllAsRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
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
        hideBalances,
        toggleHideBalances,
        // 👇 4. Exportando tudo para o App usar
        notifications,
        removeNotification,
        clearAllNotifications,
        markAllAsRead,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
