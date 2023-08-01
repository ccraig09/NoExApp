import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "../screens/SplashScreen";
import SignupScreen from "../screens/SignupScreen";
import LoginScreen from "../screens/LoginScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import OnboardingScreen from "../screens/OnboardingScreen";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { Navigator, Screen } = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
      <Screen name="Splash" component={SplashScreen} />
      <Screen
        name="Login"
        component={LoginScreen}
        options={({ navigation }) => ({
          title: "",
          headerShown: false,
          headerStyle: {
            backgroundColor: "#f9fafd",
            shadowColor: "#f9fafd",
            elevation: 0,
          },
          headerLeft: () => (
            <View style={{ marginLeft: 10 }}>
              <FontAwesome.Button
                name="long-arrow-left"
                size={25}
                backgroundColor="#f9fafd"
                color="#333"
                onPress={() => navigation.navigate("Signup")}
              />
            </View>
          ),
        })}
      />
      <Screen
        name="Signup"
        component={SignupScreen}
        options={{ header: () => null }}
      />
      <Screen
        name="Forgot"
        component={ForgotPasswordScreen}
        options={({ navigation }) => ({
          title: "",
          headerStyle: {
            backgroundColor: "#f9fafd",
            shadowColor: "#f9fafd",
            elevation: 0,
          },
          headerLeft: () => (
            <View style={{ marginLeft: 10 }}>
              <FontAwesome.Button
                name="long-arrow-left"
                size={25}
                backgroundColor="#f9fafd"
                color="#333"
                onPress={() => navigation.navigate("Login")}
              />
            </View>
          ),
        })}
      />
    </Navigator>
  );
};

export default AuthStack;
