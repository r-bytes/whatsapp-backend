// importing
import express from "express";
import mongoose from "mongoose";
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

// app config
const app = express()
const port = process.env.PORT || 9000

// middleware

// DB config
let connectionUrl = `mongodb+srv://${process.env.REACT_APP_MONGO_DB}:${process.env.REACT_APP_MONGO_PASSWORD}@cluster0.vxakqit.mongodb.net/?retryWrites=true&w=majority`
console.log(connectionUrl)

// ??

// API routes
app.get("/", (req, res) => res.status(200).send("hello friend.."))
// listener
app.listen(port, () => console.log(`Listening on localhost:${port}`))