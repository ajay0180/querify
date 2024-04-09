const Template = require("../models/Template");

exports.getAllTemplates = async (req,res)=>{

    try{    
        console.log("Providing all temps");
        const templates = await Template.find();

        return res.status(200).json({
            success:true,
            message:"succesfully fetched templates",
            data:templates
        })
    }
    catch(err){
        console.log("error",err);
        return res.status(400).json({
            success:false,
            data:err.message,
            message:"something went wrong while fetching templates"
        })
    }
}

exports.getTemplate = async (req,res)=>{

    try{

        const {id} = req.body;

        if(!id){
            console.log("template id not sent in req");
            return res.status(400).json({
                success:false,
                message:"template id not present"
            })
        }


        const template = await Template.findById(id).populate("data").exec();

        return res.status(200).json({
            success:true,
            message:"data fetched succesfully",
            data:template,
        })

    }

    catch(err){
        console.log(err);

        return res.status(400).json({
            success:false,
            message:"unable to fetch data",
        })
    }
}