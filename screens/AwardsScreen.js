import { StyleSheet, Text, View } from "react-native";
import React from "react";

const AwardsScreen = () => {
  return (
    <View style={styles.Container}>
      <Text>Awards</Text>
    </View>
  );
};

export default AwardsScreen;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: "#f0f3f5",
    justifyContent: "center",
    alignItems: "center",
  },
});
