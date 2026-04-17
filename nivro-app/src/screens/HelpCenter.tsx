import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export function HelpCenter() {
  const navigation = useNavigation<any>();

  const faqs = [
    {
      q: "Como adiciono uma nova conta?",
      a: "Vá na aba Início, clique em 'Nova Conta' no cartão principal e preencha os dados da sua instituição.",
    },
    {
      q: "O Nivro é seguro?",
      a: "Sim! Utilizamos criptografia de ponta a ponta e nunca armazenamos suas senhas bancárias em nossos servidores.",
    },
    {
      q: "Como o Open Finance funciona?",
      a: "Ele permite sincronizar seus extratos automaticamente (em breve disponível). Você tem controle total para revogar o acesso quando quiser.",
    },
  ];

  function handleContactSupport() {
    // Aqui você pode colocar um link de WhatsApp ou e-mail real
    Linking.openURL("mailto:suporte@nivro.com");
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color="#E8EDF5" />
        </TouchableOpacity>
        <Text style={styles.title}>Central de Ajuda</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contactCard}>
          <View style={styles.contactIcon}>
            <Feather name="headphones" size={24} color="#00B37E" />
          </View>
          <Text style={styles.contactTitle}>Precisa falar com humanos?</Text>
          <Text style={styles.contactDesc}>
            Nosso time de suporte está pronto para te ajudar com qualquer
            problema.
          </Text>
          <TouchableOpacity activeOpacity={0.8} onPress={handleContactSupport}>
            <LinearGradient
              colors={["#00B37E", "#00D496"]}
              style={styles.contactBtn}
            >
              <Text style={styles.contactBtnText}>Chamar no Suporte</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>DÚVIDAS FREQUENTES</Text>

        {faqs.map((faq, index) => (
          <View key={index} style={styles.faqCard}>
            <View style={styles.faqHeader}>
              <Feather
                name="help-circle"
                size={18}
                color="rgba(232,237,245,0.7)"
                style={{ marginRight: 10 }}
              />
              <Text style={styles.faqQ}>{faq.q}</Text>
            </View>
            <Text style={styles.faqA}>{faq.a}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
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
  title: { fontSize: 18, color: "#E8EDF5", fontFamily: "DMSans_700Bold" },
  content: { padding: 24 },

  contactCard: {
    backgroundColor: "rgba(0,179,126,0.05)",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(0,179,126,0.2)",
    marginBottom: 40,
    alignItems: "center",
  },
  contactIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(0,179,126,0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  contactTitle: {
    fontSize: 18,
    color: "#E8EDF5",
    fontFamily: "DMSans_700Bold",
    marginBottom: 8,
  },
  contactDesc: {
    fontSize: 13,
    color: "rgba(232,237,245,0.55)",
    fontFamily: "DMSans_400Regular",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  contactBtn: { paddingHorizontal: 24, paddingVertical: 14, borderRadius: 14 },
  contactBtnText: {
    color: "#0D1017",
    fontSize: 14,
    fontFamily: "DMSans_700Bold",
  },

  sectionTitle: {
    fontSize: 11,
    color: "rgba(232,237,245,0.3)",
    fontFamily: "DMSans_700Bold",
    letterSpacing: 1.5,
    marginBottom: 16,
    marginLeft: 8,
  },
  faqCard: {
    backgroundColor: "#131820",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.03)",
  },
  faqHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  faqQ: {
    fontSize: 14,
    color: "#E8EDF5",
    fontFamily: "DMSans_700Bold",
    flex: 1,
  },
  faqA: {
    fontSize: 13,
    color: "rgba(232,237,245,0.55)",
    fontFamily: "DMSans_400Regular",
    lineHeight: 20,
    paddingLeft: 28,
  },
});
