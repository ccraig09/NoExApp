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
import validator from "validator";

import { AuthContext } from "../navigation/AuthProvider";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";

const SignupScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);

  const [fName, setFName] = useState();
  const [lName, setLName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [check_textInputChange, setCheck_textInputChange] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [isValidUser, setIsValidUser] = useState(true);
  const [isValidPassword, setIsValidPassword] = useState(true);
  const [isValidName, setIsValidName] = useState(true);
  const [isValidConfirmPassword, setIsValidConfirmPassword] = useState(true);
  const [confirmSecureTextEntry, setConfirmSecureTextEntry] = useState(true);

  const { register, signUpWithGoogle, signUpWithFacebook } =
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

  const handleNameChange = (val) => {
    if (val.trim().length >= 2) {
      setFName(val);
      setIsValidName(true);
    } else {
      setFName(val);
      setIsValidName(false);
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
  const handleConfirmPasswordChange = (val) => {
    if (password === val) {
      setConfirmPassword(val);
      setIsValidConfirmPassword(true);
    } else {
      setConfirmPassword(val);
      setIsValidConfirmPassword(false);
    }
  };

  const updateSecureTextEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const updateConfirmSecureTextEntry = () => {
    setConfirmSecureTextEntry(!confirmSecureTextEntry);
  };
  const signUpHandler = async () => {
    if (
      isValidUser === false ||
      isValidName === false ||
      isValidPassword === false ||
      isValidConfirmPassword === false
    ) {
      Alert.alert("Incompleto!", "Por favor revise los datos");
    } else {
      setIsLoading(true);

      await register(fName, lName, email, password);

      setIsLoading(false);
    }
  };
  const googleLoginHandler = async () => {
    await signUpWithGoogle();
  };
  const facebookLoginHandler = async () => {
    await signUpWithFacebook();
  };

  const handleValidUser = (val) => {
    if (validator.isEmail(val)) {
      setIsValidUser(true);
    } else {
      setIsValidUser(false);
    }
  };
  const handleValidName = (val) => {
    if (val.trim().length >= 2) {
      setIsValidName(true);
    } else {
      setIsValidName(false);
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
          <Text style={styles.text_header}>Crear Una Cuenta!</Text>
        </View>
        <View style={styles.footer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.text_footer}>Nombre</Text>
            <View style={styles.action}>
              <FontAwesome name="user-o" color={"#05375a"} size={20} />
              <TextInput
                placeholder="Tu nombre"
                placeholderTextColor="#666666"
                style={styles.textInput}
                value={fName}
                onChangeText={(val) => handleNameChange(val)}
                autoCorrect={false}
                autoCapitalize="words"
                onEndEditing={(e) => handleValidName(e.nativeEvent.text)}
              />
            </View>
            {isValidName ? null : (
              <View duration={500}>
                <Text style={styles.errorMsg}>
                  Por Favor usar un nombre valido
                </Text>
              </View>
            )}
            <Text style={[styles.text_footer, { marginTop: 25 }]}>
              Apellido
            </Text>
            <View style={styles.action}>
              <FontAwesome name="user-o" color={"#05375a"} size={20} />
              <TextInput
                placeholder="Tu Apellido"
                placeholderTextColor="#666666"
                style={styles.textInput}
                value={lName}
                onChangeText={(val) => setLName(val)}
                autoCorrect={false}
                autoCapitalize="words"
              />
            </View>
            <Text style={[styles.text_footer, { marginTop: 25 }]}>Correo</Text>
            <View style={styles.action}>
              <FontAwesome name="envelope-o" color={"#05375a"} size={20} />
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
                <View>
                  <Feather name="check-circle" color="green" size={20} />
                </View>
              ) : null}
            </View>
            {isValidUser ? null : (
              <View duration={500}>
                <Text style={styles.errorMsg}>
                  Por Favor usar un correo electronico valido
                </Text>
              </View>
            )}
            <Text style={[styles.text_footer, { marginTop: 25 }]}>
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
              <View duration={500}>
                <Text style={styles.errorMsg}>
                  La contranseña debe ser minimo 8 caracteres
                </Text>
              </View>
            )}
            <Text style={[styles.text_footer, { marginTop: 25 }]}>
              Confirmar Contraseña
            </Text>
            <View style={styles.action}>
              <Feather name="lock" color={"#05375a"} size={20} />
              <TextInput
                placeholder="Tu contraseña"
                placeholderTextColor="#666666"
                style={styles.textInput}
                value={confirmPassword}
                onChangeText={(val) => handleConfirmPasswordChange(val)}
                autoCorrect={false}
                secureTextEntry={confirmSecureTextEntry ? true : false}
              />
              <TouchableOpacity onPress={updateConfirmSecureTextEntry}>
                {confirmSecureTextEntry ? (
                  <Feather name="eye-off" color="grey" size={20} />
                ) : (
                  <Feather name="eye" color="grey" size={20} />
                )}
              </TouchableOpacity>
            </View>
            {isValidConfirmPassword ? null : (
              <View duration={500}>
                <Text style={styles.errorMsg}>
                  Las contranseñas no coinciden
                </Text>
              </View>
            )}

            <View style={styles.button}>
              <TouchableOpacity
                onPress={() => signUpHandler()}
                style={[
                  styles.signIn,
                  {
                    backgroundColor: Colors.noExprimary,
                  },
                ]}
              >
                <Text style={[styles.textSign, { color: "white" }]}>
                  Crear Cuenta
                </Text>
                {/* <MaterialIcons name="navigate-next" color="#fff" size={20} /> */}
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate("Login")}
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
                Ya tienes una Cuenta?
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
          </ScrollView>
        </View>
      </View>
    </LinearGradient>
  );
};

export default SignupScreen;
const { height } = Dimensions.get("screen");
const height_logo = height * 0.28;

const styles = StyleSheet.create({
  logo: {
    height: 200,
    width: 200,
    resizeMode: "contain",
    marginBottom: 20,
  },
  text: {
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
  },

  ////////
  gradient: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
  },
  container: {
    flex: 1,
    // backgroundColor: "#009387",
  },
  activityContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",

    // backgroundColor: "#009387",
  },
  header: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  footer: {
    flex: 6,
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
