import { StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import React, { useEffect, useContext, useState } from "react";
import { Video } from "expo-av";
import CircleButton from "../components/UI/CircleButton";
import Colors from "../constants/Colors";
import * as MediaLibrary from "expo-media-library";
import firebase from "../components/firebase";
import moment from "moment";
import { AuthContext } from "../navigation/AuthProvider";

const ReviewScreen = ({ navigation, route }) => {
  const { videoInfo, classId, classes, video } = route.params;
  const { user, addVideoPoints, updateWatchHistory } = useContext(AuthContext);
  console.log("what is this url review", videoInfo);

  useEffect(() => {
    const today = moment().format("YYYY-MM-DD");

    const fetchWatchHistory = async () => {
      try {
        await firebase
          .firestore()
          .collection("Members")
          .doc(user.uid)
          .collection("Watch History")
          .doc(videoInfo?.Title)
          .get()
          .then((doc) => {
            if (doc.exists) {
              console.log("Document data:", doc.data());
              if (doc.data().lastWatched === today) {
                Alert.alert(
                  "¡Felicidades!",
                  "Ya completaste tus puntos por el día de esta rutina 🙅🏽‍♀️",
                  [{ text: "Listo", onPress: () => console.log("OK Pressed") }]
                );
              } else {
                // doc.data() will be undefined in this case
                console.log("Not same day, giving points");
                addVideoPoints(videoInfo?.points);
                updateWatchHistory(videoInfo?.Title, videoInfo?.points, today);
                Alert.alert(
                  "¡Felicidades!",
                  `Haz ganado ${videoInfo?.points} por tu esfuerzo del día 🙅🏽‍♀️🔥`,
                  [{ text: "Listo", onPress: () => console.log("OK Pressed") }]
                );
              }
            } else {
              // doc.data() will be undefined in this case
              console.log("No such document???");
              addVideoPoints(videoInfo?.points);
              updateWatchHistory(videoInfo?.Title, videoInfo?.points, today);
              Alert.alert(
                "¡Felicidades!",
                `Haz ganado ${videoInfo?.points} por tu esfuerzo del día 🙅🏽‍♀️🔥`,
                [{ text: "Listo", onPress: () => console.log("OK Pressed") }]
              );
            }
          });
      } catch (e) {
        console.log(e);
      }
    };

    fetchWatchHistory();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.buttonRow}>
        <CircleButton
          color={"#4D96FF"}
          onPress={() => {
            navigation.navigate("Section", {
              classId: classId,
              classes: classes,
            });
          }}
          icon={"list"}
          text={"Volver"}
        />
        {/* <CircleButton
          color={"#FEB139"}
          onPress={() => {
            navigation.navigate("Video", {
              selectedVideo: selectedVideo,
              classId: classId,
              classes: classes,
            });
          }}
          icon={"repeat"}
          text={"Repetir"}
        /> */}
        {/* <CircleButton
          color={"#6BCB77"}
          onPress={() => {
            navigation.navigate("Home");
          }}
          icon={"home"}
          text={"Volver"}
        /> */}
      </View>
      {/* <View> */}
      {/* <Video
        source={{
          uri: video,
        }}
        // positionMillis={0}
        shouldPlay={true}
        useNativeControls={true}
        resizeMode="cover"
        // onPlaybackStatusUpdate={(status) => {
        //   onPlaybackStatusUpdate(status);
        // }}
        // // onPlaybackStatusUpdate={onPlaybackStatusUpdate(status)}
        // onLoadStart={(status) => {
        //   onLoadStart(status);
        // }}
        // onLoad={(status) => {
        //   onLoad(status);
        // }}
        // onError={(error) => {
        //   onError(error);
        // }}
        style={styles.videoBox}
      /> */}
      {/* </View> */}
      {/* <TouchableOpacity
        style={styles.commandButton}
        onPress={() => {
          Alert.alert(`Guardar Video?`, ``, [
            { text: "No", style: "destructive" },
            {
              text: "Si",
              style: "default",
              onPress: async () => {
                await MediaLibrary.saveToLibraryAsync(video);
                Alert.alert(`Video Guardado`);
              },
            },
          ]);
        }}
      >
        <Text style={styles.panelButtonTitle}>Guardar Video</Text>
      </TouchableOpacity> */}
    </View>
  );
};

export default ReviewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    position: "absolute",
    top: 60,
  },
  videoBox: {
    width: "80%",
    height: "50%",
    borderColor: "black",
    // borderRadius: 1,
    borderWidth: 1,
    marginTop: 90,
  },
  commandButton: {
    padding: 15,
    borderRadius: 25,
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
});
