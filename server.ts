import app from "./app";
import connectDB from "./connectDB";

const port = 8080;

connectDB();

app.listen(port, () => {
    console.log("Server running on port " + port);
});
