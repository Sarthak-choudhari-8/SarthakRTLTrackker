require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const webpush = require("web-push");

const app = express();

const {
  TodoList,
  Finance,
  FinanceList,
  SecureList,
  Password,
} = require("./model"); // Assuming you export all models from a single file for cleaner imports

// Database URLs (Prefer environment variables for both)
const DBURL = "mongodb+srv://sarthakchaudhari888:7a591DYYLVC1W5tk@cluster0.klwxsr3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

app.use(cors({ origin: "*" }));
app.use(express.json());

// Connect to MongoDB with error handling
async function main() {
  try {
    await mongoose.connect(DBURL);
    console.log("Connected to DB");
  } catch (error) {
    console.error("DB connection error:", error);
  }
}
main();

// VAPID keys for web-push notifications - Keep these in .env in production
const publicVapidKey =

  "BIrT1X8Ea7Vds-D7n8sWQd9OFlHLK7jHPE61j5sn3uGAnAU4k_IcMtGDttOPvZhSAVb7VOYXwkCPKTcImj3TZO4";
const privateVapidKey =

  "Jd7gqvI-spb5wFyOnF1t9ozYv8tH-ORvgMV0QHBeFsQ";

webpush.setVapidDetails(
  "mailto:sarthakchaudhari888@example.com",
  publicVapidKey,
  privateVapidKey
);

// Ideally store subscriptions in DB collection, not in-memory
const Subscription = require("./model/Subscription"); // Create a Mongoose model for subscriptions

// Routes

app.get("/", (req, res) => {
  res.send("This is root");
});

// --- Todos ---

app.get("/getTodos", async (req, res) => {
  try {
    const todos = await TodoList.find({});
    res.json({ todos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});

app.post("/postTodo", async (req, res) => {
  try {
    const { title, description, sendDateTime } = req.body;
    const sendDateObj = new Date(sendDateTime);

    const todo = new TodoList({
      title,
      description,
      sendDateTime: sendDateObj,
    });

    await todo.save();

    res.json({ status: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, error: "Failed to save todo" });
  }
});

app.post("/deleteTodo", async (req, res) => {
  try {
    const { id } = req.body;
    await TodoList.findByIdAndDelete(id);
    res.json({ status: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, error: "Failed to delete todo" });
  }
});

app.post("/markDoneTodo", async (req, res) => {
  try {
    const { id, doneVal } = req.body;
    await TodoList.findByIdAndUpdate(id, { MarkDone: !doneVal }, { new: true });
    res.json({ status: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, error: "Failed to update todo" });
  }
});

// --- Password ---

app.get("/getPassword", async (req, res) => {
  try {
    const pass = await Password.findById("682d6e0c2dbd0e9dbf59553a");
    res.json({ pass });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get password" });
  }
});

// --- Finance ---

app.get("/getBalance", async (req, res) => {
  try {
    const BalanceDB = await Finance.find({});
    res.json({ BalanceDB });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get balance" });
  }
});

app.post("/setBalance", async (req, res) => {
  try {
    const { NetCash, NetOnline, ExtraaCash, ExtraaOnline, _id } = req.body.formValues;

    const total = NetCash + NetOnline + ExtraaCash + ExtraaOnline;

    await Finance.findByIdAndUpdate(_id, {
      NetCash,
      NetOnline,
      ExtraaCash,
      ExtraaOnline,
      TotalAmount: total,
    });

    res.json({ status: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, error: "Failed to update balance" });
  }
});

app.post("/setFinanceList", async (req, res) => {
  try {
    const { amt, des, type } = req.body;

    const obj = new FinanceList({
      Spend: type === "spend",
      Topay: type === "topay",
      Collect: type === "collect",
      Description: des,
      Amount: amt,
    });

    await obj.save();
    res.json({ status: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, error: "Failed to add finance list item" });
  }
});

app.get("/getFinanceList", async (req, res) => {
  try {
    const lists = await FinanceList.find({});
    res.json({ lists });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get finance list" });
  }
});

app.post("/deleteFinanceList", async (req, res) => {
  try {
    const { id } = req.body;
    await FinanceList.findByIdAndDelete(id);
    res.json({ status: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, error: "Failed to delete finance list item" });
  }
});

// --- Secure List ---

app.get("/getSecureList", async (req, res) => {
  try {
    const lists = await SecureList.find({});
    res.json({ lists });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get secure list" });
  }
});

app.post("/setSecureList", async (req, res) => {
  try {
    const { type, description } = req.body.formData;
    const obj = new SecureList({ Type: type, Description: description });
    await obj.save();
    res.json({ status: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, error: "Failed to add secure list item" });
  }
});

app.post("/deleteSecureList", async (req, res) => {
  try {
    const { id } = req.body;
    await SecureList.findByIdAndDelete(id);
    res.json({ status: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, error: "Failed to delete secure list item" });
  }
});

// --- Push Subscription Endpoints ---

// Save subscription to MongoDB instead of memory
app.post("/subscribe", async (req, res) => {
  try {
    const subscription = req.body;

    // Check if subscription already exists
    const existing = await Subscription.findOne({ endpoint: subscription.endpoint });
    if (!existing) {
      const newSub = new Subscription(subscription);
      await newSub.save();
    }

    res.status(201).json({ message: "Subscription saved" });
  } catch (error) {
    console.error("Error saving subscription:", error);
    res.status(500).json({ error: "Failed to save subscription" });
  }
});

// Trigger notifications to all saved subscriptions
app.post("/sendNotification", async (req, res) => {
  const { title, message } = req.body;
  const payload = JSON.stringify({
    title: title || "Notification",
    message: message || "You have a new notification!",
  });

  try {
    const subscriptions = await Subscription.find({});

    const sendNotifications = subscriptions.map((sub) =>
      webpush.sendNotification(sub, payload).catch(async (err) => {
        if (err.statusCode === 410 || err.statusCode === 404) {
          // Remove invalid subscription
          await Subscription.deleteOne({ _id: sub._id });
        } else {
          console.error("Push error:", err);
        }
      })
    );

    await Promise.all(sendNotifications);
    res.json({ success: true });
  } catch (err) {
    console.error("Error sending notifications", err);
    res.status(500).json({ error: "Failed to send notifications" });
  }
});

// ------------------------------------------------------------

app.listen(3000, () => {
  console.log(`Server listening on port ${PORT}`);
});
