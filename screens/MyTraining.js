import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  Linking,
} from "react-native";
import React, { useState } from "react";
import Colors from "../constants/Colors";
import CustomButton from "../components/UI/CustomButton";

import * as FileSystem from "expo-file-system";
import Pdf from "react-native-pdf";

const MyTraining = ({ route }) => {
  const { userInfo } = route.params;
  const [pdfFile, setPdfFile] = useState(null);
  const [showPdf, setshowPdf] = useState(false);

  const whatsappUrl = "https://wa.me/message/3QK6FJJWOB7DP1";

  const onPressHandler = async () => {
    const fileUri = `${FileSystem.documentDirectory}${"tempFile"}`;
    const downloadedFile = await FileSystem.downloadAsync(
      userInfo.pdf,
      fileUri
    );

    setPdfFile(downloadedFile);
    setshowPdf(true);

    console.log(">>>uinfo", downloadedFile.uri);
  };

  const onNewProgramPress = () => {
    alert("Proximamente");
  };
  const onFoodPlanPress = () => {
    alert("Proximamente");
  };

  const onContactPress = () => {
    Linking.openURL(whatsappUrl);
  };

  return (
    <SafeAreaView style={styles.container}>
      {showPdf ? (
        <Pdf
          source={pdfFile}
          onLoadComplete={(numberOfPages, filePath) => {
            console.log(`Number of pages: ${numberOfPages}`);
          }}
          onPageChanged={(page, numberOfPages) => {
            console.log(`Current page: ${page}`);
          }}
          onError={(error) => {
            console.log(error);
          }}
          onPressLink={(uri) => {
            console.log(`Link pressed: ${uri}`);
          }}
          style={styles.pdf}
        />
      ) : (
        <View>
          <Image
            style={styles.image}
            source={require("../assets/kiki-circle.png")}
          />
          <Image
            style={styles.imageSig}
            source={require("../assets/sigPic.png")}
          />
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
        </View>
      )}
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
});
