import { NextResponse } from "next/server";
import { User } from "../../../util/mongodb/models";
import mongooseConnect from "../../../util/mongodb/mongooseConnect";

export async function POST(req, res) {
    const { username } = await req.json();

    mongooseConnect().then(() => { console.log("Connected to DB") });
    return NextResponse.json({ exists: (await User.countDocuments({ username: username })) > 0 });
}