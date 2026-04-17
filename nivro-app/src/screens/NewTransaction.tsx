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
import {
  useNavigation,
  useRoute,
  useIsFocused,
} from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { api } from "../api/api";

export function NewTransaction() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const isFocused = useIsFocused();

  const editingTransaction = route.params?.transaction;

  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [importing, setImporting] = useState(false);

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
    editingTransaction?.tags?.[0]?.id || null,
  );

  const [accounts, setAccounts] = useState<any[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState(
    editingTransaction?.account_id || null,
  );

  async function loadData() {
    try {
      setDataLoading(true);

      const [tagsResponse, accountsResponse] = await Promise.all([
        api.get("/transactions/tags"),
        api.get("/accounts"),
      ]);

      setCategories(tagsResponse.data);
      setAccounts(accountsResponse.data);

      if (
        !editingTransaction &&
        tagsResponse.data.length > 0 &&
        !selectedCategoryId
      ) {
        setSelectedCategoryId(tagsResponse.data[0].id);
      }

      if (
        !editingTransaction &&
        accountsResponse.data.length > 0 &&
        !selectedAccountId
      ) {
        setSelectedAccountId(accountsResponse.data[0].id);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setDataLoading(false);
    }
  }

  useEffect(() => {
    if (isFocused) {
      loadData();
    }
  }, [isFocused]);

  async function handleSave() {
    if (!description || !amount || !selectedCategoryId || !selectedAccountId) {
      return Alert.alert(
        "Ops",
        "Preencha todos os campos, selecione uma conta e uma categoria.",
      );
    }

    try {
      setLoading(true);

      const payload = {
        description,
        amount: Number(amount.replace(",", ".")),
        type,
        account_id: selectedAccountId,
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

  async function handleImportCsv() {
    if (!selectedAccountId) {
      return Alert.alert(
        "Ops",
        "Selecione uma conta bancária antes de importar o extrato.",
      );
    }

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["text/csv", "application/vnd.ms-excel"],
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const file = result.assets[0];
      setImporting(true);

      const formData = new FormData();
      formData.append("account_id", selectedAccountId);
      formData.append("file", {
        uri: file.uri,
        name: file.name,
        type: file.mimeType || "text/csv",
      } as any);

      const response = await api.post("/transactions/import", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      Alert.alert(
        "Sucesso!",
        `${response.data.total_imported} transações importadas com sucesso.`,
      );
      navigation.goBack();
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error.response?.data?.message ||
          "Não foi possível processar o arquivo.",
      );
    } finally {
      setImporting(false);
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
          <Text style={styles.inputLabel}>CONTA BANCÁRIA</Text>
          {dataLoading ? (
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
              {accounts.map((acc) => {
                const isSelected = selectedAccountId === acc.id;
                return (
                  <TouchableOpacity
                    key={acc.id}
                    style={[
                      styles.catChip,
                      isSelected && {
                        backgroundColor: "rgba(0,179,126,0.1)",
                        borderColor: "#00B37E",
                      },
                    ]}
                    onPress={() => setSelectedAccountId(acc.id)}
                  >
                    <Text
                      style={[
                        styles.catText,
                        isSelected && { color: "#00B37E" },
                      ]}
                    >
                      {acc.institution_name}
                    </Text>
                  </TouchableOpacity>
                );
              })}

              <TouchableOpacity
                style={[
                  styles.catChip,
                  {
                    borderStyle: "dashed",
                    borderColor: "rgba(232,237,245,0.3)",
                    backgroundColor: "transparent",
                  },
                ]}
                onPress={() => navigation.navigate("NewAccount")}
              >
                <Text style={styles.catText}>+ Nova</Text>
              </TouchableOpacity>
            </ScrollView>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>CATEGORIA</Text>
          {dataLoading ? (
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
              {categories.map((cat) => {
                const isSelected = selectedCategoryId === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.catChip,
                      isSelected && {
                        backgroundColor: cat.color_hex,
                        borderColor: cat.color_hex,
                      },
                    ]}
                    onPress={() => setSelectedCategoryId(cat.id)}
                  >
                    <Text
                      style={[styles.catText, isSelected && { color: "#000" }]}
                    >
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}

              <TouchableOpacity
                style={[
                  styles.catChip,
                  {
                    borderStyle: "dashed",
                    borderColor: "#00B37E",
                    backgroundColor: "transparent",
                  },
                ]}
                onPress={() => navigation.navigate("NewCategory")}
              >
                <Text style={[styles.catText, { color: "#00B37E" }]}>
                  + Nova
                </Text>
              </TouchableOpacity>
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
          disabled={loading || dataLoading || importing}
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

        {!editingTransaction && (
          <TouchableOpacity
            style={styles.importBtn}
            onPress={handleImportCsv}
            disabled={importing || loading || dataLoading}
          >
            {importing ? (
              <ActivityIndicator color="#3B82F6" size="small" />
            ) : (
              <>
                <Feather name="upload" size={18} color="#3B82F6" />
                <Text style={styles.importBtnText}>Importar extrato CSV</Text>
              </>
            )}
          </TouchableOpacity>
        )}
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
  importBtn: {
    flexDirection: "row",
    height: 56,
    borderRadius: 16,
    backgroundColor: "rgba(59,130,246,0.1)",
    borderWidth: 1,
    borderColor: "rgba(59,130,246,0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    gap: 8,
  },
  importBtnText: {
    color: "#3B82F6",
    fontSize: 16,
    fontFamily: "DMSans_700Bold",
  },
});
