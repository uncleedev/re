import mongoose, { models, Schema } from "mongoose";

const instructorSchema = new Schema({
    instructorNo: {
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
        default: "instructor"
    }
}, { timestamps: true })


const Instructor = models.Instructor || mongoose.model("Instructor", instructorSchema)

export default Instructor