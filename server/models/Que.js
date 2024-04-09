const mongoose = require("mongoose");

const QueSchema = mongoose.Schema({

    type:{
        type:String,
        required:true,
    },
    statement:{
        type:String,
        required:true,
    },

    options:[{
        type:String,
    }],

    form:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Form"
    },
    rangeMin:{
        type:Number,
    },
    rangeMax:{
        type:Number,
    },
    matrixRows: [{
        type:String,
    }], 
    matrixColumns: [{
        type:String,
    }], 

})

module.exports = mongoose.model("Que", QueSchema);