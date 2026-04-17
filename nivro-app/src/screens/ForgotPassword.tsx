import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { api } from "../api/api";

export function ForgotPassword() {
  const navigation = useNavigation<any>();
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);

  // Estados do Formulário
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // PASSO 1: Solicitar o código
  async function handleRequestCode() {
    if (!email) return Alert.alert("Ops", "Digite seu e-mail cadastrado.");

    try {
      setLoading(true);
      // 👇 Certifique-se de que essa rota existe no seu Back-end (auth.controller)
      await api.post("/auth/forgot-password", { email: email.trim() });

      Alert.alert(
        "Sucesso",
        "Se o e-mail estiver correto, você receberá um código em instantes.",
      );
      setStep(2); // Avança para a tela de digitar o código
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error.response?.data?.message || "Erro ao solicitar recuperação.",
      );
    } finally {
      setLoading(false);
    }
  }

  // PASSO 2: Validar o código e trocar a senha
  async function handleResetPassword() {
    if (!code || !newPassword)
      return Alert.alert("Ops", "Preencha o código e a nova senha.");
    if (newPassword.length < 6)
      return Alert.alert(
        "Erro",
        "A nova senha deve ter no mínimo 6 caracteres.",
      );

    try {
      setLoading(true);
      // 👇 Certifique-se de que essa rota também existe no seu Back-end
      await api.post("/auth/reset-password", {
        email: email.trim(),
        token: code.trim(),
        new_password: newPassword,
      });

      Alert.alert(
        "Senha Atualizada",
        "Sua senha foi redefinida com sucesso. Faça seu login!",
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => (step === 2 ? setStep(1) : navigation.goBack())}
        >
          <Feather name="arrow-left" size={24} color="#E8EDF5" />
        </TouchableOpacity>
        <View style={styles.iconContainer}>
          <Feather
            name={step === 1 ? "mail" : "key"}
            size={32}
            color="#00B37E"
          />
        </View>
        <Text style={styles.title}>
          {step === 1 ? "Recuperar Senha" : "Redefinir Senha"}
        </Text>
        <Text style={styles.subtitle}>
          {step === 1
            ? "Digite seu e-mail para receber o código de recuperação."
            : "Digite o código de 6 dígitos que enviamos para o seu e-mail e crie uma nova senha."}
        </Text>
      </View>

      <View style={styles.form}>
        {step === 1 ? (
          // --- FORMULÁRIO DO PASSO 1 ---
          <View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>E-MAIL CADASTRADO</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: joao@email.com"
                placeholderTextColor="rgba(232,237,245,0.3)"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleRequestCode}
              disabled={loading}
              style={{ marginTop: 12 }}
            >
              <LinearGradient
                colors={["#00B37E", "#00D496"]}
                style={styles.button}
              >
                {loading ? (
                  <ActivityIndicator color="#0D1017" />
                ) : (
                  <Text style={styles.buttonText}>Enviar Código</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          // --- FORMULÁRIO DO PASSO 2 ---
          <View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>CÓDIGO DE RECUPERAÇÃO</Text>
              <TextInput
                style={[
                  styles.input,
                  { letterSpacing: 5, textAlign: "center", fontSize: 20 },
                ]}
                placeholder="000000"
                placeholderTextColor="rgba(232,237,245,0.2)"
                keyboardType="numeric"
                maxLength={6}
                value={code}
                onChangeText={setCode}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>NOVA SENHA</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Mínimo de 6 caracteres"
                  placeholderTextColor="rgba(232,237,245,0.3)"
                  secureTextEntry={!showPassword}
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeBtn}
                >
                  <Feather
                    name={showPassword ? "eye" : "eye-off"}
                    size={20}
                    color="rgba(232,237,245,0.55)"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleResetPassword}
              disabled={loading}
              style={{ marginTop: 12 }}
            >
              <LinearGradient
                colors={["#00B37E", "#00D496"]}
                style={styles.button}
              >
                {loading ? (
                  <ActivityIndicator color="#0D1017" />
                ) : (
                  <Text style={styles.buttonText}>Confirmar Nova Senha</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0D1017", justifyContent: "center" },
  header: { alignItems: "center", marginBottom: 32, paddingHorizontal: 24 },
  backBtn: {
    position: "absolute",
    left: 24,
    top: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.05)",
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: "rgba(0,179,126,0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(0,179,126,0.2)",
  },
  title: {
    color: "#FFF",
    fontSize: 24,
    fontFamily: "DMSans_700Bold",
    marginBottom: 8,
  },
  subtitle: {
    color: "rgba(232,237,245,0.55)",
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  form: { paddingHorizontal: 24 },
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
    borderColor: "rgba(255,255,255,0.07)",
    fontFamily: "DMSans_400Regular",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#131820",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
    height: 56,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#E8EDF5",
    fontFamily: "DMSans_400Regular",
  },
  eyeBtn: { padding: 16 },
  button: {
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: { color: "#0D1017", fontSize: 16, fontFamily: "DMSans_700Bold" },
});
