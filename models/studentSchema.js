import mongoose, { models, Schema } from "mongoose";

const studentSchema = new Schema({
    studentNo: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: { 
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "student"
    }
}, { timestamps: true })


const Student = models.Student || mongoose.model("Student", studentSchema)

export default Student