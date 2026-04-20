import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Login } from "../screens/Login";
import { Register } from "../screens/Register";
import { ForgotPassword } from "../screens/ForgotPassword";
import { LegalTerms } from "../screens/LegalTerms";

const { Navigator, Screen } = createNativeStackNavigator();

export function AuthRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="login" component={Login} />
      <Screen name="register" component={Register} />
      <Screen name="forgotPassword" component={ForgotPassword} />
      <Screen name="LegalTerms" component={LegalTerms} />
    </Navigator>
  );
}
