import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { api } from "../api/api";

export function NewAccount() {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(false);
  const [institutionName, setInstitutionName] = useState("");
  const [balance, setBalance] = useState("");
  const [type, setType] = useState<"CHECKING" | "WALLET">("CHECKING");

  async function handleSave() {
    if (!institutionName.trim() || !balance) {
      return Alert.alert("Ops", "Preencha a instituição e o saldo inicial.");
    }

    try {
      setLoading(true);
      await api.post("/accounts", {
        institution_name: institutionName.trim(),
        type,
        balance: Number(balance.replace(",", ".")),
      });

      Alert.alert("Sucesso", "Conta criada com sucesso!");
      navigation.navigate("Home"); // Força a volta para a Home para recarregar o saldo
    } catch (error) {
      Alert.alert("Erro", "Não foi possível criar a conta.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Feather name="arrow-left" size={24} color="#E8EDF5" />
        </TouchableOpacity>
        <Text style={styles.title}>Nova Conta</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.form}>
        <View style={styles.typeToggle}>
          <TouchableOpacity
            style={[
              styles.typeBtn,
              type === "CHECKING" && styles.typeBtnActive,
            ]}
            onPress={() => setType("CHECKING")}
          >
            <Feather
              name="briefcase"
              size={16}
              color={type === "CHECKING" ? "#00B37E" : "rgba(232,237,245,0.55)"}
            />
            <Text
              style={[
                styles.typeBtnText,
                type === "CHECKING" && { color: "#00B37E" },
              ]}
            >
              Corrente
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.typeBtn, type === "WALLET" && styles.typeBtnActive]}
            onPress={() => setType("WALLET")}
          >
            <Feather
              name="pocket"
              size={16}
              color={type === "WALLET" ? "#00B37E" : "rgba(232,237,245,0.55)"}
            />
            <Text
              style={[
                styles.typeBtnText,
                type === "WALLET" && { color: "#00B37E" },
              ]}
            >
              Carteira
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>NOME DA INSTITUIÇÃO</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Nubank, Itaú, Dinheiro físico..."
            placeholderTextColor="rgba(232,237,245,0.3)"
            value={institutionName}
            onChangeText={setInstitutionName}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>SALDO ATUAL</Text>
          <View style={styles.amountContainer}>
            <Text style={styles.currencySymbol}>R$</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="0.00"
              placeholderTextColor="rgba(232,237,245,0.3)"
              keyboardType="numeric"
              value={balance}
              onChangeText={setBalance}
            />
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleSave}
          disabled={loading}
        >
          <LinearGradient
            colors={["#00B37E", "#00D496"]}
            style={styles.saveBtn}
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.saveBtnText}>Adicionar Conta</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0D1017" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  typeBtnActive: {
    backgroundColor: "rgba(0,179,126,0.12)",
    borderColor: "#00B37E",
  },
  typeBtnText: {
    fontSize: 14,
    fontFamily: "DMSans_700Bold",
    color: "rgba(232,237,245,0.55)",
  },
  inputGroup: { marginBottom: 24 },
  inputLabel: {
    fontSize: 12,
    color: "rgba(232,237,245,0.55)",
    fontFamily: "DMSans_700Bold",
    marginBottom: 10,
  },
  input: {
    height: 56,
    backgroundColor: "#131820",
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#E8EDF5",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#131820",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 64,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
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
  saveBtn: {
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },
  saveBtnText: { color: "#000", fontSize: 16, fontFamily: "DMSans_700Bold" },
});
