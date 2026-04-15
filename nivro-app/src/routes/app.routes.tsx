import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Platform, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";

import { Home } from "../screens/Home";
import { Profile } from "../screens/Profile";
import { NewTransaction } from "../screens/NewTransaction";
import { Investments } from "../screens/Investments";
import { NewAccount } from "../screens/NewAccount";
import { Transactions } from "../screens/Transactions";

const Tab = createBottomTabNavigator();

// 👇 O botão corrigido: sem View em volta, sem flex: 1, só uma margem para empurrar os vizinhos
function CustomNewTransactionButton({ onPress }: any) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={{
        top: -20, // Subiu o botão
        justifyContent: "center",
        alignItems: "center",
        width: 60, // Largura fixa
        marginHorizontal: 10, // 👈 Isso aqui é o que garante o espaçamento igual pros lados
      }}
    >
      <LinearGradient
        colors={["#00B37E", "#00D496"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: 56,
          height: 56,
          borderRadius: 20,
          justifyContent: "center",
          alignItems: "center",
          elevation: 8,
          shadowColor: "#00B37E",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.4,
          shadowRadius: 12,
        }}
      >
        <Feather name="plus" size={26} color="#FFF" />
      </LinearGradient>
    </TouchableOpacity>
  );
}

export function AppRoutes() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: "#00B37E",
        tabBarInactiveTintColor: "rgba(232,237,245,0.3)",
        tabBarLabelStyle: {
          fontFamily: "DMSans_500Medium",
          fontSize: 10,
          marginBottom: Platform.OS === "ios" ? 0 : 6,
        },
        tabBarStyle: {
          backgroundColor: "#0D1017",
          borderTopWidth: 1,
          borderTopColor: "rgba(255,255,255,0.04)",
          height: Platform.OS === "android" ? 100 : 85,
          paddingTop: Platform.OS === "android" ? 8 : 10,
          paddingBottom: Platform.OS === "android" ? 8 : 25,
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: "Início",
          tabBarIcon: ({ color }) => (
            <Feather name="home" size={22} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Transactions"
        component={Transactions}
        options={{
          tabBarLabel: "Transações",
          tabBarIcon: ({ color }) => (
            <Feather name="list" size={22} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="New"
        component={NewTransaction}
        options={{
          tabBarLabel: "",
          tabBarButton: (props) => <CustomNewTransactionButton {...props} />,
        }}
      />

      <Tab.Screen
        name="Investments"
        component={Investments}
        options={{
          tabBarLabel: "Investir",
          tabBarIcon: ({ color }) => (
            <Feather name="trending-up" size={22} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: "Perfil",
          tabBarIcon: ({ color }) => (
            <Feather name="user" size={22} color={color} />
          ),
        }}
      />

      {/* 👇 A correção do flex fantasma está AQUI no tabBarItemStyle 👇 */}
      <Tab.Screen
        name="NewAccount"
        component={NewAccount}
        options={{
          tabBarItemStyle: { display: "none" }, // Isso resolve o botão torto
          tabBarButton: () => null,
          tabBarStyle: { display: "none" }, // Esconde a barra quando a tela abre
        }}
      />
    </Tab.Navigator>
  );
}
