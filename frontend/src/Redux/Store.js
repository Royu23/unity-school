import { configureStore } from "@reduxjs/toolkit";
import TeacherReducer from "./Slices/TeacherSlice";    //whole TeacherSlice will be imported irrespective of name(Teacherreducer)
 
const store=configureStore({
    reducer:{
        teacher:TeacherReducer
       
    }
});
export default store;