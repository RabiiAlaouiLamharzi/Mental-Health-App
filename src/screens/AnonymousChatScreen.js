import React, {
  useState,
  useCallback,
  useEffect,
  useLayoutEffect,
} from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { LogBox } from "react-native";
import { auth } from "../config/firebase";
import image1 from "../images/Vector.png";

const AnonymousChatScreen = () => {
  const navigation = useNavigation();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [conversationEnded, setConversationEnded] = useState(false);
  const [skipMessage, setSkipMessage] = useState("");
  const db = getFirestore();
  LogBox.ignoreAllLogs();

  // Function to send a message to the other user
  const sendMessageToOtherUser = async (messageText) => {
    const otherUserMessage = {
      _id: messages.length + 1,
      text: messageText,
      user: {
        _id: "other_user_id", // Replace with the actual ID of the other user
        name: "Other User", // Replace with the actual name of the other user
      },
    };

    // Save the message to Firestore
    const chatRef = collection(db, "chats");
    await addDoc(chatRef, {
      ...otherUserMessage,
      createdAt: serverTimestamp(),
    });
  };

  const cleanupAndDeleteMessages = async () => {
    const q = query(collection(db, "chats"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(
        snapshot.docs.map((doc) => ({
          _id: doc.data()._id,
          text: doc.data().text,
          user: doc.data().user,
        }))
      );
    });

    const deleteQuery = query(collection(db, "chats"));
    const querySnapshot = await getDocs(deleteQuery);
    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
      console.log(`deleted: ${doc.id}`);
    });

    if (unsubscribe) {
      unsubscribe();
    }
    setMessages([]);
  };

  useLayoutEffect(() => {
    const q = query(collection(db, "chats"), orderBy("createdAt", "desc"));

    onSnapshot(q, (snapshot) => {
      setMessages(
        snapshot.docs.map((doc) => ({
          _id: doc.data()._id,
          text: doc.data().text,
          user: doc.data().user,
        }))
      );
    });

    return () => {
      cleanupAndDeleteMessages();
    };
  }, [db]);

  const onSend = useCallback(async () => {
    if (inputText.trim().toLowerCase() === "skip") {
      setConversationEnded(true);
      setSkipMessage("Conversation ended. User skipped.");

      // Send a message to the other user
      await sendMessageToOtherUser(skipMessage);

      const _id = messages.length + 1;

      const newMessage = {
        _id,
        text: skipMessage,
        user: {
          _id: auth?.currentUser?.email,
          name: auth?.currentUser?.displayName,
        },
      };

      setMessages((previousMessages) => [...previousMessages, newMessage]);
      setInputText("");

      setTimeout(() => {
        setConversationEnded(false);
        setSkipMessage("");
        navigation.navigate("Wait");
      }, 3000);

      return;
    }

    const _id = messages.length + 1;

    const newMessage = {
      _id,
      text: inputText,
      user: {
        _id: auth?.currentUser?.email,
        name: auth?.currentUser?.displayName,
      },
    };

    setMessages((previousMessages) => [...previousMessages, newMessage]);
    setInputText("");

    const chatRef = collection(db, "chats");

    await addDoc(chatRef, {
      _id,
      createdAt: serverTimestamp(),
      text: inputText,
      user: {
        _id: auth?.currentUser?.email,
        name: auth?.currentUser?.displayName,
      },
    });
  }, [messages, inputText, db, navigation, conversationEnded, skipMessage]);

  return (
    <>
      <View style={styles.messageBox}>
        {conversationEnded && (
          <View style={styles.skipMessageContainer}>
            <Text style={styles.skipMessageText}>{skipMessage}</Text>
          </View>
        )}
        <FlatList
          data={messages.slice().reverse()}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => (
            <View
              style={
                item.user._id === auth?.currentUser?.email
                  ? styles.sentMessage
                  : styles.receivedMessage
              }
            >
              <Text
                style={{
                  color: "white",
                  fontWeight: "500",
                }}
              >
                {item.text}
              </Text>
            </View>
          )}
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={inputText}
            onChangeText={(text) => setInputText(text)}
          />
          <TouchableOpacity style={styles.sendButton} onPress={onSend}>
            <Image
              source={image1}
              style={{ width: 20, height: 20, resizeMode: "contain" }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.skipButton}
            onPress={() => navigation.navigate("Wait")} // Call onSend with "skip" as an argument
          >
            <Text style={{ color: "white" }}>Skip</Text>
          </TouchableOpacity>
        </View>
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
    </>
  );
};

const styles = StyleSheet.create({
  messageBox: {
    flex: 1,
    padding: 15,
    marginTop: "15%",
  },
  sentMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#54A585",
    padding: 12,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 15,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    marginBottom: 5,
    marginTop: "3%",
    maxWidth: "80%",
  },
  receivedMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#4FAEDA",
    padding: 12,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    marginBottom: 5,
    marginTop: "3%",
    maxWidth: "80%",
  },
  input: {
    height: 40,
    backgroundColor: "#E8E8E8",
    borderRadius: 100,
    marginBottom: 10,
    paddingHorizontal: 10,
    marginBottom: "20%",
    width: "auto",
    flex: 1,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#DDEDE7",
    padding: 10,
    borderRadius: 100,
    alignItems: "center",
    width: "auto",
    marginBottom: "20%",
    marginRight: 10,
  },
  skipButton: {
    backgroundColor: "black",
    padding: 10,
    width: "auto",
    borderRadius: 100,
    alignItems: "center",
    marginBottom: "20%",
  },
  skipMessageContainer: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
    alignSelf: "center",
  },
  skipMessageText: {
    color: "white",
    fontWeight: "500",
  },
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
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
});

export default AnonymousChatScreen;
