import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { api } from "../api/api";

export function Register() {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(false);

  // Estados dos Campos
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [password, setPassword] = useState("");

  // Estados dos Novos Controles (Olhinho e Checkbox)
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // --- MÁSCARAS AUTOMÁTICAS ---

  const handleCpfChange = (text: string) => {
    let value = text.replace(/\D/g, ""); // Tira tudo que não é número
    if (value.length > 11) value = value.slice(0, 11); // Limita a 11 números
    value = value.replace(/(\d{3})(\d)/, "$1.$2"); // Coloca o primeiro ponto
    value = value.replace(/(\d{3})(\d)/, "$1.$2"); // Coloca o segundo ponto
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2"); // Coloca o traço
    setCpf(value);
  };

  const handlePhoneChange = (text: string) => {
    let value = text.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);
    value = value.replace(/^(\d{2})(\d)/g, "($1) $2"); // Coloca os parênteses
    value = value.replace(/(\d{5})(\d)/, "$1-$2"); // Coloca o traço
    setPhone(value);
  };

  const handleDateChange = (text: string) => {
    let value = text.replace(/\D/g, "");
    if (value.length > 8) value = value.slice(0, 8);
    value = value.replace(/(\d{2})(\d)/, "$1/$2"); // Coloca a primeira barra
    value = value.replace(/(\d{2})(\d)/, "$1/$2"); // Coloca a segunda barra
    setBirthDate(value);
  };

  // --- VALIDAÇÃO BLINDADA ---
  const validateForm = () => {
    if (!email || !password || !fullName || !cpf || !phone || !birthDate) {
      return "Preencha todos os campos obrigatórios.";
    }

    // 1. Nome sem números
    if (/\d/.test(fullName)) {
      return "O nome não pode conter números.";
    }

    // 2. Email válido (tem que ter @ e .com ou algo parecido)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Insira um endereço de e-mail válido.";
    }

    // 3. Tamanhos das máscaras
    if (cpf.length !== 14) return "Digite o CPF completo.";
    if (phone.length !== 15) return "Digite o telefone com DDD completo.";
    if (birthDate.length !== 10)
      return "A data deve estar no formato DD/MM/AAAA.";

    // 4. Senha e Termos
    if (password.length < 6) return "A senha deve ter no mínimo 6 caracteres.";
    if (!agreedToTerms)
      return "Você precisa concordar com os Termos de Uso e Privacidade.";

    return null; // Se passou por tudo, retorna null (sem erro)
  };

  function showTerms() {
    Alert.alert(
      "Termos de Uso e Privacidade",
      "Estes são os termos temporários do Nivro.\n\n1. Nós não roubamos seus dados.\n2. Você promete não usar a plataforma para lavagem de dinheiro.\n3. Seus dados estão criptografados e seguros.\n\n(Termo completo em desenvolvimento)",
      [{ text: "Entendi", style: "default" }],
    );
  }

  async function handleRegister() {
    // Roda a validação antes de sequer tentar falar com o Back-end
    const errorMessage = validateForm();
    if (errorMessage) {
      return Alert.alert("Atenção", errorMessage);
    }

    try {
      setLoading(true);

      // O Back-end espera a data no formato AAAA-MM-DD. Vamos inverter o que o usuário digitou (DD/MM/AAAA)
      const [day, month, year] = birthDate.split("/");
      const formattedDate = `${year}-${month}-${day}`;

      await api.post("/users/register", {
        email: email.trim(),
        password,
        full_name: fullName.trim(),
        cpf: cpf.replace(/\D/g, ""), // Manda só os números pro banco pra ficar limpo
        phone: phone.replace(/\D/g, ""), // Manda só os números pro banco
        birth_date: formattedDate,
      });

      Alert.alert("Sucesso", "Conta criada! Seja bem-vindo ao Nivro.");
      navigation.navigate("login");
    } catch (error: any) {
      let errorMsg = "Erro ao cadastrar. Tente novamente.";
      const apiMessage = error.response?.data?.message;

      if (apiMessage) {
        if (Array.isArray(apiMessage)) errorMsg = apiMessage.join("\n");
        else if (typeof apiMessage === "string") errorMsg = apiMessage;
      }

      Alert.alert("Erro no Cadastro", errorMsg);
    } finally {
      setLoading(false);
    }
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
          onPress={() => navigation.navigate("login")}
        >
          <Feather name="arrow-left" size={24} color="#E8EDF5" />
        </TouchableOpacity>
        <Text style={styles.title}>Criar Conta</Text>
        <Text style={styles.subtitle}>Sua jornada financeira começa aqui.</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>NOME COMPLETO</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: João da Silva"
            placeholderTextColor="rgba(232,237,245,0.3)"
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>E-MAIL</Text>
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

        <View style={{ flexDirection: "row", gap: 12 }}>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.inputLabel}>CPF</Text>
            <TextInput
              style={styles.input}
              placeholder="000.000.000-00"
              placeholderTextColor="rgba(232,237,245,0.3)"
              keyboardType="numeric"
              value={cpf}
              onChangeText={handleCpfChange}
              maxLength={14}
            />
          </View>

          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.inputLabel}>NASCIMENTO</Text>
            <TextInput
              style={styles.input}
              placeholder="DD/MM/AAAA"
              placeholderTextColor="rgba(232,237,245,0.3)"
              keyboardType="numeric"
              value={birthDate}
              onChangeText={handleDateChange}
              maxLength={10}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>TELEFONE</Text>
          <TextInput
            style={styles.input}
            placeholder="(00) 00000-0000"
            placeholderTextColor="rgba(232,237,245,0.3)"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={handlePhoneChange}
            maxLength={15}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>SENHA</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Mínimo 6 caracteres"
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

        {/* 👇 CHECKBOX DOS TERMOS DE USO 👇 */}
        <TouchableOpacity
          style={styles.termsContainer}
          activeOpacity={0.7}
          onPress={() => setAgreedToTerms(!agreedToTerms)}
        >
          <View
            style={[styles.checkbox, agreedToTerms && styles.checkboxChecked]}
          >
            {agreedToTerms && (
              <Feather name="check" size={14} color="#0D1017" />
            )}
          </View>
          <Text style={styles.termsText}>
            Eu concordo com os{" "}
            <Text style={styles.termsLink} onPress={showTerms}>
              Termos de Uso e Privacidade
            </Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleRegister}
          disabled={loading}
        >
          <LinearGradient
            colors={["#00B37E", "#00D496"]}
            style={styles.saveBtn}
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.saveBtnText}>Finalizar Cadastro</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => navigation.navigate("login")}
        >
          <Text style={styles.linkText}>
            Já tem uma conta?{" "}
            <Text style={styles.linkTextBold}>Faça login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0D1017" },
  header: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 10 },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.05)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: { color: "#E8EDF5", fontSize: 28, fontFamily: "DMSans_700Bold" },
  subtitle: {
    color: "rgba(232,237,245,0.55)",
    fontSize: 15,
    fontFamily: "DMSans_400Regular",
    marginTop: 8,
  },
  form: { padding: 24 },
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

  // Estilos da Senha
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

  // Estilos do Checkbox dos Termos
  termsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    paddingRight: 20,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  checkboxChecked: { backgroundColor: "#00B37E", borderColor: "#00B37E" },
  termsText: {
    color: "rgba(232,237,245,0.55)",
    fontSize: 13,
    fontFamily: "DMSans_400Regular",
    flex: 1,
    lineHeight: 20,
  },
  termsLink: {
    color: "#00B37E",
    fontFamily: "DMSans_700Bold",
    textDecorationLine: "underline",
  },

  saveBtn: {
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  saveBtnText: { color: "#0D1017", fontSize: 16, fontFamily: "DMSans_700Bold" },
  loginLink: { marginTop: 24, alignItems: "center" },
  linkText: {
    color: "rgba(232,237,245,0.55)",
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
  },
  linkTextBold: { color: "#00B37E", fontFamily: "DMSans_700Bold" },
});
