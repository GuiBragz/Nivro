import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView, // 👈 Importante para rolar a tela
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { api } from "../api/api";

export function Security() {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(false);

  // Senhas
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Estado Fake do Open Finance
  const [openFinanceBanks, setOpenFinanceBanks] = useState([
    { id: "1", name: "Nubank", connected: true },
    { id: "2", name: "Itaú", connected: false },
    { id: "3", name: "Banco Inter", connected: true },
  ]);

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

  function handleToggleOpenFinance(
    bankId: string,
    bankName: string,
    isConnected: boolean,
  ) {
    if (isConnected) {
      Alert.alert(
        "Cancelar Integração",
        `Deseja parar de sincronizar seus dados do ${bankName}?`,
        [
          { text: "Não", style: "cancel" },
          {
            text: "Sim, parar",
            style: "destructive",
            onPress: () => {
              setOpenFinanceBanks((prev) =>
                prev.map((b) =>
                  b.id === bankId ? { ...b, connected: false } : b,
                ),
              );
            },
          },
        ],
      );
    } else {
      Alert.alert(
        "Conectar Banco",
        `Você será redirecionado para autorizar a conexão com o ${bankName}.`,
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Continuar",
            onPress: () => {
              setOpenFinanceBanks((prev) =>
                prev.map((b) =>
                  b.id === bankId ? { ...b, connected: true } : b,
                ),
              );
            },
          },
        ],
      );
    }
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
          onPress: () => console.log("Limpando dados..."),
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
          onPress: () => console.log("Deletando conta..."),
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
        {/* --- SEÇÃO DE SENHA --- */}
        <Text style={styles.sectionTitle}>ALTERAR SENHA</Text>
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

        {/* --- SEÇÃO OPEN FINANCE --- */}
        <Text style={[styles.sectionTitle, { marginTop: 32 }]}>
          OPEN FINANCE
        </Text>
        <Text style={styles.sectionSubtitle}>
          Gerencie os bancos sincronizados com o Nivro.
        </Text>
        <View style={styles.card}>
          {openFinanceBanks.map((bank, index) => (
            <View
              key={bank.id}
              style={[
                styles.bankRow,
                index !== openFinanceBanks.length - 1 && styles.borderBottom,
              ]}
            >
              <View style={styles.bankIcon}>
                <Feather
                  name="briefcase"
                  size={18}
                  color="rgba(232,237,245,0.7)"
                />
              </View>
              <View style={styles.bankInfo}>
                <Text style={styles.bankName}>{bank.name}</Text>
                <Text style={styles.bankStatus}>
                  {bank.connected ? "Sincronizado" : "Não conectado"}
                </Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.bankBtn,
                  bank.connected ? styles.bankBtnCancel : styles.bankBtnConnect,
                ]}
                onPress={() =>
                  handleToggleOpenFinance(bank.id, bank.name, bank.connected)
                }
              >
                <Text
                  style={[
                    styles.bankBtnText,
                    bank.connected
                      ? { color: "#F75A68" }
                      : { color: "#00B37E" },
                  ]}
                >
                  {bank.connected ? "Cancelar" : "Conectar"}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* --- SEÇÃO DANGER ZONE --- */}
        <Text
          style={[styles.sectionTitle, { marginTop: 32, color: "#F75A68" }]}
        >
          ZONA DE PERIGO
        </Text>

        <TouchableOpacity style={styles.dangerBtn} onPress={handleDeleteData}>
          <View style={styles.dangerIconBox}>
            <Feather name="trash" size={20} color="#E8EDF5" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.dangerBtnTitle}>Limpar Histórico</Text>
            <Text style={styles.dangerBtnSub}>Apaga transações e contas</Text>
          </View>
          <Feather
            name="chevron-right"
            size={20}
            color="rgba(232,237,245,0.3)"
          />
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
            <Feather name="alert-triangle" size={20} color="#F75A68" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.dangerBtnTitle, { color: "#F75A68" }]}>
              Excluir Minha Conta
            </Text>
            <Text style={styles.dangerBtnSub}>
              Ação permanente e irreversível
            </Text>
          </View>
          <Feather
            name="chevron-right"
            size={20}
            color="rgba(247,90,104,0.3)"
          />
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
    color: "rgba(232,237,245,0.4)",
    fontFamily: "DMSans_700Bold",
    letterSpacing: 1.5,
    marginBottom: 12,
    marginLeft: 8,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: "rgba(232,237,245,0.55)",
    fontFamily: "DMSans_400Regular",
    marginBottom: 16,
    marginLeft: 8,
  },
  card: {
    backgroundColor: "rgba(19,24,32,0.95)",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
  },

  inputGroup: { marginBottom: 20 },
  inputLabel: {
    fontSize: 12,
    color: "rgba(232,237,245,0.55)",
    fontFamily: "DMSans_700Bold",
    marginBottom: 8,
  },
  input: {
    height: 56,
    backgroundColor: "#131820",
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#E8EDF5",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.04)",
    fontFamily: "DMSans_400Regular",
  },
  saveBtn: {
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  saveBtnText: { color: "#FFF", fontSize: 16, fontFamily: "DMSans_700Bold" },

  bankRow: { flexDirection: "row", alignItems: "center", paddingVertical: 12 },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  bankIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  bankInfo: { flex: 1 },
  bankName: {
    fontSize: 15,
    color: "#E8EDF5",
    fontFamily: "DMSans_700Bold",
    marginBottom: 2,
  },
  bankStatus: {
    fontSize: 12,
    color: "rgba(232,237,245,0.55)",
    fontFamily: "DMSans_400Regular",
  },
  bankBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  bankBtnConnect: {
    backgroundColor: "rgba(0,179,126,0.1)",
    borderColor: "rgba(0,179,126,0.2)",
  },
  bankBtnCancel: {
    backgroundColor: "rgba(247,90,104,0.1)",
    borderColor: "rgba(247,90,104,0.2)",
  },
  bankBtnText: { fontSize: 12, fontFamily: "DMSans_700Bold" },

  dangerBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#131820",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
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
