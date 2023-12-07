import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import done from "../images/correct.png";
import { LogBox } from "react-native";

const SuccessScreen = () => {
  const navigation = useNavigation();
  LogBox.ignoreAllLogs();
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Booking");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.bottomContainer}>
        <View style={styles.textContainer}>
          <Image source={done} style={styles.image} />
          <Text style={styles.headerText}>Congratulations!</Text>
          <Text style={styles.SubtitleText}>
            You have successfully{"\n"}completed your booking!
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingRight: 20,
    paddingLeft: 20,
    paddingTop: "55%",
    margin: 0,
  },
  bottomContainer: {
    flex: 1,
    justifyContent: "flex-start",
  },
  textContainer: {
    justifyContent: "flex-start",
    width: "100%",
    paddingTop: 16,
    alignItems: "center",
  },
  headerText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 26,
    paddingTop: 20,
    textAlign: "center",
  },
  SubtitleText: {
    fontSize: 16,
    textAlign: "center",
    paddingTop: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 0,
    PaddingBottom: 0,
  },
});

export default SuccessScreen;
