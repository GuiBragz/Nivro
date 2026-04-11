import React from "react";
import { StatusBar, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";

import { AuthProvider, useAuth } from "./src/contexts/AuthContext";
import { AppRoutes } from "./src/routes/app.routes";
import { AuthRoutes } from "./src/routes/auth.routes"; // <-- Faltava esse cara!

// O componente que decide qual fluxo de navegação mostrar
function Routes() {
  const { signed, loading } = useAuth();

  // Enquanto o app checa o token no SecureStore, mostramos uma tela vazia
  if (loading) {
    return <View style={{ flex: 1, backgroundColor: "#121214" }} />;
  }

  return (
    <NavigationContainer>
      {/* Se estiver logado, AppRoutes (Tabs). Se não, AuthRoutes (Stack) */}
      {signed ? <AppRoutes /> : <AuthRoutes />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <Routes />
    </AuthProvider>
  );
}
