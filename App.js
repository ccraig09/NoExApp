import React from "react";
import "react-native-gesture-handler";
import Providers from "./navigation";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";

import { LogBox } from "react-native";

SplashScreen.preventAutoHideAsync();
LogBox.ignoreLogs(["Setting a timer for a long period of time"]);

export default function App() {
  const [fontsLoaded] = useFonts({
    aliens: require("./assets/fonts/aliens.ttf"),
    "Kufam-SemiBoldItalic": require("./assets/fonts/Kufam-SemiBoldItalic.ttf"),
    "Lato-Bold": require("./assets/fonts/Lato-Bold.ttf"),
    "Lato-BoldItalic": require("./assets/fonts/Lato-BoldItalic.ttf"),
    "Lato-Italic": require("./assets/fonts/Lato-Italic.ttf"),
    "Lato-Regular": require("./assets/fonts/Lato-Regular.ttf"),
    "open-sans": require("./assets/fonts/OpenSans-Regular.ttf"),
    "open-sans-bold": require("./assets/fonts/OpenSans-Bold.ttf"),
  });

  if (fontsLoaded) {
    SplashScreen.hideAsync();
  }

  if (!fontsLoaded) {
    return null;
  }
  return <Providers />;
}
