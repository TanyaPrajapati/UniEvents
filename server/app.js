require("dotenv").config();

const cors = require("cors");
const express = require("express");
const app = express();
const mongoose = require("mongoose");

const Event = require("./models/events.js");
const Registration = require("./models/Registration");

const User = require("./models/User");

const multer = require("multer");
const { storage } = require("./CloudCofig.js");



app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://uni-events-tan.vercel.app"
    ],
    credentials: true,
  })
);

app.use(express.json());

const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const upload = multer({ storage }); 

// DB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB Connected to MongoDB"))
  .catch(err => console.log(err));


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
      image: req.file ? req.file.path : "",   
    });

    

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
    attendees: registrationsCount,
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
    const { name, email, eventId, userEmail } = req.body;

    
    if (!userEmail) {
      return res.json({
        success: false,
        message: "Please login before participating ❌",
      });
    }

    const existing = await Registration.findOne({ email, eventId });

    if (existing) {
      return res.json({
        success: false,
        message: "Already Registered!",
      });
    }

    const event = await Event.findById(eventId);

    
    const registrationsCount = await Registration.countDocuments({
      eventId,
    });

    
    if (registrationsCount >= event.maxAttendees) {
      return res.json({
        success: false,
        message: "Seats Full",
      });
    }

    const newReg = new Registration({
      name,
      email,
      eventId,
    });

    await newReg.save();

    res.json({
      success: true,
      message: "Registered Successfully",
    });

  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      message: "Error",
    });
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




app.post("/api/register-user", async (req, res) => {
  const { email, password, role } = req.body;

  const user = new User({ email, password, role });
  await user.save();

  res.json({ success: true });
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  console.log("LOGIN DATA:", email, password);

  const user = await User.findOne({ email, password });

  console.log("FOUND USER:", user);

  if (!user) {
    return res.json({ success: false, message: "Invalid credentials" });
  }

  res.json({
    success: true,
    role: user.role,
  });
});


app.post("/api/generate-description", async (req, res) => {
  try {
    console.log("AI REQUEST BODY:", req.body);

    const { title, category, location, date } = req.body;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are an expert event content writer. Generate a professional and attractive event description in 40-60 words.",
        },
        {
          role: "user",
          content: `Generate an event description for:
          Title: ${title}
          Category: ${category}
          Location: ${location}
          Date: ${date}`,
        },
      ],
    });

    console.log("AI RESPONSE:", completion);

    const description =
      completion.choices?.[0]?.message?.content || "";

    res.json({ description });
  } catch (err) {
    console.log("AI ERROR:", err);
    res.status(500).json({
      message: "AI description generation failed",
    });
  }
});



app.post("/api/chatbot", async (req, res) => {
  try {
    const { message } = req.body;

    const recentEvents = await Event.find()
      .sort({ date: -1 })
      .limit(5);

    const eventText = recentEvents
      .map(
        (event) =>
          `${event.title} - ${event.date} - ${event.location}`
      )
      .join("\n");

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `You are UniEvents assistant.
Recent events:
${eventText}
Answer only using these event details.`,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    res.json({
      reply: response.choices[0].message.content,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      reply: "Something went wrong ",
    });
  }
});

app.post("/api/recommend", async (req, res) => {
  try {
    const { interests } = req.body; 
    

    const events = await Event.find({});

    
    const scored = events.map((event) => {
      let score = 0;

      interests.forEach((interest) => {
        if (
          event.category?.toLowerCase().includes(interest.toLowerCase()) ||
          event.title?.toLowerCase().includes(interest.toLowerCase())
        ) {
          score += 2;
        }

        if (event.description?.toLowerCase().includes(interest.toLowerCase())) {
          score += 1;
        }
      });

      return { ...event.toObject(), score };
    });

    
    const recommended = scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    res.json(recommended);

  } catch (err) {
    res.status(500).json({ message: "Error" });
  }
});


app.get("/", (req, res) => {
  res.send("UniEvents Backend Running 🚀");
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});