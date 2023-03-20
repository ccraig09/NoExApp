import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";

const BasicInfoScroll = (props) => {
  return (
    <ScrollView
      style={{
        horizontal: true,
        marginTop: 2,
        backgroundColor: "white",
        width: "100%",
      }}
    >
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            // padding: 10,
            width: 85,
          }}
        >
          <Text style={styles.basicInfo}>EDAD</Text>
          <Text
            style={{
              fontFamily: "aliens",
              color: "grey",
              fontSize: 20,
              textAlign: "center",

              width: 70,
            }}
          >
            {props.age}
          </Text>
        </View>

        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            // padding: 10,
            width: 100,
          }}
        >
          <Text style={styles.basicInfo}>ESTATURA</Text>
          <Text
            style={{
              fontFamily: "aliens",
              color: "#ffc733",
              fontSize: 20,
              textAlign: "center",
              width: 70,
            }}
          >
            {props.height}
          </Text>
        </View>

        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            // padding: 10,
            width: 100,
          }}
        >
          <Text style={styles.basicInfo}>PESO</Text>
          <Text
            style={{
              fontFamily: "aliens",
              color: "grey",
              fontSize: 20,
              textAlign: "center",
              width: 70,
            }}
          >
            {props.weight}
          </Text>
        </View>

        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            // padding: 10,
            width: 100,
          }}
        >
          <Text style={styles.basicInfo}>GÉNERO</Text>
          <Text
            style={{
              fontFamily: "aliens",
              color: "#ffc733",
              fontSize: 20,
              textAlign: "center",
              width: 70,
            }}
          >
            {props.gender}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  basicInfo: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 17,
    color: "#6C6C6C",
    fontStyle: "italic",
  },
});
export default BasicInfoScroll;
