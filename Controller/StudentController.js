const StudentModel=require("../Models/StudentsModel");


const createStudent=async(req,res)=>{
    console.log(req.body,"req")
     const {per,age,gender,standard,division,address,pincode,parentId}=req.body; 

   if(!per || !parentId){
      res.send({
        message:"invalid name or parentid"
      })
   }

 try{
        const newStudent=new StudentModel({  //storing data to db
           Name:per,
           Age:age, 
           Gender:gender,
          Standard:standard,
          Division:division,
          Address:address,
           Pincode:pincode,
           parentId: parentId,
            
        });
        await newStudent.save();
        console.log(newStudent,"name")
        const resData={
            studentname:newStudent.Name
        }
        console.log(resData,"data");               
        res.send({
            message:"Student added successfully",
            data:resData

        })

    }catch(er){
        console.log("error",er);
    }
};  


//get data from db 
const getStudents=async(req,res)=>{
    try{
        const StudentData=await StudentModel.find().populate("parent");
        res.send({
            message:"student data fetched successfully",
            data:StudentData
    })
    }catch(error){
        res.send({
            message:"Error",
        })
        console.log(error,"error");
    }
    
};

//get particular data with id
const getStudentById=async(req,res)=>{
    try{
        const id=req.params.studentid;

        const Student=await StudentModel.findById(id);
        if(!Student){
            res.send({
                message:"student data not available"
            })
        }
        res.send({
            message:"student datafetched successfully",
            data:Student
        })
    }catch(error){
        res.send({
            message:"Error",
        })
        console.log(error,"error occ");
    }
};



//update
const updateStudent=async(req,res)=>{
    const {name,age,gender,address,pincode,guardian,guardian_phonenumber,standard,division}=req.body; 
    try{
       const id=req.params.studentid;
       const isStudentAvailable=await StudentModel.findById(id).populate("parent");
       if(!isStudentAvailable){
        res.send({
            message:"Student not available"
        })
       }

       const updateStudent=await StudentModel.findByIdAndUpdate(
        id,
        req.body,
        {new:true}
    );
    res.send({
        message:"updated student data",
        data:updateStudent
    })
    }catch(error){
   res.send({
    message:"Not updated"
   })
    }};
//delete
const deleteStudent=async(req,res)=>{
  const id=req.params.studentid;
    const StudentAvailable=await StudentModel.findById(id); //or  await TeacherModel.deleteOne({_id:id});
    if(!StudentAvailable){
        res.send({
            message:"No Student"
        })
    }
   await StudentModel.findByIdAndDelete(id);
   res.send({
    message:"Student data deleted successfully"
   })
}

module.exports={createStudent,getStudentById,getStudents,deleteStudent,updateStudent}