import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { api } from "../api/api";

export function ForgotPassword() {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  // Estados dos campos
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Passo 1: Solicitar o código
  async function handleSendEmail() {
    if (!email) return Alert.alert("Ops", "Digite seu e-mail.");

    try {
      setLoading(true);
      await api.post("/auth/forgot-password", { email });
      Alert.alert(
        "Código enviado!",
        "Verifique seu terminal (simulando e-mail) para pegar o código de 6 dígitos.",
      );
      setStep(2); // Muda a tela para pedir o código
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error.response?.data?.message || "Erro ao solicitar recuperação.",
      );
    } finally {
      setLoading(false);
    }
  }

  // Passo 2: Validar código e trocar senha
  async function handleResetPassword() {
    if (!token || !newPassword)
      return Alert.alert("Ops", "Preencha o código e a nova senha.");

    try {
      setLoading(true);
      await api.post("/auth/reset-password", {
        email,
        token,
        new_password: newPassword,
      });

      Alert.alert(
        "Sucesso!",
        "Senha alterada com sucesso. Você já pode fazer login.",
      );
      navigation.navigate("login");
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error.response?.data?.message || "Código inválido ou expirado.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Recuperar Senha</Text>
        <Text style={styles.subtitle}>
          {step === 1
            ? "Informe seu e-mail para receber o código de verificação."
            : "Digite o código de 6 dígitos e sua nova senha."}
        </Text>
      </View>

      <View style={styles.form}>
        {step === 1 ? (
          <>
            <TextInput
              style={styles.input}
              placeholder="Seu e-mail cadastrado"
              placeholderTextColor="#8D8D99"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={handleSendEmail}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Enviando..." : "Enviar Código"}
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TextInput
              style={styles.input}
              placeholder="Código de 6 dígitos"
              placeholderTextColor="#8D8D99"
              keyboardType="numeric"
              maxLength={6}
              value={token}
              onChangeText={setToken}
            />
            <TextInput
              style={styles.input}
              placeholder="Sua nova senha"
              placeholderTextColor="#8D8D99"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={handleResetPassword}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Salvando..." : "Redefinir Senha"}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121214" },
  content: { padding: 24, paddingTop: 60 },
  header: { marginBottom: 32 },
  backText: { color: "#00B37E", fontSize: 16, marginBottom: 24 },
  title: { color: "#FFF", fontSize: 32, fontWeight: "bold" },
  subtitle: { color: "#8D8D99", fontSize: 16, marginTop: 8 },
  form: { gap: 16 },
  input: {
    backgroundColor: "#202024",
    color: "#FFF",
    padding: 16,
    borderRadius: 8,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#00B37E",
    height: 56,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
});
