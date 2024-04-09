const Response = require("../models/Response");
const Form = require("../models/Form");
const mailSender = require("../utils/mailSender")
// create a response
exports.createResponse = async(req,res)=>{
    try{

        const {name, email, age, gender, formId, data,commentBody,completionTime} = req.body;

        console.log("body------------- " ,req.body);
        
        if(!formId || !data || !completionTime){
            return res.status(401).json({
                success:false,
                message:"Please provide the required data"
            })
        }   

        var createdResponse;

        if(name && email && age && gender && commentBody){
            createdResponse = await Response.create({name, email, age, gender, formId, data,commentBody,completionTime})
        }
        else{
            createdResponse = await Response.create({formId, data,completionTime})                     // for anonymous form filler case
        }

        const updatedForm = await Form.findByIdAndUpdate(formId, {$push:{responses:createdResponse._id}}, {new:true});

        if(email){
            try{
                const emailResponse = await mailSender(email, "Querify Response succesfully submitted",
            
                    `Your response has been successfully registered. Thanks for your time and patience. Stay tuned for more such interesting surveys`
      
                    
                    );
                console.log("response email sent successfully")
            } 
            catch(err){
                console.log(err);
            }
        }     
        return res.status(200).json({
            success:true,
            message:"Response created succesfully",
            data:createdResponse,
        })

        
    }
    catch(err){
        console.log("error",err);
        return res.status(400).json({
            success:false,
            data:err.message,
            message:"Something went wrong while creating response. Please try again"
        })
    }
}

// get all resposnes 
exports.getAllResponse = async(req,res)=>{
    try{

        console.log("trying to get all responses");
        const {formId} = req.body;

        if(!formId){
            return res.status(401).json({
                success:false,
                message:"FormId not provided"
            })
        }

        console.log(formId)
        const responses = await Response.find({formId:formId}).populate("formId").exec();

        console.log("responses" ,responses)
        return res.status(200).json({
            success:true,
            data:responses,
            message:"Responses fetched succesfully",
        })
    }
    catch(err){
        console.log("error" ,err);
        return res.status(400).json({
            success:false,
            message:"Something went wrong while fetching the responses"
        })
    }
}