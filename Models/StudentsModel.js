const mongoose=require("mongoose");
const StudentSchema=mongoose.Schema({
    Name:{
      type:String
    },
    Age:{
       type:String
    },
    Gender:{
      type:String
    },
    Standard:{
        type:Number
    },
    Division:{
        type:String
    },
  
    Address:{
        type:String
    },
    Pincode:{
      type:String
    },
    parentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"parent",
        required:true,
    },
},
{
    Timestamp:true
},
)
module.exports=mongoose.model("Students",StudentSchema);

