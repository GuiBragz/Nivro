import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";

export function LegalTerms() {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState<"privacy" | "terms">("privacy");

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Feather name="arrow-left" size={24} color="#E8EDF5" />
        </TouchableOpacity>
        <Text style={styles.title}>Legal e Privacidade</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabBtn,
            activeTab === "privacy" && styles.tabBtnActive,
          ]}
          onPress={() => setActiveTab("privacy")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "privacy" && styles.tabTextActive,
            ]}
          >
            Privacidade (LGPD)
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === "terms" && styles.tabBtnActive]}
          onPress={() => setActiveTab("terms")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "terms" && styles.tabTextActive,
            ]}
          >
            Termos de Uso
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "privacy" ? (
          <View>
            <Text style={styles.lastUpdated}>
              Última atualização: 17 de Abril de 2026
            </Text>

            <Text style={styles.sectionTitle}>1. Coleta de Dados Pessoais</Text>
            <Text style={styles.paragraph}>
              Em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei
              nº 13.709/2018), o Nivro coleta dados estritamente necessários
              para a prestação dos serviços de gestão financeira. Isso inclui
              dados cadastrais (Nome, E-mail, CPF, Foto de Perfil) e dados
              transacionais (valores, datas e descrições de despesas e receitas
              inseridas ou importadas).
            </Text>

            <Text style={styles.sectionTitle}>
              2. Uso de Inteligência Artificial
            </Text>
            <Text style={styles.paragraph}>
              O Nivro utiliza serviços de Inteligência Artificial de terceiros
              para categorização automática de extratos e fornecimento de
              insights financeiros. Ao importar extratos, apenas as descrições
              brutas das transações são processadas pela IA. Seus dados pessoais
              de identificação (como Nome ou CPF) NÃO são enviados em conjunto
              com o extrato bancário para essas APIs externas.
            </Text>

            <Text style={styles.sectionTitle}>
              3. Armazenamento e Segurança
            </Text>
            <Text style={styles.paragraph}>
              Seus dados são criptografados em trânsito e em repouso, utilizando
              a infraestrutura global de nuvem do Supabase. Adotamos as melhores
              práticas da indústria para prevenir acessos não autorizados,
              vazamentos ou destruição de suas informações.
            </Text>

            <Text style={styles.sectionTitle}>
              4. Open Finance e Integrações
            </Text>
            <Text style={styles.paragraph}>
              A funcionalidade de Open Finance só será ativada mediante seu
              consentimento expresso, redirecionando você aos canais oficiais de
              sua instituição financeira. O Nivro opera com modo de leitura, não
              possuindo autorização ou capacidade técnica para movimentar
              fundos, realizar PIX ou transferências em seu nome.
            </Text>

            <Text style={styles.sectionTitle}>5. Seus Direitos (LGPD)</Text>
            <Text style={styles.paragraph}>
              Você tem controle total sobre seus dados. Através da aba
              "Segurança" no aplicativo, você pode exercer seu direito de apagar
              integralmente o histórico de transações ou solicitar a exclusão
              permanente e irreversível de sua conta e de todos os dados
              atrelados a ela em nossos servidores.
            </Text>
          </View>
        ) : (
          <View>
            <Text style={styles.lastUpdated}>
              Última atualização: 17 de Abril de 2026
            </Text>

            <Text style={styles.sectionTitle}>1. Aceitação dos Termos</Text>
            <Text style={styles.paragraph}>
              Ao criar uma conta e utilizar o aplicativo Nivro, você concorda
              legalmente com estes Termos de Uso. Caso não concorde com qualquer
              cláusula, você não deve utilizar nossos serviços.
            </Text>

            <Text style={styles.sectionTitle}>2. O Serviço Nivro</Text>
            <Text style={styles.paragraph}>
              O Nivro é uma ferramenta tecnológica de organização financeira
              pessoal. Nosso objetivo é facilitar a categorização de gastos e o
              acompanhamento de orçamentos. O Nivro NÃO é uma instituição
              financeira, gestora de patrimônio ou corretora de valores.
            </Text>

            <Text style={styles.sectionTitle}>
              3. Isenção de Responsabilidade sobre Dicas
            </Text>
            <Text style={styles.paragraph}>
              O assistente virtual "Nivro AI" gera sugestões com base em
              algoritmos de linguagem natural. As respostas fornecidas pela IA
              têm caráter exclusivamente informativo e educativo, e NÃO
              configuram recomendação profissional de investimento, compra,
              venda ou retenção de ativos. As decisões financeiras são de sua
              exclusiva responsabilidade.
            </Text>

            <Text style={styles.sectionTitle}>
              4. Responsabilidades do Usuário
            </Text>
            <Text style={styles.paragraph}>
              Você é o único responsável por manter a confidencialidade de sua
              senha. É expressamente proibido realizar engenharia reversa no
              aplicativo, tentar burlar nossos sistemas de segurança, ou
              utilizar bots para sobrecarregar nossas APIs.
            </Text>

            <Text style={styles.sectionTitle}>5. Modificações do Serviço</Text>
            <Text style={styles.paragraph}>
              Reservamo-nos o direito de modificar, suspender ou descontinuar
              qualquer recurso do aplicativo, incluindo a remoção ou alteração
              de modelos de Inteligência Artificial, a qualquer momento e sem
              aviso prévio, buscando sempre a melhoria contínua do ecossistema
              Nivro.
            </Text>
          </View>
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#080A0E",
  },
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
  title: {
    color: "#E8EDF5",
    fontSize: 18,
    fontFamily: "DMSans_700Bold",
  },
  tabContainer: {
    flexDirection: "row",
    marginHorizontal: 24,
    backgroundColor: "#131820",
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  tabBtnActive: {
    backgroundColor: "rgba(59,130,246,0.15)",
  },
  tabText: {
    color: "rgba(232,237,245,0.5)",
    fontSize: 14,
    fontFamily: "DMSans_700Bold",
  },
  tabTextActive: {
    color: "#3B82F6",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  lastUpdated: {
    fontSize: 12,
    color: "rgba(232,237,245,0.4)",
    fontFamily: "DMSans_400Regular",
    marginBottom: 24,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    color: "#E8EDF5",
    fontFamily: "DMSans_700Bold",
    marginBottom: 12,
    marginTop: 8,
  },
  paragraph: {
    fontSize: 14,
    color: "rgba(232,237,245,0.7)",
    fontFamily: "DMSans_400Regular",
    lineHeight: 24,
    marginBottom: 24,
    textAlign: "justify",
  },
});
