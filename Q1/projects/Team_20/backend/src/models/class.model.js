import mongoose from "mongoose"
const classSchema = new mongoose.Schema({
  title:{
    type:String,
    required:true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true
  },
  accessCode: {
    type: String
  },
  status: {
      type: String,
      enum: [ 'active', 'notActive'],
      default:'active'
  }
},
  {timestamps : true}
);

classSchema.methods.generateAccessCode= function() {
    var result           = '';
    var characters       ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < 6; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export const Class = mongoose.model(
  'Class',
  classSchema
);

