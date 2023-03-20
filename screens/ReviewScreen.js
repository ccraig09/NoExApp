import { StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import React from "react";
import { Video } from "expo-av";
import CircleButton from "../components/UI/CircleButton";
import Colors from "../constants/Colors";
import * as MediaLibrary from "expo-media-library";

const ReviewScreen = ({ navigation, route }) => {
  const { video } = route.params;
  const { selectedVideo, classId, classes } = route.params;
  console.log("what is this url review", selectedVideo);
  return (
    <View style={styles.container}>
      <View style={styles.buttonRow}>
        <CircleButton
          color={"#4D96FF"}
          onPress={() => {
            navigation.navigate("Section");
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
      <Video
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
      />
      {/* </View> */}
      <TouchableOpacity
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
      </TouchableOpacity>
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
