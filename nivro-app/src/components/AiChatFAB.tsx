import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { AiChatModal } from "./AiChatModal";

export function AiChatFAB() {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={styles.fabContainer}
        activeOpacity={0.8}
        onPress={() => setModalVisible(true)}
      >
        <LinearGradient
          colors={["#3B82F6", "#2563EB"]} // Azul IA
          style={styles.fabGradient}
        >
          <Feather name="message-circle" size={24} color="#FFF" />
        </LinearGradient>
      </TouchableOpacity>

      <AiChatModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  fabContainer: {
    position: "absolute",
    bottom: 125, // Fica acima da NavBar padrão
    right: 20,
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
});
