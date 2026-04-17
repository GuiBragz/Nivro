import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { PieChart } from "react-native-gifted-charts"; // 👈 O Gráfico!
import { api } from "../api/api";
import { Feather } from "@expo/vector-icons";

export function Insights() {
  const [loading, setLoading] = useState(true);
  const [expensesByCategory, setExpensesByCategory] = useState<any[]>([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [pieData, setPieData] = useState<any[]>([]);
  const [biggestExpense, setBiggestExpense] = useState<any>(null);

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

        const tag = tx.tags && tx.tags.length > 0 ? tx.tags[0] : null;
        const catName = tag ? tag.name : "Outros";
        const catColor = tag?.color_hex || "#F75A68";

        if (categoryMap[catName]) {
          categoryMap[catName].amount += amount;
        } else {
          categoryMap[catName] = { name: catName, amount, color: catColor };
        }
      });

      // Ordena do maior pro menor
      const sortedCategories = Object.values(categoryMap).sort(
        (a: any, b: any) => b.amount - a.amount,
      );

      // Formata os dados pro Gráfico ler
      const chartData = sortedCategories.map((cat: any) => ({
        value: cat.amount,
        color: cat.color,
        text: cat.name,
      }));

      setExpensesByCategory(sortedCategories);
      setTotalExpenses(total);
      setPieData(chartData);

      // Pega o maior gasto para exibir na Análise
      if (sortedCategories.length > 0) {
        setBiggestExpense(sortedCategories[0]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  // Renderiza o centro do Gráfico Donut
  const renderCenterLabel = () => {
    return (
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Text style={styles.chartCenterLabel}>Total</Text>
        <Text style={styles.chartCenterValue}>
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
            maximumFractionDigits: 0, // Tira os centavos pra caber no meio
          }).format(totalExpenses)}
        </Text>
      </View>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>Análise Avançada</Text>
        <Text style={styles.title}>Para onde foi o dinheiro?</Text>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#00B37E"
          style={{ marginTop: 40 }}
        />
      ) : expensesByCategory.length > 0 ? (
        <View>
          {/* --- O GRÁFICO DE DONUT --- */}
          <View style={styles.chartCard}>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                marginVertical: 10,
              }}
            >
              <PieChart
                data={pieData}
                donut
                showGradient
                sectionAutoFocus
                radius={110}
                innerRadius={75}
                innerCircleColor="#131820"
                centerLabelComponent={renderCenterLabel}
                shadow
                shadowColor="rgba(0,0,0,0.5)"
                shadowRadius={10}
              />
            </View>
          </View>

          {/* --- ANÁLISE INTELIGENTE (HIGHLIGHT) --- */}
          {biggestExpense && (
            <View style={styles.highlightCard}>
              <View style={styles.highlightIcon}>
                <Feather name="alert-circle" size={24} color="#F7C948" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.highlightTitle}>Atenção aos gastos!</Text>
                <Text style={styles.highlightText}>
                  Sua maior despesa este mês foi com{" "}
                  <Text
                    style={{
                      fontFamily: "DMSans_700Bold",
                      color: biggestExpense.color,
                    }}
                  >
                    {biggestExpense.name}
                  </Text>
                  , representando{" "}
                  <Text
                    style={{
                      fontFamily: "JetBrainsMono_700Bold",
                      color: "#FFF",
                    }}
                  >
                    {((biggestExpense.amount / totalExpenses) * 100).toFixed(0)}
                    %
                  </Text>{" "}
                  do seu orçamento.
                </Text>
              </View>
            </View>
          )}

          {/* --- DETALHAMENTO (BARRAS) --- */}
          <View style={styles.detailsHeader}>
            <Text style={styles.detailsTitle}>Detalhamento</Text>
          </View>

          <View style={styles.card}>
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
                      <View style={{ alignItems: "flex-end" }}>
                        <Text style={styles.catAmount}>
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(cat.amount)}
                        </Text>
                        <Text style={styles.percentText}>
                          {percentage.toFixed(1)}%
                        </Text>
                      </View>
                    </View>

                    <View style={styles.barTrack}>
                      <View
                        style={[
                          styles.barFill,
                          {
                            width: `${percentage}%`,
                            backgroundColor: cat.color,
                          },
                        ]}
                      />
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Feather name="pie-chart" size={48} color="rgba(232,237,245,0.2)" />
          <Text style={styles.emptyText}>
            Sem despesas para analisar ainda.
          </Text>
          <Text style={styles.emptySubtext}>
            Registre novos gastos para gerar o gráfico.
          </Text>
        </View>
      )}
      <View style={{ height: 120 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#080A0E" },
  content: { paddingTop: 60, paddingHorizontal: 24 },
  header: { marginBottom: 24 },
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
    letterSpacing: -0.5,
  },

  // Gráfico
  chartCard: {
    backgroundColor: "#131820",
    borderRadius: 24,
    paddingVertical: 32,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    marginBottom: 16,
    alignItems: "center",
  },
  chartCenterLabel: {
    color: "rgba(232,237,245,0.55)",
    fontSize: 13,
    fontFamily: "DMSans_500Medium",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  chartCenterValue: {
    color: "#FFF",
    fontSize: 22,
    fontFamily: "JetBrainsMono_700Bold",
  },

  // Alerta Inteligente
  highlightCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(247, 201, 72, 0.08)",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(247, 201, 72, 0.2)",
    marginBottom: 32,
  },
  highlightIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(247, 201, 72, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  highlightTitle: {
    color: "#F7C948",
    fontSize: 14,
    fontFamily: "DMSans_700Bold",
    marginBottom: 4,
  },
  highlightText: {
    color: "rgba(232,237,245,0.8)",
    fontSize: 13,
    fontFamily: "DMSans_400Regular",
    lineHeight: 20,
  },

  // Detalhamento
  detailsHeader: { marginBottom: 16, marginLeft: 8 },
  detailsTitle: {
    fontSize: 16,
    color: "#E8EDF5",
    fontFamily: "DMSans_700Bold",
  },
  card: {
    backgroundColor: "rgba(19,24,32,0.95)",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
  },
  barsContainer: { gap: 24 },
  barWrapper: {},
  barLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  catNameRow: { flexDirection: "row", alignItems: "center" },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 10 },
  catName: { fontSize: 15, color: "#E8EDF5", fontFamily: "DMSans_500Medium" },
  catAmount: {
    fontSize: 15,
    color: "#FFF",
    fontFamily: "JetBrainsMono_700Bold",
  },
  percentText: {
    fontSize: 11,
    color: "rgba(232,237,245,0.4)",
    fontFamily: "DMSans_700Bold",
    marginTop: 2,
    textAlign: "right",
  },
  barTrack: {
    height: 8,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 4,
    overflow: "hidden",
  },
  barFill: { height: "100%", borderRadius: 4 },

  // Empty State
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 80,
    gap: 16,
  },
  emptyText: { color: "#E8EDF5", fontFamily: "DMSans_700Bold", fontSize: 16 },
  emptySubtext: {
    color: "rgba(232,237,245,0.55)",
    fontFamily: "DMSans_400Regular",
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 40,
  },
});
