
const mongoose= require("mongoose");

const Schema = mongoose.Schema;

const TodoListSchema = new Schema({
    title: {
        type: String,

    },
   description: {
        type: String,
    },

        sendDateTime: { 
            type: Date, // A single field to store both date and time for sending email
            
        },
    time:{
        type:Date,
        default:Date.now
    },
    date: {
        type: Date,
        default: Date.now
    },
    MarkDone:{
        type:Boolean,
        default:false
    }
  

});

const TodoList = mongoose.model("TodoList", TodoListSchema);
module.exports = TodoList;