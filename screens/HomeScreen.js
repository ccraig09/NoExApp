import React, { useState, useCallback, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import styled from "styled-components";
import ClassItem from "../components/ClassItem";
import { AuthContext } from "../navigation/AuthProvider";
import firebase from "../components/firebase";
import * as Device from "expo-device";

import Icon from "react-native-vector-icons/Ionicons";
import Colors from "../constants/Colors";
import { Avatar } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";
import Moment from "moment";
import { extendMoment } from "moment-range";
import * as Notifications from "expo-notifications";
import * as Linking from "expo-linking";
import { requestTrackingPermissionsAsync } from "expo-tracking-transparency";

import NotificationButton from "../components/UI/NotificationButton";

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
    };
  },
});

const HomeScreen = ({ navigation }) => {
  const [classData, setClassData] = useState([]);
  const [fitnessClasses, setFitnessClasses] = useState([]);
  const [sportsClasses, setSportsClasses] = useState([]);
  const [kidsClasses, setKidsClasses] = useState([]);
  const [Level1, setLevel1] = useState([]);
  const [userInfo, setUserInfo] = useState([]);
  const [notificationList, setNotificationList] = useState([]);
  const [userImage, setUserImage] = useState(null);
  // const [expoPushToken, setExpoPushToken] = useState("");

  const { user, addToken } = useContext(AuthContext);

  const width = Dimensions.get("window").width;
  const moment = extendMoment(Moment);

  var date1 = moment().startOf("day");
  var date2 = moment(userInfo.endDate, "DD-MM-YYYY");
  // const dateDiff = moment(date1).diff(date2, 'days');

  const dateDiff = moment.duration(date2.diff(date1)).asDays();

  useFocusEffect(
    React.useCallback(() => {
      const fetchMemberDetails = async () => {
        try {
          await firebase
            .firestore()
            .collection("Members")
            .doc(user.uid)
            .get()
            .then((doc) => {
              if (doc.exists) {
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
      // console.log("loading home and user", user);
      const fetchClasses = async () => {
        try {
          const list = [];
          await firebase
            .firestore()
            .collection("Classes")
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                const {
                  Title,
                  Image,
                  Time,
                  Subtitle,
                  Caption,
                  Category,
                  Levels,
                  Difficulty,
                } = doc.data();
                list.push({
                  key: doc.id,
                  Title: Title,
                  Image: Image,
                  Time: Time,
                  Subtitle: Subtitle,
                  Caption: Caption,
                  Category: Category,
                  Levels: Levels,
                  Difficulty: Difficulty,
                });
              });
            });
          // console.log(
          //   "classes",
          //   list.filter((data) => data.Category == "fitness")
          // );
          setFitnessClasses(
            list
              .filter((data) => data.Category == "fitness")
              .sort((a, b) => (a.order < b.order ? 1 : -1))
          );
          setSportsClasses(list.filter((data) => data.Category == "sports"));
          setKidsClasses(list.filter((data) => data.Category == "kids"));
          // console.log("this the user?", user);
          // console.log(fitnessClasses);
          // setLevel1(fitnessClasses[0].Level1);
        } catch (e) {
          console.log(e);
        }
      };

      const fetchNotifications = async () => {
        try {
          const list = [];
          await firebase
            .firestore()
            .collection("Members")
            .doc(user.uid)
            .collection("User Notifications")
            .where("isRead", "==", false)
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                const {
                  Title,
                  Cell,
                  timestamp,
                  userId,
                  Goals,
                  Plan,
                  extraInfo,
                  Time,
                  Status,
                  startDate,
                  Suggestion,
                  isRead,
                } = doc.data();
                list.push({
                  key: doc.id,
                  Title: Title,
                  Cell: Cell,
                  timestamp: timestamp.toDate().toDateString(),
                  userId: userId,
                  Goals: Goals,
                  Plan: Plan,
                  extraInfo: extraInfo,
                  Time: Time,
                  Status: Status,
                  startDate: startDate,
                  Suggestion: Suggestion,
                  isRead: isRead,
                  sort: timestamp,
                });
              });
            });
          console.log(list);
          setNotificationList(list.length);
        } catch (e) {
          console.log(e);
        }
        // fetchMemberDetails();
      };
      // registerForPushNotificationsAsync().then((token) => {
      //   // setExpoPushToken(token);
      //   addToken(token);
      // });

      // fetchNotifications();
      fetchClasses();
      // triggerPlanReminderNotification();
    }, [])
  );

  // async function registerForPushNotificationsAsync() {
  //   let token;
  //   if (Device.isDevice) {
  //     const { status: existingStatus } =
  //       await Notifications.getPermissionsAsync();
  //     let finalStatus = existingStatus;
  //     if (existingStatus !== "granted") {
  //       const { status } = await Notifications.requestPermissionsAsync();
  //       finalStatus = status;
  //     }
  //     if (finalStatus !== "granted") {
  //       Alert.alert(
  //         "Alerta",
  //         "No recibirá noticias si no habilita las notificaciones. Si desea recibir notificaciones, habilitelas desde configuración.",
  //         [
  //           { text: "Cancel" },
  //           // If they said no initially and want to change their mind,
  //           // we can automatically open our app in their settings
  //           // so there's less friction in turning notifications on
  //           {
  //             text: "Activar Notificaciones",
  //             onPress: () =>
  //               Platform.OS === "ios"
  //                 ? Linking.openURL("app-settings:")
  //                 : Linking.openSettings(),
  //           },
  //         ]
  //       );
  //       return;
  //     }
  //     token = (await Notifications.getExpoPushTokenAsync()).data;
  //     // console.log(token);
  //   } else {
  //     alert("Must use physical device for Push Notifications");
  //     token = null;
  //   }

  //   if (Platform.OS === "android") {
  //     Notifications.setNotificationChannelAsync("default", {
  //       name: "default",
  //       importance: Notifications.AndroidImportance.MAX,
  //       vibrationPattern: [0, 250, 250, 250],
  //       lightColor: "#FF231F7C",
  //     });
  //   }
  //   return token;
  // }
  // const triggerPlanReminderNotification = async () => {
  //   const date2 = moment(`${userInfo.endDate} 8:30`, "DD-MM-YYYY hh:mm");
  //   const date3 = moment(date2, "DD-MM-YYYY").subtract(2, "days");
  //   const test = await Notifications.getAllScheduledNotificationsAsync();
  //   console.log("checking all notes", test);
  //   await Notifications.cancelAllScheduledNotificationsAsync();

  //   if (date3 > new Date()) {
  //     console.log("Bingo! going to schedule 2 day alert");

  //     const trigger = new Date(date3);
  //     // trigger.setMinutes(50);
  //     // trigger.setHours(14);

  //     console.log(date3);
  //     await Notifications.scheduleNotificationAsync({
  //       content: {
  //         title: `Hola ${userInfo.FirstName}, Tu plan se acabara pronto`,
  //         body: "Falta 2 dias hasta que acaba tu plan! Seguir logrando tus metas y considerar renovando pronto por un discuento",
  //         data: userInfo,
  //       },
  //       trigger,
  //     });
  //   } else {
  //     console.log("inside of 2 days, no scheduling needed");
  //   }

  //   // const toCancel = test.filter(
  //   //   (info) => info.content.data.userId == user.uid
  //   // );
  //   // const cancelList = toCancel. ((id) => id.identifier)[0];
  //   // await Notifications.cancelScheduledNotificationAsync(cancelList);
  //   // console.log("checking all notes cancel", cancelList.length);
  // };
  // useEffect(() => {
  //   (async () => {
  //     const { status } = await requestTrackingPermissionsAsync();
  //     if (status === "granted") {
  //       console.log("Yay! I have user permission to track data");
  //     }
  //   })();
  //   const backgroundSubscription =
  //     Notifications.addNotificationResponseReceivedListener((response) => {
  //       // console.log("background", response);
  //       // navigation.navigate("Edit");
  //     });

  //   const foregroundSubscription =
  //     Notifications.addNotificationReceivedListener((notification) => {
  //       console.log("foreground", notification);
  //     });
  //   return () => {
  //     backgroundSubscription.remove();
  //     foregroundSubscription.remove();
  //   };
  // }, []);

  return (
    <View style={styles.container}>
      <Subtitle>{"Entrenamientos".toUpperCase()}</Subtitle>
      <FlatList
        // horizontal={true}
        showsVerticalScrollIndicator={false}
        data={fitnessClasses}
        renderItem={(itemData) => (
          <ClassItem
            image={itemData.item.Image}
            title={itemData.item.Title}
            logo={itemData.item.logo}
            caption={itemData.item.Caption}
            subtitle={itemData.item.Subtitle}
            onClassClick={() => {
              navigation.navigate("Section", {
                classId: itemData.item.key,
                classes: fitnessClasses,
              });
            }}
          />
        )}
      />
    </View>
  );

  //   <SafeAreaView style={styles.Container}>
  //     <View
  //       style={{
  //         maxWidth: width,
  //         marginTop: 20,
  //         flexDirection: "row",
  //         // justifyContent: "space-between",
  //         // paddingRight: 10,
  //         paddingLeft: 20,
  //       }}
  //     >
  //       <Avatar
  //         rounded
  //         size={90}
  //         // {!userInfo.userImg ? (
  //         icon={{ name: "user", type: "font-awesome" }}
  //         // }
  //         // style={{ padding: 0 }}
  //         source={{ uri: `${userInfo?.userImg}` }}
  //         onPress={() => {
  //           if (!userInfo.userImg) {
  //             navigation.navigate("Edit");
  //           } else {
  //             navigation.navigate("Profile");
  //           }
  //         }}
  //       >
  //         {!userInfo.userImg ? (
  //           <TouchableOpacity
  //             onPress={() => {
  //               navigation.navigate("Edit");
  //             }}
  //           >
  //             <Avatar.Accessory
  //               name="pencil-alt"
  //               type="font-awesome-5"
  //               size={25}
  //             />
  //           </TouchableOpacity>
  //         ) : null}
  //       </Avatar>

  //       <View
  //         style={{
  //           paddingRight: 10,
  //           flex: 1,
  //           flexDirection: "row",
  //           justifyContent: "space-between",
  //         }}
  //       >
  //         <View style={styles.displayName}>
  //           <Text style={styles.subtitle}>{greetingMessage}, </Text>
  //           {/* <View style={{ flexDirection: "row" }}> */}
  //           <Text style={styles.hello}>
  //             {!userInfo.FirstName ? (
  //               <TouchableOpacity
  //                 onPress={() => {
  //                   navigation.navigate("Edit");
  //                 }}
  //               >
  //                 <Text
  //                   style={{
  //                     color: "silver",
  //                     marginTop: 5,
  //                     fontWeight: "bold",
  //                     textDecorationLine: "underline",
  //                   }}
  //                 >
  //                   Agregar Nombre
  //                 </Text>
  //               </TouchableOpacity>
  //             ) : (
  //               userInfo.FirstName
  //             )}
  //           </Text>

  //           {userInfo.endDate ? (
  //             <Text style={styles.expire}>Plan hasta:</Text>
  //           ) : (
  //             <Text style={styles.expire}>Actualizar Plan</Text>
  //           )}

  //           <Text style={styles.expire}>
  //             {userInfo.endDate ? userInfo.endDate : ""}
  //           </Text>
  //           <View style={{ flexDirection: "row" }}>
  //             {!isNaN(dateDiff) && (
  //               <Text style={{ color: "grey", fontWeight: "bold" }}>
  //                 {dateDiff < 0 ? "Hace " : "En "}
  //               </Text>
  //             )}
  //             <Text
  //               style={{
  //                 color: isNaN(dateDiff)
  //                   ? "orange"
  //                   : dateDiff < 3
  //                   ? "red"
  //                   : "green",
  //                 fontWeight: "bold",
  //               }}
  //             >
  //               {isNaN(dateDiff) ? "" : Math.abs(Math.round(dateDiff))}
  //             </Text>
  //             {!isNaN(dateDiff) && (
  //               <Text style={{ color: "grey", fontWeight: "bold" }}> Dias</Text>
  //             )}
  //           </View>
  //           <Text style={{ fontWeight: "bold" }}>
  //             Puntos: {!userInfo.points ? "0" : userInfo.points}
  //           </Text>
  //         </View>
  //         <View style={styles.qr}>
  //           <Icon.Button
  //             name="qr-code"
  //             size={80}
  //             color="black"
  //             backgroundColor="#f0f3f5"
  //             onPress={() => {
  //               navigation.navigate("Qr");
  //             }}
  //           />
  //           <TouchableOpacity
  //             onPress={() => {
  //               navigation.navigate("Notification");
  //             }}
  //           >
  //             <NotificationButton length={notificationList} />
  //           </TouchableOpacity>
  //           {/* </View>
  //         <View style={{ alignItems: "flex-end" }}> */}
  //         </View>
  //         {/* </View> */}
  //       </View>
  //     </View>
  //       <Subtitle>{"Entrenamientos".toUpperCase()}</Subtitle>
  //       <FlatList
  //         horizontal={true}
  //         showsHorizontalScrollIndicator={false}
  //         data={fitnessClasses}
  //         renderItem={(itemData) => (
  //           <ClassItem
  //             image={itemData.item.Image}
  //             title={itemData.item.Title}
  //             logo={itemData.item.logo}
  //             caption={itemData.item.Caption}
  //             subtitle={itemData.item.Subtitle}
  //             onClassClick={() => {
  //               navigation.navigate("Section", {
  //                 classId: itemData.item.key,
  //                 classes: fitnessClasses,
  //               });
  //             }}
  //           />
  //         )}
  //       />
  //       {/* <Subtitle>{"Deportes".toUpperCase()}</Subtitle>
  //       <FlatList
  //         horizontal={true}
  //         showsHorizontalScrollIndicator={false}
  //         data={sportsClasses}
  //         renderItem={(itemData) => (
  //           <ClassItem
  //             image={itemData.item.Image}
  //             title={itemData.item.Title}
  //             logo={itemData.item.logo}
  //             caption={itemData.item.Caption}
  //             subtitle={itemData.item.Subtitle}
  //             onClassClick={() => {
  //               navigation.navigate("Section", {
  //                 classId: itemData.item.key,
  //                 classes: sportsClasses,
  //               });
  //             }}
  //           />
  //         )}
  //       />
  //       <Subtitle>{"Niños".toUpperCase()}</Subtitle>
  //       <FlatList
  //         horizontal={true}
  //         showsHorizontalScrollIndicator={false}
  //         data={kidsClasses}
  //         renderItem={(itemData) => (
  //           <ClassItem
  //             image={itemData.item.Image}
  //             title={itemData.item.Title}
  //             //   price={itemData.item.price}
  //             logo={itemData.item.logo}
  //             caption={itemData.item.Caption}
  //             subtitle={itemData.item.Subtitle}
  //             //   image={itemData.item.image}
  //             onClassClick={() => {
  //               navigation.navigate("Section", {
  //                 classId: itemData.item.key,
  //                 classes: kidsClasses,
  //               });
  //             }}
  //           />
  //         )}
  //       /> */}
  //   </SafeAreaView>
  // );
};

const Subtitle = styled.Text`
  color: #b8bece;
  font-weight: 800;
  font-size: 25px;
  margin-left: 20px;
  margin-top: 20px;
  text-transform: uppercase;
`;
const styles = StyleSheet.create({
  RootView: {
    backgroundColor: "black",
    flex: 1,
  },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  Container: {
    flex: 1,
    backgroundColor: "#f0f3f5",
  },
  displayName: {
    marginBottom: 25,
    alignItems: "flex-start",
    // marginTop: 20,
    marginLeft: 10,
    width: "45%",
  },
  hello: {
    flexWrap: "wrap",
    fontWeight: "bold",
    color: Colors.noExprimary,
    fontSize: 20,
  },
  expire: {
    fontWeight: "bold",
    color: "silver",
    fontSize: 15,
  },
  qr: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    // marginTop: 20,
    // height: 50,
    // width: 50,
    // alignSelf: "center",
  },
  subtitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
export default HomeScreen;
