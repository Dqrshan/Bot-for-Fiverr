const { Client, Collection } = require('discord.js');
const { token } = require('./config.json');
const { readdirSync } = require('fs');

const client = new Client({
    intents: 32767,
    allowedMentions: {
        repliedUser: false
    }
});
module.exports = client;

client.commands = new Collection();
client.aliases = new Collection();
client.slashCommands = new Collection();
client.cooldown = new Collection();

client.categories = readdirSync(`./handlers/`);
['command', 'event', 'slashCommand'].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});

// currency functions
const mongoose = require('mongoose');
const schema = require("./models/db");

client.bal = (id) => new Promise(async ful => {
    const data = await schema.findOne({ id });
    if(!data) return ful(0);
    ful(data.points);
});

client.add = (id, points) => {
    schema.findOne({ id }, async(err, data) => {
        if(err) throw err;
        if(data){
            data.points += points;
        } else {
            data = new schema({ id, points })
        }
        data.save();
    })
}

client.remove = (id, points) => {
    schema.findOne({ id }, async(err, data) => {
        if(err) throw err;
        if(data){
            data.points -= points;
        } else {
            data = new schema({ id, points: -points })
        }
        data.save();
    })
}

client.login(token);