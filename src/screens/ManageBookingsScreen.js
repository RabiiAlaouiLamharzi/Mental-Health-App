import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { getAuth } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import BackButton from "../components/BackButton.js";
import { Alert } from "react-native";
import { LogBox } from "react-native";

// ManageBookingScreen component
const ManageBookingScreen = () => {
  const navigation = useNavigation();
  // State to store user email
  const [userEmail, setUserEmail] = useState("");
  // State to store bookings
  const [bookings, setBookings] = useState([]);
  LogBox.ignoreAllLogs();
  // Fetch user email and bookings on component mount
  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      setUserEmail(currentUser.email || "");
    }

    // Fetch bookings from the server
    fetch("http://localhost:3000/bookings")
      .then((response) => response.json())
      .then((data) => setBookings(data))
      .catch((error) => console.error("Error fetching bookings:", error));
  }, []);

  // Filter bookings based on user email
  const filteredBookings = bookings.filter((item) => item.email === userEmail);

  // Function to cancel a booking
  const cancelBooking = async (bookingId) => {
    try {
      console.log("Cancel Booking ID:", bookingId);

      // Show confirmation popup
      Alert.alert(
        "Cancel Booking",
        "Are you sure you want to cancel this booking?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Confirm",
            onPress: async () => {
              if (!bookingId) {
                console.error("Invalid bookingId:", bookingId);
                return;
              }

              // Perform the delete operation on the server
              const response = await fetch(
                `http://localhost:3000/bookings/${bookingId}`,
                {
                  method: "DELETE",
                }
              );

              if (!response.ok) {
                const errorData = await response.json();
                console.error("Error cancelling booking:", errorData.message);
              } else {
                // Update the local state after successful deletion
                setBookings((prevBookings) =>
                  prevBookings.filter((booking) => booking._id !== bookingId)
                );
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error cancelling booking:", error.message);
    }
  };

  return (
    <View style={styles.containerBig}>
      <View style={styles.WhiteSpace}></View>
      <View style={styles.container}>
        <BackButton />
        <ScrollView style={styles.containerCards}>
          {filteredBookings.length === 0 ? (
            <Text
              style={{
                textAlign: "center",
                fontSize: 18,
                color: "black",
                marginTop: "90%",
              }}
            >
              You haven't made any bookings yet!
            </Text>
          ) : (
            filteredBookings.map((item, index) => (
              <View key={index} style={styles.card}>
                <Text style={styles.cardText}>
                  <Text style={styles.attributeTitle}>Counsellor:</Text>{" "}
                  {item.counsellor}
                </Text>
                <Text style={styles.cardText}>
                  <Text style={styles.attributeTitle}>Date:</Text> {item.date}
                </Text>
                <Text style={styles.cardText}>
                  <Text style={styles.attributeTitle}>Time:</Text> {item.time}
                </Text>
                <Text style={styles.cardText}>
                  <Text style={styles.attributeTitle}>Name:</Text> {item.name}
                </Text>
                <Text style={styles.cardText}>
                  <Text style={styles.attributeTitle}>Age:</Text> {item.age}
                </Text>
                <Text style={styles.cardText}>
                  <Text style={styles.attributeTitle}>Gender:</Text>{" "}
                  {item.gender}
                </Text>
                <Text style={styles.cardText}>
                  <Text style={styles.attributeTitle}>Problem:</Text>{" "}
                  {item.problem}
                </Text>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => cancelBooking(item._id)}
                >
                  <Text style={styles.cancelButtonText}>Cancel Booking</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </ScrollView>
      </View>
      <View style={styles.menu}>
        <TouchableOpacity style={styles.navItem}>
          <Image
            source={require("../images/booking.png")}
            style={styles.navImageSelected}
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
  containerBig: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    paddingTop: "5%",
    paddingHorizontal: "6%",
    paddingBottom: "15%",
  },
  WhiteSpace: {
    padding: "5%",
  },
  containerCards: {
    marginTop: "4%",
    paddingBottom: "20%",
  },
  card: {
    padding: 25,
    borderColor: "#ccc",
    borderRadius: 30,
    marginVertical: 10,
    backgroundColor: "#DDEDE7",
  },
  cardText: {
    fontSize: 16,
    marginTop: 5,
    color: "gray",
  },
  attributeTitle: {
    color: "black",
    fontWeight: "600",
  },
  cancelButton: {
    marginTop: "6%",
    backgroundColor: "#CA534F",
    padding: 15,
    borderRadius: 50,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    color: "white",
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

export default ManageBookingScreen;
