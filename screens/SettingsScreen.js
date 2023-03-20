import React, { useState, useEffect, useCallback, useContext } from "react";
import { View, StyleSheet, Button, Alert } from "react-native";
import { AuthContext } from "../navigation/AuthProvider";

// import { useDispatch } from "react-redux";
// import * as authActions from "../store/actions/auth";

const SettingsScreen = (props) => {
  const { user, logout } = useContext(AuthContext);
  return (
    <View style={styles.screen}>
      <Button
        title="Cerrar sesión"
        onPress={() => {
          Alert.alert("Cerrar sesión?", "", [
            {
              text: "No",
              style: "default",
            },
            {
              text: "Si",
              style: "destructive",
              onPress: () => {
                logout();
              },
            },
          ]);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SettingsScreen;
