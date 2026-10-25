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
const StudentSlice=createSlice({
name:"Students",
initialState,
reducers:{
         setError:(state,action)=>{
            state.errors=action.payload;
         },
         setStudentData:(state,action)=>{
            state.studentData=action.payload;
         },
         setMessage:(state,action)=>{
           state.message=action.payload;
         },
         setOneStudentData:(state,action)=>{
            state.OneStudentDetailsData=action.payload;
         },
         setAddNewStudentToDb:(state,action)=>{
            state.addNewStudentToDb=action.payload;
         },
         setPostEditedStudentData:(state,action)=>{
            state.postEditedStudentDetails=action.payload;
         },
         setDeleteStudent:(state,action)=>{
            state.deleteStudent=action.payload;
         }

}
});


//manipulations
//fetch all students

export const fetchStudentData=()=>async(dispatch)=>{
    try{
        const response=await axios.get(`${baseUrl}/student`)
        console.log(response.data,"response checked at student slice");
    
        if(response.data){
            const {data,message}=response.data;
            dispatch(setStudentData(data));
            dispatch(setMessage(message));
        }
    }
    catch(error){
        dispatch(setError(error));
    }
}

//fetch one student

export const fetchOneStudentDetails=(id)=async(dispatch)=>{
    try{
        console.log(id,"id");
        const response=await axios.get(`${baseUrl}/student/${id}`)
        if(response.data){
            dispatch(setOneStudentData(response.data.data));
        }
    }
    catch(error){
        dispatch(setError(error));
    }
}

//add new student

export const addNewStudentToDb={formData}=async(dispatch)=>{
    try{
        const response=await axios.post(`${baseUrl}/student`,formData)
    }
    catch(error){
        dispatch(setError(error));
    }
}