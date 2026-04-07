import React, { createContext, useState, useContext, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { api } from "../api/api";

// Definindo os tipos (TypeScript salvando a vida)
interface AuthContextData {
  signed: boolean;
  user: any;
  signIn: (email: string, pass: string) => Promise<void>;
  signOut: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Ao abrir o app, verifica se já existe um token salvo
  useEffect(() => {
    async function loadStorageData() {
      const storagedToken = await SecureStore.getItemAsync("userToken");

      if (storagedToken) {
        // Aqui o ideal seria ter uma rota /users/me no back para validar o token
        setUser({ token: storagedToken }); // Mock simples para liberar o app
        api.defaults.headers.Authorization = `Bearer ${storagedToken}`;
      }
      setLoading(false);
    }
    loadStorageData();
  }, []);

  async function signIn(email: string, pass: string) {
    try {
      const response = await api.post("/auth/login", { email, password: pass });

      const { access_token, user } = response.data;

      // Salva no cofre do dispositivo
      await SecureStore.setItemAsync("userToken", access_token);

      // Injeta no Axios para as próximas requisições
      api.defaults.headers.Authorization = `Bearer ${access_token}`;
      setUser(user);
    } catch (error) {
      console.error("Erro no login:", error);
      throw error; // Repassa o erro para a tela de login mostrar um alerta
    }
  }

  async function signOut() {
    await SecureStore.deleteItemAsync("userToken");
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ signed: !!user, user, signIn, signOut, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
