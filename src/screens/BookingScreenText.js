import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
  Button,
  TouchableOpacity,
  Image,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import BackButton from "../components/BackButton.js";
import { getAuth } from "firebase/auth";
import { LogBox } from "react-native";

const BookingScreenText = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { counselorName, selectedDate, selectedTime } = route.params;
  const ageOptions = Array.from({ length: 15 }, (_, i) => (i + 16).toString());
  const genderOptions = ["Male", "Female", "Other"];
  const [ageModalVisible, setAgeModalVisible] = useState(false);
  const [selectedAge, setSelectedAge] = useState("");
  const [genderModalVisible, setGenderModalVisible] = useState(false);
  const [selectedGender, setSelectedGender] = useState("");
  const [initialProblemHeight, setInitialProblemHeight] = useState(100);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [userProblem, setUserProblem] = useState("");
  const [finishDisabled, setFinishDisabled] = useState(true);
  LogBox.ignoreAllLogs();
  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      setUserEmail(currentUser.email || "");
    }
  }, []);

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      setUserEmail(currentUser.email || "");
    }

    // Get current date information
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // Months are zero-based

    // Update selectedDate with the current month and year
    const updatedSelectedDate = `${selectedDate}-${
      currentMonth < 10 ? "0" : ""
    }${currentMonth}-${currentYear}`;
    route.params.selectedDate = updatedSelectedDate;
  }, []);

  useEffect(() => {
    setFinishDisabled(
      !(
        userName &&
        selectedAge &&
        selectedGender &&
        userProblem &&
        userEmail &&
        counselorName &&
        selectedDate &&
        selectedTime
      )
    );
  }, [
    userName,
    selectedAge,
    selectedGender,
    userProblem,
    userEmail,
    counselorName,
    selectedDate,
    selectedTime,
  ]);

  const toggleAgeModal = () => {
    setAgeModalVisible(!ageModalVisible);
  };

  const toggleGenderModal = () => {
    setGenderModalVisible(!genderModalVisible);
  };

  const handleFinish = async () => {
    const userEmailString = userEmail
      ? userEmail.split('"userEmail": "')[1]?.split('"')[0]
      : undefined;

    try {
      console.log("Booking Information:", {
        userEmailString,
        selectedAge,
        selectedGender,
        userProblem,
        userEmail,
        counselorName,
        selectedDate,
        selectedTime,
      });

      const response = await fetch("http://localhost:3000/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
          counsellor: counselorName,
          date: selectedDate,
          time: selectedTime,
          name: userName,
          age: selectedAge,
          gender: selectedGender,
          problem: userProblem,
        }),
      });

      if (response.ok) {
        navigation.navigate("Success");
      } else {
        console.error("Error while creating booking");
      }
    } catch (error) {
      console.error("Error while creating booking", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        <BackButton />
        <View style={styles.NameCard}>
          <Text style={styles.cardTitle}>Full Name</Text>
          <TextInput
            style={styles.cardText}
            placeholder="Enter your Full Name here"
            placeholderTextColor="black"
            onChangeText={(text) => setUserName(text)}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Age</Text>
          <TouchableWithoutFeedback onPress={toggleAgeModal}>
            <View style={styles.cardText}>
              <Text style={styles.cardTextValue}>
                {selectedAge || "Select your age"}
              </Text>
            </View>
          </TouchableWithoutFeedback>
          <Modal
            animationType="slide"
            transparent={true}
            visible={ageModalVisible}
          >
            <View style={styles.modalContainer}>
              <View style={styles.ageModalContent}>
                {ageOptions.map((age) => (
                  <Button
                    key={age}
                    title={age}
                    onPress={() => {
                      setSelectedAge(age);
                      toggleAgeModal();
                    }}
                  />
                ))}
              </View>
            </View>
          </Modal>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Gender</Text>
          <TouchableWithoutFeedback onPress={toggleGenderModal}>
            <View style={styles.cardText}>
              <Text style={styles.cardTextValue}>
                {selectedGender || "Select your gender"}
              </Text>
            </View>
          </TouchableWithoutFeedback>
          <Modal
            animationType="slide"
            transparent={true}
            visible={genderModalVisible}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                {genderOptions.map((gender) => (
                  <Button
                    key={gender}
                    title={gender}
                    onPress={() => {
                      setSelectedGender(gender);
                      toggleGenderModal();
                    }}
                  />
                ))}
              </View>
            </View>
          </Modal>
        </View>

        <View style={styles.cardProblem}>
          <Text style={styles.cardTitle}>Your Problem</Text>
          <TextInput
            style={[
              styles.cardText,
              styles.multilineInput,
              { height: initialProblemHeight },
            ]}
            placeholder="Write your Problem here"
            placeholderTextColor="black"
            multiline={true}
            numberOfLines={5}
            onChangeText={(text) => setUserProblem(text)}
          />
        </View>
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
        style={[styles.cancelButton, { opacity: finishDisabled ? 0.5 : 1 }]}
        onPress={finishDisabled ? null : handleFinish}
        disabled={finishDisabled}
      >
        <Text style={styles.buttonText}>Finish</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: "12%",
  },
  cardContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 12,
  },
  card: {
    backgroundColor: "#E2F5EA",
    borderRadius: 50,
    padding: 16,
    marginBottom: 16,
  },
  NameCard: {
    backgroundColor: "#E2F5EA",
    borderRadius: 50,
    padding: 16,
    marginBottom: 16,
    marginTop: "5%",
  },
  cardProblem: {
    backgroundColor: "#E2F5EA",
    borderRadius: 40,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    color: "gray",
    fontWeight: "600",
    fontSize: 13,
  },
  cardText: {
    color: "black",
    fontSize: 16,
  },
  cardTextValue: {
    fontSize: 16,
    color: "black",
  },
  multilineInput: {
    textAlignVertical: "top",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
  },
  ageModalContent: {
    backgroundColor: "white",
    padding: 20,
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
  cancelButton: {
    height: "6%",
    width: "90%",
    borderRadius: 60,
    backgroundColor: "#54A585",
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
});

export default BookingScreenText;
