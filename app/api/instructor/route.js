import { connectMongoDB } from '@/lib/mongodb';
import Instructor from '@/models/instructorSchema';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { instructorNo, email, password } = await request.json();

        const hashedPassword = await bcrypt.hash(password, 10);

        await connectMongoDB();
        await Instructor.create({ instructorNo, email, password: hashedPassword, role: 'instructor' });

        return NextResponse.json({ message: "Instructor created successfully" }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "An error occurred while creating instructor" }, { status: 500 });
    }
}

export async function GET() {
    try {
        await connectMongoDB();

        const instructors = await Instructor.find();

        return NextResponse.json(instructors, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "An error occurred while fetching instructors" }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const { id, instructorNo, email, password } = await request.json();
        
        await connectMongoDB();

        const passwordChangeNeeded = await isPasswordChange(id, password);

        const updateData = { instructorNo, email };
        if (passwordChangeNeeded) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const updateInstructor = await Instructor.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updateInstructor) {
            return NextResponse.json({ message: "Instructor not found!" }, { status: 404 });
        }

        return NextResponse.json({ message: "Instructor updated successfully", updateInstructor }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "An error occurred while updating the instructor", error: error.message }, { status: 500 });
    }
}

async function isPasswordChange(id, newPassword) {

    const instructor = await Instructor.findById(id);
    if (!instructor) {
        throw new Error("Instructor not found");
    }

    const isSamePassword = await bcrypt.compare(newPassword, instructor.password);
    return !isSamePassword;
}