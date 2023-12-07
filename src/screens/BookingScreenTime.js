import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import imageMap from "../ImageMap/imageMapDoctor";
import BackButton from "../components/BackButton.js";
import { useNavigation } from "@react-navigation/native";
import { LogBox } from "react-native";

const Card = ({ title, selected, unselected, unavailable, onPress }) => {
  const cardStyle = [styles.cardItem];
  LogBox.ignoreAllLogs();
  if (selected) {
    cardStyle.push(styles.selectedCard);
  } else if (unselected) {
    cardStyle.push(styles.unselectedCard);
  } else if (unavailable) {
    cardStyle.push(styles.unavailableCard);
  }

  return (
    <TouchableOpacity
      style={cardStyle}
      onPress={onPress}
      disabled={unavailable}
    >
      <Text
        style={
          unselected ? { color: "black", fontWeight: "bold" } : styles.cardText
        }
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const BookingScreenTime = ({ route }) => {
  const { cardData } = route.params;
  const navigation = useNavigation();
  const [selectedHour, setSelectedHour] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("December");
  const [counselorName, setCounselorName] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const handleHourSelection = (time) => {
    setSelectedTime(time);
    setSelectedHour(time);
  };

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

  const today = new Date();
  const currentMonth = today.getMonth() + 1;

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const unavailabilityDates = [5, 9, 12, 16, 20];

  const isDateUnavailable = (date) => unavailabilityDates.includes(date);
  const isDateInPast = (date, month, year) => {
    if (
      year < today.getFullYear() ||
      (year === today.getFullYear() && month < currentMonth)
    ) {
      return true;
    }
    if (
      year === today.getFullYear() &&
      month === currentMonth &&
      date < today.getDate()
    ) {
      return true;
    }
    return false;
  };

  const generateCalendar = (month, year) => {
    const daysInMonth = new Date(year, month, 0).getDate();
    const firstDayOfWeek = new Date(year, month - 1, 1).getDay();

    const calendar = Array.from({ length: daysInMonth }, (_, index) => {
      const day = index + 1;
      const isSelected = day === selectedDate;
      const isUnavailable = isDateUnavailable(day);
      const isInPast = isDateInPast(day, month, year);

      let dateStyle = [styles.date];

      if (isSelected) {
        dateStyle.push(styles.selectedDate);
      } else if (isUnavailable) {
        dateStyle.push(styles.unavailableDate);
      } else if (isInPast) {
        dateStyle.push(styles.pastDate);
      }

      return (
        <TouchableOpacity
          key={day}
          style={dateStyle}
          onPress={() => setSelectedDate(day)}
          disabled={isUnavailable || isInPast}
        >
          <Text style={[styles.dateNumber, isUnavailable && { color: "red" }]}>
            {day}
          </Text>
        </TouchableOpacity>
      );
    });
    return [...Array(firstDayOfWeek).fill(null), ...calendar];
  };

  const goToPreviousMonth = () => {
    const currentMonthIndex = months.indexOf(selectedMonth);
    if (currentMonthIndex === 0) {
      setSelectedMonth(months[months.length - 1]);
    } else {
      setSelectedMonth(months[currentMonthIndex - 1]);
    }
  };

  const goToNextMonth = () => {
    const currentMonthIndex = months.indexOf(selectedMonth);
    if (currentMonthIndex === months.length - 1) {
      setSelectedMonth(months[0]);
    } else {
      setSelectedMonth(months[currentMonthIndex + 1]);
    }
  };

  useEffect(() => {
    setSelectedDate(null);
    setCounselorName(cardData.name);
  }, [selectedMonth]);

  return (
    <View style={styles.container}>
      <BackButton />
      <View style={styles.card}>
        <View style={styles.circleImageContainer}>
          <Image
            source={imageMap[cardData.imageSource]}
            style={styles.circleImage}
          />
        </View>
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardName}>{counselorName}</Text>
          <Text style={styles.coachText}>Coach</Text>
          <View style={styles.ratingStars}>{renderStars(cardData.rating)}</View>
        </View>
      </View>
      <Text style={styles.selectDateTitle}>Select Date</Text>
      <View style={styles.dateSelectionCard}>
        <View style={styles.monthSelector}>
          <TouchableOpacity
            style={styles.monthButton}
            onPress={goToPreviousMonth}
          >
            <Image
              source={require("../images/left.png")}
              style={styles.monthArrow}
            />
          </TouchableOpacity>
          <Text style={styles.selectedMonth}>
            {selectedMonth} {new Date().getFullYear()}
          </Text>
          <TouchableOpacity style={styles.monthButton} onPress={goToNextMonth}>
            <Image
              source={require("../images/right.png")}
              style={styles.monthArrow}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.calendar}>
          <View style={styles.dates}>
            {generateCalendar(months.indexOf(selectedMonth) + 1, 2023)}
          </View>
        </View>
      </View>
      <Text style={styles.selectDateTitle}>Select Hour</Text>
      <View style={styles.cardContainer}>
        <Card
          title="9:00 AM"
          selected={selectedHour === "9:00 AM"}
          unavailable={false}
          unselected={true}
          onPress={() => handleHourSelection("9:00 AM")}
        />
        <Card
          title="10:00 AM"
          selected={selectedHour === "10:00 AM"}
          unavailable={false}
          unselected={true}
          onPress={() => handleHourSelection("10:00 AM")}
        />
        <Card
          title="11:00 AM"
          selected={selectedHour === "11:00 AM"}
          unavailable={true}
          unselected={false}
          onPress={() => handleHourSelection("11:00 AM")}
        />
        <Card
          title="1:00 PM"
          selected={selectedHour === "1:00 PM"}
          unavailable={false}
          unselected={true}
          onPress={() => handleHourSelection("1:00 PM")}
        />
        <Card
          title="2:00 PM"
          selected={selectedHour === "2:00 PM"}
          unavailable={true}
          unselected={false}
          onPress={() => handleHourSelection("2:00 PM")}
        />
        <Card
          title="3:00 PM"
          selected={selectedHour === "3:00 PM"}
          unavailable={false}
          unselected={true}
          onPress={() => handleHourSelection("3:00 PM")}
        />
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
        style={[
          styles.cancelButton,
          {
            opacity: selectedDate && selectedTime ? 1 : 0.5,
          },
        ]}
        onPress={() => {
          if (selectedDate && selectedTime) {
            navigation.navigate("Text", {
              counselorName,
              selectedDate,
              selectedTime,
            });
          }
        }}
        disabled={!selectedDate || !selectedTime}
      >
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: "14%",
    paddingHorizontal: "5%",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ccc",
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 100,
    padding: 5,
    marginBottom: 16,
    marginTop: "5%",
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
  selectDateTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
  },
  dateSelectionCard: {
    marginTop: 20,
    backgroundColor: "#DDEDE7",
    borderRadius: 15,
  },
  monthSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
  },
  monthButton: {
    padding: 10,
  },
  monthArrow: {
    width: 20,
    height: 20,
    opacity: 0.6,
  },
  selectedMonth: {
    fontSize: 16,
    fontWeight: "bold",
  },
  calendar: {},
  weekdays: {
    flexDirection: "row",
    justifyContent: "space around",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    padding: 5,
    margin: "2%",
  },
  weekday: {
    fontSize: 14,
    fontWeight: "bold",
  },
  dates: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignSelf: "center",
    marginBottom: "3%",
  },
  date: {
    width: 42,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: "1.5%",
  },
  dateNumber: {
    fontSize: 16,
  },
  unavailableDate: {
    borderRadius: 20,
  },
  selectedDate: {
    backgroundColor: "#6FCF97",
    borderRadius: 20,
  },
  pastDate: {
    opacity: 0.5,
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
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginTop: 10,
  },
  cardItem: {
    width: "32%",
    aspectRatio: 1,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 50,
    alignItems: "center",
    borderWidth: 1.2,
    paddingVertical: "4%",
    marginVertical: "1%",
  },
  cardText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    textAlignVertical: "center",
  },
  selectedCard: {
    backgroundColor: "#6FCF97",
    borderColor: "#6FCF97",
  },
  unselectedCard: {
    backgroundColor: "white",
    borderColor: "black",
  },
  unavailableCard: {
    backgroundColor: "#CA534F",
    borderColor: "#CA534F",
  },
  cancelButton: {
    height: "7%",
    width: "100%",
    borderRadius: 60,
    backgroundColor: "#54A585",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    position: "absolute",
    bottom: 0,
    marginBottom: "23%",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default BookingScreenTime;
