
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
await mongoose.connect(MongoURL)
}

const TWILIO_SID = "ACa8060e775e5849df318ba6190af8d6b5"; // your Twilio Account SID
const TWILIO_AUTH_TOKEN = "8798d2b5c4f4df1d01bd30e63094333b"; // your Twilio Auth Token
const TWILIO_WHATSAPP_FROM = "whatsapp:+14155238886"; // your Twilio WhatsApp number

const twilioClient = twilio(TWILIO_SID, TWILIO_AUTH_TOKEN);
// Function to send WhatsApp message via Twilio
function sendWhatsAppMessage(to, message) {
  return twilioClient.messages.create({
    from: TWILIO_WHATSAPP_FROM,
    to: `whatsapp:${to}`,
    body: message,
  });
}

// const accountSid = 'ACa8060e775e5849df318ba6190af8d6b5';
// const authToken = '8798d2b5c4f4df1d01bd30e63094333b';
// const client = require('twilio')(accountSid, authToken);

// client.messages
//     .create({
//         body: 'Your appointment is coming up on July 21 at 3PM',
//         from: 'whatsapp:+14155238886',
//         to: 'whatsapp:+917776883510'
//     })
//     .then(message => console.log(message.sid))
//     .done();



 //////////////////////////////////
app.get("/", (req, res) => {

    res.send("this is root ");

});

app.get("/getTodos", async(req,res)=>{


    console.log("get todos received");
    
        let todos = await  TodoList.find({});
    
        return res.json({todos});
        
  
})


app.post("/postTodo", async (req, res) => {
  let { title, description, sendDateTime } = req.body;

  let sendDateObj = new Date(sendDateTime);
  sendDateObj.setHours(sendDateObj.getHours());
  sendDateObj.setMinutes(sendDateObj.getMinutes());

  let todo1 = new TodoList({
    title: title,
    description: description,
    sendDateTime: sendDateObj,
  });

  await todo1.save();

  schedule.scheduleJob(sendDateObj, async function () {
    console.log("Sending WhatsApp message now...");

   let whatsappNumber = "+917776883510";


    if (whatsappNumber) {
      try {
        const whatsappMessage = `Reminder: ${title}\nTask: ${description}\nScheduled Time: ${sendDateObj.toLocaleString()}`;
        await sendWhatsAppMessage(whatsappNumber, whatsappMessage);
        console.log("WhatsApp message sent successfully");
      } catch (error) {
        console.error("Error sending WhatsApp message:", error);
      }
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

 
