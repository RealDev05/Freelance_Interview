import { User } from "../../../util/mongodb/models"
import jwt from "jsonwebtoken"
import mongooseConnect from "../../../util/mongodb/mongooseConnect";

var bcrypt = require('bcryptjs');

export async function POST(req, res) {
    await mongooseConnect();
    try {
        const { username, password } = await req.json();
        const user = await User.findOne({ username });

        if (user == null || user == undefined) {
            return new Response(JSON.stringify({ error: "User does not Exist" }), { status: 400 });
        }
        if (!await bcrypt.compare(password, user.password)) {
            return new Response(JSON.stringify({ error: "Wrong Credentials" }), { status: 400 });;
        }
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