import axios from "axios";
import * as SecureStore from "expo-secure-store";

export const api = axios.create({
  // Se estiver rodando no celular físico, coloque o IP da sua máquina aqui (ex: http://192.168.1.15:3000)
  // Se for emulador Android, use http://10.0.2.2:3000
  baseURL: "http://192.168.1.6:3000",
});

// Interceptador: Antes de qualquer requisição sair, ele injeta o Token!
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("userToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
