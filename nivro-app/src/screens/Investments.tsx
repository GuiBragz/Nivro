import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { api } from "../api/api";

export function Investments() {
  const [loading, setLoading] = useState(true);
  const [investments, setInvestments] = useState<any[]>([]);
  const [totalInvested, setTotalInvested] = useState(0);

  async function loadInvestments() {
    try {
      setLoading(true);
      // Busca todas as contas e filtra apenas as de investimento
      const response = await api.get("/accounts");
      const investmentAccounts = response.data.filter(
        (acc: any) => acc.type === "INVESTMENT",
      );

      setInvestments(investmentAccounts);

      // Soma o saldo de todos os investimentos
      const total = investmentAccounts.reduce(
        (acc: number, curr: any) => acc + Number(curr.balance),
        0,
      );
      setTotalInvested(total);
    } catch (error) {
      console.error("Erro ao carregar investimentos:", error);
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadInvestments();
    }, []),
  );

  if (loading && investments.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#00B37E" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Meus Investimentos</Text>
      </View>

      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Patrimônio Total</Text>
        <Text style={styles.totalAmount}>
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(totalInvested)}
        </Text>
        <View style={styles.yieldTag}>
          <Text style={styles.yieldText}>↗ +2.4% este mês</Text>
        </View>
      </View>

      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Minhas Carteiras</Text>
      </View>

      {investments.length > 0 ? (
        investments.map((inv) => (
          <View key={inv.id} style={styles.investmentItem}>
            <View style={styles.iconPlaceholder}>
              <Text style={styles.iconText}>📈</Text>
            </View>
            <View style={styles.invInfo}>
              <Text style={styles.invName}>{inv.institution_name}</Text>
              <Text style={styles.invType}>Renda Fixa / Variável</Text>
            </View>
            <View style={styles.invValues}>
              <Text style={styles.invBalance}>
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(Number(inv.balance))}
              </Text>
            </View>
          </View>
        ))
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            Você ainda não possui contas de investimento cadastradas.
          </Text>
          <TouchableOpacity style={styles.addBrokerButton}>
            <Text style={styles.addBrokerText}>+ Conectar Corretora</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121214" },
  centered: {
    flex: 1,
    backgroundColor: "#121214",
    justifyContent: "center",
    alignItems: "center",
  },
  content: { padding: 24, paddingTop: 60 },
  header: { marginBottom: 24 },
  title: { color: "#FFF", fontSize: 24, fontWeight: "bold" },

  totalCard: {
    backgroundColor: "#202024",
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#323238",
    marginBottom: 32,
  },
  totalLabel: { color: "#8D8D99", fontSize: 14, marginBottom: 8 },
  totalAmount: { color: "#00B37E", fontSize: 36, fontWeight: "bold" },
  yieldTag: {
    backgroundColor: "rgba(0, 179, 126, 0.1)",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 12,
  },
  yieldText: { color: "#00B37E", fontSize: 12, fontWeight: "bold" },

  listHeader: { marginBottom: 16 },
  listTitle: { color: "#E1E1E6", fontSize: 18, fontWeight: "bold" },

  investmentItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#202024",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  iconPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#29292E",
    justifyContent: "center",
    alignItems: "center",
  },
  iconText: { fontSize: 20 },
  invInfo: { flex: 1, marginLeft: 16 },
  invName: { color: "#E1E1E6", fontSize: 16, fontWeight: "bold" },
  invType: { color: "#8D8D99", fontSize: 12, marginTop: 2 },
  invValues: { alignItems: "flex-end" },
  invBalance: { color: "#FFF", fontSize: 16, fontWeight: "bold" },

  emptyState: { alignItems: "center", marginTop: 32 },
  emptyText: { color: "#8D8D99", textAlign: "center", marginBottom: 16 },
  addBrokerButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#00B37E",
  },
  addBrokerText: { color: "#00B37E", fontWeight: "bold" },
});
