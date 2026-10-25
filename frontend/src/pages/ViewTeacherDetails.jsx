import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import { fetchOneTeacherDetails } from '../Redux/Slices/TeacherSlice';
import TeacherForm from '../components/TeacherForm';

const ViewTeacherDetails = () => {

  // const accessTesting=useSelector((state)=>state.teacher.message);
// console.log(accessTesting,"testing");
const[editFormVisibility,setEditFormVisibility]=useState(false);
const dispatch=useDispatch();
const oneTeacherDetail=useSelector((store)=>store.teacher.oneTeacherDetailsData);
console.log(oneTeacherDetail,"oneteacher");
    const {teacherid}=useParams();
    console.log(teacherid,"id obtained");
    // const SchoolUrl=process.env.REACT_APP_API_SCHOOL
     //const[teacher,setTEacher]=useState();
      // const[deleteTeacherVariable,setDeleteTeacherFunction]=useState();
        useEffect(()=>{
        dispatch(fetchOneTeacherDetails(teacherid))
         
        },[teacherid]);
       //console.log(teacher,"teacher accessed");

       const EditTeacherDetails=(EditId)=>{
        setEditFormVisibility(true);
        console.log(EditId,"editid")
       }
      
  return (
    <div>
      {editFormVisibility &&(
        <TeacherForm onEditBtnClick={()=>setEditFormVisibility(false)}/>
      )}
         <h1>Teacher Details</h1>

    {oneTeacherDetail ? (

      
      <div>
        <h2>Name: {oneTeacherDetail.data.name}</h2>
        <h2>Class: {oneTeacherDetail.data.standard}</h2>
        <h2>City: {oneTeacherDetail.data.city}</h2>
        <h2>Pincode: {oneTeacherDetail.data.pin}</h2>
        <h2>Phonenumber: {oneTeacherDetail.data.phoneNumber}</h2>
      </div>
    ) : (
      <h2>No teacher</h2>
    )}
    <button onClick={()=>EditTeacherDetails(oneTeacherDetail?._id)}>Edit</button>
    </div>
  )
}

export default ViewTeacherDetails