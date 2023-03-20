import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "../constants/Colors";
// import Input from "../components/UI/Input";
// import Card from "../components/UI/Card";
import validator from "validator";
// import { Input } from "react-native-elements";
import * as Animatable from "react-native-animatable";

// import FormInput from "../components/FormInput";
// import FormButton from "../components/FormButton";
// import SocialButton from "../components/SocialButton";
import { AuthContext } from "../navigation/AuthProvider";
// import * as Google from "expo-google-app-auth";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";

const LoginScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [check_textInputChange, setCheck_textInputChange] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [isValidUser, setIsValidUser] = useState(true);
  const [isValidPassword, setIsValidPassword] = useState(true);

  const { login, signInWithGoogle, signInWithFacebook } =
    useContext(AuthContext);

  const textInputChange = (val) => {
    if (validator.isEmail(val)) {
      setEmail(val);
      setCheck_textInputChange(true);
      setIsValidUser(true);
    } else {
      setEmail(val);
      setCheck_textInputChange(false);
      setIsValidUser(false);
    }
  };

  const handlePasswordChange = (val) => {
    if (val.trim().length >= 8) {
      setPassword(val);
      setIsValidPassword(true);
    } else {
      setPassword(val);
      setIsValidPassword(false);
    }
  };

  const updateSecureTextEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };
  const loginHandler = async () => {
    if (isValidUser === false || isValidPassword === false) {
      Alert.alert("Incompleto!", "Por favor revise los datos");
    } else {
      setIsLoading(true);

      await login(email, password);

      setIsLoading(false);
    }
  };
  const googleLoginHandler = async () => {
    await signInWithGoogle();
  };
  const facebookLoginHandler = async () => {
    await signInWithFacebook();
  };

  const handleValidUser = (val) => {
    if (validator.isEmail(val)) {
      setIsValidUser(true);
    } else {
      setIsValidUser(false);
    }
  };

  if (isLoading) {
    return (
      <LinearGradient
        colors={["#ffffff", Colors.noExprimary]}
        style={styles.gradient}
      >
        <View style={styles.activityContainer}>
          <ActivityIndicator size="small" />
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[Colors.noExprimary, "#ffffff"]}
      style={styles.gradient}
    >
      <View style={styles.container}>
        <StatusBar
          backgroundColor={Colors.noExprimary}
          barStyle="light-content"
        />
        <View style={styles.header}>
          <Text style={styles.text_header}>Bienvenido!</Text>
        </View>
        <Animatable.View animation="fadeInUpBig" style={styles.footer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.text_footer}>Correo</Text>
            <View style={styles.action}>
              <FontAwesome name="user-o" color={"#05375a"} size={20} />
              <TextInput
                placeholder="Tu correo electronico"
                placeholderTextColor="#666666"
                style={styles.textInput}
                value={email}
                onChangeText={(val) => textInputChange(val)}
                autoCorrect={false}
                autoCapitalize="none"
                keyboardType="email-address"
                onEndEditing={(e) => handleValidUser(e.nativeEvent.text)}
              />
              {check_textInputChange ? (
                <Animatable.View animation="bounceIn">
                  <Feather name="check-circle" color="green" size={20} />
                </Animatable.View>
              ) : null}
            </View>
            {isValidUser ? null : (
              <Animatable.View animation="fadeInLeft" duration={500}>
                <Text style={styles.errorMsg}>
                  Por Favor usar un correo electronico valido
                </Text>
              </Animatable.View>
            )}
            <Text style={[styles.text_footer, { marginTop: 35 }]}>
              Contraseña
            </Text>
            <View style={styles.action}>
              <Feather name="lock" color={"#05375a"} size={20} />
              <TextInput
                placeholder="Tu contraseña"
                placeholderTextColor="#666666"
                style={styles.textInput}
                value={password}
                onChangeText={(val) => handlePasswordChange(val)}
                autoCorrect={false}
                secureTextEntry={secureTextEntry ? true : false}
              />
              <TouchableOpacity onPress={updateSecureTextEntry}>
                {secureTextEntry ? (
                  <Feather name="eye-off" color="grey" size={20} />
                ) : (
                  <Feather name="eye" color="grey" size={20} />
                )}
              </TouchableOpacity>
            </View>
            {isValidPassword ? null : (
              <Animatable.View animation="fadeInLeft" duration={500}>
                <Text style={styles.errorMsg}>
                  La contranseña debe ser minimo 8 caracteres
                </Text>
              </Animatable.View>
            )}

            <View style={styles.button}>
              <TouchableOpacity
                onPress={() => loginHandler()}
                style={[
                  styles.signIn,
                  {
                    backgroundColor: Colors.noExprimary,
                  },
                ]}
              >
                <Text style={[styles.textSign, { color: "white" }]}>
                  Iniciar Sesion
                </Text>
                {/* <MaterialIcons name="navigate-next" color="#fff" size={20} /> */}
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate("Signup")}
              style={[
                styles.signIn,
                {
                  borderColor: Colors.noExprimary,
                  borderWidth: 1,
                  marginTop: 15,
                },
              ]}
            >
              <Text style={[styles.textSign, { color: Colors.noExprimary }]}>
                No tienes una Cuenta?
              </Text>
              {/* <MaterialIcons name="navigate-next" color="#fff" size={20} /> */}
            </TouchableOpacity>

            <View>
              {/* <SocialButton
                buttonTitle="Gmail"
                btnType="google"
                color="#de4d41"
                backgroundColor="white"
                onPress={() => {
                  googleLoginHandler();
                }}
              />

              <SocialButton
                buttonTitle="Facebook"
                btnType="facebook"
                color="blue"
                backgroundColor="white"
                onPress={() => {
                  facebookLoginHandler();
                }}
              /> */}
            </View>
            <TouchableOpacity
              style={styles.forgotButton}
              onPress={() => navigation.navigate("Forgot")}
            >
              <Text style={styles.navButtonText}>Olvidé mi contranseña</Text>
            </TouchableOpacity>
          </ScrollView>
        </Animatable.View>
      </View>
    </LinearGradient>
    // <LinearGradient
    //   colors={["#ffffff", Colors.noExprimary]}
    //   style={styles.gradient}
    // >
    //   <ScrollView contentContainerStyle={styles.container}>
    //     {isLoading ? (
    //       <ActivityIndicator size="small" />
    //     ) : (
    //       <Image
    //         source={require("../assets/icon-noexlogo.png")}
    //         style={styles.logo}
    //       />
    //     )}
    //     <Text style={styles.text}>Bienvenido</Text>
    //     {/* <Text style={styles.text}>Prioriza</Text> */}

    //     <FormInput
    //       labelValue={email}
    //       onChangeText={(userEmail) => setEmail(userEmail)}
    //       placeholderText="Correo"
    //       iconType="user"
    //       keyboardType="email-address"
    //       autoCapitalize="none"
    //       autoCorrect={false}
    //     />

    //     <FormInput
    //       labelValue={password}
    //       onChangeText={(userPassword) => setPassword(userPassword)}
    //       placeholderText="Contraseña"
    //       iconType="lock"
    //       secureTextEntry={true}
    //     />
    //     <View style={{ width: "100%" }}>
    //       <FormButton
    //         buttonTitle="Iniciar Sesión"
    //         onPress={() => loginHandler()}
    //       />
    //     </View>

    //     <TouchableOpacity
    //       style={styles.forgotButton}
    //       onPress={() => props.navigation.navigate("Forgot")}
    //     >
    //       <Text style={styles.navButtonText}>Olvidé mi contranseña</Text>
    //     </TouchableOpacity>

    //     <View>
    //       <SocialButton
    //         buttonTitle="Gmail"
    //         btnType="google"
    //         color="#de4d41"
    //         backgroundColor="#f5e7ea"
    //         onPress={() => {
    //           googleLoginHandler();
    //         }}
    //       />

    //       <SocialButton
    //         buttonTitle="Facebook"
    //         btnType="facebook"
    //         color="blue"
    //         backgroundColor="#f5e7ea"
    //         onPress={() => {
    //           facebookLoginHandler();
    //         }}
    //       />
    //     </View>

    //     <TouchableOpacity
    //       style={styles.forgotButton}
    //       onPress={() => props.navigation.navigate("Signup")}
    //     >
    //       <Text style={styles.navButtonText}>
    //         No tienes una cuenta? Crear aqui
    //       </Text>
    //     </TouchableOpacity>
    //   </ScrollView>
    // </LinearGradient>
  );
};

