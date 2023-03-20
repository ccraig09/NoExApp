import React from "react";
import { View, Text } from "react-native";

const Formula = (props) => {
  const res = () => {
    if (props.title === "IMC") {
      return bmiRes();
    }
    if (props.title === "Grasa") {
      return fatRes();
    }
    if (props.title === "Grasa Viseral") {
      return viFatRes();
    }
    if (props.title === "Músculo") {
      return muscleRes();
    }
  };

  const bmiRes = () => {
    if (props.bmi < "18.5") {
      return "Peso inferior al normal";
    }
    if (props.bmi >= "18.6" && props.bmi <= "24.9") {
      return "Normal";
    }
    if (props.bmi >= "25" && props.bmi <= "29.9") {
      return "Sobrepeso";
    }
    if (props.bmi >= "30") {
      return "Obesidad";
    }
  };

  const fatRes = () => {
    if (
      props.gender === "F" &&
      props.fat < "21" &&
      props.age >= "20" &&
      props.age <= "39"
    ) {
      return "Bajo";
    }
    if (
      props.gender === "F" &&
      props.fat < "23" &&
      props.age >= "40" &&
      props.age <= "59"
    ) {
      return "Bajo";
    }
    if (
      props.gender === "F" &&
      props.fat < "24" &&
      props.age >= "60" &&
      props.age <= "79"
    ) {
      return "Bajo";
    }
    if (
      props.gender === "F" &&
      props.fat >= "21" &&
      props.fat <= "32.9" &&
      props.age >= "20" &&
      props.age <= "39"
    ) {
      return "Normal";
    }
    if (
      props.gender === "F" &&
      props.fat >= "23" &&
      props.fat <= "33.9" &&
      props.age >= "40" &&
      props.age <= "59"
    ) {
      return "Normal";
    }
    if (
      props.gender === "F" &&
      props.fat >= "24" &&
      props.fat <= "35.9" &&
      props.age >= "60" &&
      props.age <= "79"
    ) {
      return "Normal";
    }
    if (
      props.gender === "F" &&
      props.fat >= "33" &&
      props.fat <= "38.9" &&
      props.age >= "20" &&
      props.age <= "39"
    ) {
      return "Elevado";
    }
    if (
      props.gender === "F" &&
      props.fat >= "34" &&
      props.fat <= "39.9" &&
      props.age >= "40" &&
      props.age <= "59"
    ) {
      return "Elevado";
    }
    if (
      props.gender === "F" &&
      props.fat >= "36" &&
      props.fat <= "41.9" &&
      props.age >= "60" &&
      props.age <= "79"
    ) {
      return "Elevado";
    }
    if (
      props.gender === "F" &&
      props.fat >= "39" &&
      props.age >= "20" &&
      props.age <= "39"
    ) {
      return "Muy elevado";
    }
    if (
      props.gender === "F" &&
      props.fat >= "40" &&
      props.age >= "40" &&
      props.age <= "59"
    ) {
      return "Muy elevado";
    }
    if (
      props.gender === "F" &&
      props.fat >= "42" &&
      props.age >= "60" &&
      props.age <= "79"
    ) {
      return "Muy elevado";
    }
    if (
      props.gender === "M" &&
      props.fat < 8 &&
      props.age >= "20" &&
      props.age <= "39"
    ) {
      return "Bajo";
    }
    if (
      props.gender === "M" &&
      props.fat < 11 &&
      props.age >= "40" &&
      props.age <= "59"
    ) {
      return "Bajo";
    }
    if (
      props.gender === "M" &&
      props.fat < 13 &&
      props.age >= "60" &&
      props.age <= "79"
    ) {
      return "Bajo";
    }
    if (
      props.gender === "M" &&
      props.fat >= 8 &&
      props.fat <= 19.9 &&
      props.age >= "20" &&
      props.age <= "39"
    ) {
      return "Normal";
    }
    if (
      props.gender === "M" &&
      props.fat >= 11 &&
      props.fat <= 21.9 &&
      props.age >= "40" &&
      props.age <= "59"
    ) {
      return "Normal";
    }
    if (
      props.gender === "M" &&
      props.fat >= 13 &&
      props.fat <= 24.9 &&
      props.age >= "60" &&
      props.age <= "79"
    ) {
      return "Normal";
    }
    if (
      props.fat >= 20 &&
      props.fat <= 24.9 &&
      props.gender === "M" &&
      props.age >= "20" &&
      props.age <= "39"
    ) {
      return "Elevado";
    }
    if (
      props.fat >= 22 &&
      props.fat <= 27.9 &&
      props.gender === "M" &&
      props.age >= "40" &&
      props.age <= "59"
    ) {
      return "Elevado";
    }
    if (
      props.fat >= 25 &&
      props.fat <= 29.9 &&
      props.gender === "M" &&
      props.age >= "60" &&
      props.age <= "79"
    ) {
      return "Elevado";
    }
    if (
      props.fat >= 25 &&
      props.gender === "M" &&
      props.age >= "20" &&
      props.age <= "39"
    ) {
      return "Muy elevado";
    }
    if (
      props.fat >= 28 &&
      props.gender === "M" &&
      props.age >= "40" &&
      props.age <= "59"
    ) {
      return "Muy elevado";
    }
    if (
      props.fat >= 30 &&
      props.gender === "M" &&
      props.age >= "60" &&
      props.age <= "79"
    ) {
      return "Muy elevado";
    }
  };
  const viFatRes = () => {
    if (props.vifat <= 9) {
      return "Normal";
    }
    if (props.vifat >= 10 && props.vifat <= 14) {
      return "Alto";
    }
    if (props.vifat >= 15) {
      return "Muy Alto";
    }
  };

  const muscleRes = () => {
    if (
      props.gender === "F" &&
      props.muscle < "24.3" &&
      props.age >= "18" &&
      props.age <= "39"
    ) {
      return "Bajo";
    }
    if (
      props.gender === "F" &&
      props.muscle < "24.1" &&
      props.age >= "40" &&
      props.age <= "59"
    ) {
      return "Bajo";
    }
    if (
      props.gender === "F" &&
      props.muscle < "23.9" &&
      props.age >= "60" &&
      props.age <= "80"
    ) {
      return "Bajo";
    }
    if (
      props.gender === "F" &&
      props.muscle >= "24.3" &&
      props.muscle <= "30.3" &&
      props.age >= "18" &&
      props.age <= "39"
    ) {
      return "Normal";
    }
    if (
      props.gender === "F" &&
      props.muscle >= "24.1" &&
      props.muscle <= "30.1" &&
      props.age >= "40" &&
      props.age <= "59"
    ) {
      return "Normal";
    }
    if (
      props.gender === "F" &&
      props.muscle >= "23.9" &&
      props.muscle <= "29.9" &&
      props.age >= "60" &&
      props.age <= "80"
    ) {
      return "Normal";
    }
    if (
      props.gender === "F" &&
      props.muscle >= "30.4" &&
      props.muscle <= "35.3" &&
      props.age >= "18" &&
      props.age <= "39"
    ) {
      return "Elevado";
    }
    if (
      props.gender === "F" &&
      props.muscle >= "30.2" &&
      props.muscle <= "35.1" &&
      props.age >= "40" &&
      props.age <= "59"
    ) {
      return "Elevado";
    }
    if (
      props.gender === "F" &&
      props.muscle >= "30" &&
      props.muscle <= "34.9" &&
      props.age >= "60" &&
      props.age <= "80"
    ) {
      return "Elevado";
    }
    if (
      props.gender === "F" &&
      props.muscle >= "35.4" &&
      props.age >= "18" &&
      props.age <= "39"
    ) {
      return "Muy elevado";
    }
    if (
      props.gender === "F" &&
      props.muscle >= "35.2" &&
      props.age >= "40" &&
      props.age <= "59"
    ) {
      return "Muy elevado";
    }
    if (
      props.gender === "F" &&
      props.muscle >= "35" &&
      props.age >= "60" &&
      props.age <= "80"
    ) {
      return "Muy elevado";
    }
    if (
      props.gender === "M" &&
      props.muscle < 33.3 &&
      props.age >= "18" &&
      props.age <= "39"
    ) {
      return "Bajo";
    }
    if (
      props.gender === "M" &&
      props.muscle < 33.1 &&
      props.age >= "40" &&
      props.age <= "59"
    ) {
      return "Bajo";
    }
    if (
      props.gender === "M" &&
      props.muscle < 32.9 &&
      props.age >= "60" &&
      props.age <= "80"
    ) {
      return "Bajo";
    }
    if (
      props.gender === "M" &&
      props.muscle >= 33.3 &&
      props.muscle <= 39.3 &&
      props.age >= "18" &&
      props.age <= "39"
    ) {
      return "Normal";
    }
    if (
      props.gender === "M" &&
      props.muscle >= 33.1 &&
      props.muscle <= 39.1 &&
      props.age >= "40" &&
      props.age <= "59"
    ) {
      return "Normal";
    }
    if (
      props.gender === "M" &&
      props.muscle >= 32.9 &&
      props.muscle <= 38.9 &&
      props.age >= "60" &&
      props.age <= "80"
    ) {
      return "Normal";
    }
    if (
      props.muscle >= 39.4 &&
      props.muscle <= 44 &&
      props.gender === "M" &&
      props.age >= "18" &&
      props.age <= "39"
    ) {
      return "Elevado";
    }
    if (
      props.muscle >= 39.2 &&
      props.muscle <= 43.8 &&
      props.gender === "M" &&
      props.age >= "40" &&
      props.age <= "59"
    ) {
      return "Elevado";
    }
    if (
      props.muscle >= 39 &&
      props.muscle <= 43.6 &&
      props.gender === "M" &&
      props.age >= "60" &&
      props.age <= "80"
    ) {
      return "Elevado";
    }
    if (
      props.muscle >= 44.1 &&
      props.gender === "M" &&
      props.age >= "18" &&
      props.age <= "39"
    ) {
      return "Muy elevado";
    }
    if (
      props.muscle >= 43.9 &&
      props.gender === "M" &&
      props.age >= "40" &&
      props.age <= "59"
    ) {
      return "Muy elevado";
    }
    if (
      props.muscle >= 43.7 &&
      props.gender === "M" &&
      props.age >= "60" &&
      props.age <= "80"
    ) {
      return "Muy elevado";
    }
  };

  return (
    <View>
      <Text>{res()}</Text>
    </View>
  );
};

export default Formula;
