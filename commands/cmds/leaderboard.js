const { Message, Client, Collection, MessageEmbed } = require("discord.js");

module.exports = {
    name: "leaderboard",
    aliases: ["top", "lb"],
    description: "shows top 10 people with highest currency in the server",

    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async(client, message, args) => {
        const collection = new Collection();

        await Promise.all(
            message.guild.members.cache.map(async(member) => {
                const Id = member.id;
                const balance = await client.bal(Id);
                return balance !== 0 ? collection.set(Id, {
                    Id,
                    balance,
                }) : null;
            })
        );

        const data = collection.sort((x, y) => y.balance - x.balance).first(10);
        const lbEmbed = new MessageEmbed()
        .setTitle(`${message.guild.name}'s leaderboard`)
        .setThumbnail(message.guild.iconURL({ dynamic: true }))
        .setDescription(`${
            data
            .map((v, i) => {
                return `\`${i + 1}.\` <@!${client.users.cache.get(v.Id).id}>: **⍟ ${v.balance}**`
            })
            .join("\n")
        }`)
        .setFooter(`Requested by ${message.author.tag}`)
        .setColor("WHITE")
        
        return message.channel.send({ embeds: [lbEmbed] })
    }
}