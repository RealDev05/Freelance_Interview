import { User } from "../../../util/mongodb/models"
import jwt from "jsonwebtoken"
import mongooseConnect from "../../../util/mongodb/mongooseConnect";

var bcrypt = require('bcryptjs');

export async function POST(req, res) {
    await mongooseConnect();
    try {
        const { username, firstname, lastname, mobile, email, password } = await req.json();
        const hashedPassword = await bcrypt.hashSync(password, bcrypt.genSaltSync(10));//10
        const user = new User({ username, firstname, lastname, mobile, email, password: hashedPassword, role: "Student" });
        await user.save();
        const token = jwt.sign(
            { username: user.username, role: user.role },
            process.env.NEXT_PUBLIC_SECRET,
            { expiresIn: '30d' }
        );

        return new Response(JSON.stringify({ token }), { status: 200 });
    } catch (err) {
        console.error(err); // Log the error for debugging

        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}