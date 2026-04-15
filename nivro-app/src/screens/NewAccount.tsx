import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { api } from "../api/api";

export function NewAccount() {
  const navigation = useNavigation();
  const [institutionName, setInstitutionName] = useState("");
  const [balance, setBalance] = useState("");
  const [type, setType] = useState<
    "CHECKING" | "CREDIT" | "INVESTMENT" | "WALLET"
  >("CHECKING");
  const [loading, setLoading] = useState(false);

  async function handleSaveAccount() {
    if (!institutionName) {
      return Alert.alert("Ops", "Qual o nome do Banco ou Corretora?");
    }

    try {
      setLoading(true);
      await api.post("/accounts", {
        institution_name: institutionName,
        type,
        balance: Number(balance.replace(",", ".")) || 0,
      });

      Alert.alert("Sucesso", "Conta cadastrada com sucesso!");
      navigation.goBack(); // Volta para a tela anterior
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível salvar a conta.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>Cancelar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Nova Conta</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Qual o tipo da conta?</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.typeContainer}
        >
          <TouchableOpacity
            style={[
              styles.typeButton,
              type === "CHECKING" && styles.typeActive,
            ]}
            onPress={() => setType("CHECKING")}
          >
            <Text
              style={[
                styles.typeText,
                type === "CHECKING" && { color: "#FFF" },
              ]}
            >
              Conta Corrente
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeButton,
              type === "INVESTMENT" && styles.typeActive,
            ]}
            onPress={() => setType("INVESTMENT")}
          >
            <Text
              style={[
                styles.typeText,
                type === "INVESTMENT" && { color: "#FFF" },
              ]}
            >
              Investimento
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.typeButton, type === "WALLET" && styles.typeActive]}
            onPress={() => setType("WALLET")}
          >
            <Text
              style={[styles.typeText, type === "WALLET" && { color: "#FFF" }]}
            >
              Carteira (Dinheiro)
            </Text>
          </TouchableOpacity>
        </ScrollView>

        <Text style={styles.label}>Instituição (Ex: Nubank, XP, Rico...)</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome do banco/corretora"
          placeholderTextColor="#8D8D99"
          value={institutionName}
          onChangeText={setInstitutionName}
        />

        <Text style={styles.label}>Saldo Atual / Valor Investido</Text>
        <TextInput
          style={styles.input}
          placeholder="R$ 0,00"
          placeholderTextColor="#8D8D99"
          keyboardType="numeric"
          value={balance}
          onChangeText={setBalance}
        />

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveAccount}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? "Salvando..." : "Cadastrar Conta"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121214" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 24,
    paddingTop: 60,
    alignItems: "center",
  },
  cancelText: { color: "#F75A68", fontSize: 16 },
  title: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  form: { padding: 24 },
  label: { color: "#8D8D99", marginBottom: 8, fontSize: 14, marginTop: 16 },
  typeContainer: { flexDirection: "row", marginBottom: 16 },
  typeButton: {
    backgroundColor: "#202024",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#323238",
  },
  typeActive: { backgroundColor: "#00B37E", borderColor: "#00B37E" },
  typeText: { color: "#8D8D99", fontWeight: "bold" },
  input: {
    backgroundColor: "#202024",
    color: "#FFF",
    padding: 16,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 8,
  },
  saveButton: {
    backgroundColor: "#00B37E",
    height: 56,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 32,
  },
  saveButtonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
});
