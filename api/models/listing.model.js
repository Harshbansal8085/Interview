import mongoose from "mongoose";
const listingSchema  = new mongoose.Schema({
    companyName: {
        type: String,
        required: true
      },
      jobTitle: {
        type: String,
        required: true
      },
      intervieweeName: {
        type: String,
        required: true
    },
      interviewDate: {
        type: Date,
        required: true
      },
      type:{
        type:String,
        required:true,
      },
      description:{
        type:String,
        required:true
    },
      overallExperience: {
        type: String,
        required: true
      },
      tips: {
        type: String,
        required: false
      },
      ctc:{
        type:Number,
        required:true
      },
      base:{
        type:Number,
        required:true
      },
      rounds:{
        type:Number,
        required:true
      },
      selected: {
        type: Boolean,
        required: true
      },
      imageUrls:{
        type:Array,
        required:true,
    },
    userRef:{
        type:String,
        required:true,
    },
   
  
    },{timestamps:true}
);

const Listing = mongoose.model('Listing',listingSchema)
export default Listing