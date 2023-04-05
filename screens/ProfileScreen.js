import React, {
  useState,
  useContext,
  useCallback,
  useReducer,
  useEffect,
} from "react";
import {
  StatusBar,
  Dimensions,
  ScrollView,
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Image,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
  Text,
  Picker,
  Alert,
  FlatList,
  SafeAreaView,
  RefreshControl,
} from "react-native";
// import Modal from "react-native-modal";
// import AwesomeAlert from "react-native-awesome-alerts";
// import { Formik } from "formik";
// import * as yup from "yup";
import { Ionicons } from "@expo/vector-icons";

import styled, { useTheme } from "styled-components";
// import { useSelector, useDispatch } from "react-redux";
import { Avatar, Button } from "react-native-elements";
// import HeaderButton from "../components/UI/HeaderButton";
import EvalBlock from "../components/EvalBlock";
// import Carousel from "../components/Carousel";
// import Carousel from './Carousel';
import * as Linking from "expo-linking";
import Icon from "react-native-vector-icons/Ionicons";

// import { AsyncStorage } from "react-native";
import Colors from "../constants/Colors";
// import * as detailsActions from "../store/actions/membersDetails";
// import * as addEvalAction from "../store/actions/evals";
import ImagePicker from "../components/ImagePicker";
// import firebase from "../components/firebase";
// import { SafeAreaView } from "react-native-safe-area-context";
// import UpdateDT from "../components/UpdateTable";
import { AuthContext } from "../navigation/AuthProvider";

// import BaseEvalDT from "../components/BaseEvalDataTable";
// import * as Description from "../components/UI/descriptions";
// import ProgressWheel from "../components/UI/ProgressWheel";
// import DataModal from "../components/DataModal";
import BasicInfoScroll from "../components/BasicInfoScrollview";
// import Forumula from "../components/Formula";
// import DateTimePicker from "@react-native-community/datetimepicker";
import Toast from "react-native-toast-message";

// import moment from "moment";
// import localization from "moment/locale/es-us";
import SegmentBar from "../components/SegmentBar";
import firebase from "../components/firebase";
import DateTimePicker from "react-native-modal-datetime-picker";
import Moment from "moment";
import { extendMoment } from "moment-range";

import { useFocusEffect } from "@react-navigation/native";

let screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
StatusBar.setHidden(true);

const currentHour = new Date().getHours();

const greetingMessage =
  currentHour >= 4 && currentHour < 12 // after 4:00AM and before 12:00PM
    ? "Buenos Días"
    : currentHour >= 12 && currentHour <= 17 // after 12:00PM and before 6:00pm
    ? "Buenas Tardes"
    : currentHour > 17 || currentHour < 4 // after 5:59pm or before 4:00AM (to accommodate night owls)
    ? "Buenas Noches" // if for some reason the calculation didn't work
    : "Bienvenido";

