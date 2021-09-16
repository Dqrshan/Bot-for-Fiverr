const fetch = require("node-fetch");
const { Client, Message, MessageEmbed } = require("discord.js"); 

module.exports = {
    name: "image",
    description: "shows a random dog image",
    cooldown: 5000,

    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async(client, message, args) => {
        const embed = new MessageEmbed()
        .setAuthor("Random Dog Image", client.user.displayAvatarURL())
        .setFooter(`Requested by ${message.author.tag}`)
        .setColor('RANDOM');

        fetch("https://dog.ceo/api/breeds/image/random")
        .then(res => res.json())
        .then(b => {
            if(!b) {
                embed.setImage(null)
                message.channel.send({
                    embeds: [embed]
                })
            }

            embed.setImage(b.message);
            message.channel.send({
                embeds: [embed]
            })
        });
        
    }
}