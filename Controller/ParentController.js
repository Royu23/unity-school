const ParentModel=require("../Models/ParentModel")
//storing post data  to db
const CreateParent=async(req,res)=>{
    console.log("api called");
    const{email,name,city,phoneNumber}=req.body;
  
    try{
        const newParent= new ParentModel({
            email,
            name,
            city:city,
            phoneNumber:phoneNumber
        })  
        await newParent.save();
        const resData={
            Name:newParent.name
        }
        console.log(resData,"res")
        res.send({
            message:"",
            data:resData
        })
    }
    catch(error){
        console.log("error",error)
    }
};
//get data from db
const getParents=async(req,res)=>{
  try{
    const Parentdata=await ParentModel.find();
    res.send({
        message:"Parent data fetched succesfully",
        data:Parentdata
    })
    }catch(error){
        res.send({
      message:"Error",
    })
        console.log(error,"error occ");
    }
};

//get particular data with id

const getParentById=async(req,res)=>{
    try{
        const id=req.params.parentsid;

        const Parent=await ParentModel.findById(id);
        if(!Parent){
            res.send({
                message:"data not available"
            })
        }
        res.send({
            message:"Parent data added successfully",
            data:Parent
        })
    }catch(error){
        res.send({
            message:"error",
        })
        console.log(error,"error")
    }
};
// update
const updateParent=async(req,res)=>{
const {name,email,city,phoneNumber}=req.body;
try{
    const id=req.params.parentid;
    const addedparent=await ParentModel.findById(id);
    if(!addedparent){
        res.send({
            message:"parent not added"
        })
    }
    const updateParent=await ParentModel.findByIdAndUpdate(
        id,
        req.body,
        {new:true}
    );
    res.send({
        message:"updated parent data",
        data:updateParent
    })
}  catch(error){
    res.send({
        message:"not updated"
    })
}};

//delete
const deleteParent=async(req,res)=>{
    const id=req.params.parentid;
    const Parentadded=await ParentModel.findById(id);
    if(!parentadded){
        res.send({
            message:"parent not added"
        })
        await ParentModel.findByIdAndDelete(id);
        res.send({
            message:"deleted successfully"
        })
    }
}

module.exports={CreateParent,getParents,getParentById,updateParent,deleteParent}