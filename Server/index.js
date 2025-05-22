
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
    host: "smtp-relay.brevo.com", // Brevo's SMTP server
    port: 587, // Use 587 for TLS or 465 for SSL
    secure: false, // Set to `true` if using port 465
    auth: {
        user: "8da1ba001@smtp-brevo.com",  // Replace with your Brevo SMTP username
        pass: "r9YtFzDv72sV5TcZ"   // Replace with your Brevo SMTP password
    }
});




 //////////////////////////////////
app.get("/", (req, res) => {

    res.send("this is root ");

});

app.get("/getTodos", async(req,res)=>{


    console.log("get todos received");
    
        let todos = await  TodoList.find({});
    
        return res.json({todos});
        
  
})

app.post("/postTodo", async(req, res) => {
    let { title, description,sendDateTime} = req.body;

    let sendDateObj = new Date(sendDateTime);

  
    sendDateObj.setHours(sendDateObj.getHours() );
    sendDateObj.setMinutes(sendDateObj.getMinutes() );

   

    let todo1 = new TodoList({
        title: title,
        description: description,
        sendDateTime: sendDateObj,
    });

        await todo1.save();
        schedule.scheduleJob(sendDateObj, async function(){
            console.log("Sending Email Now...");
    
            let mailOptions = {
                from: 'chaudharisarthak727@gmail.com',
                to: 'sarthakchaudhari888@gmail.com',to:"prime.optimus7776@gmail.com",
                subject: `📌 Reminder: ${title}`,
                html: `
                    <h2>Hello!</h2>
                    <p>This is your scheduled reminder.</p>
                    <p><strong>Task:</strong> ${description}</p>
                    <p><strong>Scheduled Time:</strong> ${sendDateObj.toLocaleString()}</p>
                    <hr/>
                    <p style="font-size: 12px; color: gray;">Sent via Sarthak Web App</p>
                `
            };
    
            try {
                await transporter.sendMail(mailOptions);
                console.log("Email sent successfully ");
            } catch (error) {
                console.error('Error sending email:', error);
            }
        });
    

        return res.json({ status: true })
    
   

})


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

 
