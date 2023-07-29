import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { Video, Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
// import { useSelector } from "react-redux";
import VideoControls from "./UI/VideoPlayer";
import { Camera } from "expo-camera";
import { MaterialIcons, Octicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import YoutubePlayer from "react-native-youtube-iframe";

const { height, width } = Dimensions.get("window");

import {
  TouchableOpacity,
  Dimensions,
  View,
  Text,
  StyleSheet,
  Image,
} from "react-native";
import Colors from "../constants/Colors";
import * as MediaLibrary from "expo-media-library";

// import * as ScreenOrientation from "expo-screen-orientation";

let screenWidth = Dimensions.get("window").width;
let screenHeight = Dimensions.get("window").height;
let logoimg = "../assets/icon-noexlogo.png";

const VideoItem = (props) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [currentVideo, setCurrentVideo] = useState(0);
  const [video, setVideo] = useState();
  const [showLottie, setShowLottie] = useState(false);
  const [shouldPlay, setShouldPlay] = useState(false);
  const [isCameraReady, setCameraReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [type, setType] = useState(Camera.Constants.Type.front);
  const [playbackInstanceInfo, setPlaybackInstanceInfo] = useState({
    position: 0,
    duration: 0,
    state: "Buffering",
  });

  const playbackInstance = useRef(null);
  let videoLink;
  const Playlist = props.video;

  const playerRef = useRef();
  const cameraRef = useRef();

  const youtubeId = props.video.split("be/");

  const onLoad = async () => {
    // setRecording(true);
    console.log("we live baby");

    await cameraRef.current.recordAsync().then((file) => {
      setVideo(file.uri);
      videoLink = file.uri;
      console.log("recording", file.uri);
      // props.reviewNav(videoLink);
    });
    // try {
    //   const videoRecordPromise = cameraRef.recordAsync();

    //   if (videoRecordPromise) {
    //     const data = await videoRecordPromise;
    //     const source = data.uri;
    //     if (source) {
    //       console.log("video source", source);
    //       videoLink = source;
    //     }
    //   }
    // } catch (error) {
    //   console.warn(error);
    // }
  };

  useEffect(() => {
    return () => {
      if (playbackInstance.current) {
        playbackInstance.current.setStatusAsync({
          shouldPlay: false,
        });
      }
    };
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      await MediaLibrary.requestPermissionsAsync();
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No hay permiso para la cámara</Text>;
  }

  const togglePlay = async () => {
    const shouldPlay = playbackInstanceInfo.state !== "Playing";
    if (playbackInstance.current !== null) {
      await playbackInstance.current.setStatusAsync({
        shouldPlay,
        ...(playbackInstanceInfo.state === "Ended" && { positionMillis: 0 }),
      });
      setPlaybackInstanceInfo({
        ...playbackInstanceInfo,
        state: playbackInstanceInfo.state === "Playing" ? "Paused" : "Playing",
      });
    }
  };

  const updatePlaybackCallback = (status) => {
    console.log(status, "status");
    if (status.isLoaded) {
      setPlaybackInstanceInfo({
        ...playbackInstanceInfo,
        position: status.positionMillis,
        duration: status.durationMillis || 0,
        state: status.didJustFinish
          ? "Ended"
          : status.isBuffering
          ? "Buffering"
          : status.shouldPlay
          ? "Playing"
          : "Paused",
      });
    } else {
      if (status.isLoaded === false && status.error) {
        const errorMsg = `Encountered a fatal error during playback: ${status.error}`;
        console.log(errorMsg, "error");
        // setErrorMessage(errorMsg)
      }
    }
  };

  const onPlaybackStatusUpdate = async (status) => {
    // console.log(status, "status");
    if (status.isLoaded) {
      setPlaybackInstanceInfo({
        ...playbackInstanceInfo,
        position: status.positionMillis,
        duration: status.durationMillis || 0,
        state: status.didJustFinish
          ? "Ended"
          : status.isBuffering
          ? "Buffering"
          : status.shouldPlay
          ? "Playing"
          : "Paused",
      });
    } else {
      if (status.isLoaded === false && status.error) {
        const errorMsg = `Encountered a fatal error during playback: ${status.error}`;
        console.log(errorMsg, "error");
        // setErrorMessage(errorMsg)
      }
    }
    console.log("staaats", status);
    if (status.didJustFinish) {
      // if (recording) {
      // }
      // console.log("do we have a video?", video);
      // console.log("video recorded", video);
      onComplete();
      // forwardButton();
    } else {
      if (status.error) {
        console.log(`FATAL PLAYER ERROR: ${status.error}`);
      }
    }
  };

  const playbackHandler = (status) => {
    if (status === "ended") {
      onComplete();
    }
  };

  const onComplete = () => {
    setShouldPlay(false);
    console.log("no more videos");
    setCompleted(true);
    setRecording(false);
    // cameraRef.current.stopRecording();
    props.reviewNav(videoLink);
  };

  const onError = (error) => {
    console.log(`ON ERROR : ${error}`);
    alert(`FATAL PLAYER ERROR: ${error}`);
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Container>
          <YoutubePlayer
            ref={playerRef}
            height={"100%"}
            width={"100%"}
            videoId={youtubeId[1]}
            onChangeState={(state) => {
              playbackHandler(state);
              console.log(">>state", state);
            }}
          />
          {/* <Video
            ref={playbackInstance}
            source={{
              uri: Playlist.url,
              // uri: Playlist[currentVideo].url,
            }}
            positionMillis={0}
            shouldPlay={shouldPlay}
            useNativeControls={false}
            resizeMode="cover"
            onPlaybackStatusUpdate={(status) => {
              onPlaybackStatusUpdate(status);
            }}
            // onPlaybackStatusUpdate={onPlaybackStatusUpdate(status)}
            onLoadStart={(status) => {
              onLoadStart(status);
            }}
            onLoad={(status) => {
              onLoad(status);
            }}
            onError={(error) => {
              onError(error);
            }}
            style={{ width: "100%", height: "100%" }}
          /> */}
          {/* <View style={styles.controlsContainer}>
            <VideoControls
              state={playbackInstanceInfo.state}
              playbackInstance={playbackInstance.current}
              playbackInstanceInfo={playbackInstanceInfo}
              setPlaybackInstanceInfo={setPlaybackInstanceInfo}
              togglePlay={togglePlay}
            />
          </View> */}
          <CloseView>
            <View style={styles.iconWrapper}>
              <TouchableOpacity
                onPress={props.onBackClick}
                // style={{ padding: 20 }}
              >
                <Ionicons name="ios-close" size={44} color="white" />
              </TouchableOpacity>
            </View>
          </CloseView>
          {showLottie && (
            <LottieView
              style={{
                position: "absolute",
                width: 200,
                height: 200,
                backgroundColor: "transparent",
              }}
              colorFilters={[
                {
                  keypath: "number 01",
                  color: "#FFFFFF",
                },
                {
                  keypath: "number 01",
                  color: "#FFFFFF",
                },
                {
                  keypath: "number 03",
                  color: "#FFFFFF",
                },
              ]}
              onAnimationFinish={async () => {
                setShouldPlay(true);
                setRecording(false);
                setShowLottie(false);
              }}
              source={require("../assets/lottie/321white.json")}
              autoPlay
              loop={false}
            />
          )}
          {isLoading && (
            <LottieView
              style={{
                position: "absolute",
                width: 150,
                height: 150,
                backgroundColor: "transparent",
              }}
              // onAnimationFinish={() => {
              //   setShouldPlay(true);
              //   setShowLottie(false);
              // }}
              source={require("../assets/lottie/sportsLoadingSlow.json")}
              autoPlay
              loop={true}
            />
          )}

          {/* <View
            style={{
              backgroundColor: "rgba(0,0,0,0.5)",
              // flex: 0.25,
              flexDirection: "row",
              alignItems: "center",
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              // top: -50,
              justifyContent: "space-around",
              marginBottom: 40,
            }}
          >
            <MaterialIcons
              name={"navigate-before"}
              size={45}
              color={Colors.noExprimary}
              onPress={backButton}
            />
            <Text style={{ fontWeight: "bold", fontSize: 20, color: "white" }}>
              Siguiente Video
            </Text>
            <MaterialIcons
              name={"navigate-next"}
              size={45}
              color={Colors.noExprimary}
              onPress={forwardButton}
            />
          </View> */}
        </Container>
        <View style={{ width: "100%", height: "50%" }}>
          <Camera
            style={{ flex: 1 }}
            type={type}
            ref={cameraRef}
            onCameraReady={() => {
              setCameraReady;
            }}
            // quality={Camera.Constants.VideoQuality["480p"]}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "transparent",
                alignItems: "center",
                alignSelf: "center",
                justifyContent: "center",
                // flexDirection: "row",
              }}
            >
              {/* <Image
            style={{
              width: 200,
              height: 200,
            }}
            source={{
              uri: "https://media.giphy.com/media/WOUNY23l02q9DQFuZF/giphy.gif",
            }}
          /> */}

              {/* <TouchableOpacity
            style={{
              flex: 0.1,
              alignSelf: "flex-end",
              alignItems: "center",
              marginLeft: 9,
            }}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}
          >
            <Text style={{ fontSize: 18, marginBottom: 19, color: "white" }}>
              {" "}
              Flip{" "}
            </Text>
          </TouchableOpacity> */}
            </View>
          </Camera>
        </View>
      </View>
    </View>
  );
};

export default VideoItem;

const styles = StyleSheet.create({
  bottom: {
    marginTop: 10,
  },
  video: {
    alignSelf: "center",
    width: width,
    height: height / 1.6,
  },
  container: {
    flex: 1,
    justifyContent: "center",
  },
  controlsContainer: {
    position: "absolute",
    bottom: 10,
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
  iconWrapper: {
    backgroundColor: Colors.noExprimary,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
    height: 50,
    width: 50,
    borderRadius: 50,
  },
});

const Container = styled.View`
  height: 50%;
  width: 100%;
  background: black;
  align-items: center;
  justify-content: center;
`;

const CloseView = styled.View`
  position: absolute;
  top: 0px;
  right: 12px;
`;
