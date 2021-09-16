const { MessageEmbed, Client, Message } = require("discord.js");
const db = require("../../models/db");

module.exports = {
    name: "give",
    description: "gives another user your points",
    cooldown: 5000,
    usage: "<user> <amount>",
    example: "@Nin#1111 6969",
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */

    run: async(client, message, args) => {
        
        const member = message.mentions.members.first();
        const amount = args[1];
        if(!member || !amount) return message.reply(`:x: Wrong Usage. \`-give @user 100\``);
        if(isNaN(amount)) return message.react(":x:");
        
        const data = await db.findOne({ id: message.member.id });
        if(data){
            if(data.points < parseInt(amount)) return message.reply(`:x: You don't have enough coins to give!`)
            await client.add(member.id, parseInt(amount));
            client.remove(message.member.id, parseInt(amount));
            message.reply(`You gave **⍟ ${parseInt(amount)}** coins to **${member.user.tag}**`);
        } else {
            return message.reply(`:x: You don't have enough coins to give!`)
        }
    }   
}