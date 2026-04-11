import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native"; // 👈 Adicionamos a navegação
import { useAuth } from "../contexts/AuthContext";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const { signIn } = useAuth();
  const navigation = useNavigation<any>(); // 👈 Inicializamos a navegação

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert("Atenção", "Preencha todos os campos.");
      return;
    }

    setIsLoggingIn(true);
    try {
      await signIn(email, password);
    } catch (error) {
      Alert.alert("Erro", "E-mail ou senha incorretos.");
    } finally {
      setIsLoggingIn(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Nivro</Text>
        <Text style={styles.subtitle}>O controle financeiro na sua mão.</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#888"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#888"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={isLoggingIn}
        >
          {isLoggingIn ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Entrar</Text>
          )}
        </TouchableOpacity>

        {/* 👇 Novos botões de navegação 👇 */}
        <TouchableOpacity onPress={() => navigation.navigate("forgotPassword")}>
          <Text style={styles.forgotPasswordText}>Esqueci minha senha</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121214",
    justifyContent: "center",
    padding: 32,
  },
  header: {
    marginBottom: 48,
  },
  title: {
    color: "#00B37E",
    fontSize: 48,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    color: "#C4C4CC",
    fontSize: 16,
  },
  form: {
    gap: 16,
  },
  input: {
    backgroundColor: "#202024",
    color: "#FFF",
    height: 56,
    borderRadius: 8,
    paddingHorizontal: 16,
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
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  forgotPasswordText: {
    color: "#00B37E",
    textAlign: "center",
    marginTop: 8,
    fontSize: 14,
    fontWeight: "600",
  },
  registerContainer: {
    marginTop: 24,
    alignItems: "center",
  },
  registerText: {
    color: "#8D8D99",
    fontSize: 14,
  },
  registerTextBold: {
    color: "#FFF",
    fontWeight: "bold",
  },
});
