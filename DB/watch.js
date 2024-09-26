import { MongoClient } from "mongodb";

async function watchNotification(io) {
    let MDURL = process.env.MDURL;

    // Make sure MDURL is defined
    if (!MDURL) {
        console.error("MongoDB connection string is not defined.");
        process.exit(1); // Exit if the connection string is missing
    }
    // Create a new MongoClient
    const client = new MongoClient(MDURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    // Connect to the MongoDB cluster
    await client.connect();
    console.log("Connected to MongoDB!");

    let db = client.db("ftms");
    let notification = db.collection("notification");
    console.log("connected to mongodb database for watching the streams");
    let changeStreams = notification.watch();

        // lets listen to change event for updating any kind of change
        changeStreams.on("change", (change) => {
            console.log("listening to change stream on database");
            if (change.operationType === "insert") {
                let notification = change?.fullDocument;
                console.log(notification, "data received from the server");
                io.emit("notification", notification);
            }
        });
}

export default watchNotification;
