import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { getAuth } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import BackButton from "../components/BackButton.js";
import { LogBox } from "react-native";

const CancelledChallengesScreen = () => {
  const navigation = useNavigation();
  const [challenges, setChallenges] = useState([]);
  LogBox.ignoreAllLogs();
  const fetchChallenges = async () => {
    try {
      const response = await fetch("http://localhost:3000/challenges");
      if (!response.ok) {
        throw new Error("Failed to fetch challenges");
      }
      const data = await response.json();
      setChallenges(data.filter((challenge) => challenge.completion === false));
    } catch (error) {
      console.error("Error fetching challenges:", error.message);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const cancelChallenge = async (challengeId) => {
    try {
      console.log("Cancel Challenge ID:", challengeId);

      // Show confirmation popup
      Alert.alert(
        "Complete Challenge",
        "Are you sure you want to complete this challenge?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Confirm",
            onPress: async () => {
              // Update the challenge completion status to true on the server
              const response = await fetch(
                `http://localhost:3000/challenges/${challengeId}`,
                {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ completion: true }),
                }
              );

              if (!response.ok) {
                throw new Error("Failed to update challenge on the server");
              }

              // Show success popup
              Alert.alert("Success", "Challenge Completed Successfully");

              // Fetch the updated list of challenges
              fetchChallenges();
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error completing challenge:", error.message);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ padding: "5%" }}></View>
      <View
        style={{
          paddingTop: "5%",
          paddingHorizontal: "6%",
          paddingBottom: "15%",
        }}
      >
        <BackButton />
        <ScrollView
          contentContainerStyle={{ marginTop: "4%", paddingBottom: "25%" }}
        >
          {challenges.length === 0 ? (
            <Text
              style={{
                textAlign: "center",
                fontSize: 18,
                color: "black",
                marginTop: "90%",
              }}
            >
              You have no skipped challenges!
            </Text>
          ) : (
            challenges.map((item, index) => (
              <View
                key={index}
                style={{
                  padding: 25,
                  borderColor: "#ccc",
                  borderRadius: 30,
                  marginVertical: 10,
                  backgroundColor: "#DDEDE7",
                }}
              >
                <Text style={{ fontSize: 16, marginTop: 5, color: "gray" }}>
                  <Text style={{ color: "black", fontWeight: "600" }}>
                    Challenge Title:
                  </Text>{" "}
                  {item.title}
                  {"\n"}
                  <Text style={{ color: "black", fontWeight: "600" }}>
                    Challenge Description:
                  </Text>{" "}
                  {item.description}
                  {"\n"}
                  <Text style={{ color: "black", fontWeight: "600" }}>
                    Challenge Duration:
                  </Text>{" "}
                  {item.duration}
                  {"\n"}
                </Text>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#54A585",
                    padding: 15,
                    borderRadius: 50,
                    alignItems: "center",
                  }}
                  onPress={() => cancelChallenge(item._id)}
                >
                  <Text style={{ fontSize: 16, color: "white" }}>
                    Complete Challenge
                  </Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </ScrollView>
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
        <TouchableOpacity style={styles.navItem}>
          <Image
            source={require("../images/profile.png")}
            style={styles.navImageSelected}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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

export default CancelledChallengesScreen;
