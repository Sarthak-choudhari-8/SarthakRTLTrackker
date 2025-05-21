
const mongoose= require("mongoose");

const Schema = mongoose.Schema;

const PasswordSchema = new Schema ({

    TransactionPass:{
        type:String,
    },
    SecurePass:{
        type:String
    },

});

const Password = mongoose.model("Password", PasswordSchema);
module.exports = Password