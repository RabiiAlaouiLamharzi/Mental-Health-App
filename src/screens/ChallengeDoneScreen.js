import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LogBox } from "react-native";

const ChallengeDoneScreen = () => {
  const navigation = useNavigation();
  LogBox.ignoreAllLogs();
  return (
    <View style={styles.container}>
      <View style={styles.greenView}>
        <View style={styles.circle}>
          <Text style={styles.circleText}>22:10</Text>
        </View>
        <Text style={styles.bigTitle}>Next Challenge Coming Soon!</Text>
        <Text style={styles.smallTitle}>
          Stay tuned! The next exciting challenge is just around the corner and
          will kick off within the next 24 hours.
        </Text>
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
            style={styles.navImage}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Image
            source={require("../images/trophy.png")}
            style={styles.navImageSelected}
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
  },
  greenView: {
    backgroundColor: "#54A585",
    borderColor: "#3B725C",
    borderWidth: 3,
    width: "90%",
    height: "80%",
    padding: 20,
    borderRadius: 50,
  },
  circle: {
    marginTop: "20%",
    width: 250,
    height: 250,
    backgroundColor: "white",
    borderRadius: 200,
    justifyContent: "center",
    alignItems: "center",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    borderColor: "white",
    borderWidth: 3,
    backgroundColor: "transparent",
  },
  circleText: {
    fontSize: 60,
    fontWeight: "bold",
    color: "white",
  },
  bigTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
    marginTop: 30,
    textAlign: "center",
    marginHorizontal: 40,
  },
  smallTitle: {
    fontSize: 22,
    marginTop: 15,
    marginHorizontal: 20,
    color: "white",
    fontWeight: "200",
    textAlign: "center",
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
  },
  navImageSelected: {
    width: 24,
    height: 24,
  },
});

export default ChallengeDoneScreen;
