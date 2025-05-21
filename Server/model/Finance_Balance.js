const mongoose= require("mongoose");

const Schema = mongoose.Schema;

const financeSchema = new Schema ({

    NetCash:{
        type:Number,
        default:0
    },
    NetOnline:{
        type:Number,
        default:0
    },
    ExtraaCash:{
        type:Number,
        default:0
    },
    ExtraaOnline:{
        type:Number,
        default:0
    },
    TotalAmount:{
        type:Number,
        default:0
    }


})

const Finance = mongoose.model("Finance", financeSchema)
module.exports = Finance