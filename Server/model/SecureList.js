const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const Secure_ListSchema = new Schema({
    Description: {
        type: String
    },
    Type: {
        type: String
    },
    Date: {
        type: Date,
        default: Date.now
    },

})

const SecureList = mongoose.model("SecureList", Secure_ListSchema)
module.exports = SecureList;