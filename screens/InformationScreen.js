import React, {
  useState,
  useEffect,
  useCallback,
  createRef,
  useContext,
} from "react";
import {
  View,
  StyleSheet,
  Button,
  Alert,
  RefreshControl,
  Text,
  ScrollView,
  TouchableWithoutFeedback,
  Modal,
  Dimensions,
  Keyboard,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { AuthContext } from "../navigation/AuthProvider";
import { extendMoment } from "moment-range";
import Moment from "moment";
import Toast from "react-native-toast-message";
import { Tooltip } from "react-native-elements";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import PromoItem from "../components/PromoItem";
import ClassItem from "../components/ClassItem";
import { Input } from "react-native-elements";

import DateTimePicker from "react-native-modal-datetime-picker";
import { CalendarList } from "react-native-calendars";
import { PricingCard, Icon } from "react-native-elements";
import Colors from "../constants/Colors";
import styled from "styled-components";
import firebase from "../components/firebase";
import { useFocusEffect } from "@react-navigation/native";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
    };
  },
});
// import { useDispatch } from "react-redux";
// import * as authActions from "../store/actions/auth";
const actionSheetRef = createRef();

const InformationScreen = ({ navigation }) => {
  const { user, sendReservation, sendSuggest } = useContext(AuthContext);
  const [evalDateModal, setEvalDateModal] = useState(false);
  const [DateModal, setDateModal] = useState(false);
  const [extraInfo, setExtraInfo] = useState(false);
  const [reserveTime, setReserveTime] = useState("");
  const [startDate, setStartDate] = useState("");
  const [plan, setPlan] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [extraInfoData, setExtraInfoData] = useState("");
  const [extraInfoDataGoals, setExtraInfoGoals] = useState("");
  const [extraInfoDataCelular, setExtraInfoDataCelular] = useState("");
  const [image, setImage] = useState(null);
  const [promolist, setPromoList] = useState([]);
  const [premio3erlist, setPremio3erList] = useState([]);
  const [premioNoExlist, setPremioNoExList] = useState([]);
  const [contactlist, setContactList] = useState([]);
  const [userInfo, setUserInfo] = useState([]);

  const [coachList, setCoachList] = useState([]);

  let screenWidth = Dimensions.get("window").width;
  const moment = extendMoment(Moment);

  const dateHandler = (date) => {
    console.log("date print", date);
    var dateChanged = moment(date).format("HH:mm");
    setReserveTime(dateChanged);
    setEvalDateModal(false);
    setTimeout(() => {
      Alert.alert(
        `Reservar Fecha`,
        "Por favor elige la fecha que quisiera empezar.",
        [
          { text: "Cancelar", style: "destructive" },
          {
            text: "Listo!",
            style: "default",
            onPress: () => {
              // setExtraInfo(false);
              setDateModal(true);
            },
          },
        ]
      );
    }, 1000);
  };

  const suggestionHandler = async () => {
    await sendSuggest(suggestions, userInfo);
    suggestNotificationHandler();
    setSuggestions("");
    Alert.alert("Sugerencia Enviado!", "Gracias por tus comentarios.");
  };

  const startDateHandler = (date) => {
    var dateChanged = moment(date.dateString).format("DD-MM-YYYY");
    console.log("dates print", date, dateChanged);
    setStartDate(dateChanged);
    Alert.alert(
      `Confirmar Reservacion`,
      `Yo, ${userInfo.FirstName} ${userInfo.LastName} quisiera reservar a las ${reserveTime}, empezando ${dateChanged} con estas Metas: ${extraInfoDataGoals} y tambien ${extraInfoData}. Mi Numero de celular es ${extraInfoDataCelular}.`,
      [
        { text: "Cancelar", style: "destructive" },
        {
          text: "Correcto!",
          style: "default",
          onPress: () => {
            finalHandler(dateChanged);
          },
        },
      ]
    );
  };

  const finalHandler = async (dateChanged) => {
    setDateModal(false);
    Toast.show({
      type: "info",
      autoHide: false,
      text1: "Realizando Reservacion",
    });
    let Title = "Reservacion";
    setEvalDateModal(false);
    await sendReservation(
      Title,
      plan,
      reserveTime,
      dateChanged,
      extraInfoData,
      extraInfoDataCelular,
      extraInfoDataGoals,
      userInfo
    );
    triggerNotificationHandler(dateChanged);
    Toast.hide();
    setReserveTime("");
    setStartDate("");
    setExtraInfoData("");
    setExtraInfoDataCelular("");
    setExtraInfoGoals("");
    setPlan("");
    Alert.alert(
      "Reservacion Realizado!",
      "Alguien de nuesto equipo te contatara pronto."
    );
  };
  const triggerNotificationHandler = (dateChanged) => {
    const coaches = coachList.map((code) => code.expoPushToken);
    console.log("cheses", coaches);

    fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: coaches,
        sound: "default",
        data: { extraData: userInfo },
        title: `${userInfo.FirstName} ${userInfo.LastName} quisiera reservar!`,
        body: `${userInfo.FirstName} quisiera reservar a las ${reserveTime} en ${dateChanged}`,
      }),
    });
  };
  const suggestNotificationHandler = () => {
    const coaches = coachList.map((code) => code.expoPushToken);
    console.log("coaches", coaches);

    fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: coaches,
        sound: "default",
        // data: { extraData: userInfo },
        title: `ℹ️ Surgencia recibido de ${userInfo.FirstName} ${userInfo.LastName}!`,
        body: `${userInfo.FirstName} envió ${suggestions}`,
      }),
    });
  };

  const reserveHandler = (val) => {
    setPlan(val);

    Alert.alert(
      `Reservacion por plan ${val}`,
      "Por favor cuentanos su numero de contacto, metas, y si hay algunas notas extras.",
      [
        {
          text: "Cancelar",
          style: "destructive",
          onPress: () => {
            setPlan("");
          },
        },
        {
          text: "Vamos!",
          style: "default",
          onPress: () => {
            setExtraInfo(true);
          },
        },
      ]
    );
  };

  const sendReservationHandler = () => {
    Alert.alert(
      `Reservar Hora`,
      "Por favor elige la hora que quisiera venir.",
      [
        { text: "Cancelar", style: "destructive" },
        {
          text: "Listo!",
          style: "default",
          onPress: () => {
            setExtraInfo(false);
            setEvalDateModal(true);
          },
        },
      ]
    );
  };

  useFocusEffect(
    React.useCallback(() => {
      const fetchPromos = async () => {
        setImage(null);
        try {
          const list = [];
          await firebase
            .firestore()
            .collection("Promos")
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                const {
                  Caption,
                  Subtitle,
                  Usuario,
                  userImg,
                  Extension,
                  Points,
                  Type,
                  Description,
                } = doc.data();
                list.push({
                  key: doc.id,
                  Caption: Caption,
                  Subtitle: Subtitle,
                  Extension: Extension,
                  Points: Points,
                  Description: Description,
                  Usuario: Usuario,
                  Type: Type,
                  userImg: userImg,
                });
                sorted = list.sort((a, b) => (a.Points > b.Points ? 1 : -1));
              });
            });
          setPromoList(list.filter((data) => data.Type == "Promocion"));
          setPremio3erList(
            sorted
              .filter((data) => data.Type == "Premio3er")
              .sort((a, b) => (a.Points > b.Points ? 1 : -1))
          );
          setPremioNoExList(
            sorted
              .filter((data) => data.Type == "PremioNoEx")
              .sort((a, b) => (a.Points > b.Points ? 1 : -1))
          );
          setContactList(list.filter((data) => data.Type == "Contact"));
        } catch (e) {
          console.log(e);
        }
      };
      const fetchCoaches = async () => {
        try {
          const list = [];
          await firebase
            .firestore()
            .collection("Coaches")
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                const {
                  FirstName,
                  LastName,
                  userImg,
                  email,
                  Phone,
                  createdAt,
                  expoPushToken,
                  country,
                  userId,
                } = doc.data();
                list.push({
                  key: doc.id,
                  FirstName: FirstName,
                  LastName: LastName,
                  userImg: userImg,
                  email: email,
                  Phone: Phone,
                  country: country,
                  createdAt: createdAt,
                  expoPushToken,
                  userId: userId,
                });
              });
            });
          setCoachList(list);
        } catch (e) {
          console.log(e);
        }
      };
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
      fetchMemberDetails();
      fetchPromos();
      fetchCoaches();
    }, [])
  );

  const loadDetails = () => {
    fetchPromos();
  };
  const fetchPromos = async () => {
    setImage(null);
    try {
      const list = [];
      await firebase
        .firestore()
        .collection("Promos")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const {
              Caption,
              Subtitle,
              Usuario,
              userImg,
              Extension,
              Points,
              Type,
              Description,
            } = doc.data();
            list.push({
              key: doc.id,
              Caption: Caption,
              Subtitle: Subtitle,
              Extension: Extension,
              Points: Points,
              Description: Description,
              Usuario: Usuario,
              Type: Type,
              userImg: userImg,
            });
            sorted = list.sort((a, b) => (a.Points > b.Points ? 1 : -1));
          });
        });
      setPromoList(list.filter((data) => data.Type == "Promocion"));
      setPremio3erList(
        sorted
          .filter((data) => data.Type == "Premio3er")
          .sort((a, b) => (a.Points > b.Points ? 1 : -1))
      );
      setPremioNoExList(
        sorted
          .filter((data) => data.Type == "PremioNoEx")
          .sort((a, b) => (a.Points > b.Points ? 1 : -1))
      );
      setContactList(list.filter((data) => data.Type == "Contact"));
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        refreshControl={
          <RefreshControl
            colors={["#FF4949", "#FF4949"]}
            // refreshing={isRefreshing}
            onRefresh={loadDetails}
          />
        }
      >
        <Subtitle>{"Planes".toUpperCase()}</Subtitle>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ width: screenWidth / 1.5, alignItems: "center" }}>
            <PricingCard
              containerStyle={{
                width: screenWidth / 2,
                borderRadius: 15,
                margin: 15,
              }}
              color="#4f9deb"
              title="3 Dias Fitness"
              price="200bs"
              info={[
                " 3 dias por semana menusal",
                "lun-mie-vie",
                "mar-jue-sab",
                "Evaluacion Corporal",
                "Todo Personalizado",
              ]}
              button={{
                title: "RESERVAR",
                icon: "event-available",
                onPress: () => {
                  setPlan("3 Dias Fitness");
                  reserveHandler("3 Dias Fitness");
                },
              }}
            />
            <Tooltip
              height={300}
              width={300}
              popover={
                <Text style={styles.tooltipText}>
                  Plan Mensual 3 veces por semana Este plan es recomendado para
                  poder adaptar al cuerpo de una manera no invasiva, ideal para
                  personas con poco tiempo y también para personas tienen una
                  vida no muy activa. Costo Bs. 200.00 Incluye evaluación
                  corporal cada dos semanas.
                </Text>
              }
              backgroundColor={"#4f9deb"}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Icon name="info" color="silver" />
                <Text style={{ color: "silver" }}>Mas Informacion</Text>
              </View>
            </Tooltip>
          </View>
          <View style={{ flexDirection: "row" }}>
            <View style={{ width: screenWidth / 1.5, alignItems: "center" }}>
              <PricingCard
                containerStyle={{
                  width: screenWidth / 2,
                  borderRadius: 15,
                  margin: 15,
                }}
                color={Colors.noExprimary}
                title="6 Dias Fitness"
                price="270bs"
                info={[
                  " 6 dias por semana menusal",
                  "lunes a sabado",
                  "Evaluacion Corporal",
                  "Todo Personalizado",
                  " ",
                ]}
                button={{
                  title: "RESERVAR",
                  icon: "event-available",
                  onPress: () => {
                    setPlan("6 Dias Fitness");
                    reserveHandler("6 Dias Fitness");
                  },
                }}
              />
              <Tooltip
                height={300}
                width={300}
                popover={
                  <Text style={styles.tooltipText}>
                    Plan Mensual 6 veces por semana. Este plan es recomendado
                    para poder adaptar de manera rápida al cuerpo y mantener la
                    constancia. Costo Bs. 270.00 Incluye Evaluación Corporal
                    cada semana.
                  </Text>
                }
                backgroundColor={Colors.noExprimary}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Icon name="info" color="silver" />
                  <Text style={{ color: "silver" }}>Mas Informacion</Text>
                </View>
              </Tooltip>
            </View>
          </View>
          <View style={{ width: screenWidth / 1.5, alignItems: "center" }}>
            <PricingCard
              containerStyle={{
                width: screenWidth / 2,
                borderRadius: 15,
                margin: 15,
              }}
              color="#4f9deb"
              title="3 Dias Deportista"
              price="150bs"
              info={[
                " 3 dias por semana menusal",
                "lun-mie-vie",
                "mar-jue-sab",
                "Evaluacion Corporal",
                "Todo Personalizado",
              ]}
              button={{
                title: "RESERVAR",
                icon: "event-available",
                onPress: () => {
                  setPlan("3 Dias Deportista");
                  reserveHandler("3 Dias Deportista");
                },
              }}
            />
            <Tooltip
              height={300}
              width={300}
              popover={
                <Text style={styles.tooltipText}>
                  El entrenamiento de los deportistas va adecuado a la mejora de
                  las habilidades deportivas individuales conjunto con el
                  entrenamiento funcional, 2 a 3 días técnico y preparacion
                  fisica depende del plan elegido, 3 veces por semana o 6 veces
                  por semana
                </Text>
              }
              backgroundColor={"#4f9deb"}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Icon name="info" color="silver" />
                <Text style={{ color: "silver" }}>Mas Informacion</Text>
              </View>
            </Tooltip>
          </View>
          <View style={{ flexDirection: "row" }}>
            <View style={{ width: screenWidth / 1.5, alignItems: "center" }}>
              <PricingCard
                containerStyle={{
                  width: screenWidth / 2,
                  borderRadius: 15,
                  margin: 15,
                }}
                color={Colors.noExprimary}
                title="6 Dias Deportista"
                price="220bs"
                info={[
                  "6 dias por semana menusal",
                  "lunes a sabado",
                  "Evaluacion Corporal",
                  "Todo Personalizado",
                  " ",
                ]}
                button={{
                  title: "RESERVAR",
                  icon: "event-available",
                  onPress: () => {
                    setPlan("6 Dias Deportista");
                    reserveHandler("6 Dias Deportista");
                  },
                }}
              />
              <Tooltip
                height={300}
                width={300}
                popover={
                  <Text style={styles.tooltipText}>
                    El entrenamiento de los deportistas va adecuado a la mejora
                    de las habilidades deportivas individuales conjunto con el
                    entrenamiento funcional, 2 a 3 días técnico y preparacion
                    fisica depende del plan elegido, 3 veces por semana o 6
                    veces por semana
                  </Text>
                }
                backgroundColor={Colors.noExprimary}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Icon name="info" color="silver" />
                  <Text style={{ color: "silver" }}>Mas Informacion</Text>
                </View>
              </Tooltip>
            </View>
          </View>

          {/* <View style={{ flexDirection: "row" }}> */}
          <View style={{ width: screenWidth / 1.5, alignItems: "center" }}>
            <PricingCard
              containerStyle={{
                width: screenWidth / 2,
                borderRadius: 15,
                margin: 15,
              }}
              color="#4f9deb"
              title="3 Dias Niños"
              price="200bs"
              info={[
                "3 dias por semana menusal",
                "lun-mie-vie",
                "mar-jue-sab",
                "Evaluacion Corporal",
                "Todo Personalizado",
              ]}
              button={{
                title: "RESERVAR",
                icon: "event-available",
                onPress: () => {
                  setPlan("3 Dias Niños");
                  reserveHandler("3 Dias Niños");
                },
              }}
            />
            <Tooltip
              height={300}
              width={300}
              popover={
                <Text style={styles.tooltipText}>
                  El entrenamiento funcional para niños está enfocado en el
                  aprendizaje a conocer los movimientos de cuerpo, dependiendo
                  las diferentes dificultados como en coordinación, equilibrio,
                  flexibilidad, resistencia Costo mensual, 3 veces por semana,
                  Bs.150
                </Text>
              }
              backgroundColor={"#4f9deb"}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Icon name="info" color="silver" />
                <Text style={{ color: "silver" }}>Mas Informacion</Text>
              </View>
            </Tooltip>
          </View>
          <View style={{ flexDirection: "row" }}>
            <View style={{ width: screenWidth / 1.5, alignItems: "center" }}>
              <PricingCard
                containerStyle={{
                  width: screenWidth / 2,
                  borderRadius: 15,
                  margin: 15,
                }}
                color={Colors.noExprimary}
                title="6 Dias Niños"
                price="270bs"
                info={[
                  " 6 dias por semana menusal",
                  "lunes a sabado",
                  "Evaluacion Corporal",
                  "Todo Personalizado",
                  " ",
                ]}
                button={{
                  title: "RESERVAR",
                  icon: "event-available",
                  onPress: () => {
                    setPlan("6 Dias Niños");
                    reserveHandler("6 Dias Niños");
                  },
                }}
              />
              <Tooltip
                height={300}
                width={300}
                popover={
                  <Text style={styles.tooltipText}>
                    El entrenamiento funcional para niños está enfocado en el
                    aprendizaje a conocer los movimientos de cuerpo, dependiendo
                    las diferentes dificultados como en coordinación,
                    equilibrio, flexibilidad, resistencia Costo mensual, 6 veces
                    por semana, Bs.200
                  </Text>
                }
                backgroundColor={Colors.noExprimary}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Icon name="info" color="silver" />
                  <Text style={{ color: "silver" }}>Mas Informacion</Text>
                </View>
              </Tooltip>
            </View>
          </View>
        </ScrollView>
        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={extraInfo}
            onRequestClose={() => {
              setExtraInfo(false);
            }}
          >
            <TouchableWithoutFeedback
              onPress={() => {
                Keyboard.dismiss();
              }}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <View style={styles.action}>
                    <Input
                      label="Celular"
                      leftIcon={{ type: "font-awesome", name: "phone" }}
                      placeholder={"Celular"}
                      placeholderTextColor="#666666"
                      style={styles.textInput}
                      value={extraInfoDataCelular}
                      onChangeText={(text) => setExtraInfoDataCelular(text)}
                      autoCorrect={false}
                      keyboardType="phone-pad"
                    />
                  </View>
                  <View style={styles.action}>
                    <Input
                      label="Metas"
                      leftIcon={{ type: "font-awesome", name: "check" }}
                      placeholder="Metas"
                      placeholderTextColor="#666666"
                      style={styles.textInput}
                      value={extraInfoDataGoals}
                      onChangeText={(text) => setExtraInfoGoals(text)}
                      autoCorrect={false}
                    />
                  </View>
                  <View style={styles.action}>
                    <Input
                      label="Notas addicionales"
                      leftIcon={{ type: "font-awesome", name: "check" }}
                      placeholder="Historia Clinica"
                      placeholderTextColor="#666666"
                      style={styles.textInput}
                      value={extraInfoData}
                      onChangeText={(text) => setExtraInfoData(text)}
                      autoCorrect={false}
                    />
                  </View>

                  {/* <TouchableOpacity
                    style={styles.commandButton}
                    onPress={() => {
                      setExtraInfo(false);
                      setEvalDateModal(true);
                    }}
                  >
                    <Text style={styles.panelButtonTitle}>Elegir Horario</Text>
                  </TouchableOpacity> */}
                  <TouchableOpacity
                    style={styles.commandButton}
                    onPress={() => {
                      sendReservationHandler();
                    }}
                  >
                    <Text style={styles.panelButtonTitle}>Reservar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.commandButton}
                    onPress={() => {
                      setExtraInfo(false);
                      setExtraInfoData("");
                      setExtraInfoGoals("");
                      setExtraInfoDataCelular("");
                    }}
                  >
                    <Text style={styles.panelButtonTitle}>Cancelar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </View>

        {evalDateModal && (
          <View>
            <DateTimePicker
              mode="time"
              display="spinner"
              isVisible={evalDateModal}
              onConfirm={
                (date) => {
                  dateHandler(date);
                }
                // this.handleDatePicked(date, "start", "showStart")
              }
              onCancel={() => {
                setReserveTime("");
                setStartDate("");
                setExtraInfoData("");
                setExtraInfoDataCelular("");
                setExtraInfoGoals("");
                setPlan("");
                setEvalDateModal(false);
              }}
              cancelTextIOS={"Cancelar"}
              confirmTextIOS={"Confirmar Horario"}
              headerTextIOS={"Elige un Horario"}
            />
          </View>
        )}
        {DateModal && (
          <View style={{ height: 350 }}>
            {/* <DateTimePicker
              mode="date"
              isVisible={DateModal}
              locale="es-ES"
              onConfirm={
                (date) => {
                  startDateHandler(date);
                }
                // this.handleDatePicked(date, "start", "showStart")
              }
              onCancel={() => {
                setReserveTime("");
                setStartDate("");
                setExtraInfoData("");
                setExtraInfoDataCelular("");
                setExtraInfoGoals("");
                setPlan("");
                setDateModal(false);
              }}
              cancelTextIOS={"Cancelar"}
              confirmTextIOS={"Confirmar"}
              headerTextIOS={"Elige una fecha"}
            /> */}
            <CalendarList
              onVisibleMonthsChange={(months) => {}}
              pastScrollRange={50}
              futureScrollRange={50}
              scrollEnabled={true}
              showScrollIndicator={true}
              onDayPress={(day) => {
                startDateHandler(day);
              }}
              style={styles.calendar}
              hideExtraDays
              theme={{
                selectedDayBackgroundColor: Colors.noExprimary,
                todayTextColor: Colors.noExprimary,
                arrowColor: Colors.noExprimary,
              }}
            />
          </View>
        )}
        <Subtitle>{"Promociones".toUpperCase()}</Subtitle>
        <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={promolist}
          renderItem={(itemData) => (
            <PromoItem
              image={itemData.item.userImg}
              title={itemData.item.Title}
              logo={itemData.item.logo}
              caption={itemData.item.Caption}
              subtitle={itemData.item.Subtitle}
              onClassClick={() => {
                navigation.navigate("PromoDetail", {
                  promoData: itemData.item,
                });
              }}
            />
          )}
        />
        <Subtitle>{"Premios".toUpperCase()}</Subtitle>
        <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={premio3erlist}
          renderItem={(itemData) => (
            <PromoItem
              image={itemData.item.userImg}
              title={itemData.item.Title}
              logo={itemData.item.logo}
              caption={itemData.item.Caption}
              subtitle={itemData.item.Subtitle}
              onClassClick={() => {
                navigation.navigate("PromoDetail", {
                  promoData: itemData.item,
                  points: userInfo.points,
                  coaches: coachList,
                  userToken: userInfo.expoPushToken,
                  userInfo: userInfo,
                });
              }}
            />
          )}
        />
        <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={premioNoExlist}
          renderItem={(itemData) => (
            <PromoItem
              image={itemData.item.userImg}
              title={itemData.item.Title}
              logo={itemData.item.logo}
              caption={itemData.item.Caption}
              subtitle={itemData.item.Subtitle}
              points={userInfo.Points}
              onClassClick={() => {
                navigation.navigate("PromoDetail", {
                  promoData: itemData.item,
                  points: userInfo.points,
                  coaches: coachList,
                  userToken: userInfo.expoPushToken,
                  userInfo: userInfo,
                });
              }}
            />
          )}
        />

        <Subtitle>{"Coaches".toUpperCase()}</Subtitle>
        <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={coachList}
          renderItem={(itemData) => (
            <PromoItem
              image={itemData.item.userImg}
              //   title={itemData.item.Title}
              logo={itemData.item.logo}
              caption={itemData.item.FirstName}
              subtitle={itemData.item.country}
              // onClassClick={() => {
              //   navigation.navigate("PromoDetail", {
              //     promoData: itemData.item,
              //   });
              // }}
            />
          )}
        />
        <Subtitle>{"Contacto".toUpperCase()}</Subtitle>
        <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={contactlist}
          renderItem={(itemData) => (
            <PromoItem
              image={itemData.item.userImg}
              title={itemData.item.Title}
              logo={itemData.item.logo}
              extension={itemData.item.Extension}
              caption={itemData.item.Caption}
              subtitle={itemData.item.Subtitle}
              onClassClick={() => {
                navigation.navigate("PromoDetail", {
                  promoData: itemData.item,
                });
              }}
            />
          )}
        />
        <Subtitle>{"sugerencias".toUpperCase()}</Subtitle>
        <View style={styles.action}>
          <Input
            label="Que quisiera decir?"
            leftIcon={{ type: "font-awesome", name: "sticky-note-o" }}
            placeholder={"Sugerencias, canciones, etc"}
            placeholderTextColor="#666666"
            style={styles.textInput}
            value={suggestions}
            onChangeText={(text) => setSuggestions(text)}
            autoCorrect={false}
            returnKeyType="done"
          />
        </View>
        <TouchableOpacity
          style={styles.commandButton}
          onPress={suggestionHandler}
        >
          <Text style={styles.panelButtonTitle}>Enviar Sugerencias</Text>
        </TouchableOpacity>
      </ScrollView>
      <Toast position="bottom" bottomOffset={20} />
    </View>
  );
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
  screen: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
  },
  textInput: {
    flex: 1,
    // marginTop: Platform.OS === "ios" ? 0 : -12,
    paddingLeft: 10,
    color: "#05375a",
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
    marginHorizontal: 10,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "white",
  },
  commandButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: Colors.noExprimary,
    alignItems: "center",
    marginTop: 5,
    marginHorizontal: 10,
    marginBottom: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    width: "95%",
    margin: 20,
    backgroundColor: "white",
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
  tooltipText: {
    fontSize: 18,
    fontWeight: "500",
  },
});

export default InformationScreen;
