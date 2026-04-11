import React, { useState, useCallback } from "react"; // 👈 1. Importamos o useCallback
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native"; // 👈 2. Importamos o useFocusEffect
import { api } from "../api/api";
import { BalanceCard } from "../components/BalanceCard";
import { TransactionItem } from "../components/TransactionItem";

export function Home() {
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);

  async function loadHomeData() {
    try {
      setLoading(true); // Garante que mostre o loading ao recarregar
      const [accRes, txRes] = await Promise.all([
        api.get("/accounts"),
        api.get("/transactions/dashboard"),
      ]);

      if (accRes.data.length > 0) setAccount(accRes.data[0]);
      setTransactions(txRes.data);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  }

  // 👇 3. TROCAMOS O useEffect POR ISSO AQUI 👇
  useFocusEffect(
    useCallback(() => {
      loadHomeData();
    }, []),
  );

  if (loading && !account) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#00B37E" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>Olá, Guilherme</Text>
        <Text style={styles.subtitle}>Bom ver você de novo!</Text>
      </View>

      {account && (
        <BalanceCard
          amount={Number(account.balance)}
          institution={account.institution_name}
        />
      )}

      <View style={styles.transactionsHeader}>
        <Text style={styles.title}>Transações recentes</Text>
        <Text style={styles.seeMore}>Ver todas</Text>
      </View>

      {transactions.length > 0 ? (
        transactions.map((item) => (
          <TransactionItem
            key={item.id}
            description={item.description}
            category={item.category?.name || "Geral"}
            amount={item.amount}
            type={item.type}
            date={item.executed_at}
          />
        ))
      ) : (
        <Text style={styles.emptyText}>
          Nenhuma transação registrada ainda.
        </Text>
      )}

      {/* Margem final para não cobrir a barra de navegação */}
      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121214" },
  content: { padding: 24, paddingTop: 60 },
  header: { marginBottom: 10 },
  greeting: { color: "#FFF", fontSize: 24, fontWeight: "bold" },
  subtitle: { color: "#8D8D99", fontSize: 14 },
  transactionsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 20,
  },
  title: { color: "#E1E1E6", fontSize: 18, fontWeight: "bold" },
  seeMore: { color: "#00B37E", fontSize: 14 },
  emptyText: { color: "#8D8D99", textAlign: "center", marginTop: 20 },
});
