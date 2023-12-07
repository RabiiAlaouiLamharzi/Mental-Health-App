import React from "react";
import {
  SafeAreaView,
  Image,
  StyleSheet,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  Animated,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LogBox } from "react-native";

const { width, height } = Dimensions.get("window");

const COLORS = { primary: "#fff", black: "black" };

const slides = [
  {
    id: "1",
    image: require("../images/challenges.png"),
    title: "Daily Challenges",
    subtitle: "100 personalized challenges for self-care.",
  },
  {
    id: "2",
    image: require("../images/counselling.png"),
    title: "Booking Counselling Services",
    subtitle: "Easy appointment booking with university counselors.",
  },
  {
    id: "3",
    image: require("../images/chat.png"),
    title: "Anonymous Peer Chat",
    subtitle:
      "Secure platform for private connections among university students.",
  },
];

const Slide = ({ item }) => {
  return (
    <View style={{ alignItems: "center", height: "100%", paddingTop: 40 }}>
      <Image
        source={item?.image}
        style={{ height: "70%", width, resizeMode: "contain" }}
      />
      <View>
        <Text style={styles.title}>{item?.title}</Text>
        <Text style={styles.subtitle}>{item?.subtitle}</Text>
      </View>
    </View>
  );
};

const OnboardingScreen = () => {
  const navigation = useNavigation();
  const scrollViewRef = React.useRef(null);
  LogBox.ignoreAllLogs();
  const [currentSlideIndex, setCurrentSlideIndex] = React.useState(0);
  const scrollX = React.useRef(new Animated.Value(0)).current;

  const slidePosition = Animated.divide(scrollX, width);

  const goToNextSlide = () => {
    const nextSlideIndex = currentSlideIndex + 1;

    if (nextSlideIndex < slides.length) {
      scrollViewRef.current.scrollTo({
        x: nextSlideIndex * width,
        animated: true,
      });
      setCurrentSlideIndex(nextSlideIndex);
    } else {
      navigation.replace("Login");
    }
  };

  const skip = () => {
    if (currentSlideIndex === slides.length - 1) {
      navigation.replace("Login");
    } else {
      const lastSlideIndex = slides.length - 1;
      scrollViewRef.current.scrollTo({
        x: lastSlideIndex * width,
        animated: true,
      });
      setCurrentSlideIndex(lastSlideIndex);
    }
  };

  const Footer = () => {
    return (
      <View
        style={{
          height: height * 0.25,
          justifyContent: "space-between",
          paddingHorizontal: 20,
          paddingTop: "5%",
        }}
      >
        {currentSlideIndex === slides.length - 1 && (
          <View style={{ height: 50 }}>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => navigation.replace("Login")}
            >
              <Text
                style={{
                  fontWeight: "600",
                  fontSize: 15,
                  color: COLORS.primary,
                }}
              >
                GET STARTED
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {currentSlideIndex !== slides.length - 1 && (
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.btn,
                {
                  borderColor: COLORS.black,
                  borderWidth: 1,
                  backgroundColor: "transparent",
                },
              ]}
              onPress={skip}
            >
              <Text
                style={{
                  fontWeight: "600",
                  fontSize: 15,
                  color: COLORS.black,
                }}
              >
                SKIP
              </Text>
            </TouchableOpacity>
            <View style={{ width: 1 }} />
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={goToNextSlide}
              style={styles.btn}
            >
              <Text
                style={{
                  fontWeight: "600",
                  fontSize: 15,
                  color: COLORS.primary,
                }}
              >
                NEXT
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primary }}>
      <StatusBar backgroundColor={COLORS.primary} />
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        scrollEnabled={false}
      >
        {slides.map((item, index) => (
          <Slide key={item.id} item={item} />
        ))}
      </ScrollView>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 10,
        }}
      >
        {slides.map((_, index) => (
          <Animated.View
            key={index}
            style={[
              styles.indicator,
              {
                backgroundColor:
                  index === currentSlideIndex ? "#54A585" : "grey",
                width: index === currentSlideIndex ? 20 : 7,
                opacity: slidePosition.interpolate({
                  inputRange: [index - 1, index, index + 1],
                  outputRange: [0.3, 1, 0.3],
                  extrapolate: "clamp",
                }),
              },
            ]}
          />
        ))}
      </View>
      <Footer />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  subtitle: {
    color: COLORS.black,
    fontSize: 13,
    marginTop: 10,
    maxWidth: "70%",
    textAlign: "center",
    lineHeight: 23,
  },
  title: {
    color: COLORS.black,
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "center",
  },
  indicator: {
    height: 7,
    width: 14,
    backgroundColor: "grey",
    marginHorizontal: 3,
    borderRadius: 100,
    marginBottom: 10,
  },
  btn: {
    flex: 1,
    height: 50,
    borderRadius: 50,
    marginHorizontal: 6,
    backgroundColor: "#54A585",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default OnboardingScreen;
