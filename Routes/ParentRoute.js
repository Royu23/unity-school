const express=require("express");
const {CreateParent,getParents,getParentById,updateParent,deleteParent,}=require("../Controller/ParentController");
const ParentRouter=express.Router();

ParentRouter.post("/",CreateParent);
ParentRouter.get("/",getParents);
ParentRouter.get("/:parentsid",getParentById);
ParentRouter.put("/:parentid",updateParent);
ParentRouter.delete("/:parentid",deleteParent)

module.exports=ParentRouter;

