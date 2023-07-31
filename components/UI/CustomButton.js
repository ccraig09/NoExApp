import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import Colors from "../../constants/Colors";

const CustomButton = ({ btnText, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => {
        onPress();
      }}
    >
      <Text style={styles.text}>{btnText}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  button: {
    width: 340,
    height: 60,
    backgroundColor: Colors.primaryBtn,
    borderRadius: 18,
    justifyContent: "center",
    marginVertical: 10,
    padding: 5,
  },
  text: {
    alignSelf: "center",
    textAlign: "center",
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});
