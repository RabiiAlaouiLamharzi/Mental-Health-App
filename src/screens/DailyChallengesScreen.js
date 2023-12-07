import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/FontAwesome";
import axios from "axios";
LogBox.ignoreAllLogs();
import { LogBox } from "react-native";

const DailyChallengesScreen = () => {
  const navigation = useNavigation();
  const windowWidth = Dimensions.get("window").width;

  const [challenge, setChallenge] = useState({});
  const [isCompleteModalVisible, setCompleteModalVisible] = useState(false);
  const [isSkipModalVisible, setSkipModalVisible] = useState(false);
  const [isSkipConfirmed, setSkipConfirmed] = useState(false);

  useEffect(() => {
    // Fetch the challenge when the component mounts
    fetchChallenge("656bfe5f4fb4d2b39c005df8");
  }, []);

  const fetchChallenge = async (challengeId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/challenges/${challengeId}`
      );
      setChallenge(response.data);
    } catch (error) {
      console.error("Error fetching challenge:", error);
    }
  };

  const toggleCompleteModal = () => {
    setCompleteModalVisible(!isCompleteModalVisible);
  };

  const toggleSkipModal = () => {
    setSkipModalVisible(!isSkipModalVisible);
  };

  const handleSkipConfirmation = async (confirmed) => {
    try {
      if (confirmed) {
        // Make PUT request to update challenge completion to false
        await axios.put(`http://localhost:3000/challenges/${challenge._id}`, {
          completion: false,
        });
      }

      // Close the skip modal
      setSkipModalVisible(false);

      if (confirmed) {
        // Replace the current screen with the Challenge screen only if confirmed
        navigation.replace("Challenge");
      }
    } catch (error) {
      console.error("Error updating challenge completion:", error);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../images/lac.jpg")}
        style={styles.imageBackground}
      >
        <TouchableOpacity style={styles.btn} onPress={toggleCompleteModal}>
          <View style={styles.buttonContent}>
            <Icon
              name="check"
              size={windowWidth * 0.06}
              color="white"
              style={styles.icon}
            />
            <Text style={styles.buttonText}>Complete</Text>
          </View>
        </TouchableOpacity>
      </ImageBackground>

      <Text style={styles.bigTitle}>{challenge.title}</Text>
      <Text style={styles.smallTitle}>{challenge.description}</Text>
      <Text style={styles.smallTitleClock}>{challenge.duration}</Text>

      <View
        style={{
          borderLeftWidth: 10,
          borderLeftColor: "black",
        }}
      />

      <Text style={styles.subTitle}>Added Value?</Text>
      <Text style={styles.bulletPoint}>
        <Icon
          name="check"
          size={windowWidth * 0.05}
          color="purple"
          style={styles.icon}
        />{" "}
        {challenge.addedValue1}
      </Text>
      <Text style={styles.bulletPoint}>
        <Icon
          name="check"
          size={windowWidth * 0.05}
          color="purple"
          style={styles.icon}
        />{" "}
        {challenge.addedValue2}
      </Text>
      <Text style={styles.bulletPoint}>
        <Icon
          name="check"
          size={windowWidth * 0.05}
          color="purple"
          style={styles.icon}
        />{" "}
        {challenge.addedValue3}
      </Text>

      <TouchableOpacity style={styles.skip} onPress={toggleSkipModal}>
        <View style={styles.buttonContent}>
          <Text style={styles.buttonTextSkip}>Skip Challenge</Text>
        </View>
      </TouchableOpacity>

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

      <Modal
        isVisible={isCompleteModalVisible}
        onBackdropPress={toggleCompleteModal}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>
            Are you sure you want to complete this challenge?
          </Text>
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity
              style={styles.modalButton1}
              onPress={() => {
                toggleCompleteModal();
                navigation.replace("Challenge");
              }}
            >
              <Text style={styles.modalButtonText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton1}
              onPress={toggleCompleteModal}
            >
              <Text style={styles.modalButtonText}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        isVisible={isSkipModalVisible}
        onBackdropPress={() => handleSkipConfirmation(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>
            Are you sure you want to skip this challenge?
          </Text>
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity
              style={styles.modalButton2}
              onPress={() => handleSkipConfirmation(true)}
            >
              <Text style={styles.modalButtonText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton2}
              onPress={() => handleSkipConfirmation(false)}
            >
              <Text style={styles.modalButtonText}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  imageBackground: {
    height: 400,
  },
  btn: {
    height: "15%",
    width: "75%",
    borderRadius: 50,
    backgroundColor: "#54A585",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    position: "absolute",
    top: "92%",
    elevation: 25, // Add elevation to create a drop shadow
    shadowColor: "#54A585",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  skip: {
    height: "6%",
    width: "90%",
    borderRadius: 50,
    borderColor: "#CA534F",
    borderWidth: 1,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    position: "absolute",
    bottom: 0,
    marginBottom: "18.5%",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
  },
  buttonTextSkip: {
    color: "#CA534F",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
  },
  bigTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "black",
    marginTop: 45,
    marginStart: 20,
  },
  smallTitle: {
    fontSize: 18,
    marginStart: 20,
    marginRight: 20,
    marginTop: 10,
    color: "grey",
  },
  smallTitleClock: {
    fontSize: 18,
    marginStart: 20,
    marginTop: 15,
    color: "black",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 8, // Add a margin to create space between the icon and text
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
  verticalLine: {
    height: 30, // Adjust the height as needed
    width: 2,
    backgroundColor: "grey",
    marginVertical: 10, // Add vertical margin for spacing
  },
  subTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 10,
    marginStart: 20,
  },
  bulletPoint: {
    fontSize: 15,
    marginVertical: 3,
    marginStart: 30,
  },
  // Modal styles
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
  },
  modalText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  modalButton1: {
    padding: 10,
    marginTop: "5%",
    width: "45%",
    borderRadius: 50,
    backgroundColor: "#54A585",
  },
  modalButton2: {
    padding: 10,
    marginTop: "5%",
    width: "45%",
    borderRadius: 50,
    backgroundColor: "#CA534F",
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
});

export default DailyChallengesScreen;
