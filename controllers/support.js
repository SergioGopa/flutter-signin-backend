const { response } = require("express");
const SupportMessage = require("../models/supportMessage");

const sendSupportMessage = async (req, res = response) =>{
    try {
        const { subject, message } = req.body;
        const userId = req.uid;

        const newMessage = new SupportMessage({
            user: userId,
            subject,
            message,
            createdAt: new Date()
        });

        await newMessage.save();

        res.json({ok:true, msg: "Support message saved succesfully"});
    } catch (error) {
        res.status(500).json({ok:false, msg: "Talk to the admin"});
    }
};

module.exports = {sendSupportMessage};