const ProfileScreen = ({ navigation }) => {
  const { user, newEval, deleteEval } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showEval, setShowEval] = useState(true);
  const [showDatos, setShowDatos] = useState(true);
  const [evalDateModal, setEvalDateModal] = useState(false);
  const [showProgreso, setShowProgreso] = useState(true);
  const [userName, setUserName] = useState();
  const [extendedDate, setExtendedDate] = useState(false);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);

  const [showImagen, setShowImagen] = useState(true);
  const [userInfo, setUserInfo] = useState([]);
  const [userEvals, setUserEvals] = useState([]);
  const db = firebase.firestore().collection("Members");

  const [showAll, setShowAll] = useState(true);
  const moment = extendMoment(Moment);
  var date1 = moment().startOf("day");
  var date2 = moment(userInfo.endDate, "DD-MM-YYYY");

  const dateDiff = moment.duration(date2.diff(date1)).asDays();

  useFocusEffect(
    React.useCallback(() => {
      const fetchMemberDetails = async () => {
        try {
          const list = [];
          await firebase
            .firestore()
            .collection("Members")
            .doc(user.uid)
            .get()
            .then((doc) => {
              if (doc.exists) {
                // console.log("Document data:", doc.data());
                setUserInfo(doc.data());
                console.log(">>>>checking user details", doc.data());
              } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
              }
            });
        } catch (e) {
          console.log(e);
        }
      };
      const fetchMemberEvals = async () => {
        try {
          const list = [];
          await firebase
            .firestore()
            .collection("Members")
            .doc(user.uid)
            .collection("Member Evals")
            .orderBy("title", "asc")
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                const { title, ownerId, timeStamp } = doc.data();
                list.push({
                  key: doc.id,
                  title: title,
                  ownerId: ownerId,
                  timeStamp: timeStamp,
                });
              });
            });
          setUserEvals(list);
        } catch (e) {
          console.log(e);
        }
      };

      fetchMemberDetails();
      fetchMemberEvals();
    }, [])
  );
  const fetchMemberDetails = async () => {
    try {
      const list = [];
      await firebase
        .firestore()
        .collection("Members")
        .doc(user.uid)
        .get()
        .then((doc) => {
          if (doc.exists) {
            // console.log("Document data:", doc.data());
            setUserInfo(doc.data());
          } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
          }
        });
    } catch (e) {
      console.log(e);
    }
  };
  const fetchMemberEvals = async () => {
    try {
      const list = [];
      await firebase
        .firestore()
        .collection("Members")
        .doc(user.uid)
        .collection("Member Evals")
        .orderBy("title", "asc")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const { title, ownerId, timeStamp } = doc.data();
            list.push({
              key: doc.id,
              title: title,
              ownerId: ownerId,
              timeStamp: timeStamp,
            });
          });
        });
      setUserEvals(list);
    } catch (e) {
      console.log(e);
    }
  };

  const frontImageTakenHandler = useCallback(async (uri) => {
    p;
    if (uri == null) {
      return null;
    }
    const response = await fetch(uri);
    const blob = await response.blob();
    setUploading(true);
    setTransferred(0);
    Toast.show({
      type: "info",
      autoHide: false,
      text1: "Subiendo Foto",
    });
    // setFImage(uri);
    const storageRef = firebase
      .storage()
      .ref()
      .child("UserBaseImages/" + `${user.uid}/` + "FrontImage");
    const task = storageRef.put(blob);
    task.on("state_changed", (taskSnapshot) => {
      console.log(
        `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`
      );
      setTransferred(
        (
          (taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) *
          100
        ).toFixed(0)
      );
    });

    try {
      await task;

      const url = await storageRef.getDownloadURL();
      await db.doc(user.uid).set(
        {
          FrontImage: url,
        },
        { merge: true }
      );

      setUploading(false);
      Toast.hide();

      Alert.alert("Foto Subido!", "Tu foto ha subido exitosamente!");
      fetchMemberDetails();

      return url;
    } catch (e) {
      console.log(e);
      return null;
    }
  });
  const sideImageTakenHandler = useCallback(async (uri) => {
    if (uri == null) {
      return null;
    }
    const response = await fetch(uri);
    const blob = await response.blob();
    setUploading(true);
    setTransferred(0);
    Toast.show({
      type: "info",
      autoHide: false,
      text1: "Subiendo Foto",
    }); // setFImage(uri);
    const storageRef = firebase
      .storage()
      .ref()
      .child("UserBaseImages/" + `${user.uid}/` + "SideImage");
    const task = storageRef.put(blob);
    task.on("state_changed", (taskSnapshot) => {
      console.log(
        `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`
      );
      setTransferred(
        (
          (taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) *
          100
        ).toFixed(0)
      );
    });

    try {
      await task;

      const url = await storageRef.getDownloadURL();
      await db.doc(user.uid).set(
        {
          SideImage: url,
        },
        { merge: true }
      );

      setUploading(false);
      Toast.hide();

      Alert.alert("Foto Subido!", "Tu foto ha subido exitosamente!");
      fetchMemberDetails();

      return url;
    } catch (e) {
      console.log(e);
      return null;
    }
  });

  const dateHandler = useCallback(async (date) => {
    setEvalDateModal(false);
    var dateChanged = moment(date).format("DD-MM-YYYY");
    addEvalHandler(dateChanged);
    setEvalDateModal(false);
  });

  const addEvalHandler = async (dateChanged) => {
    await newEval(dateChanged);
    fetchMemberEvals();
  };

  const deleteHandler = async (docId) => {
    Alert.alert("Borrar Evaluacion?", "Quiere borrar este evaluación?", [
      { text: "No", style: "default" },
      {
        text: "Si",
        style: "destructive",
        onPress: async () => {
          await deleteEval(docId);
          fetchMemberEvals();
        },
      },
    ]);
  };
  const selectEvalHandler = (id, title, time) => {
    navigation.navigate("Eval", {
      Age: userInfo.Age,
      Gender: userInfo.Gender,
      evalId: id,
      evalTitle: title,
      evalDate: time,
    });
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.noExprimary} />
        <Text>Cargando detalles del usuario</Text>
      </View>
    );
  }

  return (
    <Container>
      <SafeAreaView>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={fetchMemberDetails}
            />
          }
        >
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Edit", {
                // avatar: userPhoto,
                // name: firstName,
              })
            }
          >
            <Header>
              <AvatarView>
                <Avatar
                  rounded
                  size="xlarge"
                  style={{ width: 100, height: 100 }}
                  source={{ uri: `${userInfo.userImg}` }}
                  showEditButton={true}
                />
                <View style={styles.displayName}>
                  <Text style={styles.hello}>{greetingMessage}, </Text>
                  <Text style={styles.name}>
                    {!userInfo.FirstName ? (
                      userName === "" ? (
                        <TouchableOpacity
                          onPress={() => {
                            navigation.navigate("Edit");
                          }}
                        >
                          <Text
                            style={{
                              color: "silver",
                              marginTop: 5,
                              fontWeight: "bold",
                              textDecorationLine: "underline",
                            }}
                          >
                            Agregar Nombre
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        userName
                      )
                    ) : (
                      userInfo.FirstName
                    )}
                  </Text>
                  <View style={styles.button2}>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate("Edit");
                      }}
                    >
                      <Text style={{ fontSize: 13 }}>Editar Perfil</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.button3}>
                    <TouchableOpacity
                      onPress={() => {
                        if (userInfo?.pdf) {
                          Linking.openURL(userInfo?.pdf);
                        } else {
                          alert(
                            "No tienes un entrenmiento personalizado aun. Por favor contacta a tu entrenador"
                          );
                        }
                      }}
                    >
                      <Text style={{ fontSize: 13 }}>
                        Mi Entrenamiento Personalizado
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </AvatarView>
            </Header>
            {userInfo.endDate ? (
              <Text style={styles.expire}>Plan hasta:</Text>
            ) : (
              <Text style={styles.expire}>Actualizar Plan</Text>
            )}
            <View style={{ flexDirection: "row" }}>
              {!isNaN(dateDiff) && (
                <Text style={{ color: "grey", fontWeight: "bold" }}>
                  {dateDiff < 0 ? "Hace " : "En "}
                </Text>
              )}
              <Text
                style={{
                  color: isNaN(dateDiff)
                    ? "orange"
                    : dateDiff < 3
                    ? "red"
                    : "green",
                  fontWeight: "bold",
                }}
              >
                {isNaN(dateDiff) ? "" : Math.abs(Math.round(dateDiff))}
              </Text>
              {!isNaN(dateDiff) && (
                <Text style={{ color: "grey", fontWeight: "bold" }}> Dias</Text>
              )}
            </View>
            <Text style={{ fontWeight: "bold" }}>
              Puntos: {!userInfo.points ? "0" : userInfo.points}
            </Text>
          </TouchableOpacity>

          <View>
            <View>
              <Subtitle>{"infomacion".toUpperCase()}</Subtitle>
            </View>
            <Icon.Button
              name="qr-code"
              size={80}
              color="black"
              backgroundColor="#f0f3f5"
              onPress={() => {
                navigation.navigate("Qr");
              }}
            />
          </View>

          <View style={styles.edit}>
            <TouchableOpacity
              onPress={() => {
                setShowDatos((prevState) => !prevState);
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View>
                  <Subtitle>{"datos basicos".toUpperCase()}</Subtitle>
                </View>
                <View style={{ marginLeft: 15 }}>
                  <Ionicons
                    name={
                      showDatos
                        ? "ios-arrow-down-circle"
                        : "ios-arrow-up-circle"
                    }
                    size={20}
                    color={Colors.noExBright}
                  />
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {showDatos && (
            <BasicInfoScroll
              age={userInfo.Age}
              height={userInfo.Height}
              weight={userInfo.Weight}
              gender={userInfo.Gender}
            />
          )}

          <View style={styles.edit}>
            <TouchableOpacity
              onPress={() => {
                setShowProgreso((prevState) => !prevState);
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View>
                  <Subtitle>{"Evaluación".toUpperCase()}</Subtitle>
                </View>
                <View style={{ marginLeft: 15 }}>
                  <Ionicons
                    name={
                      showProgreso
                        ? "ios-arrow-down-circle"
                        : "ios-arrow-up-circle"
                    }
                    size={20}
                    color={Colors.noExBright}
                  />
                </View>
              </View>
            </TouchableOpacity>
          </View>
          {showProgreso && (
            <View>
              <View style={{ marginLeft: 20 }}>
                <Text>Fecha:</Text>
                {!userInfo.BaseStartDate ? (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("Edit");
                    }}
                  >
                    <Text>Haz click para agregar fecha</Text>
                  </TouchableOpacity>
                ) : (
                  <Text>{userInfo.BaseStartDate}</Text>
                )}
              </View>

              <View style={{ padding: 6 }}>
                <View>
                  <SegmentBar
                    type="IMC"
                    value={userInfo.Imc}
                    gender={userInfo.Gender}
                    age={userInfo.Age}
                  />
                </View>
                <View>
                  <SegmentBar
                    type="Grasa"
                    value={userInfo.Grasa}
                    gender={userInfo.Gender}
                    age={userInfo.Age}
                  />
                </View>
                <View>
                  <SegmentBar
                    type="Musculo"
                    value={userInfo.Musculo}
                    gender={userInfo.Gender}
                    age={userInfo.Age}
                  />
                </View>

                <View>
                  <SegmentBar
                    type="Agua"
                    value={userInfo.Agua}
                    gender={userInfo.Gender}
                    age={userInfo.Age}
                  />
                </View>
                <View>
                  <SegmentBar
                    type="Proteina"
                    value={userInfo.Proteina}
                    gender={userInfo.Gender}
                    age={userInfo.Age}
                  />
                </View>
                <View>
                  <SegmentBar
                    type="Osea"
                    value={userInfo.Osea}
                    gender={userInfo.Gender}
                    age={userInfo.Age}
                  />
                </View>

                <View>
                  <SegmentBar
                    type="Viseral"
                    value={userInfo.Viseral}
                    gender={userInfo.Gender}
                    age={userInfo.Age}
                  />
                </View>
                <View>
                  <SegmentBar
                    type="Metabolismo Basal"
                    value={userInfo.Basal}
                    goal={userInfo.GoalBasal}
                    gender={userInfo.Gender}
                    age={userInfo.Age}
                  />
                </View>
              </View>
            </View>
          )}
          <View style={styles.edit}>
            <TouchableOpacity
              onPress={() => {
                setShowEval((prevState) => !prevState);
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View>
                  <Subtitle>{"Progreso".toUpperCase()}</Subtitle>
                </View>
                <View style={{ marginLeft: 15 }}>
                  <Ionicons
                    name={
                      showEval ? "ios-arrow-down-circle" : "ios-arrow-up-circle"
                    }
                    size={20}
                    color={Colors.noExBright}
                  />
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  "Nuevo Evaluacion",
                  "Quisieras agregar una nueva evaluacion?",
                  [
                    {
                      text: "Si",
                      onPress: () => setEvalDateModal(true),
                    },
                    {
                      text: "Cancelar",
                      onPress: () => console.log("Cancel Pressed"),
                      style: "cancel",
                    },
                  ]
                );
              }}
              style={{ marginRight: 20 }}
            >
              {showEval && (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View>
                    <Text style={{ fontSize: 10, color: "silver" }}>
                      Agregar Evaluación{" "}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: 35,
                      height: 30,
                      borderColor: Colors.noExBright,
                      borderRadius: 10,
                      justifyContent: "center",
                      alignItems: "center",
                      borderWidth: 2,
                    }}
                  >
                    <Ionicons
                      name={Platform.OS === "android" ? "md-add" : "ios-add"}
                      size={20}
                      color="grey"
                    />
                  </View>
                </View>
              )}
            </TouchableOpacity>
          </View>
          {evalDateModal && (
            <View>
              <DateTimePicker
                mode="date"
                isVisible={evalDateModal}
                locale="es-ES"
                onConfirm={
                  (date) => {
                    dateHandler(date);
                  }
                  // this.handleDatePicked(date, "start", "showStart")
                }
                onCancel={() => {
                  setEvalDateModal(false);
                }}
                cancelTextIOS={"Cancelar"}
                confirmTextIOS={"Confirmar"}
                headerTextIOS={"Elige una fecha"}
              />
            </View>
          )}

          {showEval &&
            // {isRefreshing ? (
            //   <View style={{ justifyContent: "center", alignItems: "center" }}>
            //     <ActivityIndicator size="large" color={Colors.noExprimary} />
            //   </View>
            // ) :
            (userEvals.length === 0 ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    padding: 10,
                    fontSize: 15,
                    textAlign: "center",
                    color: "#b8bece",
                  }}
                >
                  Oprime el {<Text style={{ fontSize: 25 }}>'+'</Text>} para
                  crear tu primer evaluación.
                </Text>
              </View>
            ) : (
              <FlatList
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                data={userEvals}
                keyExtractor={(item) => item.key}
                renderItem={(itemData) => (
                  <EvalBlock
                    title={itemData.item.title}
                    onSelect={() => {
                      selectEvalHandler(
                        itemData.item.key,
                        itemData.item.title,
                        itemData.item.timeStamp
                      );
                    }}
                    longPress={() => {
                      deleteHandler(itemData.item.key);
                    }}
                  />
                )}
              />
            ))}

          <View>
            <View style={styles.edit}>
              <TouchableOpacity
                onPress={() => {
                  setShowImagen((prevState) => !prevState);
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View>
                    <Subtitle>{"progress imagen".toUpperCase()}</Subtitle>
                  </View>
                  <View style={{ marginLeft: 15 }}>
                    <Ionicons
                      name={
                        showImagen
                          ? "ios-arrow-down-circle"
                          : "ios-arrow-up-circle"
                      }
                      size={20}
                      color={Colors.noExBright}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            {showImagen && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginLeft: 30,
                  marginRight: 30,
                }}
              >
                <ImagePicker
                  onImageTaken={frontImageTakenHandler}
                  title="Imagen Frontal"
                  source={userInfo.FrontImage}
                  refresh={() => fetchMemberDetails()}
                />
                <ImagePicker
                  onImageTaken={sideImageTakenHandler}
                  title="Imagen Lateral"
                  source={userInfo.SideImage}
                  refresh={() => fetchMemberDetails()}
                />
              </View>
            )}
          </View>
        </ScrollView>
        <Toast position="bottom" bottomOffset={20} />
      </SafeAreaView>
    </Container>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  button: {
    margin: 10,
    width: 160,
    height: 50,
    backgroundColor: Colors.noExprimary,
    borderRadius: 10,
    elevation: 5,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  button2: {
    marginBottom: 10,
    // marginTop: -15,
    marginTop: 5,
    width: 100,
    height: 20,
    marginLeft: -5,
    backgroundColor: "#DDDDDD",
    borderRadius: 10,
    borderColor: "black",
    // borderWidth: 1,
    elevation: 5,
    // alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  button3: {
    marginBottom: 10,
    // marginTop: -15,
    marginTop: 5,
    paddingHorizontal: 5,

    width: 300,
    height: 20,
    marginLeft: -5,
    backgroundColor: "#DDDDDD",
    borderRadius: 10,
    borderColor: "black",
    // borderWidth: 1,
    elevation: 5,
    // alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "white",
    alignSelf: "center",
    textTransform: "uppercase",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
  },
  centeredView: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    width: "80%",
    margin: 20,
    backgroundColor: "#E8E8E8",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  edit: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  textStyle: {
    color: "red",
    fontWeight: "bold",
    textAlign: "center",
    marginRight: 10,
  },
  form: {
    margin: 20,
  },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  hello: {
    marginTop: 2,
    fontWeight: "bold",
    textAlign: "left",
    fontSize: 15,
  },
  name: {
    fontSize: 25,
    fontWeight: "bold",
    color: Colors.noExprimary,
  },
  basicInfo: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 25,
    color: "#6C6C6C",
  },

  displayName: {
    marginTop: 10,
    marginLeft: 10,
    width: "100%",
    // justifyContent: "flex-start",
    // alignItems: "flex-start",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  screen: {
    flex: 1,
  },
  picker: {
    marginBottom: 80,
    marginTop: -80,
    height: 20,
    width: 200,
  },
  wheel: {
    backgroundColor: "#ffc733",
    borderRadius: 10,
    paddingTop: 20,
    paddingBottom: 20,
    width: 150,
  },
  wheelBlock: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginLeft: 30,
    marginRight: 30,
    borderRadius: 10,
    paddingTop: 20,
    paddingBottom: 20,
  },
  expire: {
    fontWeight: "bold",
    color: "silver",
    fontSize: 15,
  },
});

const Container = styled.View`
  flex: 1;
  background-color: #f2f2f2;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`;
const Header = styled.View`
  height: 130px;
  background: #f2f2f2;
`;
const AvatarView = styled.View`
  width: 150px;
  height: 110px;
  border-radius: 75px;
  position: absolute;
  flex-direction: row;
  /* top: 120px; */
  margin-top: 10px;
  /* left: 38%; */
  margin-left: 10px;
  /* z-index: 1; */
  /* justify-content: center;
  align-items: center; */
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.15);
`;
const Subtitle = styled.Text`
  color: #b8bece;
  font-weight: 600;
  font-size: 20px;
  margin-left: 20px;
  margin-top: 10px;
  margin-bottom: 10px;
  text-transform: uppercase;
`;

export default ProfileScreen;
