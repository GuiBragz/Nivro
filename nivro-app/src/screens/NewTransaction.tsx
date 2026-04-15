import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { api } from "../api/api";

export function NewTransaction() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>(); // Usamos any para evitar erro de tipagem no params

  const editingTransaction = route.params?.transaction;

  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [type, setType] = useState<"INCOME" | "EXPENSE">(
    editingTransaction?.type || "EXPENSE",
  );
  const [description, setDescription] = useState(
    editingTransaction?.description || "",
  );
  const [amount, setAmount] = useState(
    editingTransaction?.amount?.toString() || "",
  );

  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    editingTransaction?.category_id || null,
  );

  async function loadCategories() {
    try {
      setCategoriesLoading(true);
      const response = await api.get("/categories");
      setCategories(response.data);

      if (!editingTransaction && response.data.length > 0) {
        setSelectedCategoryId(response.data[0].id);
      }
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
    } finally {
      setCategoriesLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  async function handleSave() {
    if (!description || !amount || !selectedCategoryId) {
      return Alert.alert(
        "Ops",
        "Preencha todos os campos e selecione uma categoria.",
      );
    }

    try {
      setLoading(true);
      const accounts = await api.get("/accounts");
      if (accounts.data.length === 0) {
        setLoading(false);
        return Alert.alert("Erro", "Cadastre uma conta bancária primeiro.");
      }

      const payload = {
        description,
        amount: Number(amount.replace(",", ".")),
        type,
        account_id: accounts.data[0].id,
        category_id: selectedCategoryId,
        executed_at: new Date().toISOString(),
      };

      if (editingTransaction) {
        await api.put(`/transactions/${editingTransaction.id}`, payload);
        Alert.alert("Sucesso", "Transação atualizada!");
      } else {
        await api.post("/transactions", payload);
      }

      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível salvar.");
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
        <Text style={styles.title}>
          {editingTransaction ? "Editar" : "Nova"} Transação
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.form}>
        <View style={styles.typeToggle}>
          <TouchableOpacity
            style={[styles.typeBtn, type === "INCOME" && styles.typeBtnInc]}
            onPress={() => setType("INCOME")}
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

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>CATEGORIA</Text>
          {categoriesLoading ? (
            <ActivityIndicator
              color="#00B37E"
              style={{ alignSelf: "flex-start" }}
            />
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8 }}
            >
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.catChip,
                    selectedCategoryId === cat.id && styles.catChipActive,
                  ]}
                  onPress={() => setSelectedCategoryId(cat.id)}
                >
                  <Text
                    style={[
                      styles.catText,
                      selectedCategoryId === cat.id && { color: "#000" },
                    ]}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

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

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>DESCRIÇÃO</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Almoço, Salário..."
            placeholderTextColor="rgba(232,237,245,0.3)"
            value={description}
            onChangeText={setDescription}
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleSave}
          disabled={loading || categoriesLoading}
        >
          <LinearGradient
            colors={["#00B37E", "#00D496"]}
            style={styles.saveBtn}
          >
            <Text style={styles.saveBtnText}>
              {loading
                ? "Processando..."
                : editingTransaction
                  ? "Salvar Alterações"
                  : "Confirmar Transação"}
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
  typeBtnInc: {
    backgroundColor: "rgba(0,179,126,0.12)",
    borderColor: "#00B37E",
  },
  typeBtnExp: {
    backgroundColor: "rgba(247,90,104,0.12)",
    borderColor: "#F75A68",
  },
  typeBtnText: { fontSize: 14, fontFamily: "DMSans_700Bold" },
  inputGroup: { marginBottom: 24 },
  inputLabel: {
    fontSize: 12,
    color: "rgba(232,237,245,0.55)",
    fontFamily: "DMSans_700Bold",
    marginBottom: 10,
  },
  catChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  catChipActive: { backgroundColor: "#00B37E", borderColor: "#00B37E" },
  catText: {
    color: "rgba(232,237,245,0.55)",
    fontSize: 12,
    fontFamily: "DMSans_700Bold",
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#131820",
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
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#E8EDF5",
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
