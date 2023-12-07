const express = require("express");
const mongoose = require("mongoose");
const Ressource = require("./models/ressourceModel");
const Booking = require("./models/bookingModel");
const Challenge = require("./models/challengesModel");
const app = express();

// Global variable to store user count
let userCount = 0;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes

app.get("/", (req, res) => {
  res.send("Hello World");
});

// Get the current user count
app.get("/user-count", (req, res) => {
  res.json({ userCount });
});

// Update the user count
app.post("/update-user-count", (req, res) => {
  const { newCount } = req.body;

  // Validate the newCount value if needed
  // Example: if (typeof newCount !== 'number') ...

  userCount = newCount;
  res.json({ success: true, userCount });
});

app.get("/ressources", async (req, res) => {
  try {
    const ressources = await Ressource.find({});
    res.status(200).json(ressources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/ressources", async (req, res) => {
  try {
    const ressources = await Ressource.create(req.body);
    res.status(200).json(ressources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/challenges", async (req, res) => {
  try {
    const challenges = await Challenge.find({});
    res.status(200).json(challenges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/challenges/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const challenges = await Challenge.findById(id);
    res.status(200).json(challenges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/challenges", async (req, res) => {
  try {
    const challenges = await Challenge.create(req.body);
    res.status(200).json(challenges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put("/challenges/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const challenges = await Challenge.findByIdAndUpdate(id, req.body);
    // we cannot find any challenge in database
    if (!challenges) {
      return res
        .status(404)
        .json({ message: `cannot find any challenge with ID ${id}` });
    }
    const updatedChallenge = await Challenge.findById(id);
    res.status(200).json(updatedChallenge);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find({});
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/bookings/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const bookings = await Booking.findById(id);
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/bookings", async (req, res) => {
  try {
    const bookings = await Booking.create(req.body);
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete("/bookings/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const bookings = await Booking.findByIdAndDelete(id);
    if (!bookings) {
      return res
        .status(404)
        .json({ message: `cannot find any booking with ID ${id}` });
    }
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

mongoose.set("strictQuery", false);
mongoose
  .connect(
    "mongodb+srv://rabiialaoui10:lx4Fyn73jTN5yat7@cluster0.o0tmm.mongodb.net/Node-API?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("connected to MongoDB");
    app.listen(3000, () => {
      console.log(`Server Started`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
