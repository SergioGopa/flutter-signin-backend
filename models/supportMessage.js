const { Schema, model } = require("mongoose");

const SupportMessageSchema = Schema({
    user: {type: Schema.Types.ObjectId, ref: "User", required: true},
    subject: {type: String, required: true},
    message: {type: String, required:true},
    createdAt: {type:Date, default: Date.now},
});

module.exports = model("SupportMessage", SupportMessageSchema);