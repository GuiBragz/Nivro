import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export function Profile() {
  const { user, signOut } = useAuth();
  const navigation = useNavigation<any>();

  const fullName =
    user?.profile?.full_name || user?.full_name || "Usuário Nivro";
  const firstName = fullName.split(" ")[0];
  const initial = firstName.charAt(0).toUpperCase();
  const avatarUrl = user?.profile?.avatar_url || user?.avatar_url;

  function handleLogout() {
    Alert.alert("Sair", "Tem certeza que deseja sair da sua conta?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sair", style: "destructive", onPress: signOut },
    ]);
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Meu Perfil</Text>
      </View>

      <View style={styles.userCard}>
        <View style={styles.avatar}>
          {avatarUrl ? (
            <Image
              source={{ uri: `${avatarUrl}?t=${new Date().getTime()}` }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          ) : (
            <Text style={styles.avatarText}>{initial}</Text>
          )}
        </View>
        <Text style={styles.userName}>{fullName}</Text>
        <Text style={styles.userEmail}>{user?.email || "email@nivro.com"}</Text>

        <View style={styles.badge}>
          <Feather
            name="shield"
            size={12}
            color="#00B37E"
            style={{ marginRight: 4 }}
          />
          <Text style={styles.badgeText}>Conta Protegida</Text>
        </View>
      </View>

      <View style={styles.menuGroup}>
        <Text style={styles.menuTitle}>DADOS PESSOAIS</Text>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("EditProfile")}
        >
          <View style={styles.menuIconBox}>
            <Feather name="user" size={20} color="#E8EDF5" />
          </View>
          <View style={styles.menuTextContent}>
            <Text style={styles.menuItemTitle}>Editar Perfil</Text>
            <Text style={styles.menuItemDesc}>Atualize seu nome ou foto</Text>
          </View>
          <Feather
            name="chevron-right"
            size={20}
            color="rgba(232,237,245,0.3)"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("Security")}
        >
          <View style={styles.menuIconBox}>
            <Feather name="lock" size={20} color="#E8EDF5" />
          </View>
          <View style={styles.menuTextContent}>
            <Text style={styles.menuItemTitle}>Segurança</Text>
            <Text style={styles.menuItemDesc}>
              Senha e autenticação em 2 fatores
            </Text>
          </View>
          <Feather
            name="chevron-right"
            size={20}
            color="rgba(232,237,245,0.3)"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("Privacy")}
        >
          <View style={styles.menuIconBox}>
            <Feather name="eye-off" size={20} color="#E8EDF5" />
          </View>
          <View style={styles.menuTextContent}>
            <Text style={styles.menuItemTitle}>Privacidade</Text>
            <Text style={styles.menuItemDesc}>
              Controle de dados e visibilidade
            </Text>
          </View>
          <Feather
            name="chevron-right"
            size={20}
            color="rgba(232,237,245,0.3)"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.menuGroup}>
        <Text style={styles.menuTitle}>SUPORTE</Text>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("HelpCenter")}
        >
          <View style={styles.menuIconBox}>
            <Feather name="help-circle" size={20} color="#E8EDF5" />
          </View>
          <View style={styles.menuTextContent}>
            <Text style={styles.menuItemTitle}>Central de Ajuda</Text>
            <Text style={styles.menuItemDesc}>Fale com nosso time</Text>
          </View>
          <Feather
            name="chevron-right"
            size={20}
            color="rgba(232,237,245,0.3)"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Feather name="log-out" size={20} color="#F75A68" />
        <Text style={styles.logoutText}>Sair da Conta</Text>
      </TouchableOpacity>

      <Text style={styles.version}>Nivro App v1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#080A0E" },
  content: { paddingTop: 60, paddingHorizontal: 24, paddingBottom: 40 },
  header: { marginBottom: 32 },
  title: { fontSize: 28, color: "#E8EDF5", fontFamily: "DMSans_700Bold" },
  userCard: {
    alignItems: "center",
    backgroundColor: "rgba(19,24,32,0.95)",
    borderRadius: 24,
    padding: 32,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
    marginBottom: 32,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(0,179,126,0.1)",
    borderWidth: 2,
    borderColor: "#00B37E",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    overflow: "hidden",
  },
  avatarText: { fontSize: 32, color: "#00B37E", fontFamily: "DMSans_700Bold" },
  userName: {
    fontSize: 20,
    color: "#E8EDF5",
    fontFamily: "DMSans_700Bold",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "rgba(232,237,245,0.55)",
    fontFamily: "DMSans_400Regular",
    marginBottom: 16,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,179,126,0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 11,
    color: "#00B37E",
    fontFamily: "DMSans_700Bold",
    textTransform: "uppercase",
  },
  menuGroup: { marginBottom: 24 },
  menuTitle: {
    fontSize: 11,
    color: "rgba(232,237,245,0.4)",
    fontFamily: "DMSans_700Bold",
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#131820",
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.03)",
  },
  menuIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  menuTextContent: { flex: 1 },
  menuItemTitle: {
    fontSize: 15,
    color: "#E8EDF5",
    fontFamily: "DMSans_700Bold",
    marginBottom: 2,
  },
  menuItemDesc: {
    fontSize: 12,
    color: "rgba(232,237,245,0.4)",
    fontFamily: "DMSans_400Regular",
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(247,90,104,0.1)",
    height: 56,
    borderRadius: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "rgba(247,90,104,0.2)",
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 15,
    color: "#F75A68",
    fontFamily: "DMSans_700Bold",
  },
  version: {
    textAlign: "center",
    color: "rgba(232,237,245,0.3)",
    fontSize: 12,
    fontFamily: "DMSans_400Regular",
    marginTop: 55,
  },
});
