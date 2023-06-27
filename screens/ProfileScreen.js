import React, { useState, useContext, useCallback, useEffect } from "react";
import {
  StatusBar,
  Dimensions,
  ScrollView,
  View,
  StyleSheet,
  ActivityIndicator,
  Platform,
  TouchableOpacity,
  Text,
  Alert,
  FlatList,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import styled, { useTheme } from "styled-components";
import { Avatar, Button } from "react-native-elements";
import EvalBlock from "../components/EvalBlock";
import * as Linking from "expo-linking";
import Icon from "react-native-vector-icons/Ionicons";

import Colors from "../constants/Colors";
import ImagePicker from "../components/ImagePicker";
import { AuthContext } from "../navigation/AuthProvider";

import BasicInfoScroll from "../components/BasicInfoScrollview";
import Toast from "react-native-toast-message";

import SegmentBar from "../components/SegmentBar";
import firebase from "../components/firebase";
import DateTimePicker from "react-native-modal-datetime-picker";
import Moment from "moment";
import { extendMoment } from "moment-range";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { requestTrackingPermissionsAsync } from "expo-tracking-transparency";
import ActionButton from "react-native-action-button";

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

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
    };
  },
});

const ProfileScreen = ({ navigation }) => {
  const { user, newEval, deleteEval, addToken } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showEval, setShowEval] = useState(true);
  const [showDatos, setShowDatos] = useState(true);
  const [evalDateModal, setEvalDateModal] = useState(false);
  const [showProgreso, setShowProgreso] = useState(true);
  const [userName, setUserName] = useState();

  const [showImagen, setShowImagen] = useState(true);
  const [userInfo, setUserInfo] = useState([]);
  const [userEvals, setUserEvals] = useState([]);
  const db = firebase.firestore().collection("Members");

  const moment = extendMoment(Moment);
  var date1 = moment().startOf("day");
  var date2 = moment(userInfo.endDate, "DD-MM-YYYY");

  const dateDiff = moment.duration(date2.diff(date1)).asDays();

  const fetchMemberDetails = async () => {
    try {
      console.log(">>>+++ fetchMemberDetails");
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
      console.log(">>>> fetching member evals");
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
    } finally {
      console.log(">> tryin ntfy");
      registerForPushNotificationsAsync();
    }
  };

  async function registerForPushNotificationsAsync() {
    console.log("notifications ran");
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        Alert.alert(
          "Alerta",
          "No recibirá noticias si no habilita las notificaciones. Si desea recibir notificaciones, habilitelas desde configuración.",
          [
            { text: "Cancel" },
            // If they said no initially and want to change their mind,
            // we can automatically open our app in their settings
            // so there's less friction in turning notifications on
            {
              text: "Activar Notificaciones",
              onPress: () =>
                Platform.OS === "ios"
                  ? Linking.openURL("app-settings:")
                  : Linking.openSettings(),
            },
          ]
        );
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      // console.log(token);
    } else {
      alert("Must use physical device for Push Notifications");
      token = null;
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }
    return addToken(token);
  }

  // useEffect(() => {
  //   async () => {
  //     console.log("started");
  //     registerForPushNotificationsAsync().then((token) => {
  //       addToken(token);
  //       console.log(">>>>>", token);
  //     });
  //   };
  // }, []);

  // useEffect(() => {
  //   registerForPushNotificationsAsync();
  // }, []);

  useEffect(() => {
    fetchMemberEvals();
  }, []);

  useEffect(() => {
    fetchMemberDetails();
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await requestTrackingPermissionsAsync();
      if (status === "granted") {
        console.log("Yay! I have user permission to track data");
      }
    })();
    const backgroundSubscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        // console.log("background", response);
        // navigation.navigate("Edit");
      });

    const foregroundSubscription =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("foreground", notification);
      });
    return () => {
      backgroundSubscription.remove();
      foregroundSubscription.remove();
    };
  }, []);

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
          <View style={{ flexDirection: "row" }}>
            <View>
              <Avatar
                rounded
                size="xlarge"
                style={{ width: 90, height: 90, marginLeft: 10 }}
                source={{ uri: `${userInfo.userImg}` }}
                // showEditButton={true}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                // justifyContent: "space-around",
                paddingHorizontal: 10,
                // width: 200,
              }}
            >
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
              </View>
              <View style={styles.planDetails}>
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
                    <Text style={{ color: "grey", fontWeight: "bold" }}>
                      {" "}
                      Dias
                    </Text>
                  )}
                </View>
                <Text style={{ fontWeight: "bold" }}>
                  Puntos: {!userInfo.points ? "0" : userInfo.points}
                </Text>
              </View>
            </View>
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
        <ActionButton useNativeDriver={false} buttonColor={Colors.noExprimary}>
          <ActionButton.Item
            buttonColor="#9b59b6"
            title="Editar Perfil"
            onPress={() => navigation.navigate("Edit")}
          >
            <Icon name="create-outline" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item
            buttonColor="#3498db"
            title="Mi entrenamiento personalizado"
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
            <Icon name="document-outline" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item
            buttonColor="#1abc9c"
            title="Iniciar sesion "
            onPress={() => navigation.navigate("Qr")}
          >
            <Icon name="qr-code-outline" style={styles.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton>
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
    // paddingHorizontal: 5,

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
    // marginTop: 10,
    marginLeft: 10,
    // width: "90%",
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
  planDetails: {
    paddingLeft: 20,
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
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: "white",
  },
});

const Container = styled.View`
  flex: 1;
  background-color: #f2f2f2;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  margin-top: 20px;
`;
const Header = styled.View`
  height: 130px;
  background: #f2f2f2;
`;
const AvatarView = styled.View`
  width: 130px;
  height: 110px;
  border-radius: 75px;
  // position: absolute;
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
