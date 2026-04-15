import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { api } from "../api/api";

const PRESET_COLORS = ["#00B37E", "#F75A68", "#3B82F6", "#F7C948", "#A78BFA"];

export function NewCategory() {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [colorHex, setColorHex] = useState(PRESET_COLORS[0]);
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    if (!name.trim()) {
      return Alert.alert("Ops", "Digite o nome da categoria.");
    }

    try {
      setLoading(true);
      await api.post("/transactions/tags", {
        name: name.trim(),
        color_hex: colorHex,
      });
      Alert.alert("Sucesso", "Categoria criada com sucesso!");
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível criar a categoria.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Feather name="arrow-left" size={24} color="#E8EDF5" />
        </TouchableOpacity>
        <Text style={styles.title}>Nova Categoria</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>NOME DA CATEGORIA</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Alimentação, Lazer..."
            placeholderTextColor="rgba(232,237,245,0.3)"
            value={name}
            onChangeText={setName}
            autoFocus
          />
        </View>

        {/* 👇 SELETOR DE CORES ADICIONADO AQUI 👇 */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>COR DA ETIQUETA</Text>
          <View style={styles.colorRow}>
            {PRESET_COLORS.map((color) => (
              <TouchableOpacity
                key={color}
                onPress={() => setColorHex(color)}
                style={[
                  styles.colorCircle,
                  { backgroundColor: color },
                  colorHex === color && styles.colorCircleActive,
                ]}
              >
                {colorHex === color && (
                  <Feather name="check" size={16} color="#FFF" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleSave}
          disabled={loading}
        >
          <LinearGradient
            colors={["#00B37E", "#00D496"]}
            style={styles.saveBtn}
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.saveBtnText}>Criar Categoria</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0D1017" },
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
  title: { color: "#E8EDF5", fontSize: 18, fontFamily: "DMSans_700Bold" },
  form: { padding: 24 },
  inputGroup: { marginBottom: 24 },
  inputLabel: {
    fontSize: 12,
    color: "rgba(232,237,245,0.55)",
    fontFamily: "DMSans_700Bold",
    marginBottom: 10,
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
  },

  // Estilos das Cores
  colorRow: { flexDirection: "row", gap: 16, marginTop: 8 },
  colorCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  colorCircleActive: { borderColor: "#FFF", transform: [{ scale: 1.1 }] },

  saveBtn: {
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },
  saveBtnText: { color: "#000", fontSize: 16, fontFamily: "DMSans_700Bold" },
});
