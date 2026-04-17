import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../api/api"; // 👈 Use sua instância do Axios

interface AiChatModalProps {
  visible: boolean;
  onClose: () => void;
}

export function AiChatModal({ visible, onClose }: AiChatModalProps) {
  const { user } = useAuth();
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const [messages, setMessages] = useState([
    {
      id: "1",
      role: "assistant",
      content: `E aí ${user?.full_name?.split(" ")[0] || "Guilherme"}! Sou o Nivro AI. Como posso te ajudar a poupar hoje?`,
    },
  ]);

  async function handleSend() {
    if (!inputText.trim() || loading) return;

    const userMsg = inputText;
    // Adiciona a mensagem do usuário na tela imediatamente
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role: "user", content: userMsg },
    ]);
    setInputText("");
    setLoading(true);

    try {
      /**
       * 🚀 ESTRATÉGIA PROFISSIONAL:
       * Em vez de chamar a OpenAI/Gemini aqui, chamamos o seu NestJS.
       * A chave (API_KEY) fica guardada lá no servidor, segura.
       */
      const response = await api.post("/ai/chat", {
        message: userMsg,
      });

      // O seu back-end deve retornar apenas o texto da resposta
      const aiText = response.data.content || response.data;

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: aiText,
        },
      ]);

      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    } catch (error: any) {
      console.error("ERRO AO CHAMAR IA:", error);
      Alert.alert(
        "Nivro AI Offline",
        "Não consegui conectar com meu cérebro agora. Tenta de novo?",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          {/* Header - Identidade Visual Nivro (Azul) */}
          <View style={styles.header}>
            <LinearGradient
              colors={["#3B82F6", "#2563EB"]}
              style={styles.iconBox}
            >
              <Feather name="cpu" size={20} color="#FFF" />
            </LinearGradient>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>Nivro AI</Text>
              <Text style={styles.status}>
                Consultor Financeiro Inteligente
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Feather name="x" size={24} color="#E8EDF5" />
            </TouchableOpacity>
          </View>

          {/* Chat Area */}
          <ScrollView
            ref={scrollRef}
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: 20 }}
          >
            {messages.map((msg) => (
              <View
                key={msg.id}
                style={[
                  styles.bubble,
                  msg.role === "user" ? styles.userB : styles.aiB,
                ]}
              >
                <Text style={styles.txt}>{msg.content}</Text>
              </View>
            ))}
            {loading && (
              <View
                style={[
                  styles.bubble,
                  styles.aiB,
                  { width: 60, alignItems: "center" },
                ]}
              >
                <ActivityIndicator size="small" color="#3B82F6" />
              </View>
            )}
          </ScrollView>

          {/* Input Area */}
          <View style={styles.inputArea}>
            <TextInput
              style={styles.input}
              placeholder="Pergunte sobre seus gastos..."
              placeholderTextColor="#666"
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={handleSend}
            />
            <TouchableOpacity
              style={[styles.send, { opacity: loading ? 0.5 : 1 }]}
              onPress={handleSend}
              disabled={loading}
            >
              <Feather name="send" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "flex-end",
  },
  container: {
    height: "85%",
    backgroundColor: "#080A0E",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#1A1A1A",
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  title: { color: "#FFF", fontSize: 16, fontFamily: "DMSans_700Bold" },
  status: { color: "#3B82F6", fontSize: 10 },
  closeBtn: { padding: 5 },
  bubble: { padding: 14, borderRadius: 18, marginBottom: 12, maxWidth: "85%" },
  userB: {
    backgroundColor: "#1A1F26",
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },
  aiB: {
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
  },
  txt: { color: "#E8EDF5", fontSize: 14, lineHeight: 22 },
  inputArea: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#1A1A1A",
    paddingBottom: Platform.OS === "ios" ? 40 : 20,
  },
  input: {
    flex: 1,
    height: 48,
    backgroundColor: "#131820",
    borderRadius: 24,
    paddingHorizontal: 20,
    color: "#FFF",
    fontFamily: "DMSans_400Regular",
  },
  send: {
    marginLeft: 12,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
  },
});
