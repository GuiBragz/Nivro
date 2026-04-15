import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Platform, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";

import { Home } from "../screens/Home";
import { Profile } from "../screens/Profile";
import { NewTransaction } from "../screens/NewTransaction";
import { Investments } from "../screens/Investments";
import { NewAccount } from "../screens/NewAccount";

const Tab = createBottomTabNavigator();

function CustomNewTransactionButton({ onPress, style }: any) {
  return (
    <View style={style}>
      <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
        <LinearGradient
          colors={["#00B37E", "#00D496"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            top: -20,
            justifyContent: "center",
            alignItems: "center",
            width: 52,
            height: 52,
            borderRadius: 18,
            elevation: 8,
            shadowColor: "#00B37E",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.4,
            shadowRadius: 12,
          }}
        >
          <Feather name="plus" size={24} color="#FFF" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
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
          marginBottom: Platform.OS === "ios" ? 0 : 8,
        },
        tabBarStyle: {
          backgroundColor: "#0D1017",
          borderTopWidth: 1,
          borderTopColor: "rgba(255,255,255,0.04)",
          height: Platform.OS === "android" ? 70 : 85,
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
            <Feather name="home" size={20} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Transactions"
        component={Home}
        options={{
          tabBarLabel: "Transações",
          tabBarIcon: ({ color }) => (
            <Feather name="list" size={20} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="New"
        component={NewTransaction}
        options={{
          tabBarLabel: "",
          tabBarStyle: { display: "none" },
          tabBarButton: (props) => <CustomNewTransactionButton {...props} />,
        }}
      />

      <Tab.Screen
        name="Investments"
        component={Investments}
        options={{
          tabBarLabel: "Investir",
          tabBarIcon: ({ color }) => (
            <Feather name="trending-up" size={20} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: "Perfil",
          tabBarIcon: ({ color }) => (
            <Feather name="user" size={20} color={color} />
          ),
        }}
      />
      {/* 👈 O ERRO ESTAVA AQUI: Faltou esse "/>" no seu código! */}

      <Tab.Screen
        name="NewAccount"
        component={NewAccount}
        options={{
          tabBarButton: () => null,
          tabBarStyle: { display: "none" },
        }}
      />
    </Tab.Navigator>
  );
}
