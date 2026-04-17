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
import { NewCategory } from "../screens/NewCategory";
import { EditProfile } from "../screens/EditProfile";
import { Security } from "../screens/Security";
import { Insights } from "../screens/Insights";
import { Privacy } from "../screens/Privacy";
import { Notifications } from "../screens/Notifications";
import { HelpCenter } from "../screens/HelpCenter";
import { LegalTerms } from "../screens/LegalTerms";

const Tab = createBottomTabNavigator();

function CustomNewTransactionButton({ onPress }: any) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={{
        top: -20,
        justifyContent: "center",
        alignItems: "center",
        width: 60,
        marginHorizontal: 10,
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
        name="Insights"
        component={Insights}
        options={{
          tabBarLabel: "Análise",
          tabBarIcon: ({ color }) => (
            <Feather name="pie-chart" size={22} color={color} />
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

      {/* --- TELAS SECUNDÁRIAS (OCULTAS DO MENU) --- */}

      <Tab.Screen
        name="Investments"
        component={Investments}
        options={{
          tabBarItemStyle: { display: "none" },
          tabBarButton: () => null,
          tabBarStyle: { display: "none" },
        }}
      />

      <Tab.Screen
        name="NewAccount"
        component={NewAccount}
        options={{
          tabBarItemStyle: { display: "none" },
          tabBarButton: () => null,
          tabBarStyle: { display: "none" },
        }}
      />

      <Tab.Screen
        name="NewCategory"
        component={NewCategory}
        options={{
          tabBarItemStyle: { display: "none" },
          tabBarButton: () => null,
          tabBarStyle: { display: "none" },
        }}
      />

      <Tab.Screen
        name="EditProfile"
        component={EditProfile}
        options={{
          tabBarItemStyle: { display: "none" },
          tabBarButton: () => null,
          tabBarStyle: { display: "none" },
        }}
      />

      <Tab.Screen
        name="Security"
        component={Security}
        options={{
          tabBarItemStyle: { display: "none" },
          tabBarButton: () => null,
          tabBarStyle: { display: "none" },
        }}
      />
      <Tab.Screen
        name="Privacy"
        component={Privacy}
        options={{
          tabBarItemStyle: { display: "none" },
          tabBarButton: () => null,
          tabBarStyle: { display: "none" },
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={Notifications}
        options={{
          tabBarItemStyle: { display: "none" },
          tabBarButton: () => null,
          tabBarStyle: { display: "none" },
        }}
      />

      <Tab.Screen
        name="HelpCenter"
        component={HelpCenter}
        options={{
          tabBarItemStyle: { display: "none" },
          tabBarButton: () => null,
          tabBarStyle: { display: "none" },
        }}
      />

      <Tab.Screen
        name="LegalTerms"
        component={LegalTerms}
        options={{
          tabBarItemStyle: { display: "none" },
          tabBarButton: () => null,
          tabBarStyle: { display: "none" },
        }}
      />
    </Tab.Navigator>
  );
}
