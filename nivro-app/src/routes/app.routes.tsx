import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text, Platform, TouchableOpacity } from "react-native";

// Importando as nossas telas
import { Home } from "../screens/Home";
import { Profile } from "../screens/Profile";
import { NewTransaction } from "../screens/NewTransaction";

const Tab = createBottomTabNavigator();

// 👇 OLHA A MÁGICA AQUI: Adicionei o "style" nas propriedades
function CustomNewTransactionButton({ onPress, style }: any) {
  return (
    // 👇 E passei o style para essa View em volta de tudo
    <View style={style}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        style={{
          top: -25,
          justifyContent: "center",
          alignItems: "center",
          width: 65,
          height: 65,
          borderRadius: 32.5,
          backgroundColor: "#00B37E",
          elevation: 5,
          shadowColor: "#00B37E",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
        }}
      >
        <Text
          style={{
            color: "#FFF",
            fontSize: 35,
            fontWeight: "bold",
            marginTop: -4,
          }}
        >
          +
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export function AppRoutes() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#202024",
          borderTopWidth: 0,
          height: Platform.OS === "android" ? 90 : 100,
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0,
          paddingBottom: Platform.OS === "android" ? 0 : 30,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ focused }) => (
            <Text
              style={{ color: focused ? "#00B37E" : "#8D8D99", fontSize: 22 }}
            >
              🏠
            </Text>
          ),
        }}
      />

      <Tab.Screen
        name="New"
        component={NewTransaction}
        options={{
          tabBarStyle: { display: "none" },
          tabBarButton: (props) => <CustomNewTransactionButton {...props} />,
        }}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ focused }) => (
            <Text
              style={{ color: focused ? "#00B37E" : "#8D8D99", fontSize: 22 }}
            >
              👤
            </Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}
