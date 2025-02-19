import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import ClassItem from "../components/ClassItem";
import CategoryItem from "../components/CategoryItem";

const SectionScreen = ({ route, navigation }) => {
  const [Level1, setLevel1] = useState([]);

  const { classId, classes } = route.params;
  const data1 = classes.filter((item) => item.Caption === classId);
  // console.log("section", data[0].Levels);
  const data = data1[0]?.Levels;
  //   setLevel1(data);
  console.log(">>data", data);
  return (
    <View style={styles.FlatList}>
      {/* <Text
        style={{
          fontWeight: "bold",
          fontSize: 25,
          alignSelf: "center",
          marginTop: 10,
        }}
      >
        {classId}
      </Text> */}
      <FlatList
        // horizontal={true}
        showsHorizontalScrollIndicator={false}
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={(itemData) => (
          <CategoryItem
            image={itemData.item.coverImg}
            title={itemData.item.Title}
            logo={itemData.item.logo}
            caption={itemData.item.Caption}
            subtitle={itemData.item.Subtitle}
            difficulty={itemData.item.Difficulty}
            time={itemData.item.Time}
            description={itemData.item.description}
            onClassClick={() => {
              navigation.navigate("Video", {
                videoInfo: itemData.item,
                url: itemData.item.url,
                classId: classId,
                classes: classes,
              });
            }}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  FlatList: {
    // justifyContent: "center",å
  },
});

export default SectionScreen;
