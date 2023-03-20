import { StyleSheet } from "react-native";
import Colors from "../constants/Colors";

export const styles = StyleSheet.create({
  statsHead: {
    paddingTop: 10,
    paddingHorizontal: 12,
  },
  container: {
    width: "100%",
    backgroundColor: "#fbfbfb",
    borderColor: "#ebebeb",
    // borderWidth: 1,
    marginRight: 15,
    borderRadius: 8,
    shadowColor: "#fcfcfc",
    shadowOpacity: 1,
    marginTop: 10,
    marginLeft: 7,
    shadowOffset: {
      width: 0,
      height: 5,
    },
  },
  scrollView: {
    display: "flex",
    flexDirection: "row",
    overflow: "hidden",
    backgroundColor: "white",
    borderRadius: 7,
  },
  view: {
    marginRight: 15,
  },
  bullets: {
    position: "absolute",
    top: 0,
    right: 0,
    display: "flex",
    justifyContent: "flex-start",
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingTop: 5,
  },
  bullet: {
    paddingHorizontal: 5,
    fontSize: 25,
  },
});

export default styles;
