const { MessageEmbed, Client, Message } = require("discord.js");
const db = require("../../models/inv");
const items = require("../../models/items"); 

module.exports = {
    name: "hunt",
    description: "take your pet for a hunting adventure",
    cooldown: 5000,

    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */

    run: async(client, message, args) => {
        const coins = Math.floor(Math.random() * 200);
        const bal = await client.bal(message.author.id);
        if(bal < coins) return message.reply(`:x: You do not have enough coins to hunt`);        

        const item = items.find(v => v.val.toLowerCase() === "collar").name;

        function rand() {
            const num = Math.floor(Math.random() * 2);
            return num === 1;
        };

        db.findOne({ guild: message.guild.id, user: message.author.id }, async(err, data) => {
            if(err) throw err;
            if(!data){
                message.reply(":x: You don't own any collars. Purchase some at `-shop`");
            } else {
                const has = Object.keys(data.inv).includes(item);
                if(data.inv[item] < 1) return message.reply(":x: You don't own any collars. Purchase some at `-shop`")
                if(!has){
                    message.reply(":x: You don't own any collars. Purchase some at `-shop`");
                } else {
                    data.inv[item]--
                    if(rand() === true){
                        message.reply(`You went hunting with your pet and found **⍟ ${coins}**`);
                        await client.add(message.author.id, coins);
                    } else {
                        message.reply(`Ouch! Your dog met with an accident and you lost **⍟ ${coins}**`);
                        await client.remove(message.author.id, coins);
                    }
                }
                await db.findOneAndUpdate({ guild: message.guild.id, user: message.author.id }, data);
            }
        })
    }
}