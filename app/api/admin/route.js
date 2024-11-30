import { connectMongoDB } from '@/lib/mongodb';
import Admin from '@/models/adminSchema';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        const hashedPassword = await bcrypt.hash(password, 10);

        await connectMongoDB();
        await Admin.create({ email, password: hashedPassword, role: 'admin' });

        return NextResponse.json({ message: "Admin created successfully" }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "An error occurred while creating admin" }, { status: 500 });
    }
}

export async function GET() {
    try {
        await connectMongoDB();

        const admins = await Admin.find();

        return NextResponse.json(admins, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "An error occurred while fetching admins" }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const { id,  email, password } = await request.json();
        
        await connectMongoDB();

        const passwordChangeNeeded = await isPasswordChange(id, password);

        const updateData = { email };
        if (passwordChangeNeeded) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const updateAdmin = await Admin.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updateAdmin) {
            return NextResponse.json({ message: "Admin not found!" }, { status: 404 });
        }

        return NextResponse.json({ message: "Admin updated successfully", updateAdmin }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "An error occurred while updating the admin", error: error.message }, { status: 500 });
    }
}

async function isPasswordChange(id, newPassword) {

    const admin = await Admin.findById(id);
    if (!admin) {
        throw new Error("Admin not found");
    }

    const isSamePassword = await bcrypt.compare(newPassword, admin.password);
    return !isSamePassword;
}