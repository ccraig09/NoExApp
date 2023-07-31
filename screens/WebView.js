import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState, useRef } from "react";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import Colors from "../constants/Colors";
import Icon from "react-native-vector-icons/Ionicons";

const WebViewScreen = ({ route, navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showBackButton, setSetShowBackButton] = useState(false);
  const webViewRef = useRef();

  const { link } = route.params;
  console.log(link);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View style={styles.buttonRow}>
            <Icon
              name={"chevron-back-circle-outline"}
              size={30}
              color="black"
            />
            <Text style={styles.buttonText}>Perfil</Text>
          </View>
        </TouchableOpacity>
        {showBackButton && (
          <TouchableOpacity onPress={() => webViewRef.current.goBack()}>
            <View style={styles.buttonRow}>
              <Icon
                name={"chevron-back-circle-outline"}
                size={30}
                color="black"
              />
              <Text style={styles.buttonText}>Volver al plan</Text>
            </View>
          </TouchableOpacity>
        )}
        {isLoading && (
          <View>
            <ActivityIndicator size="large" color="black" />
            <Text style={{ textAlign: "center" }}>Cargando...</Text>
          </View>
        )}
        <WebView
          ref={webViewRef}
          source={{ uri: link }}
          onNavigationStateChange={(navState) => {
            setSetShowBackButton(navState.canGoBack);
          }}
          onLoadStart={() => {
            setIsLoading(true);
          }}
          onLoadEnd={() => {
            setIsLoading(false);
          }}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default WebViewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 20,
    color: Colors.noExprimary,
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 5,
  },
  buttonText: {
    fontSize: 20,
  },
});
