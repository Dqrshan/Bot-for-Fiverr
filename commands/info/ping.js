const { MessageEmbed, Client, Message, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: 'ping',
    description: 'latency of the bot to discord',
    cooldown: 2000,

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async(client, message, args) => {
        return message.reply(`Pong! \`${client.ws.ping}\`ms.`)
    }
}