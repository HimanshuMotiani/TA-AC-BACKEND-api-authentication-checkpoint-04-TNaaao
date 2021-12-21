var mongoose = require("mongoose")
var Schema = mongoose.Schema;

var questionSchema = new Schema({
    title:{ type: String, required: true},
    slug: { type: String,required: true },
    description:String,
    tagList:[String],
    author:{ type: Schema.Types.ObjectId,required: true, ref: "User" },
    answer:[{ type: Schema.Types.ObjectId,required: true, ref: "Answer" }],
    comments: [{ type: mongoose.Types.ObjectId, ref: "Comment" }],
},{timestamps:true})


module.exports = mongoose.model("Question",questionSchema)