import React, { useState, useEffect } from "react";
import {
  StatusBar,
  View,
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  Platform,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";
import * as Notifications from "expo-notifications";
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

// 👇 IMPORTAÇÃO DA IA
import { AiChatFAB } from "./src/components/AiChatFAB";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

function Routes() {
  const { signed, loading } = useAuth();
  const [isBiometricAuthenticated, setIsBiometricAuthenticated] =
    useState(false);
  const [isCheckingBiometrics, setIsCheckingBiometrics] = useState(true);

  async function handleBiometricAuth() {
    try {
      const useBiometrics = await SecureStore.getItemAsync("useBiometrics");

      if (useBiometrics !== "true") {
        setIsBiometricAuthenticated(true);
        setIsCheckingBiometrics(false);
        return;
      }

      const auth = await LocalAuthentication.authenticateAsync({
        promptMessage: "Acesso Protegido - Nivro",
        fallbackLabel: "Usar senha do celular",
        disableDeviceFallback: false,
      });

      if (auth.success) {
        setIsBiometricAuthenticated(true);
      } else {
        setIsBiometricAuthenticated(false);
      }
    } catch (e) {
      console.error(e);
      setIsBiometricAuthenticated(true);
    } finally {
      setIsCheckingBiometrics(false);
    }
  }

  async function setupReminderNotification() {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") return;

      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "Lembretes Nivro",
          importance: Notifications.AndroidImportance.HIGH,
        });
      }

      await Notifications.cancelAllScheduledNotificationsAsync();

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Nivro 💰",
          body: "Já anotou seus gastos de hoje? Mantenha seu controle em dia!",
          sound: true,
        },
        trigger: {
          type: "timeInterval",
          seconds: 12 * 60 * 60,
          repeats: false,
          channelId: "default",
        },
      });
    } catch (error) {
      console.log("Erro ao agendar notificação:", error);
    }
  }

  useEffect(() => {
    if (!loading && signed) {
      handleBiometricAuth();
      setupReminderNotification();
    } else if (!loading && !signed) {
      setIsCheckingBiometrics(false);
    }
  }, [loading, signed]);

  if (loading || isCheckingBiometrics) {
    return <View style={{ flex: 1, backgroundColor: "#080A0E" }} />;
  }

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
    <View style={{ flex: 1 }}>
      <NavigationContainer>
        {signed ? <AppRoutes /> : <AuthRoutes />}
      </NavigationContainer>

      {/* 👇 A BOLINHA SÓ APARECE SE ESTIVER LOGADO E BIOMETRIA OK */}
      {signed && isBiometricAuthenticated && <AiChatFAB />}
    </View>
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
