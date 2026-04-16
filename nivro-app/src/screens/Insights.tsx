import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { api } from "../api/api";
import { Feather } from "@expo/vector-icons";

export function Insights() {
  const [loading, setLoading] = useState(true);
  const [expensesByCategory, setExpensesByCategory] = useState<any[]>([]);
  const [totalExpenses, setTotalExpenses] = useState(0);

  useFocusEffect(
    useCallback(() => {
      loadInsights();
    }, []),
  );

  async function loadInsights() {
    try {
      setLoading(true);
      const res = await api.get("/transactions/dashboard");

      const transactions = res.data;
      const expenses = transactions.filter((t: any) => t.type === "EXPENSE");

      let total = 0;
      const categoryMap: any = {};

      expenses.forEach((tx: any) => {
        const amount = Number(tx.amount);
        total += amount;

        // Puxando a Tag que configuramos no banco
        const tag = tx.tags && tx.tags.length > 0 ? tx.tags[0] : null;
        const catName = tag ? tag.name : "Outros";
        const catColor = tag?.color_hex || "#F75A68";

        if (categoryMap[catName]) {
          categoryMap[catName].amount += amount;
        } else {
          categoryMap[catName] = { name: catName, amount, color: catColor };
        }
      });

      const sortedCategories = Object.values(categoryMap).sort(
        (a: any, b: any) => b.amount - a.amount,
      );

      setExpensesByCategory(sortedCategories);
      setTotalExpenses(total);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>Análise</Text>
        <Text style={styles.title}>Gastos por Categoria</Text>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#00B37E"
          style={{ marginTop: 40 }}
        />
      ) : expensesByCategory.length > 0 ? (
        <View style={styles.card}>
          <Text style={styles.totalText}>Despesas Totais</Text>
          <Text style={styles.totalAmount}>
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(totalExpenses)}
          </Text>

          <View style={styles.barsContainer}>
            {expensesByCategory.map((cat, index) => {
              const percentage =
                totalExpenses > 0 ? (cat.amount / totalExpenses) * 100 : 0;

              return (
                <View key={index} style={styles.barWrapper}>
                  <View style={styles.barLabelRow}>
                    <View style={styles.catNameRow}>
                      <View
                        style={[styles.dot, { backgroundColor: cat.color }]}
                      />
                      <Text style={styles.catName}>{cat.name}</Text>
                    </View>
                    <Text style={styles.catAmount}>
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(cat.amount)}
                    </Text>
                  </View>

                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        { width: `${percentage}%`, backgroundColor: cat.color },
                      ]}
                    />
                  </View>
                  <Text style={styles.percentText}>
                    {percentage.toFixed(1)}% do total
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Feather name="pie-chart" size={48} color="rgba(232,237,245,0.2)" />
          <Text style={styles.emptyText}>
            Sem despesas para analisar ainda.
          </Text>
        </View>
      )}
      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#080A0E" },
  content: { paddingTop: 60, paddingHorizontal: 24 },
  header: { marginBottom: 32 },
  greeting: {
    fontSize: 13,
    color: "rgba(232,237,245,0.55)",
    fontFamily: "DMSans_400Regular",
  },
  title: {
    fontSize: 28,
    color: "#E8EDF5",
    fontFamily: "DMSans_700Bold",
    marginTop: 4,
  },
  card: {
    backgroundColor: "rgba(19,24,32,0.95)",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
  },
  totalText: {
    fontSize: 13,
    color: "rgba(232,237,245,0.55)",
    fontFamily: "DMSans_500Medium",
    textTransform: "uppercase",
  },
  totalAmount: {
    fontSize: 32,
    color: "#F75A68",
    fontFamily: "JetBrainsMono_700Bold",
    marginTop: 8,
    marginBottom: 32,
  },
  barsContainer: { gap: 28 },
  barWrapper: {},
  barLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  catNameRow: { flexDirection: "row", alignItems: "center" },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  catName: { fontSize: 14, color: "#E8EDF5", fontFamily: "DMSans_700Bold" },
  catAmount: {
    fontSize: 14,
    color: "#E8EDF5",
    fontFamily: "JetBrainsMono_700Bold",
  },
  barTrack: {
    height: 8,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 4,
    overflow: "hidden",
  },
  barFill: { height: "100%", borderRadius: 4 },
  percentText: {
    fontSize: 11,
    color: "rgba(232,237,245,0.3)",
    fontFamily: "DMSans_400Regular",
    marginTop: 6,
    textAlign: "right",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
    gap: 16,
  },
  emptyText: {
    color: "rgba(232,237,245,0.55)",
    fontFamily: "DMSans_400Regular",
    fontSize: 15,
  },
});
