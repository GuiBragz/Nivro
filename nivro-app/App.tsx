import React, { useState, useEffect } from "react";
import {
  StatusBar,
  View,
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";
import { useFonts } from "expo-font";
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from "@expo-google-fonts/dm-sans";
import {
  JetBrainsMono_400Regular,
  JetBrainsMono_700Bold,
} from "@expo-google-fonts/jetbrains-mono";

import { AuthProvider, useAuth } from "./src/contexts/AuthContext";
import { AppRoutes } from "./src/routes/app.routes";
import { AuthRoutes } from "./src/routes/auth.routes";

function Routes() {
  const { signed, loading } = useAuth();
  const [isBiometricAuthenticated, setIsBiometricAuthenticated] =
    useState(false);
  const [isCheckingBiometrics, setIsCheckingBiometrics] = useState(true);

  // 👇 FUNÇÃO DE BLOQUEIO POR BIOMETRIA
  async function handleBiometricAuth() {
    try {
      const useBiometrics = await SecureStore.getItemAsync("useBiometrics");

      // Se não tiver biometria ativada, libera direto
      if (useBiometrics !== "true") {
        setIsBiometricAuthenticated(true);
        setIsCheckingBiometrics(false);
        return;
      }

      // Se estiver ativada, pede a digital/rosto
      const auth = await LocalAuthentication.authenticateAsync({
        promptMessage: "Acesso Protegido - Nivro",
        fallbackLabel: "Usar senha do celular",
        disableDeviceFallback: false,
      });

      if (auth.success) {
        setIsBiometricAuthenticated(true);
      } else {
        // Se falhar ou cancelar, não libera
        setIsBiometricAuthenticated(false);
      }
    } catch (e) {
      console.error(e);
      setIsBiometricAuthenticated(true); // Em caso de erro crítico, libera para não travar o usuário
    } finally {
      setIsCheckingBiometrics(false);
    }
  }

  useEffect(() => {
    if (!loading && signed) {
      handleBiometricAuth();
    } else if (!loading && !signed) {
      setIsCheckingBiometrics(false);
    }
  }, [loading, signed]);

  // Enquanto estiver validando o token ou a biometria
  if (loading || isCheckingBiometrics) {
    return <View style={{ flex: 1, backgroundColor: "#080A0E" }} />;
  }

  // Se estiver logado MAS a biometria falhou/foi cancelada
  if (signed && !isBiometricAuthenticated) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#080A0E",
          justifyContent: "center",
          alignItems: "center",
          padding: 40,
        }}
      >
        <Text
          style={{
            color: "#E8EDF5",
            fontSize: 18,
            fontFamily: "DMSans_700Bold",
            textAlign: "center",
            marginBottom: 24,
          }}
        >
          O Nivro está bloqueado.
        </Text>
        <TouchableOpacity
          onPress={handleBiometricAuth}
          style={{
            backgroundColor: "#00B37E",
            paddingVertical: 14,
            paddingHorizontal: 24,
            borderRadius: 12,
          }}
        >
          <Text style={{ color: "#080A0E", fontFamily: "DMSans_700Bold" }}>
            Desbloquear App
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {signed ? <AppRoutes /> : <AuthRoutes />}
    </NavigationContainer>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
    JetBrainsMono_400Regular,
    JetBrainsMono_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#080A0E",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#00B37E" />
      </View>
    );
  }

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
