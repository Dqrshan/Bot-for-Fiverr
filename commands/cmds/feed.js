const { MessageEmbed, Client, Message } = require("discord.js");
const db = require("../../models/db");
const inv = require("../../models/inv");
const items = require("../../models/items");

module.exports = {
    name: "feed",
    description: "feed your dog with some pet food",
    cooldown: 1000 * 60 * 60 * 12, // 12 hours

    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */

    run: async(client, message, args) => {
        const item = items.find(v => v.val.toLowerCase() === "food").name;

        const data = db.findOne({ id: message.author.id });
        if(!data) return message.reply(":x: You don't own a pet. Use `-start` to start the adventure");

        const p = {
            guild: message.guild.id,
            user: message.author.id
        };

        inv.findOne(p, async(err, data) => {
            if(err) throw err;
            if(data){
                const has = Object.keys(data.inv).includes(item);
                if(data.inv[item] < 1 || !has){
                    message.reply(`:x: You don't have any pet food. Purchase some at \`-shop\``);
                } else {
                    data.inv[item]--
                    await client.add(message.author.id, 500);
                    message.reply(`You fed your dog with **${item}** and earned **⍟ 500**`);
                }
                await inv.findOneAndUpdate(p, data);
            } else {
                message.reply(`:x: You don't have any pet food. Purchase some at \`-shop\``);
            }
        })
    }
}