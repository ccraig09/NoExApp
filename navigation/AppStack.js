import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import HomeScreen from "../screens/HomeScreen";
import SectionScreen from "../screens/SectionScreen";
import ProfileScreen from "../screens/ProfileScreen";
import PromoDetailScreen from "../screens/PromoDetailScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
import SettingsScreen from "../screens/SettingsScreen";
import EditEvalScreen from "../screens/EditEvalScreen";
import EvalScreen from "../screens/EvalScreen";
import InformationScreen from "../screens/InformationScreen";
import Colors from "../constants/Colors";
import QrScreen from "../screens/QrScreen";
import OnboardingScreen from "../screens/OnboardingScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DetailsScreen from "../screens/DetailsScreen";
import VideoScreen from "../screens/VideoScreen";
import ReviewScreen from "../screens/ReviewScreen";
import NotificationScreen from "../screens/NotificationScreen";
import AwardsScreen from "../screens/AwardsScreen";
import MyTraining from "../screens/MyTraining";
import WebViewScreen from "../screens/WebView";

const { Navigator, Screen } = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
// const Drawer = createDrawerNavigator();

let routeName;
const AppStack = () => {
  // const [isFirstLaunch, setIsFirstLaunch] = useState(null);

  // useEffect(() => {
  //   AsyncStorage.getItem("alreadyLaunched").then((value) => {
  //     if (value == null) {
  //       AsyncStorage.setItem("alreadyLaunched", "true"); // No need to wait for `setItem` to finish, although you might want to handle errors
  //       setIsFirstLaunch(true);
  //     } else {
  //       setIsFirstLaunch(false);
  //     }
  //   }); // Add some error handling, also you can simply do setIsFirstLaunch(null)
  // }, []);

  // if (isFirstLaunch === null) {
  //   return null; // This is the 'tricky' part: The query to AsyncStorage is not finished, but we have to present something to the user. Null will just render nothing, so you can also put a placeholder of some sort, but effectively the interval between the first mount and AsyncStorage retrieving your data won't be noticeable to the user. But if you want to display anything then you can use a LOADER here
  // } else if (isFirstLaunch == true) {
  //   routeName = "Onboarding";
  // } else {
  //   routeName = "Home";
  // }
  return (
    <Tab.Navigator
      initialRouteName="ProfileTab"
      screenOptions={{
        tabBarActiveTintColor: Colors.noExprimary,
        tabBarStyle: [
          {
            display: "flex",
          },
          null,
        ],
      }}
      style={{ backgroundColor: "blue" }}
    >
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStackScreen}
        options={{
          headerShown: false,
          tabBarLabel: "Perfil",
          tabBarIcon: ({ color }) => (
            <Icon name="person" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Main"
        component={HomeStack}
        options={{
          headerShown: false,
          tabBarLabel: "Videos",
          tabBarIcon: ({ color }) => (
            <Icon name="videocam" color={color} size={30} />
          ),
        }}
      />
      <Tab.Screen
        name="InformationTab"
        component={InformationStack}
        options={{
          headerShown: false,
          tabBarLabel: "Informacion",
          tabBarIcon: ({ color }) => (
            <Icon name="information-circle" color={color} size={26} />
          ),
        }}
      />
      {/* <Tab.Screen
        name="Logros"
        component={AwardsStack}
        options={{
          tabBarLabel: "Logros",
          tabBarIcon: ({ color }) => (
            <Icon name="trophy" color={color} size={26} />
          ),
        }}
      /> */}
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerShown: false,
          tabBarLabel: "Configuraciones",
          tabBarIcon: ({ color }) => (
            <Icon name="settings" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const HomeStack = () => (
  <Navigator initialRouteName="Home">
    <Screen
      name="Home"
      component={HomeScreen}
      options={{
        title: "Videos",
      }}
    />
    <Screen
      name="Onboarding"
      component={OnboardingScreen}
      options={{
        title: "Niveles",
      }}
    />
    <Screen
      name="Section"
      component={SectionScreen}
      options={{
        title: "Niveles",
      }}
    />
    <Screen
      name="Details"
      component={DetailsScreen}
      options={{
        title: "Niveles",
      }}
    />
    <Screen
      name="Video"
      component={VideoScreen}
      options={{
        title: "Niveles",
      }}
    />
    <Screen
      name="Review"
      component={ReviewScreen}
      options={{
        headerShown: false,
        // title: "Niveles",
      }}
    />
    <Screen
      name="Qr"
      component={QrScreen}
      options={{
        title: "Codigo Qr",
      }}
    />
    <Screen
      name="Notification"
      component={NotificationScreen}
      options={({ navigation }) => ({
        title: "Notificaciones",
        headerShown: true,
      })}
    />
    <Screen
      name="Edit"
      component={EditProfileScreen}
      options={{
        title: "Editar Perfil",
      }}
    />
  </Navigator>
);

const ProfileStackScreen = ({ navigation }) => (
  <Navigator>
    <Screen
      name="Profile"
      component={ProfileScreen}
      options={({ navigation }) => ({
        title: "",
        headerShown: false,
      })}
    />
    <Screen
      name="MyTraining"
      component={MyTraining}
      options={({ navigation }) => ({
        title: "",
        headerShown: false,
      })}
    />
    <Screen
      name="WebView"
      component={WebViewScreen}
      options={({ navigation }) => ({
        title: "",
        headerShown: false,
      })}
    />

    <Screen
      name="Edit"
      component={EditProfileScreen}
      options={{
        title: "Editar Perfil",
      }}
    />
    <Screen
      name="Eval"
      component={EvalScreen}
      options={{
        title: "Evaluacion",
        headerShown: false,
      }}
    />
    <Screen
      name="Edit Eval"
      component={EditEvalScreen}
      options={{
        title: "Editar Evaluacion",
        headerShown: true,
      }}
    />
    <Screen
      name="Qr"
      component={QrScreen}
      options={{
        title: "Codigo Qr",
      }}
    />
  </Navigator>
);
const AwardsStack = ({ navigation }) => (
  <Navigator>
    <Screen
      name="Awards"
      component={AwardsScreen}
      options={{
        title: "Logros",
      }}
    />
  </Navigator>
);
const InformationStack = ({ navigation }) => (
  <Navigator>
    <Screen
      name="Information"
      component={InformationScreen}
      options={({ navigation }) => ({
        title: "Informacion",
        headerShown: true,
      })}
    />
    <Screen
      name="PromoDetail"
      component={PromoDetailScreen}
      options={({ navigation }) => ({
        title: "Detalles",
        headerShown: true,
      })}
    />
  </Navigator>
);

export default AppStack;
