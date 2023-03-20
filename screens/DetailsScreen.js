import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import CategoryItem from "../components/CategoryItem";
import ClassStartItem from "../components/ClassStartItem";

const DetailsScreen = ({ route, navigation }) => {
  const [Level1, setLevel1] = useState([]);

  const { classId, classes } = route.params;
  const data = classes;
  //   console.log("section", data);
  //   console.log("and this the key", classId);
  const selectedVideo = data.find((key) => key.key === classId);
  console.log("is thehis vid", selectedVideo);

  //   console.log(
  //     "did i find it?",
  //     data.find((key) => key.key === classId)
  //   );
  //   setLevel1(data);
  return (
    <ClassStartItem
      image={selectedVideo.Image}
      //   title={cardioStart.title}
      subtitle={selectedVideo.Subtitle}
      //   time={cardioStart.time}
      //   difficulty={cardioStart.difficulty}
      //   logo={cardioStart.logo}
      video={selectedVideo.videoURL}
      playlist={selectedVideo.videoPlaylist}
      work={selectedVideo.workPlaylist}
      description={selectedVideo.description}
      onVideoClick={(url) => {
        navigation.navigate("Video", {
          selectedVideo: url,
          // classDescription: cardioStart.description,
          // coverImage: cardioStart.image,
          // classVideo: cardioStart.videoURL,
        });
      }}
      onListClick={(url) => {
        navigation.navigate("Video", {
          selectedVideo: list,
        });
      }}
    />
  );
};

const styles = StyleSheet.create({
  FlatList: {
    // justifyContent: "center",å
  },
});

export default DetailsScreen;
