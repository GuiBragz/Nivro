import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Alert,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { api } from "../api/api";

export function Transactions() {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "INCOME" | "EXPENSE">(
    "ALL",
  );

  async function loadTransactions() {
    try {
      setLoading(true);
      const response = await api.get("/transactions/dashboard");
      setTransactions(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, []),
  );

  async function handleDelete(id: string) {
    try {
      await api.delete(`/transactions/${id}`);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      Alert.alert("Sucesso", "Transação excluída!");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível excluir a transação.");
    }
  }

  function handleOptions(transaction: any) {
    Alert.alert("Opções da Transação", transaction.description, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Editar",
        onPress: () => navigation.navigate("New", { transaction }),
      },
      {
        text: "Excluir",
        style: "destructive",
        onPress: () => {
          Alert.alert("Tem certeza?", "Essa ação não pode ser desfeita.", [
            { text: "Não", style: "cancel" },
            {
              text: "Sim, excluir",
              onPress: () => handleDelete(transaction.id),
            },
          ]);
        },
      },
    ]);
  }

  const filteredTransactions = transactions.filter((t) => {
    const matchesType = filterType === "ALL" ? true : t.type === filterType;
    const matchesSearch = t.description
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View>
            <Text style={styles.greeting}>Histórico</Text>
            <Text style={styles.title}>Transações</Text>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <Feather
            name="search"
            size={20}
            color="rgba(232,237,245,0.3)"
            style={{ marginRight: 10 }}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar transação..."
            placeholderTextColor="rgba(232,237,245,0.3)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Feather
                name="x-circle"
                size={18}
                color="rgba(232,237,245,0.55)"
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          <TouchableOpacity
            style={[
              styles.filterChip,
              filterType === "ALL" && styles.filterActive,
            ]}
            onPress={() => setFilterType("ALL")}
          >
            <Text
              style={[
                styles.filterText,
                filterType === "ALL" && { color: "#000" },
              ]}
            >
              Todos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterChip,
              filterType === "INCOME" && styles.filterActive,
            ]}
            onPress={() => setFilterType("INCOME")}
          >
            <Text
              style={[
                styles.filterText,
                filterType === "INCOME" && { color: "#000" },
              ]}
            >
              Receitas
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterChip,
              filterType === "EXPENSE" && styles.filterActive,
            ]}
            onPress={() => setFilterType("EXPENSE")}
          >
            <Text
              style={[
                styles.filterText,
                filterType === "EXPENSE" && { color: "#000" },
              ]}
            >
              Despesas
            </Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.filterChipOutlined}
            onPress={() => navigation.navigate("NewCategory")}
          >
            <Feather
              name="tag"
              size={12}
              color="#00B37E"
              style={{ marginRight: 4 }}
            />
            <Text style={[styles.filterText, { color: "#00B37E" }]}>
              Categorias
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#00B37E"
          style={{ marginTop: 40 }}
        />
      ) : (
        <ScrollView
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        >
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((item) => {
              // 👇 AJUSTE AQUI: Pegando a Tag do banco em vez do antigo 'category'
              const tag =
                item.tags && item.tags.length > 0 ? item.tags[0] : null;
              const tagName = tag ? tag.name : "Geral";
              const tagColor = tag?.color_hex || "rgba(232,237,245,0.55)";

              return (
                <View key={item.id} style={styles.txItem}>
                  <View style={styles.txIcon}>
                    <Feather
                      name={
                        item.type === "INCOME"
                          ? "arrow-up-right"
                          : "arrow-down-left"
                      }
                      size={20}
                      color={item.type === "INCOME" ? "#00B37E" : "#F75A68"}
                    />
                  </View>

                  <View style={styles.txInfo}>
                    <Text style={styles.txName}>{item.description}</Text>
                    {/* 👇 BOLINHA COLORIDA ADICIONADA AQUI 👇 */}
                    <View style={styles.tagRow}>
                      <View
                        style={[styles.colorDot, { backgroundColor: tagColor }]}
                      />
                      <Text style={styles.txCat}>{tagName}</Text>
                    </View>
                  </View>

                  <View style={{ alignItems: "flex-end" }}>
                    <Text
                      style={[
                        styles.txAmount,
                        item.type === "INCOME"
                          ? { color: "#00B37E" }
                          : { color: "#F75A68" },
                      ]}
                    >
                      {item.type === "INCOME" ? "+" : "-"}
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(Number(item.amount))}
                    </Text>
                    <Text style={styles.txTime}>
                      {new Date(item.executed_at).toLocaleDateString("pt-BR")}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.moreBtn}
                    onPress={() => handleOptions(item)}
                  >
                    <Feather
                      name="more-vertical"
                      size={20}
                      color="rgba(232,237,245,0.55)"
                    />
                  </TouchableOpacity>
                </View>
              );
            })
          ) : (
            <Text style={styles.emptyText}>Nenhuma transação encontrada.</Text>
          )}
          <View style={{ height: 120 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#080A0E", paddingTop: 60 },
  header: { paddingHorizontal: 24, paddingBottom: 16 },
  greeting: {
    fontSize: 13,
    color: "rgba(232,237,245,0.55)",
    fontFamily: "DMSans_400Regular",
  },
  title: {
    fontSize: 22,
    color: "#E8EDF5",
    fontFamily: "DMSans_700Bold",
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#131820",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 50,
  },
  searchInput: {
    flex: 1,
    color: "#E8EDF5",
    fontFamily: "DMSans_400Regular",
    fontSize: 15,
  },
  filterContainer: { marginBottom: 16 },
  filterScroll: { gap: 8, paddingHorizontal: 20, alignItems: "center" },
  filterChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
  },
  filterActive: { backgroundColor: "#00B37E", borderColor: "#00B37E" },
  filterText: {
    color: "rgba(232,237,245,0.55)",
    fontFamily: "DMSans_700Bold",
    fontSize: 12,
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
    marginHorizontal: 4,
  },
  filterChipOutlined: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(0,179,126,0.3)",
    backgroundColor: "rgba(0,179,126,0.05)",
  },
  list: { paddingHorizontal: 20, gap: 10 },
  txItem: {
    backgroundColor: "rgba(19,24,32,0.95)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  txIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.03)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  txInfo: { flex: 1 },
  txName: { fontSize: 14, fontFamily: "DMSans_700Bold", color: "#E8EDF5" },

  // Tag com bolinha colorida
  tagRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  colorDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  txCat: {
    fontSize: 11,
    color: "rgba(232,237,245,0.55)",
    fontFamily: "DMSans_400Regular",
  },

  txAmount: { fontFamily: "JetBrainsMono_700Bold", fontSize: 14 },
  txTime: {
    fontSize: 10,
    color: "rgba(232,237,245,0.3)",
    fontFamily: "DMSans_400Regular",
    marginTop: 4,
    textAlign: "right",
  },
  moreBtn: { marginLeft: 12, padding: 4 },
  emptyText: {
    color: "rgba(232,237,245,0.55)",
    textAlign: "center",
    fontFamily: "DMSans_400Regular",
    padding: 20,
  },
});
