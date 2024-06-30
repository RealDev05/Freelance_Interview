import jwt from "jsonwebtoken"

export async function POST(req, res) {
    try {
        const { token } = await req.json();

        const response = jwt.verify(token, process.env.NEXT_PUBLIC_SECRET, (err, data) => {
            if (err) return { auth: false, message: "Invalid Login" }
            if (data.exp - data.iat < 0) {
                return { auth: false, message: "Session Epired" }
            }
            return { auth: true, data };
        });



        return new Response(JSON.stringify(response), { status: 200 });
    } catch (err) {
        console.error(err); // Log the error for debugging

        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}