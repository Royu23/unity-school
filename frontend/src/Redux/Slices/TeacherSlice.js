import {createSlice} from "@reduxjs/toolkit";
import axios from "axios";
 
const baseUrl=process.env.REACT_APP_API_SCHOOL
const initialState={ 
        errors:null,
        teacherData:[],        //for all teachers
        message:null,
        oneTeacherDetailsData:null,
        loggedin:false
    }
const TeacherSlice=createSlice({
    name:"Teacher",
    initialState,
    reducers:{                      //like setFunction in useState
         setError:(state,action)=>{
              state.errors=action.payload;
         },
         
            setTeacherData:(state,action)=>{
                state.teacherData=action.payload;
            },
            setMessage:(state,action)=>{
                state.message=action.payload;
            },
            setOneTeacherData:(state,action)=>{
                state.oneTeacherDetailsData=action.payload;
            },
            setAddNewTeacherDb:(state,action)=>{
                state.addNewTeacherToDb=action.payload;
            },  
            setEditedTeacherData:(state,action)=>{
                state.postEditedTeacherDetails=action.payload;
            },
            setLoggedin:(state,action)=>{
                state.loggedin=action.payload;
            },
          

    }
 });
 // fetch teachers              
    export const fetchTeachersData=()=>async(dispatch)=>{
        try{
           const response=await axios.get(`${baseUrl}/teacher`)
           console.log(response.data,"response checked for teacher at teacherSlice");
           
             if(response.data)
               {
                const {data,message}=response.data;
                  dispatch(setTeacherData(data));
                  dispatch(setMessage(message));
                 }
           
        }catch(error){
            dispatch(setError(error));
        }
    }
    export const fetchOneTeacherDetails=(id)=>async(dispatch)=>{
        try {
            console.log(id,"id");
              const response=await axios.get(`${baseUrl}/teacher/${id}`)
              
             if(response.data)
               {
               dispatch(setOneTeacherData(response.data.data));
               }
           
        } catch (error) {
            dispatch(setError(error));  
        }
    }
    export const AddNewTeacherDb=()=>async(dispatch)=>{
        try{
            const response=await axios.post(`${baseUrl}/teacher`)
        }
        catch(error){
            dispatch(setError(error));
        }
    }
    export const postEditedTeacherDetails=({id,formData})=>async(dispatch)=>{
        try{
            console.log(id,"edit id in teacherslice");
            const response=await axios.put(`${baseUrl}/teacher/${id}`,formData)
            if(response.data){
                dispatch(setEditedTeacherData(response.data));
            }
        }
        catch(error){
            dispatch(setError(error));
        }
    }
    export const TeacherLoggedin=(data)=>async(dispatch)=>{
        try{
            console.log(data,"dispatch")
            const response=await axios.post(`${baseUrl}/teacher/login`,data)
            console.log(response,"login response")
            if(response.data.data.accesstoken){
                dispatch(setLoggedin(true));
            }
            const userdata={
                username:response.data.data.name,
                accessToken:response.data.data.accesstoken.token,
                email:response.data.data.email
                }
       localStorage.setItem("userdata",JSON.stringify(userdata));
       console.log(userdata,"success");

        }
        catch(error){
            dispatch(setError(error));
        }
    }

    



 export const{setError,setTeacherData,setMessage,setOneTeacherData,setAddNewTeacherDb,setEditedTeacherData,setTeacherLogin,setLoggedin}=TeacherSlice.actions;
 export default TeacherSlice.reducer;