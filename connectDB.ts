import dotenv from "dotenv";

dotenv.config({ "path": "./.env.development" });

function connectDB() {
    console.log( `Successfully connected to DB` );
}

export default connectDB;