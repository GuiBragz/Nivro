import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";

export function Notifications() {
  const navigation = useNavigation<any>();

  // Mock de notificações para o layout
  const notifications = [
    {
      id: "1",
      title: "Bem-vindo ao Nivro! 🎉",
      desc: "Sua conta foi configurada com sucesso. Comece a registrar seus primeiros gastos.",
      time: "Agora mesmo",
      icon: "star",
      color: "#F7C948",
    },
    {
      id: "2",
      title: "Dica de Segurança",
      desc: "Sua senha atual é forte, mas recomendamos ativar a biometria nas configurações.",
      time: "Há 2 horas",
      icon: "shield",
      color: "#00B37E",
    },
    {
      id: "3",
      title: "Atenção ao Orçamento",
      desc: "Você já gastou 80% do limite definido para a categoria 'Alimentação' este mês.",
      time: "Ontem",
      icon: "alert-circle",
      color: "#F75A68",
    },
  ];

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
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {notifications.map((notif) => (
          <View key={notif.id} style={styles.card}>
            <View
              style={[styles.iconBox, { backgroundColor: `${notif.color}15` }]}
            >
              <Feather name={notif.icon as any} size={20} color={notif.color} />
            </View>
            <View style={styles.info}>
              <View style={styles.titleRow}>
                <Text style={styles.notifTitle}>{notif.title}</Text>
                <Text style={styles.notifTime}>{notif.time}</Text>
              </View>
              <Text style={styles.notifDesc}>{notif.desc}</Text>
            </View>
          </View>
        ))}
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
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.05)",
    justifyContent: "center",
    alignItems: "center",
  },
  title: { fontSize: 18, color: "#E8EDF5", fontFamily: "DMSans_700Bold" },
  content: { padding: 24, gap: 16 },
  card: {
    flexDirection: "row",
    backgroundColor: "rgba(19,24,32,0.95)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  info: { flex: 1 },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  notifTitle: {
    fontSize: 14,
    color: "#E8EDF5",
    fontFamily: "DMSans_700Bold",
    flex: 1,
  },
  notifTime: {
    fontSize: 11,
    color: "rgba(232,237,245,0.4)",
    fontFamily: "DMSans_400Regular",
    marginLeft: 8,
  },
  notifDesc: {
    fontSize: 13,
    color: "rgba(232,237,245,0.55)",
    fontFamily: "DMSans_400Regular",
    lineHeight: 20,
  },
});
