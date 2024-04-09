const mongoose = require("mongoose");

const TemplateSchema = mongoose.Schema({

    title:{
        type:String,
        required:true,
        trim:true,
    },
    description:{
        type:String,
        required:true,
        trim:true,
    },
    thumbnail:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
        trim:true,
        enum:["government","healthcare","educational", "customer","diversity","covid-19","market"]
    },
    estimatedTime:{
        type:String,
        required:true,
    },
    data:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Que",
    }],
    createdAt:{
        type:Date,
        required:true,
        default:Date.now()
    },
    
})

module.exports = mongoose.model("Template", TemplateSchema);