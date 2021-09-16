const { stripIndents } = require("common-tags");
const { Client, Message, Guild, MessageEmbed } = require("discord.js");
const client = require("../index");

/**
 * @param {Client} client
 * @param {Message} message
 * @param {Guild} guild
 */

client.on("guildCreate", async(guild) => {
    const channel = guild.channels.cache.filter(c => c.type === "GUILD_TEXT").first();

    const embed = new MessageEmbed()
    .setTitle("Hey There!")
    .setColor("WHITE")
    .setDescription(stripIndents`
    Thanks for inviting me! My default prefix is \`-\`.
    I'm an economy bot mainly based on dogs.
    For my list of commands, use \`-help\`.

    > **To start off-**
    > Start your journey with the command \`-start\`.
    > Use \`-help economy\` for all of my dog commands.
    > Bored? Use \`-image\` for some cool doggy images!

    My Developer: [Nin#1111](https://discord.com/users/838620835282812969)
    `)
    .setThumbnail(client.user.displayAvatarURL())

    await channel.send({ embeds: [embed] });
})
