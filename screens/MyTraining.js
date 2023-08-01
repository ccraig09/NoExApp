import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Linking,
} from "react-native";
import React, { useState } from "react";
import Colors from "../constants/Colors";
import CustomButton from "../components/UI/CustomButton";
import Icon from "react-native-vector-icons/Ionicons";

import * as FileSystem from "expo-file-system";

const MyTraining = ({ route, navigation }) => {
  const { userInfo } = route.params;
  const [pdfFile, setPdfFile] = useState(null);
  const [showPdf, setshowPdf] = useState(false);

  const whatsappUrl = "https://wa.me/message/3QK6FJJWOB7DP1";

  const onPressHandler = async () => {
    userInfo.pdf
      ? navigation.navigate("WebView", { link: userInfo.pdf })
      : alert(
          "No tienes un entrenmiento personalizado aun. Por favor contacta a tu entrenador"
        );
  };

  const onNewProgramPress = () => {
    alert("Proximamente");
  };
  const onFoodPlanPress = () => {
    userInfo.diet
      ? navigation.navigate("WebView", { link: userInfo.diet })
      : alert(
          "No tienes un plan de alimentacion aun. Por favor contacta a tu entrenador"
        );
  };

  const onContactPress = () => {
    Linking.openURL(whatsappUrl);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        style={styles.image}
        source={require("../assets/kiki-circle.png")}
      />
      <Image style={styles.imageSig} source={require("../assets/sigPic.png")} />
      <Text style={styles.caption}>
        Soy Kimberly {" \n "} tu entrenadora personal
      </Text>
      <CustomButton
        btnText={"ACCEDER A UN NUEVO PROGRAMA DE ENTRENAMIENTO"}
        onPress={onNewProgramPress}
      />
      <CustomButton
        btnText={"MI PROGRAMA DE ENTRENAMIENTO"}
        onPress={onPressHandler}
      />
      <CustomButton
        btnText={"MI PLAN DE ALIMENTACION"}
        onPress={onFoodPlanPress}
      />
      <CustomButton btnText={"CONTÁCTAME"} onPress={onContactPress} />
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <View style={styles.buttonRow}>
          <Icon name={"chevron-back-circle-outline"} size={30} color="black" />
          <Text style={styles.buttonText}>Volver</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default MyTraining;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  image: {
    width: 200,
    height: 200,
  },
  imageSig: {
    width: 150,
    height: 60,
  },
  caption: {
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 20,
  },
});
