require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");

const Event = require("./models/events.js");
const Registration = require("./models/Registration");
const User = require("./models/User");
const { storage } = require("./CloudCofig.js");

const Groq = require("groq-sdk");

const app = express(); // 🔥 IMPORTANT (missing safety check)

// ---------------- CORS FIX ----------------
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://uni-events-tan.vercel.app" // ❌ removed trailing slash
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// 🔥 preflight fix
app.options("*", cors());

// ---------------- MIDDLEWARE ----------------
app.use(express.json());

const upload = multer({ storage });

// ---------------- DB ----------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB Connected"))
  .catch(err => console.log(err));

// ---------------- ROUTES ----------------

// Health check
app.get("/", (req, res) => {
  res.send("UniEvents Backend Running 🚀");
});

// EVENTS
app.get("/api/events", async (req, res) => {
  const events = await Event.find({});

  const updatedEvents = await Promise.all(
    events.map(async (event) => {
      const count = await Registration.countDocuments({
        eventId: event._id,
      });

      return {
        ...event.toObject(),
        attendees: count,
      };
    })
  );

  res.json(updatedEvents);
});

app.post("/api/events", upload.single("image"), async (req, res) => {
  try {
    const newEvent = new Event({
      ...req.body,
      image: req.file ? req.file.path : "",
    });

    await newEvent.save();

    res.json({ message: "Event Created" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error creating event" });
  }
});

// ---------------- REGISTER ----------------
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, eventId, userEmail } = req.body;

    if (!userEmail) {
      return res.json({
        success: false,
        message: "Please login before participating ❌",
      });
    }

    const existing = await Registration.findOne({ email, eventId });

    if (existing) {
      return res.json({ success: false, message: "Already Registered!" });
    }

    const event = await Event.findById(eventId);

    const count = await Registration.countDocuments({ eventId });

    if (count >= event.maxAttendees) {
      return res.json({ success: false, message: "Seats Full" });
    }

    await new Registration({ name, email, eventId }).save();

    res.json({ success: true, message: "Registered Successfully" });

  } catch (err) {
    res.status(500).json({ success: false, message: "Error" });
  }
});

// ---------------- USER ----------------
app.post("/api/register-user", async (req, res) => {
  const { email, password, role } = req.body;

  await new User({ email, password, role }).save();

  res.json({ success: true });
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email, password });

  if (!user) {
    return res.json({ success: false, message: "Invalid credentials" });
  }

  res.json({ success: true, role: user.role });
});

// ---------------- SERVER ----------------
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});