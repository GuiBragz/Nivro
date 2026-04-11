import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../api/api";

export function Profile() {
  const { signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  async function loadProfile() {
    try {
      const response = await api.get("/users/profile");
      setUserData(response.data);
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color="#00B37E" size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>
            {userData?.profile?.full_name?.[0].toUpperCase()}
          </Text>
        </View>

        <Text style={styles.name}>{userData?.profile?.full_name}</Text>
        <Text style={styles.email}>{userData?.email}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>CPF</Text>
          <Text style={styles.infoValue}>{userData?.cpf}</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Telefone</Text>
          <Text style={styles.infoValue}>{userData?.phone}</Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
          <Text style={styles.logoutText}>Sair do Nivro</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121214",
  },
  centered: {
    flex: 1,
    backgroundColor: "#121214",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    paddingTop: 80,
    paddingBottom: 40,
    backgroundColor: "#202024",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#00B37E",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarText: {
    color: "#FFF",
    fontSize: 40,
    fontWeight: "bold",
  },
  name: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "bold",
  },
  email: {
    color: "#8D8D99",
    fontSize: 14,
  },
  content: {
    padding: 24,
    gap: 16,
  },
  infoCard: {
    backgroundColor: "#202024",
    padding: 16,
    borderRadius: 12,
  },
  infoLabel: {
    color: "#8D8D99",
    fontSize: 12,
    marginBottom: 4,
  },
  infoValue: {
    color: "#E1E1E6",
    fontSize: 16,
    fontWeight: "500",
  },
  logoutButton: {
    marginTop: 20,
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F75A68",
    justifyContent: "center",
    alignItems: "center",
  },
  logoutText: {
    color: "#F75A68",
    fontSize: 16,
    fontWeight: "bold",
  },
});
