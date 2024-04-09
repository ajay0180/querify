const Form  = require("../models/Form");
const User  = require("../models/User");
const Que  = require("../models/Que");
const Comment  = require("../models/Comment");
const Response  = require("../models/Response");
const {imageUploader} = require("../utils/imageUploader");
const mongoose = require("mongoose");
const { ObjectId } = require('mongodb');
const {storage} = require("../config/firebase");
const {ref, uploadBytes, getDownloadURL} = require("firebase/storage");
// create a form

exports.createForm = async(req,res)=>{

    try{
        // fetch data from req

        const  formDataString = req.body.data;

        const formDatObject = JSON.parse(formDataString);

        const {title , quesData, expireAt, startAt, participantCount, visualData} = formDatObject;

        const userDet = req.user;




        console.log("req body is --------------------------------------------------------------" ,req.body);

         // validation   
        if(!title ||  !quesData || !expireAt || !startAt || !participantCount || !visualData || !userDet ){
            
            console.log(!title && "title");
            console.log(!quesData && "quesData");
            console.log(!expireAt && "expireAt");
            console.log(!startAt && "startAt");
            console.log(!participantCount && "participantCount");
            console.log(!visualData && "visualData");
            console.log(!userDet && "userDet");
  
            return res.status(400).json({
                success:false,
                message:"Please fill all the fields",
            })
        }

        // upload logo to cloudinary
        // const uploadedLogo = await imageUploader(logo,process.env.LOGO_FOLDER);

//         const storageRef = ref(storage, `Logos/${logo.name}`);
// s
//         console.log("logo name " ,logo.name);

//         const path = logo.name.split(".");

//         const ext = path[path.length-1];

//         console.log("file is --------> "  ,logo);

//         await uploadBytes(storageRef, logo, {contentType: `image/${ext}`});

//         const url = await getDownloadURL(storageRef);

//         console.log("Download URL:", url);

        // create docs for questions in  the Que collection
       
        const quesDocs  = await Que.insertMany(quesData);
        
      
        const quesIds = quesDocs.map((que) => que._id);           // get Ids of Ques created in the Form

       
        const formCreated = await Form.create({title,  admin:userDet.id, data:quesIds, expireAt, startAt, participantCount, visualData})         // create Form entry 


        var userUpdated = await User.findByIdAndUpdate(userDet.id, {$push:{forms:formCreated._id}}, {new:true});    // update the admin User's doc in its collection

        
        let level = Math.floor(userUpdated.forms.length / 5) ;          // update the level of the user       // 5 forms to jump up a level and max 10 levels are there
        
        if(level >= 10) level = 10;

        userUpdated = await User.findByIdAndUpdate(userDet.id, {level}, {new:true});


        // send resposne
        res.status(200).json({
            success:true,
            message:"Form createed succesfully",
            data1:formCreated,
            data2: userUpdated
        })
        
    }
    catch(err){
        console.log("error",err);

        return res.status(400).json({
            success:false,
            message:"Couldn't create the Form",
            data:err.message,
        })
    }
}

// get all forms for the user
exports.getAllForms = async(req,res)=>{
    try{
        console.log("getting all forms");
        // fetch data
        const userDet = req.user;           // will be put by auth middleware


        // validation
        if(!userDet){
            return res.status(400).json({
                success:false,
                message:"User detials not present"
            })
        }

        const userDoc = await User.findOne({email:userDet.email});

        // get all forms created by this user from the db

        const forms = await Form.find({admin:userDet.id});

        

        return res.status(200).json({
            
            success:true,
            message:"Forms fetched succesfully",
            data:forms,
        })

    }
    catch(err){
        console.log("error",err);

        return res.status(400).json({
            success:false,
            message:"Something went wrong while fetching the forms",
            data:err.message,
        })
    }
}

// getForm api pending
exports.getForm = async (req,res)=>{
    try{    

        const {formId,viewInc} = req.body;
        console.log(req.body);

        console.log(formId);

        if(!formId){
            return res.status(400).json({
                success:false,
                message:"FormId not present"
            })
        }

        var form;

        if(viewInc){
            form = await Form.findByIdAndUpdate(formId,{ $inc:{views:1}}, {new:true}).populate("admin").populate("data");
        }
        {
            form =  await Form.findById(formId).populate("admin").populate("data");
        }


        res.status(200).json({
            success:true,
            data:form,
            message:'form fetched succefully'
        })
        
    }   

    catch(err){
        console.log(err);

        res.status(400).json({
            success:false,
            message:"something went wrong while fetching form"
        })
    }
}


// delete form
exports.deleteForm = async (req,res)=>{
    var deletedDocs =[];            // to keep track of what docs are successfully deleted
    try{
        const {formId} = req.body;
        const userDet = req.user;
        console.log("user det" ,userDet);

        //validation
        if(!formId){
            return res.status(400).json({
                success:false,
                message:"formId not provided"
            })
        }

        
        // delete Que docs of the form
        const deltedQues = await Que.deleteMany({form:formId})
        console.log("del ques", deltedQues);
        deletedDocs.push("ques");

        // delete Responses of the form
        const deltedResponses= await Response.deleteMany({formId:formId})
        console.log("del resp", deltedResponses);
        deletedDocs.push("responses");

        // update the Admin of the form
        var upatedUser = await User.findByIdAndUpdate(userDet.id, {$pull:{forms:formId}})
        deletedDocs.push("user");

        let level = Math.floor(upatedUser.forms.length / 5) ;          // update the level of the user       // 5 forms to jump up a level and max 10 levels are there
        
        if(level >= 10) level = 10;

        upatedUser = await User.findByIdAndUpdate(userDet.id, {level}, {new:true});

        // delete the form
        const deletedForm = await Form.findByIdAndDelete(formId);
        deletedDocs.push("form");

        // fetch remaining forms for the user
        const remainingForms = await Form.find({admin:userDet.id})

        console.log(deletedDocs);

        return res.status(200).json({
            success:true,
            message:"Form deleted succesfully",
            data:remainingForms,
        })

    }
    catch(err){
        console.log("error",err);
        return res.status(400).json({
            success:false,
            message:"Something went wrong while deleting the form",
            data:deletedDocs,
        })
    }
}


exports.getLatestForm = async(req,res)=>{

    try{

        const userDet = req.user;

        const latestForm = await Form.findOne({admin: userDet.id}).sort({ createdAt: -1 }).exec();

        return res.status(200).json({
            success:true,
            message:"latest form fetched succesfuly",
            data:latestForm,
        })


    }

    catch(err){
        console.log(err);
        return res.status(400).json({
            success:false,
            message:"couldn't fetch L-Form"
        })
    }
}

exports.updateSpreadsheet = async(req,res)=>{

    try{

        const {spUrl, formId} = req.body;

        if(!spUrl){
            console.log("spreadsheet url is missing ");
            return res.status(400).json({
                
                success:false,
                message:'url is missing'
            })
        }

        const userDet = req.user;

        const updatedForm = await Form.findByIdAndUpdate(formId, {spreadsheetUrl:spUrl} , {new :true});

        return res.status(200).json({
            success:true,
            message:"spreadsheet url updated successfully",
            data:updatedForm,
        })

    }
    catch(err){
        console.log(err);

        res.status(400).json({
            success:false,
            message:"couldn't update the spreadsheet url"
        })
    }
}
