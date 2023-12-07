import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as Animatable from "react-native-animatable";
import { data } from "../config/firebase"; // Assuming `data` is your Firebase database instance
import { ref, set, get } from "firebase/database";
import { LogBox } from "react-native";

const ChatWaitScreen = () => {
  const navigation = useNavigation();
  const [userCount, setUserCount] = useState(0);
  const [loading, setLoading] = useState(true);
  LogBox.ignoreAllLogs();
  const checkAndRedirect = () => {
    if (!loading && userCount >= 2) {
      console.log("User count is 2 or more. Redirecting to 'Anonymous'...");
      const timeout = setTimeout(() => {
        navigation.navigate("Anonymous");
      }, 1000);

      return () => {
        console.log("Clearing timeout...");
        clearTimeout(timeout);
      };
    }
  };

  const continuousFetching = async () => {
    try {
      const userCountRef = ref(data, "user-count");
      const snapshot = await get(userCountRef);
      const count = snapshot.val();
      setUserCount(count);
      console.log("Continuous User count updated:", count);
    } catch (error) {
      console.error("Error during continuous fetching:", error.message);
    }
  };

  useEffect(() => {
    console.log("Fetching user count...");

    const fetchData = async () => {
      try {
        // Fetch user count
        const userCountRef = ref(data, "user-count");
        const snapshot = await get(userCountRef);
        const count = snapshot.val();
        setUserCount(count);
        console.log("User count updated:", count);

        // Increment user count on the server
        try {
          // Increment user count
          await set(ref(data, "user-count"), count + 1);
          const updatedCount = count + 1;
          setUserCount(updatedCount);
          console.log("User count incremented:", updatedCount);
        } catch (error) {
          console.error("Error incrementing user count:", error.message);
        } finally {
          setLoading(false); // Set loading to false once the operations are completed
        }
      } catch (error) {
        console.error("Error fetching user count:", error.message);
        setLoading(false); // Set loading to false in case of an error
      }
    };

    fetchData();
  }, []); // Empty dependency array means this effect runs once on mount

  useEffect(() => {
    // Call the function to check and redirect
    const clearTimeout = checkAndRedirect();

    // Cleanup function
    return clearTimeout;
  }, [loading, userCount, navigation]);

  useEffect(() => {
    // Set up the interval for continuous fetching (every 5000 milliseconds, adjust as needed)
    const intervalId = setInterval(continuousFetching, 1000);

    // Cleanup function to clear the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <View style={styles.container}>
      <Animatable.View
        animation="pulse"
        duration={1500}
        iterationCount="infinite"
        style={styles.logoContainer}
      >
        <Image
          source={require("../images/wait.png")}
          style={styles.waitImage}
        />
      </Animatable.View>
      <Text style={styles.bigTitle}>Searching for a match ...</Text>
      <Text style={styles.smallTitle}>Please wait!</Text>
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
          onPress={() => navigation.navigate("Resources")}
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
        <TouchableOpacity style={styles.navItem}>
          <Image
            source={require("../images/chatting.png")}
            style={styles.navImageSelected}
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
  waitImage: {
    width: 250,
    height: 270,
    marginVertical: "5%",
  },
  bigTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  smallTitle: {
    fontSize: 18,
    marginTop: 10,
    color: "grey",
  },
  logoContainer: {
    alignItems: "center",
  },
});

export default ChatWaitScreen;
