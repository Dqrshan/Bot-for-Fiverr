const { MessageEmbed, Client, Message } = require("discord.js");
const db = require("../../models/db");

module.exports = {
    name: "set",
    description: "sets a user's balance",
    cooldown: 2000,
    usage: "<user> <amount>",
    example: "@Nin#1111 6969",

    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */

    run: async(client, message, args) => {
        if(!message.member.permissions.has("ADMINISTRATOR")) return message.reply("Missing `ADMINISTRATOR` Permission");
        const member = message.mentions.members.first()
            || message.guild.members.cache.get(args[0]);
        if(!member) return message.reply(":x: Wrong Usage. `-set @user 100`");
        let data = await db.findOne({ id: member.id });
        if(data){
            data.points = parseInt(args[1]);
            data.save()
            message.reply(`Set ${member.user.tag}'s balance to \`${args[1]}\``)
        } 
        if(!data){
            data = new db({
                id: member.id,
                points: parseInt(args[1])
            })
            data.save()
            message.reply(`Set ${member.user.tag}'s balance to \`${args[1]}\``)
        }
    }
}