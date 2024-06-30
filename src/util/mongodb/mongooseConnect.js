const mongoose = require("mongoose");

export default async function mongooseConnect() {
    await mongoose
        .connect(
            process.env.NEXT_PUBLIC_MONGO_URL, {
        }
        );
}
