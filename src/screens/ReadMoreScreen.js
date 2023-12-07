import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import BackButton from "../components/BackButton";
import { useNavigation } from "@react-navigation/native";
import { LogBox } from "react-native";

const ReadMoreScreen = ({ route }) => {
  const navigation = useNavigation();
  const { time, title, description } = route.params;
  LogBox.ignoreAllLogs();
  return (
    <View style={styles.container}>
      <View style={styles.containerText}>
        <BackButton />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.time}>{time}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <View style={styles.menu}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Booking")}
          style={styles.navItem}
        >
          <Image
            source={require("../images/booking.png")}
            style={styles.navImage}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Ressources")}
          style={styles.navItem}
        >
          <Image
            source={require("../images/hub.png")}
            style={styles.navImageSelected}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Daily")}
          style={styles.navItem}
        >
          <Image
            source={require("../images/trophy.png")}
            style={styles.navImage}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Wait")}
          style={styles.navItem}
        >
          <Image
            source={require("../images/chatting.png")}
            style={styles.navImage}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Profile")}
          style={styles.navItem}
        >
          <Image
            source={require("../images/profile.png")}
            style={styles.navImage}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  containerText: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: "14%",
    paddingHorizontal: "6%",
  },
  title: {
    paddingTop: "5%",
    fontWeight: "bold",
    fontSize: 32,
    color: "#54A585",
    marginBottom: 8,
  },
  time: {
    paddingBottom: "2%",
    fontWeight: "300",
    fontSize: 15,
    color: "grey",
  },
  description: {
    paddingTop: "2%",
    fontWeight: "300",
    fontSize: 18,
    lineHeight: 25,
  },
  menu: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "white",
    paddingBottom: "7%",
    paddingTop: "4%",
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  navItem: {
    flex: 1,
    alignItems: "center",
  },
  navImage: {
    width: 24,
    height: 24,
    opacity: 0.4,
    filter: "grayscale(100%)",
  },
  navImageSelected: {
    width: 24,
    height: 24,
  },
});

export default ReadMoreScreen;
