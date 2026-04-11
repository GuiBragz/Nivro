import React from "react";
import { View, Text, StyleSheet } from "react-native";

export function Transactions() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Tela Inicial (Dashboard)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121214",
    justifyContent: "center",
    alignItems: "center",
  },
  text: { color: "#FFF", fontSize: 20 },
});
