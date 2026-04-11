import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Login } from "../screens/Login";
import { Register } from "../screens/Register";
import { ForgotPassword } from "../screens/ForgotPassword"; // 👈 Importamos a tela nova

const { Navigator, Screen } = createNativeStackNavigator();

export function AuthRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="login" component={Login} />
      <Screen name="register" component={Register} />
      {/* 👇 Adicionamos a rota de recuperação 👇 */}
      <Screen name="forgotPassword" component={ForgotPassword} />
    </Navigator>
  );
}