// import { useDispatch } from "react-redux";

// export const AUTHENTICATE = "AUTHENTICATE";

// import firebase from "../components/firebase";

// import * as authActions from "../store/actions/auth";

// const LoginScreen = (props) => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState();
//   const [isSignup, setIsSignUp] = useState(false);
//   const dispatch = useDispatch();

// const authenticate = (userId, token) => {
//   return (dispatch) => {
//     // dispatch(setLogoutTimer(expiryTime));
//     dispatch({ type: AUTHENTICATE, userId: userId, token: token });
//   };
// };

// const onLoginSuccess = () => {
//   firebase.auth().onAuthStateChanged(function (user) {
//     if (user) {
//       // console.log("this is authstatechange user  ", user);
//       const userRes = user.toJSON().stsTokenManager;
//       var token = userRes.accessToken.toString();
//       var userId = user.uid.toString();
//       // console.log("this is tkn", token);
//       console.log("this is id", userId);

//       dispatch(authenticate(userId, token));
//     }
//   });
//   props.navigation.navigate("Home");
// };

// const onLoginFailure = (errorMessage) => {
//   setErrorMessage(errorMessage), setIsLoading(false);
// };

// const signInWithEmail = async () => {
//   await firebase
//     .auth()
//     .signInWithEmailAndPassword(email, password)
//     .then(onLoginSuccess.bind(this))
//     .catch((error) => {
//       let errorCode = error.code;
//       let errorMessage = error.message;
//       if (errorCode == "auth/weak-password") {
//         onLoginFailure.bind(this)("Contraseña Debil!");
//       } else {
//         onLoginFailure.bind(this)(errorMessage);
//       }
//     });
// };

