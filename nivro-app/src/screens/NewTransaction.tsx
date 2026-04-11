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

export function NewTransaction() {
  const navigation = useNavigation();
  const [type, setType] = useState<"INCOME" | "EXPENSE">("EXPENSE");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  async function handleSave() {
    if (!description || !amount) {
      return Alert.alert("Ops", "Preencha a descrição e o valor.");
    }

    try {
      // No mundo real, aqui buscaríamos o ID da conta padrão do usuário
      // Para o teste, vamos assumir que ele tem uma conta (usando a lógica do back)
      const accounts = await api.get("/accounts");
      if (accounts.data.length === 0) {
        return Alert.alert(
          "Erro",
          "Você precisa cadastrar uma conta bancária primeiro.",
        );
      }

      await api.post("/transactions", {
        description,
        amount: Number(amount.replace(",", ".")),
        type,
        account_id: accounts.data[0].id, // Pega a primeira conta
        executed_at: new Date().toISOString(),
      });

      Alert.alert("Sucesso", "Transação registrada!");
      navigation.goBack(); // Volta para a Home
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível salvar a transação.");
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>Cancelar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Nova Transação</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.typeContainer}>
        <TouchableOpacity
          style={[styles.typeButton, type === "INCOME" && styles.incomeActive]}
          onPress={() => setType("INCOME")}
        >
          <Text
            style={[styles.typeText, type === "INCOME" && { color: "#FFF" }]}
          >
            Receita
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.typeButton,
            type === "EXPENSE" && styles.expenseActive,
          ]}
          onPress={() => setType("EXPENSE")}
        >
          <Text
            style={[styles.typeText, type === "EXPENSE" && { color: "#FFF" }]}
          >
            Despesa
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Quanto?</Text>
        <TextInput
          style={styles.amountInput}
          placeholder="R$ 0,00"
          placeholderTextColor="#8D8D99"
          keyboardType="numeric"
          onChangeText={setAmount}
        />

        <Text style={styles.label}>O que é?</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Aluguel, Salário, Lanche..."
          placeholderTextColor="#8D8D99"
          onChangeText={setDescription}
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Salvar Transação</Text>
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
  typeContainer: {
    flexDirection: "row",
    padding: 24,
    gap: 12,
  },
  typeButton: {
    flex: 1,
    height: 50,
    borderRadius: 8,
    backgroundColor: "#29292E",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#323238",
  },
  typeText: { color: "#8D8D99", fontWeight: "bold" },
  incomeActive: { backgroundColor: "#00B37E", borderColor: "#00B37E" },
  expenseActive: { backgroundColor: "#F75A68", borderColor: "#F75A68" },
  form: { padding: 24 },
  label: { color: "#8D8D99", marginBottom: 8, fontSize: 14 },
  amountInput: {
    color: "#FFF",
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 24,
  },
  input: {
    backgroundColor: "#202024",
    color: "#FFF",
    padding: 16,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 24,
  },
  saveButton: {
    backgroundColor: "#00B37E",
    height: 56,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
});
