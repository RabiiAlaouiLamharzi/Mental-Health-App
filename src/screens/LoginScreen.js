import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  TextInput,
  Modal,
  Pressable,
  Alert, // Import Alert
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import { LogBox } from "react-native";

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  LogBox.ignoreAllLogs();
  StatusBar.setBarStyle("dark-content", true);

  const signIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      // Handle successful sign-in, if needed
      console.log("User signed in:", user);
      setModalVisible(false); // Close the modal after successful sign-in
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      // Handle errors, if needed
      console.error("Error signing in:", errorCode, errorMessage);

      // Show an alert for incorrect username or password
      Alert.alert(
        "Login Failed",
        "Incorrect username or password. Please try again."
      );
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.replace("Daily");
      } else {
        // Handle the case where the user is not signed in
      }
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={require("../images/mail.jpg")} style={styles.image} />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => setModalVisible(true)} // Open the modal on button press
        >
          <Text
            style={{
              fontWeight: "600",
              fontSize: 15,
              color: "#54A585",
              marginLeft: 10,
              textAlign: "center",
            }}
          >
            Login with Outlook
          </Text>
          <Image
            source={require("../images/outlook.png")}
            style={styles.logo}
          />
        </TouchableOpacity>
      </View>

      {/* Modal for Outlook login */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={[styles.modalContainer, { justifyContent: "flex-end" }]}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry={true}
              value={password}
              onChangeText={(text) => setPassword(text)}
            />
            <TouchableOpacity
              style={styles.loginButton}
              onPress={signIn} // Call the signIn function on button press
            >
              <Text style={{ color: "#fff" }}>Login</Text>
            </TouchableOpacity>
            <Pressable
              style={styles.closeButton}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={{ color: "#54A585" }}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  imageContainer: {
    flex: 0.9,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  image: {
    width: "170%",
    height: "170%",
    resizeMode: "contain",
  },
  inputContainer: {
    flex: 0.2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  input: {
    width: "80%",
    height: 40,
    borderBottomColor: "#000",
    borderBottomWidth: 1,
    marginBottom: 20,
  },
  buttonContainer: {
    flex: 0.28,
    marginTop: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  btn: {
    width: "80%",
    borderRadius: 100,
    marginTop: "0%",
    padding: "4%",
    color: "#54A585",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  logo: {
    width: 30,
    height: 30,
    marginStart: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    justifyContent: "center",
  },
  modalContent: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 20,
    paddingTop: 35,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    alignItems: "center",
  },
  loginButton: {
    width: "80%",
    borderRadius: 100,
    marginTop: 20, // Adjusted margin
    padding: "4%",
    backgroundColor: "#54A585",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    marginTop: 10,
    paddingBottom: 15,
  },
});

export default LoginScreen;
