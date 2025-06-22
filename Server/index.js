require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const PORT = 3000;

const TodoList = require("./model/TodoList");
const Finance = require("./model/Finance_Balance");
const FinanceList = require("./model/Finance_List");
const SecureList = require("./model/SecureList");
const Password = require("./model/Password");

const nodemailer = require("nodemailer");
const schedule = require('node-schedule');

const DBURL = "mongodb+srv://sarthakchaudhari888:7a591DYYLVC1W5tk@cluster0.klwxsr3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

app.use(cors({ origin: "*" }));
app.use(express.json());


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

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com", // Brevo's SMTP server
    port: 587, // Use 587 for TLS or 465 for SSL
    secure: false, // Set to true if using port 465
    auth: {
        user: "8da1ba001@smtp-brevo.com",  // Replace with your Brevo SMTP username
        pass: "r9YtFzDv72sV5TcZ"   // Replace with your Brevo SMTP password
    }
});


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


       let { title, description,sendDateTime} = req.body;

    let sendDateObj = new Date(sendDateTime);

  
    sendDateObj.setHours(sendDateObj.getHours() + 5 );
    sendDateObj.setMinutes(sendDateObj.getMinutes() + 30 );

   

    let todo1 = new TodoList({
        title: title,
        description: description,
        sendDateTime: sendDateObj,
    });

        await todo1.save();





console.log(sendDateObj);

        schedule.scheduleJob(sendDateObj, async function(){
            console.log("Sending Email Now...");
    
           let mailOptions = {
    from: 'chaudharisarthak727@gmail.com',
    to: 'sarthakchaudhari888@gmail.com',
    subject: `📌 Reminder: ${title}`,
  html: `
  <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 8px; border: 1px solid #ddd;">
      <h2 style="color: #333;">🔔 Reminder Notification</h2>

      <p>Hi there,</p>

      <p>This is a gentle reminder about your upcoming task. Here's the information:</p>

      <p><strong>📌 Task:</strong> ${description}</p>
      <p><strong>🗓️ Scheduled Time:</strong> ${sendDateObj.toLocaleString()}</p>

      <p>Make sure to complete it on time to stay on track. You've got this!</p>

      <hr style="margin: 30px 0; border: none; border-top: 1px solid #ccc;" />

      <p style="font-size: 12px; color: #777;">
        Sent automatically by <strong>RTL Tracker App</strong> to help you manage your tasks better.  
        <br/>
        Stay productive! ✨
        <br/>
        — Sarthak
      </p>
    </div>
  </div>
`
};
            try {
                await transporter.sendMail(mailOptions);
                console.log("Email sent successfully ");
            } catch (error) {
                console.error('Error sending email:', error);
            }
        });
    
  

    res.json({ status: true });
  
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





app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
