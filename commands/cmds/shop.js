const { MessageEmbed, Client, Message } = require("discord.js");
const db = require("../../models/db");
const items = require("../../models/items");

module.exports = {
    name: "shop",
    description: "the dog shop",
    cooldown: 5000,

    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */

    run: async(client, message, args) => {
        if(items.length === 0) return message.reply(":x: The shop is empty");
        
        const shopEmbed = new MessageEmbed()
        .setTitle("Dog Shop")
        .setFooter(`Your balance: ⍟ ${await client.bal(message.author.id)}`)
        .setThumbnail(message.guild.iconURL({ dynamic: true }))
        .setColor("WHITE")

        items.map((v, i) => {
            shopEmbed.addField(`${i + 1}. ⍟ ${v.price}`, `**${v.name}**\n${v.info}\n> \`-buy ${v.val}\``)
        });

        return message.reply({ embeds: [shopEmbed] })
    }
}