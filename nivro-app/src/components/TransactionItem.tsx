import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface TransactionProps {
  description: string;
  category: string;
  amount: string;
  type: "INCOME" | "EXPENSE";
  date: string;
}

export function TransactionItem({
  description,
  category,
  amount,
  type,
  date,
}: TransactionProps) {
  const isExpense = type === "EXPENSE";

  return (
    <View style={styles.container}>
      <View style={styles.iconPlaceholder}>
        <Text style={styles.iconText}>{description[0].toUpperCase()}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.description}>{description}</Text>
        <Text style={styles.category}>{category}</Text>
      </View>

      <View style={styles.values}>
        <Text
          style={[styles.amount, { color: isExpense ? "#F75A68" : "#00B37E" }]}
        >
          {isExpense ? "-" : "+"}{" "}
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(Number(amount))}
        </Text>
        <Text style={styles.date}>
          {new Date(date).toLocaleDateString("pt-BR")}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  iconPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#29292E",
    justifyContent: "center",
    alignItems: "center",
  },
  iconText: { color: "#FFF", fontWeight: "bold" },
  info: { flex: 1, marginLeft: 16 },
  description: { color: "#E1E1E6", fontSize: 16, fontWeight: "bold" },
  category: { color: "#8D8D99", fontSize: 13 },
  values: { alignItems: "flex-end" },
  amount: { fontSize: 16, fontWeight: "bold" },
  date: { color: "#8D8D99", fontSize: 12, marginTop: 4 },
});
