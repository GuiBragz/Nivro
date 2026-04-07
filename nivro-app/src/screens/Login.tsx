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
import { useAuth } from "../contexts/AuthContext";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const { signIn } = useAuth();

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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121214", // Tema Dark por padrão, claro!
    justifyContent: "center",
    padding: 32,
  },
  header: {
    marginBottom: 48,
  },
  title: {
    color: "#00B37E", // Verde financeiro
    fontSize: 48,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    color: "#C4C4CC",
    fontSize: 16,
  },
  form: {
    gap: 16, // Espaçamento automático entre os inputs
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
});
