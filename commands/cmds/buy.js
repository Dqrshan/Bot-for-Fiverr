const { MessageEmbed, Client, Message } = require("discord.js");
const db = require("../../models/inv");
const pet = require("../../models/db");
const items = require("../../models/items");

module.exports = {
    name: "buy",
    description: "buy an item from the shop",
    cooldown: 5000,
    usage: "<item>",
    example: "food",

    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */

    run: async(client, message, args) => {

         

        if(!args[0]) return /** */;
        const buy = args[0].toLowerCase();

        const valid = !!items.find(v => v.val.toLowerCase() === buy);
        if(!valid) return /** */;

        const item = items.find(v => v.val.toLowerCase() === buy).name;

        const price = items.find(v => v.val.toLowerCase() === buy).price;

        const bal = await client.bal(message.author.id);
        if(bal < price) return message.reply(`You need **⍟ ${price - bal}** more to buy this item!`);

        const p = {
            guild: message.guild.id,
            user: message.author.id
        };

        db.findOne(p, async(err, data) => {
            if(err) throw err;
            if(data){
                const has = Object.keys(data.inv).includes(item);
                if(!has){
                    data.inv[item] = 1;
                } else {
                    data.inv[item]++
                }
                await db.findOneAndUpdate(p, data);
            } else {
                new db({
                    guild: message.guild.id,
                    user: message.author.id,
                    inv: {
                        [item]: 1
                    }
                }).save();
            }
            client.remove(message.author.id, price);
            message.reply(`You have bought **${item}** for **⍟ ${price}**.`)
        })
    }
}