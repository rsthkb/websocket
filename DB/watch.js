const { MongoClient } = require("mongodb");

async function watchNotification(io) {
    let client = await MongoClient.connect(process.env.MDURL);
    let db = client.db("ftms");
    let notification = db.collection("notification");

    console.log("connected to mongodb database for watching the streams");
    let changeStreams = notification.watch();

    // lets listen to change event for updating any kind of change
    changeStreams.on("change", (change) => {
        console.log("listening to change stream on database");
        if (change.operationType === "insert") {
            let notification = change?.fullDocument;
            io.to(notification.userId).emit("new_notification", notification);
            console.log("notification send to user", userId);
        }
    });
}

module.exports = watchNotification;
