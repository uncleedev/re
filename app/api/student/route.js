import { connectMongoDB } from '@/lib/mongodb';
import Student from '@/models/studentSchema';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { studentNo, email, password } = await request.json();

        const hashedPassword = await bcrypt.hash(password, 10);

        await connectMongoDB();
        await Student.create({ studentNo, email, password: hashedPassword, role: 'student' });

        return NextResponse.json({ message: "Student created successfully" }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "An error occurred while creating student" }, { status: 500 });
    }
}

export async function GET() {
    try {
        await connectMongoDB();

        const students = await Student.find();

        return NextResponse.json(students, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "An error occurred while fetching students" }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const { id, studentNo, email, password } = await request.json();
        
        await connectMongoDB();

        const passwordChangeNeeded = await isPasswordChange(id, password);

        const updateData = { studentNo, email };
        if (passwordChangeNeeded) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const updateStudent = await Student.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updateStudent) {
            return NextResponse.json({ message: "Student not found!" }, { status: 404 });
        }

        return NextResponse.json({ message: "Student updated successfully", updateStudent }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "An error occurred while updating the student", error: error.message }, { status: 500 });
    }
}

async function isPasswordChange(id, newPassword) {

    const student = await Student.findById(id);
    if (!student) {
        throw new Error("Student not found");
    }

    const isSamePassword = await bcrypt.compare(newPassword, student.password);
    return !isSamePassword;
}