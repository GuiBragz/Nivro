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
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { api } from "../api/api";

export function NewTransaction() {
  const navigation = useNavigation();
  const [type, setType] = useState<"INCOME" | "EXPENSE">("EXPENSE");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    if (!description || !amount) {
      return Alert.alert("Ops", "Preencha a descrição e o valor.");
    }

    try {
      setLoading(true);
      const accounts = await api.get("/accounts");
      if (accounts.data.length === 0) {
        Alert.alert(
          "Erro",
          "Você precisa cadastrar uma conta bancária primeiro.",
        );
        setLoading(false);
        return;
      }

      await api.post("/transactions", {
        description,
        amount: Number(amount.replace(",", ".")),
        type,
        account_id: accounts.data[0].id,
        executed_at: new Date().toISOString(),
      });

      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível salvar a transação.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Feather name="x" size={24} color="#E8EDF5" />
        </TouchableOpacity>
        <Text style={styles.title}>Nova Transação</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.form}>
        {/* Toggle Receita / Despesa */}
        <View style={styles.typeToggle}>
          <TouchableOpacity
            style={[styles.typeBtn, type === "INCOME" && styles.typeBtnInc]}
            onPress={() => setType("INCOME")}
            activeOpacity={0.8}
          >
            <Feather
              name="arrow-up"
              size={16}
              color={type === "INCOME" ? "#00B37E" : "rgba(232,237,245,0.55)"}
            />
            <Text
              style={[
                styles.typeBtnText,
                type === "INCOME" && { color: "#00B37E" },
              ]}
            >
              Receita
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.typeBtn, type === "EXPENSE" && styles.typeBtnExp]}
            onPress={() => setType("EXPENSE")}
            activeOpacity={0.8}
          >
            <Feather
              name="arrow-down"
              size={16}
              color={type === "EXPENSE" ? "#F75A68" : "rgba(232,237,245,0.55)"}
            />
            <Text
              style={[
                styles.typeBtnText,
                type === "EXPENSE" && { color: "#F75A68" },
              ]}
            >
              Despesa
            </Text>
          </TouchableOpacity>
        </View>

        {/* Input Valor */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>VALOR</Text>
          <View style={styles.amountContainer}>
            <Text style={styles.currencySymbol}>R$</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="0.00"
              placeholderTextColor="rgba(232,237,245,0.3)"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
          </View>
        </View>

        {/* Input Descrição */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>DESCRIÇÃO</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Supermercado, Salário..."
            placeholderTextColor="rgba(232,237,245,0.3)"
            value={description}
            onChangeText={setDescription}
          />
        </View>

        {/* Botão de Salvar com Gradiente */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleSave}
          disabled={loading}
          style={{ marginTop: 24 }}
        >
          <LinearGradient
            colors={["#00B37E", "#00D496"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.saveBtn}
          >
            <Text style={styles.saveBtnText}>
              {loading ? "Salvando..." : "Salvar Transação"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0D1017" },
  content: { paddingBottom: 40 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.04)",
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.05)",
    justifyContent: "center",
    alignItems: "center",
  },
  title: { color: "#E8EDF5", fontSize: 18, fontFamily: "DMSans_700Bold" },
  form: { padding: 24 },

  typeToggle: { flexDirection: "row", gap: 12, marginBottom: 32 },
  typeBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  typeBtnInc: {
    backgroundColor: "rgba(0,179,126,0.12)",
    borderColor: "#00B37E",
  },
  typeBtnExp: {
    backgroundColor: "rgba(247,90,104,0.12)",
    borderColor: "#F75A68",
  },
  typeBtnText: {
    color: "rgba(232,237,245,0.55)",
    fontSize: 14,
    fontFamily: "DMSans_700Bold",
  },

  inputGroup: { marginBottom: 24 },
  inputLabel: {
    fontSize: 12,
    color: "rgba(232,237,245,0.55)",
    fontFamily: "DMSans_700Bold",
    marginBottom: 8,
    letterSpacing: 0.5,
  },

  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#131820",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 64,
  },
  currencySymbol: {
    fontSize: 20,
    color: "rgba(232,237,245,0.55)",
    fontFamily: "JetBrainsMono_700Bold",
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    color: "#E8EDF5",
    fontSize: 28,
    fontFamily: "JetBrainsMono_700Bold",
  },

  input: {
    height: 56,
    backgroundColor: "#131820",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#E8EDF5",
    fontFamily: "DMSans_400Regular",
  },

  saveBtn: {
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  saveBtnText: { color: "#000", fontSize: 16, fontFamily: "DMSans_700Bold" },
});
