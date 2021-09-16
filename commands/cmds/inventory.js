const { MessageEmbed, Client, Message, MessageActionRow, MessageButton } = require('discord.js');
const db = require("../../models/db");
const inv = require("../../models/inv");

module.exports = {
    name: 'inventory',
    aliases: ["backpack", "inv"],
    description: 'shows the inventory of a user or yourself',
    cooldown: 5000,
    usage: "[user]",
    example: "Nin@1111",

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async(client, message, args) => {
        message.channel.sendTyping();
        const member = message.mentions.members.first()
            || message.guild.members.cache.get(args[0])
            || message.member;
        const data = await db.findOne({ id: member.user.id });
        if(!data) return message.reply(`:x: **${member.user.tag}** doesn't own a pet!`);

        const embed = new MessageEmbed()
        .setAuthor(`${member.user.tag}'s profile`, member.user.displayAvatarURL())
        .setDescription(`${data.dog ? `Pet: **${data.dog}**` : `No Pet`}`)
        .setFooter(`Total balance: ⍟ ${await client.bal(member.id)}`)
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .setColor("WHITE")

        inv.findOne({ guild: message.guild.id, user: member.user.id }, async(err, data) => {
            if(err) throw err;
            if(!data) {
               embed.addField("Inventory", "Empty")
               return message.reply({ embeds: [embed] })
            }
            const map = Object.keys(data.inv).map((key) => {
                return `${key}: ${data.inv[key]}`
            }).join("\n")
            embed.addField("Inventory", `${map}`, true)
            return message.reply({ embeds: [embed] })
        });

    }
}