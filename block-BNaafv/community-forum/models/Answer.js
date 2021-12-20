var mongoose = require("mongoose")
var Schema = mongoose.Schema;

var answerSchema = new Schema({
    text:{ type: String},
    author:{ type: Schema.Types.ObjectId,required: true, ref: "User" },
    question:{ type: Schema.Types.ObjectId, ref: "Question" },
},{timestamps:true})


module.exports = mongoose.model("Answer",answerSchema)