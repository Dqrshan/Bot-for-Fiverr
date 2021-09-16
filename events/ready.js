const client = require('../index');
const mongoose = require("mongoose")
const { mongo, prefix } = require("../config.json");

client.on('ready', async () => {
    console.log(`${client.user.username} ✔`);
    client.user.setActivity(`${prefix}help`, { type: 'LISTENING' });

    // mongo uri
    await mongoose.connect(process.env["MONGO"], {
        useUnifiedTopology: true,
        useNewURLParser: true
    }).then(() => console.log("Connected mongodb"))
});