import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { api } from "../api/api";

export function Register() {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(false);

  // Estados para os campos do Back-end
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");

  async function handleRegister() {
    if (!email || !password || !fullName || !cpf) {
      return Alert.alert("Cadastro", "Preencha os campos obrigatórios.");
    }

    try {
      setLoading(true);
      await api.post("/users/register", {
        email,
        password,
        full_name: fullName,
        cpf,
        phone,
        birth_date: birthDate, // Formato AAAA-MM-DD
      });

      Alert.alert("Sucesso", "Conta criada! Agora faça seu login.");
      navigation.navigate("login");
    } catch (error: any) {
      const message = error.response?.data?.message || "Erro ao cadastrar.";
      Alert.alert("Erro", message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Criar Conta</Text>
        <Text style={styles.subtitle}>
          Comece a gerenciar suas finanças agora.
        </Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Nome Completo"
          placeholderTextColor="#8D8D99"
          onChangeText={setFullName}
        />
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#8D8D99"
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="CPF (apenas números)"
          placeholderTextColor="#8D8D99"
          keyboardType="numeric"
          onChangeText={setCpf}
        />
        <TextInput
          style={styles.input}
          placeholder="Telefone"
          placeholderTextColor="#8D8D99"
          onChangeText={setPhone}
        />
        <TextInput
          style={styles.input}
          placeholder="Nascimento (Ex: 2000-01-01)"
          placeholderTextColor="#8D8D99"
          onChangeText={setBirthDate}
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#8D8D99"
          secureTextEntry
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Carregando..." : "Cadastrar"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("login")}>
          <Text style={styles.linkText}>Já tem uma conta? Faça login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121214" },
  header: { padding: 24, paddingTop: 80 },
  title: { color: "#FFF", fontSize: 32, fontWeight: "bold" },
  subtitle: { color: "#8D8D99", fontSize: 16, marginTop: 8 },
  form: { padding: 24, gap: 16 },
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
    marginTop: 16,
  },
  buttonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
  linkText: { color: "#8D8D99", textAlign: "center", marginTop: 16 },
});
