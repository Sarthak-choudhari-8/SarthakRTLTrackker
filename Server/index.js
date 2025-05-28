
 require("dotenv").config();

const express =  require("express");
const cors =  require("cors");
const app =  express();
const mongoose = require("mongoose");
const path = require("path");
const MongoURL = "mongodb://127.0.0.1:27017/TODO-MEGA";
const DBURL = process.env.ATLAS_URL;

const cron = require("node-cron");
const nodemailer = require("nodemailer");
const schedule = require('node-schedule');
const twilio = require("twilio");

const TodoList =  require("./model/TodoList");
const Finance =  require("./model/Finance_Balance");
const FinanceList = require("./model/Finance_List");
const SecureList = require("./model/SecureList");
const Password =require("./model/Password");

// your routes...


app.use(cors({ origin: "*" }));

app.use(express.json());

// app.use(cors(corsOption));

main().then(() => {
    console.log("connected to DB");
})
    .catch((e) => {
        console.log(e);
    })

async function main() {
await mongoose.connect(DBURL)
}


const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: "8da1ba001@smtp-brevo.com",
    pass: r9YtFzDv72sV5TcZ,
  },
});

function sendEmail(to, subject, text) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  return transporter.sendMail(mailOptions);
}

 //////////////////////////////////
app.get("/", (req, res) => {

    res.send("this is root ");

});

app.get("/getTodos", async(req,res)=>{


    
        let todos = await  TodoList.find({});
    
        return res.json({todos});
        
  
})

app.post("/postTodo", async (req, res) => {
  let { title, description, sendDateTime } = req.body;

  let sendDateObj = new Date(sendDateTime);
  sendDateObj.setHours(sendDateObj.getHours());
  sendDateObj.setMinutes(sendDateObj.getMinutes());

  let todo1 = new TodoList({
    title,
    description,
    sendDateTime: sendDateObj,
  });

  await todo1.save();

  let emailAddress = "prime.optimus7776@gmail.com"; // Static or from frontend

  schedule.scheduleJob(sendDateObj, async function () {
    const message = `Reminder:\nTitle: ${title}\nTask: ${description}\nTime: ${sendDateObj.toLocaleString()}`;
    console.log("🔔 Sending reminders for:", sendDateObj);

    // Send WhatsApp
  
    // Send Email
    try {
      await sendEmail(emailAddress, "To-Do Reminder", message);
      console.log("✅ Email sent");
    } catch (err) {
      console.error("❌ Email error:", err.message);
    }
  });

  return res.json({ status: true });
});


app.post("/deleteTodo",async (req,res)=>{

    let {id} =  req.body;
    await TodoList.findByIdAndDelete(id);

    return res.json({ status: true })
})




app.post("/markDoneTodo",async (req,res)=>{
    let {id,doneVal} =  req.body;


    await TodoList.findByIdAndUpdate(id, {MarkDone: !doneVal },{new:true});

    return res.json({ status: true })})


app.get("/getPassword", async (req,res)=>{
        let pass = await Password.findById('682d6e0c2dbd0e9dbf59553a');

        return res.json({pass});

});

app.get("/getBalance", async(req,res) =>{


        let BalanceDB = await  Finance.find({});
        return res.json({BalanceDB});
        
    })

app.post("/setBalance",async (req,res)=>{

let { NetCash, NetOnline, ExtraaCash,ExtraaOnline , _id} = req.body.formValues;


let total =  NetCash + NetOnline +  ExtraaCash + ExtraaOnline;

await Finance.findByIdAndUpdate(_id , {
      NetCash : NetCash, NetOnline :NetOnline, ExtraaCash :ExtraaCash ,ExtraaOnline :ExtraaOnline,TotalAmount :total
})

return res.json({ status: true })
}
)


app.post("/setFinanceList",async (req,res)=>{


    let {amt , des , type} = req.body;
let topay = false, spend = false , collect = false;

     if(type == "spend"){
    spend = true;
    }

    if(type == "collect"){
        collect = true;
    }

     if(type == "topay"){
        topay = true;
    }

const obj1 = new FinanceList({
    Spend : spend,
    Topay : topay,
    Collect :collect,
    Description : des,
    Amount :amt,
})


await obj1.save();


return res.json({ status: true });

});

app.get("/getFinanceList", async (req,res)=>{

    let lists = await FinanceList.find({});

    return res.json({lists});

})

app.post("/deleteFinanceList",async (req,res)=>{



    let {id} =  req.body;

    await FinanceList.findByIdAndDelete(id);

    return res.json({ status: true })

})

app.get("/getSecureList",async (req,res)=>{

    let lists = await SecureList.find({});

    return res.json({lists});

});

app.post("/setSecureList",async (req,res)=>{
let {type , description}= req.body.formData;

let obj1 = new SecureList({

    Type: type,
    Description: description
});

await obj1.save();

return res.json({ status: true });

});


app.post("/deleteSecureList",async (req,res)=>{



    let {id} =  req.body;

    await SecureList.findByIdAndDelete(id);


    return res.json({ status: true })

})
//  ------------------------------------------------------------

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});

 
