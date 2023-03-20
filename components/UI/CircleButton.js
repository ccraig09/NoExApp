import React from "react";
import { Platform, Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Colors from "../../constants/Colors";

const CircleButton = (props) => {
  return (
    <View style={{ alignItems: "center" }}>
      <TouchableOpacity
        style={{
          height: 80,
          width: 80,
          backgroundColor: props.color,
          borderRadius: 40,
          justifyContent: "center",
        }}
        onPress={props.onPress}
      >
        <View
          style={{
            alignItems: "center",
          }}
        >
          <Ionicons name={props.icon} size={30} color="white" />
        </View>
        {/* {...props} */}
        {/* IconComponent={props.icon}
      iconSize={23} */}
      </TouchableOpacity>
      <Text style={{ fontWeight: "bold", marginTop: 10 }}>{props.text}</Text>
    </View>

    //add view and add props.text under each button?
  );
};

export default CircleButton;
