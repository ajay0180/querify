const mongoose = require("mongoose");

const FormSchema = mongoose.Schema({

    title:{ 
        type:String,
        required:true,
    },
    views:{
        type:Number,
        required:true,
        default:0,
    },
    category:{
        type:String,
        enum:["governmentSurvey","healthcareSurvey","eventSurvey","feedbackSurvey","diversity","covid-19","others"]
    },
    logoUrl:{
        type:String,

    },

    spreadsheetUrl:{
        type:String,
    },
    admin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    data:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Que",
        required:true,
    }],

    responses:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Response",
    }],

    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment",
    }],

    createdAt:{
        type:Date,
        required:true,
        default:Date.now(),
    },

    startAt:{
        type:Date,
        required:true,
        default:Date.now(),
    },
    expireAt:{
        type:Date,
        required:true,
        default:Date.now() + 2592000,
    },
    visualData:{
        type:Object,
        required:true,
    },
    participantCount:{
        type:Number,
        required:true,
        default:Infinity,
    }


})

module.exports = mongoose.model("Form", FormSchema);