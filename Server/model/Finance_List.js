const mongoose= require("mongoose");

const Schema = mongoose.Schema;

const Finance_ListSchema = new Schema({

    Date: {
        type: Date,
        default: Date.now
    },
    Amount:{
        type:Number,
    },
    Description:{
        type:String
    },
    Topay:{
        type:Boolean,
        default:false
    },
    Spend:{
        type:Boolean,
        default:false
    },
    Collect:{
        type:Boolean,
        default:false
    }


})

const FinanceList = mongoose.model("FinanceList", Finance_ListSchema)
module.exports = FinanceList;