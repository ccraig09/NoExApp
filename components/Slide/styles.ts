import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  slide: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
    flexBasis: "100%",
    flex: 1,
    maxWidth: "100%",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    // alignItems: "center",
    // alignContent: "center",
    // justifyContent: "center",
    height: 230,
  },
  slideText: {
    width: "100%",
    textAlign: "left",
    fontSize: 15,
  },
  slideMeta: {
    width: "100%",
    textAlign: "left",
    fontSize: 18,
    fontWeight: "bold",
  },
  resultText: {
    width: "100%",
    textAlign: "left",
    fontSize: 20,
    color: "grey",
    fontFamily: "aliens",
  },
  title: {
    // width: "100%",
    textAlign: "left",

    fontSize: 20,
    textDecorationLine: "underline",
    fontWeight: "bold",
  },
  progress: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    marginTop: 40,
    marginLeft: 80,
  },
});

export default styles;
