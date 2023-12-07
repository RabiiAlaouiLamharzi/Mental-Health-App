import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "../config/firebase"; // Import Firebase Auth from your config
import counsellorData from "../json/counsellor.json";
import bookingData from "../json/BookingData.json";
import imageMap from "../ImageMap/imageMapDoctor";
import { LogBox } from "react-native";

const BookingScreen = () => {
  const navigation = useNavigation();
  const [selectedMenuItem, setSelectedMenuItem] = useState({
    Popular: 1,
    Recommended: 0.4,
  });
  const [counselorData, setCounselorData] = useState(counsellorData); // State to store filtered counselor data
  const menuItems = ["Popular      ", "Recommended"];
  const [selectedCounselor, setSelectedCounselor] = useState(null);
  const [userEmail, setUserEmail] = useState(null); // State to store user email
  LogBox.ignoreAllLogs();
  useEffect(() => {
    // Fetch user email when the component mounts
    fetchUserEmail();
  }, []);

  const fetchUserEmail = async () => {
    try {
      // Fetch the current user from Firebase Auth
      const user = auth().currentUser;

      if (user) {
        setUserEmail(user.email);
      }
    } catch (error) {
      console.error("Error fetching user email:", error);
    }
  };

  const handleMenuItemPress = (item) => {
    const updatedSelected = {};
    menuItems.forEach((menuItem) => {
      updatedSelected[menuItem] = 0.4;
    });

    updatedSelected[item] = 1;

    setSelectedMenuItem(updatedSelected);

    // If "Recommended" is selected, sort the counselors based on rating in descending order
    if (item === "Recommended") {
      const sortedCounselors = [...counsellorData].sort(
        (a, b) => b.rating - a.rating
      );
      setCounselorData(sortedCounselors);
    } else {
      // If "Popular" or other options are selected, use the original counsellorData
      setCounselorData(counsellorData);
    }
  };

  const handleCounselorSelection = async (counselor) => {
    try {
      // Update the state with the selected counselor
      setSelectedCounselor(counselor);

      // Update BookingData.json with the selected counselor's information
      const updatedBookingData = {
        ...bookingData,
        userEmail: userEmail,
        selectedCounselor: counselor,
      };

      // Store the updated data in AsyncStorage
      await AsyncStorage.setItem(
        "BookingData",
        JSON.stringify(updatedBookingData)
      );
      console.log("BookingData updated:", updatedBookingData);
    } catch (error) {
      console.error("Error updating BookingData:", error);
    }
  };

  // Define a function to create an array of star images based on the rating.
  const renderStars = (rating) => {
    const starImages = [];
    for (let i = 0; i < rating; i++) {
      starImages.push(
        <Image
          key={i}
          source={require("../images/star.png")}
          style={styles.starImage}
        />
      );
    }
    return starImages;
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Image
          source={require("../images/search.png")}
          style={styles.searchIcon}
        />
        <TextInput style={styles.searchInput} placeholder="Search..." />
      </View>
      <View style={styles.menuSelection}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.menuItem,
              { opacity: selectedMenuItem[item] },
              selectedMenuItem[item] === 0 && styles.selectedMenuItem,
            ]}
            onPress={() => {
              handleMenuItemPress(item);
            }}
          >
            <Text style={styles.menuText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.cardContainer}>
        {counselorData.map((card, index) => (
          <TouchableOpacity
            style={[
              styles.card,
              selectedCounselor === card.name && styles.selectedCard,
            ]}
            key={index}
            onPress={() => {
              handleCounselorSelection(card.name);
              navigation.navigate("Time", { cardData: card });
            }}
          >
            <View style={styles.circleImageContainer}>
              <Image
                source={imageMap[card.imageSource]}
                style={styles.circleImage}
              />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardName}>{card.name}</Text>
              <Text style={styles.coachText}>Coach</Text>
              <View style={styles.ratingStars}>{renderStars(card.rating)}</View>
            </View>
          </TouchableOpacity>
        ))}
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
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => {
          navigation.navigate("Manage");
        }}
      >
        <Text style={styles.buttonText}>Manage Booking</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: "6%",
    marginTop: "20%",
    paddingHorizontal: "5%",
    paddingVertical: "3%",
    borderRadius: 50,
    backgroundColor: "#EDEDED",
  },
  searchIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "grey",
  },
  menuSelection: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    alignSelf: "center",
    backgroundColor: "white",
    paddingTop: "4%",
    width: "80%",
  },
  menuItem: {
    alignItems: "center",
  },
  selectedMenuItem: {
    backgroundColor: "lightgray",
  },
  menuText: {
    fontSize: 16,
    color: "black",
  },
  cardContainer: {
    padding: 20,
  },
  card: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    borderColor: "#ccc",
    justifyContent: "center",
    borderRadius: 100,
    padding: 5,
    marginBottom: 16,
    backgroundColor: "#DDEDE7",
  },
  circleImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    padding: 12,
    overflow: "hidden",
  },
  circleImage: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  cardTextContainer: {
    flex: 1,
    justifyContent: "center",
  },
  cardName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  coachText: {
    fontSize: 13,
    marginTop: 5,
    color: "gray",
  },
  ratingStars: {
    flexDirection: "row",
    marginTop: 5,
    alignItems: "center",
  },
  starImage: {
    width: 20,
    height: 20,
    marginRight: 3,
  },
  cardRating: {
    fontSize: 16,
    marginTop: 5,
  },
  cancelButton: {
    height: "6%",
    width: "90%",
    borderRadius: 60,
    backgroundColor: "#CA534F",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    position: "absolute",
    bottom: 0,
    marginBottom: "20%",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
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
  selectedCard: {
    borderColor: "#CA534F",
    borderWidth: 2,
  },
});

export default BookingScreen;
