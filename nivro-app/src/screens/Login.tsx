import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "../contexts/AuthContext";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { signIn } = useAuth();
  const navigation = useNavigation<any>();

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert("Atenção", "Preencha todos os campos.");
      return;
    }

    setIsLoggingIn(true);
    try {
      await signIn(email.trim(), password);
    } catch (error) {
      Alert.alert("Erro", "E-mail ou senha incorretos.");
    } finally {
      setIsLoggingIn(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/nivro.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.title}>Nivro</Text>
        <Text style={styles.subtitle}>O controle financeiro na sua mão.</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>E-MAIL</Text>
          <TextInput
            style={styles.input}
            placeholder="Seu e-mail de acesso"
            placeholderTextColor="rgba(232,237,245,0.3)"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputGroup}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={styles.inputLabel}>SENHA</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("forgotPassword")}
            >
              <Text style={styles.forgotPassword}>Esqueci minha senha</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Sua senha secreta"
              placeholderTextColor="rgba(232,237,245,0.3)"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
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
          onPress={handleLogin}
          disabled={isLoggingIn}
          style={{ marginTop: 12 }}
        >
          <LinearGradient colors={["#00B37E", "#00D496"]} style={styles.button}>
            {isLoggingIn ? (
              <ActivityIndicator color="#0D1017" />
            ) : (
              <Text style={styles.buttonText}>Entrar</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerContainer}
          onPress={() => navigation.navigate("register")}
        >
          <Text style={styles.registerText}>
            Ainda não tem conta?{" "}
            <Text style={styles.registerTextBold}>Cadastre-se</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D1017",
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
    paddingHorizontal: 24,
  },
  logoContainer: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  logoImage: {
    width: "200%",
    height: "200%",
    padding: "20%",
  },
  title: {
    color: "#FFF",
    fontSize: 32,
    fontFamily: "JetBrainsMono_700Bold",
    marginBottom: 8,
    letterSpacing: -1,
  },
  subtitle: {
    color: "rgba(232,237,245,0.55)",
    fontSize: 15,
    fontFamily: "DMSans_400Regular",
  },
  form: {
    paddingHorizontal: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
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
  eyeBtn: {
    padding: 16,
  },
  forgotPassword: {
    fontSize: 12,
    color: "#00B37E",
    fontFamily: "DMSans_700Bold",
  },
  button: {
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#0D1017",
    fontSize: 16,
    fontFamily: "DMSans_700Bold",
  },
  registerContainer: {
    marginTop: 32,
    alignItems: "center",
  },
  registerText: {
    color: "rgba(232,237,245,0.55)",
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
  },
  registerTextBold: {
    color: "#00B37E",
    fontFamily: "DMSans_700Bold",
  },
});
