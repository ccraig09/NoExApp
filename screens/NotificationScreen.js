import React, { Component, useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { AuthContext } from "../navigation/AuthProvider";
import firebase from "../components/firebase";
import { useFocusEffect } from "@react-navigation/native";
import Colors from "../constants/Colors";
import { ButtonGroup } from "react-native-elements";

const NotificationScreen = (props) => {
  const { user, readUpdate, accept, notificationReceipt } =
    useContext(AuthContext);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [cuponesNotificationList, setCuponesNotificationList] = useState([]);
  const [personalNotificationList, setPersonalNotificationList] = useState([]);
  const [announcementList, setAnnouncementList] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchNotifications = async () => {
        try {
          const list = [];
          await firebase
            .firestore()
            .collection("Members")
            .doc(user.uid)
            .collection("User Notifications")
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                const {
                  title,
                  subtitle,
                  timestamp,
                  userId,
                  Status,
                  isRead,
                  Points,
                  Type,
                  userInfo,
                } = doc.data();
                list.push({
                  key: doc.id,
                  Title: title,
                  subtitle: subtitle,
                  timestamp: timestamp.toDate().toDateString(),
                  userId: userId,
                  Type: Type,
                  Points: Points,
                  Status: Status,
                  isRead: isRead,
                  userInfo: userInfo,
                  sort: timestamp,
                });
              });
            });
          setCuponesNotificationList(
            list
              .sort((a, b) => (a.sort < b.sort ? 1 : -1))
              .filter((data) => data.Type == "Cupones")
          );
          setPersonalNotificationList(
            list
              .sort((a, b) => (a.sort < b.sort ? 1 : -1))
              .filter((data) => data.Type == "Personal")
          );
        } catch (e) {
          console.log(e);
        }
      };
      const fetchAnnouncements = async () => {
        try {
          const list = [];
          await firebase
            .firestore()
            .collection("User Announcements")
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                const {
                  title,
                  subtitle,
                  timestamp,
                  userId,
                  Status,
                  isRead,
                  userInfo,
                } = doc.data();
                list.push({
                  key: doc.id,
                  Title: title,
                  subtitle: subtitle,
                  timestamp: timestamp.toDate().toDateString(),
                  userId: userId,
                  Status: Status,
                  isRead: true,
                  userInfo: userInfo,
                  sort: timestamp,
                });
              });
            });
          setAnnouncementList(list.sort((a, b) => (a.sort < b.sort ? 1 : -1)));
        } catch (e) {
          console.log(e);
        }
      };

      fetchNotifications();
      fetchAnnouncements();
    }, [])
  );
  const fetchNotifications = async () => {
    try {
      const list = [];
      await firebase
        .firestore()
        .collection("Members")
        .doc(user.uid)
        .collection("User Notifications")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const {
              title,
              subtitle,
              timestamp,
              userId,
              Status,
              isRead,
              Points,
              Type,
              userInfo,
            } = doc.data();
            list.push({
              key: doc.id,
              Title: title,
              subtitle: subtitle,
              timestamp: timestamp.toDate().toDateString(),
              userId: userId,
              Type: Type,
              Points: Points,
              Status: Status,
              isRead: isRead,
              userInfo: userInfo,
              sort: timestamp,
            });
          });
        });
      setCuponesNotificationList(
        list
          .sort((a, b) => (a.sort < b.sort ? 1 : -1))
          .filter((data) => data.Type == "Cupones")
      );
      setPersonalNotificationList(
        list
          .sort((a, b) => (a.sort < b.sort ? 1 : -1))
          .filter((data) => data.Type == "Personal")
      );
    } catch (e) {
      console.log(e);
    }
  };

  const readUpdateHandler = async (key, boolean) => {
    await readUpdate(key, boolean);
    fetchNotifications();
  };

  // const acceptHandler = async (
  //   key,
  //   state,
  //   boolean,
  //   userInfo,
  //   type,
  //   header,
  //   subHeader
  // ) => {
  //   await accept(key, state, boolean);
  //   await triggerNotificationHandler(
  //     userInfo,
  //     type,
  //     state,
  //     header,
  //     subHeader,
  //     boolean
  //   );
  //   fetchNotifications();
  // };

  // const triggerNotificationHandler = (
  //   userInfo,
  //   type,
  //   state,
  //   header,
  //   subHeader,
  //   boolean
  // ) => {
  //   console.log("token?", userInfo.expoPushToken);
  //   fetch("https://exp.host/--/api/v2/push/send", {
  //     method: "POST",
  //     headers: {
  //       Accept: "application/json",
  //       "Accept-Encoding": "gzip, deflate",
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       to: userInfo.expoPushToken,
  //       sound: "default",
  //       // data: { extraData: scannedUser },
  //       title: `${header}`,
  //       body: `${subHeader}`,
  //     }),
  //   });
  //   notificationReceipt(
  //     `${header}`,
  //     `${subHeader}`,
  //     userInfo.expoPushToken,
  //     userInfo.FirstName,
  //     userInfo.LastName,
  //     userInfo,
  //     state,
  //     boolean
  //   );
  //   Alert.alert("Notification Enviado!", "");
  //   // setNotify(false);
  //   // setNotifyTitle("");
  //   // setNotifySubtitle("");
  // };

  return (
    <View>
      <ButtonGroup
        buttons={["PERSONAL", "ANUNCIOS", "CUPONES"]}
        selectedIndex={selectedIndex}
        onPress={(value) => {
          console.log(value);
          setSelectedIndex(value);
        }}
        selectedButtonStyle={{ backgroundColor: Colors.noExprimary }}
        containerStyle={{ marginBottom: 20, borderRadius: 15 }}
      />
      <FlatList
        style={styles.root}
        data={
          selectedIndex === 0
            ? personalNotificationList
            : selectedIndex === 1
            ? announcementList
            : cuponesNotificationList
        }
        // extraData={this.state}
        ItemSeparatorComponent={() => {
          return <View style={styles.separator} />;
        }}
        keyExtractor={(item, index) => {
          return index.toString();
        }}
        renderItem={(item) => {
          const Notification = item.item;
          const titleColor = () => {
            if (Notification.Title === "Ups!") {
              return "red";
            }
            if (Notification.Title === "Aprobado ☑️") {
              return "green";
            } else {
              return Colors.noExprimary;
            }
          };
          let attachment = <View />;

          let mainContentStyle;
          if (Notification.attachment) {
            mainContentStyle = styles.mainContent;
            attachment = (
              <Image
                style={styles.attachment}
                source={{ uri: Notification.attachment }}
              />
            );
          }
          return (
            <TouchableOpacity
              style={[
                styles.container,
                { backgroundColor: !Notification.isRead ? "silver" : "white" },
              ]}
              onPress={() => {
                if (selectedIndex === 0) {
                  Alert.alert("Eligir Accion", "", [
                    {
                      text: "Cancel",
                      onPress: () => console.log("Cancel Pressed"),
                      style: "cancel",
                    },
                    !Notification.isRead
                      ? {
                          text: "Marcar como leido",
                          //  "Marcar como no leido",
                          onPress: () =>
                            readUpdateHandler(Notification.key, true),
                        }
                      : {
                          text: "Marcar como no leido",
                          //  "Marcar como no leido",
                          onPress: () =>
                            readUpdateHandler(Notification.key, false),
                        },
                  ]);
                } else {
                  null;
                }
              }}
            >
              {/* <Image
              source={{
                uri: Notification.userInfo
                  ? Notification.userInfo.userImg
                  : null,
              }}
              style={styles.avatar}
            /> */}
              <View style={styles.content}>
                <View style={mainContentStyle}>
                  <View style={styles.text}>
                    <Text
                      style={
                        ([styles.name],
                        {
                          color: titleColor(),
                          fontWeight: "bold",
                        })
                      }
                    >
                      {Notification.Title}
                    </Text>
                    <Text>{Notification.subtitle}</Text>
                    {Notification.Status ? (
                      <Text style={{ fontWeight: "bold" }}>
                        Estado:{" "}
                        <Text
                          style={{
                            color:
                              Notification.Status === "Pendiente"
                                ? Colors.noExprimary
                                : "green",
                            fontWeight: "bold",
                          }}
                        >
                          {Notification.Status}
                        </Text>
                      </Text>
                    ) : null}
                    {Notification.Points ? (
                      <Text style={{ fontWeight: "bold" }}>
                        Puntos:{" "}
                        <Text
                          style={{
                            color: "green",
                            fontWeight: "bold",
                          }}
                        >
                          {Notification.Points}
                        </Text>
                      </Text>
                    ) : null}
                    {Notification.points ? (
                      <Text style={styles.category}>
                        Puntos:{" "}
                        <Text style={styles.answer}>{Notification.points}</Text>
                      </Text>
                    ) : null}
                  </View>
                  <Text style={styles.timeAgo}>{Notification.timestamp}</Text>
                </View>
                {attachment}
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: "#FFFFFF",
  },
  container: {
    padding: 16,
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#FFFFFF",
    alignItems: "flex-start",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  text: {
    marginBottom: 5,
    // flexDirection: "row",
    // flexWrap: "wrap",
  },
  category: {
    fontWeight: "bold",
  },
  answer: {
    fontWeight: "normal",
  },
  content: {
    flex: 1,
    marginLeft: 16,
    marginRight: 0,
  },
  mainContent: {
    marginRight: 60,
  },
  img: {
    height: 50,
    width: 50,
    margin: 0,
  },
  attachment: {
    position: "absolute",
    right: 0,
    height: 50,
    width: 50,
  },
  separator: {
    height: 1,
    backgroundColor: "#CCCCCC",
  },
  timeAgo: {
    fontSize: 12,
    color: "#696969",
  },
  name: {
    fontSize: 16,
    color: "#1E90FF",
    fontWeight: "bold",
  },
});

export default NotificationScreen;
