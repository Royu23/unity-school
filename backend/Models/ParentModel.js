const mongoose=require("mongoose");
const ParentSchema=mongoose.Schema({
    email:{
        type:String
    },
    name:{
        type:String,
        required:true
    },
    city:{
        type:String
    },
    pin:{
        type:String
    },
    phoneNumber:{
        type:Number
    },  

})
module.exports=mongoose.model("parent",ParentSchema)