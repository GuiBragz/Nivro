import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface BalanceProps {
  amount: number;
  institution: string;
}

export function BalanceCard({ amount, institution }: BalanceProps) {
  // Formata o valor para Real Brasileiro
  const formattedBalance = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amount);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Saldo disponível ({institution})</Text>
      <Text style={styles.amount}>{formattedBalance}</Text>

      <View style={styles.footer}>
        <View style={styles.tag}>
          <Text style={styles.tagText}>+ 12% este mês</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#00B37E",
    padding: 24,
    borderRadius: 16,
    width: "100%",
    marginVertical: 20,
  },
  label: {
    color: "#E1E1E6",
    fontSize: 14,
    marginBottom: 8,
  },
  amount: {
    color: "#FFF",
    fontSize: 32,
    fontWeight: "bold",
  },
  footer: {
    marginTop: 16,
    flexDirection: "row",
  },
  tag: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tagText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
  },
});
