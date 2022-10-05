// importing
import express from "express";
import mongoose from "mongoose";
import Messages from "./dbMessages.js"
import Pusher from "pusher"
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

// app config
const app = express()
const port = process.env.PORT || 9000

const pusher = new Pusher({
    appId: process.env.REACT_APP_PUSHER_APPID,
    key: process.env.REACT_APP_PUSHER_KEY,
    secret: process.env.REACT_APP_PUSHER_SECRET,
    cluster: process.env.REACT_APP_PUSHER_CLUSTER,
    useTLS: process.env.REACT_APP_PUSHER_TLS
});

const db = mongoose.connection
db.once("open", () => {
    console.log("DB connected!")
    const msgCollection = db.collection("messagecontents")
    const changeStream = msgCollection.watch()

    changeStream.on("change", (change) => {
        console.log(change)

        if (change.operationType === "insert") {
            const messageDetails = change.fullDocument

            pusher.trigger("messages", "inserted", {
                name: messageDetails.name,
                message: messageDetails.message
            });

        } else {
            console.log("Error triggering Pusher")
        }
    })
})

// middleware
app.use(express.json())

// DB config
let connectionUrl = `mongodb+srv://${process.env.REACT_APP_MONGO_DB}:${process.env.REACT_APP_MONGO_PASSWORD}@cluster0.vxakqit.mongodb.net/whatsappDB?retryWrites=true&w=majority`
mongoose.connect(connectionUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

// ??

// API routes
app.get("/", (req, res) => res.status(200).send("hello friend.."))
app.post("/api/v1/messages/new", (req, res) => {
    const dbMessage = req.body

    Messages.create(dbMessage, (err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(201).send(`New message created \n ${data}`)
        }
    })
})
app.get("/api/v1/messages/sync", (req, res) => {
    Messages.find((err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(200).send(data)
        }
    })
})

// listener
app.listen(port, () => console.log(`Listening on localhost:${port}`))