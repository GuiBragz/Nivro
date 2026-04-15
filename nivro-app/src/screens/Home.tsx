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
import { api } from "../api/api";
import { useAuth } from "../contexts/AuthContext"; // 👈 Importamos o contexto para pegar o usuário

export function Home() {
  const { user } = useAuth(); // 👈 Pegamos o usuário logado
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const navigation = useNavigation<any>();

  async function loadHomeData() {
    try {
      setLoading(true);
      const [accRes, txRes] = await Promise.all([
        api.get("/accounts"),
        api.get("/transactions/dashboard"),
      ]);

      // Pega a primeira conta (ou a conta principal do usuário)
      if (accRes.data.length > 0) setAccount(accRes.data[0]);
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

  // 🧮 1. Cálculos de Receitas, Despesas e Poupança
  const incomeTotal = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const expenseTotal = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const poupancaTotal = incomeTotal - expenseTotal;
  const taxaPoupanca =
    incomeTotal > 0 ? Math.round((poupancaTotal / incomeTotal) * 100) : 0;

  // 🌅 2. Lógica de Saudação Dinâmica
  const currentHour = new Date().getHours();
  let greetingTime = "Boa noite";
  if (currentHour < 12) greetingTime = "Bom dia";
  else if (currentHour < 18) greetingTime = "Boa tarde";

  // 👤 3. Tratamento do Nome do Usuário
  // Tenta pegar o nome, se não tiver, usa o começo do e-mail
  const firstName =
    user?.full_name?.split(" ")[0] ||
    user?.name?.split(" ")[0] ||
    user?.email?.split("@")[0] ||
    "Usuário";
  const userInitial = firstName.charAt(0).toUpperCase();

  if (loading && !account) {
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
      {/* HEADER DINÂMICO */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.greeting}>{greetingTime} 👋</Text>
          <Text style={styles.greetingName}>{firstName}</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.notifBtn}>
            <Feather name="bell" size={18} color="#E8EDF5" />
            <View style={styles.notifDot} />
          </TouchableOpacity>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{userInitial}</Text>
          </View>
        </View>
      </View>

      {/* BALANCE CARD */}
      <LinearGradient
        colors={["#0D2A1F", "#0A1F18", "#081510"]}
        style={styles.balanceCard}
      >
        <Text style={styles.balLabel}>Saldo total</Text>
        <Text style={styles.balAmount}>
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(account ? Number(account.balance) : 0)}
        </Text>

        {/* Mostra se a poupança do mês está positiva ou negativa no card principal */}
        <Text
          style={[
            styles.balChange,
            { color: poupancaTotal >= 0 ? "#00B37E" : "#F75A68" },
          ]}
        >
          {poupancaTotal >= 0 ? "▲" : "▼"}
          {poupancaTotal >= 0 ? " +" : " "}
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(poupancaTotal)}{" "}
          este mês
        </Text>

        <View style={styles.balActions}>
          <TouchableOpacity style={styles.balBtn}>
            <Feather name="arrow-up" size={14} color="#E8EDF5" />
            <Text style={styles.balBtnText}>Enviar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.balBtn}>
            <Feather name="arrow-down" size={14} color="#E8EDF5" />
            <Text style={styles.balBtnText}>Receber</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.balBtn, styles.balBtnPrimary]}
            onPress={() => navigation.navigate("NewAccount")} // Linkei para criar conta por enquanto
          >
            <Feather name="plus-circle" size={14} color="#000" />
            <Text style={[styles.balBtnText, { color: "#000" }]}>
              Nova Conta
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* QUICK STATS */}
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
            {new Intl.NumberFormat("pt-BR", {
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
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(expenseTotal)}
          </Text>
          <Text style={styles.statLbl}>Despesas / mês</Text>
        </View>
      </View>

      {/* TRANSACTIONS SECTION */}
      <View style={styles.secHeader}>
        <Text style={styles.secTitle}>Últimas Transações</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Transactions")}>
          <Text style={styles.secLink}>Ver todas</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.txList}>
        {transactions.length > 0 ? (
          transactions.slice(0, 5).map((item) => (
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
                <Text style={styles.txCat}>
                  {item.category?.name || "Geral"}
                </Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text
                  style={[
                    styles.txAmount,
                    item.type === "INCOME" ? styles.textInc : styles.textExp,
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
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>
            Nenhuma transação registrada ainda.
          </Text>
        )}
      </View>

      {/* HEALTH SCORE (DINÂMICO) */}
      <View style={[styles.secHeader, { marginTop: 8 }]}>
        <Text style={styles.secTitle}>Saúde Financeira</Text>
      </View>
      <View style={styles.scoreRow}>
        <View style={styles.scoreCard}>
          <Text style={[styles.scoreNum, { color: "#00B37E" }]}>
            {taxaPoupanca > 20 ? "Ótimo" : taxaPoupanca > 0 ? "Bom" : "Atenção"}
          </Text>
          <Text style={styles.scoreLbl}>Status Geral</Text>
        </View>
        <View style={styles.scoreCard}>
          <Text style={[styles.scoreNum, { color: "#F7C948", fontSize: 18 }]}>
            {poupancaTotal > 0
              ? `+ R$ ${poupancaTotal}`
              : `R$ ${poupancaTotal}`}
          </Text>
          <Text style={styles.scoreLbl}>Poupança Mês</Text>
        </View>
        <View style={styles.scoreCard}>
          <Text style={[styles.scoreNum, { color: "#3B82F6" }]}>
            {taxaPoupanca}%
          </Text>
          <Text style={styles.scoreLbl}>Taxa Poup.</Text>
        </View>
      </View>

      {/* Espaçamento para a Bottom Bar */}
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

  // Header
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
  },
  avatarText: { color: "#00B37E", fontFamily: "DMSans_700Bold", fontSize: 14 },

  // Balance Card
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

  // Quick Stats
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

  // Sections
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

  // Transactions
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
    marginTop: 2,
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

  // Score Widgets
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
