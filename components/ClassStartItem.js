import React from "react";
import {
  FlatList,
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  Image,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { PlayIcon } from "./UI/icons";
import { Button } from "react-native-paper";

import CategoryItem from "../components/CategoryItem";
import Colors from "../constants/Colors";

const ClassStartItem = (props) => {
  let logoimg = "../assets/icon-noexlogo.png";
  const videos = props.playlist;
  const work = props.work;

  const mergeHandler = () => {
    // const merged = [...videos, ...work];
    // console.log("merge success", merged);
    props.onVideoClick(props.video);
  };

  const VideoList = () => {
    // if (videos.length > 0) {
    //   return videos.map((video, index) => {
    return (
      <View key={index} style={styles.videoContainer}>
        <TouchableOpacity
          onPress={() => {
            console.log("what is this vid", [video]);
            props.onVideoClick([video]);
          }}
        >
          <View
            style={{
              flexDirection: "row",
              marginTop: 10,
              marginLeft: 10,
              alignItems: "center",
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 25 }}>{++index}</Text>
            <ImageBackground
              style={{
                height: 80,
                width: 80,
                marginLeft: 10,
                // alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
              }}
              source={{ uri: props.image }}
            >
              <PlayIcon style={{}} />
            </ImageBackground>
          </View>
          <View style={{ marginVertical: 5 }}>
            {/* <Text style={styles.videoTitle}>{video.title}</Text> */}
            {/* <Text style={styles.videoSubtitle}>{video.url}</Text> */}
            <Text style={{ marginLeft: 30 }}>{video.time}</Text>
          </View>
        </TouchableOpacity>
        {index < videos.length && (
          <View
            style={{
              borderBottomColor: "black",
              borderBottomWidth: 1,
            }}
          />
        )}
      </View>
    );
  };
  //     });
  //   } else {
  //     return <View></View>;
  //   }
  // };
  const WorkList = () => {
    if (work.length > 0) {
      return work.map((video, index) => {
        return (
          <View key={index} style={styles.videoContainer}>
            <TouchableOpacity
              onPress={() => {
                props.onVideoClick(video.url);
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 10,
                  marginLeft: 10,
                  alignItems: "center",
                }}
              >
                <Text style={{ fontWeight: "bold", fontSize: 25 }}>
                  {++index}
                </Text>
                <ImageBackground
                  style={{
                    height: 80,
                    width: 80,
                    marginLeft: 10,
                    // alignContent: "center",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  source={{ uri: props.image }}
                >
                  <PlayIcon style={{}} />
                </ImageBackground>
              </View>
              <View style={{ marginVertical: 5 }}>
                {/* <Text style={styles.videoTitle}>{video.title}</Text> */}
                {/* <Text style={styles.videoSubtitle}>{video.url}</Text> */}
                <Text style={{ marginLeft: 30 }}>{video.time}</Text>
              </View>
            </TouchableOpacity>
            <View
              style={{
                borderBottomColor: "black",
                borderBottomWidth: 1,
              }}
            />
          </View>
        );
      });
    } else {
      return <View></View>;
    }
  };

  return (
    <View style={styles.Container}>
      <StatusBar hidden />
      <View style={styles.Cover}>
        <Image style={styles.Image} source={{ uri: props.image }} />
        {/* <View style={styles.PlayWrapper}>
          <TouchableOpacity
            underlayColor="transparent"
            onPress={props.onVideoClick}
          >
            <View style={styles.PlayView}>
              <PlayIcon style={{ marginLeft: -10 }} />
            </View>
          </TouchableOpacity>
        </View> */}
        <View style={styles.Wrapper}>
          <Image style={styles.Logo} source={{ uri: props.image }} />
          <Text style={styles.Subtitle}>{props.subtitle}</Text>
        </View>
      </View>
      <ScrollView>
        <Text style={{ fontWeight: "bold", fontSize: 25, marginLeft: 10 }}>
          {props.description}
        </Text>
        {/* <VideoList /> */}
        <Text style={{ fontWeight: "bold", fontSize: 25, marginLeft: 10 }}>
          Ejercicios
        </Text>
        {/* <WorkList /> */}
      </ScrollView>
      <Button
        mode="contained"
        style={styles.todoButton}
        color={Colors.noExprimary}
        onPress={() => {
          mergeHandler();
        }}
      >
        Reproducir Todo
      </Button>
    </View>
  );
};

ClassStartItem.navigationOptions = {
  title: "Cardio",
  headerShown: false,
};

const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
  todoButton: {
    width: "80%",
    alignSelf: "center",
    marginBottom: 10,
    position: "absolute",
    bottom: 0,
    borderRadius: 10,
  },
  Cover: {
    height: 375,
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

export default ClassStartItem;
