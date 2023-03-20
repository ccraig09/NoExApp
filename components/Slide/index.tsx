import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "./styles";
import Formula from "../Formula";
import ProgressWheel from "../../components/UI/ProgressWheelBase";
import Speedometer from "react-native-speedometer-chart";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export const Slide = (props: any) => {
  const { title, result } = props;

  let color;
  if (parseInt(props.comp) * 100 < 25) {
    color = "red";
  }
  if (parseInt(props.comp) * 100 >= 25 && parseInt(props.comp) * 100 <= 75) {
    color = "yellow";
  }
  if (parseInt(props.comp) * 100 > 75) {
    color = "#00ff00";
  }
  const goal = () => {
    if (props.title === "IMC") {
      return "21.6";
    }
    if (props.title === "Grasa") {
      return fatRes();
    }
    if (props.title === "Grasa Viseral") {
      return "5";
    }
    if (props.title === "Músculo") {
      return muscleRes();
    }
    if (props.title === "Metabolica") {
      return props.age;
    }
  };
  const max = () => {
    if (props.title === "IMC") {
      return "40";
    }
    if (props.title === "Grasa") {
      return "50";
    }
    if (props.title === "Grasa Viseral") {
      return "20";
    }
    if (props.title === "Músculo") {
      return "50";
    }
    if (props.title === "Edad Metabolica") {
      return "80";
    }
    if (props.title === "KCAL") {
      return "2000";
    }
  };

  const fatRes = () => {
    if (props.gender === "F" && props.age >= "20" && props.age <= "39") {
      return "26.9";
    }
    if (props.gender === "F" && props.age >= "40" && props.age <= "59") {
      return "28.4";
    }
    if (props.gender === "F" && props.age >= "60" && props.age <= "79") {
      return "29.9";
    }
    if (props.gender === "M" && props.age >= "20" && props.age <= "39") {
      return "13.9";
    }
    if (props.gender === "M" && props.age >= "40" && props.age <= "59") {
      return "16.5";
    }
    if (props.gender === "M" && props.age >= "60" && props.age <= "79") {
      return "18.9";
    }
  };

  const muscleRes = () => {
    if (props.gender === "F" && props.age >= "18" && props.age <= "39") {
      return "27.3";
    }
    if (props.gender === "F" && props.age >= "40" && props.age <= "59") {
      return "27.1";
    }
    if (props.gender === "F" && props.age >= "60" && props.age <= "80") {
      return "26.9";
    }

    if (props.gender === "M" && props.age >= "18" && props.age <= "39") {
      return "36.3";
    }
    if (props.gender === "M" && props.age >= "40" && props.age <= "59") {
      return "36.1";
    }
    if (props.gender === "M" && props.age >= "60" && props.age <= "80") {
      return "35.9";
    }
  };

  const labels = [
    {
      name: "bad",
      labelColor: "#ff2900",
      activeBarColor: "#ff2900",
    },
    {
      name: "ok",
      labelColor: "#ff5400",
      activeBarColor: "#ff5400",
    },
    {
      name: "better",
      labelColor: "#f4ab44",
      activeBarColor: "#f4ab44",
    },
    {
      name: "Normal",
      labelColor: "#f2cf1f",
      activeBarColor: "#f2cf1f",
    },
  ];

  return (
    <View style={styles.slide}>
      <View style={{ flexDirection: "row" }}>
        <View>
          <View>
            <TouchableOpacity onPress={props.edit}>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ ...styles.title }}>%{title} </Text>
                <MaterialCommunityIcons
                  name="circle-edit-outline"
                  size={18}
                  color="black"
                />
              </View>
              <View style={{ marginTop: 5 }}>
                {/* <Text style={{ ...styles.slideText }}>Resultado:</Text> */}
                <Text style={{ ...styles.resultText }}>{result}</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={{ marginTop: 25 }}>
            <Text style={{ ...styles.slideMeta }}>Meta:</Text>
            <Text style={{ ...styles.slideText }}>{goal()}</Text>
          </View>
        </View>
        {/* <View style={{}}> */}
        <View style={{ ...styles.progress }}>
          <TouchableOpacity onPress={props.edit}>
            <Text
              style={{
                alignSelf: "center",
                color: "silver",
                fontSize: 10,
                marginBottom: 10,
              }}
            >
              Toca para editar
            </Text>
            <Speedometer
              value={parseInt(props.comp)}
              totalValue={parseInt(max())}
              internalColor={color}
              size={150}
              text={parseInt(props.comp)}
              showIndicator
            />
          </TouchableOpacity>
          {/* </View>
        <View style={{ top: 0, marginLeft: 20, marginTop: 130 }}> */}
          {/* <Text style={{ ...styles.slideText }}>Categoria:</Text> */}
          <Formula
            gender={props.gender}
            age={props.age}
            bmi={props.bmi}
            fat={props.fat}
            title={props.title}
            vifat={props.vifat}
            muscle={props.muscle}
          />
        </View>
        {/* </View> */}
      </View>
    </View>
  );
};

export default Slide;
