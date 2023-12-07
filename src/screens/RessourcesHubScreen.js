import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { LogBox } from "react-native";

const RessourcesHubScreen = () => {
  const navigation = useNavigation();
  const [selectedMenuItem, setSelectedMenuItem] = useState({
    Popular: 1,
    Latest: 1,
    Recommended: 1,
  });
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  LogBox.ignoreAllLogs();
  const menuItems = ["Popular      ", "Latest      ", "Recommended"];

  useEffect(() => {
    // Fetch resources when the component mounts
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await axios.get("http://localhost:3000/ressources");
      setResources(response.data);
    } catch (error) {
      console.error("Error fetching resources:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuItemPress = (item) => {
    const updatedSelected = {};
    menuItems.forEach((menuItem) => {
      updatedSelected[menuItem] = 0.4;
    });

    updatedSelected[item] = 1;

    setSelectedMenuItem(updatedSelected);
  };

  if (loading) {
    return <Text>{searchTerm ? "Searching..." : "Loading..."}</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Image
          source={require("../images/search.png")}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          value={searchTerm}
          onChangeText={(text) => setSearchTerm(text)}
        />
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
      <FlatList
        data={resources.filter((item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase())
        )}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.cardContainer}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.timeAgo}>{item.timeAgo}</Text>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDescription}>{item.description}</Text>
            <TouchableOpacity
              style={styles.readMoreButton}
              onPress={() => {
                navigation.navigate("Read", {
                  title: item.title,
                  time: item.timeAgo,
                  description: item.text,
                });
              }}
            >
              <Text style={styles.readMoreText}>Read more</Text>
            </TouchableOpacity>
          </View>
        )}
      />
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
            style={styles.navImageSelected}
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
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: "6%",
    paddingHorizontal: "5%",
    paddingVertical: "3%",
    borderRadius: 50,
    marginTop: "15%",
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
    paddingVertical: "5%",
    width: "80%",
  },
  menuItem: {
    alignItems: "center",
  },
  menuText: {
    fontSize: 16,
    color: "black",
  },
  cardContainer: {
    paddingHorizontal: "4%",
    paddingBottom: "15%",
  },
  card: {
    backgroundColor: "#DDEDE7",
    borderRadius: 30,
    paddingHorizontal: "6%",
    paddingBottom: "5%",
    paddingTop: "5%",
    marginBottom: "5%",
    marginHorizontal: "3%",
  },
  timeAgo: {
    color: "grey",
    paddingBottom: "3%",
  },
  cardTitle: {
    fontSize: 18,
    color: "black",
    fontWeight: "bold",
    paddingBottom: "3%",
    paddingLeft: "0%",
  },
  cardDescription: {
    color: "grey",
    fontWeight: "600",
    lineHeight: 20,
  },
  readMoreButton: {
    marginTop: 16,
    backgroundColor: "black",
    padding: 12,
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 30,
    width: "100%",
  },
  readMoreText: {
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
  },
  navImageSelected: {
    width: 24,
    height: 24,
  },
});

export default RessourcesHubScreen;
