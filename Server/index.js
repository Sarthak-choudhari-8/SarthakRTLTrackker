require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const webpush = require("web-push");
const path = require("path");
const cron = require('node-cron');

const app = express();
const PORT = 3000;

const TodoList = require("./model/TodoList");
const Finance = require("./model/Finance_Balance");
const FinanceList = require("./model/Finance_List");
const SecureList = require("./model/SecureList");
const Password = require("./model/Password");

const DBURL = "mongodb+srv://sarthakchaudhari888:7a591DYYLVC1W5tk@cluster0.klwxsr3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

app.use(cors({ origin: "*" }));
app.use(express.json());

let subscriptions = []; // global array to store push subscriptions

// Connect to MongoDB
async function main() {
  try {
    await mongoose.connect(DBURL);
    console.log("Connected to DB");
  } catch (error) {
    console.error("DB connection error:", error);
  }
}
main();

// VAPID Keys
const publicVapidKey = "BIrT1X8Ea7Vds-D7n8sWQd9OFlHLK7jHPE61j5sn3uGAnAU4k_IcMtGDttOPvZhSAVb7VOYXwkCPKTcImj3TZO4";
const privateVapidKey = "Jd7gqvI-spb5wFyOnF1t9ozYv8tH-ORvgMV0QHBeFsQ";

webpush.setVapidDetails(
  "mailto:sarthakchaudhari888@gmail.com",
  publicVapidKey,
  privateVapidKey
);

// Root Route
app.get("/", (req, res) => {
  res.send("This is root");
});

// Todo APIs
app.get("/getTodos", async (req, res) => {
  try {
    const todos = await TodoList.find({});
    res.json({ todos });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});

app.post("/postTodo", async (req, res) => {
  try {
    const { title, description, sendDateTime } = req.body;
    const todo = new TodoList({ title, description, sendDateTime: new Date(sendDateTime) });
    await todo.save();
    res.json({ status: true });
  } catch (error) {
    res.status(500).json({ status: false, error: "Failed to save todo" });
  }
});

app.post("/deleteTodo", async (req, res) => {
  try {
    const { id } = req.body;
    await TodoList.findByIdAndDelete(id);
    res.json({ status: true });
  } catch (error) {
    res.status(500).json({ status: false, error: "Failed to delete todo" });
  }
});

app.post("/markDoneTodo", async (req, res) => {
  try {
    const { id, doneVal } = req.body;
    await TodoList.findByIdAndUpdate(id, { MarkDone: !doneVal });
    res.json({ status: true });
  } catch (error) {
    res.status(500).json({ status: false, error: "Failed to update todo" });
  }
});

// Password
app.get("/getPassword", async (req, res) => {
  try {
    const pass = await Password.findById("682d6e0c2dbd0e9dbf59553a");
    res.json({ pass });
  } catch (error) {
    res.status(500).json({ error: "Failed to get password" });
  }
});

// Finance
app.get("/getBalance", async (req, res) => {
  try {
    const BalanceDB = await Finance.find({});
    res.json({ BalanceDB });
  } catch (error) {
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
    res.status(500).json({ status: false, error: "Failed to add finance list item" });
  }
});

app.get("/getFinanceList", async (req, res) => {
  try {
    const lists = await FinanceList.find({});
    res.json({ lists });
  } catch (error) {
    res.status(500).json({ error: "Failed to get finance list" });
  }
});

app.post("/deleteFinanceList", async (req, res) => {
  try {
    const { id } = req.body;
    await FinanceList.findByIdAndDelete(id);
    res.json({ status: true });
  } catch (error) {
    res.status(500).json({ status: false, error: "Failed to delete finance list item" });
  }
});

// Secure List
app.get("/getSecureList", async (req, res) => {
  try {
    const lists = await SecureList.find({});
    res.json({ lists });
  } catch (error) {
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
    res.status(500).json({ status: false, error: "Failed to add secure list item" });
  }
});

app.post("/deleteSecureList", async (req, res) => {
  try {
    const { id } = req.body;
    await SecureList.findByIdAndDelete(id);
    res.json({ status: true });
  } catch (error) {
    res.status(500).json({ status: false, error: "Failed to delete secure list item" });
  }
});

// Push Notification Endpoints
app.post('/save-subscription', (req, res) => {
  const subscription = req.body;
  subscriptions.push(subscription);
  res.status(201).json({});
});

app.post('/sendNotification', async (req, res) => {
  const { title, message } = req.body;
  const payload = JSON.stringify({ title, message });

  try {
    const results = subscriptions.map(sub =>
      webpush.sendNotification(sub, payload).catch(err => {
        if (err.statusCode === 410 || err.statusCode === 404) {
          subscriptions = subscriptions.filter(s => s !== sub);
        }
      })
    );

    await Promise.all(results);
    res.json({ success: true });
  } catch (err) {
    console.error("Error sending notifications", err);
    res.status(500).json({ error: "Failed to send notifications" });
  }
});

// --- CRON JOB to Send Notifications Every Minute ---
cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();
    const start = new Date(now.setSeconds(0, 0));
    const end = new Date(start.getTime() + 60000); // +1 minute

    const todosToNotify = await TodoList.find({
      sendDateTime: { $gte: start, $lt: end }
    });

    todosToNotify.forEach(todo => {
      const payload = JSON.stringify({
        title: "📝 Todo Reminder",
        message: `${todo.title} - ${todo.description}`
      });

      subscriptions.forEach(sub => {
        webpush.sendNotification(sub, payload).catch(err => {
          if (err.statusCode === 410 || err.statusCode === 404) {
            subscriptions = subscriptions.filter(s => s !== sub);
          }
        });
      });

      console.log(`📨 Notification sent for: ${todo.title}`);
    });
  } catch (error) {
    console.error("❌ Error in cron job:", error);
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
