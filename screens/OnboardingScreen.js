import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { AuthContext } from "../navigation/AuthProvider";
// import OnBoarding from "react-native-onboarding-swiper";
import Colors from "../constants/Colors";

const Skip = ({ ...props }) => (
  <Button title="Omitir" color="#000000" {...props} />
);
const Next = ({ ...props }) => (
  <Button title="Siguiente" color="#000000" {...props} />
);
const Done = ({ ...props }) => (
  <Button title="Listo" color="#000000" {...props} />
);

const OnboardingScreen = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);
  return (
    <View></View>
    // <OnBoarding
    //   SkipButtonComponent={Skip}
    //   onSkip={() => {
    //     navigation.replace("Home");
    //   }}
    //   onDone={() => {
    //     navigation.navigate("Home");
    //   }}
    //   NextButtonComponent={Next}
    //   DoneButtonComponent={Done}
    //   pages={[
    //     {
    //       backgroundColor: Colors.noExprimary,
    //       titleStyles: {
    //         color: "red",
    //         position: "absolute",
    //         bottom: 200,
    //         alignSelf: "center",
    //       },

    //       title: (
    //         <TouchableOpacity
    //           style={{
    //             position: "absolute",
    //             alignSelf: "center",
    //             top: 30,
    //             right: 20,
    //           }}
    //         >
    //           <Text style={{ color: "red", fontSize: 40 }}>Bienvenido</Text>
    //         </TouchableOpacity>
    //       ),
    //       image: (
    //         <Image
    //           style={styles.image}
    //           source={require("../assets/icon-noexlogo.png")}
    //         />
    //       ),
    //       subtitle: "Hello",
    //     },
    //     {
    //       backgroundColor: "blue",
    //       image: (
    //         <Image
    //           style={styles.image}
    //           source={require("../assets/icon-noexlogo.png")}
    //         />
    //       ),
    //       title: "Aqui vamos a",
    //       subtitle: (
    //         <View>
    //           <Text>Age</Text>
    //           <TextInput
    //             style={{
    //               height: 40,
    //               borderColor: "gray",
    //               borderWidth: 1,
    //               borderRadius: 5,
    //               padding: 5,
    //               width: 80,
    //             }}
    //           />
    //         </View>
    //       ),
    //     },
    //     {
    //       backgroundColor: "green",
    //       image: (
    //         <Image
    //           style={styles.image}
    //           source={require("../assets/icon-noexlogo.png")}
    //         />
    //       ),
    //       title: "blah blah",
    //       subtitle: "yadda yadda",
    //     },
    //   ]}
    // />
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    height: 80,
    width: 80,
  },
});

export default OnboardingScreen;
