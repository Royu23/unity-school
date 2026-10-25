const mongoose=require("mongoose");

const TeacherSchema=mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
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
    subject:{
        type:String
    },
    standard:{
        type:Number
    },
    password:{
        type:String
    }
},
    {
        Timestamp:true
    },
    
)
module.exports=mongoose.model("Teachers",TeacherSchema);   //Teachers(Database)
