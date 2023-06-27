import React, { useState, useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { AuthContext } from "../navigation/AuthProvider";

const QrScreen = () => {
  const { user } = useContext(AuthContext);

  return (
    <View style={styles.Container}>
      <Text style={styles.caption}>Escanear codigo para iniciar sesion.</Text>
      <QRCode
        value={user?.uid}
        logo={require("../assets/icon-noexlogo.png")}
        logoSize={50}
        logoBackgroundColor="transparent"
        size={250}
      />
      <Text style={styles.userInfoTitleId}>id: {user?.uid}</Text>
    </View>
  );
};
export default QrScreen;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: "#f0f3f5",
    justifyContent: "center",
    alignItems: "center",
  },
  caption: {
    fontSize: 20,
    marginBottom: 20,
  },
  userInfoTitleId: {
    color: "silver",
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5,
    marginTop: 20,
    textAlign: "center",
  },
});
