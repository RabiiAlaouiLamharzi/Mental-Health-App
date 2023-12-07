import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import OnboardingScreen from "./src/screens/OnboardingScreen";
import IntroScreen from "./src/screens/IntroScreen";
import LoginScreen from "./src/screens/LoginScreen";
import DailyChallengesScreen from "./src/screens/DailyChallengesScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import RessourcesHubScreen from "./src/screens/RessourcesHubScreen";
import BookingScreen from "./src/screens/BookingScreen";
import BookingScreenTime from "./src/screens/BookingScreenTime";
import BookingScreenText from "./src/screens/BookingScreenText";
import ChallengeDoneScreen from "./src/screens/ChallengeDoneScreen";
import ReadMoreScreen from "./src/screens/ReadMoreScreen";
import ChatWaitScreen from "./src/screens/ChatWaitScreen";
import SuccessScreen from "./src/screens/SuccessScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import AnonymousChatScreen from "./src/screens/AnonymousChatScreen";
import ManageBookingsScreen from "./src/screens/ManageBookingsScreen";
import CancelledChallengesScreen from "./src/screens/CancelledChallengesScreen";
const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Intro"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Intro" component={IntroScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Daily" component={DailyChallengesScreen} />
        <Stack.Screen name="Booking" component={BookingScreen} />
        <Stack.Screen name="Ressources" component={RessourcesHubScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Challenge" component={ChallengeDoneScreen} />
        <Stack.Screen name="Read" component={ReadMoreScreen} />
        <Stack.Screen name="Wait" component={ChatWaitScreen} />
        <Stack.Screen name="Time" component={BookingScreenTime} />
        <Stack.Screen name="Text" component={BookingScreenText} />
        <Stack.Screen name="Success" component={SuccessScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Anonymous" component={AnonymousChatScreen} />
        <Stack.Screen name="Manage" component={ManageBookingsScreen} />
        <Stack.Screen name="Cancel" component={CancelledChallengesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
