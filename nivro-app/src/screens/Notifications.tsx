import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "../contexts/AuthContext"; // 👈 Conectando com o Contexto Global

export function Notifications() {
  const navigation = useNavigation<any>();
  // 👇 Puxando os dados reais e as funções do cérebro do app
  const {
    notifications,
    removeNotification,
    clearAllNotifications,
    markAllAsRead,
  } = useAuth();

  // 👇 Assim que a tela abre, marca tudo como lido! (Apaga a bolinha da Home)
  useEffect(() => {
    if (notifications.some((n) => !n.read)) {
      markAllAsRead();
    }
  }, []);

  function handleClearAll() {
    Alert.alert("Limpar Tudo", "Deseja excluir todas as notificações?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sim, limpar",
        style: "destructive",
        onPress: () => clearAllNotifications(), // 👈 Chama a função do Contexto
      },
    ]);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color="#E8EDF5" />
        </TouchableOpacity>
        <Text style={styles.title}>Notificações</Text>

        {notifications.length > 0 ? (
          <TouchableOpacity style={styles.clearBtn} onPress={handleClearAll}>
            <Feather name="trash-2" size={20} color="#F75A68" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {notifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Feather name="bell-off" size={48} color="rgba(232,237,245,0.2)" />
            <Text style={styles.emptyTitle}>Tudo limpo por aqui</Text>
            <Text style={styles.emptyDesc}>
              Você não tem novas notificações no momento.
            </Text>
          </View>
        ) : (
          notifications.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.iconBox}>
                <Feather
                  name={item.type === "alert" ? "alert-circle" : "info"}
                  size={20}
                  color={item.type === "alert" ? "#F75A68" : "#3B82F6"}
                />
              </View>

              <View style={styles.textInfo}>
                <Text style={styles.notifTitle}>{item.title}</Text>
                <Text style={styles.notifMsg}>{item.message}</Text>
                <Text style={styles.notifTime}>{item.time}</Text>
              </View>

              {/* 👇 Chama a função de apagar do Contexto passando o ID */}
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => removeNotification(item.id)}
              >
                <Feather name="x" size={20} color="rgba(232,237,245,0.4)" />
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#080A0E" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.05)",
    justifyContent: "center",
    alignItems: "center",
  },
  title: { color: "#E8EDF5", fontSize: 18, fontFamily: "DMSans_700Bold" },
  clearBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(247,90,104,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: { paddingHorizontal: 24, paddingBottom: 40 },

  card: {
    flexDirection: "row",
    backgroundColor: "rgba(19,24,32,0.95)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.03)",
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  textInfo: { flex: 1 },
  notifTitle: {
    fontSize: 15,
    color: "#E8EDF5",
    fontFamily: "DMSans_700Bold",
    marginBottom: 4,
  },
  notifMsg: {
    fontSize: 13,
    color: "rgba(232,237,245,0.6)",
    fontFamily: "DMSans_400Regular",
    lineHeight: 20,
  },
  notifTime: {
    fontSize: 11,
    color: "rgba(232,237,245,0.3)",
    fontFamily: "DMSans_400Regular",
    marginTop: 8,
  },

  deleteBtn: { paddingLeft: 12, paddingTop: 4 },

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
  },
  emptyTitle: {
    fontSize: 18,
    color: "#E8EDF5",
    fontFamily: "DMSans_700Bold",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 14,
    color: "rgba(232,237,245,0.5)",
    fontFamily: "DMSans_400Regular",
    textAlign: "center",
  },
});
