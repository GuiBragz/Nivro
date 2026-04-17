import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { api } from "../api/api";
import { useAuth } from "../contexts/AuthContext";

export function Home() {
  const { user, hideBalances, notifications } = useAuth();
  const [loading, setLoading] = useState(true);
  const [totalBalance, setTotalBalance] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const navigation = useNavigation<any>();

  const hasUnreadNotif = notifications?.some((n: any) => !n.read);

  async function loadHomeData() {
    try {
      setLoading(true);
      const [balanceRes, txRes] = await Promise.all([
        api.get("/accounts/balance"),
        api.get("/transactions/dashboard"),
      ]);

      setTotalBalance(balanceRes.data.totalBalance);
      setTransactions(txRes.data);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadHomeData();
    }, []),
  );

  const incomeTotal = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const expenseTotal = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const poupancaTotal = incomeTotal - expenseTotal;
  const taxaPoupanca =
    incomeTotal > 0 ? Math.round((poupancaTotal / incomeTotal) * 100) : 0;

  const currentHour = new Date().getHours();
  let greetingTime = "Boa noite";
  if (currentHour < 12) greetingTime = "Bom dia";
  else if (currentHour < 18) greetingTime = "Boa tarde";

  const fullName =
    user?.profile?.full_name ||
    user?.full_name ||
    user?.email?.split("@")[0] ||
    "Usuário";
  const firstName = fullName.split(" ")[0];
  const userInitial = firstName.charAt(0).toUpperCase();
  const avatarUrl = user?.profile?.avatar_url || user?.avatar_url;

  if (loading && transactions.length === 0) {
    return (
      <View style={styles.centered}>
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
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.greeting}>{greetingTime} 👋</Text>
          <Text style={styles.greetingName}>{firstName}</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.notifBtn}
            onPress={() => navigation.navigate("Notifications")}
          >
            <Feather name="bell" size={18} color="#E8EDF5" />
            {hasUnreadNotif && <View style={styles.notifDot} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.avatar}
            onPress={() => navigation.navigate("Profile")}
          >
            {avatarUrl ? (
              <Image
                source={{ uri: `${avatarUrl}?t=${new Date().getTime()}` }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
              />
            ) : (
              <Text style={styles.avatarText}>{userInitial}</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <LinearGradient
        colors={["#0D2A1F", "#0A1F18", "#081510"]}
        style={styles.balanceCard}
      >
        <Text style={styles.balLabel}>Saldo total</Text>
        <Text style={styles.balAmount}>
          {hideBalances
            ? "R$ •••••"
            : new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(totalBalance)}
        </Text>

        <Text
          style={[
            styles.balChange,
            { color: poupancaTotal >= 0 ? "#00B37E" : "#F75A68" },
          ]}
        >
          {poupancaTotal >= 0 ? "▲" : "▼"}
          {poupancaTotal >= 0 ? " +" : " "}
          {hideBalances
            ? "•••••"
            : new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(poupancaTotal)}{" "}
          este mês
        </Text>

        <View style={styles.balActions}>
          <TouchableOpacity
            style={styles.balBtn}
            onPress={() => navigation.navigate("New")}
          >
            <Feather name="arrow-up" size={14} color="#E8EDF5" />
            <Text style={styles.balBtnText}>Receita</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.balBtn}
            onPress={() => navigation.navigate("New")}
          >
            <Feather name="arrow-down" size={14} color="#E8EDF5" />
            <Text style={styles.balBtnText}>Despesa</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.balBtn, styles.balBtnPrimary]}
            onPress={() => navigation.navigate("NewAccount")}
          >
            <Feather name="plus-circle" size={14} color="#000" />
            <Text style={[styles.balBtnText, { color: "#000" }]}>
              Nova Conta
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.quickStats}>
        <View style={styles.statCard}>
          <View
            style={[
              styles.statIcon,
              { backgroundColor: "rgba(0,179,126,0.12)" },
            ]}
          >
            <Feather name="arrow-up" size={16} color="#00B37E" />
          </View>
          <Text style={[styles.statVal, { color: "#00B37E" }]}>
            {hideBalances
              ? "•••••"
              : new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(incomeTotal)}
          </Text>
          <Text style={styles.statLbl}>Receitas / mês</Text>
        </View>
        <View style={styles.statCard}>
          <View
            style={[
              styles.statIcon,
              { backgroundColor: "rgba(247,90,104,0.12)" },
            ]}
          >
            <Feather name="arrow-down" size={16} color="#F75A68" />
          </View>
          <Text style={[styles.statVal, { color: "#F75A68" }]}>
            {hideBalances
              ? "•••••"
              : new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(expenseTotal)}
          </Text>
          <Text style={styles.statLbl}>Despesas / mês</Text>
        </View>
      </View>

      <View style={styles.secHeader}>
        <Text style={styles.secTitle}>Últimas Transações</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Transactions")}>
          <Text style={styles.secLink}>Ver todas</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.txList}>
        {transactions.length > 0 ? (
          transactions.slice(0, 5).map((item) => {
            const tag = item.tags && item.tags.length > 0 ? item.tags[0] : null;
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

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 2,
                    }}
                  >
                    <View
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: tagColor,
                        marginRight: 6,
                      }}
                    />
                    <Text style={styles.txCat}>{tagName}</Text>
                  </View>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text
                    style={[
                      styles.txAmount,
                      item.type === "INCOME" ? styles.textInc : styles.textExp,
                    ]}
                  >
                    {item.type === "INCOME" ? "+" : "-"}
                    {hideBalances
                      ? "•••••"
                      : new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(Number(item.amount))}
                  </Text>
                  <Text style={styles.txTime}>
                    {new Date(item.executed_at).toLocaleDateString("pt-BR")}
                  </Text>
                </View>
              </View>
            );
          })
        ) : (
          <Text style={styles.emptyText}>
            Nenhuma transação registrada ainda.
          </Text>
        )}
      </View>

      <TouchableOpacity
        style={{ marginHorizontal: 20, marginTop: 24, marginBottom: 8 }}
        onPress={() => navigation.navigate("Investments")}
      >
        <LinearGradient
          colors={["rgba(59,130,246,0.15)", "rgba(10,21,37,0.8)"]}
          style={{
            padding: 20,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: "rgba(59,130,246,0.3)",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: "rgba(59,130,246,0.2)",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 16,
            }}
          >
            <Feather name="trending-up" size={20} color="#3B82F6" />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 15,
                color: "#FFF",
                fontFamily: "DMSans_700Bold",
                marginBottom: 2,
              }}
            >
              Meu Portfólio
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: "rgba(232,237,245,0.55)",
                fontFamily: "DMSans_400Regular",
              }}
            >
              Acompanhe seus investimentos
            </Text>
          </View>
          <Feather
            name="chevron-right"
            size={20}
            color="rgba(59,130,246,0.5)"
          />
        </LinearGradient>
      </TouchableOpacity>

      <View style={[styles.secHeader, { marginTop: 8 }]}>
        <Text style={styles.secTitle}>Saúde Financeira</Text>
      </View>
      <View style={styles.scoreRow}>
        <View style={styles.scoreCard}>
          <Text
            style={[
              styles.scoreNum,
              { color: taxaPoupanca > 0 ? "#00B37E" : "#F75A68", fontSize: 16 },
            ]}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {taxaPoupanca > 20 ? "Ótimo" : taxaPoupanca > 0 ? "Bom" : "Alerta"}
          </Text>
          <Text style={styles.scoreLbl} numberOfLines={1}>
            Status
          </Text>
        </View>

        <View style={styles.scoreCard}>
          <Text
            style={[styles.scoreNum, { color: "#F7C948", fontSize: 14 }]}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {poupancaTotal > 0 ? "+" : ""}
            {hideBalances
              ? "•••••"
              : new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(poupancaTotal)}
          </Text>
          <Text style={styles.scoreLbl} numberOfLines={1}>
            Poupança
          </Text>
        </View>

        <View style={styles.scoreCard}>
          <Text
            style={[styles.scoreNum, { color: "#3B82F6", fontSize: 18 }]}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {taxaPoupanca}%
          </Text>
          <Text style={styles.scoreLbl} numberOfLines={1}>
            Taxa
          </Text>
        </View>
      </View>

      <View style={{ height: 120 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#080A0E" },
  content: { paddingTop: 60 },
  centered: {
    flex: 1,
    backgroundColor: "#080A0E",
    justifyContent: "center",
    alignItems: "center",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  greeting: {
    fontSize: 13,
    color: "rgba(232,237,245,0.55)",
    fontFamily: "DMSans_400Regular",
  },
  greetingName: {
    fontSize: 22,
    color: "#E8EDF5",
    fontFamily: "DMSans_700Bold",
    marginTop: 2,
    textTransform: "capitalize",
  },
  headerRight: { flexDirection: "row", gap: 12, alignItems: "center" },
  notifBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#131820",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
    justifyContent: "center",
    alignItems: "center",
  },
  notifDot: {
    width: 8,
    height: 8,
    backgroundColor: "#F75A68",
    borderRadius: 4,
    position: "absolute",
    top: 8,
    right: 8,
    borderWidth: 2,
    borderColor: "#131820",
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(0,179,126,0.2)",
    borderWidth: 2,
    borderColor: "rgba(0,179,126,0.12)",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  avatarText: { color: "#00B37E", fontFamily: "DMSans_700Bold", fontSize: 14 },
  balanceCard: {
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(0,179,126,0.2)",
  },
  balLabel: {
    fontSize: 12,
    color: "rgba(0,179,126,0.7)",
    fontFamily: "DMSans_500Medium",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  balAmount: {
    fontFamily: "JetBrainsMono_700Bold",
    fontSize: 36,
    color: "#FFF",
    marginTop: 8,
    marginBottom: 4,
    letterSpacing: -1,
  },
  balChange: { fontSize: 12, fontFamily: "DMSans_500Medium" },
  balActions: { flexDirection: "row", gap: 8, marginTop: 20 },
  balBtn: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  balBtnPrimary: { backgroundColor: "#00B37E", borderColor: "#00B37E" },
  balBtnText: { fontSize: 12, color: "#E8EDF5", fontFamily: "DMSans_700Bold" },
  quickStats: {
    flexDirection: "row",
    gap: 12,
    marginHorizontal: 20,
    marginTop: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: "rgba(19,24,32,0.95)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
    borderRadius: 18,
    padding: 16,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  statVal: { fontFamily: "JetBrainsMono_700Bold", fontSize: 16 },
  statLbl: {
    fontSize: 11,
    color: "rgba(232,237,245,0.55)",
    fontFamily: "DMSans_400Regular",
    marginTop: 2,
  },
  secHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 12,
  },
  secTitle: { fontSize: 15, fontFamily: "DMSans_700Bold", color: "#E8EDF5" },
  secLink: { fontSize: 12, color: "#00B37E", fontFamily: "DMSans_700Bold" },
  emptyText: {
    color: "rgba(232,237,245,0.55)",
    textAlign: "center",
    fontFamily: "DMSans_400Regular",
    padding: 20,
  },
  txList: { paddingHorizontal: 20, gap: 10 },
  txItem: {
    backgroundColor: "rgba(19,24,32,0.95)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  txIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.03)",
    justifyContent: "center",
    alignItems: "center",
  },
  txInfo: { flex: 1 },
  txName: { fontSize: 14, fontFamily: "DMSans_700Bold", color: "#E8EDF5" },
  txCat: {
    fontSize: 11,
    color: "rgba(232,237,245,0.55)",
    fontFamily: "DMSans_400Regular",
  },
  txAmount: { fontFamily: "JetBrainsMono_700Bold", fontSize: 14 },
  textInc: { color: "#00B37E" },
  textExp: { color: "#F75A68" },
  txTime: {
    fontSize: 10,
    color: "rgba(232,237,245,0.3)",
    fontFamily: "DMSans_400Regular",
    marginTop: 4,
  },
  scoreRow: { flexDirection: "row", gap: 12, marginHorizontal: 20 },
  scoreCard: {
    flex: 1,
    backgroundColor: "rgba(19,24,32,0.95)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
    borderRadius: 18,
    padding: 14,
    alignItems: "center",
  },
  scoreNum: { fontFamily: "JetBrainsMono_700Bold", fontSize: 22 },
  scoreLbl: {
    fontSize: 10,
    color: "rgba(232,237,245,0.55)",
    fontFamily: "DMSans_700Bold",
    marginTop: 4,
    textTransform: "uppercase",
  },
});
