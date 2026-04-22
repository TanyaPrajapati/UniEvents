require("dotenv").config();
// console.log(process.env);
const path = require("path");
const express = require("express");

const mongoose = require("mongoose");
const cors = require("cors");
const Event = require("./models/events.js");
const Registration = require("./models/Registration");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const SECRET = "mysecretkey";
const multer = require("multer");
const { storage } = require("./CloudCofig.js");

const app = express();

app.use(cors());
app.use(express.json());


app.use("/uploads", express.static("uploads")); 


// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/"); 
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

const upload = multer({ storage }); // 🔥 use Cloudinary storage

// DB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB Connected to MongoDB"))
  .catch(err => console.log(err));

// API routes
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
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const newEvent = new Event({
      ...req.body,
      image: req.file ? req.file.path : "",   // ✅ only image URL/path
    });

    console.log("SAVING IMAGE PATH:", newEvent.image);

    await newEvent.save();

    res.json({ message: "Event Created" });
  } catch (err) {
    console.log("ERROR:", err);
    res.status(500).json({ message: "Error creating event" });
  }
});

app.get("/api/events/:id", async (req, res) => {
  const event = await Event.findById(req.params.id);

  const registrationsCount = await Registration.countDocuments({
    eventId: req.params.id,
  });

  res.json({
    ...event.toObject(),
    attendees: registrationsCount, // 🔥 real count
  });
});

app.delete("/api/events/:id", async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);

    await Registration.deleteMany({ eventId: req.params.id });

    res.json({ message: "Event Deleted" });
  } catch (err) {
    res.json({ message: "Error deleting event" });
  }
});


app.post("/api/register", async (req, res) => {
  try {
    const { name, email, eventId } = req.body;

    const existing = await Registration.findOne({ email, eventId });
    if (existing) {
      return res.json({ message: "Already Registered!" });
    }

    const event = await Event.findById(eventId);

    // ✅ safety
    if (!event.attendees) event.attendees = 0;

    // ✅ seats full logic
    if (event.attendees >= event.maxAttendees) {
      return res.json({ message: "Seats Full" });
    }

    const newReg = new Registration({ name, email, eventId });
    await newReg.save();

    res.json({ message: "Registered Successfully" });

  } catch (err) {
    console.log(err);
    res.json({ message: "Error" });
  }
});

app.get("/api/check-registration", async (req, res) => {
  const { email, eventId } = req.query;

  const existing = await Registration.findOne({ email, eventId });

  if (existing) {
    return res.json({ registered: true });
  } else {
    return res.json({ registered: false });
  }
});


app.get("/api/admin/event/:id/registrations", async (req, res) => {
  try {
    const registrations = await Registration.find({
      eventId: req.params.id,
    });

    res.json(registrations);
  } catch (err) {
    res.json({ message: "Error fetching registrations" });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email, password });

  if (!user) {
    return res.json({ success: false, message: "Invalid credentials" });
  }

  res.json({
    success: true,
    role: user.role, // 🔥 important
  });
});




app.post("/api/register-user", async (req, res) => {
  const { email, password, role } = req.body;

  const user = new User({ email, password, role });
  await user.save();

  res.json({ success: true });
});


app.get("/", (req, res) => {
  res.send("Server working ✅");
});

// server
app.listen(3000, () => {
  console.log("Server running on 3000");
});