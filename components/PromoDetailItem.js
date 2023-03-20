import React, { createContext, useState, useContext } from "react";
import {
  FlatList,
  View,
  Dimensions,
  Text,
  Alert,
  ScrollView,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from "react-native";
import styled from "styled-components";
import * as Linking from "expo-linking";
import Colors from "../constants/Colors";
import * as Notifications from "expo-notifications";
import { AuthContext } from "../navigation/AuthProvider";
import OrientationLoadingOverlay from "react-native-orientation-loading-overlay";
// import ReadMore from "react-native-read-more-text";

const screenHeight = Dimensions.get("window").height;
Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
    };
  },
});

const PromoDetailItem = (props, { navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const { user, notificationReceipt, addPoints } = useContext(AuthContext);
  let run;

  // let logoimg = "../assets/icon-noexlogo.png";
  const alertPrompt = (title) => {
    Alert.alert(
      `Canjear Puntos`,
      `Estas seguro de canjear tus puntos por ${title}`,
      [
        { text: "No", style: "destructive" },
        {
          text: "Si",
          style: "default",
          onPress: () => {
            transactionHandler();
          },
        },
      ]
    );
  };
  const transactionHandler = async () => {
    if (props.points < props.price) {
      Alert.alert(`Uh - oh`, "No tienes puntos suficientes", [
        { text: "OK", style: "destructive" },
      ]);
    }
    if (props.points >= props.price) {
      setIsLoadingSubmit(true);

      setTimeout(async () => {
        notifyCoachHandler();
        userNotifyHandler();

        await notificationReceipt(
          props.title,
          props.subtitle,
          props.price,
          props.userInfo.FirstName,
          props.userInfo.LastName
        );
        await addPoints(props.price);
        setIsLoadingSubmit(false);
        props.return();
      }, 3000);
    }
  };

  const notifyCoachHandler = () => {
    const coaches = props.coaches.map((code) => code.expoPushToken);
    console.log("running", run);

    fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: coaches,
        sound: "default",
        // data: { extraData: props.userInfo },
        title: `${props.userInfo.FirstName} ${props.userInfo.LastName} canjeo ${props.price} puntos!`,
        body: `${props.userInfo.FirstName} canjeo ${props.price}  puntos por premio de ${props.subtitle}`,
      }),
    });
  };
  const userNotifyHandler = () => {
    fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: props.userToken,
        sound: "default",
        // data: { extraData: props.userInfo },
        title: `Tu canjeaste ${props.price} puntos!`,
        body: `Canjeaste ${props.price} puntos por premio de ${props.subtitle}`,
      }),
    });
  };
  // if (isLoadingSubmit) {
  //   return (
  //     <View
  //       style={{
  //         flex: 1,
  //         position: "absolute",
  //         left: 0,
  //         right: 0,
  //         top: 0,
  //         bottom: 0,
  //         alignItems: "center",
  //         justifyContent: "center",
  //         backgroundColor: "#F5FCFF88",
  //       }}
  //     >
  //       <ActivityIndicator color={"black"} size="large" />
  //     </View>
  //   );
  // }
  const _renderTruncatedFooter = (handlePress) => {
    return (
      <Text style={{ color: "#0A50E0", marginTop: 5 }} onPress={handlePress}>
        Leer mas
      </Text>
    );
  };

  const _renderRevealedFooter = (handlePress) => {
    return (
      <Text
        style={{ color: "#0A50E0", marginVertical: 5 }}
        onPress={handlePress}
      >
        Mostrar menos
      </Text>
    );
  };
  return (
    <View style={styles.Container}>
      <OrientationLoadingOverlay
        visible={isLoadingSubmit}
        color="white"
        indicatorSize="large"
        messageFontSize={24}
        message="Procesando..."
      />
      <View style={styles.Cover}>
        <Image
          style={styles.Image}
          source={{ uri: props.image }}
          onLoadStart={() => setIsLoading(true)}
          onLoadEnd={() => setIsLoading(false)}
        />

        <ActivityIndicator
          style={{ alignSelf: "center", marginTop: 70 }}
          size="small"
          color="black"
          animating={isLoading}
        />
        <View style={styles.Wrapper}></View>
      </View>
      <ScrollView style={{ flex: 1, marginHorizontal: 10, marginBottom: 10 }}>
        <Subtitle>{props.title}</Subtitle>
        <Text
          style={{
            textAlign: "center",
            fontSize: 17,
            fontWeight: "bold",
            marginTop: 15,
          }}
        >
          {props.subtitle}
        </Text>

        {/* <View
          style={{ height: "25%", marginHorizontal: 15, marginVertical: 10 }}
        > */}
        {/* <ScrollView style={{ marginHorizontal: 5 }}>
         */}
        {/* <ReadMore
          numberOfLines={1}
          renderTruncatedFooter={_renderTruncatedFooter}
          renderRevealedFooter={_renderRevealedFooter}
          // onReady={this._handleTextReady}
        > */}
        <Text style={{ alignSelf: "center", fontSize: 20 }}>
          {props.description}
        </Text>
        <TouchableOpacity onPress={() => Linking.openURL(props.extension)}>
          <Text style={{ textDecorationLine: "underline", color: "blue" }}>
            {props.extension}
          </Text>
        </TouchableOpacity>
        {/* </ReadMore> */}
        {/* </ScrollView> */}
        {/* </View> */}
        <View style={{ marginTop: 15 }}>
          <Text
            style={{
              alignSelf: "center",
              fontWeight: "bold",
              fontSize: 28,
            }}
          >
            Puntos Acumulados: {props.points}
          </Text>
          <TouchableOpacity
            style={styles.commandButton}
            onPress={() => {
              alertPrompt(props.subtitle);
            }}
          >
            <Text style={styles.panelButtonTitle}>Canjear Puntos</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const Subtitle = styled.Text`
  color: #cd9a21;
  font-weight: bold;

  font-size: 30px;
  text-align: center;
  margin-left: 20px;
  margin-top: 20px;
  text-transform: uppercase;
`;

const styles = StyleSheet.create({
  commandButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: Colors.noExprimary,
    alignItems: "center",
    marginTop: 10,
    marginHorizontal: 15,
    // marginBottom: "30%",
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "white",
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: Colors.noExprimary,
    alignItems: "center",
    alignSelf: "center",
    marginVertical: 7,
    width: 200,
  },
  Container: {
    flex: 1,
  },
  Cover: {
    height: screenHeight / 2.3,
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  Image: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  PlayWrapper: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -40,
    marginLeft: -40,
  },
  PlayView: {
    width: 80,
    height: 80,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  Wrapper: {
    flexDirection: "row",
    position: "absolute",
    top: 40,
    left: 20,
    alignItems: "center",
  },
  Logo: {
    width: 24,
    height: 24,
  },
  Subtitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.8)",
    marginLeft: 5,
    textTransform: "uppercase",
  },
});

export default PromoDetailItem;