// const saveDataToStorage = (avatar, givenName, token, userId) => {
//   AsyncStorage.setItem(
//     "userData",
//     JSON.stringify({
//       avatar: avatar,
//       token: token,
//       userId: userId,
//       givenName: givenName,
//     })
//   );
// };

// if (isLoading) {
//   return (
//     <View style={styles.centered}>
//       <ActivityIndicator size="large" color={Colors.noExprimary} />
//       <Text>Cargando detalles del usuario</Text>
//     </View>
//   );
// }

// return (
//   <TouchableWithoutFeedback
//     onPress={() => {
//       Keyboard.dismiss();
//     }}
//   >
//     <View style={{ flex: 1 }}>
//       <KeyboardAvoidingView style={styles.container} behavior="padding">
//         <Text
//           style={{
//             fontSize: 32,
//             fontWeight: "700",
//             color: "gray",
//             marginTop: 20,
//           }}
//         >
//           Bienvenido
//         </Text>
//         <View style={styles.form}>
//           <TextInput
//             style={styles.input}
//             placeholder="Correo"
//             placeholderTextColor="#B1B1B1"
//             returnKeyType="next"
//             keyboardType="email-address"
//             textContentType="emailAddress"
//             value={email}
//             onChangeText={(email) => setEmail(email)}
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="Contraseña"
//             placeholderTextColor="#B1B1B1"
//             returnKeyType="done"
//             textContentType="newPassword"
//             secureTextEntry={true}
//             value={password}
//             onChangeText={(password) => setPassword(password)}
//           />
//         </View>
//         <Text
//           style={{
//             fontSize: 18,
//             textAlign: "center",
//             color: "red",
//             width: "80%",
//           }}
//         >
//           {errorMessage}
//         </Text>
//         <TouchableOpacity
//           style={{ width: "86%", marginTop: 10 }}
//           onPress={() => signInWithEmail()}
//         >
//           <Text>Iniciar Sesión</Text>
//         </TouchableOpacity>
{
  /* <TouchableOpacity 
            style={{ width: "86%", marginTop: 10 }}
            onPress={() => this.signInWithFacebook()}>
            <View style={styles.button}>
              <Text
                style={{
                  letterSpacing: 0.5,
                  fontSize: 16,
                  color: "#FFFFFF"
                }}
              >
                Continue with Facebook
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity 
            style={{ width: "86%", marginTop: 10 }}
            onPress={() => this.signInWithGoogle()}>
            <View style={styles.googleButton}>
              <Text
                style={{
                  letterSpacing: 0.5,
                  fontSize: 16,
                  color: "#707070"
                }}
              >
                Continue with Google
              </Text>
            </View>
          </TouchableOpacity> */
}
//           <View style={{ marginTop: 10 }}>
//             <TouchableOpacity
//               onPress={() => {
//                 props.navigation.navigate("Signup");
//               }}
//             >
//               <Text
//                 style={{ fontWeight: "200", fontSize: 17, textAlign: "center" }}
//               >
//                 No Tienes cuenta?
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </KeyboardAvoidingView>
//       </View>
//     </TouchableWithoutFeedback>
//   );
// };

// LoginScreen.navigationOptions = {
//   title: "Bienvenido",
//   headerShown: false,
// };

export default LoginScreen;
const { height } = Dimensions.get("screen");
const height_logo = height * 0.28;

const styles = StyleSheet.create({
  // gradient: {
  // flex: 1,
  // justifyContent: "center",
  // alignItems: "center",
  // },
  logo: {
    height: 200,
    width: 200,
    resizeMode: "contain",
    marginBottom: 20,
  },
  text: {
    fontFamily: "Kufam-SemiBoldItalic",
    fontSize: 28,
    marginBottom: 10,
    color: "#051d5f",
  },
  navButton: {
    marginTop: 15,
  },
  forgotButton: {
    marginVertical: 15,
    alignSelf: "center",
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#2e64e5",
    fontFamily: "Lato-Regular",
  },

  ////////
  gradient: {
    flex: 1,
  },
  activityContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",

    // backgroundColor: "#009387",
  },
  container: {
    flex: 1,
    // backgroundColor: "#009387",
  },
  header: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  footer: {
    flex: 4,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_header: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 30,
  },
  text_footer: {
    color: "#05375a",
    fontSize: 18,
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
    alignItems: "center",
  },
  actionError: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#FF0000",
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 0 : -12,
    paddingLeft: 10,
    color: "#05375a",
  },
  errorMsg: {
    color: "#FF0000",
    fontSize: 14,
  },
  button: {
    alignItems: "center",
    marginTop: 50,
  },
  signIn: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  textSign: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
