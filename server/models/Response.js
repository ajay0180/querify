const mongoose = require("mongoose");

const ResponseSchema = mongoose.Schema({

    name:{
        type:String,
    },
    email:{
        type:String,
    },
    age:{
        type:String,
    },
    gender:{
        type:String,
    },
    formId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Form",
        required:true,
    },
    data:{
        type:Object,
        required:true,
    },
    commentBody:{

    },
    createdAt:{
        type:Date,
        required:true,
        default : Date.now()
    },
    completionTime:{
        type:Number,
        required:true,
    }
})

module.exports = mongoose.model("Response", ResponseSchema);