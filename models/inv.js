const { model, Schema } = require("mongoose");

module.exports = model(
    "inventory",
    new Schema({
        guild: String,
        user: String,
        inv: Object
    })
)