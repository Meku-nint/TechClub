import mongoose from "mongoose";
const Schema = mongoose.Schema;
const userSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type:String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})
const AllowSchema=new mongoose.Schema({
    studentId: {
        type: String,
        required: true
    }
})
const EventSchema=new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    address:{
        type: String,
        required: false
    }
})
const User = mongoose.model('User', userSchema);
const AllowStudent=mongoose.model('AllowStudent',AllowSchema);
export default {User,AllowStudent}