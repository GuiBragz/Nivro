import React from "react";
import { StatusBar } from "react-native";
import { AuthProvider, useAuth } from "./src/contexts/AuthContext";
import { Login } from "./src/screens/Login";
import { View, Text, TouchableOpacity } from "react-native";

// Uma Home provisória só para testarmos o fluxo
function HomeProvisoria() {
  const { signOut } = useAuth();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#121214",
      }}
    >
      <Text style={{ color: "#FFF", fontSize: 24, marginBottom: 20 }}>
        Bem-vindo ao Nivro!
      </Text>
      <TouchableOpacity
        onPress={signOut}
        style={{ padding: 16, backgroundColor: "#F75A68", borderRadius: 8 }}
      >
        <Text style={{ color: "#FFF", fontWeight: "bold" }}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

// O componente que decide qual tela renderizar
function Routes() {
  const { signed, loading } = useAuth();

  if (loading) {
    return <View style={{ flex: 1, backgroundColor: "#121214" }} />; // Tela preta enquanto carrega o token
  }

  return signed ? <HomeProvisoria /> : <Login />;
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
