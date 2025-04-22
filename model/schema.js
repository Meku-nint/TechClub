import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true // optional: ensures uniqueness
    },
    username: {
        type: String,
        required: true,
        unique: true // optional: ensures uniqueness
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String,
        default:"token",
        required: false
    }
});

const allowSchema = new mongoose.Schema({
    studentId: {
        type: String,
        required: true,
    }
});

const eventSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    address: {
        type: String,
        default:" ",
        required: false
    }
});
const User = mongoose.models.User || mongoose.model("User", userSchema);
const AllowStudent = mongoose.models.AllowStudent || mongoose.model("AllowStudent", allowSchema);
const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);
export default { User, AllowStudent, Event };