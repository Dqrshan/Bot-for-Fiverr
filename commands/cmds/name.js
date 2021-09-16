const { MessageEmbed, Client, Message } = require("discord.js");
const mainDB = require("../../models/db");
const invDB  = require("../../models/inv");
const items = require("../../models/items");

module.exports = {
    name: "name",
    description: "rename your dog using name tags",
    cooldown: 5000,
    usage: "<new-pet-name>",
    example: "Doggie",

    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */

    run: async(client, message, args) => {
        const name = args.join(" ");
        if(!name) return message.reply(":x: Wrong Usage. `-name <new-pet-name>`");

        const item = items.find(v => v.val.toLowerCase() === "tag").name;
        const p = {
            guild: message.guild.id,
            user: message.author.id
        };

        invDB.findOne(p, async(err, data) => {
            if(err) throw err;
            if(data){
                const has = Object.keys(data.inv).includes(item);
                if(data.inv[item] < 1) return message.reply(":x: You don't have any name tags")
                if(!has){
                    message.reply(`:x: You don't own any name tag. Purchase one at \`-shop\``);
                } else {
                    data.inv[item]--
                    mainDB.findOne({ id: message.author.id }, async(err, data) => {
                        if(err) throw err;
                        if(data){
                            data.dog = name
                            message.reply(`You have renamed your dog to **${name}**`)
                        } else {
                            message.reply(":x: You don't own any pet");
                        }
                        await mainDB.findOneAndUpdate({ id: message.author.id }, data);
                    });
                }
                await invDB.findOneAndUpdate(p, data);
            }
        })
    }
}