import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setError, setMessage } from "./TeacherSlice";

const baseUrl=process.env.REACT_API_SCHOOL

const initialState={
    errors:null,
    studentData:[],
    message:null,
    oneStudent:null
}
const ParentSlice=createSlice({
    name:"parents",
    initialState,
    reducers:{
        setError:(state,action)=>{
            state.errors=action.payload;
        },
        setStudentData:(state,action)=>{
           state.parentData=action.payload;
        },
        setMessage:(state,action)=>{
            state.message=action.payload;
        },
        setOneparentData:(state,action)=>{
          state.OneparentDetailsData=action.payload;
        },
        setAddNewParentToDb:(state,action)=>{
            state.addNewparentToDb=action.payload;
        },
        setPostEditedParentData:(state,action)=>{
            state.postEditedStudentDetails=action.payload;
        },
        setDeleteParent:(state,action)=>{
            state.deleteParent=action.payload;
        }
    }
});

//fetch one parent

export const fetchhOneParentDetails=(id)=async(dispatch)=>{
    try{
        console.log(id,"id");
        const response=await axios.get(`${baseUrl}/parent/${id}`)
        if(response.data){
            dispatch(setOneparentData(response.data.data));
        }
    }
    catch(error){
        dispatch(setError(error));
    }
}

//add new parent
export const addNewparentToDb={FormData}=async(dispatch)=>{
    try{
        const response=await axios.post(`${baseUrl}/parent`,FormData)
    }
    catch(error){
        dispatch(setError(error));
    }
}
//fetch parent data for login
// export const ParentLogin