const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const schema = new mongoose.Schema(
    {
        id: Number,
        text: String,
        author: String,
    },
    { versionKey: false, timestamps: true }
);

schema.plugin(AutoIncrement, { id: "logs_seq", inc_field: "id" });

module.exports = mongoose.model("Action", schema);
