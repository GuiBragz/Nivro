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
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { api } from "../api/api";
import { useAuth } from "../contexts/AuthContext";

export function EditProfile() {
  const { user } = useAuth();
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(false);

  const initialName = user?.profile?.full_name || user?.full_name || "";

  const [fullName, setFullName] = useState(initialName);
  const [phone, setPhone] = useState(user?.phone || "");
  const [avatarUri, setAvatarUri] = useState(user?.profile?.avatar_url || null);

  // 👇 MÁSCARA DE TELEFONE ADICIONADA AQUI 👇
  const handlePhoneChange = (text: string) => {
    let cleaned = text.replace(/\D/g, "");
    if (cleaned.length > 11) cleaned = cleaned.slice(0, 11);

    let formatted = cleaned;
    if (cleaned.length > 0) formatted = `(${cleaned.slice(0, 2)}`;
    if (cleaned.length > 2) formatted += `) ${cleaned.slice(2, 7)}`;
    if (cleaned.length > 7) formatted += `-${cleaned.slice(7, 11)}`;

    setPhone(formatted);
  };

  async function handlePickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri);
    }
  }

  async function handleSave() {
    if (!fullName.trim())
      return Alert.alert("Ops", "O nome não pode ficar vazio.");

    try {
      setLoading(true);
      await api.put("/users/profile", {
        full_name: fullName,
        phone: phone.replace(/\D/g, ""), // Manda só os números pro banco
      });

      Alert.alert(
        "Sucesso",
        "Perfil atualizado! (Pode ser necessário relogar para ver as mudanças)",
      );
      navigation.goBack();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível atualizar o perfil.");
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
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color="#E8EDF5" />
        </TouchableOpacity>
        <Text style={styles.title}>Editar Perfil</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.avatarSection}>
        <TouchableOpacity
          style={styles.avatarContainer}
          onPress={handlePickImage}
        >
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Feather name="user" size={40} color="#00B37E" />
            </View>
          )}
          <View style={styles.editBadge}>
            <Feather name="camera" size={14} color="#0D1017" />
          </View>
        </TouchableOpacity>
        <Text style={styles.avatarHint}>Toque para alterar a foto</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>NOME COMPLETO</Text>
          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
            placeholderTextColor="rgba(232,237,245,0.3)"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>TELEFONE</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={handlePhoneChange} // 👈 Ligado na máscara aqui
            keyboardType="phone-pad"
            placeholder="(00) 00000-0000"
            placeholderTextColor="rgba(232,237,245,0.3)"
            maxLength={15}
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleSave}
          disabled={loading}
          style={{ marginTop: 20 }}
        >
          <LinearGradient
            colors={["#00B37E", "#00D496"]}
            style={styles.saveBtn}
          >
            {loading ? (
              <ActivityIndicator color="#0D1017" />
            ) : (
              <Text style={styles.saveBtnText}>Salvar Alterações</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  title: { color: "#E8EDF5", fontSize: 18, fontFamily: "DMSans_700Bold" },
  avatarSection: { alignItems: "center", marginTop: 20, marginBottom: 32 },
  avatarContainer: { position: "relative" },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(0,179,126,0.1)",
    borderWidth: 2,
    borderColor: "#00B37E",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#00B37E",
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#00B37E",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#080A0E",
  },
  avatarHint: {
    color: "rgba(232,237,245,0.4)",
    fontSize: 12,
    fontFamily: "DMSans_400Regular",
    marginTop: 12,
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
  saveBtn: {
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  saveBtnText: { color: "#0D1017", fontSize: 16, fontFamily: "DMSans_700Bold" },
});
