const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    id: String,
    points: {
        type: Number,
        default: 0,
    },
    dog: String,
})

module.exports = mongoose.model("pet", schema);