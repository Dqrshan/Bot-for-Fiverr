const { MessageEmbed, Client, Message } = require("discord.js");
const db = require("../../models/db");

module.exports = {
    name: "bal",
    aliases: ["balance"],
    description: "shows ur balance or a user's balance",
    cooldown: 5000,
    usage: "[user]",
    example: "@Nin#1111",

    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */

    run: async(client, message, args) => {
        message.channel.sendTyping();
        const member = message.mentions.members.first()
            || message.guild.members.cache.get(args[0])
            || message.member;
        const bal = await client.bal(member.id);
        if(member.id === message.member.id){
            message.reply(`Your Balance: **⍟ ${bal}**.`);
        } else {
            message.reply(`**${member.user.tag}**'s Balance: **⍟ ${bal}**.`)
        }
    }
}