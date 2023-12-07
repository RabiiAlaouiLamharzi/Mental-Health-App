import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getAuth, signOut } from "firebase/auth";
import { LogBox } from "react-native";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      setUserEmail(currentUser.email || "");
      setUserName(currentUser.displayName || "");
    }
  }, []);

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleSendFeedback = () => {
    Alert.alert(
      "Feedback Sent successfully ",
      "Your feedback was sent successfully. Thank you for submitting! "
    );
    setShowFeedbackModal(false);
  };

  const handleFeedback = () => {
    setShowFeedbackModal(true);
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../images/users.png")}
        style={styles.profileImage}
      />
      <Text style={styles.emailText}>{userEmail}</Text>
      <TouchableOpacity
        style={styles.button1}
        onPress={() => navigation.navigate("Cancel")}
      >
        <Text style={styles.buttonText1}>Skipped Challenges</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button2} onPress={handleLogout}>
        <Text style={styles.buttonText2}>Logout</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button3} // Feedback button
        onPress={handleFeedback}
      >
        <Text style={styles.buttonText3}>Feedback</Text>
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

      {/* Feedback Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showFeedbackModal}
        onRequestClose={() => setShowFeedbackModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowFeedbackModal(false)}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.feedbackModal}>
          <Text style={styles.profileText}>
            Please provide feedback to enhance the app:
          </Text>
          <TextInput
            style={styles.feedbackInput}
            placeholder="Enter your feedback ..."
            value={feedback}
            onChangeText={(text) => setFeedback(text)}
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSendFeedback}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowFeedbackModal(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
  profileImage: {
    width: "100%",
    height: "48%",
  },
  emailText: {
    color: "#CA534F",
    fontSize: 18,
    textDecorationLine: "underline",
    marginTop: "5%",
    marginBottom: "5%",
  },
  profileText: {
    color: "black",
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    paddingTop: 10,
    marginBottom: "3%",
  },
  button1: {
    height: "7%",
    width: "90%",
    borderRadius: 60,
    borderWidth: 1.5,
    borderColor: "#54A585",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 10,
  },
  button2: {
    height: "7%",
    width: "90%",
    borderRadius: 60,
    backgroundColor: "#54A585",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 10,
  },
  button3: {
    height: "7%",
    width: "90%",
    borderRadius: 60,
    backgroundColor: "#CA534F",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 10,
  },
  buttonText1: {
    color: "#54A585",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonText2: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonText3: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
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
  // Feedback Modal styles
  modalOverlay: {
    flex: 1,
  },
  feedbackModal: {
    backgroundColor: "white",
    padding: 20,
    paddingTop: 15,
    borderRadius: 10,
    position: "absolute",
    bottom: "1%",
    left: "0%",
    right: "0%",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    zIndex: 1,
  },
  feedbackInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 25,
    marginVertical: 10,
    borderRadius: 50,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: "#CA534F",
    borderRadius: 50,
    padding: 24,
    alignItems: "center",
  },
  sendButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: "transparent",
    borderRadius: 50,
    padding: 15,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#CA534F",
    fontSize: 16,
  },
});

export default ProfileScreen;
