import mongoose from "mongoose";
const Schema = mongoose.Schema;
const adminInfoSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    telegram: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    prove:{
        type:String,
        default:'1221'
    }
})
const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true 
    },
    username: {
        type: String,
        required: true,
        unique: true
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
const attendanceSchema = new mongoose.Schema({
    today: {
        type: Date,
        required: true
    },
    length: {
        type: String,
        required: false,
        default: "30"
    },
    token:{
        type: String,
        required: true,
        default:"token" 
    }
}, { timestamps: true });
const eventSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    }
});
const adminSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})
const UserAttendanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['present', 'absent'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add index for efficient querying
UserAttendanceSchema.index({ userId: 1, date: 1 }, { unique: true });

const Admin=mongoose.models.Admin || mongoose.model("Admin", adminSchema);
const Attendance=mongoose.models.Attendance || mongoose.model("Attendance", attendanceSchema);
const User = mongoose.models.User || mongoose.model("User", userSchema);
const AllowStudent = mongoose.models.AllowStudent || mongoose.model("AllowStudent", allowSchema);
const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);
const AdminInfo = mongoose.models.AdminInfo || mongoose.model("AdminInfo", adminInfoSchema);
const UserAttendance = mongoose.models.UserAttendance || mongoose.model('UserAttendance', UserAttendanceSchema);
export default { User, AllowStudent, Event,Admin,Attendance,AdminInfo,UserAttendance };