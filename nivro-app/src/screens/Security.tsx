import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { api } from "../api/api";
import { useAuth } from "../contexts/AuthContext";

export function Security() {
  const navigation = useNavigation<any>();
  const { signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  // Senhas
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function handleUpdatePassword() {
    if (!currentPassword || !newPassword || !confirmPassword) {
      return Alert.alert("Ops", "Preencha todos os campos de senha.");
    }
    if (newPassword !== confirmPassword) {
      return Alert.alert("Erro", "A nova senha e a confirmação não batem.");
    }
    if (newPassword.length < 6) {
      return Alert.alert(
        "Erro",
        "A nova senha deve ter no mínimo 6 caracteres.",
      );
    }

    try {
      setLoading(true);
      await api.put("/users/password", {
        currentPassword,
        newPassword,
      });

      Alert.alert("Sucesso", "Sua senha foi atualizada com segurança.");
      setShowPasswordForm(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error.response?.data?.message || "Não foi possível alterar a senha.",
      );
    } finally {
      setLoading(false);
    }
  }

  function handleOpenFinance() {
    Alert.alert(
      "Open Finance",
      "Estamos finalizando a integração com o Banco Central para você sincronizar todas as suas contas automaticamente. Fique de olho na próxima atualização!",
    );
  }

  function handleDeleteData() {
    Alert.alert(
      "Limpar Dados",
      "Isso apagará TODAS as suas transações e contas cadastradas. Deseja continuar?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Limpar Tudo",
          style: "destructive",
          onPress: async () => {
            try {
              // 👇 Chamada ativada! Certifique-se de que essa rota existe no NestJS
              await api.delete("/transactions/clear-all");

              Alert.alert("Feito", "Seu histórico foi apagado.");
              navigation.navigate("Home");
            } catch (error: any) {
              console.error("Erro ao limpar dados:", error);
              Alert.alert(
                "Erro",
                error.response?.data?.message ||
                  "Falha ao limpar o histórico. Verifique o Back-end.",
              );
            }
          },
        },
      ],
    );
  }

  function handleDeleteAccount() {
    Alert.alert(
      "Excluir Conta",
      "Sua conta será apagada permanentemente. Esta ação é irreversível. Deseja excluir?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir permanentemente",
          style: "destructive",
          onPress: async () => {
            try {
              // 👇 Chamada ativada! Rota para deletar o próprio usuário
              await api.delete("/users/me");

              Alert.alert("Adeus", "Sua conta foi excluída com sucesso.");
              signOut(); // Desloga e volta pro login
            } catch (error: any) {
              console.error("Erro ao excluir conta:", error);
              Alert.alert(
                "Erro",
                error.response?.data?.message ||
                  "Falha ao excluir a conta. Verifique o Back-end.",
              );
            }
          },
        },
      ],
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color="#E8EDF5" />
        </TouchableOpacity>
        <Text style={styles.title}>Segurança</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.form}>
        {/* --- SEÇÃO DE ACESSO --- */}
        <Text style={styles.sectionTitle}>ACESSO AO APP</Text>

        <TouchableOpacity
          style={styles.menuItemBtn}
          onPress={() => setShowPasswordForm(!showPasswordForm)}
        >
          <View style={styles.iconBox}>
            <Feather name="key" size={20} color="#E8EDF5" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.menuItemText}>Alterar Senha</Text>
            <Text style={styles.menuItemDesc}>
              Atualize sua senha de acesso
            </Text>
          </View>
          <Feather
            name={showPasswordForm ? "chevron-up" : "chevron-down"}
            size={20}
            color="rgba(232,237,245,0.3)"
          />
        </TouchableOpacity>

        {showPasswordForm && (
          <View style={styles.card}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>SENHA ATUAL</Text>
              <TextInput
                style={styles.input}
                secureTextEntry
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholderTextColor="rgba(232,237,245,0.3)"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>NOVA SENHA</Text>
              <TextInput
                style={styles.input}
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
                placeholderTextColor="rgba(232,237,245,0.3)"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>CONFIRMAR NOVA SENHA</Text>
              <TextInput
                style={styles.input}
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholderTextColor="rgba(232,237,245,0.3)"
              />
            </View>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleUpdatePassword}
              disabled={loading}
            >
              <LinearGradient
                colors={["#3B82F6", "#2563EB"]}
                style={styles.saveBtn}
              >
                {loading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.saveBtnText}>Atualizar Senha</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {/* --- SEÇÃO OPEN FINANCE --- */}
        <Text style={[styles.sectionTitle, { marginTop: 32 }]}>CONEXÕES</Text>

        <TouchableOpacity
          style={styles.menuItemBtn}
          onPress={handleOpenFinance}
        >
          <View
            style={[
              styles.iconBox,
              { backgroundColor: "rgba(59,130,246,0.15)" },
            ]}
          >
            <Feather name="link" size={20} color="#3B82F6" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.menuItemText}>Open Finance</Text>
            <Text style={styles.menuItemDesc}>
              Sincronizar contas bancárias
            </Text>
          </View>
          <View style={styles.soonBadge}>
            <Text style={styles.soonText}>EM BREVE</Text>
          </View>
        </TouchableOpacity>

        {/* --- SEÇÃO DANGER ZONE --- */}
        <Text
          style={[
            styles.sectionTitle,
            { marginTop: 32, color: "rgba(247,90,104,0.7)" },
          ]}
        >
          ZONA DE PERIGO
        </Text>

        <TouchableOpacity style={styles.dangerBtn} onPress={handleDeleteData}>
          <View style={styles.dangerIconBox}>
            <Feather name="trash-2" size={20} color="#E8EDF5" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.dangerBtnTitle}>Limpar Histórico</Text>
            <Text style={styles.dangerBtnSub}>Apaga todas as transações</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.dangerBtn, { borderColor: "rgba(247,90,104,0.3)" }]}
          onPress={handleDeleteAccount}
        >
          <View
            style={[
              styles.dangerIconBox,
              { backgroundColor: "rgba(247,90,104,0.1)" },
            ]}
          >
            <Feather name="x-octagon" size={20} color="#F75A68" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.dangerBtnTitle, { color: "#F75A68" }]}>
              Excluir Minha Conta
            </Text>
            <Text style={styles.dangerBtnSub}>
              Ação permanente e irreversível
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  form: { paddingHorizontal: 24, paddingTop: 10 },

  sectionTitle: {
    fontSize: 11,
    color: "rgba(232,237,245,0.3)",
    fontFamily: "DMSans_700Bold",
    letterSpacing: 1.5,
    marginBottom: 16,
    marginLeft: 8,
  },
  card: {
    backgroundColor: "rgba(19,24,32,0.5)",
    borderRadius: 16,
    padding: 16,
    marginTop: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.03)",
  },

  inputGroup: { marginBottom: 16 },
  inputLabel: {
    fontSize: 12,
    color: "rgba(232,237,245,0.55)",
    fontFamily: "DMSans_500Medium",
    marginBottom: 8,
  },
  input: {
    height: 48,
    backgroundColor: "#080A0E",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#E8EDF5",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    fontFamily: "DMSans_400Regular",
  },
  saveBtn: {
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  saveBtnText: { color: "#FFF", fontSize: 14, fontFamily: "DMSans_700Bold" },

  menuItemBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#131820",
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
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
    marginRight: 16,
  },
  menuItemText: {
    fontSize: 15,
    color: "#E8EDF5",
    fontFamily: "DMSans_500Medium",
    marginBottom: 2,
  },
  menuItemDesc: {
    fontSize: 12,
    color: "rgba(232,237,245,0.4)",
    fontFamily: "DMSans_400Regular",
  },
  soonBadge: {
    backgroundColor: "rgba(59,130,246,0.15)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  soonText: { color: "#3B82F6", fontSize: 10, fontFamily: "DMSans_700Bold" },

  dangerBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(247,90,104,0.02)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.03)",
  },
  dangerIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  dangerBtnTitle: {
    fontSize: 15,
    color: "#E8EDF5",
    fontFamily: "DMSans_700Bold",
    marginBottom: 2,
  },
  dangerBtnSub: {
    fontSize: 12,
    color: "rgba(232,237,245,0.4)",
    fontFamily: "DMSans_400Regular",
  },
});
