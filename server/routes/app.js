const express = require("express");
const router = express.Router();
const Form = require("../models/User");

// import controllers
const {changePassword,sendOtp,login,signup, getUser} = require("../controllers/Auth");
const {createForm, getAllForms, getForm, deleteForm, updateSpreadsheet} = require("../controllers/Form");
const {getAllTemplates, getTemplate} = require("../controllers/Template");
const {resetPasswordToken, resetPassword} = require("../controllers/ResetPassword");
const {createResponse, getAllResponse} = require("../controllers/Response")

//import middlewares
const {auth,isAdmin,isFormFiller} = require("../middlewares/auth");



// authorisation
router.post("/sendOtp",sendOtp);                            // verified
router.post("/signup",signup); 

router.post("/login", login);
router.post("/resetPasswordToken",resetPasswordToken);
router.post("/resetPassword", resetPassword);

router.get("/getUser",auth,getUser);

// others
router.get("/getAllForms",auth, isAdmin,getAllForms);

router.get("/getAllTemplates",auth,isAdmin,getAllTemplates);
router.post("/getTemplate", auth,isAdmin,getTemplate);

router.post("/getForm",getForm)

// TODO: getForm api pending
router.post("/createForm", auth,isAdmin,createForm);
router.post("/deleteForm",auth,isAdmin, deleteForm);

router.post("/createResponse", createResponse);
router.post("/getAllResponse",auth,isAdmin, getAllResponse);

router.post("/updateSpreadsheet", auth,isAdmin, updateSpreadsheet);


// router.post("/latestForm", auth,isAdmin,getLatestForm);
// router.get("/latestForm", (req,res)=> res.send("good"));



module.exports = router;
