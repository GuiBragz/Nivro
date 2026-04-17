import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { PieChart } from "react-native-gifted-charts";
import { api } from "../api/api";

export function Investments() {
  const [loading, setLoading] = useState(true);
  const [investments, setInvestments] = useState<any[]>([]);
  const [totalInvested, setTotalInvested] = useState(0);
  const [pieData, setPieData] = useState<any[]>([]);

  const navigation = useNavigation<any>();

  async function loadInvestments() {
    try {
      setLoading(true);
      const response = await api.get("/accounts");
      const investmentAccounts = response.data.filter(
        (acc: any) => acc.type === "INVESTMENT",
      );

      setInvestments(investmentAccounts);

      let total = 0;
      const colors = ["#00B37E", "#3B82F6", "#F7C948", "#8B5CF6", "#F43F5E"];

      const chartData = investmentAccounts.map((acc: any, index: number) => {
        const value = Number(acc.balance);
        total += value;
        return {
          value: value > 0 ? value : 0.1, // Previne erro no gráfico se o saldo for 0
          color: colors[index % colors.length],
          text: acc.institution_name,
        };
      });

      setTotalInvested(total);
      setPieData(chartData);
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

  const renderCenterLabel = () => {
    return (
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Text style={styles.chartCenterLabel}>Carteira</Text>
        <Text style={styles.chartCenterValue}>
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
            maximumFractionDigits: 0,
          }).format(totalInvested)}
        </Text>
      </View>
    );
  };

  if (loading && investments.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Portfólio</Text>
        <Text style={styles.title}>Investimentos</Text>
      </View>

      {/* HERO CARD (GRADIENTE AZUL) */}
      <LinearGradient colors={["#0C1A2E", "#0A1525"]} style={styles.heroCard}>
        <Text style={styles.heroLabel}>Patrimônio Total</Text>
        <Text style={styles.heroTotal}>
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(totalInvested)}
        </Text>
        <Text style={styles.heroReturn}>
          ▲ +R$ 2.847,30 (6,3%) este ano (Simulação)
        </Text>

        <View style={styles.heroActions}>
          <TouchableOpacity style={styles.actionBtnPrimary}>
            <Text style={styles.actionBtnTextPrimary}>Aportar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Text style={styles.actionBtnText}>Resgatar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Text style={styles.actionBtnText}>Extrato</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {investments.length > 0 ? (
        <View>
          {/* GRÁFICO DA CARTEIRA */}
          {totalInvested > 0 && (
            <View style={styles.chartSection}>
              <Text style={styles.sectionTitle}>DIVISÃO DA CARTEIRA</Text>
              <View style={styles.chartContainer}>
                <PieChart
                  data={pieData}
                  donut
                  showGradient
                  sectionAutoFocus
                  radius={90}
                  innerRadius={60}
                  innerCircleColor="#131820"
                  centerLabelComponent={renderCenterLabel}
                />
              </View>
            </View>
          )}

          {/* LISTA DE CARTEIRAS */}
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>Minhas Corretoras</Text>
            <TouchableOpacity onPress={() => navigation.navigate("NewAccount")}>
              <Text style={styles.secLink}>+ Nova Conta</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.portfolioGrid}>
            {investments.map((inv, index) => {
              // Pega a mesma cor que foi pro gráfico
              const colors = [
                "#00B37E",
                "#3B82F6",
                "#F7C948",
                "#8B5CF6",
                "#F43F5E",
              ];
              const itemColor = colors[index % colors.length];

              return (
                <View key={inv.id} style={styles.assetCard}>
                  <View style={styles.assetHeader}>
                    <View
                      style={[
                        styles.assetBadge,
                        { backgroundColor: `${itemColor}20` },
                      ]}
                    >
                      <Feather name="briefcase" size={16} color={itemColor} />
                    </View>
                    <View style={styles.assetChangeTag}>
                      <Text style={styles.assetChangeText}>Sincronizado</Text>
                    </View>
                  </View>

                  <Text style={styles.assetName}>{inv.institution_name}</Text>
                  <Text style={styles.assetType}>Conta de Investimento</Text>

                  <Text style={styles.assetValue}>
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(Number(inv.balance))}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            Você ainda não possui contas de investimento cadastradas.
          </Text>
          <TouchableOpacity
            style={styles.addBrokerButton}
            onPress={() => navigation.navigate("NewAccount")}
          >
            <Feather
              name="plus"
              size={16}
              color="#00B37E"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.addBrokerText}>Conectar Corretora</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={{ height: 120 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#080A0E" },
  centered: {
    flex: 1,
    backgroundColor: "#080A0E",
    justifyContent: "center",
    alignItems: "center",
  },
  content: { paddingTop: 60 },

  // Header
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
    marginTop: 2,
  },

  // Hero Card
  heroCard: {
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(59,130,246,0.2)",
    marginBottom: 24,
  },
  heroLabel: {
    fontSize: 12,
    color: "rgba(59,130,246,0.7)",
    fontFamily: "DMSans_700Bold",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  heroTotal: {
    fontFamily: "JetBrainsMono_700Bold",
    fontSize: 34,
    color: "#FFF",
    marginTop: 8,
    marginBottom: 4,
  },
  heroReturn: {
    fontSize: 13,
    color: "#00B37E",
    fontFamily: "DMSans_500Medium",
  },
  heroActions: { flexDirection: "row", gap: 8, marginTop: 16 },

  actionBtnPrimary: {
    flex: 1,
    height: 36,
    borderRadius: 12,
    backgroundColor: "rgba(59,130,246,0.15)",
    borderWidth: 1,
    borderColor: "rgba(59,130,246,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  actionBtnTextPrimary: {
    color: "#93C5FD",
    fontSize: 12,
    fontFamily: "DMSans_700Bold",
  },
  actionBtn: {
    flex: 1,
    height: 36,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  actionBtnText: {
    color: "rgba(232,237,245,0.55)",
    fontSize: 12,
    fontFamily: "DMSans_700Bold",
  },

  // Gráfico
  sectionTitle: {
    fontSize: 11,
    color: "rgba(232,237,245,0.4)",
    fontFamily: "DMSans_700Bold",
    letterSpacing: 1.5,
    marginBottom: 12,
    marginLeft: 24,
  },
  chartSection: { marginBottom: 24 },
  chartContainer: {
    alignItems: "center",
    backgroundColor: "#131820",
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.03)",
    marginHorizontal: 20,
  },
  chartCenterLabel: {
    color: "rgba(232,237,245,0.55)",
    fontSize: 11,
    fontFamily: "DMSans_500Medium",
    textTransform: "uppercase",
  },
  chartCenterValue: {
    color: "#FFF",
    fontSize: 14,
    fontFamily: "JetBrainsMono_700Bold",
  },

  // List Headers
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 12,
  },
  listTitle: { fontSize: 15, fontFamily: "DMSans_700Bold", color: "#E8EDF5" },
  secLink: { fontSize: 12, color: "#3B82F6", fontFamily: "DMSans_700Bold" },

  // Portfolio Grid
  portfolioGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    gap: 12,
    justifyContent: "space-between",
  },
  assetCard: {
    width: "48%",
    backgroundColor: "rgba(19,24,32,0.95)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
    borderRadius: 18,
    padding: 16,
  },
  assetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  assetBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  assetChangeTag: {
    backgroundColor: "rgba(0,179,126,0.12)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  assetChangeText: {
    color: "#00B37E",
    fontSize: 10,
    fontFamily: "DMSans_700Bold",
  },
  assetName: { fontSize: 13, fontFamily: "DMSans_700Bold", color: "#E8EDF5" },
  assetType: {
    fontSize: 10,
    color: "rgba(232,237,245,0.55)",
    fontFamily: "DMSans_400Regular",
    marginTop: 2,
  },
  assetValue: {
    fontFamily: "JetBrainsMono_700Bold",
    fontSize: 15,
    color: "#FFF",
    marginTop: 8,
  },

  // Empty State
  emptyState: { alignItems: "center", marginTop: 10, paddingHorizontal: 20 },
  emptyText: {
    color: "rgba(232,237,245,0.55)",
    textAlign: "center",
    marginBottom: 16,
    fontFamily: "DMSans_400Regular",
    lineHeight: 20,
  },
  addBrokerButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#00B37E",
    backgroundColor: "rgba(0,179,126,0.05)",
  },
  addBrokerText: {
    color: "#00B37E",
    fontFamily: "DMSans_700Bold",
    fontSize: 14,
  },
});
