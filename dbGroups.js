import mongoose from "mongoose";

const groupSchema = mongoose.Schema({
    name: String
})

export default mongoose.model("groupcontents", groupSchema)