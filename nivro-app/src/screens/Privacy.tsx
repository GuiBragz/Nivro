import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";

// 👇 CORREÇÃO 1: Importamos a versão "legacy" para funcionar no Expo 54
import * as FileSystem from "expo-file-system/legacy";

import { useAuth } from "../contexts/AuthContext";
import { api } from "../api/api";

export function Privacy() {
  const navigation = useNavigation<any>();
  const { hideBalances, toggleHideBalances } = useAuth();

  const [biometrics, setBiometrics] = useState(false);
  const [analytics, setAnalytics] = useState(true);

  useEffect(() => {
    async function loadConfigs() {
      const storedBio = await SecureStore.getItemAsync("useBiometrics");
      const storedAna = await SecureStore.getItemAsync("allowAnalytics");

      if (storedBio === "true") setBiometrics(true);
      if (storedAna !== null) setAnalytics(storedAna === "true");
    }
    loadConfigs();
  }, []);

  async function handleToggleBiometrics(value: boolean) {
    if (value) {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        return Alert.alert("Erro", "Biometria não disponível neste aparelho.");
      }

      const auth = await LocalAuthentication.authenticateAsync({
        promptMessage: "Confirme para ativar",
      });

      if (auth.success) {
        setBiometrics(true);
        await SecureStore.setItemAsync("useBiometrics", "true");
      } else {
        setBiometrics(false);
      }
    } else {
      setBiometrics(false);
      await SecureStore.setItemAsync("useBiometrics", "false");
    }
  }

  async function handleToggleAnalytics(value: boolean) {
    setAnalytics(value);
    await SecureStore.setItemAsync("allowAnalytics", String(value));
  }

  async function handleExportData() {
    try {
      const response = await api.get("/transactions/dashboard");
      const transactions = response.data;

      if (!transactions || transactions.length === 0) {
        return Alert.alert("Aviso", "Não há transações para exportar.");
      }

      let csvHeader = "Data;Descricao;Tipo;Valor\n";
      let csvContent = "";

      for (const t of transactions) {
        const date = new Date(t.executed_at).toLocaleDateString("pt-BR");
        csvContent += `${date};${t.description};${t.type};${t.amount}\n`;
      }

      const fileUri = FileSystem.documentDirectory + "extrato_nivro.csv";

      // 👇 CORREÇÃO 2: A chamada da função na versão Legacy com o tipo em string
      await FileSystem.writeAsStringAsync(fileUri, csvHeader + csvContent, {
        encoding: "utf8",
      });

      Alert.alert(
        "Exportação Concluída",
        "Seu histórico de transações foi salvo com sucesso nos arquivos do aplicativo.",
      );
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível gerar o arquivo.");
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color="#E8EDF5" />
        </TouchableOpacity>
        <Text style={styles.title}>Privacidade</Text>
        <View style={{ width: 40 }} />
      </View>

      <Text style={styles.description}>
        Gerencie como o Nivro lida com as suas informações e preferências.
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>VISIBILIDADE NO APP</Text>
        <View style={styles.menuItem}>
          <View style={styles.iconBox}>
            <Feather name="eye-off" size={20} color="#E8EDF5" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.menuItemText}>Ocultar saldos</Text>
            <Text style={styles.menuItemDesc}>
              Esconde valores na tela inicial
            </Text>
          </View>
          <Switch
            value={hideBalances}
            onValueChange={toggleHideBalances}
            trackColor={{ false: "rgba(255,255,255,0.1)", true: "#00B37E" }}
            thumbColor={"#FFF"}
          />
        </View>

        <View style={styles.menuItem}>
          <View style={styles.iconBox}>
            <Feather name="smartphone" size={20} color="#E8EDF5" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.menuItemText}>Biometria / Face ID</Text>
            <Text style={styles.menuItemDesc}>Exigir para abrir o app</Text>
          </View>
          <Switch
            value={biometrics}
            onValueChange={handleToggleBiometrics}
            trackColor={{ false: "rgba(255,255,255,0.1)", true: "#00B37E" }}
            thumbColor={"#FFF"}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>CONTROLE DE DADOS</Text>
        <View style={styles.menuItem}>
          <View style={styles.iconBox}>
            <Feather name="bar-chart-2" size={20} color="#E8EDF5" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.menuItemText}>Análise de uso</Text>
            <Text style={styles.menuItemDesc}>
              Compartilhar dados anônimos de erro
            </Text>
          </View>
          <Switch
            value={analytics}
            onValueChange={handleToggleAnalytics}
            trackColor={{ false: "rgba(255,255,255,0.1)", true: "#00B37E" }}
            thumbColor={"#FFF"}
          />
        </View>

        <TouchableOpacity style={styles.menuItemBtn} onPress={handleExportData}>
          <View style={styles.iconBox}>
            <Feather name="download-cloud" size={20} color="#E8EDF5" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.menuItemText}>Exportar meus dados</Text>
            <Text style={styles.menuItemDesc}>Baixe seu histórico em CSV</Text>
          </View>
          <Feather
            name="chevron-right"
            size={20}
            color="rgba(232,237,245,0.3)"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>LEGAL</Text>
        <TouchableOpacity
          style={styles.menuItemBtn}
          onPress={() =>
            Alert.alert("Em breve", "O texto será adicionado amanhã.")
          }
        >
          <View style={styles.iconBox}>
            <Feather name="file-text" size={20} color="#E8EDF5" />
          </View>
          <Text style={styles.menuItemText}>Termos de Uso e Política</Text>
          <Feather
            name="external-link"
            size={16}
            color="rgba(232,237,245,0.3)"
          />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ... styles mantidos inalterados
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#080A0E" },
  content: { paddingTop: 60, paddingHorizontal: 24, paddingBottom: 40 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.05)",
    justifyContent: "center",
    alignItems: "center",
  },
  title: { fontSize: 22, color: "#E8EDF5", fontFamily: "DMSans_700Bold" },
  description: {
    fontSize: 14,
    color: "rgba(232,237,245,0.55)",
    fontFamily: "DMSans_400Regular",
    marginBottom: 32,
    lineHeight: 22,
  },
  section: { marginBottom: 32 },
  sectionLabel: {
    fontSize: 11,
    color: "rgba(232,237,245,0.3)",
    fontFamily: "DMSans_700Bold",
    letterSpacing: 1.5,
    marginBottom: 16,
    marginLeft: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#131820",
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.03)",
  },
  menuItemBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#131820",
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.03)",
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  textContainer: { flex: 1 },
  menuItemText: {
    flex: 1,
    fontSize: 15,
    color: "#E8EDF5",
    fontFamily: "DMSans_500Medium",
    marginBottom: 2,
  },
  menuItemDesc: {
    fontSize: 12,
    color: "rgba(232,237,245,0.4)",
    fontFamily: "DMSans_400Regular",
  },
});
