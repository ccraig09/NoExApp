import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, Alert } from "react-native";
// import CategoryItem from "../components/CategoryItem";
import PromoDetailItem from "../components/PromoDetailItem";
import Spinner from "react-native-loading-spinner-overlay";

const PromoDetailScreen = ({ route, navigation }) => {
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  //   const [Level1, setLevel1] = useState([]);
  // console.log(points);
  const { promoData, points, coaches, userToken, userInfo } = route.params;
  // console.log("this is promo Data", points);
  //   const data = classes;
  //   console.log("section", data);
  //   console.log("and this the key", classId);
  //   const selectedVideo = data.find((key) => key.key === classId);
  const finalizeHandler = () => {
    Alert.alert(`Canjeaste ${promoData.Points} puntos`, "", [
      {
        text: "Listo",
        style: "default",
        onPress: () => {
          navigation.goBack();
        },
      },
    ]);
  };

  const loadingHandler = () => {
    setIsLoadingSubmit(true);
    console.log("first");
  };
  //   console.log(
  //     "did i find it?",
  //     data.find((key) => key.key === classId)
  //   );
  //   setLevel1(data);
  return (
    <View style={{ flex: 1 }}>
      {/* <Spinner
        //visibility of Overlay Loading Spinner
        visible={isLoadingSubmit}
        //Text with the Spinner
        animation="fade"
        textContent={"Procesando..."}
        //Text style of the Spinner Text
        textStyle={styles.spinnerTextStyle}
      /> */}
      <PromoDetailItem
        image={promoData.userImg}
        title={promoData.Caption}
        subtitle={promoData.Subtitle}
        description={promoData.Description}
        extension={promoData.Extension}
        price={promoData.Points}
        points={points}
        coaches={coaches}
        userToken={userToken}
        userInfo={userInfo}
        setLoading={() => {
          loadingHandler();
        }}
        isLoading={isLoadingSubmit}
        return={() => {
          finalizeHandler();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  FlatList: {
    // justifyContent: "center",å
  },
  spinnerTextStyle: {
    color: "#FFF",
  },
});

export default PromoDetailScreen;
