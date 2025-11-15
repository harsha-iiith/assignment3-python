import mongoose from "mongoose"
const querySchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true
  },
  class:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Class",
    required:true
  },
  queryText: {
    type: String,
    required: true
  },
  status:{
    type:String,
    enum:['Unanswered','Answered'],
    default:'Unanswered'
  },
    isImportant: {
    type: Boolean,
    default: false
  }

},{timestamps : true})

export const Query = mongoose.model(
  'Query',
  querySchema
);

