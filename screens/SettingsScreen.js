import React, { useState, useEffect, useCallback, useContext } from "react";
import { View, StyleSheet, Button, Alert } from "react-native";
import { AuthContext } from "../navigation/AuthProvider";
import { getAuth, deleteUser } from "firebase/auth";

// import { useDispatch } from "react-redux";
// import * as authActions from "../store/actions/auth";

const SettingsScreen = (props) => {
  const { user, logout } = useContext(AuthContext);

  const deleteUserHandler = () => {
    Alert.alert("Estas seguro?", "Perderás todos tus datos", [
      {
        text: "No",
        style: "default",
      },
      {
        text: "Si",
        style: "destructive",
        onPress: () => {
          deleteUser(user)
            .then(() => {})
            .catch((error) => {
              throw error;
            });
        },
      },
    ]);
  };
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

      <View style={{ position: "absolute", bottom: 0, marginBottom: 20 }}>
        <Button
          color={"red"}
          title="Borrar Cuenta"
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
                  deleteUserHandler();
                },
              },
            ]);
          }}
        />
      </View>
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
